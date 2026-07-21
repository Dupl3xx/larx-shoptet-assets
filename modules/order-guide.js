(function (window, document) {
  'use strict';

  if (window.__larxOrderGuideInitialized) return;

  var root = document.querySelector('[data-larx-order-guide], #larx-order-guide');
  if (!root) return;
  window.__larxOrderGuideInitialized = true;

  var STORAGE_KEY = 'larx-order-guide-v1';
  var ROUTES = {
    classicFilm: '/uhlikove-topne-folie/',
    groundedFilm: '/uhlikove-folie-se-zemnenim/',
    durableFilm: '/odolne-uhlikove-folie/',
    mat: '/topne-rohoze-160w/',
    matSet: '/topne-rohoze-s-termostatem/',
    thermostats: '/termostaty/',
    consumables: '/spotrebni-material/',
    aiQuote: '/automaticke-naceneni-projektu-pomoci-ai/',
    installation: 'https://www.uhlikovefolie.cz/instalacni-manual'
  };

  var ICONS = {
    floating: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M7 14h34v8H7zM10 24h28v7H10zM13 33h22v5H13z"></path></svg>',
    screed: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M6 9h36v8H6zM8 21h32v6H8zM6 31h36v8H6z"></path><path d="m12 14 4-3 4 3 4-3 4 3 4-3 4 3"></path></svg>',
    tile: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M7 7h15v15H7zM26 7h15v15H26zM7 26h15v15H7zM26 26h15v15H26z"></path></svg>',
    dry: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 33h32M10 27h28M13 21h22M16 15h16"></path></svg>',
    damp: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 6S13 19 13 29a11 11 0 0 0 22 0C35 19 24 6 24 6Z"></path><path d="M20 34c3 2 7 1 9-2"></path></svg>',
    separate: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M15 8h18v9H15zM9 31h30v9H9zM24 17v14M19 26l5 5 5-5"></path></svg>',
    bundle: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M9 14h30v25H9zM15 8h18v6H15zM16 24l5 5 11-12"></path></svg>',
    heat: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M18 38c-5-3-8-8-8-14 0-7 5-12 11-18 0 7 4 9 4 14 3-2 5-5 6-9 5 5 8 9 8 15 0 8-6 14-14 14"></path><path d="M25 40c-4 0-7-3-7-7 0-3 2-5 5-8 0 4 3 5 3 8 2-1 3-3 4-5 2 2 3 4 3 6 0 3-3 6-8 6Z"></path></svg>',
    ground: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 6v23M13 29h22M17 35h14M21 41h6"></path></svg>'
  };

  var STRUCTURES = [
    {
      key: 'floating',
      icon: 'floating',
      title: 'Skládaná nebo plovoucí podlaha',
      text: 'Laminát, vinyl click nebo dřevěná podlaha. Suchá instalace bez zalití.'
    },
    {
      key: 'screed',
      icon: 'screed',
      title: 'Beton, anhydrit nebo podlahové desky',
      text: 'Topný prvek bude chráněný v akumulační vrstvě nebo systémové desce.'
    },
    {
      key: 'tile',
      icon: 'tile',
      title: 'Dlažba',
      text: 'Tenká topná rohož přímo pod dlažbu do flexibilního lepidla či stěrky.'
    }
  ];

  var SOLUTIONS = {
    floating: [
      {
        key: 'floatingDry',
        icon: 'dry',
        title: 'Běžná suchá místnost',
        text: 'Obývací pokoj, ložnice, pracovna nebo chodba bez zvýšené vlhkosti.'
      },
      {
        key: 'floatingDamp',
        icon: 'damp',
        title: 'Prostor se zvýšenou vlhkostí',
        text: 'Koupelna, technická místnost, sklep či jiné místo, kde je nutné řešit uzemnění.'
      }
    ],
    screed: [
      {
        key: 'screedWetLayer',
        icon: 'heat',
        title: 'Beton nebo anhydrit',
        text: 'Odolná fólie na metráž v akumulační vrstvě.'
      },
      {
        key: 'screedBoards',
        icon: 'separate',
        title: 'Systémové podlahové desky',
        text: 'Odolná fólie na metráž v suché skladbě ze systémových desek.'
      }
    ],
    tile: [
      {
        key: 'matPlain',
        icon: 'separate',
        title: 'Samostatná topná rohož',
        text: 'Termostat už mám nebo jej chci vybrat samostatně.'
      },
      {
        key: 'matSet',
        icon: 'bundle',
        title: 'Rohož v sadě s termostatem',
        text: 'Chci sladěnou sadu pro jeden samostatně regulovaný okruh.'
      }
    ]
  };

  var RESULTS = {
    floatingDry: {
      key: 'classic-film',
      title: 'Uhlíková fólie pod skládanou krytinu',
      badge: 'Suchá instalace',
      route: 'classicFilm',
      power: 'Pro běžné obytné místnosti se nejčastěji volí 80–100 W/m².',
      why: 'Tenká metrážová fólie se pokládá pod vhodný laminát, vinyl click nebo dřevo a nezvyšuje výrazně skladbu podlahy.',
      widths: [0.5, 0.8, 1],
      items: [
        ['Topná fólie', 'Metráž a šířku pásů zvolte podle skutečného půdorysu vytápěné plochy.'],
        ['Regulace', 'Jeden vhodný termostat s podlahovým čidlem pro každý samostatně řízený okruh.'],
        ['Připojení fólie', 'Hnědý a modrý vodič, připojovací konektory a správná izolace hran i spojů.'],
        ['Podlahová skladba', 'Kompatibilní podložka, rastrová separační fólie a ochranná PE fólie 0,2 mm podle skladby podlahy.']
      ]
    },
    floatingDamp: {
      key: 'grounded-film',
      title: 'Uhlíková fólie se zemněním',
      badge: 'Zvýšená vlhkost',
      route: 'groundedFilm',
      power: 'Varianta se zemněním je určená pro prostory, kde může vznikat vlhkost.',
      why: 'Integrovaná zemnicí vrstva zvyšuje bezpečnost v koupelnách, technických místnostech, garážích nebo sklepech.',
      widths: [0.5],
      items: [
        ['Fólie se zemněním', 'Použijte pouze variantu a skladbu určenou výrobcem pro konkrétní podlahovou krytinu.'],
        ['Regulace', 'Termostat s podlahovým čidlem pro každý samostatný okruh.'],
        ['Připojení a zemnění', 'Vodiče, konektory, izolaci a zemnicí prvek navrhne elektrikář podle konkrétní fólie a místních podmínek.'],
        ['Ochranné vrstvy', 'Podložka, separační a PE fólie dle doporučené skladby a požadavků na ochranu proti vlhkosti.']
      ]
    },
    screedWetLayer: {
      key: 'durable-film-screed',
      title: 'Odolná uhlíková fólie pod beton nebo anhydrit',
      badge: 'Beton / anhydrit',
      route: 'durableFilm',
      power: 'Odolná fólie 150 W/m² je určená pod betonový nebo anhydritový potěr.',
      why: 'Zesílená metrážová fólie je vhodná tam, kde bude topný prvek chráněný v betonové nebo anhydritové vrstvě.',
      widths: [0.5, 1],
      items: [
        ['Odolná topná fólie', 'Pásy navrhněte podle vytápěné plochy a dilatačních celků místnosti.'],
        ['Regulace', 'Termostat a podlahové čidlo pro každý samostatně řízený okruh.'],
        ['Připojení fólie', 'Vodiče, konektory, izolační a butylová páska podle počtu pásů a připojovacích bodů.'],
        ['Ochranná skladba', 'Rastrová separační fólie, PE fólie 0,2 mm a další vrstvy podle zvoleného potěru.']
      ]
    },
    screedBoards: {
      key: 'durable-film-boards',
      title: 'Odolná uhlíková fólie pod systémové desky',
      badge: 'Systémové desky',
      route: 'durableFilm',
      power: 'Odolná fólie 150 W/m² je vhodná do správně navržené suché skladby z podlahových desek.',
      why: 'Metrážová fólie umožňuje navrhnout jednotlivé pásy podle dispozice místnosti a rozměrů systémových desek.',
      widths: [0.5, 1],
      items: [
        ['Odolná topná fólie', 'Šířku a délku pásů zvolte podle čisté vytápěné plochy a rastru desek.'],
        ['Regulace', 'Termostat s podlahovým čidlem pro každý samostatně řízený okruh.'],
        ['Připojení fólie', 'Vodiče, konektory, izolační a butylová páska podle počtu pásů a připojovacích bodů.'],
        ['Desková skladba', 'Separační, ochranné a roznášecí vrstvy musí odpovídat systému použitému výrobcem podlahových desek.']
      ]
    },
    matPlain: {
      key: 'mat',
      title: 'Topná rohož LARX · 160 W/m²',
      badge: 'Přímo pod dlažbu',
      route: 'mat',
      power: 'Tenká samolepicí rohož se instaluje přímo pod keramickou dlažbu.',
      why: 'Hodí se pro koupelny, kuchyně a rekonstrukce, kde je důležitá malá stavební výška a rychlý náběh.',
      items: [
        ['Topná rohož', 'Zvolte kombinaci dostupných velikostí tak, aby nepřesáhla skutečnou vytápěnou plochu. Topný kabel se nezkracuje.'],
        ['Termostat a čidlo', 'Pokud je nemáte, vyberte jeden vhodný termostat s podlahovým čidlem pro každý okruh.'],
        ['Instalační příprava', 'Chránička pro čidlo, penetrace a flexibilní lepidlo nebo stěrka vhodná pro podlahové vytápění.'],
        ['Elektroinstalace', 'Přívod, jištění a případný stykač se dimenzují podle celkového výkonu okruhu.']
      ]
    },
    matSet: {
      key: 'mat-set',
      title: 'Topná rohož LARX v sadě s termostatem',
      badge: 'Kompletní sada',
      route: 'matSet',
      power: 'Rohož 160 W/m² a termostat tvoří sladěný základ pro jeden regulovaný okruh.',
      why: 'Praktická volba pro jednu koupelnu nebo místnost, pokud termostat ještě nemáte.',
      items: [
        ['Sada rohože s termostatem', 'Vyberte velikost rohože podle čisté plochy bez vany, sprchy a pevného nábytku.'],
        ['Další regulační zóny', 'Pro každý další nezávislý okruh potřebujete vlastní termostat a odpovídající rohož.'],
        ['Instalační příprava', 'Chránička pro podlahové čidlo, penetrace a flexibilní lepidlo či stěrka.'],
        ['Elektroinstalace', 'Jištění, přívod a připojení musí odpovídat výkonu všech rohoží v okruhu.']
      ]
    }
  };

  var STEP_LABELS = ['Typ podlahy', 'Vhodná varianta', 'Rozměry a regulace', 'Doporučení'];
  var defaultState = {
    step: 0,
    structure: '',
    solution: '',
    area: 10,
    zones: 1,
    width: 0.5
  };

  function clamp(value, min, max) {
    value = Number(value);
    if (!isFinite(value)) return min;
    return Math.min(max, Math.max(min, value));
  }

  function restoreState() {
    var restored;
    try {
      restored = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) || 'null');
    } catch (error) {
      restored = null;
    }
    if (!restored || typeof restored !== 'object') return Object.assign({}, defaultState);
    var structureValid = STRUCTURES.some(function (item) { return item.key === restored.structure; });
    var solutionValid = structureValid && (SOLUTIONS[restored.structure] || []).some(function (item) { return item.key === restored.solution; });
    return {
      step: clamp(restored.step, 0, solutionValid ? 3 : (structureValid ? 1 : 0)),
      structure: structureValid ? restored.structure : '',
      solution: solutionValid ? restored.solution : '',
      area: clamp(restored.area, 0.5, 500),
      zones: Math.round(clamp(restored.zones, 1, 20)),
      width: [0.5, 0.8, 1].indexOf(Number(restored.width)) > -1 ? Number(restored.width) : 0.5
    };
  }

  var state = restoreState();

  function persistState() {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      /* The guide still works when session storage is unavailable. */
    }
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatNumber(value) {
    return Number(value).toLocaleString('cs-CZ', { maximumFractionDigits: 1 });
  }

  function getStructure() {
    return STRUCTURES.find(function (item) { return item.key === state.structure; }) || null;
  }

  function getSolution() {
    return (SOLUTIONS[state.structure] || []).find(function (item) { return item.key === state.solution; }) || null;
  }

  function getResult() {
    return RESULTS[state.solution] || null;
  }

  function getAllowedWidths() {
    var result = getResult();
    if (!result || !result.widths) return [];
    return result.widths.slice();
  }

  function normalizeWidth() {
    var widths = getAllowedWidths();
    if (widths.length && widths.indexOf(Number(state.width)) === -1) state.width = widths[0];
  }

  function valueForStep(index) {
    if (index === 0) return getStructure() ? getStructure().title : '';
    if (index === 1) return getSolution() ? getSolution().title : '';
    if (index === 2 && state.solution) return formatNumber(state.area) + ' m² · ' + state.zones + (state.zones === 1 ? ' okruh' : state.zones < 5 ? ' okruhy' : ' okruhů');
    if (index === 3 && state.solution) return getResult().title;
    return '';
  }

  function maximumAvailableStep() {
    if (!state.structure) return 0;
    if (!state.solution) return 1;
    return 3;
  }

  function renderPath() {
    return STEP_LABELS.map(function (label, index) {
      var value = valueForStep(index);
      var available = index <= maximumAvailableStep();
      var classNames = ['larx-guide__path-item'];
      if (index === state.step) classNames.push('is-current');
      if (index < state.step && value) classNames.push('is-complete');
      var tag = available && index !== state.step ? 'button' : 'div';
      var attrs = tag === 'button' ? ' type="button" data-guide-step-jump="' + index + '"' : '';
      return '<li>' +
        '<' + tag + ' class="' + classNames.join(' ') + '"' + attrs + '>' +
          '<span class="larx-guide__path-number">' + (index + 1) + '</span>' +
          '<span class="larx-guide__path-copy"><strong>' + escapeHtml(label) + '</strong>' +
            (value ? '<small>' + escapeHtml(value) + '</small>' : '<small>Čeká na výběr</small>') +
          '</span>' +
        '</' + tag + '>' +
      '</li>';
    }).join('');
  }

  function optionMarkup(item, selected) {
    return '<button type="button" class="larx-guide__option' + (selected ? ' is-selected' : '') + '" data-guide-option="' + escapeHtml(item.key) + '" aria-pressed="' + (selected ? 'true' : 'false') + '">' +
      '<span class="larx-guide__option-icon">' + ICONS[item.icon] + '</span>' +
      '<span class="larx-guide__option-copy"><strong>' + escapeHtml(item.title) + '</strong><small>' + escapeHtml(item.text) + '</small></span>' +
      '<span class="larx-guide__check" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m6 12 4 4 8-9"></path></svg></span>' +
    '</button>';
  }

  function navigationMarkup(canContinue, isLastQuestion) {
    return '<div class="larx-guide__navigation">' +
      (state.step > 0 ? '<button type="button" class="larx-guide__back" data-guide-back><span aria-hidden="true">←</span> Zpět</button>' : '<span></span>') +
      '<button type="button" class="larx-guide__next" data-guide-next' + (canContinue ? '' : ' disabled') + '>' +
        (isLastQuestion ? 'Zobrazit doporučení' : 'Pokračovat') + '<span aria-hidden="true">→</span>' +
      '</button>' +
    '</div>';
  }

  function questionHeader(eyebrow, title, text) {
    return '<div class="larx-guide__question-head" tabindex="-1">' +
      '<p class="larx-guide__question-eyebrow">' + escapeHtml(eyebrow) + '</p>' +
      '<h2>' + escapeHtml(title) + '</h2>' +
      '<p>' + escapeHtml(text) + '</p>' +
    '</div>';
  }

  function renderStructureStep() {
    return questionHeader('Krok 1 ze 3', 'Co bude přímo nad vytápěním?', 'Vyberte konstrukci podlahy. Ta určuje vhodný topný prvek i potřebné ochranné vrstvy.') +
      '<div class="larx-guide__options has-three" role="group" aria-label="Typ podlahové konstrukce">' +
        STRUCTURES.map(function (item) { return optionMarkup(item, state.structure === item.key); }).join('') +
      '</div>' + navigationMarkup(Boolean(state.structure), false);
  }

  function renderSolutionStep() {
    var options = SOLUTIONS[state.structure] || [];
    var heading = state.structure === 'tile' ? 'Chcete rohož samostatně, nebo s termostatem?' :
      state.structure === 'screed' ? 'Do jaké vrstvy bude fólie instalovaná?' :
      'V jakém prostředí bude podlaha?';
    var intro = state.structure === 'tile' ? 'Rozměr rohože se volí podle čisté vytápěné plochy. Sada navíc obsahuje sladěný termostat.' :
      state.structure === 'screed' ? 'Vyberte mokrou akumulační vrstvu nebo suchou skladbu ze systémových desek. V obou případech doporučíme odolnou fólii na metráž.' :
      'Ve vlhkém prostoru je nutné zohlednit zemnění, ochranné pospojování a vhodnou skladbu.';
    return questionHeader('Krok 2 ze 3', heading, intro) +
      '<div class="larx-guide__options' + (options.length === 3 ? ' has-three' : '') + '" role="group" aria-label="Varianta řešení">' +
        options.map(function (item) { return optionMarkup(item, state.solution === item.key); }).join('') +
      '</div>' + navigationMarkup(Boolean(state.solution), false);
  }

  function renderWidthSelector() {
    var widths = getAllowedWidths();
    if (widths.length) {
      return '<fieldset class="larx-guide__width"><legend>Předpokládaná šířka pásu</legend>' +
        '<p>Pokud si nejste jistí, ponechte 0,5 m. V praxi lze pro lepší pokrytí kombinovat více šířek.</p>' +
        '<div role="group" aria-label="Šířka fólie">' + widths.map(function (width) {
          var selected = Number(state.width) === width;
          return '<button type="button" data-guide-width="' + width + '" class="' + (selected ? 'is-selected' : '') + '" aria-pressed="' + (selected ? 'true' : 'false') + '">' + formatNumber(width) + ' m</button>';
        }).join('') + '</div></fieldset>';
    }
    return '';
  }

  function renderParametersStep() {
    return questionHeader('Krok 3 ze 3', 'Jak velká je čistá vytápěná plocha?', 'Nezapočítávejte vanu, sprchový kout ani pevný nábytek s plným dnem. Každá samostatně regulovaná místnost obvykle tvoří vlastní okruh.') +
      '<div class="larx-guide__parameters">' +
        '<label class="larx-guide__field" for="larx-guide-area"><span>Vytápěná plocha</span><small>0,5 až 500 m²</small><span class="larx-guide__input"><input id="larx-guide-area" data-guide-area type="number" min="0.5" max="500" step="0.5" inputmode="decimal" value="' + escapeHtml(state.area) + '"><em>m²</em></span></label>' +
        '<label class="larx-guide__field" for="larx-guide-zones"><span>Počet regulačních okruhů</span><small>Obvykle jeden na místnost</small><span class="larx-guide__input"><input id="larx-guide-zones" data-guide-zones type="number" min="1" max="20" step="1" inputmode="numeric" value="' + escapeHtml(state.zones) + '"><em>ks</em></span></label>' +
      '</div>' + renderWidthSelector() +
      '<p class="larx-guide__validation" data-guide-validation role="alert" hidden></p>' +
      navigationMarkup(true, true);
  }

  function quantityMarkup(result) {
    if (result.widths) {
      var metres = Math.ceil((state.area / state.width) * 10) / 10;
      return '<strong>cca ' + formatNumber(metres) + ' bm</strong><span>fólie šířky ' + formatNumber(state.width) + ' m</span>';
    }
    return '<strong>cca ' + formatNumber(state.area) + ' m²</strong><span>rohoží v dostupných velikostech</span>';
  }

  function renderResultStep() {
    var result = getResult();
    if (!result) return renderStructureStep();
    var primaryHref = ROUTES[result.route];
    var thermostatWord = state.zones === 1 ? 'termostat' : state.zones < 5 ? 'termostaty' : 'termostatů';
    var circuitWord = state.zones === 1 ? 'okruh' : state.zones < 5 ? 'okruhy' : 'okruhů';
    var zoneText = state.zones + ' ' + thermostatWord + ' · ' + state.zones + ' ' + circuitWord;
    var isFilm = Boolean(result.widths);
    var nextStepTitle = isFilm ? 'Nechte si dopočítat spotřební materiál' : 'Vyberte rohož a regulaci';
    var nextStepText = isFilm ?
      'Nejprve vložte metrážovou fólii a termostaty do košíku. Potom v košíku použijte tlačítko Vypočítat spotřební materiál — množství vodičů, konektorů a pásek se dopočítá podle vybraného systému. U složitější dispozice využijte AI nacenění projektu.' :
      'Vyberte velikost rohože tak, aby nepřesáhla čistou vytápěnou plochu. Pokud nekupujete sadu, přidejte termostat pro každý samostatný okruh. Lepidlo, penetraci a elektroinstalační materiál zvolte podle konkrétní skladby.';
    var itemMarkup = result.items.map(function (item, index) {
      return '<li><span>' + (index + 1) + '</span><div><strong>' + escapeHtml(item[0]) + '</strong><p>' + escapeHtml(item[1]) + '</p></div></li>';
    }).join('');

    return '<div class="larx-guide__result" data-guide-result="' + escapeHtml(result.key) + '">' +
      '<div class="larx-guide__result-head" tabindex="-1">' +
        '<div><p class="larx-guide__question-eyebrow">Vaše orientační řešení</p><span class="larx-guide__result-badge">' + escapeHtml(result.badge) + '</span><h2>' + escapeHtml(result.title) + '</h2><p>' + escapeHtml(result.why) + '</p></div>' +
        '<div class="larx-guide__result-symbol" aria-hidden="true">' + ICONS[getSolution().icon] + '</div>' +
      '</div>' +
      '<div class="larx-guide__estimate" aria-label="Orientační množství">' +
        '<div><small>Topná plocha</small>' + quantityMarkup(result) + '</div>' +
        '<div><small>Regulace</small><strong>' + escapeHtml(zoneText) + '</strong><span>počet potvrďte podle elektroprojektu</span></div>' +
      '</div>' +
      '<p class="larx-guide__power"><span aria-hidden="true">i</span>' + escapeHtml(result.power) + '</p>' +
      '<section class="larx-guide__shopping"><div class="larx-guide__section-head"><p class="larx-guide__question-eyebrow">Co budete potřebovat</p><h3>Nákupní a instalační seznam</h3></div><ol>' + itemMarkup + '</ol></section>' +
      '<section class="larx-guide__cart-flow"><div><p class="larx-guide__question-eyebrow">Nejpřesnější další krok</p><h3>' + escapeHtml(nextStepTitle) + '</h3><p>' + escapeHtml(nextStepText) + '</p></div>' +
        '<div class="larx-guide__result-actions"><a class="larx-guide__button is-primary" data-guide-primary href="' + primaryHref + '">Vybrat doporučené produkty <span aria-hidden="true">→</span></a><a class="larx-guide__button is-secondary" href="' + ROUTES.thermostats + '">Vybrat termostat</a><a class="larx-guide__text-link" href="' + ROUTES.consumables + '">Prohlédnout spotřební materiál</a></div>' +
      '</section>' +
      '<aside class="larx-guide__safety"><strong>Než objednáte</strong><p>Výsledek je orientační, nikoli elektroprojekt. Rozložení pásů, výkon, jištění, proudový chránič, zemnění a připojení k síti musí ověřit kvalifikovaný elektrikář.</p><div><a href="' + ROUTES.aiQuote + '">AI nacenění složitějšího projektu</a><a href="' + ROUTES.installation + '" target="_blank" rel="noopener">Prohlédnout instalační návod</a></div></aside>' +
      '<div class="larx-guide__result-footer"><button type="button" class="larx-guide__back" data-guide-back><span aria-hidden="true">←</span> Upravit parametry</button><button type="button" class="larx-guide__reset" data-guide-reset>Začít znovu</button></div>' +
    '</div>';
  }

  function renderContent() {
    if (state.step === 0) return renderStructureStep();
    if (state.step === 1) return renderSolutionStep();
    if (state.step === 2) return renderParametersStep();
    return renderResultStep();
  }

  function render(focusHeading) {
    normalizeWidth();
    persistState();
    var progress = Math.round(((state.step + 1) / 4) * 100);
    root.querySelector('[data-guide-progress-bar]').style.width = progress + '%';
    root.querySelector('[data-guide-progress]').setAttribute('aria-valuenow', String(progress));
    root.querySelector('[data-guide-progress-label]').textContent = 'Krok ' + (state.step + 1) + ' ze 4';
    root.querySelector('[data-guide-path]').innerHTML = renderPath();
    root.querySelector('[data-guide-content]').innerHTML = renderContent();
    bindCurrentStep();
    if (focusHeading) {
      var heading = root.querySelector('.larx-guide__question-head, .larx-guide__result-head');
      if (heading) {
        try { heading.focus({ preventScroll: true }); } catch (error) { heading.focus(); }
        heading.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      }
    }
  }

  function selectOption(key) {
    if (state.step === 0) {
      if (state.structure !== key) {
        state.structure = key;
        state.solution = '';
        state.width = 0.5;
      }
    } else if (state.step === 1) {
      state.solution = key;
      normalizeWidth();
    }
    render(false);
  }

  function readParameters() {
    var areaInput = root.querySelector('[data-guide-area]');
    var zonesInput = root.querySelector('[data-guide-zones]');
    var validation = root.querySelector('[data-guide-validation]');
    var area = Number(String(areaInput.value).replace(',', '.'));
    var zones = Number(zonesInput.value);
    var errors = [];
    if (!isFinite(area) || area < 0.5 || area > 500) errors.push('Zadejte vytápěnou plochu od 0,5 do 500 m².');
    if (!isFinite(zones) || zones < 1 || zones > 20 || Math.round(zones) !== zones) errors.push('Zadejte 1 až 20 celých regulačních okruhů.');
    if (errors.length) {
      validation.textContent = errors.join(' ');
      validation.hidden = false;
      (errors[0].indexOf('plochu') > -1 ? areaInput : zonesInput).focus();
      return false;
    }
    validation.hidden = true;
    state.area = Math.round(area * 10) / 10;
    state.zones = Math.round(zones);
    return true;
  }

  function bindCurrentStep() {
    root.querySelectorAll('[data-guide-option]').forEach(function (button) {
      button.addEventListener('click', function () { selectOption(button.getAttribute('data-guide-option')); });
    });
    root.querySelectorAll('[data-guide-width]').forEach(function (button) {
      button.addEventListener('click', function () {
        state.width = Number(button.getAttribute('data-guide-width'));
        render(false);
      });
    });
    var next = root.querySelector('[data-guide-next]');
    if (next) next.addEventListener('click', function () {
      if (state.step === 2 && !readParameters()) return;
      if (state.step === 0 && !state.structure) return;
      if (state.step === 1 && !state.solution) return;
      state.step = Math.min(3, state.step + 1);
      render(true);
    });
    root.querySelectorAll('[data-guide-back]').forEach(function (button) {
      button.addEventListener('click', function () {
        state.step = Math.max(0, state.step - 1);
        render(true);
      });
    });
    root.querySelectorAll('[data-guide-step-jump]').forEach(function (button) {
      button.addEventListener('click', function () {
        var target = Number(button.getAttribute('data-guide-step-jump'));
        if (target <= maximumAvailableStep()) {
          state.step = target;
          render(true);
        }
      });
    });
    root.querySelectorAll('[data-guide-reset]').forEach(function (reset) {
      if (reset.getAttribute('data-guide-reset-bound') === 'true') return;
      reset.setAttribute('data-guide-reset-bound', 'true');
      reset.addEventListener('click', function () {
        state = Object.assign({}, defaultState);
        try { window.sessionStorage.removeItem(STORAGE_KEY); } catch (error) { /* no-op */ }
        render(true);
      });
    });
  }

  var pageArticle = root.closest ? root.closest('.pageArticleDetail') : null;
  var nativeHeader = pageArticle ? pageArticle.querySelector(':scope > header') : null;
  if (nativeHeader) nativeHeader.classList.add('larx-guide__native-title');
  document.title = 'Interaktivní průvodce objednávkou - LARX';

  root.innerHTML = [
    '<section class="larx-guide" aria-labelledby="larx-guide-title">',
      '<header class="larx-guide__hero">',
        '<div><p class="larx-guide__eyebrow">Chytrý nástroj LARX</p><h1 id="larx-guide-title">Interaktivní průvodce objednávkou</h1><p>Vyberte skladbu podlahy a odpovězte na několik krátkých otázek. Doporučíme vhodný systém, orientační množství a přehled všeho, co budete potřebovat.</p></div>',
        '<ul aria-label="Vlastnosti průvodce"><li><span>✓</span> 3 krátké kroky</li><li><span>✓</span> Bez registrace</li><li><span>✓</span> Výsledek ihned</li></ul>',
      '</header>',
      '<div class="larx-guide__mobile-progress" data-guide-progress role="progressbar" aria-label="Průběh průvodce" aria-valuemin="0" aria-valuemax="100" aria-valuenow="25"><div><span data-guide-progress-label>Krok 1 ze 4</span><strong>Orientační výběr systému</strong></div><i><span data-guide-progress-bar></span></i></div>',
      '<div class="larx-guide__workspace">',
        '<aside class="larx-guide__path" aria-label="Postup průvodce"><p>Váš výběr</p><ol data-guide-path></ol><button type="button" data-guide-reset>Vymazat výběr</button></aside>',
        '<div class="larx-guide__panel" data-guide-content aria-live="polite"></div>',
      '</div>',
    '</section>'
  ].join('');

  render(false);
  root.setAttribute('data-larx-order-guide-ready', 'true');
}(window, document));
