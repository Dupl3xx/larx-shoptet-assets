(function (window, document) {
  "use strict";

  if (window.__larxRedesignLoaderStarted) return;
  window.__larxRedesignLoaderStarted = true;

  var version = Date.now();
  var assetBase = "https://dupl3xx.github.io/larx-shoptet-assets/";
  var root = document.documentElement;
  var preloadClass = "larx-preload";
  var preloadStyleId = "larx-preload-style";
  var requiredStyles = ["global.css", "home.css"];
  var loadedStyles = 0;
  var siteReady = false;
  var redesignReady = false;
  var failed = false;

  window.__larxAssetBase = assetBase;
  window.__larxAssetVersion = version;

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

  function failOpen(reason) {
    if (failed) return;
    failed = true;
    root.setAttribute("data-larx-loader-failed", reason || "unknown");
    reveal();
  }

  function revealWhenReady() {
    if (failed || loadedStyles !== requiredStyles.length || !siteReady || !redesignReady) return;
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(reveal);
    } else {
      reveal();
    }
  }

  function markNonHomepageReady() {
    if (!document.body || document.body.classList.contains("in-index")) return;
    redesignReady = true;
    revealWhenReady();
  }

  /* The inline Shoptet snippet activates the class before body parsing. This
     loader-side copy is a safe fallback for direct or delayed installations. */
  ensurePreloadGuard();

  document.addEventListener("larxSiteReady", function () {
    siteReady = true;
    revealWhenReady();
  }, { once: true });

  document.addEventListener("larxRedesignReady", function () {
    redesignReady = true;
    revealWhenReady();
  }, { once: true });

  document.addEventListener("larxRedesignFailed", function () {
    failOpen("redesign-initialization");
  }, { once: true });

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

  requiredStyles.forEach(function (fileName) {
    var stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = assetBase + fileName + "?v=" + version;
    stylesheet.setAttribute("data-larx-source", "github-pages");
    stylesheet.setAttribute("data-larx-asset", fileName);
    stylesheet.onload = function () {
      loadedStyles += 1;
      revealWhenReady();
    };
    stylesheet.onerror = function () {
      failOpen("style:" + fileName);
    };
    document.head.appendChild(stylesheet);
  });

  function loadScript(fileName, onload) {
    var script = document.createElement("script");
    script.src = assetBase + fileName + "?v=" + version;
    script.async = false;
    script.setAttribute("data-larx-source", "github-pages");
    script.setAttribute("data-larx-asset", fileName);
    script.onload = onload || null;
    script.onerror = function () {
      failOpen("script:" + fileName);
    };
    document.head.appendChild(script);
  }

  /* site.js installs global behavior first. home.js follows in deterministic
     order and only changes the homepage. CSS downloads remain parallel. */
  loadScript("site.js", function () {
    if (!failed) loadScript("home.js");
  });
}(window, document));
