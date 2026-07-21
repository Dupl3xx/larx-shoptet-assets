(function (window, document) {
  'use strict';

  if (window.__larxAiQuoteInitialized) return;

  var root = document.querySelector('[data-larx-ai-quote], #larx-ai-quote');
  if (!root) return;
  window.__larxAiQuoteInitialized = true;
  if (document.body) document.body.classList.add('larx-ai-quote-page');

  var DEFAULT_ENDPOINT = 'https://www.uhlikovefolie.cz/php/api/larx-ai-quote.php';
  var MAX_FILES = 5;
  var MAX_FILE_SIZE = 10 * 1024 * 1024;
  var MAX_TOTAL_SIZE = 20 * 1024 * 1024;
  var ALLOWED_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png'];
  var selectedFiles = [];
  var submitting = false;
  var language = (document.documentElement.lang || '').toLowerCase().slice(0, 2);
  if (language !== 'en' && language !== 'sk') language = 'cs';
  var translations = {
    cs: {
      eyebrow: 'Chytrý nástroj LARX',
      introTitle: 'Návrh vytápění z půdorysu bez zdlouhavého počítání',
      introBody: 'Nahrajte půdorys, doplňte kontakt a zvolte typ topného systému. Připravíme automatický návrh materiálu a orientační nacenění, které vám přijde e-mailem.',
      betaStrong: 'Nástroj je v testovacím provozu.',
      betaRest: 'Výsledek před objednáním doporučujeme zkontrolovat.',
      stepsLabel: 'Jak nacenění probíhá',
      uploadStep: 'Nahrajete půdorys',
      uploadStepDetail: 'PDF, JPG nebo PNG',
      solutionStep: 'Zvolíte řešení',
      solutionStepDetail: '100 W/m² nebo 150 W/m²',
      resultStep: 'Obdržíte nacenění',
      resultStepDetail: 'Na zadaný e-mail',
      formTitle: 'Automatické nacenění projektu',
      name: 'Jméno',
      surname: 'Příjmení',
      phone: 'Telefon',
      email: 'E-mail',
      systemLegend: 'Jaký systém chcete nacenit?',
      film100: 'Topná fólie 100 W/m²',
      film100Detail: 'Do obytných místností pod plovoucí podlahu',
      film150: 'Topná fólie 150 W/m²',
      film150Detail: 'Pro vyšší výkon; koupelny řešíme topnými rohožemi',
      floorplan: 'Půdorys projektu',
      upload: 'Přetáhněte soubory sem nebo vyberte z počítače',
      uploadHelp: 'PDF, JPG nebo PNG · nejvýše 5 souborů · 10 MB na soubor · 20 MB celkem',
      consent: 'Souhlasím se zpracováním osobních údajů za účelem vyřízení poptávky.',
      privacy: 'Více o ochraně osobních údajů',
      privacyUrl: '/ochrana-osobnich-udaju/',
      submit: 'Odeslat k automatickému nacenění',
      submitting: 'Odesílám podklady…',
      removeFile: 'Odebrat soubor',
      remove: 'Odebrat',
      unsupported: 'Soubor „{file}“ nemá podporovaný formát.',
      tooLarge: 'Soubor „{file}“ je větší než 10 MB.',
      maxFiles: 'Můžete nahrát nejvýše 5 souborů.',
      totalSize: 'Celková velikost souborů může být nejvýše 20 MB.',
      required: 'Zkontrolujte prosím povinné údaje.',
      attach: 'Přiložte prosím alespoň jeden půdorys.',
      sendFailed: 'Podklady se nepodařilo odeslat.',
      success: 'Děkujeme. Podklady jsme přijali a nacenění odešleme na zadaný e-mail.',
      timeout: 'Odesílání trvalo příliš dlouho. Zkuste to prosím znovu.',
      sendFailedRetry: 'Podklady se nepodařilo odeslat. Zkuste to prosím znovu.'
    },
    sk: {
      eyebrow: 'Inteligentný nástroj LARX',
      introTitle: 'Návrh vykurovania z pôdorysu bez zdĺhavého počítania',
      introBody: 'Nahrajte pôdorys, doplňte kontakt a zvoľte typ vykurovacieho systému. Pripravíme automatický návrh materiálu a orientačné nacenenie, ktoré vám príde e-mailom.',
      betaStrong: 'Nástroj je v testovacej prevádzke.',
      betaRest: 'Výsledok odporúčame pred objednaním skontrolovať.',
      stepsLabel: 'Ako nacenenie prebieha',
      uploadStep: 'Nahráte pôdorys',
      uploadStepDetail: 'PDF, JPG alebo PNG',
      solutionStep: 'Zvolíte riešenie',
      solutionStepDetail: '100 W/m² alebo 150 W/m²',
      resultStep: 'Dostanete nacenenie',
      resultStepDetail: 'Na zadaný e-mail',
      formTitle: 'Automatické nacenenie projektu',
      name: 'Meno',
      surname: 'Priezvisko',
      phone: 'Telefón',
      email: 'E-mail',
      systemLegend: 'Aký systém chcete naceniť?',
      film100: 'Vykurovacia fólia 100 W/m²',
      film100Detail: 'Do obytných miestností pod plávajúcu podlahu',
      film150: 'Vykurovacia fólia 150 W/m²',
      film150Detail: 'Pre vyšší výkon; kúpeľne riešime vykurovacími rohožami',
      floorplan: 'Pôdorys projektu',
      upload: 'Presuňte súbory sem alebo ich vyberte z počítača',
      uploadHelp: 'PDF, JPG alebo PNG · najviac 5 súborov · 10 MB na súbor · 20 MB celkom',
      consent: 'Súhlasím so spracovaním osobných údajov na účely vybavenia dopytu.',
      privacy: 'Viac o ochrane osobných údajov',
      privacyUrl: '/sk/ochrana-osobnych-udajov/',
      submit: 'Odoslať na automatické nacenenie',
      submitting: 'Odosielam podklady…',
      removeFile: 'Odstrániť súbor',
      remove: 'Odstrániť',
      unsupported: 'Súbor „{file}“ nemá podporovaný formát.',
      tooLarge: 'Súbor „{file}“ je väčší ako 10 MB.',
      maxFiles: 'Môžete nahrať najviac 5 súborov.',
      totalSize: 'Celková veľkosť súborov môže byť najviac 20 MB.',
      required: 'Skontrolujte, prosím, povinné údaje.',
      attach: 'Priložte, prosím, aspoň jeden pôdorys.',
      sendFailed: 'Podklady sa nepodarilo odoslať.',
      success: 'Ďakujeme. Podklady sme prijali a nacenenie odošleme na zadaný e-mail.',
      timeout: 'Odosielanie trvalo príliš dlho. Skúste to, prosím, znova.',
      sendFailedRetry: 'Podklady sa nepodarilo odoslať. Skúste to, prosím, znova.'
    },
    en: {
      eyebrow: 'Smart LARX tool',
      introTitle: 'A heating proposal from your floor plan without lengthy calculations',
      introBody: 'Upload your floor plan, provide your contact details and select the heating system. We will prepare an automatic material proposal and an indicative quote and send it to you by email.',
      betaStrong: 'This tool is in test operation.',
      betaRest: 'We recommend checking the result before ordering.',
      stepsLabel: 'How the quote works',
      uploadStep: 'Upload a floor plan',
      uploadStepDetail: 'PDF, JPG or PNG',
      solutionStep: 'Choose a solution',
      solutionStepDetail: '100 W/m² or 150 W/m²',
      resultStep: 'Receive your quote',
      resultStepDetail: 'At the email address provided',
      formTitle: 'Automatic project pricing',
      name: 'First name',
      surname: 'Last name',
      phone: 'Phone',
      email: 'Email',
      systemLegend: 'Which system would you like us to quote?',
      film100: 'Heating film 100 W/m²',
      film100Detail: 'For living areas under floating floors',
      film150: 'Heating film 150 W/m²',
      film150Detail: 'For higher output; bathrooms use heating mats',
      floorplan: 'Project floor plan',
      upload: 'Drag files here or select them from your computer',
      uploadHelp: 'PDF, JPG or PNG · up to 5 files · 10 MB per file · 20 MB in total',
      consent: 'I consent to the processing of my personal data for the purpose of handling this enquiry.',
      privacy: 'Learn more about personal data protection',
      privacyUrl: '/en/personal-data-protection/',
      submit: 'Send for automatic pricing',
      submitting: 'Sending documents…',
      removeFile: 'Remove file',
      remove: 'Remove',
      unsupported: 'The file “{file}” is not in a supported format.',
      tooLarge: 'The file “{file}” is larger than 10 MB.',
      maxFiles: 'You can upload up to 5 files.',
      totalSize: 'The total file size can be no more than 20 MB.',
      required: 'Please check all required fields.',
      attach: 'Please attach at least one floor plan.',
      sendFailed: 'The documents could not be sent.',
      success: 'Thank you. We have received your documents and will send the quote to the email address provided.',
      timeout: 'Sending took too long. Please try again.',
      sendFailedRetry: 'The documents could not be sent. Please try again.'
    }
  };
  var copy = translations[language];

  root.innerHTML = [
    '<div class="larx-ai-quote">',
      '<section class="larx-ai-quote__intro" aria-labelledby="larx-ai-intro-title">',
        '<div class="larx-ai-quote__intro-copy">',
          '<p class="larx-ai-quote__eyebrow">' + copy.eyebrow + '</p>',
          '<h1 id="larx-ai-intro-title">' + copy.introTitle + '</h1>',
          '<p>' + copy.introBody + '</p>',
          '<p class="larx-ai-quote__note"><strong>' + copy.betaStrong + '</strong> ' + copy.betaRest + '</p>',
        '</div>',
        '<ol class="larx-ai-quote__steps" aria-label="' + copy.stepsLabel + '">',
          '<li><span>1</span><strong>' + copy.uploadStep + '</strong><small>' + copy.uploadStepDetail + '</small></li>',
          '<li><span>2</span><strong>' + copy.solutionStep + '</strong><small>' + copy.solutionStepDetail + '</small></li>',
          '<li><span>3</span><strong>' + copy.resultStep + '</strong><small>' + copy.resultStepDetail + '</small></li>',
        '</ol>',
      '</section>',
      '<section class="larx-ai-quote__form-card" aria-label="' + copy.formTitle + '">',
        '<form class="larx-ai-quote__form" enctype="multipart/form-data" novalidate>',
          '<div class="larx-ai-quote__grid">',
            '<label class="larx-ai-quote__field"><span>' + copy.name + ' <b aria-hidden="true">*</b></span><input name="name" type="text" autocomplete="given-name" maxlength="80" required></label>',
            '<label class="larx-ai-quote__field"><span>' + copy.surname + ' <b aria-hidden="true">*</b></span><input name="surname" type="text" autocomplete="family-name" maxlength="80" required></label>',
            '<label class="larx-ai-quote__field"><span>' + copy.phone + ' <b aria-hidden="true">*</b></span><input name="phone" type="tel" autocomplete="tel" maxlength="30" required></label>',
            '<label class="larx-ai-quote__field"><span>' + copy.email + ' <b aria-hidden="true">*</b></span><input name="email" type="email" autocomplete="email" maxlength="160" required></label>',
          '</div>',
          '<fieldset class="larx-ai-quote__fieldset">',
            '<legend>' + copy.systemLegend + ' <b aria-hidden="true">*</b></legend>',
            '<div class="larx-ai-quote__choices">',
              '<label class="larx-ai-quote__choice"><input type="radio" name="folie_typ" value="PTC/OS" required><span><strong>' + copy.film100 + '</strong><small>' + copy.film100Detail + '</small></span></label>',
              '<label class="larx-ai-quote__choice"><input type="radio" name="folie_typ" value="KAR" required><span><strong>' + copy.film150 + '</strong><small>' + copy.film150Detail + '</small></span></label>',
            '</div>',
          '</fieldset>',
          '<fieldset class="larx-ai-quote__fieldset larx-ai-quote__upload-fieldset">',
            '<legend>' + copy.floorplan + ' <b aria-hidden="true">*</b></legend>',
            '<div class="larx-ai-quote__dropzone" role="button" tabindex="0" aria-describedby="larx-ai-file-help">',
              '<input class="larx-ai-quote__file-input" name="attachment[]" type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" multiple>',
              '<span class="larx-ai-quote__upload-icon" aria-hidden="true">↑</span>',
              '<strong>' + copy.upload + '</strong>',
              '<small id="larx-ai-file-help">' + copy.uploadHelp + '</small>',
            '</div>',
            '<div class="larx-ai-quote__files" aria-live="polite"></div>',
            '<p class="larx-ai-quote__file-error" role="alert" hidden></p>',
          '</fieldset>',
          '<label class="larx-ai-quote__consent">',
            '<input type="checkbox" name="souhlas" value="1" required>',
            '<span>' + copy.consent + ' <a href="' + copy.privacyUrl + '">' + copy.privacy + '</a>. <b aria-hidden="true">*</b></span>',
          '</label>',
          '<div class="larx-ai-quote__honeypot" aria-hidden="true"><label>Firma<input name="company" type="text" tabindex="-1" autocomplete="off"></label></div>',
          '<input name="language" type="hidden" value="' + language + '">',
          '<input name="type" type="hidden" value="ai-vypocet">',
          '<input name="page" type="hidden">',
          '<input name="form_started" type="hidden">',
          '<div class="larx-ai-quote__actions">',
            '<button class="larx-ai-quote__submit" type="submit"><span>' + copy.submit + '</span></button>',
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
    var formatted = (bytes / (1024 * 1024)).toFixed(1);
    return (language === 'en' ? formatted : formatted.replace('.', ',')) + ' MB';
  }

  function fileMessage(template, fileName) {
    return template.replace('{file}', fileName);
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
      remove.setAttribute('aria-label', copy.removeFile + ' ' + file.name);
      remove.textContent = copy.remove;
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
        error = fileMessage(copy.unsupported, file.name);
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        error = fileMessage(copy.tooLarge, file.name);
        return;
      }
      var duplicate = next.some(function (existing) {
        return existing.name === file.name && existing.size === file.size && existing.lastModified === file.lastModified;
      });
      if (!duplicate) next.push(file);
    });

    if (!error && next.length > MAX_FILES) error = copy.maxFiles;
    if (!error && totalSize(next) > MAX_TOTAL_SIZE) error = copy.totalSize;

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
      ? copy.submitting
      : copy.submit;
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
      setStatus(copy.required, 'error');
      return;
    }
    if (!selectedFiles.length) {
      setFileError(copy.attach);
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
          throw new Error(body.message || copy.sendFailed);
        }
        return body;
      });
    }).then(function () {
      form.reset();
      selectedFiles = [];
      renderFiles();
      startedInput.value = String(Date.now());
      pageInput.value = window.location.href;
      setStatus(copy.success, 'success');
    }).catch(function (error) {
      var message = error && error.name === 'AbortError'
        ? copy.timeout
        : (error && error.message) || copy.sendFailedRetry;
      setStatus(message, 'error');
    }).then(function () {
      window.clearTimeout(timeout);
      setSubmitting(false);
    });
  });
}(window, document));
