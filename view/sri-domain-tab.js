// Shared SRI domain tab renderer.
// Uses ../data_model/sri_epb_ui_data_model_v2.js as the primary source.
(function () {
  const fallbackModel = {
    projects: [{
      building: {
        name: 'Office Athens',
        sri: {
          method: 'A',
          domainsPresence: {},
          serviceCatalogues: { methodA: {}, methodB: {} },
          services: {},
          results: { domains: {} }
        }
      }
    }]
  };

  function toTitleCaseFromEnum(status) {
    return String(status || 'UNKNOWN_STATUS').toLowerCase().split('_').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  }

  function getStatusPresentation(status) {
    const map = {
      READY_FOR_CALCULATION: { label: 'Ready', className: 'chip chip--ready' },
      MISSING_DATA: { label: 'Incomplete data', className: 'chip chip--incomplete' },
      IN_PROGRESS: { label: 'Processing', className: 'chip chip--processing' },
      PROCESSING: { label: 'Processing', className: 'chip chip--processing' },
      CALCULATION_COMPLETED: { label: 'Calculation completed', className: 'chip chip--ready' }
    };
    return map[status] || { label: toTitleCaseFromEnum(status), className: 'chip' };
  }

  function getModel() {
    return window.AppDataModel || fallbackModel;
  }

  function normalizeService(serviceId, existing) {
    const service = existing || {};
    const entries = Array.isArray(service.entries) && service.entries.length
      ? service.entries
      : [{ level: Number(service.level ?? 0), compliance: Number(service.compliance ?? 0) }];
    return {
      id: service.id || serviceId,
      applicable: service.applicable !== false,
      triage: Boolean(service.triage),
      level: Number(service.level ?? entries[0]?.level ?? 0),
      compliance: Number(service.compliance ?? entries.reduce((sum, entry) => sum + Number(entry.compliance || 0), 0)),
      entries: entries.length ? entries : [{ level: 0, compliance: 0 }]
    };
  }

  function renderEntries(service, rowId) {
    const entries = service.entries.length ? service.entries : [{ level: service.level, compliance: service.compliance }];
    return entries.map((entry, index) => `
      <div class="entry-row" data-row="${rowId}">
        <label class="sr-only" for="${rowId}-entry-${index}-level">${service.id} entry ${index + 1} level</label>
        <select id="${rowId}-entry-${index}-level" class="level-input" data-service="${rowId}" ${service.applicable ? '' : 'disabled'}>
          ${[-1, 0, 1, 2, 3, 4].map((level) => `<option value="${level}" ${Number(entry.level) === level ? 'selected' : ''}>${level === -1 ? 'N/A' : `Level ${level}`}</option>`).join('')}
        </select>
        <label class="sr-only" for="${rowId}-entry-${index}-compliance">${service.id} entry ${index + 1} compliance</label>
        <input id="${rowId}-entry-${index}-compliance" class="compliance-input" data-service="${rowId}" type="number" min="0" max="100" step="1" value="${Math.round(Number(entry.compliance || 0) * 100)}" ${service.applicable ? '' : 'disabled'} />
      </div>
    `).join('');
  }

  function updateValidation() {
    const rows = Array.from(document.querySelectorAll('[data-service-row]'));
    let readyRows = 0;

    rows.forEach((row) => {
      const rowId = row.dataset.serviceRow;
      const applicable = row.querySelector('.applicable-input')?.value === 'true';
      row.querySelectorAll('.entries-cell select, .entries-cell input').forEach((control) => {
        control.disabled = !applicable;
      });
      const selectedLevel = row.querySelector('select[id$="-level"]');
      if (selectedLevel) {
        selectedLevel.disabled = !applicable;
        if (!applicable) selectedLevel.value = '-1';
      }
      const complianceInputs = Array.from(row.querySelectorAll('.compliance-input'));
      const total = applicable ? complianceInputs.reduce((sum, input) => sum + Number(input.value || 0), 0) : 100;
      const valid = total === 100;
      if (valid) readyRows += 1;

      const chip = document.getElementById(`${rowId}-status`);
      const status = getStatusPresentation(valid ? 'READY_FOR_CALCULATION' : 'MISSING_DATA');
      chip.className = status.className;
      chip.textContent = applicable ? `${status.label} · ${total}%` : 'Not applicable · 100%';
    });

    const completion = rows.length ? Math.round((readyRows / rows.length) * 100) : 0;
    const allReady = rows.length > 0 && readyRows === rows.length;
    const completionStatus = getStatusPresentation(allReady ? 'READY_FOR_CALCULATION' : 'MISSING_DATA');

    const completionChip = document.getElementById('completion-chip');
    completionChip.className = completionStatus.className;
    completionChip.textContent = `${completion}%`;

    const nextLink = document.getElementById('continue-next');
    const resultsLink = document.getElementById('continue-results');
    [nextLink, resultsLink].forEach((link) => {
      if (!link) return;
      link.classList.toggle('is-disabled', !allReady);
      link.setAttribute('aria-disabled', String(!allReady));
      link.tabIndex = allReady ? 0 : -1;
    });
  }

  function autoAddRemainderEntry(row) {
    const rowId = row.dataset.serviceRow;
    const applicable = row.querySelector('.applicable-input')?.value === 'true';
    if (!applicable) return;
    const entriesCell = row.querySelector('.entries-cell');
    const total = Array.from(row.querySelectorAll('.compliance-input')).reduce((sum, input) => sum + Number(input.value || 0), 0);
    if (total > 0 && total < 100 && entriesCell.querySelectorAll('.entry-row').length < 5) {
      const remainder = Math.max(0, 100 - total);
      entriesCell.insertAdjacentHTML('beforeend', `
        <div class="entry-row" data-row="${rowId}">
          <select class="level-input" data-service="${rowId}">${[0, 1, 2, 3, 4].map((level) => `<option value="${level}">Level ${level}</option>`).join('')}</select>
          <input class="compliance-input" data-service="${rowId}" type="number" min="0" max="100" step="1" value="${remainder}" aria-label="Auto-added remaining compliance share" />
        </div>
      `);
      entriesCell.querySelectorAll('select, input').forEach((control) => control.addEventListener('input', handleServiceInput));
    }
  }

  function handleServiceInput(event) {
    const row = event.target.closest('[data-service-row]');
    if (row && event.target.classList.contains('compliance-input')) autoAddRemainderEntry(row);
    updateValidation();
  }

  function initDomainTab() {
    const config = window.SRI_DOMAIN_CONFIG;
    if (!config) return;
    const hideSelectedLevelColumn = Boolean(config.hideSelectedLevelColumn);

    const model = getModel();
    const project = model?.projects?.[0] || {};
    const building = project?.building || {};
    const sri = building?.sri || {};
    const methodKey = (sri?.method || 'A') === 'B' ? 'methodB' : 'methodA';
    const presence = Number(sri?.domainsPresence?.[config.key] ?? 0);
    const catalogueServices = sri?.serviceCatalogues?.[methodKey]?.[config.key] || [];
    const definedServices = sri?.services?.[config.key] || [];
    const serviceMap = Object.fromEntries(definedServices.map((service) => [service.id, service]));

    document.getElementById('building-name').textContent = building?.name || 'Building';
    document.getElementById('method-label').textContent = `Method ${sri?.method || 'A'}`;

    const presenceLabel = presence === 1 ? 'Present / editable' : presence === 2 ? 'Absent but mandatory' : 'Excluded from calculation';
    const presenceStatus = getStatusPresentation(presence === 1 ? 'READY_FOR_CALCULATION' : 'MISSING_DATA');
    const domainStatusEl = document.getElementById('domain-status');
    domainStatusEl.className = presenceStatus.className;
    domainStatusEl.textContent = presenceLabel;

    const domainScore = Number(sri?.results?.domains?.[config.key] || 0);
    const scoreStatus = getStatusPresentation(domainScore > 0 ? 'CALCULATION_COMPLETED' : 'IN_PROGRESS');
    const domainScoreEl = document.getElementById('domain-score');
    domainScoreEl.className = scoreStatus.className;
    domainScoreEl.textContent = `${domainScore}%`;

    const body = document.getElementById('service-body');
    body.innerHTML = '';

    if (presence !== 1) {
      body.innerHTML = `<tr><td colspan="${hideSelectedLevelColumn ? 6 : 7}"><p class="muted">${presence === 2 ? 'This domain is flagged as mandatory but absent. Normal editing is disabled.' : 'This domain is excluded from calculation and has no editable service rows.'}</p></td></tr>`;
      updateValidation();
      return;
    }

    catalogueServices.forEach((serviceId, index) => {
      const service = normalizeService(serviceId, serviceMap[serviceId]);
      const rowId = `service-${index}`;
      const tr = document.createElement('tr');
      tr.dataset.serviceRow = rowId;
      tr.innerHTML = `
        <td><strong>${service.id}</strong></td>
        <td>
          <label class="sr-only" for="${rowId}-applicable">${service.id} applicable</label>
          <select id="${rowId}-applicable" class="applicable-input" data-service="${rowId}">
            <option value="true" ${service.applicable ? 'selected' : ''}>Yes</option>
            <option value="false" ${!service.applicable ? 'selected' : ''}>No</option>
          </select>
        </td>
        <td>
          <label><input class="triage-input" type="checkbox" ${service.triage ? 'checked' : ''}> Affect max score</label>
        </td>
        ${hideSelectedLevelColumn ? '' : `<td>
          <label class="sr-only" for="${rowId}-level">${service.id} selected level</label>
          <select id="${rowId}-level" class="level-input" data-service="${rowId}">
            ${[-1, 0, 1, 2, 3, 4].map((level) => `<option value="${level}" ${service.level === level ? 'selected' : ''}>${level === -1 ? 'N/A' : `Level ${level}`}</option>`).join('')}
          </select>
        </td>`}
        <td class="entries-cell">${renderEntries(service, rowId)}</td>
        <td><button class="btn btn-sm btn-default add-entry" type="button" data-service="${rowId}">Add entry</button></td>
        <td><span id="${rowId}-status" class="chip">Checking</span></td>
      `;
      body.appendChild(tr);
    });

    document.querySelectorAll('select, input').forEach((control) => control.addEventListener('input', handleServiceInput));
    document.querySelectorAll('.add-entry').forEach((button) => {
      button.addEventListener('click', () => {
        const rowId = button.dataset.service;
        const row = document.querySelector(`[data-service-row="${rowId}"]`);
        const entriesCell = row.querySelector('.entries-cell');
        const index = entriesCell.querySelectorAll('.entry-row').length;
        entriesCell.insertAdjacentHTML('beforeend', `
          <div class="entry-row" data-row="${rowId}">
            <select class="level-input" data-service="${rowId}">${[0, 1, 2, 3, 4].map((level) => `<option value="${level}">Level ${level}</option>`).join('')}</select>
            <input class="compliance-input" data-service="${rowId}" type="number" min="0" max="100" step="1" value="0" aria-label="Additional compliance entry ${index + 1}" />
          </div>
        `);
        entriesCell.querySelectorAll('select, input').forEach((control) => control.addEventListener('input', handleServiceInput));
        updateValidation();
      });
    });

    document.addEventListener('click', (event) => {
      const disabledLink = event.target.closest('a.is-disabled');
      if (disabledLink) event.preventDefault();
    });

    updateValidation();
  }

  window.addEventListener('DOMContentLoaded', initDomainTab);
})();