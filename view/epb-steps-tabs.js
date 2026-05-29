(() => {
  const EPB_STEPS = [
    { number: 1, title: 'Calculation Settings', href: './EPB1-calculation-settings.html' },
    { number: 2, title: 'Climate Data', href: './EPB1b-ground-temperature.html' },
    { number: 3, title: 'Building Envelope', href: './EPB2-materials-constructions.html' },
    { number: 4, title: 'Operations', href: './EPB-operations-tab.html' },
    { number: 5, title: 'Thermal Zone', href: './EPB3-thermal-zones-envelope.html' },
    { number: 6, title: 'Spaces Tab', href: './EPB-spaces-tab.html' },
    { number: 7, title: 'Performance Summary', href: './EPB4-results-summary.html' }
  ];

  function toFileName(path) {
    return (path || '').split('/').pop().toLowerCase();
  }

  function renderStepsTabs() {
    const tabsHost = document.querySelector('#component-steps-tabs .steps-header');
    if (!tabsHost) return;

    const currentFile = toFileName(window.location.pathname);

    tabsHost.innerHTML = EPB_STEPS.map((step) => {
      const targetFile = toFileName(step.href);
      const isActive = currentFile === targetFile;

      return `
        <a class="step-item${isActive ? ' is-active' : ''}" role="tab" aria-selected="${isActive ? 'true' : 'false'}" ${isActive ? 'aria-current="page"' : ''} href="${step.href}">
          <span class="step-number">${step.number}</span>
          <span class="step-title">${step.title}</span>
        </a>
      `;
    }).join('');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderStepsTabs);
  } else {
    renderStepsTabs();
  }
})();




