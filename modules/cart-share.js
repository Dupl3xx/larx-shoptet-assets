;(() => {
  'use strict';
  if (window.__LARX_CART_SHARE_INIT__) return;
  window.__LARX_CART_SHARE_INIT__ = true;

  /* =======================
     KONFIGURACE
  ======================= */
  const CONFIG = {
    addDelayMs: 200,
    waitApiMs: 7000,
    hideCartOverlaysTemporarily: true,
    stripQueryAfterInsert: true,
    enableShareButton: true,
    i18n: (() => {
      const lang = (document.documentElement.lang || '').toLowerCase();
      if (lang.startsWith('cs')) {
        return {
          shareBtn: 'Sdílet košík',
          shareCopy: 'Zkopírovat odkaz',
          shareCopied: 'Odkaz zkopírován',
          shareTitle: 'Sdílet košík',
          sharePrompt: 'Výběr produktů',
          cartPath: '/kosik/',
        };
      }
      if (lang.startsWith('sk')) {
        return {
          shareBtn: 'Zdieľať košík',
          shareCopy: 'Skopírovať odkaz',
          shareCopied: 'Odkaz skopírovaný',
          shareTitle: 'Zdieľať košík',
          sharePrompt: 'Výber produktov',
          cartPath: '/kosik/',
        };
      }
      return {
        shareBtn: 'Share cart',
        shareCopy: 'Copy link',
        shareCopied: 'Link copied',
        shareTitle: 'Share cart',
        sharePrompt: 'Product selection',
        cartPath: '/cart/',
      };
    })(),
  };

  /* =======================
     POMOCNÉ FUNKCE
  ======================= */

  const toPosInt = (v) => {
    const n = parseInt(String(v).trim(), 10);
    return Number.isFinite(n) && n > 0 ? n : null;
  };

  // Z URL vytáhne položky ve formátu ?1423:1&733:2 nebo ?1423=1&733=2
  function parseSharedCartFromURL(urlSearch) {
    const params = new URLSearchParams(urlSearch);
    const items = [];

    // 1) Klíče ve tvaru ?1423:1&733:2 (bez hodnot)
    params.forEach((value, key) => {
      if (key.includes(':')) {
        const [pidRaw, qtyRaw] = key.split(':');
        const priceId = toPosInt(pidRaw);
        const amount  = toPosInt(qtyRaw);
        if (priceId && amount) items.push({ priceId, amount });
      }
    });

    // 2) Alternativa ?1423=1&733=2
    params.forEach((value, key) => {
      if (!key.includes(':')) {
        const priceId = toPosInt(key);
        const amount  = toPosInt(value);
        if (priceId && amount) items.push({ priceId, amount });
      }
    });

    return items;
  }

  // Čekání na dostupnost Shoptet API
  function waitForAddToCart(readyCb) {
    const start = Date.now();
    const isReady = () =>
      window.shoptet &&
      shoptet.cartShared &&
      typeof shoptet.cartShared.addToCart === 'function';

    if (isReady()) return readyCb();

    const timer = setInterval(() => {
      if (isReady()) {
        clearInterval(timer);
        readyCb();
      } else if (Date.now() - start > CONFIG.waitApiMs) {
        clearInterval(timer);
      }
    }, 80);
  }

  // Odstraní query string z adresy (bez reloadu)
  function stripQueryFromURL() {
    try {
      const url = new URL(window.location.href);
      url.search = '';
      window.history.replaceState({}, document.title, url.toString());
    } catch (e) {}
  }

  // Dočasné skrytí overlayů v košíku
  function tempHideCartOverlays(enable) {
    const id = 'ajs-temp-hide-overlays';
    if (enable) {
      if (document.getElementById(id)) return;
      const style = document.createElement('style');
      style.id = id;
      style.textContent = `
        .in-kosik #cboxOverlay,
        .in-kosik #colorbox,
        .in-kosik .msg.msg-error {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
    } else {
      const style = document.getElementById(id);
      if (style) style.remove();
    }
  }

  // Sekvenční vkládání položek
  function addItemsSequentially(items, i = 0) {
    if (i >= items.length) {
      if (CONFIG.stripQueryAfterInsert) stripQueryFromURL();
      if (CONFIG.hideCartOverlaysTemporarily) {
        setTimeout(() => tempHideCartOverlays(false), 300);
      }
      return;
    }

    const it = items[i];
    try {
      shoptet.cartShared.addToCart(
        { priceId: it.priceId, amount: it.amount },
        true // useModal
      );
    } catch (e) {
      // pokračovat i při chybě
    }

    setTimeout(() => addItemsSequentially(items, i + 1), CONFIG.addDelayMs);
  }

  /* =======================
     HLAVNÍ TOK: NAČTENÍ Z URL
  ======================= */

  function runSharedCartFlow() {
    const qs = window.location.search || '';
    if (!qs || qs === '?') return;

    const items = parseSharedCartFromURL(qs);
    if (!items.length) return;

    // Zpracovat dotaz jen jednou v rámci session
    const onceKey = 'sharedCartProcessed:' + qs;
    try {
      if (sessionStorage.getItem(onceKey) === '1') return;
      sessionStorage.setItem(onceKey, '1');
    } catch (e) {}

    if (CONFIG.hideCartOverlaysTemporarily) tempHideCartOverlays(true);

    waitForAddToCart(() => addItemsSequentially(items));
  }

  /* =======================
     DATA Z DATALAYERU
  ======================= */

  function getCartItemsFromDataLayer() {
    try {
      if (
        window.dataLayer &&
        dataLayer[0] &&
        dataLayer[0].shoptet &&
        dataLayer[0].shoptet.cartInfo &&
        Array.isArray(dataLayer[0].shoptet.cartInfo.cartItems)
      ) {
        return dataLayer[0].shoptet.cartInfo.cartItems
          .map((it) => ({
            priceId: it.priceId || toPosInt(it.code) || null,
            quantity: toPosInt(it.quantity || it.amount || 1) || 1,
          }))
          .filter((x) => x.priceId && x.quantity);
      }
    } catch (e) {}
    return [];
  }

  /* =======================
     SDÍLENÍ KOŠÍKU
  ======================= */

  function buildShareURL(items) {
    const origin = window.location.origin;
    const path = CONFIG.i18n.cartPath || '/kosik/';
    const query = items.map((x) => `${x.priceId}:${x.quantity}`).join('&');
    return `${origin}${path}?${query}`;
  }

  function createShareButton() {
    if (!CONFIG.enableShareButton) return;

    // Styl
    const styleId = 'ajs-share-cart-style';
    if (!document.getElementById(styleId)) {
      const st = document.createElement('style');
      st.id = styleId;
      st.textContent = `
        .ajs-share-wrap { margin: 24px 0; display:flex; gap:12px; align-items:center; flex-wrap:wrap; }
        .ajs-share-btn { cursor:pointer; border:1px solid #ddd; background:#fff; padding:8px 14px; font:inherit; border-radius:6px; }
        .ajs-share-input { width: min(640px, 100%); padding:8px 10px; border:1px solid #ddd; border-radius:6px; font:inherit; }
      `;
      document.head.appendChild(st);
    }

    const wrap = document.createElement('div');
    wrap.className = 'ajs-share-wrap';

    const btn = document.createElement('button');
    btn.className = 'ajs-share-btn';
    btn.type = 'button';
    btn.textContent = CONFIG.i18n.shareBtn;

    const input = document.createElement('input');
    input.className = 'ajs-share-input';
    input.type = 'text';
    input.readOnly = true;
    input.placeholder = CONFIG.i18n.shareBtn;

    const copyBtn = document.createElement('button');
    copyBtn.className = 'ajs-share-btn';
    copyBtn.type = 'button';
    copyBtn.textContent = CONFIG.i18n.shareCopy;

    const updateLink = () => {
      const items = getCartItemsFromDataLayer();
      input.value = items.length ? buildShareURL(items) : '';
    };

    const copyToClipboard = async (text) => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
          return true;
        }
      } catch (e) {}
      try {
        input.select();
        document.execCommand('copy');
        return true;
      } catch (e) {
        return false;
      }
    };

    btn.addEventListener('click', async () => {
      updateLink();
      const url = input.value;
      const isMobile = window.innerWidth <= 767;
      if (navigator.share && isMobile && url) {
        try {
          await navigator.share({
            title: CONFIG.i18n.shareTitle,
            text: CONFIG.i18n.sharePrompt,
            url,
          });
        } catch (e) {}
      } else {
        input.select();
      }
    });

    copyBtn.addEventListener('click', async () => {
      updateLink();
      if (!input.value) return;
      const ok = await copyToClipboard(input.value);
      if (ok) {
        const old = copyBtn.textContent;
        copyBtn.textContent = CONFIG.i18n.shareCopied;
        setTimeout(() => (copyBtn.textContent = old), 1200);
      }
    });

    wrap.appendChild(btn);
    wrap.appendChild(input);
    wrap.appendChild(copyBtn);

    // === VŽDY ZNOVU VLOŽIT NA STABILNÍ MÍSTO ===
    const getTargets = () => ({
      table: document.querySelector('.cart-table'),
      summary: document.querySelector('.order-summary'),
      cartRoot: document.querySelector('.cart'),
    });

    const inject = () => {
      const { table, summary, cartRoot } = getTargets();
      if (table && table.parentNode) {
        table.insertAdjacentElement('afterend', wrap);
      } else if (summary && summary.parentNode) {
        summary.insertAdjacentElement('beforebegin', wrap);
      } else if (cartRoot) {
        cartRoot.appendChild(wrap);
      }
      updateLink();
    };

    // Reakce na shoptet eventy (překreslení košíku / datalayer)
    const safeInject = () => setTimeout(inject, 0);
    document.addEventListener('ShoptetDOMCartContentLoaded', safeInject);
    document.addEventListener('ShoptetDataLayerUpdated', safeInject);

    // Fallback: změny DOM (ignoruj vlastní přesun wrapu)
    const mo = new MutationObserver((mut) => {
      // pokud zmizela/objevila se .cart-table nebo .order-summary, znovu vlož
      const need =
        mut.some(m => Array.from(m.addedNodes).some(n => n.nodeType === 1 && (n.matches?.('.cart-table, .order-summary') || n.querySelector?.('.cart-table, .order-summary')))) ||
        mut.some(m => Array.from(m.removedNodes).some(n => n.nodeType === 1 && (n.matches?.('.cart-table, .order-summary') || n.querySelector?.('.cart-table, .order-summary'))));
      if (need) safeInject();
    });
    mo.observe(document.body, { childList: true, subtree: true });

    // první vložení
    inject();
  }

  /* =======================
     START
  ======================= */

  function start() {
    runSharedCartFlow();
    createShareButton();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
