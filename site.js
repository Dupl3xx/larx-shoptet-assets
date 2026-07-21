(function (window, document) {
  'use strict';

  if (window.__larxSiteInitialized) return;
  window.__larxSiteInitialized = true;

  var currentScript = document.currentScript;
  var assetBase = currentScript && currentScript.src
    ? new URL('.', currentScript.src).href
    : 'https://dupl3xx.github.io/larx-shoptet-assets/';
  var assetVersion = window.__larxAssetVersion || Date.now();
  var countryTimer = 0;
  var parametersOpened = false;

  function emit(name, detail) {
    var event;
    try {
      event = new CustomEvent(name, { detail: detail || {} });
    } catch (error) {
      event = document.createEvent('CustomEvent');
      event.initCustomEvent(name, false, false, detail || {});
    }
    document.dispatchEvent(event);
  }

  function whenDomReady(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback, { once: true });
    } else {
      callback();
    }
  }

  function markNoSnippet() {
    [
      document.querySelector('header#header'),
      document.querySelector('.top-navigation-bar'),
      document.querySelector('.user-action'),
      document.querySelector('.custom-footer__contact')
    ].forEach(function (element) {
      if (element) element.setAttribute('data-nosnippet', '');
    });
  }

  function hideCurrencyControls() {
    document.querySelectorAll('.languagesMenu__box[data-target="currency"]').forEach(function (element) {
      element.classList.add('larx-force-hidden');
    });

    document.querySelectorAll('a[href*="/action/Currency/changeCurrency/"]').forEach(function (link) {
      link.classList.add('larx-force-hidden');
      var item = link.closest('li');
      if (item) item.classList.add('larx-force-hidden');
    });

    document.querySelectorAll('.languagesMenu__box').forEach(function (box) {
      if ((box.textContent || '').trim() === 'Currency') box.classList.add('larx-force-hidden');
    });
  }

  function hideCheckoutCurrency() {
    var select = document.querySelector('#payment-currency, select[name="currency"][data-testid="comboboxPaymentCurrency"]');
    if (!select) return;
    var group = select.closest('.form-group');
    if (group) group.classList.add('larx-force-hidden');
    var label = document.querySelector('label[for="payment-currency"]');
    if (label) label.classList.add('larx-force-hidden');
  }

  function setDeliveryCountry() {
    var countryByLanguage = { sk: '151', cs: '43' };
    var language = (document.documentElement.lang || '').toLowerCase().slice(0, 2);
    var targetId = countryByLanguage[language];
    var select = document.getElementById('deliveryCountryId');
    if (!targetId || !select || select.value === targetId) return;

    select.value = targetId;
    if (window.jQuery) {
      window.jQuery(select).trigger('change');
    } else {
      var event = document.createEvent('HTMLEvents');
      event.initEvent('change', true, true);
      select.dispatchEvent(event);
    }
  }

  function scheduleCheckoutRefresh(delay) {
    window.clearTimeout(countryTimer);
    countryTimer = window.setTimeout(function () {
      setDeliveryCountry();
      hideCheckoutCurrency();
    }, typeof delay === 'number' ? delay : 100);
  }

  function normalizeText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function openAllParameters() {
    if (parametersOpened || !document.body || !document.body.classList.contains('type-product')) return;
    var candidates = document.querySelectorAll('a, button, [role="button"]');
    for (var index = 0; index < candidates.length; index += 1) {
      var text = normalizeText(candidates[index].textContent || candidates[index].innerText);
      if (
        text.indexOf('všechny parametry') > -1 ||
        text.indexOf('vsechny parametry') > -1 ||
        text.indexOf('všetky parametre') > -1 ||
        text.indexOf('all parameters') > -1
      ) {
        parametersOpened = true;
        document.documentElement.dataset.larxParametersOpened = 'opened';
        candidates[index].click();
        return;
      }
    }

    /* Current Jupiter product pages already render the complete second
       parameter table and therefore have no "all parameters" control. */
    if (document.querySelectorAll('table.detail-parameters').length >= 2) {
      parametersOpened = true;
      document.documentElement.dataset.larxParametersOpened = 'already-visible';
    }
  }

  function isCartPage() {
    return /\/(?:kosik|cart)\/?$/i.test(window.location.pathname);
  }

  function hasLegacyModule(fileName) {
    return Boolean(document.querySelector('script[src*="/user/documents/upload/js/' + fileName + '"]'));
  }

  function loadModule(id, relativePath, legacyFileName) {
    if (document.getElementById(id)) return Promise.resolve('existing');
    if (legacyFileName && hasLegacyModule(legacyFileName)) return Promise.resolve('legacy');

    return new Promise(function (resolve) {
      var script = document.createElement('script');
      script.id = id;
      script.src = assetBase + relativePath + '?v=' + assetVersion;
      script.async = false;
      script.setAttribute('data-larx-module', relativePath);
      script.onload = function () { resolve('github-pages'); };
      script.onerror = function () {
        window.__larxSiteModuleErrors = window.__larxSiteModuleErrors || [];
        window.__larxSiteModuleErrors.push(relativePath);
        resolve('failed');
      };
      document.head.appendChild(script);
    });
  }

  function loadStylesheet(id, relativePath) {
    if (document.getElementById(id)) return Promise.resolve('existing');

    return new Promise(function (resolve) {
      var link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = assetBase + relativePath + '?v=' + assetVersion;
      link.setAttribute('data-larx-module', relativePath);
      link.onload = function () { resolve('github-pages'); };
      link.onerror = function () {
        window.__larxSiteModuleErrors = window.__larxSiteModuleErrors || [];
        window.__larxSiteModuleErrors.push(relativePath);
        resolve('failed');
      };
      document.head.appendChild(link);
    });
  }

  function isAiQuotePage() {
    var root = document.getElementById('larx-ai-quote') ||
      document.querySelector('[data-larx-ai-quote]');
    var isKnownCzechPage = document.body && (
      document.body.classList.contains('in-nabidka-pomoci-ai') ||
      document.body.classList.contains('in-automaticke-naceneni-projektu-pomoci-ai')
    );

    if (root && document.body) {
      document.body.classList.add('larx-ai-quote-page');
    }

    return Boolean(root || isKnownCzechPage);
  }

  function ensureHeatingCalculatorRoot() {
    var root = document.getElementById('larx-heating-calculator') ||
      document.querySelector('[data-larx-heating-calculator]');
    var isCalculatorPath = /^\/kalkulacka-nakladu-na-vytapeni\/?$/i.test(window.location.pathname);
    var isCalculatorBody = document.body && document.body.classList.contains('in-kalkulacka-nakladu-na-vytapeni');

    if (!root && (isCalculatorPath || isCalculatorBody)) {
      var container = document.querySelector('.pageArticleDetail [itemprop="about"]') ||
        document.querySelector('.pageArticleDetail') ||
        document.querySelector('.content-inner');
      if (container) {
        root = document.createElement('div');
        root.id = 'larx-heating-calculator';
        container.appendChild(root);
      }
    }

    if (root && document.body) {
      document.body.classList.add('larx-heating-calculator-page');
    }

    return root;
  }

  function isHeatingCalculatorPage() {
    return Boolean(ensureHeatingCalculatorRoot());
  }

  function loadPageModules() {
    var cartPage = isCartPage();
    var modules = [
      loadModule('larx-cart-empty', 'modules/cart-empty.js')
    ];
    if (cartPage) {
      modules.push(loadModule('larx-cart-consumables', 'modules/cart-consumables.js', 'vypocet.js'));
      modules.push(loadModule('larx-cart-share', 'modules/cart-share.js', 'sdilet_kosik.js'));
    }
    if (isAiQuotePage()) {
      modules.push(
        loadStylesheet('larx-ai-quote-style', 'modules/ai-quote.css').then(function () {
          return loadModule('larx-ai-quote-script', 'modules/ai-quote.js');
        })
      );
    }
    if (isHeatingCalculatorPage()) {
      modules.push(
        loadStylesheet('larx-heating-calculator-style', 'modules/heating-calculator.css').then(function () {
          return loadModule('larx-heating-calculator-script', 'modules/heating-calculator.js');
        })
      );
    }
    return Promise.all(modules).then(function (sources) {
      emit('ShoptetDOMContentLoaded');
      if (cartPage) emit('ShoptetDOMCartContentLoaded');
      return sources;
    });
  }

  function installLimitedCheckoutObserver() {
    if (!document.body || !document.body.classList.contains('ordering-process') || !window.MutationObserver) return;
    var root = document.getElementById('content') || document.body;
    new MutationObserver(function () {
      scheduleCheckoutRefresh(100);
    }).observe(root, { childList: true, subtree: true });
  }

  function refreshGlobalDecorations() {
    markNoSnippet();
    hideCurrencyControls();
    hideCheckoutCurrency();
    openAllParameters();
  }

  document.addEventListener('ShoptetDOMContentLoaded', refreshGlobalDecorations);
  document.addEventListener('ShoptetDOMPageContentLoaded', refreshGlobalDecorations);
  document.addEventListener('ShoptetDOMCartContentLoaded', function () {
    refreshGlobalDecorations();
    scheduleCheckoutRefresh(100);
  });

  whenDomReady(function () {
    refreshGlobalDecorations();
    scheduleCheckoutRefresh(500);
    installLimitedCheckoutObserver();
    window.setTimeout(openAllParameters, 400);

    loadPageModules().then(function (moduleSources) {
      emit('larxSiteReady', {
        version: '1.3.0',
        modules: moduleSources,
        moduleErrors: window.__larxSiteModuleErrors || []
      });
    });
  });
}(window, document));
