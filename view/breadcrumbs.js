(() => {
  // Generated from links.mmd flow (title + link aware)
  const BREADCRUMB_MAP = {
    'login.html': [{ label: 'Login' }],
    'a-projects-dashboard.html': [{ label: 'Projects Dashboard' }],
    'about.html': [{ label: 'About' }],
    'c-open-edit-building.html': [
      { label: 'Projects Dashboard', href: './A-projects-dashboard.html' },
      { label: 'Building Tab' }
    ],
    'f-global-resource-library.html': [
      { label: 'Projects Dashboard', href: './A-projects-dashboard.html' },
      { label: 'Global Resource Library' }
    ],
    'C-open-edit-building.html': [
      { label: 'Projects Dashboard', href: './A-projects-dashboard.html' },
      { label: 'Building Tab', href: './C-open-edit-building.html' },
      { label: 'Building Tab' }
    ],

    // EPB branch (order aligned with links.mmd)
    'epb1-calculation-settings.html': [
      { label: 'Projects Dashboard', href: './A-projects-dashboard.html' },
      { label: 'Building Tab', href: './C-open-edit-building.html' },
      { label: 'EPB: Calculation Settings' }
    ],
    'epb1b-ground-temperature.html': [
      { label: 'Projects Dashboard', href: './A-projects-dashboard.html' },
      { label: 'Building Tab', href: './C-open-edit-building.html' },
      { label: 'EPB: Calculation Settings', href: './EPB1-calculation-settings.html' },
      { label: 'EPB: Climate Data' }
    ],
    'epb2-materials-constructions.html': [
      { label: 'Projects Dashboard', href: './A-projects-dashboard.html' },
      { label: 'Building Tab', href: './C-open-edit-building.html' },
      { label: 'EPB: Calculation Settings', href: './EPB1-calculation-settings.html' },
      { label: 'EPB: Climate Data', href: './EPB1b-ground-temperature.html' },
      { label: 'EPB: Building Envelope' }
    ],
    'epb-operations-tab.html': [
      { label: 'Projects Dashboard', href: './A-projects-dashboard.html' },
      { label: 'Building Tab', href: './C-open-edit-building.html' },
      { label: 'EPB: Calculation Settings', href: './EPB1-calculation-settings.html' },
      { label: 'EPB: Climate Data', href: './EPB1b-ground-temperature.html' },
      { label: 'EPB: Building Envelope', href: './EPB2-materials-constructions.html' },
      { label: 'EPB: Operations' }
    ],
    'epb3-thermal-zones-envelope.html': [
      { label: 'Projects Dashboard', href: './A-projects-dashboard.html' },
      { label: 'Building Tab', href: './C-open-edit-building.html' },
      { label: 'EPB: Calculation Settings', href: './EPB1-calculation-settings.html' },
      { label: 'EPB: Climate Data', href: './EPB1b-ground-temperature.html' },
      { label: 'EPB: Building Envelope', href: './EPB2-materials-constructions.html' },
      { label: 'EPB: Operations', href: './EPB-operations-tab.html' },
      { label: 'EPB: Thermal Zone' }
    ],
    'epb-spaces-tab.html': [
      { label: 'Projects Dashboard', href: './A-projects-dashboard.html' },
      { label: 'Building Tab', href: './C-open-edit-building.html' },
      { label: 'EPB: Calculation Settings', href: './EPB1-calculation-settings.html' },
      { label: 'EPB: Climate Data', href: './EPB1b-ground-temperature.html' },
      { label: 'EPB: Building Envelope', href: './EPB2-materials-constructions.html' },
      { label: 'EPB: Operations', href: './EPB-operations-tab.html' },
      { label: 'EPB: Thermal Zone', href: './EPB3-thermal-zones-envelope.html' },
      { label: 'EPB: Spaces Tab' }
    ],
    'epb4-results-summary.html': [
      { label: 'Projects Dashboard', href: './A-projects-dashboard.html' },
      { label: 'Building Tab', href: './C-open-edit-building.html' },
      { label: 'EPB: Calculation Settings', href: './EPB1-calculation-settings.html' },
      { label: 'EPB: Climate Data', href: './EPB1b-ground-temperature.html' },
      { label: 'EPB: Building Envelope', href: './EPB2-materials-constructions.html' },
      { label: 'EPB: Operations', href: './EPB-operations-tab.html' },
      { label: 'EPB: Thermal Zone', href: './EPB3-thermal-zones-envelope.html' },
      { label: 'EPB: Spaces Tab' , href: './EPB-spaces-tab.html'  },
      { label: 'EPB: Performance Summary' }
    ],

    // SRI branch
    'sri1-methodology-selection.html': [
      { label: 'Projects Dashboard', href: './A-projects-dashboard.html' },
      { label: 'Building Tab', href: './C-open-edit-building.html' },
      { label: 'SRI: Methodology Selection' }
    ],
    'sri2-user-defined-weightings.html': [
      { label: 'Projects Dashboard', href: './A-projects-dashboard.html' },
      { label: 'Building Tab', href: './C-open-edit-building.html' },
      { label: 'SRI: Methodology Selection', href: './SRI1-methodology-selection.html' },
      { label: 'SRI: User-defined Weightings' }
    ],
    'sri3-weighting-settings.html': [
      { label: 'Projects Dashboard', href: './A-projects-dashboard.html' },
      { label: 'Building Tab', href: './C-open-edit-building.html' },
      { label: 'SRI: Methodology Selection', href: './SRI1-methodology-selection.html' },
      { label: 'SRI: User-defined Weightings', href: './SRI2-user-defined-weightings.html' },
      { label: 'SRI: Weighting Settings' }
    ],
    'sri4-domain-dashboard.html': [
      { label: 'Projects Dashboard', href: './A-projects-dashboard.html' },
      { label: 'Building Tab', href: './C-open-edit-building.html' },
      { label: 'SRI: Methodology Selection', href: './SRI1-methodology-selection.html' },
      { label: 'SRI: Domain Dashboard' }
    ],
    'sri5-heating-tab.html': [{ label: 'Projects Dashboard', href: './A-projects-dashboard.html' }, { label: 'Building Tab', href: './C-open-edit-building.html' }, { label: 'SRI: Methodology Selection', href: './SRI1-methodology-selection.html' }, { label: 'SRI: Domain Dashboard', href: './SRI4-domain-dashboard.html' }, { label: 'SRI: Domain Tabs' }, { label: 'Heating Tab' }],
    'sri6-dhw-tab.html': [{ label: 'Projects Dashboard', href: './A-projects-dashboard.html' }, { label: 'Building Tab', href: './C-open-edit-building.html' }, { label: 'SRI: Methodology Selection', href: './SRI1-methodology-selection.html' }, { label: 'SRI: Domain Dashboard', href: './SRI4-domain-dashboard.html' }, { label: 'SRI: Domain Tabs' }, { label: 'DHW Tab' }],
    'sri7-cooling-tab.html': [{ label: 'Projects Dashboard', href: './A-projects-dashboard.html' }, { label: 'Building Tab', href: './C-open-edit-building.html' }, { label: 'SRI: Methodology Selection', href: './SRI1-methodology-selection.html' }, { label: 'SRI: Domain Dashboard', href: './SRI4-domain-dashboard.html' }, { label: 'SRI: Domain Tabs' }, { label: 'Cooling Tab' }],
    'sri8-ventilation-tab.html': [{ label: 'Projects Dashboard', href: './A-projects-dashboard.html' }, { label: 'Building Tab', href: './C-open-edit-building.html' }, { label: 'SRI: Methodology Selection', href: './SRI1-methodology-selection.html' }, { label: 'SRI: Domain Dashboard', href: './SRI4-domain-dashboard.html' }, { label: 'SRI: Domain Tabs' }, { label: 'Ventilation Tab' }],
    'sri9-lighting-tab.html': [{ label: 'Projects Dashboard', href: './A-projects-dashboard.html' }, { label: 'Building Tab', href: './C-open-edit-building.html' }, { label: 'SRI: Methodology Selection', href: './SRI1-methodology-selection.html' }, { label: 'SRI: Domain Dashboard', href: './SRI4-domain-dashboard.html' }, { label: 'SRI: Domain Tabs' }, { label: 'Lighting Tab' }],
    'sri10-dynamic-envelope-tab.html': [{ label: 'Projects Dashboard', href: './A-projects-dashboard.html' }, { label: 'Building Tab', href: './C-open-edit-building.html' }, { label: 'SRI: Methodology Selection', href: './SRI1-methodology-selection.html' }, { label: 'SRI: Domain Dashboard', href: './SRI4-domain-dashboard.html' }, { label: 'SRI: Domain Tabs' }, { label: 'Dynamic Envelope Tab' }],
    'sri11-electricity-tab.html': [{ label: 'Projects Dashboard', href: './A-projects-dashboard.html' }, { label: 'Building Tab', href: './C-open-edit-building.html' }, { label: 'SRI: Methodology Selection', href: './SRI1-methodology-selection.html' }, { label: 'SRI: Domain Dashboard', href: './SRI4-domain-dashboard.html' }, { label: 'SRI: Domain Tabs' }, { label: 'Electricity Tab' }],
    'sri12-ev-charging-tab.html': [{ label: 'Projects Dashboard', href: './A-projects-dashboard.html' }, { label: 'Building Tab', href: './C-open-edit-building.html' }, { label: 'SRI: Methodology Selection', href: './SRI1-methodology-selection.html' }, { label: 'SRI: Domain Dashboard', href: './SRI4-domain-dashboard.html' }, { label: 'SRI: Domain Tabs' }, { label: 'EV Charging Tab' }],
    'sri13-monitoring-control-tab.html': [{ label: 'Projects Dashboard', href: './A-projects-dashboard.html' }, { label: 'Building Tab', href: './C-open-edit-building.html' }, { label: 'SRI: Methodology Selection', href: './SRI1-methodology-selection.html' }, { label: 'SRI: Domain Dashboard', href: './SRI4-domain-dashboard.html' }, { label: 'SRI: Domain Tabs' }, { label: 'Monitoring & Control Tab' }],
    'sri14-results.html': [
      { label: 'Projects Dashboard', href: './A-projects-dashboard.html' },
      { label: 'Building Tab', href: './C-open-edit-building.html' },
      { label: 'SRI: Methodology Selection', href: './SRI1-methodology-selection.html' },
      { label: 'SRI: Domain Dashboard', href: './SRI4-domain-dashboard.html' },
      { label: 'SRI: Results' }
    ]
  };

  const toFileName = (path) => (path || '').split('/').pop().toLowerCase();

  const toShortLabel = (label = '') => {
    const text = String(label).trim();
    if (text.length <= 3) return text;
    return `${text.slice(0, 3)}...`;
  };

  function getDisplayTrail(trail = []) {
    if (trail.length <= 3) return trail;

    return trail.map((item, index) => {
      const isFirst = index === 0;
      const isSecond = index === 1;
      const isLast = index === trail.length - 1;

      if (isFirst || isSecond || isLast) {
        return { ...item, displayLabel: item.label, title: item.label };
      }

      return {
        ...item,
        displayLabel: toShortLabel(item.label),
        title: item.label
      };
    });
  }

  function renderBreadcrumbs() {
    const host = document.querySelector('#component-breadcrumbs nav ol');
    if (!host) return;
    const trail = BREADCRUMB_MAP[toFileName(window.location.pathname)];
    if (!trail?.length) return;

    const displayTrail = getDisplayTrail(trail);

    host.innerHTML = displayTrail
      .map((item, index) =>
        index === displayTrail.length - 1
          ? `<li aria-current="page" title="${item.title || item.label}">${item.displayLabel || item.label}</li>`
          : `<li><a href="${item.href || '#'}" title="${item.title || item.label}">${item.displayLabel || item.label}</a></li>`
      )
      .join('');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderBreadcrumbs);
  } else {
    renderBreadcrumbs();
  }
})();