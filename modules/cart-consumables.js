;(() => {
  'use strict';
  if (window.__LARX_CART_CONSUMABLES_INIT__) return;
  window.__LARX_CART_CONSUMABLES_INIT__ = true;
  const TAG = '[SM]';

  // ============ 1) Mapa fólií – typy odděleně (bez zdvojování) ============

  // Skupiny: classic100 (30,31,32), grounded100 (36), tough150 (34,35), classic150 (37), classic60 (29), classic180 (33)
  const FOIL_TYPES = {
    classic60:   { match: ["LARX-CF060W050S"] },                                               // 60 W/m² 0.5 m
    classic100:  { match: ["LARX-CF100W050S", "LARX-CF100W080S", "LARX-CF100W100S"] },         // 100 W/m² 0.5/0.8/1.0 m
    grounded100: { match: ["LARX-GF100W050S"] },                                               // 100 W/m² 0.5 m (se zemněním)
    classic150:  { match: ["LARX-GF150W050S"] },                                               // 150 W/m² 0.5 m  (pokud máte jiný kód, uprav zde)
    tough150:    { match: ["LARX-BF150W050S", "LARX-BF150W100S"] },                            // 150 W/m² 0.5/1.0 m (odolná)
    classic180:  { match: ["LARX-CF180W050S"] },                                               // 180 W/m² 0.5 m (počítáme jako "200")
  };

  // ============ 2) Produkty spotřebáku, se kterými hýbeme idempotentně =========
  const CONSUMABLE_CODES = [
    'LARX-WBROWN-25D025L', // FENIX-WBROWN-25D-25L
    'LARX-WBLUE-25D025L',  // FENIX-WBLUE-25D-25L
    'FENIX-WBROWN-15D-25L', // LARX-WBROWN-15D025L
    'FENIX-WBLUE-15D-25L',  // LARX-WBLUE-15D025L
    'LARX-BT005S020L',
    'LARX-CLAMPPLIER001',
    'LARX-CLAMP001X20P',
    'LARX-UF-IZOLEPA',
    'LARX-STAPLES001X50P',
    'LARX-PE-120S2000L',
    'RASTR-100S5000L'
  ];

  // ============ 3) Pomůcky pro košík/akce Shoptetu =============================

  function getCart() {
    try {
      const c = (typeof getShoptetDataLayer === 'function') ? getShoptetDataLayer('cart') : [];
      return Array.isArray(c) ? c : [];
    } catch {
      return [];
    }
  }

  function addToCartSafe(code, amount) {
    if (!amount || amount <= 0) return;
    try {
      if (window.shoptet && shoptet.cartShared && typeof shoptet.cartShared.addToCart === 'function') {
        console.log(TAG, 'addToCart →', code, 'x', amount);
        shoptet.cartShared.addToCart({ productCode: String(code), amount: amount }, true);
      } else {
        console.warn(TAG, 'addToCart není dostupné.');
      }
    } catch (e) {
      console.warn(TAG, 'addToCart error:', e);
    }
  }

  function cartHasAnyFoil() {
    const cart = getCart();
    const allCodes = Object.values(FOIL_TYPES).flatMap(t => t.match);
    for (let i = 0; i < cart.length; i++) {
      const code = String(cart[i].code || '');
      if (allCodes.includes(code)) return true;
    }
    return false;
  }

  function quantitiesByCode() {
    const out = {};
    const cart = getCart();
    for (let i = 0; i < cart.length; i++) {
      const it = cart[i];
      const code = String(it.code || '');
      const q = Number(it.quantity) || 0;
      out[code] = (out[code] || 0) + q;
    }
    return out;
  }

  // ============ 4) Bezpečné převody čísel ======================================

  function n(x){ const v = Number(x); return Number.isFinite(v) ? v : 0; }
  function ceil(x){ return Math.ceil(n(x)); }

  // ============ 5) Nasbírání metrů podle typů + odvozené proměnné ==============

  function collectMetrics() {
    const cart = getCart();
    const meters = {
      classic60: 0,

      classic100_50: 0, classic100_80: 0, classic100_100: 0,
      grounded100_50: 0,

      classic150_50: 0, tough150_50: 0, tough150_100: 0,

      classic180_50: 0
    };

    // mapování kód → typ
    const code2type = {};
    Object.entries(FOIL_TYPES).forEach(([k, v]) => v.match.forEach(c => code2type[c] = k));

    // helper: šířka z kódu (050S/080S/100S)
    const widthFromCode = (code) => {
      if (/_050S$/i.test(code)) return 50;
      if (/_080S$/i.test(code)) return 80;
      if (/_100S$/i.test(code)) return 100;
      return null; // neznámá varianta – padne do defaultu 50, kde dává smysl
    };

    for (let i = 0; i < cart.length; i++) {
      const it = cart[i];
      const code = String(it.code || '');
      const q = n(it.quantity);
      const type = code2type[code];
      if (!type || q <= 0) continue;

      if (type === 'classic60') meters.classic60 += q;

      if (type === 'classic100') {
        const w = widthFromCode(code);
        if (w === 100) meters.classic100_100 += q;
        else if (w === 80) meters.classic100_80 += q;
        else meters.classic100_50 += q; // default 0,5 m
      }

      if (type === 'grounded100') meters.grounded100_50 += q;

      if (type === 'classic150') meters.classic150_50 += q;

      if (type === 'tough150') {
        const w = widthFromCode(code);
        if (w === 100) meters.tough150_100 += q;
        else meters.tough150_50 += q;
      }

      if (type === 'classic180') meters.classic180_50 += q;
    }

    // souhrny dle výkonu
    const sum = {
      m60: meters.classic60,
      m100: meters.classic100_50 + meters.classic100_80 + meters.classic100_100,
      m150: meters.classic150_50 + meters.tough150_50 + meters.tough150_100,
      m200: meters.classic180_50, // 180 W ~ "200" ve starém vzorci
      m100_GF: meters.grounded100_50
    };

    // ====== proměnné podle starého názvosloví (bez dvojitých započtení) ======
    const V = {};

    // “základní součty” (po výkonech)
    V.MC_LarxFoil_60  = n(sum.m60);
    V.MC_LarxFoil_100 = n(sum.m100);
    V.MC_LarxFoil_150 = n(sum.m150);
    V.MC_LarxFoil_200 = n(sum.m200); // z 180 W

    // rozpad 100 a 150 na šířky + GF
    V.MC_LarxFoil_100_100   = n(meters.classic100_100);
    V.MC_LarxFoil_100_80    = n(meters.classic100_80);
    V.MC_LarxFoil_100_50_GF = n(meters.grounded100_50); // jen GF 0,5 m
    V.MC_LarxFoil_150_100   = n(meters.tough150_100);
    V.MC_LarxFoil_150_50_GF = n(meters.tough150_50);

    // Agregáty (přesně podle historických vzorců)
    V.MC_LarxFoil =
      V.MC_LarxFoil_60 +
      V.MC_LarxFoil_100 +
      V.MC_LarxFoil_150 +
      V.MC_LarxFoil_200 +
      2 * V.MC_LarxFoil_100_100 +
      2 * V.MC_LarxFoil_150_100 +
      1.6 * V.MC_LarxFoil_100_80 +
      V.MC_LarxFoil_100_50_GF +
      V.MC_LarxFoil_150_50_GF;

    V.MC_LarxFoil2 =
      V.MC_LarxFoil_60 +
      V.MC_LarxFoil_100 +
      V.MC_LarxFoil_150 +
      V.MC_LarxFoil_200 +
      V.MC_LarxFoil_100_100 +
      V.MC_LarxFoil_150_100 +
      (V.MC_LarxFoil_100_80 + V.MC_LarxFoil_100_50_GF + V.MC_LarxFoil_150_50_GF);

    V.MC_LarxFoilPlocha =
      V.MC_LarxFoil_60 +
      (V.MC_LarxFoil_100 + V.MC_LarxFoil_150 + V.MC_LarxFoil_200 + V.MC_LarxFoil_100_50_GF/2 + V.MC_LarxFoil_150_50_GF/2) +
      V.MC_LarxFoil_100_100 +
      V.MC_LarxFoil_150_100 +
      V.MC_LarxFoil_100_80;

    V.MC_LarxFoilEco = V.MC_LarxFoil_60 + V.MC_LarxFoil_100 + V.MC_LarxFoil_200 + V.MC_LarxFoil_100_100 + V.MC_LarxFoil_100_80;

    V.MC_LarxFoil100 = V.MC_LarxFoil_100;

    V.MC_LarxFoil150_200 = V.MC_LarxFoil_150 + V.MC_LarxFoil_200 + V.MC_LarxFoil_150_100 + V.MC_LarxFoil_150_50_GF;

    V.MC_LarxFoil100100 =
      0.65 * V.MC_LarxFoil_60 +
      0.65 * V.MC_LarxFoil_100 +
      V.MC_LarxFoil_100_100 +
      (V.MC_LarxFoil_100_80 + 0.65 * V.MC_LarxFoil_100_50_GF);

    V.MC_Crimping = (V.MC_LarxFoil > 0) ? 1 : 0;

    // Debug výpis (v konsoli)
    console.groupCollapsed(TAG, 'Metriky (detail)');
    console.table(meters);
    console.table(sum);
    console.table(V);
    console.groupEnd();

    return V;
  }

  // ============ 6) Pravidla spotřebáku (beze změn logiky) ======================

  const RULES = [
    { name: 'Vodič 2,5 mm² hnědý', actions: [{ type:'add', productCode:'LARX-WBROWN-25D025L', calc: v => ceil(0.65 * v.MC_LarxFoil150_200 / 25) }] },
    { name: 'Vodič 2,5 mm² modrý', actions: [{ type:'add', productCode:'LARX-WBLUE-25D025L',  calc: v => ceil(0.65 * v.MC_LarxFoil150_200 / 25) }] },

    { name: 'Vodič 1,5 mm² hnědý', actions: [{ type:'add', productCode:'FENIX-WBROWN-15D-25L', calc: v => ceil(v.MC_LarxFoil100100 / 25) }] },
    { name: 'Vodič 1,5 mm² modrý', actions: [{ type:'add', productCode:'FENIX-WBLUE-15D-25L',  calc: v => ceil(v.MC_LarxFoil100100 / 25) }] },

    { name: 'Páska-butylka', actions: [{
      type:'add', productCode:'LARX-BT005S020L',
      calc: v => ceil(
        1.2 * ((v.MC_LarxFoil_150/2.9)*(1.5/20) + (v.MC_LarxFoilEco/2.9)*(0.5/20)) +
        (v.MC_LarxFoil_100_50_GF/2.9)*(1.5/20) +
        (v.MC_LarxFoil_150_50_GF/2.9)*(1.5/20)
      )
    }]},

    { name: 'Lisovací spojky', actions: [{ type:'add', productCode:'LARX-CLAMPPLIER001', calc: v => n(v.MC_Crimping) }] },
    { name: 'Konektory',       actions: [{ type:'add', productCode:'LARX-CLAMP001X20P',  calc: v => ceil(1.1 * (v.MC_LarxFoil2/2.9) * (2/20)) }] },
    { name: 'Izolepa',         actions: [{ type:'add', productCode:'LARX-UF-IZOLEPA',     calc: v => ceil(v.MC_LarxFoil2 / 50) }] },
    { name: 'Příchytky',       actions: [{ type:'add', productCode:'LARX-STAPLES001X50P', calc: v => ceil((v.MC_LarxFoil150_200/2.9) * 0.12) }] },
    { name: 'PE fólie',        actions: [{ type:'add', productCode:'LARX-PE-120S2000L',   calc: v => ceil((v.MC_LarxFoilPlocha * 1.1) / 24) }] },
    { name: 'Polybob',         actions: [{ type:'add', productCode:'RASTR-100S5000L',     calc: v => ceil((v.MC_LarxFoil150_200 * 1.1) / 100) }] },
  ];

  // ============ 7) Idempotentní dorovnání košíku se spotřebákem ================

  function run() {
    const V = collectMetrics();

    // cílové množství každého spotřebáku
    const desired = {};
    RULES.forEach(rule => {
      rule.actions.forEach(act => {
        if (act.type !== 'add') return;
        const code = String(act.productCode);
        const qty = n(act.calc(V));
        desired[code] = (desired[code] || 0) + qty;
        console.log(TAG, 'Rule →', rule.name, code, 'qty:', qty);
      });
    });

    // aktuální stav košíku
    const have = quantitiesByCode();

    // dorovnání: jen přidáváme chybějící kusy; snižování pouze zalogujeme (Shoptet addToCart neumí remove)
    Object.keys(desired).forEach(code => {
      const want = n(desired[code]);
      const cur  = n(have[code]);
      const diff = want - cur;
      if (diff > 0) {
        addToCartSafe(code, diff);
      } else if (diff < 0) {
        console.log(TAG, 'Potřebujeme snížit', code, 'o', Math.abs(diff), '(aktuálně', cur, ', cílově', want, ') – Shoptet nemá remove v addToCart API.');
      }
    });

    // info o „přebytcích“ – jsou v košíku, ale nepatří do desired
    const extras = CONSUMABLE_CODES.filter(code => !(code in desired) && n(have[code]) > 0);
    if (extras.length) {
      console.log(TAG, 'V košíku je navíc spotřebák (není v desired):', extras, '– odeberte ručně, nebo doplnit remove API, pokud Shoptet dovolí.');
    }

    console.groupCollapsed(TAG, 'Souhrn cílových množství (desired) vs. aktuálních (have)');
    console.table({ desired, have });
    console.groupEnd();
  }

  // ============ 8) Vložení tlačítka na stránku košíku ==========================

  function getLangCode() {
    // 1) Shoptet proměnná (nejčistší)
    const l1 = window.shoptet && window.shoptet.language;
    if (typeof l1 === 'string' && l1.trim()) return l1.trim().toLowerCase();

    // 2) HTML atribut
    const l2 = document.documentElement && document.documentElement.lang;
    if (typeof l2 === 'string' && l2.trim()) return l2.trim().toLowerCase().slice(0, 2);

    // 3) URL fallback (/sk/, /en/…)
    const m = location.pathname.match(/^\/(cs|sk|en|de)\b/i);
    if (m) return m[1].toLowerCase();

    return 'cs';
  }

  function t(key) {
    const lang = getLangCode();
    const dict = {
      calc_consumables: {
        cs: 'Vypočítat spotřební materiál',
        sk: 'Vypočítať spotrebný materiál',
        en: 'Calculate consumables',
        de: 'Verbrauchsmaterial berechnen'
      }
    };

    const byKey = dict[key] || {};
    return byKey[lang] || byKey.cs || '';
  }


  function insertButton() {
    // jen košík
    if (!/\/kosik\/?$|cart/i.test(location.pathname)) return;
    if (!cartHasAnyFoil()) return;

    const proceedBtn = document.getElementById('continue-order-button');
    const leftCol = document.querySelector('.cart-inner .row.summary .col-md-8');
    if (!proceedBtn || !leftCol) return;
    if (document.getElementById('btn-calc-consumables')) return;

    const btn = document.createElement('a');
    btn.id = 'btn-calc-consumables';
    btn.className = proceedBtn.className;
    btn.href = '#';
    btn.innerHTML = proceedBtn.innerHTML;

    // přepiš popisek
    (btn.querySelector('.order-button-text') || btn).textContent = t('calc_consumables');

    // rozměry a chování vedle stávajícího tlačítka
    btn.style.display = 'inline-block';
    btn.style.width   = '50%';
    btn.style.minWidth = '0';
    btn.style.margin  = '0';
    btn.style.verticalAlign = 'top';

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      try { run(); } catch (err) { console.error(TAG, err); }
    });

    leftCol.insertBefore(btn, leftCol.firstChild);

    // responzivita: na mobilu 100 %, jinak 50 %
    const mq = window.matchMedia('(max-width: 767px)');
    const apply = () => { btn.style.width = mq.matches ? '100%' : '50%'; };
    (mq.addEventListener ? mq.addEventListener('change', apply) : mq.addListener(apply));
    apply();

    // minimalní override, aby se Shoptet styly „nepraly“
    if (!document.getElementById('calc-btn-override')) {
      const style = document.createElement('style');
      style.id = 'calc-btn-override';
      style.textContent =
        '#btn-calc-consumables.next-step-forward{width:50%!important;display:inline-block!important;}' +
        '@media(max-width:767px){#btn-calc-consumables.next-step-forward{width:100%!important;}}';
      document.head.appendChild(style);
    }

    console.log(TAG, 'Tlačítko vloženo');
  }

  // ============ 9) Inicializace a reinicializace ================================

  const tryInsert = () => { try { insertButton(); } catch (e) { console.error(TAG, e); } };
  tryInsert();
  document.addEventListener('DOMContentLoaded', tryInsert);
  document.addEventListener('ShoptetDOMContentLoaded', tryInsert);
  document.addEventListener('ShoptetDOMCartContentLoaded', tryInsert);
})();
