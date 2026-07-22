(function (window, document) {
  'use strict';

  if (window.__larxOrderGuideInitialized) return;

  var root = document.querySelector('[data-larx-order-guide], #larx-order-guide');
  if (!root) return;
  window.__larxOrderGuideInitialized = true;

  var LANGUAGE = (document.documentElement.lang || '').toLowerCase().slice(0, 2);
  if (['cs', 'en', 'sk'].indexOf(LANGUAGE) === -1) LANGUAGE = 'cs';
  var LOCALE = { cs: 'cs-CZ', en: 'en-GB', sk: 'sk-SK' }[LANGUAGE];
  var STORAGE_KEY = 'larx-order-guide-v1';
  var ROUTES = {
    cs: {
      classicFilm: '/uhlikove-topne-folie/', groundedFilm: '/uhlikove-folie-se-zemnenim/', durableFilm: '/odolne-uhlikove-folie/',
      mat: '/topne-rohoze-160w/', matSet: '/topne-rohoze-s-termostatem/', thermostats: '/termostaty/', consumables: '/spotrebni-material/',
      aiQuote: '/automaticke-naceneni-projektu-pomoci-ai/', installation: 'https://www.uhlikovefolie.cz/instalacni-manual'
    },
    en: {
      classicFilm: '/en/carbon-films/', groundedFilm: '/en/film-with-grounding/', durableFilm: '/en/durable-carbon-films/',
      mat: '/en/heating-mats-160w-m2/', matSet: '/en/heating-mats-160w-m2-in-a-set-with-a-thermostat/', thermostats: '/en/thermostats/', consumables: '/en/materials/',
      aiQuote: '/en/automatic-project-pricing-using-ai/', installation: 'https://www.carbon-film.com/installation-manual'
    },
    sk: {
      classicFilm: '/sk/uhlikove-folie/', groundedFilm: '/sk/folia-s-uzemneniem/', durableFilm: '/sk/odolne-uhlikove-folie/',
      mat: '/sk/vykurovacie-rohoze-160w-m2/', matSet: '/sk/vykurovacie-rohoze-160w-m2-v-sade-s-termostatom/', thermostats: '/sk/termostaty/', consumables: '/sk/spotrebny-material/',
      aiQuote: '/sk/automaticke-nacenenie-projektu-pomocou-ai/', installation: 'https://www.vykurovaciefolie.sk/instalacny-manual'
    }
  }[LANGUAGE];

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

  var BASE_STRUCTURES = [
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

  var BASE_SOLUTIONS = {
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

  var BASE_SCREED_ENVIRONMENTS = [
    {
      key: 'screedDamp',
      icon: 'damp',
      title: 'Koupelny nebo vlhké prostory',
      text: 'Koupelny, prádelny, technické místnosti a další prostory se zvýšenou vlhkostí.'
    },
    {
      key: 'screedStandard',
      icon: 'dry',
      title: 'Běžné prostory',
      text: 'Obývací pokoje, ložnice, pracovny, chodby a další prostory bez zvýšené vlhkosti.'
    }
  ];

  var BASE_RESULTS = {
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
    screedWetLayerDamp: {
      key: 'grounded-film-screed',
      title: 'Uhlíková fólie se zemněním pod beton nebo anhydrit',
      badge: 'Vlhké prostory',
      route: 'groundedFilm',
      power: 'Fólie se zemněním je určená pro betonový nebo anhydritový potěr ve vlhkém prostoru.',
      why: 'Integrovaná zemnicí vrstva zvyšuje bezpečnost v koupelnách, technických místnostech, garážích nebo sklepech.',
      widths: [0.5],
      items: [
        ['Fólie se zemněním', 'Pásy navrhněte podle vytápěné plochy a dilatačních celků místnosti.'],
        ['Regulace', 'Termostat a podlahové čidlo pro každý samostatně řízený okruh.'],
        ['Připojení a zemnění', 'Vodiče, konektory, izolaci a zemnicí prvek navrhne elektrikář podle konkrétní fólie a místních podmínek.'],
        ['Ochranná skladba', 'Rastrová separační fólie, PE fólie 0,2 mm a další vrstvy podle zvoleného potěru.']
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

  var DATA_TRANSLATIONS = {
    en: {
      'Skládaná nebo plovoucí podlaha': 'Floating or click flooring',
      'Laminát, vinyl click nebo dřevěná podlaha. Suchá instalace bez zalití.': 'Laminate, click vinyl or wood flooring. Dry installation without screed.',
      'Beton, anhydrit nebo podlahové desky': 'Concrete, anhydrite or floor panels',
      'Topný prvek bude chráněný v akumulační vrstvě nebo systémové desce.': 'The heating element will be protected in a screed layer or a floor panel system.',
      'Dlažba': 'Tiles',
      'Tenká topná rohož přímo pod dlažbu do flexibilního lepidla či stěrky.': 'A thin heating mat installed directly under tiles in flexible adhesive or levelling compound.',
      'Běžná suchá místnost': 'Standard dry room',
      'Obývací pokoj, ložnice, pracovna nebo chodba bez zvýšené vlhkosti.': 'Living room, bedroom, study or hallway without increased humidity.',
      'Prostor se zvýšenou vlhkostí': 'Room with increased humidity',
      'Koupelna, technická místnost, sklep či jiné místo, kde je nutné řešit uzemnění.': 'Bathroom, utility room, basement or another area where grounding must be addressed.',
      'Beton nebo anhydrit': 'Concrete or anhydrite',
      'Odolná fólie na metráž v akumulační vrstvě.': 'Durable cut-to-length film in a screed layer.',
      'Koupelny nebo vlhké prostory': 'Bathrooms or damp areas',
      'Koupelny, prádelny, technické místnosti a další prostory se zvýšenou vlhkostí.': 'Bathrooms, utility rooms and other areas with increased humidity.',
      'Běžné prostory': 'Standard areas',
      'Obývací pokoje, ložnice, pracovny, chodby a další prostory bez zvýšené vlhkosti.': 'Living rooms, bedrooms, studies, hallways and other areas without increased humidity.',
      'Systémové podlahové desky': 'Floor panel system',
      'Odolná fólie na metráž v suché skladbě ze systémových desek.': 'Durable cut-to-length film in a dry floor panel system.',
      'Samostatná topná rohož': 'Heating mat only',
      'Termostat už mám nebo jej chci vybrat samostatně.': 'I already have a thermostat or want to select one separately.',
      'Rohož v sadě s termostatem': 'Heating mat set with thermostat',
      'Chci sladěnou sadu pro jeden samostatně regulovaný okruh.': 'I want a matched set for one independently controlled circuit.',
      'Uhlíková fólie pod skládanou krytinu': 'Carbon heating film under floating flooring',
      'Suchá instalace': 'Dry installation',
      'Pro běžné obytné místnosti se nejčastěji volí 80–100 W/m².': 'For standard living areas, 80–100 W/m² is the most common choice.',
      'Tenká metrážová fólie se pokládá pod vhodný laminát, vinyl click nebo dřevo a nezvyšuje výrazně skladbu podlahy.': 'Thin cut-to-length film is installed under suitable laminate, click vinyl or wood without significantly increasing the floor build-up.',
      'Topná fólie': 'Heating film',
      'Metráž a šířku pásů zvolte podle skutečného půdorysu vytápěné plochy.': 'Choose the film length and strip widths according to the actual heated floor plan.',
      'Regulace': 'Controls',
      'Jeden vhodný termostat s podlahovým čidlem pro každý samostatně řízený okruh.': 'One suitable thermostat with a floor sensor for each independently controlled circuit.',
      'Připojení fólie': 'Film connection',
      'Hnědý a modrý vodič, připojovací konektory a správná izolace hran i spojů.': 'Brown and blue wires, connection clips and correct insulation of edges and joints.',
      'Podlahová skladba': 'Floor build-up',
      'Kompatibilní podložka, rastrová separační fólie a ochranná PE fólie 0,2 mm podle skladby podlahy.': 'A compatible underlay, grid separation film and 0.2 mm protective PE film according to the floor build-up.',
      'Uhlíková fólie se zemněním': 'Grounded carbon heating film',
      'Zvýšená vlhkost': 'Increased humidity',
      'Varianta se zemněním je určená pro prostory, kde může vznikat vlhkost.': 'The grounded version is intended for areas where moisture may occur.',
      'Integrovaná zemnicí vrstva zvyšuje bezpečnost v koupelnách, technických místnostech, garážích nebo sklepech.': 'The integrated grounding layer improves safety in bathrooms, utility rooms, garages or basements.',
      'Fólie se zemněním': 'Grounded film',
      'Použijte pouze variantu a skladbu určenou výrobcem pro konkrétní podlahovou krytinu.': 'Use only the version and floor build-up approved by the manufacturer for the selected floor covering.',
      'Termostat s podlahovým čidlem pro každý samostatný okruh.': 'A thermostat with a floor sensor for each independently controlled circuit.',
      'Termostat s podlahovým čidlem pro každý samostatně řízený okruh.': 'A thermostat with a floor sensor for each independently controlled circuit.',
      'Připojení a zemnění': 'Connection and grounding',
      'Vodiče, konektory, izolaci a zemnicí prvek navrhne elektrikář podle konkrétní fólie a místních podmínek.': 'The electrician will specify wires, clips, insulation and the grounding element according to the selected film and local conditions.',
      'Ochranné vrstvy': 'Protective layers',
      'Podložka, separační a PE fólie dle doporučené skladby a požadavků na ochranu proti vlhkosti.': 'Underlay, separation film and PE film according to the recommended floor build-up and moisture protection requirements.',
      'Uhlíková fólie se zemněním pod beton nebo anhydrit': 'Grounded carbon heating film under concrete or anhydrite',
      'Vlhké prostory': 'Damp areas',
      'Fólie se zemněním je určená pro betonový nebo anhydritový potěr ve vlhkém prostoru.': 'Grounded film is intended for concrete or anhydrite screed in damp areas.',
      'Odolná uhlíková fólie pod beton nebo anhydrit': 'Durable carbon heating film under concrete or anhydrite',
      'Beton / anhydrit': 'Concrete / anhydrite',
      'Odolná fólie 150 W/m² je určená pod betonový nebo anhydritový potěr.': 'Durable 150 W/m² film is intended for installation under concrete or anhydrite screed.',
      'Zesílená metrážová fólie je vhodná tam, kde bude topný prvek chráněný v betonové nebo anhydritové vrstvě.': 'Reinforced cut-to-length film is suitable where the heating element will be protected in a concrete or anhydrite layer.',
      'Odolná topná fólie': 'Durable heating film',
      'Pásy navrhněte podle vytápěné plochy a dilatačních celků místnosti.': 'Design the strips according to the heated area and the room expansion zones.',
      'Termostat a podlahové čidlo pro každý samostatně řízený okruh.': 'A thermostat and floor sensor for each independently controlled circuit.',
      'Vodiče, konektory, izolační a butylová páska podle počtu pásů a připojovacích bodů.': 'Wires, clips, insulating tape and butyl tape according to the number of strips and connection points.',
      'Ochranná skladba': 'Protective floor build-up',
      'Rastrová separační fólie, PE fólie 0,2 mm a další vrstvy podle zvoleného potěru.': 'Grid separation film, 0.2 mm PE film and other layers required by the selected screed system.',
      'Odolná uhlíková fólie pod systémové desky': 'Durable carbon heating film under floor panels',
      'Systémové desky': 'Floor panels',
      'Odolná fólie 150 W/m² je vhodná do správně navržené suché skladby z podlahových desek.': 'Durable 150 W/m² film is suitable for a correctly designed dry floor panel build-up.',
      'Metrážová fólie umožňuje navrhnout jednotlivé pásy podle dispozice místnosti a rozměrů systémových desek.': 'Cut-to-length film makes it possible to design individual strips according to the room layout and panel dimensions.',
      'Šířku a délku pásů zvolte podle čisté vytápěné plochy a rastru desek.': 'Choose strip width and length according to the net heated area and the panel grid.',
      'Desková skladba': 'Panel floor build-up',
      'Separační, ochranné a roznášecí vrstvy musí odpovídat systému použitému výrobcem podlahových desek.': 'The separation, protection and load-distribution layers must comply with the floor panel manufacturer system.',
      'Topná rohož LARX · 160 W/m²': 'LARX heating mat · 160 W/m²',
      'Přímo pod dlažbu': 'Directly under tiles',
      'Tenká samolepicí rohož se instaluje přímo pod keramickou dlažbu.': 'The thin self-adhesive mat is installed directly under ceramic tiles.',
      'Hodí se pro koupelny, kuchyně a rekonstrukce, kde je důležitá malá stavební výška a rychlý náběh.': 'Suitable for bathrooms, kitchens and renovations where a low build-up and quick heat-up are important.',
      'Topná rohož': 'Heating mat',
      'Zvolte kombinaci dostupných velikostí tak, aby nepřesáhla skutečnou vytápěnou plochu. Topný kabel se nezkracuje.': 'Combine available sizes without exceeding the actual heated area. The heating cable must not be shortened.',
      'Termostat a čidlo': 'Thermostat and sensor',
      'Pokud je nemáte, vyberte jeden vhodný termostat s podlahovým čidlem pro každý okruh.': 'If you do not already have them, select one suitable thermostat with a floor sensor for each circuit.',
      'Instalační příprava': 'Installation preparation',
      'Chránička pro čidlo, penetrace a flexibilní lepidlo nebo stěrka vhodná pro podlahové vytápění.': 'Conduit for the sensor, primer and flexible adhesive or levelling compound suitable for underfloor heating.',
      'Elektroinstalace': 'Electrical installation',
      'Přívod, jištění a případný stykač se dimenzují podle celkového výkonu okruhu.': 'The supply cable, protection and any contactor must be sized for the total circuit output.',
      'Topná rohož LARX v sadě s termostatem': 'LARX heating mat set with thermostat',
      'Kompletní sada': 'Complete set',
      'Rohož 160 W/m² a termostat tvoří sladěný základ pro jeden regulovaný okruh.': 'The 160 W/m² mat and thermostat form a matched basis for one controlled circuit.',
      'Praktická volba pro jednu koupelnu nebo místnost, pokud termostat ještě nemáte.': 'A practical choice for one bathroom or room when you do not already have a thermostat.',
      'Sada rohože s termostatem': 'Heating mat set with thermostat',
      'Vyberte velikost rohože podle čisté plochy bez vany, sprchy a pevného nábytku.': 'Choose the mat size according to the net area excluding the bathtub, shower and fixed furniture.',
      'Další regulační zóny': 'Additional control zones',
      'Pro každý další nezávislý okruh potřebujete vlastní termostat a odpovídající rohož.': 'Each additional independent circuit requires its own thermostat and corresponding mat.',
      'Chránička pro podlahové čidlo, penetrace a flexibilní lepidlo či stěrka.': 'Conduit for the floor sensor, primer and flexible adhesive or levelling compound.',
      'Jištění, přívod a připojení musí odpovídat výkonu všech rohoží v okruhu.': 'Protection, supply and connection must match the output of all mats in the circuit.'
    },
    sk: {
      'Skládaná nebo plovoucí podlaha': 'Plávajúca alebo skladaná podlaha',
      'Laminát, vinyl click nebo dřevěná podlaha. Suchá instalace bez zalití.': 'Laminát, vinyl click alebo drevená podlaha. Suchá inštalácia bez zaliatia.',
      'Beton, anhydrit nebo podlahové desky': 'Betón, anhydrit alebo podlahové dosky',
      'Topný prvek bude chráněný v akumulační vrstvě nebo systémové desce.': 'Vykurovací prvok bude chránený v akumulačnej vrstve alebo systémovej doske.',
      'Dlažba': 'Dlažba',
      'Tenká topná rohož přímo pod dlažbu do flexibilního lepidla či stěrky.': 'Tenká vykurovacia rohož priamo pod dlažbu do flexibilného lepidla alebo stierky.',
      'Běžná suchá místnost': 'Bežná suchá miestnosť',
      'Obývací pokoj, ložnice, pracovna nebo chodba bez zvýšené vlhkosti.': 'Obývacia izba, spálňa, pracovňa alebo chodba bez zvýšenej vlhkosti.',
      'Prostor se zvýšenou vlhkostí': 'Priestor so zvýšenou vlhkosťou',
      'Koupelna, technická místnost, sklep či jiné místo, kde je nutné řešit uzemnění.': 'Kúpeľňa, technická miestnosť, pivnica alebo iné miesto, kde je potrebné riešiť uzemnenie.',
      'Beton nebo anhydrit': 'Betón alebo anhydrit',
      'Odolná fólie na metráž v akumulační vrstvě.': 'Odolná fólia na metráž v akumulačnej vrstve.',
      'Koupelny nebo vlhké prostory': 'Kúpeľne alebo vlhké priestory',
      'Koupelny, prádelny, technické místnosti a další prostory se zvýšenou vlhkostí.': 'Kúpeľne, práčovne, technické miestnosti a ďalšie priestory so zvýšenou vlhkosťou.',
      'Běžné prostory': 'Bežné priestory',
      'Obývací pokoje, ložnice, pracovny, chodby a další prostory bez zvýšené vlhkosti.': 'Obývacie izby, spálne, pracovne, chodby a ďalšie priestory bez zvýšenej vlhkosti.',
      'Systémové podlahové desky': 'Systémové podlahové dosky',
      'Odolná fólie na metráž v suché skladbě ze systémových desek.': 'Odolná fólia na metráž v suchej skladbe zo systémových dosiek.',
      'Samostatná topná rohož': 'Samostatná vykurovacia rohož',
      'Termostat už mám nebo jej chci vybrat samostatně.': 'Termostat už mám alebo ho chcem vybrať samostatne.',
      'Rohož v sadě s termostatem': 'Rohož v sade s termostatom',
      'Chci sladěnou sadu pro jeden samostatně regulovaný okruh.': 'Chcem zladenú sadu pre jeden samostatne regulovaný okruh.',
      'Uhlíková fólie pod skládanou krytinu': 'Uhlíková fólia pod plávajúcu krytinu',
      'Suchá instalace': 'Suchá inštalácia',
      'Pro běžné obytné místnosti se nejčastěji volí 80–100 W/m².': 'Pre bežné obytné miestnosti sa najčastejšie volí 80–100 W/m².',
      'Tenká metrážová fólie se pokládá pod vhodný laminát, vinyl click nebo dřevo a nezvyšuje výrazně skladbu podlahy.': 'Tenká metrážová fólia sa kladie pod vhodný laminát, vinyl click alebo drevo a výrazne nezvyšuje skladbu podlahy.',
      'Topná fólie': 'Vykurovacia fólia',
      'Metráž a šířku pásů zvolte podle skutečného půdorysu vytápěné plochy.': 'Metráž a šírku pásov zvoľte podľa skutočného pôdorysu vykurovanej plochy.',
      'Regulace': 'Regulácia',
      'Jeden vhodný termostat s podlahovým čidlem pro každý samostatně řízený okruh.': 'Jeden vhodný termostat s podlahovým snímačom pre každý samostatne riadený okruh.',
      'Připojení fólie': 'Pripojenie fólie',
      'Hnědý a modrý vodič, připojovací konektory a správná izolace hran i spojů.': 'Hnedý a modrý vodič, pripojovacie konektory a správna izolácia hrán aj spojov.',
      'Podlahová skladba': 'Skladba podlahy',
      'Kompatibilní podložka, rastrová separační fólie a ochranná PE fólie 0,2 mm podle skladby podlahy.': 'Kompatibilná podložka, rastrová separačná fólia a ochranná PE fólia 0,2 mm podľa skladby podlahy.',
      'Uhlíková fólie se zemněním': 'Uhlíková fólia s uzemnením',
      'Zvýšená vlhkost': 'Zvýšená vlhkosť',
      'Varianta se zemněním je určená pro prostory, kde může vznikat vlhkost.': 'Variant s uzemnením je určený pre priestory, kde môže vznikať vlhkosť.',
      'Integrovaná zemnicí vrstva zvyšuje bezpečnost v koupelnách, technických místnostech, garážích nebo sklepech.': 'Integrovaná uzemňovacia vrstva zvyšuje bezpečnosť v kúpeľniach, technických miestnostiach, garážach alebo pivniciach.',
      'Fólie se zemněním': 'Fólia s uzemnením',
      'Použijte pouze variantu a skladbu určenou výrobcem pro konkrétní podlahovou krytinu.': 'Použite iba variant a skladbu určenú výrobcom pre konkrétnu podlahovú krytinu.',
      'Termostat s podlahovým čidlem pro každý samostatný okruh.': 'Termostat s podlahovým snímačom pre každý samostatný okruh.',
      'Termostat s podlahovým čidlem pro každý samostatně řízený okruh.': 'Termostat s podlahovým snímačom pre každý samostatne regulovaný okruh.',
      'Připojení a zemnění': 'Pripojenie a uzemnenie',
      'Vodiče, konektory, izolaci a zemnicí prvek navrhne elektrikář podle konkrétní fólie a místních podmínek.': 'Vodiče, konektory, izoláciu a uzemňovací prvok navrhne elektrikár podľa konkrétnej fólie a miestnych podmienok.',
      'Ochranné vrstvy': 'Ochranné vrstvy',
      'Podložka, separační a PE fólie dle doporučené skladby a požadavků na ochranu proti vlhkosti.': 'Podložka, separačná a PE fólia podľa odporúčanej skladby a požiadaviek na ochranu proti vlhkosti.',
      'Uhlíková fólie se zemněním pod beton nebo anhydrit': 'Uhlíková fólia s uzemnením pod betón alebo anhydrit',
      'Vlhké prostory': 'Vlhké priestory',
      'Fólie se zemněním je určená pro betonový nebo anhydritový potěr ve vlhkém prostoru.': 'Fólia s uzemnením je určená pod betónový alebo anhydritový poter vo vlhkom priestore.',
      'Odolná uhlíková fólie pod beton nebo anhydrit': 'Odolná uhlíková fólia pod betón alebo anhydrit',
      'Beton / anhydrit': 'Betón / anhydrit',
      'Odolná fólie 150 W/m² je určená pod betonový nebo anhydritový potěr.': 'Odolná fólia 150 W/m² je určená pod betónový alebo anhydritový poter.',
      'Zesílená metrážová fólie je vhodná tam, kde bude topný prvek chráněný v betonové nebo anhydritové vrstvě.': 'Zosilnená metrážová fólia je vhodná tam, kde bude vykurovací prvok chránený v betónovej alebo anhydritovej vrstve.',
      'Odolná topná fólie': 'Odolná vykurovacia fólia',
      'Pásy navrhněte podle vytápěné plochy a dilatačních celků místnosti.': 'Pásy navrhnite podľa vykurovanej plochy a dilatačných celkov miestnosti.',
      'Termostat a podlahové čidlo pro každý samostatně řízený okruh.': 'Termostat a podlahový snímač pre každý samostatne riadený okruh.',
      'Vodiče, konektory, izolační a butylová páska podle počtu pásů a připojovacích bodů.': 'Vodiče, konektory, izolačná a butylová páska podľa počtu pásov a pripojovacích bodov.',
      'Ochranná skladba': 'Ochranná skladba',
      'Rastrová separační fólie, PE fólie 0,2 mm a další vrstvy podle zvoleného potěru.': 'Rastrová separačná fólia, PE fólia 0,2 mm a ďalšie vrstvy podľa zvoleného poteru.',
      'Odolná uhlíková fólie pod systémové desky': 'Odolná uhlíková fólia pod systémové dosky',
      'Systémové desky': 'Systémové dosky',
      'Odolná fólie 150 W/m² je vhodná do správně navržené suché skladby z podlahových desek.': 'Odolná fólia 150 W/m² je vhodná do správne navrhnutej suchej skladby z podlahových dosiek.',
      'Metrážová fólie umožňuje navrhnout jednotlivé pásy podle dispozice místnosti a rozměrů systémových desek.': 'Metrážová fólia umožňuje navrhnúť jednotlivé pásy podľa dispozície miestnosti a rozmerov systémových dosiek.',
      'Šířku a délku pásů zvolte podle čisté vytápěné plochy a rastru desek.': 'Šírku a dĺžku pásov zvoľte podľa čistej vykurovanej plochy a rastra dosiek.',
      'Desková skladba': 'Dosková skladba',
      'Separační, ochranné a roznášecí vrstvy musí odpovídat systému použitému výrobcem podlahových desek.': 'Separačné, ochranné a roznášacie vrstvy musia zodpovedať systému výrobcu podlahových dosiek.',
      'Topná rohož LARX · 160 W/m²': 'Vykurovacia rohož LARX · 160 W/m²',
      'Přímo pod dlažbu': 'Priamo pod dlažbu',
      'Tenká samolepicí rohož se instaluje přímo pod keramickou dlažbu.': 'Tenká samolepiaca rohož sa inštaluje priamo pod keramickú dlažbu.',
      'Hodí se pro koupelny, kuchyně a rekonstrukce, kde je důležitá malá stavební výška a rychlý náběh.': 'Hodí sa do kúpeľní, kuchýň a rekonštrukcií, kde je dôležitá malá stavebná výška a rýchly nábeh.',
      'Topná rohož': 'Vykurovacia rohož',
      'Zvolte kombinaci dostupných velikostí tak, aby nepřesáhla skutečnou vytápěnou plochu. Topný kabel se nezkracuje.': 'Zvoľte kombináciu dostupných veľkostí tak, aby nepresiahla skutočnú vykurovanú plochu. Vykurovací kábel sa neskracuje.',
      'Termostat a čidlo': 'Termostat a snímač',
      'Pokud je nemáte, vyberte jeden vhodný termostat s podlahovým čidlem pro každý okruh.': 'Ak ich nemáte, vyberte jeden vhodný termostat s podlahovým snímačom pre každý okruh.',
      'Instalační příprava': 'Príprava inštalácie',
      'Chránička pro čidlo, penetrace a flexibilní lepidlo nebo stěrka vhodná pro podlahové vytápění.': 'Chránička pre snímač, penetrácia a flexibilné lepidlo alebo stierka vhodná na podlahové vykurovanie.',
      'Elektroinstalace': 'Elektroinštalácia',
      'Přívod, jištění a případný stykač se dimenzují podle celkového výkonu okruhu.': 'Prívod, istenie a prípadný stýkač sa dimenzujú podľa celkového výkonu okruhu.',
      'Topná rohož LARX v sadě s termostatem': 'Vykurovacia rohož LARX v sade s termostatom',
      'Kompletní sada': 'Kompletná sada',
      'Rohož 160 W/m² a termostat tvoří sladěný základ pro jeden regulovaný okruh.': 'Rohož 160 W/m² a termostat tvoria zladený základ pre jeden regulovaný okruh.',
      'Praktická volba pro jednu koupelnu nebo místnost, pokud termostat ještě nemáte.': 'Praktická voľba pre jednu kúpeľňu alebo miestnosť, ak termostat ešte nemáte.',
      'Sada rohože s termostatem': 'Sada rohože s termostatom',
      'Vyberte velikost rohože podle čisté plochy bez vany, sprchy a pevného nábytku.': 'Vyberte veľkosť rohože podľa čistej plochy bez vane, sprchy a pevného nábytku.',
      'Další regulační zóny': 'Ďalšie regulačné zóny',
      'Pro každý další nezávislý okruh potřebujete vlastní termostat a odpovídající rohož.': 'Pre každý ďalší nezávislý okruh potrebujete vlastný termostat a zodpovedajúcu rohož.',
      'Chránička pro podlahové čidlo, penetrace a flexibilní lepidlo či stěrka.': 'Chránička pre podlahový snímač, penetrácia a flexibilné lepidlo alebo stierka.',
      'Jištění, přívod a připojení musí odpovídat výkonu všech rohoží v okruhu.': 'Istenie, prívod a pripojenie musia zodpovedať výkonu všetkých rohoží v okruhu.'
    }
  };

  function localizeData(value) {
    if (Array.isArray(value)) return value.map(localizeData);
    if (value && typeof value === 'object') {
      return Object.keys(value).reduce(function (result, key) {
        result[key] = localizeData(value[key]);
        return result;
      }, {});
    }
    if (typeof value === 'string' && LANGUAGE !== 'cs') return DATA_TRANSLATIONS[LANGUAGE][value] || value;
    return value;
  }

  var STRUCTURES = localizeData(BASE_STRUCTURES);
  var SOLUTIONS = localizeData(BASE_SOLUTIONS);
  var SCREED_ENVIRONMENTS = localizeData(BASE_SCREED_ENVIRONMENTS);
  var RESULTS = localizeData(BASE_RESULTS);

  var COPY = {
    cs: {
      pageTitle: 'Interaktivní průvodce objednávkou - LARX', heroEyebrow: 'Chytrý nástroj LARX', heroTitle: 'Interaktivní průvodce objednávkou',
      heroText: 'Vyberte skladbu podlahy a odpovězte na několik krátkých otázek. Doporučíme vhodný systém, orientační množství a přehled všeho, co budete potřebovat.',
      heroAria: 'Vlastnosti průvodce', features: ['3 krátké kroky', 'Bez registrace', 'Výsledek ihned'], progressAria: 'Průběh průvodce', progressTitle: 'Orientační výběr systému',
      pathAria: 'Postup průvodce', pathTitle: 'Váš výběr', reset: 'Vymazat výběr', pending: 'Čeká na výběr',
      stepLabels: ['Typ podlahy', 'Vhodná varianta', 'Rozměry a regulace', 'Doporučení'], stepOf: 'Krok {current} ze {total}',
      back: 'Zpět', continue: 'Pokračovat', showResult: 'Zobrazit doporučení',
      structureTitle: 'Co bude přímo nad vytápěním?', structureText: 'Vyberte konstrukci podlahy. Ta určuje vhodný topný prvek i potřebné ochranné vrstvy.', structureAria: 'Typ podlahové konstrukce',
      solutionAria: 'Varianta řešení', solutionHeadings: { tile: 'Chcete rohož samostatně, nebo s termostatem?', screed: 'Do jaké vrstvy bude fólie instalovaná?', floating: 'V jakém prostředí bude podlaha?' },
      solutionTexts: { tile: 'Rozměr rohože se volí podle čisté vytápěné plochy. Sada navíc obsahuje sladěný termostat.', screed: 'U betonu nebo anhydritu ještě zohledníme vlhkost prostoru. Pro systémové desky doporučíme odolnou fólii na metráž.', floating: 'Ve vlhkém prostoru je nutné zohlednit zemnění, ochranné pospojování a vhodnou skladbu.' },
      environmentEyebrow: 'Upřesnění pro beton nebo anhydrit', environmentTitle: 'V jakém prostoru bude podlaha?', environmentText: 'Podle prostředí doporučíme fólii se zemněním, nebo odolnou uhlíkovou fólii.', environmentAria: 'Typ prostoru',
      parameterTitle: 'Jak velká je čistá vytápěná plocha?', parameterText: 'Nezapočítávejte vanu, sprchový kout ani pevný nábytek s plným dnem. Každá samostatně regulovaná místnost obvykle tvoří vlastní okruh.',
      area: 'Vytápěná plocha', areaRange: '0,5 až 500 m²', zones: 'Počet regulačních okruhů', zonesHint: 'Obvykle jeden na místnost', pieces: 'ks',
      widthTitle: 'Předpokládaná šířka pásu', widthText: 'Pokud si nejste jistí, ponechte 0,5 m. V praxi lze pro lepší pokrytí kombinovat více šířek stejného výkonu a typu.', widthAria: 'Šířka fólie',
      areaError: 'Zadejte vytápěnou plochu od 0,5 do 500 m².', zonesError: 'Zadejte 1 až 20 celých regulačních okruhů.',
      approximate: 'cca', linearMetres: 'bm', filmWidth: 'fólie šířky {width} m', matsQuantity: 'rohoží v dostupných velikostech',
      resultEyebrow: 'Vaše orientační řešení', estimateAria: 'Orientační množství', heatedArea: 'Topná plocha', regulation: 'Regulace', regulationNote: 'počet potvrďte podle elektroprojektu',
      shoppingEyebrow: 'Co budete potřebovat', shoppingTitle: 'Nákupní a instalační seznam', nextEyebrow: 'Nejpřesnější další krok',
      filmNextTitle: 'Nechte si dopočítat spotřební materiál', matNextTitle: 'Vyberte rohož a regulaci',
      filmNextText: 'Nejprve vložte metrážovou fólii a termostaty do košíku. Potom v košíku použijte tlačítko Vypočítat spotřební materiál — množství vodičů, konektorů a pásek se dopočítá podle vybraného systému. U složitější dispozice využijte AI nacenění projektu.',
      matNextText: 'Vyberte velikost rohože tak, aby nepřesáhla čistou vytápěnou plochu. Pokud nekupujete sadu, přidejte termostat pro každý samostatný okruh. Lepidlo, penetraci a elektroinstalační materiál zvolte podle konkrétní skladby.',
      products: 'Vybrat doporučené produkty', thermostat: 'Vybrat termostat', consumables: 'Prohlédnout spotřební materiál',
      safetyTitle: 'Než objednáte', safetyText: 'Výsledek je orientační, nikoli elektroprojekt. Rozložení pásů, výkon, jištění, proudový chránič, zemnění a připojení k síti musí ověřit kvalifikovaný elektrikář.',
      aiQuote: 'AI nacenění složitějšího projektu', installation: 'Prohlédnout instalační návod', edit: 'Upravit parametry', restart: 'Začít znovu'
    },
    en: {
      pageTitle: 'Interactive ordering guide - LARX', heroEyebrow: 'Smart LARX tool', heroTitle: 'Interactive ordering guide',
      heroText: 'Select your floor build-up and answer a few short questions. We will recommend a suitable system, an approximate quantity and a list of what you will need.',
      heroAria: 'Guide features', features: ['3 short steps', 'No registration', 'Instant result'], progressAria: 'Guide progress', progressTitle: 'Preliminary system selection',
      pathAria: 'Guide steps', pathTitle: 'Your selection', reset: 'Clear selection', pending: 'Waiting for selection',
      stepLabels: ['Floor type', 'Suitable option', 'Dimensions and controls', 'Recommendation'], stepOf: 'Step {current} of {total}',
      back: 'Back', continue: 'Continue', showResult: 'Show recommendation',
      structureTitle: 'What will be directly above the heating?', structureText: 'Select the floor construction. It determines the suitable heating element and the required protective layers.', structureAria: 'Floor construction type',
      solutionAria: 'System option', solutionHeadings: { tile: 'Do you want a heating mat only or a set with a thermostat?', screed: 'Which layer will the film be installed in?', floating: 'What type of environment is the floor in?' },
      solutionTexts: { tile: 'The mat size is selected according to the net heated area. The set also includes a matched thermostat.', screed: 'For concrete or anhydrite, we also take the room humidity into account. For floor panel systems, we recommend durable cut-to-length film.', floating: 'In damp areas, grounding, protective bonding and a suitable floor build-up must be considered.' },
      environmentEyebrow: 'Concrete or anhydrite details', environmentTitle: 'What type of area is the floor in?', environmentText: 'The environment determines whether grounded film or durable carbon film is recommended.', environmentAria: 'Area type',
      parameterTitle: 'What is the net heated area?', parameterText: 'Exclude the bathtub, shower and fixed furniture with a solid base. Each independently controlled room normally forms its own circuit.',
      area: 'Heated area', areaRange: '0.5 to 500 m²', zones: 'Number of control circuits', zonesHint: 'Usually one per room', pieces: 'pcs',
      widthTitle: 'Expected strip width', widthText: 'If you are unsure, leave 0.5 m selected. In practice, several widths of the same output and type can be combined for better coverage.', widthAria: 'Film width',
      areaError: 'Enter a heated area from 0.5 to 500 m².', zonesError: 'Enter 1 to 20 whole control circuits.',
      approximate: 'approx.', linearMetres: 'lm', filmWidth: '{width} m wide film', matsQuantity: 'of mats in available sizes',
      resultEyebrow: 'Your preliminary solution', estimateAria: 'Approximate quantity', heatedArea: 'Heated area', regulation: 'Controls', regulationNote: 'confirm the number with the electrical design',
      shoppingEyebrow: 'What you will need', shoppingTitle: 'Shopping and installation list', nextEyebrow: 'Most accurate next step',
      filmNextTitle: 'Calculate the required installation materials', matNextTitle: 'Select the mat and controls',
      filmNextText: 'First add the required length of film and the thermostats to the basket. Then use Calculate installation materials in the basket — the required wires, clips and tapes will be calculated for the selected system. For a more complex layout, use the AI project quotation tool.',
      matNextText: 'Choose a mat size that does not exceed the net heated area. If you are not buying a set, add one thermostat for each independently controlled circuit. Select adhesive, primer and electrical materials according to the floor build-up.',
      products: 'Select recommended products', thermostat: 'Select a thermostat', consumables: 'View installation materials',
      safetyTitle: 'Before ordering', safetyText: 'The result is a guide, not an electrical design. Strip layout, output, circuit protection, RCD, grounding and the mains connection must be verified by a qualified electrician.',
      aiQuote: 'AI quotation for a complex project', installation: 'View the installation guide', edit: 'Edit parameters', restart: 'Start again'
    },
    sk: {
      pageTitle: 'Interaktívny sprievodca objednávkou - LARX', heroEyebrow: 'Inteligentný nástroj LARX', heroTitle: 'Interaktívny sprievodca objednávkou',
      heroText: 'Vyberte skladbu podlahy a odpovedzte na niekoľko krátkych otázok. Odporučíme vhodný systém, orientačné množstvo a prehľad všetkého, čo budete potrebovať.',
      heroAria: 'Vlastnosti sprievodcu', features: ['3 krátke kroky', 'Bez registrácie', 'Výsledok ihneď'], progressAria: 'Priebeh sprievodcu', progressTitle: 'Orientačný výber systému',
      pathAria: 'Postup sprievodcu', pathTitle: 'Váš výber', reset: 'Vymazať výber', pending: 'Čaká na výber',
      stepLabels: ['Typ podlahy', 'Vhodný variant', 'Rozmery a regulácia', 'Odporúčanie'], stepOf: 'Krok {current} zo {total}',
      back: 'Späť', continue: 'Pokračovať', showResult: 'Zobraziť odporúčanie',
      structureTitle: 'Čo bude priamo nad vykurovaním?', structureText: 'Vyberte konštrukciu podlahy. Tá určuje vhodný vykurovací prvok aj potrebné ochranné vrstvy.', structureAria: 'Typ podlahovej konštrukcie',
      solutionAria: 'Variant riešenia', solutionHeadings: { tile: 'Chcete samostatnú rohož alebo sadu s termostatom?', screed: 'Do akej vrstvy bude fólia inštalovaná?', floating: 'V akom prostredí bude podlaha?' },
      solutionTexts: { tile: 'Rozmer rohože sa volí podľa čistej vykurovanej plochy. Sada navyše obsahuje zladený termostat.', screed: 'Pri betóne alebo anhydrite zohľadníme aj vlhkosť priestoru. Pre systémové dosky odporučíme odolnú fóliu na metráž.', floating: 'Vo vlhkom priestore je potrebné zohľadniť uzemnenie, ochranné pospájanie a vhodnú skladbu.' },
      environmentEyebrow: 'Spresnenie pre betón alebo anhydrit', environmentTitle: 'V akom priestore bude podlaha?', environmentText: 'Podľa prostredia odporučíme fóliu s uzemnením alebo odolnú uhlíkovú fóliu.', environmentAria: 'Typ priestoru',
      parameterTitle: 'Aká veľká je čistá vykurovaná plocha?', parameterText: 'Nezapočítavajte vaňu, sprchovací kút ani pevný nábytok s plným dnom. Každá samostatne regulovaná miestnosť zvyčajne tvorí vlastný okruh.',
      area: 'Vykurovaná plocha', areaRange: '0,5 až 500 m²', zones: 'Počet regulačných okruhov', zonesHint: 'Zvyčajne jeden na miestnosť', pieces: 'ks',
      widthTitle: 'Predpokladaná šírka pásu', widthText: 'Ak si nie ste istí, ponechajte 0,5 m. V praxi je možné pre lepšie pokrytie kombinovať viac šírok rovnakého výkonu a typu.', widthAria: 'Šírka fólie',
      areaError: 'Zadajte vykurovanú plochu od 0,5 do 500 m².', zonesError: 'Zadajte 1 až 20 celých regulačných okruhov.',
      approximate: 'cca', linearMetres: 'bm', filmWidth: 'fólia so šírkou {width} m', matsQuantity: 'rohoží v dostupných veľkostiach',
      resultEyebrow: 'Vaše orientačné riešenie', estimateAria: 'Orientačné množstvo', heatedArea: 'Vykurovaná plocha', regulation: 'Regulácia', regulationNote: 'počet potvrďte podľa elektroprojektu',
      shoppingEyebrow: 'Čo budete potrebovať', shoppingTitle: 'Nákupný a inštalačný zoznam', nextEyebrow: 'Najpresnejší ďalší krok',
      filmNextTitle: 'Nechajte si dopočítať spotrebný materiál', matNextTitle: 'Vyberte rohož a reguláciu',
      filmNextText: 'Najprv vložte metrážovú fóliu a termostaty do košíka. Potom v košíku použite tlačidlo Vypočítať spotrebný materiál — množstvo vodičov, konektorov a pások sa dopočíta podľa vybraného systému. Pri zložitejšej dispozícii využite AI nacenenie projektu.',
      matNextText: 'Vyberte veľkosť rohože tak, aby nepresiahla čistú vykurovanú plochu. Ak nekupujete sadu, pridajte termostat pre každý samostatný okruh. Lepidlo, penetráciu a elektroinštalačný materiál zvoľte podľa konkrétnej skladby.',
      products: 'Vybrať odporúčané produkty', thermostat: 'Vybrať termostat', consumables: 'Prezrieť spotrebný materiál',
      safetyTitle: 'Pred objednaním', safetyText: 'Výsledok je orientačný, nie elektroprojekt. Rozloženie pásov, výkon, istenie, prúdový chránič, uzemnenie a pripojenie k sieti musí overiť kvalifikovaný elektrikár.',
      aiQuote: 'AI nacenenie zložitejšieho projektu', installation: 'Prezrieť inštalačný návod', edit: 'Upraviť parametre', restart: 'Začať znova'
    }
  }[LANGUAGE];

  var STEP_LABELS = COPY.stepLabels;
  var defaultState = {
    step: 0,
    structure: '',
    solution: '',
    environment: '',
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
    var environmentValid = restored.solution !== 'screedWetLayer' || SCREED_ENVIRONMENTS.some(function (item) { return item.key === restored.environment; });
    var selectionComplete = solutionValid && environmentValid;
    return {
      step: clamp(restored.step, 0, selectionComplete ? 3 : (structureValid ? 1 : 0)),
      structure: structureValid ? restored.structure : '',
      solution: solutionValid ? restored.solution : '',
      environment: solutionValid && restored.solution === 'screedWetLayer' && environmentValid ? restored.environment : '',
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
    return Number(value).toLocaleString(LOCALE, { maximumFractionDigits: 1 });
  }

  function interpolate(text, values) {
    return Object.keys(values).reduce(function (result, key) {
      return result.replace(new RegExp('\\{' + key + '\\}', 'g'), values[key]);
    }, text);
  }

  function thermostatWord(count) {
    if (LANGUAGE === 'en') return count === 1 ? 'thermostat' : 'thermostats';
    if (LANGUAGE === 'sk') return count === 1 ? 'termostat' : count < 5 ? 'termostaty' : 'termostatov';
    return count === 1 ? 'termostat' : count < 5 ? 'termostaty' : 'termostatů';
  }

  function circuitWord(count) {
    if (LANGUAGE === 'en') return count === 1 ? 'circuit' : 'circuits';
    if (LANGUAGE === 'sk') return count === 1 ? 'okruh' : count < 5 ? 'okruhy' : 'okruhov';
    return count === 1 ? 'okruh' : count < 5 ? 'okruhy' : 'okruhů';
  }

  function getStructure() {
    return STRUCTURES.find(function (item) { return item.key === state.structure; }) || null;
  }

  function getSolution() {
    return (SOLUTIONS[state.structure] || []).find(function (item) { return item.key === state.solution; }) || null;
  }

  function getEnvironment() {
    return SCREED_ENVIRONMENTS.find(function (item) { return item.key === state.environment; }) || null;
  }

  function solutionIsComplete() {
    if (!getSolution()) return false;
    return state.solution !== 'screedWetLayer' || Boolean(getEnvironment());
  }

  function getResult() {
    if (state.solution === 'screedWetLayer') {
      if (state.environment === 'screedDamp') return RESULTS.screedWetLayerDamp || null;
      if (state.environment === 'screedStandard') return RESULTS.screedWetLayer || null;
      return null;
    }
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
    if (index === 1) return getSolution() ? getSolution().title + (getEnvironment() ? ' · ' + getEnvironment().title : '') : '';
    if (index === 2 && solutionIsComplete()) return formatNumber(state.area) + ' m² · ' + state.zones + ' ' + circuitWord(state.zones);
    if (index === 3 && getResult()) return getResult().title;
    return '';
  }

  function maximumAvailableStep() {
    if (!state.structure) return 0;
    if (!solutionIsComplete()) return 1;
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
            (value ? '<small>' + escapeHtml(value) + '</small>' : '<small>' + escapeHtml(COPY.pending) + '</small>') +
          '</span>' +
        '</' + tag + '>' +
      '</li>';
    }).join('');
  }

  function optionMarkup(item, selected, dataAttribute) {
    dataAttribute = dataAttribute || 'data-guide-option';
    return '<button type="button" class="larx-guide__option' + (selected ? ' is-selected' : '') + '" ' + dataAttribute + '="' + escapeHtml(item.key) + '" aria-pressed="' + (selected ? 'true' : 'false') + '">' +
      '<span class="larx-guide__option-icon">' + ICONS[item.icon] + '</span>' +
      '<span class="larx-guide__option-copy"><strong>' + escapeHtml(item.title) + '</strong><small>' + escapeHtml(item.text) + '</small></span>' +
      '<span class="larx-guide__check" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m6 12 4 4 8-9"></path></svg></span>' +
    '</button>';
  }

  function navigationMarkup(canContinue, isLastQuestion) {
    return '<div class="larx-guide__navigation">' +
      (state.step > 0 ? '<button type="button" class="larx-guide__back" data-guide-back><span aria-hidden="true">←</span> ' + escapeHtml(COPY.back) + '</button>' : '<span></span>') +
      '<button type="button" class="larx-guide__next" data-guide-next' + (canContinue ? '' : ' disabled') + '>' +
        escapeHtml(isLastQuestion ? COPY.showResult : COPY.continue) + '<span aria-hidden="true">→</span>' +
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
    return questionHeader(interpolate(COPY.stepOf, { current: 1, total: 3 }), COPY.structureTitle, COPY.structureText) +
      '<div class="larx-guide__options has-three" role="group" aria-label="' + escapeHtml(COPY.structureAria) + '">' +
        STRUCTURES.map(function (item) { return optionMarkup(item, state.structure === item.key); }).join('') +
      '</div>' + navigationMarkup(Boolean(state.structure), false);
  }

  function renderSolutionStep() {
    var options = SOLUTIONS[state.structure] || [];
    var heading = COPY.solutionHeadings[state.structure];
    var intro = COPY.solutionTexts[state.structure];
    return questionHeader(interpolate(COPY.stepOf, { current: 2, total: 3 }), heading, intro) +
      '<div class="larx-guide__options' + (options.length === 3 ? ' has-three' : '') + '" role="group" aria-label="' + escapeHtml(COPY.solutionAria) + '">' +
        options.map(function (item) { return optionMarkup(item, state.solution === item.key); }).join('') +
      '</div>' + renderEnvironmentFollowup() + navigationMarkup(solutionIsComplete(), false);
  }

  function renderEnvironmentFollowup() {
    if (state.structure !== 'screed' || state.solution !== 'screedWetLayer') return '';
    return '<section class="larx-guide__followup" aria-labelledby="larx-guide-environment-title">' +
      '<div class="larx-guide__followup-head"><p class="larx-guide__question-eyebrow">' + escapeHtml(COPY.environmentEyebrow) + '</p>' +
        '<h3 id="larx-guide-environment-title">' + escapeHtml(COPY.environmentTitle) + '</h3><p>' + escapeHtml(COPY.environmentText) + '</p></div>' +
      '<div class="larx-guide__options larx-guide__options--followup" role="group" aria-label="' + escapeHtml(COPY.environmentAria) + '">' +
        SCREED_ENVIRONMENTS.map(function (item) { return optionMarkup(item, state.environment === item.key, 'data-guide-environment'); }).join('') +
      '</div>' +
    '</section>';
  }

  function renderWidthSelector() {
    var widths = getAllowedWidths();
    if (widths.length) {
      return '<fieldset class="larx-guide__width"><legend>' + escapeHtml(COPY.widthTitle) + '</legend>' +
        '<p>' + escapeHtml(COPY.widthText) + '</p>' +
        '<div role="group" aria-label="' + escapeHtml(COPY.widthAria) + '">' + widths.map(function (width) {
          var selected = Number(state.width) === width;
          return '<button type="button" data-guide-width="' + width + '" class="' + (selected ? 'is-selected' : '') + '" aria-pressed="' + (selected ? 'true' : 'false') + '">' + formatNumber(width) + ' m</button>';
        }).join('') + '</div></fieldset>';
    }
    return '';
  }

  function renderParametersStep() {
    return questionHeader(interpolate(COPY.stepOf, { current: 3, total: 3 }), COPY.parameterTitle, COPY.parameterText) +
      '<div class="larx-guide__parameters">' +
        '<label class="larx-guide__field" for="larx-guide-area"><span>' + escapeHtml(COPY.area) + '</span><small>' + escapeHtml(COPY.areaRange) + '</small><span class="larx-guide__input"><input id="larx-guide-area" data-guide-area type="number" min="0.5" max="500" step="0.5" inputmode="decimal" value="' + escapeHtml(state.area) + '"><em>m²</em></span></label>' +
        '<label class="larx-guide__field" for="larx-guide-zones"><span>' + escapeHtml(COPY.zones) + '</span><small>' + escapeHtml(COPY.zonesHint) + '</small><span class="larx-guide__input"><input id="larx-guide-zones" data-guide-zones type="number" min="1" max="20" step="1" inputmode="numeric" value="' + escapeHtml(state.zones) + '"><em>' + escapeHtml(COPY.pieces) + '</em></span></label>' +
      '</div>' + renderWidthSelector() +
      '<p class="larx-guide__validation" data-guide-validation role="alert" hidden></p>' +
      navigationMarkup(true, true);
  }

  function quantityMarkup(result) {
    if (result.widths) {
      var metres = Math.ceil((state.area / state.width) * 10) / 10;
      return '<strong>' + escapeHtml(COPY.approximate) + ' ' + formatNumber(metres) + ' ' + escapeHtml(COPY.linearMetres) + '</strong><span>' + escapeHtml(interpolate(COPY.filmWidth, { width: formatNumber(state.width) })) + '</span>';
    }
    return '<strong>' + escapeHtml(COPY.approximate) + ' ' + formatNumber(state.area) + ' m²</strong><span>' + escapeHtml(COPY.matsQuantity) + '</span>';
  }

  function renderResultStep() {
    var result = getResult();
    if (!result) return renderStructureStep();
    var primaryHref = ROUTES[result.route];
    var zoneText = state.zones + ' ' + thermostatWord(state.zones) + ' · ' + state.zones + ' ' + circuitWord(state.zones);
    var isFilm = Boolean(result.widths);
    var nextStepTitle = isFilm ? COPY.filmNextTitle : COPY.matNextTitle;
    var nextStepText = isFilm ? COPY.filmNextText : COPY.matNextText;
    var itemMarkup = result.items.map(function (item, index) {
      return '<li><span>' + (index + 1) + '</span><div><strong>' + escapeHtml(item[0]) + '</strong><p>' + escapeHtml(item[1]) + '</p></div></li>';
    }).join('');

    return '<div class="larx-guide__result" data-guide-result="' + escapeHtml(result.key) + '">' +
      '<div class="larx-guide__result-head" tabindex="-1">' +
        '<div><p class="larx-guide__question-eyebrow">' + escapeHtml(COPY.resultEyebrow) + '</p><span class="larx-guide__result-badge">' + escapeHtml(result.badge) + '</span><h2>' + escapeHtml(result.title) + '</h2><p>' + escapeHtml(result.why) + '</p></div>' +
        '<div class="larx-guide__result-symbol" aria-hidden="true">' + ICONS[getEnvironment() ? getEnvironment().icon : getSolution().icon] + '</div>' +
      '</div>' +
      '<div class="larx-guide__estimate" aria-label="' + escapeHtml(COPY.estimateAria) + '">' +
        '<div><small>' + escapeHtml(COPY.heatedArea) + '</small>' + quantityMarkup(result) + '</div>' +
        '<div><small>' + escapeHtml(COPY.regulation) + '</small><strong>' + escapeHtml(zoneText) + '</strong><span>' + escapeHtml(COPY.regulationNote) + '</span></div>' +
      '</div>' +
      '<p class="larx-guide__power"><span aria-hidden="true">i</span>' + escapeHtml(result.power) + '</p>' +
      '<section class="larx-guide__shopping"><div class="larx-guide__section-head"><p class="larx-guide__question-eyebrow">' + escapeHtml(COPY.shoppingEyebrow) + '</p><h3>' + escapeHtml(COPY.shoppingTitle) + '</h3></div><ol>' + itemMarkup + '</ol></section>' +
      '<section class="larx-guide__cart-flow"><div><p class="larx-guide__question-eyebrow">' + escapeHtml(COPY.nextEyebrow) + '</p><h3>' + escapeHtml(nextStepTitle) + '</h3><p>' + escapeHtml(nextStepText) + '</p></div>' +
        '<div class="larx-guide__result-actions"><a class="larx-guide__button is-primary" data-guide-primary href="' + primaryHref + '">' + escapeHtml(COPY.products) + ' <span aria-hidden="true">→</span></a><a class="larx-guide__button is-secondary" href="' + ROUTES.thermostats + '">' + escapeHtml(COPY.thermostat) + '</a><a class="larx-guide__text-link" href="' + ROUTES.consumables + '">' + escapeHtml(COPY.consumables) + '</a></div>' +
      '</section>' +
      '<aside class="larx-guide__safety"><strong>' + escapeHtml(COPY.safetyTitle) + '</strong><p>' + escapeHtml(COPY.safetyText) + '</p><div><a href="' + ROUTES.aiQuote + '">' + escapeHtml(COPY.aiQuote) + '</a><a href="' + ROUTES.installation + '" target="_blank" rel="noopener">' + escapeHtml(COPY.installation) + '</a></div></aside>' +
      '<div class="larx-guide__result-footer"><button type="button" class="larx-guide__back" data-guide-back><span aria-hidden="true">←</span> ' + escapeHtml(COPY.edit) + '</button><button type="button" class="larx-guide__reset" data-guide-reset>' + escapeHtml(COPY.restart) + '</button></div>' +
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
    root.querySelector('[data-guide-progress-label]').textContent = interpolate(COPY.stepOf, { current: state.step + 1, total: 4 });
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
        state.environment = '';
        state.width = 0.5;
      }
    } else if (state.step === 1) {
      if (state.solution !== key) state.environment = '';
      state.solution = key;
      if (key !== 'screedWetLayer') state.environment = '';
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
    if (!isFinite(area) || area < 0.5 || area > 500) errors.push(COPY.areaError);
    if (!isFinite(zones) || zones < 1 || zones > 20 || Math.round(zones) !== zones) errors.push(COPY.zonesError);
    if (errors.length) {
      validation.textContent = errors.join(' ');
      validation.hidden = false;
      (errors[0] === COPY.areaError ? areaInput : zonesInput).focus();
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
    root.querySelectorAll('[data-guide-environment]').forEach(function (button) {
      button.addEventListener('click', function () {
        state.environment = button.getAttribute('data-guide-environment');
        normalizeWidth();
        render(false);
      });
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
      if (state.step === 1 && !solutionIsComplete()) return;
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
  document.title = COPY.pageTitle;
  root.setAttribute('data-larx-order-guide-language', LANGUAGE);

  root.innerHTML = [
    '<section class="larx-guide" aria-labelledby="larx-guide-title">',
      '<header class="larx-guide__hero">',
        '<div><p class="larx-guide__eyebrow">' + escapeHtml(COPY.heroEyebrow) + '</p><h1 id="larx-guide-title">' + escapeHtml(COPY.heroTitle) + '</h1><p>' + escapeHtml(COPY.heroText) + '</p></div>',
        '<ul aria-label="' + escapeHtml(COPY.heroAria) + '">' + COPY.features.map(function (feature) { return '<li><span>✓</span> ' + escapeHtml(feature) + '</li>'; }).join('') + '</ul>',
      '</header>',
      '<div class="larx-guide__mobile-progress" data-guide-progress role="progressbar" aria-label="' + escapeHtml(COPY.progressAria) + '" aria-valuemin="0" aria-valuemax="100" aria-valuenow="25"><div><span data-guide-progress-label>' + escapeHtml(interpolate(COPY.stepOf, { current: 1, total: 4 })) + '</span><strong>' + escapeHtml(COPY.progressTitle) + '</strong></div><i><span data-guide-progress-bar></span></i></div>',
      '<div class="larx-guide__workspace">',
        '<aside class="larx-guide__path" aria-label="' + escapeHtml(COPY.pathAria) + '"><p>' + escapeHtml(COPY.pathTitle) + '</p><ol data-guide-path></ol><button type="button" data-guide-reset>' + escapeHtml(COPY.reset) + '</button></aside>',
        '<div class="larx-guide__panel" data-guide-content aria-live="polite"></div>',
      '</div>',
    '</section>'
  ].join('');

  render(false);
  root.setAttribute('data-larx-order-guide-ready', 'true');
}(window, document));
