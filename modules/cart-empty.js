(function (window, document) {
  'use strict';

  if (window.__LARX_CART_EMPTY_INIT__) return;
  window.__LARX_CART_EMPTY_INIT__ = true;

  var MAX_ITEMS = 100;
  var CHANGE_TIMEOUT = 10000;
  var observerTimer = 0;

  var translations = {
    cs: {
      label: 'Vyprázdnit košík',
      confirm: 'Opravdu chcete vyprázdnit košík?',
      error: 'Košík se nepodařilo úplně vyprázdnit. Obnovte stránku a zkuste to znovu.'
    },
    sk: {
      label: 'Vyprázdniť košík',
      confirm: 'Naozaj chcete vyprázdniť košík?',
      error: 'Košík sa nepodarilo úplne vyprázdniť. Obnovte stránku a skúste to znova.'
    },
    en: {
      label: 'Empty cart',
      confirm: 'Do you really want to empty the cart?',
      error: 'The cart could not be completely emptied. Refresh the page and try again.'
    },
    de: {
      label: 'Warenkorb leeren',
      confirm: 'Möchten Sie den Warenkorb wirklich leeren?',
      error: 'Der Warenkorb konnte nicht vollständig geleert werden. Laden Sie die Seite neu und versuchen Sie es erneut.'
    }
  };

  function language() {
    var code = (document.documentElement.lang || 'cs').toLowerCase().slice(0, 2);
    return translations[code] ? code : 'cs';
  }

  function copy(key) {
    return translations[language()][key];
  }

  function isVisible(element) {
    if (!element) return false;
    var rect = element.getBoundingClientRect();
    var style = window.getComputedStyle(element);
    return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
  }

  function formItemId(form) {
    var input = form && form.querySelector('input[name="itemId"]');
    return input ? String(input.value || '') : '';
  }

  function dataLayerItemIds() {
    try {
      if (typeof window.getShoptetDataLayer !== 'function') return null;
      var items = window.getShoptetDataLayer('cart');
      if (!Array.isArray(items)) return null;
      return items.map(function (item) { return String(item.itemId || ''); }).filter(Boolean).sort();
    } catch (error) {
      return null;
    }
  }

  function cartIsEmpty() {
    var dataItemIds = dataLayerItemIds();
    if (dataItemIds) return dataItemIds.length === 0;
    var headerCart = document.querySelector('#header .cart-count');
    if (!headerCart) return false;
    if (headerCart.classList.contains('empty')) return true;
    if (headerCart.classList.contains('full')) return false;
    return !headerCart.querySelector('i') && /prázdn|prázdn|empty|leer/i.test(headerCart.textContent || '');
  }

  function deleteForms(mode) {
    var selector = mode === 'widget'
      ? '#cart-widget form.js-remove-form[action*="/action/Cart/deleteCartItem/"]'
      : 'body.in-kosik .cart-table form.delete-cart-item[action*="/action/Cart/deleteCartItem/"]';
    var byItem = {};

    Array.prototype.forEach.call(document.querySelectorAll(selector), function (form) {
      var itemId = formItemId(form);
      if (!itemId) return;
      var current = byItem[itemId];
      var button = form.querySelector('button[type="submit"].remove-item');
      var currentButton = current && current.querySelector('button[type="submit"].remove-item');
      if (!current || (!isVisible(currentButton) && isVisible(button))) byItem[itemId] = form;
    });

    var dataItemIds = dataLayerItemIds();
    var itemIds = dataItemIds || Object.keys(byItem).sort();
    return itemIds.map(function (itemId) { return byItem[itemId]; }).filter(Boolean);
  }

  function itemSignature(mode) {
    var dataItemIds = dataLayerItemIds();
    return dataItemIds ? dataItemIds.join('|') : deleteForms(mode).map(formItemId).join('|');
  }

  function waitForCartChange(mode, before) {
    return new Promise(function (resolve) {
      var finished = false;
      var timeout = 0;
      var interval = 0;

      function finish(changed) {
        if (finished) return;
        finished = true;
        window.clearTimeout(timeout);
        window.clearInterval(interval);
        document.removeEventListener('ShoptetDOMCartContentLoaded', check);
        document.removeEventListener('ShoptetDataLayerUpdated', check);
        resolve(changed);
      }

      function check() {
        if (cartIsEmpty()) {
          finish(true);
          return;
        }
        var after = itemSignature(mode);
        if (after !== before || !after) finish(true);
      }

      document.addEventListener('ShoptetDOMCartContentLoaded', check);
      document.addEventListener('ShoptetDataLayerUpdated', check);
      interval = window.setInterval(check, 100);
      timeout = window.setTimeout(function () { finish(false); }, CHANGE_TIMEOUT);
      check();
    });
  }

  function setBusy(busy) {
    Array.prototype.forEach.call(document.querySelectorAll('.larx-empty-cart-link'), function (button) {
      button.disabled = busy;
      button.classList.toggle('is-busy', busy);
      button.setAttribute('aria-busy', busy ? 'true' : 'false');
    });
  }

  async function emptyCart(mode) {
    setBusy(true);
    var completed = false;

    try {
      for (var index = 0; index < MAX_ITEMS; index += 1) {
        if (cartIsEmpty()) {
          completed = true;
          break;
        }
        var forms = deleteForms(mode);
        if (!forms.length) {
          completed = true;
          break;
        }

        var before = itemSignature(mode);
        var submit = forms[0].querySelector('button[type="submit"].remove-item');
        if (!submit) break;
        submit.click();

        if (!await waitForCartChange(mode, before)) break;
      }
    } catch (error) {
      if (window.console && typeof window.console.error === 'function') {
        window.console.error('[LARX empty cart]', error);
      }
    } finally {
      setBusy(false);
    }

    if (cartIsEmpty()) completed = true;
    scheduleInjection();
    if (!completed && !cartIsEmpty() && deleteForms(mode).length) window.alert(copy('error'));
  }

  function createLink(mode) {
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'larx-empty-cart-link larx-empty-cart-link--' + mode;
    button.dataset.larxEmptyCart = mode;
    button.textContent = copy('label');
    button.setAttribute('aria-label', copy('label'));
    button.setAttribute('aria-busy', 'false');
    button.addEventListener('click', function () {
      if (button.disabled || !window.confirm(copy('confirm'))) return;
      emptyCart(mode);
    });
    return button;
  }

  function injectWidgetLink() {
    var widget = document.getElementById('cart-widget');
    if (!widget) return;
    var existing = widget.querySelector('.larx-empty-cart-link--widget');
    var bottom = widget.querySelector('.cart-widget-bottom');
    var checkout = bottom && bottom.querySelector('.cart-widget-button');
    var hasItems = !cartIsEmpty() && deleteForms('widget').length > 0;

    if (!hasItems || !bottom || !checkout) {
      if (existing) existing.remove();
      return;
    }
    if (!existing) existing = createLink('widget');
    if (existing.parentNode !== bottom || existing.nextElementSibling !== checkout) {
      bottom.insertBefore(existing, checkout);
    }
  }

  function injectPageLink() {
    if (!document.body || !document.body.classList.contains('in-kosik')) return;
    var existing = document.querySelector('.larx-empty-cart-link--page');
    var summary = document.querySelector('.cart-inner .row.summary');
    var rightColumn = summary && summary.querySelector('.col-md-4');
    var hasItems = !cartIsEmpty() && deleteForms('page').length > 0;

    if (!hasItems || !summary || !rightColumn) {
      if (existing) existing.remove();
      return;
    }
    if (!existing) existing = createLink('page');
    if (existing.parentNode !== summary || existing.nextElementSibling !== rightColumn) {
      summary.insertBefore(existing, rightColumn);
    }
  }

  function inject() {
    injectWidgetLink();
    injectPageLink();
  }

  function scheduleInjection() {
    window.clearTimeout(observerTimer);
    observerTimer = window.setTimeout(inject, 0);
  }

  document.addEventListener('ShoptetDOMContentLoaded', scheduleInjection);
  document.addEventListener('ShoptetDOMCartContentLoaded', scheduleInjection);
  document.addEventListener('ShoptetDataLayerUpdated', scheduleInjection);

  if (window.MutationObserver) {
    var root = document.getElementById('cart-widget') || document.body;
    if (root) new MutationObserver(scheduleInjection).observe(root, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject, { once: true });
  } else {
    inject();
  }
}(window, document));
