// form-modal.js

function waitForFormLoad(selector, callback) {
  const interval = setInterval(() => {
    const form = document.querySelector(selector);
    if (form) {
      clearInterval(interval);
      callback(form);
    }
  }, 20);
}

export function showFormModal() {
  waitForFormLoad('.form.navform.block', (formBlock) => {
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.className = 'modal-close';

    closeBtn.addEventListener('click', () => {
      modalOverlay.style.display = 'none';
      document.body.style.overflow = '';
    });

    formBlock.style.display = 'block';
    formBlock.style.margin = '0';

    modalContent.appendChild(closeBtn);
    modalContent.appendChild(formBlock);
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);

    const triggerButton = document.querySelector('a[title="Start your journey"]');
    if (triggerButton) {
      triggerButton.addEventListener('click', (e) => {
        e.preventDefault();
        modalOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      });
    }

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  });
}

export default function decorate() {
  showFormModal();
}
