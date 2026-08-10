(() => {
  const config = window.HIDROCASA_CONFIG || {};
  const products = config.products || {};
  const quote = new Map();

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const menuToggle = $('.menu-toggle');
  const nav = $('.main-nav');

  menuToggle?.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!open));
    nav?.classList.toggle('is-open', !open);
  });

  $$('.main-nav a').forEach(link => link.addEventListener('click', () => {
    menuToggle?.setAttribute('aria-expanded', 'false');
    nav?.classList.remove('is-open');
  }));

  const toast = $('#toast');
  let toastTimer;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
  }

  function addProduct(id) {
    if (!products[id]) return;
    quote.set(id, (quote.get(id) || 0) + 1);
    renderQuote();
    showToast(`${products[id].name} agregado a la cotización.`);
  }

  function changeQuantity(id, change) {
    const next = (quote.get(id) || 0) + change;
    if (next <= 0) quote.delete(id);
    else quote.set(id, next);
    renderQuote();
  }

  function renderQuote() {
    const container = $('#quote-items');
    const count = [...quote.values()].reduce((sum, qty) => sum + qty, 0);
    const countEl = $('#quote-count');
    if (countEl) countEl.textContent = String(count);

    if (!container) return;
    if (!quote.size) {
      container.innerHTML = '<p class="empty-state">Aún no has agregado productos.</p>';
      return;
    }

    container.innerHTML = [...quote.entries()].map(([id, qty]) => {
      const product = products[id];
      return `
        <div class="quote-item">
          <div>
            <strong>${product.name}</strong>
            <span>${product.description}</span>
          </div>
          <div class="quantity-control" aria-label="Cantidad de ${product.name}">
            <button type="button" data-qty="-1" data-product="${id}" aria-label="Reducir cantidad">−</button>
            <span>${qty}</span>
            <button type="button" data-qty="1" data-product="${id}" aria-label="Aumentar cantidad">+</button>
          </div>
        </div>`;
    }).join('');

    $$('[data-qty]', container).forEach(button => {
      button.addEventListener('click', () => {
        changeQuantity(button.dataset.product, Number(button.dataset.qty));
      });
    });
  }

  $$('.js-add-quote').forEach(button => {
    button.addEventListener('click', () => {
      addProduct(button.dataset.product);
      if (button.classList.contains('js-close-after-add')) button.closest('dialog')?.close();
    });
  });

  $('#quote-dock')?.addEventListener('click', () => {
    $('#contacto')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  $$('.js-open-modal').forEach(button => {
    button.addEventListener('click', () => {
      const modal = document.getElementById(button.dataset.modal);
      if (modal?.showModal) modal.showModal();
    });
  });

  $$('.js-close-modal').forEach(button => {
    button.addEventListener('click', () => button.closest('dialog')?.close());
  });

  $$('.product-modal, .brochure-modal').forEach(dialog => {
    dialog.addEventListener('click', event => {
      if (event.target === dialog) dialog.close();
    });
  });

  const emailLink = $('.js-email-link');
  if (emailLink && config.email) {
    emailLink.textContent = config.email;
    emailLink.href = `mailto:${config.email}`;
  }

  $('#quote-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    if (!quote.size) {
      showToast('Agrega al menos un producto antes de enviar.');
      $('#productos')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    const selected = [...quote.entries()]
      .map(([id, qty]) => `• ${qty} x ${products[id].name}`)
      .join('\n');

    const message = [
      `Hola ${config.businessName || 'Hidro Casa HN'},`,
      '',
      `Mi nombre es ${form.get('nombre')}.`,
      `Ciudad: ${form.get('ciudad')}.`,
      '',
      'Deseo cotizar:',
      selected,
      '',
      form.get('mensaje') ? `Consulta: ${form.get('mensaje')}` : 'Agradezco información sobre precio, disponibilidad y envío.'
    ].join('\n');

    const email = String(config.email || '').trim();
    if (!email || !email.includes('@')) {
      showToast('Configura el correo de ventas en config.js antes de publicar.');
      return;
    }

    const subject = `Solicitud de cotización - ${config.businessName || 'Hidro Casa HN'}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  });

  $('#year').textContent = new Date().getFullYear();
  renderQuote();
})();
