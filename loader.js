(function (window, document) {
  "use strict";

  if (window.__larxRedesignLoaderStarted) return;
  window.__larxRedesignLoaderStarted = true;

  var version = Date.now();
  var pages = "https://dupl3xx.github.io/larx-shoptet-assets/";
  var shoptet = "https://cdn.myshoptet.com/usr/www.larx.cz/user/documents/upload/larx-redesign/";

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
    document.body.appendChild(script);
  }

  function start() {
    loadScript(pages + "home.js?v=" + version, "github-pages");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
}(window, document));

