(function (window, document) {
  'use strict';

  if (window.__larxAiQuoteInitialized) return;

  var root = document.querySelector('[data-larx-ai-quote], #larx-ai-quote');
  if (!root) return;
  window.__larxAiQuoteInitialized = true;

  var DEFAULT_ENDPOINT = 'https://www.uhlikovefolie.cz/php/api/larx-ai-quote.php';
  var MAX_FILES = 5;
  var MAX_FILE_SIZE = 10 * 1024 * 1024;
  var MAX_TOTAL_SIZE = 20 * 1024 * 1024;
  var ALLOWED_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png'];
  var selectedFiles = [];
  var submitting = false;

  root.innerHTML = [
    '<div class="larx-ai-quote">',
      '<section class="larx-ai-quote__intro" aria-labelledby="larx-ai-intro-title">',
        '<div class="larx-ai-quote__intro-copy">',
          '<p class="larx-ai-quote__eyebrow">Chytrý nástroj LARX</p>',
          '<h2 id="larx-ai-intro-title">Návrh vytápění z půdorysu bez zdlouhavého počítání</h2>',
          '<p>Nahrajte půdorys, doplňte kontakt a zvolte typ topného systému. Připravíme automatický návrh materiálu a orientační nacenění, které vám přijde e-mailem.</p>',
          '<p class="larx-ai-quote__note"><strong>Nástroj je v testovacím provozu.</strong> Výsledek před objednáním doporučujeme zkontrolovat s naším technikem.</p>',
        '</div>',
        '<ol class="larx-ai-quote__steps" aria-label="Jak nacenění probíhá">',
          '<li><span>1</span><strong>Nahrajete půdorys</strong><small>PDF, JPG nebo PNG</small></li>',
          '<li><span>2</span><strong>Zvolíte řešení</strong><small>100 W/m² nebo 150 W/m²</small></li>',
          '<li><span>3</span><strong>Obdržíte nacenění</strong><small>Na zadaný e-mail</small></li>',
        '</ol>',
      '</section>',
      '<section class="larx-ai-quote__form-card" aria-labelledby="larx-ai-form-title">',
        '<div class="larx-ai-quote__form-heading">',
          '<p class="larx-ai-quote__eyebrow">Podklady k projektu</p>',
          '<h2 id="larx-ai-form-title">Automatické nacenění projektu</h2>',
          '<p>Povinné údaje jsou označené hvězdičkou.</p>',
        '</div>',
        '<form class="larx-ai-quote__form" enctype="multipart/form-data" novalidate>',
          '<div class="larx-ai-quote__grid">',
            '<label class="larx-ai-quote__field"><span>Jméno <b aria-hidden="true">*</b></span><input name="name" type="text" autocomplete="given-name" maxlength="80" required></label>',
            '<label class="larx-ai-quote__field"><span>Příjmení <b aria-hidden="true">*</b></span><input name="surname" type="text" autocomplete="family-name" maxlength="80" required></label>',
            '<label class="larx-ai-quote__field"><span>Telefon <b aria-hidden="true">*</b></span><input name="phone" type="tel" autocomplete="tel" maxlength="30" required></label>',
            '<label class="larx-ai-quote__field"><span>E-mail <b aria-hidden="true">*</b></span><input name="email" type="email" autocomplete="email" maxlength="160" required></label>',
          '</div>',
          '<fieldset class="larx-ai-quote__fieldset">',
            '<legend>Jaký systém chcete nacenit? <b aria-hidden="true">*</b></legend>',
            '<div class="larx-ai-quote__choices">',
              '<label class="larx-ai-quote__choice"><input type="radio" name="folie_typ" value="PTC/OS" required><span><strong>Topná fólie 100 W/m²</strong><small>Do obytných místností pod plovoucí podlahu</small></span></label>',
              '<label class="larx-ai-quote__choice"><input type="radio" name="folie_typ" value="KAR" required><span><strong>Topná fólie 150 W/m²</strong><small>Pro vyšší výkon; koupelny řešíme topnými rohožemi</small></span></label>',
            '</div>',
          '</fieldset>',
          '<fieldset class="larx-ai-quote__fieldset larx-ai-quote__upload-fieldset">',
            '<legend>Půdorys projektu <b aria-hidden="true">*</b></legend>',
            '<div class="larx-ai-quote__dropzone" role="button" tabindex="0" aria-describedby="larx-ai-file-help">',
              '<input class="larx-ai-quote__file-input" name="attachment[]" type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" multiple>',
              '<span class="larx-ai-quote__upload-icon" aria-hidden="true">↑</span>',
              '<strong>Přetáhněte soubory sem nebo vyberte z počítače</strong>',
              '<small id="larx-ai-file-help">PDF, JPG nebo PNG · nejvýše 5 souborů · 10 MB na soubor · 20 MB celkem</small>',
            '</div>',
            '<div class="larx-ai-quote__files" aria-live="polite"></div>',
            '<p class="larx-ai-quote__file-error" role="alert" hidden></p>',
          '</fieldset>',
          '<label class="larx-ai-quote__consent">',
            '<input type="checkbox" name="souhlas" value="1" required>',
            '<span>Souhlasím se zpracováním osobních údajů za účelem vyřízení poptávky. <a href="/ochrana-osobnich-udaju/">Více o ochraně osobních údajů</a>. <b aria-hidden="true">*</b></span>',
          '</label>',
          '<div class="larx-ai-quote__honeypot" aria-hidden="true"><label>Firma<input name="company" type="text" tabindex="-1" autocomplete="off"></label></div>',
          '<input name="language" type="hidden" value="cs">',
          '<input name="type" type="hidden" value="ai-vypocet">',
          '<input name="page" type="hidden">',
          '<input name="form_started" type="hidden">',
          '<div class="larx-ai-quote__actions">',
            '<button class="larx-ai-quote__submit" type="submit"><span>Odeslat k automatickému nacenění</span></button>',
            '<p class="larx-ai-quote__status" role="status" aria-live="polite"></p>',
          '</div>',
        '</form>',
      '</section>',
    '</div>'
  ].join('');

  var form = root.querySelector('form');
  var fileInput = root.querySelector('.larx-ai-quote__file-input');
  var dropzone = root.querySelector('.larx-ai-quote__dropzone');
  var filesContainer = root.querySelector('.larx-ai-quote__files');
  var fileError = root.querySelector('.larx-ai-quote__file-error');
  var submitButton = root.querySelector('.larx-ai-quote__submit');
  var status = root.querySelector('.larx-ai-quote__status');
  var pageInput = form.elements.page;
  var startedInput = form.elements.form_started;

  pageInput.value = window.location.href;
  startedInput.value = String(Date.now());

  function formatBytes(bytes) {
    if (bytes < 1024 * 1024) return Math.max(1, Math.round(bytes / 1024)) + ' kB';
    return (bytes / (1024 * 1024)).toFixed(1).replace('.', ',') + ' MB';
  }

  function extensionOf(fileName) {
    var parts = String(fileName || '').toLowerCase().split('.');
    return parts.length > 1 ? parts.pop() : '';
  }

  function totalSize(files) {
    return files.reduce(function (sum, file) { return sum + file.size; }, 0);
  }

  function setFileError(message) {
    fileError.textContent = message || '';
    fileError.hidden = !message;
    dropzone.classList.toggle('is-invalid', Boolean(message));
  }

  function renderFiles() {
    filesContainer.innerHTML = '';
    selectedFiles.forEach(function (file, index) {
      var item = document.createElement('div');
      item.className = 'larx-ai-quote__file';

      var details = document.createElement('span');
      var name = document.createElement('strong');
      var size = document.createElement('small');
      name.textContent = file.name;
      size.textContent = formatBytes(file.size);
      details.appendChild(name);
      details.appendChild(size);

      var remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'larx-ai-quote__file-remove';
      remove.setAttribute('aria-label', 'Odebrat soubor ' + file.name);
      remove.textContent = 'Odebrat';
      remove.addEventListener('click', function () {
        selectedFiles.splice(index, 1);
        fileInput.value = '';
        setFileError('');
        renderFiles();
      });

      item.appendChild(details);
      item.appendChild(remove);
      filesContainer.appendChild(item);
    });
    dropzone.classList.toggle('has-files', selectedFiles.length > 0);
  }

  function addFiles(fileList) {
    var incoming = Array.prototype.slice.call(fileList || []);
    var next = selectedFiles.slice();
    var error = '';

    incoming.forEach(function (file) {
      if (error) return;
      if (ALLOWED_EXTENSIONS.indexOf(extensionOf(file.name)) === -1) {
        error = 'Soubor „' + file.name + '“ nemá podporovaný formát.';
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        error = 'Soubor „' + file.name + '“ je větší než 10 MB.';
        return;
      }
      var duplicate = next.some(function (existing) {
        return existing.name === file.name && existing.size === file.size && existing.lastModified === file.lastModified;
      });
      if (!duplicate) next.push(file);
    });

    if (!error && next.length > MAX_FILES) error = 'Můžete nahrát nejvýše 5 souborů.';
    if (!error && totalSize(next) > MAX_TOTAL_SIZE) error = 'Celková velikost souborů může být nejvýše 20 MB.';

    if (error) {
      setFileError(error);
      return;
    }
    selectedFiles = next;
    setFileError('');
    renderFiles();
  }

  function setSubmitting(active) {
    submitting = active;
    submitButton.disabled = active;
    submitButton.classList.toggle('is-loading', active);
    submitButton.querySelector('span').textContent = active
      ? 'Odesílám podklady…'
      : 'Odeslat k automatickému nacenění';
  }

  function setStatus(message, type) {
    status.textContent = message || '';
    status.className = 'larx-ai-quote__status' + (type ? ' is-' + type : '');
  }

  fileInput.addEventListener('change', function () {
    addFiles(fileInput.files);
    fileInput.value = '';
  });

  dropzone.addEventListener('click', function (event) {
    if (event.target !== fileInput) fileInput.click();
  });
  dropzone.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      fileInput.click();
    }
  });
  ['dragenter', 'dragover'].forEach(function (name) {
    dropzone.addEventListener(name, function (event) {
      event.preventDefault();
      dropzone.classList.add('is-dragging');
    });
  });
  ['dragleave', 'drop'].forEach(function (name) {
    dropzone.addEventListener(name, function (event) {
      event.preventDefault();
      dropzone.classList.remove('is-dragging');
    });
  });
  dropzone.addEventListener('drop', function (event) {
    addFiles(event.dataTransfer && event.dataTransfer.files);
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (submitting) return;
    setStatus('', '');
    setFileError('');

    if (!form.checkValidity()) {
      form.reportValidity();
      setStatus('Zkontrolujte prosím povinné údaje.', 'error');
      return;
    }
    if (!selectedFiles.length) {
      setFileError('Přiložte prosím alespoň jeden půdorys.');
      dropzone.focus();
      return;
    }

    var payload = new FormData();
    ['name', 'surname', 'phone', 'email', 'folie_typ', 'souhlas', 'company', 'language', 'page', 'type', 'form_started'].forEach(function (name) {
      payload.append(name, form.elements[name].value);
    });
    selectedFiles.forEach(function (file) {
      payload.append('attachment[]', file, file.name);
    });

    var controller = window.AbortController ? new AbortController() : null;
    var timeout = window.setTimeout(function () {
      if (controller) controller.abort();
    }, 60000);
    var endpoint = root.getAttribute('data-endpoint') || DEFAULT_ENDPOINT;

    setSubmitting(true);
    window.fetch(endpoint, {
      method: 'POST',
      body: payload,
      headers: { Accept: 'application/json' },
      credentials: 'omit',
      signal: controller ? controller.signal : undefined
    }).then(function (response) {
      return response.json().catch(function () { return {}; }).then(function (body) {
        if (!response.ok || !(body.ok === true || Number(body.result) === 1)) {
          throw new Error(body.message || 'Podklady se nepodařilo odeslat.');
        }
        return body;
      });
    }).then(function () {
      form.reset();
      selectedFiles = [];
      renderFiles();
      startedInput.value = String(Date.now());
      pageInput.value = window.location.href;
      setStatus('Děkujeme. Podklady jsme přijali a nacenění odešleme na zadaný e-mail.', 'success');
    }).catch(function (error) {
      var message = error && error.name === 'AbortError'
        ? 'Odesílání trvalo příliš dlouho. Zkuste to prosím znovu.'
        : (error && error.message) || 'Podklady se nepodařilo odeslat. Zkuste to prosím znovu.';
      setStatus(message, 'error');
    }).then(function () {
      window.clearTimeout(timeout);
      setSubmitting(false);
    });
  });
}(window, document));
