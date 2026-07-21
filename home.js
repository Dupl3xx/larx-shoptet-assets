(function () {
  'use strict';

  var VERSION = '1.1.4';
  var HOME_CLASS = 'larx-home-redesign';
  var READY_CLASS = 'larx-redesign-ready';
  var DEFAULT_TOOL_URLS = {
    calculator: {
      cs: 'https://www.larx.cz/kalkulacka-nakladu-na-vytapeni/',
      sk: 'https://www.larx.cz/sk/kalkulacka-nakladov-na-vykurovanie/',
      en: 'https://www.larx.cz/en/heating-cost-calculator/'
    },
    guide: 'https://www.uhlikovefolie.cz/instalacni-manual',
    quote: {
      cs: 'https://www.larx.cz/automaticke-naceneni-projektu-pomoci-ai/',
      sk: 'https://www.larx.cz/sk/automaticke-nacenenie-projektu-pomocou-ai/',
      en: 'https://www.larx.cz/en/automatic-project-pricing-using-ai/'
    }
  };
  var CATEGORY_CARDS = [
    {
      key: 'mats',
      image: 'https://cdn.myshoptet.com/usr/www.larx.cz/user/shop/detail/106_larx-heating-mat-lsdts-topna-rohoz--0-5--2-m-1-m---160-w.png',
      href: { cs: '/topne-rohoze/', sk: '/sk/vykurovacie-rohoze/', en: '/en/heating-mats/' }
    },
    {
      key: 'films',
      image: 'https://cdn.myshoptet.com/usr/www.larx.cz/user/shop/detail/166_uhlikova-folie-2.png',
      href: { cs: '/topne-folie/', sk: '/sk/vykurovacie-folie/', en: '/en/heating-films/' }
    },
    {
      key: 'kit',
      image: 'https://cdn.myshoptet.com/usr/www.larx.cz/user/shop/detail/193-3_eco-kategorie-b.png',
      href: { cs: '/larx-carbon-kit/', sk: '/sk/larx-carbon-kit/', en: '/en/larx-carbon-kit/' }
    },
    {
      key: 'thermostats',
      image: 'https://cdn.myshoptet.com/usr/www.larx.cz/user/shop/detail/112_product-wifi-termostat-larx-crop.png',
      href: { cs: '/termostaty/', sk: '/sk/termostaty/', en: '/en/termostaty/' }
    }
  ];
  var CATEGORY_COPY = {
    cs: {
      label: 'Nejoblíbenější kategorie',
      titles: { mats: 'Topné rohože', films: 'Topné fólie', kit: 'LARX Carbon Kit', thermostats: 'Termostaty' }
    },
    sk: {
      label: 'Najobľúbenejšie kategórie',
      titles: { mats: 'Vykurovacie rohože', films: 'Vykurovacie fólie', kit: 'LARX Carbon Kit', thermostats: 'Termostaty' }
    },
    en: {
      label: 'Popular categories',
      titles: { mats: 'Heating mats', films: 'Heating films', kit: 'LARX Carbon Kit', thermostats: 'Thermostats' }
    }
  };

  var COPY = {
    cs: {
      heroTitle: 'Elektrické podlahové vytápění LARX',
      heroText: 'Uhlíkové fólie, topné rohože a moderní technologie pro váš projekt.',
      hornbach: 'Skladem v prodejnách Hornbach po celé ČR a SR',
      heroCta: 'Prohlédnout produkty',
      toolsTitle: 'Chytré nástroje LARX',
      unavailable: 'Tento nástroj právě připravujeme. Jakmile bude hotový, karta se aktivuje doplněním jeho adresy.',
      preparing: 'Připravujeme',
      tools: {
        calculator: {
          title: 'Kalkulačka nákladů na vytápění',
          description: 'Spočítejte si náklady a úsporu na pár kliknutí.'
        },
        guide: {
          title: 'Interaktivní průvodce objednávkou',
          description: 'Krok za krokem k té správné fólii či rohoži.'
        },
        quote: {
          title: 'AI nacenění Vašeho projektu',
          description: 'Nahrajte půdorys a získejte kalkulaci na míru.'
        }
      },
      groups: {
        mats: { title: 'Topné rohože', eyebrow: 'Skladem & ihned k odeslání' },
        films: { title: 'Topné fólie', eyebrow: 'Ultratenké · 0,4 mm' },
        recommended: { title: 'Doporučujeme', eyebrow: 'Vybráno pro vás' }
      },
      kinds: {
        thermostatSet: 'Sada s termostatem',
        heatingMat: 'Topná rohož',
        carbonKitEco: 'Carbon Kit Eco',
        carbonKit: 'Carbon Kit',
        groundedFilm: 'Fólie se zemněním',
        durableFilm: 'Odolná fólie',
        heatingFilm: 'Uhlíková fólie',
        product: 'Produkt LARX'
      },
      aboutTitle: 'Jsme LARX',
      aboutHtml: '<strong>Malá technologická firma</strong>, která se specializuje na moderní a úsporné elektrické vytápění - uhlíkové topné fólie, topné rohože a termostaty pro ČR i EU. Naše produkty jsou efektivní, snadno instalovatelné a vysoce kvalitní. Osobně zaručujeme jejich spolehlivost a dohled nad výrobou v Jižní Koreji.',
      aboutCta: 'Přečíst celý příběh',
      partnersTitle: 'Spolupracujeme s partnery',
      partnersClaim: 'Skladem v prodejnách Hornbach po celé ČR a SR',
      magazine: 'Magazín',
      blogTitle: 'Nejnovější články'
    },
    sk: {
      heroTitle: 'Elektrické podlahové vykurovanie LARX',
      heroText: 'Uhlíkové fólie, vykurovacie rohože a moderné technológie pre váš projekt.',
      hornbach: 'Skladom v predajniach Hornbach po celej ČR a SR',
      heroCta: 'Prezrieť produkty',
      toolsTitle: 'Inteligentné nástroje LARX',
      unavailable: 'Tento nástroj práve pripravujeme. Po dokončení sa karta aktivuje doplnením jeho adresy.',
      preparing: 'Pripravujeme',
      tools: {
        calculator: {
          title: 'Kalkulačka nákladov na vykurovanie',
          description: 'Vypočítajte si ročné náklady a úsporu za pár kliknutí.'
        },
        guide: {
          title: 'Interaktívny sprievodca objednávkou',
          description: 'Krok za krokom k správnej fólii alebo rohoži.'
        },
        quote: {
          title: 'AI cenová kalkulácia',
          description: 'Nahrajte pôdorys a získajte kalkuláciu na mieru.'
        }
      },
      groups: {
        mats: { title: 'Vykurovacie rohože', eyebrow: 'Skladom & ihneď na odoslanie' },
        films: { title: 'Vykurovacie fólie', eyebrow: 'Ultratenké · 0,4 mm' },
        recommended: { title: 'Odporúčame', eyebrow: 'Vybrané pre vás' }
      },
      kinds: {
        thermostatSet: 'Súprava s termostatom',
        heatingMat: 'Vykurovacia rohož',
        carbonKitEco: 'Carbon Kit Eco',
        carbonKit: 'Carbon Kit',
        groundedFilm: 'Fólia s uzemnením',
        durableFilm: 'Odolná fólia',
        heatingFilm: 'Uhlíková fólia',
        product: 'Produkt LARX'
      },
      aboutTitle: 'Sme LARX',
      aboutHtml: '<strong>Malá technologická firma</strong>, ktorá sa špecializuje na moderné a úsporné elektrické vykurovanie - uhlíkové vykurovacie fólie, vykurovacie rohože a termostaty pre ČR, SR a EÚ. Naše produkty sú efektívne, ľahko inštalovateľné a vysoko kvalitné. Osobne ručíme za ich spoľahlivosť a dohľad nad výrobou v Južnej Kórei.',
      aboutCta: 'Prečítať celý príbeh',
      partnersTitle: 'Spolupracujeme s partnermi',
      partnersClaim: 'Skladom v predajniach Hornbach po celej ČR a SR',
      magazine: 'Magazín',
      blogTitle: 'Najnovšie články'
    },
    en: {
      heroTitle: 'LARX electric underfloor heating',
      heroText: 'Carbon heating films, heating mats and modern technology for your project.',
      hornbach: 'Available in Hornbach stores across the Czech Republic and Slovakia',
      heroCta: 'Browse products',
      toolsTitle: 'Smart LARX tools',
      unavailable: 'This tool is currently being prepared. Once it is ready, the card can be activated by adding its URL.',
      preparing: 'Coming soon',
      tools: {
        calculator: {
          title: 'Heating cost calculator',
          description: 'Estimate annual heating costs and savings in a few clicks.'
        },
        guide: {
          title: 'Interactive ordering guide',
          description: 'Find the right heating film or mat step by step.'
        },
        quote: {
          title: 'AI quotation tool',
          description: 'Upload a floor plan and request a tailored calculation.'
        }
      },
      groups: {
        mats: { title: 'Heating mats', eyebrow: 'In stock & ready to ship' },
        films: { title: 'Heating films', eyebrow: 'Ultra-thin · 0.4 mm' },
        recommended: { title: 'We recommend', eyebrow: 'Selected for you' }
      },
      kinds: {
        thermostatSet: 'Set with thermostat',
        heatingMat: 'Heating mat',
        carbonKitEco: 'Carbon Kit Eco',
        carbonKit: 'Carbon Kit',
        groundedFilm: 'Grounded film',
        durableFilm: 'Durable film',
        heatingFilm: 'Carbon heating film',
        product: 'LARX product'
      },
      aboutTitle: 'We are LARX',
      aboutHtml: '<strong>A small technology company</strong> specialising in modern, efficient electric heating - carbon heating films, heating mats and thermostats for customers across Europe. Our products are effective, easy to install and manufactured to a high standard. We personally oversee their reliability and production in South Korea.',
      aboutCta: 'Read our story',
      partnersTitle: 'Our retail partners',
      partnersClaim: 'Available in Hornbach stores across the Czech Republic and Slovakia',
      magazine: 'Magazine',
      blogTitle: 'Latest articles'
    }
  };

  var ICONS = {
    calculator: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="2.5" width="14" height="19" rx="2.5"></rect><path d="M8 6h8v4H8zM8.5 14h.01M12 14h.01M15.5 14h.01M8.5 17.5h.01M12 17.5h.01M15.5 17.5h.01"></path></svg>',
    guide: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="3" width="16" height="18" rx="2.5"></rect><path d="m7.5 8 1.4 1.4L11.5 7M13 8.5h3.5m-9 6 1.4 1.4 2.6-2.4M13 15h3.5"></path></svg>',
    quote: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 5.5A2.5 2.5 0 0 1 6 3h12a2.5 2.5 0 0 1 2.5 2.5v10A2.5 2.5 0 0 1 18 18H9l-4.5 3v-3.7a2.5 2.5 0 0 1-1-2z"></path><path d="M8 8h8M8 12h5"></path><circle cx="17.5" cy="16.5" r="3"></circle><path d="M17.5 15v3M16 16.5h3"></path></svg>'
  };

  function getLanguage() {
    var lang = (document.documentElement.lang || '').toLowerCase().slice(0, 2);
    if (COPY[lang]) return lang;
    if (document.body.classList.contains('sk')) return 'sk';
    if (document.body.classList.contains('en')) return 'en';
    return 'cs';
  }

  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (typeof text === 'string') node.textContent = text;
    return node;
  }

  function buildCategories(language) {
    var existing = document.getElementById('larx-topcats');
    window.__LARX_TOPCATS_INIT__ = true;
    if (existing) {
      decorateCategories();
      return existing;
    }

    var header = document.getElementById('header');
    if (!header) return null;

    var localized = CATEGORY_COPY[language] || CATEGORY_COPY.cs;
    var section = element('section', 'larx-redesign-categories');
    section.id = 'larx-topcats';
    section.setAttribute('aria-label', localized.label);

    var container = element('div', 'larx-topcats__container');
    CATEGORY_CARDS.forEach(function (category) {
      var title = localized.titles[category.key] || CATEGORY_COPY.cs.titles[category.key];
      var card = element('a', 'larx-card');
      card.href = category.href[language] || category.href.cs;
      card.setAttribute('aria-label', title);

      var imageWrap = element('span', 'larx-card__imgwrap');
      var image = element('img', 'larx-card__img');
      image.src = category.image;
      image.alt = title;
      image.loading = 'lazy';
      image.decoding = 'async';
      imageWrap.appendChild(image);

      card.appendChild(imageWrap);
      card.appendChild(element('span', 'larx-card__title', title));
      container.appendChild(card);
    });
    section.appendChild(container);

    var spacerTop = element('div');
    spacerTop.id = 'larx-topcats-spacer';
    spacerTop.style.height = '28px';
    var spacerBottom = element('div');
    spacerBottom.id = 'larx-topcats-spacer-bottom';
    spacerBottom.style.height = '28px';

    header.insertAdjacentElement('afterend', spacerTop);
    spacerTop.insertAdjacentElement('afterend', section);
    section.insertAdjacentElement('afterend', spacerBottom);
    return section;
  }

  function validUrl(value) {
    if (!value || typeof value !== 'string') return '';
    try {
      var url = new URL(value, window.location.origin);
      if (url.protocol !== 'http:' && url.protocol !== 'https:') return '';
      return url.href;
    } catch (error) {
      return '';
    }
  }

  function getToolUrls() {
    var config = window.LARX_HOME_CONFIG || {};
    var urls = config.toolUrls || {};
    var language = getLanguage();

    function localizedUrl(value) {
      if (value && typeof value === 'object') {
        value = value[language] || value.cs || '';
      }
      return validUrl(value);
    }

    return {
      calculator: localizedUrl(urls.calculator) || localizedUrl(DEFAULT_TOOL_URLS.calculator),
      guide: localizedUrl(urls.guide) || localizedUrl(DEFAULT_TOOL_URLS.guide),
      quote: localizedUrl(urls.quote) || localizedUrl(DEFAULT_TOOL_URLS.quote)
    };
  }

  function showToast(message) {
    var toast = document.getElementById('larx-redesign-toast');
    if (!toast) {
      toast = element('div', 'larx-toast');
      toast.id = 'larx-redesign-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      toast.setAttribute('aria-atomic', 'true');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 5000);
  }

  function buildToolCard(key, copy, href) {
    var card = href ? element('a', 'larx-tool-card') : element('button', 'larx-tool-card is-unavailable');
    card.dataset.larxTool = key;
    if (href) {
      card.href = href;
      card.target = '_blank';
      card.rel = 'noopener';
    } else {
      card.type = 'button';
      card.setAttribute('aria-disabled', 'true');
      card.addEventListener('click', function () {
        showToast(copy.unavailable);
      });
    }

    var icon = element('span', 'larx-tool-icon');
    icon.innerHTML = ICONS[key];
    var content = element('span', 'larx-tool-content');
    content.appendChild(element('span', 'larx-tool-title', copy.tools[key].title));
    content.appendChild(element('span', 'larx-tool-description', copy.tools[key].description));

    if (!href) {
      content.appendChild(element('span', 'larx-tool-preparing', copy.preparing));
    }

    if (copy.tools[key].badge) {
      card.appendChild(element('span', 'larx-tool-badge', copy.tools[key].badge));
    }

    card.appendChild(icon);
    card.appendChild(content);
    card.appendChild(element('span', 'larx-tool-arrow', '→'));
    return card;
  }

  function buildHero(main, copy) {
    var existing = document.getElementById('larx-redesign-hero');
    if (existing) return existing;

    var original = main.querySelector(':scope > .banners-row');
    if (!original) return null;

    var section = element('section', 'larx-hero-layout');
    section.id = 'larx-redesign-hero';

    var hero = element('div', 'larx-hero');
    var title = element('h1', 'larx-hero-title', copy.heroTitle);
    var description = element('p', 'larx-hero-description', copy.heroText);
    var availability = element('p', 'larx-hero-availability', copy.hornbach);
    var cta = element('a', 'larx-hero-cta', copy.heroCta);
    cta.href = '#larx-products-mats';

    hero.appendChild(title);
    hero.appendChild(description);
    hero.appendChild(availability);
    hero.appendChild(cta);

    var tools = element('aside', 'larx-tools');
    tools.setAttribute('aria-labelledby', 'larx-tools-title');
    var toolsTitle = element('h2', 'larx-tools-heading', copy.toolsTitle);
    toolsTitle.id = 'larx-tools-title';
    tools.appendChild(toolsTitle);

    var toolUrls = getToolUrls();
    ['calculator', 'guide', 'quote'].forEach(function (key) {
      tools.appendChild(buildToolCard(key, copy, toolUrls[key]));
    });

    section.appendChild(hero);
    section.appendChild(tools);
    original.parentNode.insertBefore(section, original);
    original.classList.add('larx-original-hero');
    original.setAttribute('aria-hidden', 'true');
    return section;
  }

  function decorateGroup(selector, id, groupCopy, extraClass) {
    var heading = document.querySelector(selector);
    if (!heading) return null;
    heading.id = id;
    heading.textContent = groupCopy.title;
    heading.dataset.larxEyebrow = groupCopy.eyebrow;
    heading.classList.add('larx-section-heading');
    heading.setAttribute('role', 'heading');
    heading.setAttribute('aria-level', '2');
    if (extraClass) heading.classList.add(extraClass + '-heading');

    var products = heading.nextElementSibling;
    if (products && products.classList.contains('products-wrapper')) {
      products.classList.add('larx-products-wrapper');
      if (extraClass) products.classList.add(extraClass + '-products');
    }
    return products;
  }

  function kindForName(name, kinds) {
    var text = name.toLowerCase();
    if (/termostat|thermostat/.test(text) && /sada|set|súprava/.test(text)) return kinds.thermostatSet;
    if (/carbon kit eco/.test(text)) return kinds.carbonKitEco;
    if (/carbon kit/.test(text)) return kinds.carbonKit;
    if (/se zemněním|s uzemnením|grounded/.test(text)) return kinds.groundedFilm;
    if (/odoln|durable/.test(text)) return kinds.durableFilm;
    if (/rohož|mat/.test(text)) return kinds.heatingMat;
    if (/fóli|film/.test(text)) return kinds.heatingFilm;
    return kinds.product;
  }

  function annotateProductCards(copy) {
    document.querySelectorAll('#products-13 .product, #products-16 .product, #products-4 .product').forEach(function (product) {
      var name = product.querySelector('a.name');
      if (name && !name.querySelector('.larx-product-kind')) {
        var label = element('span', 'larx-product-kind', kindForName(name.textContent, copy.kinds));
        label.setAttribute('aria-hidden', 'true');
        name.insertBefore(label, name.firstChild);
      }

      /*
       * Shoptet keeps availability inside the price block. Moving the existing
       * element (instead of cloning it) preserves its live text and lets CSS
       * anchor the badge reliably to the product image at every breakpoint.
       */
      var image = product.querySelector('.image');
      var availability = product.querySelector('.availability');
      if (image && availability && availability.parentNode !== image) {
        image.appendChild(availability);
      }
    });
  }

  function decorateStockBanner(main) {
    var banners = main.querySelectorAll(':scope > .body-banners');
    if (!banners.length) return;
    var stock = Array.prototype.find.call(banners, function (banner) {
      return /Hornbach|rohože máme skladem|rohože máme skladom|mats and films/i.test(banner.textContent);
    }) || banners[0];
    stock.classList.add('larx-stock-banner');

    stock.querySelectorAll('style').forEach(function (style) {
      if (style.textContent.indexOf('#80C342') !== -1) style.remove();
    });
  }

  function getAboutHref() {
    var existing = document.querySelector('.welcome-wrapper a[href]');
    return existing ? existing.href : window.location.origin + '/o-nas/';
  }

  function buildAbout(main, copy) {
    var existingSection = document.getElementById('larx-redesign-about');
    if (existingSection) return existingSection;

    var original = main.querySelector(':scope > .welcome-wrapper');
    if (!original) return null;

    var section = element('section', 'larx-about-grid');
    section.id = 'larx-redesign-about';

    var about = element('article', 'larx-about-card');
    about.appendChild(element('h2', 'larx-about-title', copy.aboutTitle));
    var paragraph = element('p', 'larx-about-copy');
    paragraph.innerHTML = copy.aboutHtml;
    about.appendChild(paragraph);
    var cta = element('a', 'larx-about-cta', copy.aboutCta);
    cta.href = getAboutHref();
    about.appendChild(cta);

    var partners = element('aside', 'larx-partners-card');
    partners.appendChild(element('h2', 'larx-partners-title', copy.partnersTitle));
    var list = element('ul', 'larx-partners-list');
    ['AGORA DMT', 'UNI HOBBY', 'Kaufland', 'HORNBACH', 'Alza.cz'].forEach(function (name) {
      list.appendChild(element('li', '', name));
    });
    partners.appendChild(list);
    partners.appendChild(element('p', 'larx-partners-claim', copy.partnersClaim));

    section.appendChild(about);
    section.appendChild(partners);
    original.parentNode.insertBefore(section, original);
    original.classList.add('larx-original-about');
    original.setAttribute('aria-hidden', 'true');
    return section;
  }

  function decorateBlog(main, copy) {
    var blog = main.querySelector('.homepage-blog-wrapper');
    if (!blog) return;
    blog.classList.add('larx-blog');
    var heading = blog.querySelector('.homepage-group-title');
    if (heading) {
      heading.textContent = copy.blogTitle;
      heading.dataset.larxEyebrow = copy.magazine;
      heading.setAttribute('role', 'heading');
      heading.setAttribute('aria-level', '2');
    }
  }

  function decorateCategories() {
    var categories = document.getElementById('larx-topcats');
    if (!categories) return;
    categories.classList.add('larx-redesign-categories');
  }

  function observeProducts(copy) {
    var main = document.getElementById('content');
    if (!main || !window.MutationObserver) return;
    var scheduled = false;
    var observer = new MutationObserver(function (mutations) {
      var hasNewNodes = mutations.some(function (mutation) {
        return mutation.addedNodes && mutation.addedNodes.length;
      });
      if (!hasNewNodes || scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(function () {
        scheduled = false;
        decorateCategories();
        annotateProductCards(copy);
      });
    });
    observer.observe(main, { childList: true, subtree: true });
  }

  function init() {
    if (!document.body || !document.body.classList.contains('in-index')) return;
    if (document.body.dataset.larxRedesignInitialized === 'true') return;

    var main = document.getElementById('content');
    if (!main) {
      document.dispatchEvent(new CustomEvent('larxRedesignFailed', { detail: { reason: 'missing-content' } }));
      return;
    }

    var language = getLanguage();
    var copy = COPY[language];
    document.body.dataset.larxRedesignInitialized = 'true';
    document.body.dataset.larxRedesignVersion = VERSION;
    document.body.classList.add(HOME_CLASS);

    try {
      buildCategories(language);
      buildHero(main, copy);
      decorateGroup('.homepage-products-heading-13', 'larx-products-mats', copy.groups.mats, 'larx-mats');
      decorateGroup('.homepage-products-heading-16', 'larx-products-films', copy.groups.films, 'larx-films');
      decorateGroup('.homepage-products-heading-4', 'larx-products-recommended', copy.groups.recommended, 'larx-recommended');
      annotateProductCards(copy);
      decorateStockBanner(main);
      buildAbout(main, copy);
      decorateBlog(main, copy);
      observeProducts(copy);
      document.body.classList.add(READY_CLASS);
      document.dispatchEvent(new CustomEvent('larxRedesignReady', { detail: { version: VERSION, language: language } }));
    } catch (error) {
      document.body.classList.remove(READY_CLASS);
      if (window.console && console.error) console.error('[LARX redesign] Initialization failed:', error);
      document.dispatchEvent(new CustomEvent('larxRedesignFailed', { detail: { reason: 'initialization-error' } }));
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
}());
