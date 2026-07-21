(function (window, document) {
  'use strict';

  if (window.__larxHeatingCalculatorInitialized) return;

  var root = document.querySelector('[data-larx-heating-calculator], #larx-heating-calculator');
  if (!root) return;
  window.__larxHeatingCalculatorInitialized = true;

  var translations = {
    cs: {
      pageTitle: 'Kalkulačka nákladů na vytápění',
      eyebrow: 'Chytrý nástroj LARX',
      title: 'Kalkulačka nákladů na vytápění',
      intro: 'Velké srovnání pěti nejčastějších způsobů vytápění — pořizovací cena, náklady na spotřebu i celkové náklady za zvolené období.',
      area: 'Vytápěná plocha',
      areaValue: '{area} metrů čtverečních',
      purchase: 'Náklady na pořízení',
      consumption: 'Náklady na spotřebu',
      total: 'Celkové náklady',
      consumptionPeriod: 'Období nákladů na spotřebu',
      totalPeriod: 'Období celkových nákladů',
      yearly: 'Ročně',
      monthly: 'Měsíčně',
      yearLabels: { 5: '5 let', 10: '10 let', 15: '15 let' },
      legend: 'Legenda',
      investment: 'Pořízení',
      running: { 5: 'Provoz 5 let', 10: 'Provoz 10 let', 15: 'Provoz 15 let' },
      insightStrong: 'Pořízení i provoz dohromady rozhodují o celkových nákladech na vytápění.',
      insight: ' Uhlíková fólie nabízí bezúdržbový provoz bez servisu a revizí a jednoduchou instalaci bez kotelny a komína.',
      disclaimer: 'Modelový dům 138 m², roční potřeba tepla cca 14 MWh. Ceny energií 2026 včetně distribuce a DPH: elektřina cca 6,00 Kč/kWh, zemní plyn cca 2,80 Kč/kWh. Pořizovací cena zahrnuje materiál i montáž (u plynového kotle včetně komína a přípojky, u tepelného čerpadla včetně technologie a rozvodů). U plynu a tepelného čerpadla jsou v nákladech na spotřebu zahrnuty i stálé platby a pravidelný servis. Skutečné hodnoty se liší dle objektu, dodavatele a vývoje cen.',
      chooseFoils: 'Vybrat topné fólie',
      aiQuote: 'AI nacenění projektu',
      systems: {
        pump: ['Tepelné čerpadlo', 'jednotka, instalace, bojler', 'včetně pravidelného servisu'],
        gas: ['Plynový kotel', 'kotel, komín, plynová přípojka', 'včetně stálých plateb a revizí'],
        larx: ['LARX uhlíková fólie', 'fólie, instalace, bez kotelny', 'bez servisu a revizí'],
        boiler: ['Elektrokotel', '', ''],
        direct: ['Elektrický přímotop', '', '']
      }
    },
    sk: {
      pageTitle: 'Kalkulačka nákladov na vykurovanie',
      eyebrow: 'Inteligentný nástroj LARX',
      title: 'Kalkulačka nákladov na vykurovanie',
      intro: 'Veľké porovnanie piatich najčastejších spôsobov vykurovania — obstarávacia cena, náklady na spotrebu aj celkové náklady za zvolené obdobie.',
      area: 'Vykurovaná plocha',
      areaValue: '{area} štvorcových metrov',
      purchase: 'Náklady na obstaranie',
      consumption: 'Náklady na spotrebu',
      total: 'Celkové náklady',
      consumptionPeriod: 'Obdobie nákladov na spotrebu',
      totalPeriod: 'Obdobie celkových nákladov',
      yearly: 'Ročne',
      monthly: 'Mesačne',
      yearLabels: { 5: '5 rokov', 10: '10 rokov', 15: '15 rokov' },
      legend: 'Legenda',
      investment: 'Obstaranie',
      running: { 5: 'Prevádzka 5 rokov', 10: 'Prevádzka 10 rokov', 15: 'Prevádzka 15 rokov' },
      insightStrong: 'O celkových nákladoch na vykurovanie rozhodujú obstarávacie aj prevádzkové náklady.',
      insight: ' Uhlíková fólia ponúka bezúdržbovú prevádzku bez servisu a revízií a jednoduchú inštaláciu bez kotolne a komína.',
      disclaimer: 'Modelový dom 138 m², ročná potreba tepla približne 14 MWh. Ceny energií 2026 vrátane distribúcie a DPH: elektrina približne 0,24 €/kWh, zemný plyn približne 0,11 €/kWh. Obstarávacia cena zahŕňa materiál aj montáž (pri plynovom kotle vrátane komína a prípojky, pri tepelnom čerpadle vrátane technológie a rozvodov). Pri plyne a tepelnom čerpadle sú v nákladoch na spotrebu zahrnuté aj stále platby a pravidelný servis. Skutočné hodnoty sa líšia podľa objektu, dodávateľa a vývoja cien.',
      chooseFoils: 'Vybrať vykurovacie fólie',
      aiQuote: 'AI ocenenie projektu',
      systems: {
        pump: ['Tepelné čerpadlo', 'jednotka, inštalácia, bojler', 'vrátane pravidelného servisu'],
        gas: ['Plynový kotol', 'kotol, komín, plynová prípojka', 'vrátane stálych platieb a revízií'],
        larx: ['Uhlíková fólia LARX', 'fólia, inštalácia, bez kotolne', 'bez servisu a revízií'],
        boiler: ['Elektrický kotol', '', ''],
        direct: ['Elektrický priamotop', '', '']
      }
    },
    en: {
      pageTitle: 'Heating cost calculator',
      eyebrow: 'Smart LARX tool',
      title: 'Heating cost calculator',
      intro: 'A comprehensive comparison of five common heating systems — purchase price, energy costs and total costs over the selected period.',
      area: 'Heated area',
      areaValue: '{area} square metres',
      purchase: 'Purchase costs',
      consumption: 'Energy costs',
      total: 'Total costs',
      consumptionPeriod: 'Energy cost period',
      totalPeriod: 'Total cost period',
      yearly: 'Per year',
      monthly: 'Per month',
      yearLabels: { 5: '5 years', 10: '10 years', 15: '15 years' },
      legend: 'Legend',
      investment: 'Purchase',
      running: { 5: 'Operation for 5 years', 10: 'Operation for 10 years', 15: 'Operation for 15 years' },
      insightStrong: 'Purchase and operating costs together determine the total cost of heating.',
      insight: ' Carbon heating foil offers maintenance-free operation without servicing or inspections and straightforward installation without a boiler room or chimney.',
      disclaimer: 'Model house of 138 m² with an annual heat demand of approximately 14 MWh. 2026 energy prices including distribution and VAT: electricity approximately €0.24/kWh, natural gas approximately €0.11/kWh. The purchase price includes materials and installation (for a gas boiler including the chimney and gas connection, and for a heat pump including the technology and distribution system). Standing charges and regular servicing are included in the energy costs for gas and heat pumps. Actual values vary according to the property, supplier and price development.',
      chooseFoils: 'Choose heating foils',
      aiQuote: 'AI project quote',
      systems: {
        pump: ['Heat pump', 'unit, installation, water heater', 'including regular servicing'],
        gas: ['Gas boiler', 'boiler, chimney, gas connection', 'including standing charges and inspections'],
        larx: ['LARX carbon heating foil', 'foil, installation, no boiler room', 'no servicing or inspections'],
        boiler: ['Electric boiler', '', ''],
        direct: ['Direct electric heater', '', '']
      }
    }
  };

  var language = String(document.documentElement.lang || 'cs').toLowerCase().slice(0, 2);
  if (!translations[language]) language = 'cs';
  var copy = translations[language];
  var currency = language === 'cs' ? 'Kč' : '€';
  var currencyRate = language === 'cs' ? 1 : 24.5;
  var languagePrefix = language === 'cs' ? '' : '/' + language;

  var pageArticle = root.closest ? root.closest('.pageArticleDetail') : null;
  var nativeTitle = pageArticle ? pageArticle.querySelector(':scope > header') : null;
  var headingTag = nativeTitle ? 'h1' : 'h2';
  if (nativeTitle) {
    nativeTitle.classList.add('larx-calc__native-title');
    var nativeHeading = nativeTitle.querySelector('h1');
    if (nativeHeading) {
      nativeHeading.textContent = copy.pageTitle;
      nativeHeading.classList.add('larx-calc__native-title');
    }
  }
  document.title = copy.pageTitle + ' - LARX';
  var breadcrumbTitle = document.querySelector('.breadcrumbs [data-testid="breadcrumbsLastLevel"] [itemprop="name"]');
  if (breadcrumbTitle) {
    breadcrumbTitle.textContent = copy.pageTitle;
    breadcrumbTitle.setAttribute('data-title', copy.pageTitle);
  }

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
      name: copy.systems.pump[0],
      purchaseDetail: copy.systems.pump[1],
      consumptionDetail: copy.systems.pump[2],
      fixed: 350000,
      variable: 725,
      annual: 17100
    },
    {
      key: 'gas',
      name: copy.systems.gas[0],
      purchaseDetail: copy.systems.gas[1],
      consumptionDetail: copy.systems.gas[2],
      fixed: 130000,
      variable: 870,
      annual: 27000
    },
    {
      key: 'larx',
      name: copy.systems.larx[0],
      purchaseDetail: copy.systems.larx[1],
      consumptionDetail: copy.systems.larx[2],
      fixed: 5000,
      variable: 1500,
      annual: 36000,
      featured: true
    },
    {
      key: 'boiler',
      name: copy.systems.boiler[0],
      purchaseDetail: copy.systems.boiler[1],
      consumptionDetail: copy.systems.boiler[2],
      fixed: 90000,
      variable: 650,
      annual: 38900
    },
    {
      key: 'direct',
      name: copy.systems.direct[0],
      purchaseDetail: copy.systems.direct[1],
      consumptionDetail: copy.systems.direct[2],
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
        '<p class="larx-calc__eyebrow">' + copy.eyebrow + '</p>',
        '<' + headingTag + ' id="larx-calc-title">' + copy.title + '</' + headingTag + '>',
        '<p>' + copy.intro + '</p>',
      '</header>',

      '<div class="larx-calc__area-card">',
        '<div class="larx-calc__area-heading">',
          '<label for="larx-calc-area">' + copy.area + '</label>',
          '<output for="larx-calc-area"><strong id="larx-calc-area-value">138</strong> m²</output>',
        '</div>',
        '<input id="larx-calc-area" class="larx-calc__range" type="range" min="10" max="300" step="1" value="138" aria-describedby="larx-calc-area-help">',
        '<div class="larx-calc__range-scale" id="larx-calc-area-help"><span>10 m²</span><span>300 m²</span></div>',
      '</div>',

      '<div class="larx-calc__card" data-calc-card="purchase">',
        '<div class="larx-calc__card-head"><div><h3>' + copy.purchase + '</h3></div></div>',
        '<div class="larx-calc__rows">' + rowsMarkup('purchase') + '</div>',
      '</div>',

      '<div class="larx-calc__card" data-calc-card="consumption">',
        '<div class="larx-calc__card-head">',
          '<div><h3>' + copy.consumption + '</h3></div>',
          '<div class="larx-calc__period" role="group" aria-label="' + copy.consumptionPeriod + '">',
            '<button type="button" class="is-active" data-calc-period="year" aria-pressed="true">' + copy.yearly + '</button>',
            '<button type="button" data-calc-period="month" aria-pressed="false">' + copy.monthly + '</button>',
          '</div>',
        '</div>',
        '<div class="larx-calc__rows">' + rowsMarkup('consumption') + '</div>',
      '</div>',

      '<div class="larx-calc__card" data-calc-card="total">',
        '<div class="larx-calc__card-head">',
          '<div><h3>' + copy.total + '</h3></div>',
          '<div class="larx-calc__period is-years" role="group" aria-label="' + copy.totalPeriod + '">',
            '<button type="button" data-calc-years="5" aria-pressed="false">' + copy.yearLabels[5] + '</button>',
            '<button type="button" class="is-active" data-calc-years="10" aria-pressed="true">' + copy.yearLabels[10] + '</button>',
            '<button type="button" data-calc-years="15" aria-pressed="false">' + copy.yearLabels[15] + '</button>',
          '</div>',
        '</div>',
        '<div class="larx-calc__legend" aria-label="' + copy.legend + '"><span><i class="is-investment"></i>' + copy.investment + '</span><span><i class="is-running"></i><span data-calc-running-legend>' + copy.running[10] + '</span></span></div>',
        '<div class="larx-calc__rows">' + rowsMarkup('total') + '</div>',
        '<p class="larx-calc__insight"><strong>' + copy.insightStrong + '</strong>' + copy.insight + '</p>',
      '</div>',

      '<p class="larx-calc__disclaimer">' + copy.disclaimer + '</p>',

      '<div class="larx-calc__actions">',
        '<a class="larx-calc__button is-primary" href="' + languagePrefix + '/topne-folie/">' + copy.chooseFoils + '</a>',
        '<a class="larx-calc__button is-secondary" href="' + languagePrefix + '/nabidka-pomoci-ai/">' + copy.aiQuote + '</a>',
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
    return formatInteger(roundNice(value / currencyRate)) + '\u00a0' + currency;
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
    runningLegend.textContent = copy.running[years];
  }

  function updateRange() {
    var progress = ((area - MIN_AREA) / (MAX_AREA - MIN_AREA)) * 100;
    areaInput.style.setProperty('--larx-calc-range', progress + '%');
    areaOutput.textContent = area;
    areaInput.setAttribute('aria-valuetext', copy.areaValue.replace('{area}', area));
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
