(function (window, document) {
  'use strict';

  if (window.__larxHeatingCalculatorInitialized) return;

  var root = document.querySelector('[data-larx-heating-calculator], #larx-heating-calculator');
  if (!root) return;
  window.__larxHeatingCalculatorInitialized = true;

  var BASE_AREA = 138;
  var MIN_AREA = 10;
  var MAX_AREA = 300;
  var area = BASE_AREA;
  var period = 'year';
  var years = 10;

  /* Values and formulas are preserved from the supplied
     10_body_jak_to_funguje.tpl source. */
  var systems = [
    {
      key: 'pump',
      name: 'Tepelné čerpadlo',
      purchaseDetail: 'jednotka, instalace, bojler',
      consumptionDetail: 'včetně pravidelného servisu',
      fixed: 350000,
      variable: 725,
      annual: 17100
    },
    {
      key: 'gas',
      name: 'Plynový kotel',
      purchaseDetail: 'kotel, komín, plynová přípojka',
      consumptionDetail: 'včetně stálých plateb a revizí',
      fixed: 130000,
      variable: 870,
      annual: 27000
    },
    {
      key: 'larx',
      name: 'LARX uhlíková fólie',
      purchaseDetail: 'fólie, instalace, bez kotelny',
      consumptionDetail: 'bez servisu a revizí',
      fixed: 5000,
      variable: 1500,
      annual: 36000,
      featured: true
    },
    {
      key: 'boiler',
      name: 'Elektrokotel',
      purchaseDetail: '',
      consumptionDetail: '',
      fixed: 90000,
      variable: 650,
      annual: 38900
    },
    {
      key: 'direct',
      name: 'Elektrický přímotop',
      purchaseDetail: '',
      consumptionDetail: '',
      fixed: 5000,
      variable: 400,
      annual: 60500
    }
  ];

  function rowMarkup(system, kind) {
    var detail = kind === 'purchase' ? system.purchaseDetail : (kind === 'consumption' ? system.consumptionDetail : '');
    var detailMarkup = detail ? '<small>' + detail + '</small>' : '';
    var bars = kind === 'total'
      ? '<span class="larx-calc__bar-total"><span class="larx-calc__bar-investment"></span><span class="larx-calc__bar-running"></span></span>'
      : '<span class="larx-calc__bar-fill"></span>';

    return [
      '<div class="larx-calc__row' + (system.featured ? ' is-featured' : '') + '" data-calc-row="' + system.key + '" data-calc-kind="' + kind + '" data-fixed="' + system.fixed + '" data-variable="' + system.variable + '" data-annual="' + system.annual + '">',
        '<div class="larx-calc__name"><span class="larx-calc__system-dot" aria-hidden="true"></span><span>' + system.name + detailMarkup + '</span></div>',
        '<div class="larx-calc__bar" role="meter" aria-label="' + system.name + '" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">' + bars + '</div>',
        '<div class="larx-calc__value"><strong data-calc-value></strong></div>',
      '</div>'
    ].join('');
  }

  function rowsMarkup(kind) {
    return systems.map(function (system) { return rowMarkup(system, kind); }).join('');
  }

  root.innerHTML = [
    '<section class="larx-calc" aria-labelledby="larx-calc-title">',
      '<header class="larx-calc__hero">',
        '<p class="larx-calc__eyebrow">Chytrý nástroj LARX</p>',
        '<h2 id="larx-calc-title">Kalkulačka nákladů na vytápění</h2>',
        '<p>Velké srovnání pěti nejčastějších způsobů vytápění — pořizovací cena, náklady na spotřebu i celkové náklady za zvolené období.</p>',
      '</header>',

      '<div class="larx-calc__area-card">',
        '<div class="larx-calc__area-heading">',
          '<label for="larx-calc-area">Vytápěná plocha</label>',
          '<output for="larx-calc-area"><strong id="larx-calc-area-value">138</strong> m²</output>',
        '</div>',
        '<input id="larx-calc-area" class="larx-calc__range" type="range" min="10" max="300" step="1" value="138" aria-describedby="larx-calc-area-help">',
        '<div class="larx-calc__range-scale" id="larx-calc-area-help"><span>10 m²</span><span>300 m²</span></div>',
      '</div>',

      '<div class="larx-calc__card" data-calc-card="purchase">',
        '<div class="larx-calc__card-head"><div><p class="larx-calc__card-index">01</p><h3>Náklady na pořízení</h3></div></div>',
        '<div class="larx-calc__rows">' + rowsMarkup('purchase') + '</div>',
      '</div>',

      '<div class="larx-calc__card" data-calc-card="consumption">',
        '<div class="larx-calc__card-head">',
          '<div><p class="larx-calc__card-index">02</p><h3>Náklady na spotřebu</h3></div>',
          '<div class="larx-calc__period" role="group" aria-label="Období nákladů na spotřebu">',
            '<button type="button" class="is-active" data-calc-period="year" aria-pressed="true">Ročně</button>',
            '<button type="button" data-calc-period="month" aria-pressed="false">Měsíčně</button>',
          '</div>',
        '</div>',
        '<div class="larx-calc__rows">' + rowsMarkup('consumption') + '</div>',
      '</div>',

      '<div class="larx-calc__card" data-calc-card="total">',
        '<div class="larx-calc__card-head">',
          '<div><p class="larx-calc__card-index">03</p><h3>Celkové náklady</h3></div>',
          '<div class="larx-calc__period is-years" role="group" aria-label="Období celkových nákladů">',
            '<button type="button" data-calc-years="5" aria-pressed="false">5 let</button>',
            '<button type="button" class="is-active" data-calc-years="10" aria-pressed="true">10 let</button>',
            '<button type="button" data-calc-years="15" aria-pressed="false">15 let</button>',
          '</div>',
        '</div>',
        '<div class="larx-calc__legend" aria-label="Legenda"><span><i class="is-investment"></i>Pořízení</span><span><i class="is-running"></i><span data-calc-running-legend>Provoz 10 let</span></span></div>',
        '<div class="larx-calc__rows">' + rowsMarkup('total') + '</div>',
        '<p class="larx-calc__insight"><strong>Pořízení i provoz dohromady rozhodují o celkových nákladech na vytápění.</strong> Uhlíková fólie nabízí bezúdržbový provoz bez servisu a revizí a jednoduchou instalaci bez kotelny a komína.</p>',
      '</div>',

      '<p class="larx-calc__disclaimer">Modelový dům 138 m², roční potřeba tepla cca 14 MWh. Ceny energií 2026 včetně distribuce a DPH: elektřina cca 6,00 Kč/kWh, zemní plyn cca 2,80 Kč/kWh. Pořizovací cena zahrnuje materiál i montáž (u plynového kotle včetně komína a přípojky, u tepelného čerpadla včetně technologie a rozvodů). U plynu a tepelného čerpadla jsou v nákladech na spotřebu zahrnuty i stálé platby a pravidelný servis. Skutečné hodnoty se liší dle objektu, dodavatele a vývoje cen.</p>',

      '<div class="larx-calc__actions">',
        '<a class="larx-calc__button is-primary" href="/topne-folie/">Vybrat topné fólie</a>',
        '<a class="larx-calc__button is-secondary" href="/nabidka-pomoci-ai/">AI nacenění projektu</a>',
      '</div>',
    '</section>'
  ].join('');

  var areaInput = root.querySelector('#larx-calc-area');
  var areaOutput = root.querySelector('#larx-calc-area-value');
  var periodButtons = root.querySelectorAll('[data-calc-period]');
  var yearButtons = root.querySelectorAll('[data-calc-years]');
  var runningLegend = root.querySelector('[data-calc-running-legend]');

  function formatInteger(value) {
    return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0');
  }

  function roundNice(value) {
    if (value >= 100000) return Math.round(value / 1000) * 1000;
    if (value >= 10000) return Math.round(value / 100) * 100;
    return Math.round(value / 10) * 10;
  }

  function formatMoney(value) {
    return formatInteger(roundNice(value)) + '\u00a0Kč';
  }

  function purchaseFor(row) {
    return Number(row.getAttribute('data-fixed')) + Number(row.getAttribute('data-variable')) * area;
  }

  function annualFor(row) {
    return Number(row.getAttribute('data-annual')) * (area / BASE_AREA);
  }

  function sortRows(card, values) {
    var container = card.querySelector('.larx-calc__rows');
    values.slice().sort(function (a, b) { return a.value - b.value; }).forEach(function (entry) {
      container.appendChild(entry.row);
    });
  }

  function setBar(row, totalPercent, investmentPercent) {
    var bar = row.querySelector('.larx-calc__bar');
    var fill = row.querySelector('.larx-calc__bar-fill');
    var total = row.querySelector('.larx-calc__bar-total');
    var investment = row.querySelector('.larx-calc__bar-investment');
    var normalized = Math.max(0, Math.min(100, totalPercent));

    if (fill) fill.style.width = normalized + '%';
    if (total) total.style.width = normalized + '%';
    if (investment) investment.style.width = Math.max(0, Math.min(100, investmentPercent || 0)) + '%';
    bar.setAttribute('aria-valuenow', String(Math.round(normalized)));
  }

  function renderPurchase() {
    var card = root.querySelector('[data-calc-card="purchase"]');
    var values = [];

    card.querySelectorAll('[data-calc-row]').forEach(function (row) {
      var value = purchaseFor(row);
      row.querySelector('[data-calc-value]').textContent = formatMoney(value);
      values.push({ row: row, value: value });
    });

    var max = Math.max.apply(null, values.map(function (entry) { return entry.value; }));
    values.forEach(function (entry) { setBar(entry.row, max ? entry.value / max * 100 : 0); });
    sortRows(card, values);
  }

  function renderConsumption() {
    var card = root.querySelector('[data-calc-card="consumption"]');
    var values = [];

    card.querySelectorAll('[data-calc-row]').forEach(function (row) {
      var annual = annualFor(row);
      var value = period === 'month' ? annual / 12 : annual;
      row.querySelector('[data-calc-value]').textContent = formatMoney(value);
      values.push({ row: row, value: value });
    });

    var max = Math.max.apply(null, values.map(function (entry) { return entry.value; }));
    values.forEach(function (entry) { setBar(entry.row, max ? entry.value / max * 100 : 0); });
    sortRows(card, values);
  }

  function renderTotal() {
    var card = root.querySelector('[data-calc-card="total"]');
    var values = [];

    card.querySelectorAll('[data-calc-row]').forEach(function (row) {
      var purchase = purchaseFor(row);
      var value = purchase + annualFor(row) * years;
      row.querySelector('[data-calc-value]').textContent = formatMoney(value);
      values.push({ row: row, value: value, purchase: purchase });
    });

    var max = Math.max.apply(null, values.map(function (entry) { return entry.value; }));
    values.forEach(function (entry) {
      setBar(entry.row, max ? entry.value / max * 100 : 0, entry.value ? entry.purchase / entry.value * 100 : 0);
    });
    sortRows(card, values);
    runningLegend.textContent = 'Provoz ' + years + ' let';
  }

  function updateRange() {
    var progress = ((area - MIN_AREA) / (MAX_AREA - MIN_AREA)) * 100;
    areaInput.style.setProperty('--larx-calc-range', progress + '%');
    areaOutput.textContent = area;
    areaInput.setAttribute('aria-valuetext', area + ' metrů čtverečních');
  }

  function updateButtons(buttons, attribute, activeValue) {
    buttons.forEach(function (button) {
      var active = button.getAttribute(attribute) === String(activeValue);
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function renderAll() {
    updateRange();
    renderPurchase();
    renderConsumption();
    renderTotal();
    updateButtons(periodButtons, 'data-calc-period', period);
    updateButtons(yearButtons, 'data-calc-years', years);
  }

  areaInput.addEventListener('input', function () {
    area = Math.max(MIN_AREA, Math.min(MAX_AREA, Number(areaInput.value) || BASE_AREA));
    renderAll();
  });

  periodButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      period = button.getAttribute('data-calc-period') === 'month' ? 'month' : 'year';
      renderConsumption();
      updateButtons(periodButtons, 'data-calc-period', period);
    });
  });

  yearButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      years = Number(button.getAttribute('data-calc-years')) || 10;
      renderTotal();
      updateButtons(yearButtons, 'data-calc-years', years);
    });
  });

  renderAll();
  root.setAttribute('data-larx-calculator-ready', 'true');
})(window, document);
