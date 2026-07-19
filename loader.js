(function (window, document) {
  "use strict";

  if (window.__larxRedesignLoaderStarted) return;
  window.__larxRedesignLoaderStarted = true;

  var version = Date.now();
  var pages = "https://dupl3xx.github.io/larx-shoptet-assets/";
  var shoptet = "https://cdn.myshoptet.com/usr/www.larx.cz/user/documents/upload/larx-redesign/";
  var root = document.documentElement;
  var preloadClass = "larx-preload";
  var preloadStyleId = "larx-preload-style";
  var cssReady = false;
  var redesignReady = false;

  function ensurePreloadGuard() {
    if (!document.getElementById(preloadStyleId)) {
      var style = document.createElement("style");
      style.id = preloadStyleId;
      style.textContent = "html." + preloadClass + " body{visibility:hidden;animation:larx-preload-failsafe 0s 5s forwards}@keyframes larx-preload-failsafe{to{visibility:visible}}";
      document.head.appendChild(style);
    }
    root.classList.add(preloadClass);
  }

  function reveal() {
    root.classList.remove(preloadClass);
  }

  function revealWhenReady() {
    if (!cssReady || !redesignReady) return;
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(reveal);
    } else {
      reveal();
    }
  }

  /* The inline Shoptet snippet activates this before the body is parsed. Keep
     a loader-side fallback for installations that still use the older line. */
  if (root.classList.contains(preloadClass) || document.readyState === "loading") {
    ensurePreloadGuard();
  }

  document.addEventListener("larxRedesignReady", function () {
    redesignReady = true;
    revealWhenReady();
  }, { once: true });

  function markNonHomepageReady() {
    if (!document.body || document.body.classList.contains("in-index")) return;
    redesignReady = true;
    revealWhenReady();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", markNonHomepageReady, { once: true });
  } else {
    markNonHomepageReady();
  }

  window.LARX_HOME_CONFIG = window.LARX_HOME_CONFIG || {
    toolUrls: {
      calculator: "",
      guide: "",
      quote: ""
    }
  };

  var stylesheet = document.createElement("link");
  stylesheet.rel = "stylesheet";
  stylesheet.href = pages + "home.css?v=" + version;
  stylesheet.setAttribute("data-larx-source", "github-pages");
  stylesheet.onload = function () {
    cssReady = true;
    revealWhenReady();
  };
  stylesheet.onerror = function () {
    if (stylesheet.getAttribute("data-larx-source") === "shoptet-fallback") return;
    stylesheet.href = shoptet + "home.css?v=2";
    stylesheet.setAttribute("data-larx-source", "shoptet-fallback");
  };
  document.head.appendChild(stylesheet);

  function loadScript(source, label) {
    var script = document.createElement("script");
    script.src = source;
    script.async = false;
    script.setAttribute("data-larx-source", label);
    if (label === "github-pages") {
      script.onerror = function () {
        script.remove();
        loadScript(shoptet + "home.js?v=2", "shoptet-fallback");
      };
    }
    document.head.appendChild(script);
  }

  /* Fetch the application immediately in parallel with CSS. home.js already
     waits for DOMContentLoaded when necessary. */
  loadScript(pages + "home.js?v=" + version, "github-pages");
}(window, document));
