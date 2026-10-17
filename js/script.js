// LineSig — shared site behavior

document.addEventListener('DOMContentLoaded', function () {
  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
  }

  // Highlight the current page in the nav
  var current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === current) {
      link.classList.add('active');
    }
  });

  // Contact form — validates in the browser, then POSTs to FormSubmit,
  // which emails the submission to the address in FORM_ENDPOINT.
  var FORM_ENDPOINT = 'https://formsubmit.co/ajax/sales@linesig.com';
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');
  if (form && status) {
    var show = function (msg, ok) {
      status.textContent = msg;
      status.classList.add('show');
      status.classList.toggle('success', !!ok);
    };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;
      form.querySelectorAll('[required]').forEach(function (f) {
        var bad = !f.value.trim() || (f.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.value.trim()));
        f.classList.toggle('invalid', bad);
        if (bad && !firstBad) firstBad = f;
      });
      if (firstBad) {
        show('Please complete all required fields marked with *.', false);
        firstBad.focus();
        return;
      }
      var btn = form.querySelector('button[type="submit"]');
      var data = new FormData(form);
      data.append('_subject', 'New LineSig website enquiry: ' + data.get('product'));
      data.append('_replyto', data.get('email'));
      data.append('_template', 'table');
      data.append('_captcha', 'false');
      btn.disabled = true;
      show('Sending…', true);
      fetch(FORM_ENDPOINT, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } })
        .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
        .then(function (res) {
          if (res.ok && String(res.d.success) !== 'false') {
            show('Thank you — your message has been sent. Our team will reply by email shortly.', true);
            form.reset();
          } else {
            throw new Error('send failed');
          }
        })
        .catch(function () {
          show('Sorry, something went wrong. Please email us directly at sales@linesig.com.', false);
        })
        .then(function () { btn.disabled = false; });
    });
    form.addEventListener('input', function (e) { e.target.classList.remove('invalid'); });
  }
});