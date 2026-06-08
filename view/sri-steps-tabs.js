(() => {
  const SRI_STEPS = [
    { number: 1, title: 'Heating', href: './SRI5-heating-tab.html' },
    { number: 2, title: 'DHW', href: './SRI6-dhw-tab.html' },
    { number: 3, title: 'Cooling', href: './SRI7-cooling-tab.html' },
    { number: 4, title: 'Ventilation', href: './SRI8-ventilation-tab.html' },
    { number: 5, title: 'Lighting', href: './SRI9-lighting-tab.html' },
    { number: 6, title: 'Dynamic Envelope', href: './SRI10-dynamic-envelope-tab.html' },
    { number: 7, title: 'Electricity', href: './SRI11-electricity-tab.html' },
    { number: 8, title: 'EV Charging', href: './SRI12-ev-charging-tab.html' },
    { number: 9, title: 'Monitoring & Control', href: './SRI13-monitoring-control-tab.html' },
    { number: 10, title: 'SRI Results', href: './SRI14-results.html' }
  ];

  function toFileName(path) {
    return (path || '').split('/').pop().toLowerCase();
  }

  function renderStepsTabs() {
    const tabsHost = document.querySelector('#component-steps-tabs .steps-header');
    if (!tabsHost) return;

    const currentFile = toFileName(window.location.pathname);

    tabsHost.innerHTML = SRI_STEPS.map((step) => {
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