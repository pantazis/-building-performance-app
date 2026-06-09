(function () {
  const impactLabels = {
    energyEfficiency: 'Energy efficiency',
    maintenance: 'Maintenance & fault prediction',
    comfort: 'Comfort',
    convenience: 'Convenience',
    health: 'Health & accessibility',
    info: 'Information to occupants',
    flexibility: 'Energy flexibility & storage'
  };

  const domainLabels = {
    heating: '🔥 Heating',
    dhw: '🚿 Domestic hot water',
    cooling: '❄️ Cooling',
    ventilation: '🌬️ Ventilation',
    lighting: '💡 Lighting',
    envelope: '🪟 Dynamic building envelope',
    electricity: '⚡ Electricity',
    ev: '🚗 EV charging',
    monitoring: '🖥️ Monitoring and control'
  };

  const domainRoutes = {
    heating: './SRI5-heating-tab.html',
    dhw: './SRI6-dhw-tab.html',
    cooling: './SRI7-cooling-tab.html',
    ventilation: './SRI8-ventilation-tab.html',
    lighting: './SRI9-lighting-tab.html',
    envelope: './SRI10-dynamic-envelope-tab.html',
    electricity: './SRI11-electricity-tab.html',
    ev: './SRI12-ev-charging-tab.html',
    monitoring: './SRI13-monitoring-control-tab.html'
  };

  const queryStates = ['nodata', 'halfdata', 'fulldata'];

  function toTitleCaseFromEnum(status) {
    return String(status || 'UNKNOWN_STATUS').toLowerCase().split('_').map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1)).join(' ');
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

  function getRequestedDataState() {
    const params = new URLSearchParams(window.location.search);
    return queryStates.find((key) => params.has(key)) || null;
  }

  function buildDefaultPageData() {
    const model = window.AppDataModel || { projects: [] };
    const building = model?.projects?.[0]?.building || {};
    const sri = building?.sri || {};
    const results = sri?.results || {};
    const totalScore = Number(results?.totalScore || 0);

    return {
      state: 'default',
      stateLabel: 'Default model',
      stateStatus: totalScore > 0 ? 'CALCULATION_COMPLETED' : 'IN_PROGRESS',
      stateTone: 'default',
      stateTitle: 'Default model data',
      stateMessage: 'The page is using the current SRI results available from sri_epb_ui_data_model_v2.js.',
      assessmentSummary: {
        buildingName: building?.name || 'Building',
        method: sri?.method || 'A',
        totalScore,
        class: String(results?.class || 'N/A'),
        status: totalScore > 0 ? 'CALCULATION_COMPLETED' : 'IN_PROGRESS'
      },
      domainCards: Object.entries(domainLabels).map(([key, label]) => {
        const score = results?.domains?.[key];
        const presence = sri?.domainsPresence?.[key] ?? (key === 'ev' ? 0 : 1);
        return {
          key,
          label: label.replace(/^[^\w]+\s/, ''),
          presence,
          score: typeof score === 'number' ? score : null,
          status: typeof score === 'number' ? 'CALCULATION_COMPLETED' : 'IN_PROGRESS',
          message: presence === 0 ? 'Domain is absent and excluded from the current calculation.' : 'Open tab to continue editable service-level inputs.',
          href: domainRoutes[key]
        };
      }),
      results
    };
  }

  function buildEmbeddedStateData(state) {
    const commonCards = [
      ['heating', 'Heating', 1, './SRI5-heating-tab.html'],
      ['dhw', 'DHW', 1, './SRI6-dhw-tab.html'],
      ['cooling', 'Cooling', 1, './SRI7-cooling-tab.html'],
      ['ventilation', 'Ventilation', 1, './SRI8-ventilation-tab.html'],
      ['lighting', 'Lighting', 1, './SRI9-lighting-tab.html'],
      ['envelope', 'Dynamic Envelope', 1, './SRI10-dynamic-envelope-tab.html'],
      ['electricity', 'Electricity', 1, './SRI11-electricity-tab.html'],
      ['ev', 'EV Charging', 0, './SRI12-ev-charging-tab.html'],
      ['monitoring', 'Monitoring & Control', 1, './SRI13-monitoring-control-tab.html']
    ];

    if (state === 'nodata') {
      return {
        state: 'nodata',
        stateLabel: 'No data',
        stateStatus: 'MISSING_DATA',
        stateTone: 'danger',
        stateTitle: 'No SRI result data is available yet',
        stateMessage: 'The JSON file describes an assessment with no completed SRI calculation data. Assessment summary, domain cards, and the result table all show missing-data states.',
        assessmentSummary: { buildingName: 'Office Athens', method: 'A', totalScore: 0, class: 'N/A', status: 'MISSING_DATA' },
        domainCards: commonCards.map(([key, label, presence, href]) => ({ key, label, presence, href, score: null, status: 'MISSING_DATA', message: presence === 0 ? 'Domain is absent and excluded until changed.' : 'Required service data is missing.' })),
        results: { totalScore: 0, class: 'N/A', impacts: {}, domains: {}, detailedScores: {}, aggregatedScores: null }
      };
    }

    if (state === 'halfdata') {
      const scores = { heating: 68, dhw: 44, cooling: 55, lighting: 35, electricity: 50 };
      return {
        state: 'halfdata',
        stateLabel: 'Half data',
        stateStatus: 'IN_PROGRESS',
        stateTone: 'warning',
        stateTitle: 'Partial SRI result preview',
        stateMessage: 'The JSON file describes a partial assessment. Some scores are available, while incomplete domains and table cells remain clearly marked as unavailable.',
        assessmentSummary: { buildingName: 'Office Athens', method: 'A', totalScore: 42, class: 'D', status: 'IN_PROGRESS' },
        domainCards: commonCards.map(([key, label, presence, href]) => ({ key, label, presence, href, score: scores[key] ?? null, status: typeof scores[key] === 'number' ? 'CALCULATION_COMPLETED' : 'MISSING_DATA', message: typeof scores[key] === 'number' ? 'Partial result data is available for this domain.' : 'This domain still needs data before final calculation.' })),
        results: {
          totalScore: 42,
          class: 'D',
          impacts: { energyEfficiency: 48, maintenance: 32, comfort: 46, convenience: 40 },
          domains: scores,
          detailedScores: {
            heating: { energyEfficiency: 70, maintenance: 60, comfort: 66, convenience: 62 },
            dhw: { energyEfficiency: 46, maintenance: 35, comfort: 42, convenience: 39 },
            cooling: { energyEfficiency: 58, maintenance: 40, comfort: 57, convenience: 50 },
            lighting: { energyEfficiency: 35, comfort: 38, convenience: 33 },
            electricity: { energyEfficiency: 50, flexibility: 52 }
          },
          aggregatedScores: { availableDomains: 5, missingDomains: 4, finalReady: false }
        }
      };
    }

    const fullScores = { heating: 80, dhw: 72, cooling: 70, ventilation: 76, lighting: 82, envelope: 69, electricity: 74, ev: 67, monitoring: 78 };
    const fullDetailed = Object.fromEntries(Object.keys(fullScores).map((key) => [key, { energyEfficiency: 74, maintenance: 71, comfort: 79, convenience: 77, health: 73, info: 76, flexibility: 72 }]));
    return {
      state: 'fulldata',
      stateLabel: 'Full data',
      stateStatus: 'CALCULATION_COMPLETED',
      stateTone: 'success',
      stateTitle: 'Complete SRI result ready',
      stateMessage: 'The JSON file describes a complete SRI result. Assessment summary, domain cards, and the full result table are populated.',
      assessmentSummary: { buildingName: 'Office Athens', method: 'A', totalScore: 75, class: 'B', status: 'CALCULATION_COMPLETED' },
      domainCards: commonCards.map(([key, label, presence, href]) => ({ key, label, presence: key === 'ev' ? 1 : presence, href, score: fullScores[key] ?? null, status: 'CALCULATION_COMPLETED', message: 'Final result data is complete for this domain.' })),
      results: {
        totalScore: 75,
        class: 'B',
        impacts: { energyEfficiency: 74, maintenance: 71, comfort: 79, convenience: 77, health: 73, info: 76, flexibility: 72 },
        domains: fullScores,
        detailedScores: fullDetailed,
        aggregatedScores: { availableDomains: 9, excludedDomains: 0, impactAverage: 75, domainAverage: 75, finalReady: true }
      }
    };
  }

  function loadPageData() {
    const requestedState = getRequestedDataState();
    if (!requestedState) return buildDefaultPageData();
    return buildEmbeddedStateData(requestedState);
  }

  function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  }

  function renderStateExplanation(pageData) {
    const panel = document.getElementById('query-state-explanation');
    if (!panel) return;
    panel.className = `query-state-explanation query-state--${pageData.stateTone || 'default'}`;
    panel.innerHTML = `<h3>${pageData.stateLabel}: ${pageData.stateTitle}</h3><p>${pageData.stateMessage}</p>`;
  }

  function renderAssessmentSummary(pageData) {
    const summary = pageData.assessmentSummary || {};
    const totalScore = Number(summary.totalScore || 0);
    const sriClass = String(summary.class || 'N/A');

    setText('building-name', summary.buildingName || 'Building');
    setText('method-label', `Method ${summary.method || 'A'}`);
    setText('sri-title', `Overall SRI Score: ${totalScore}% · Class ${sriClass}`);
    setText('gauge-percent', `${totalScore}%`);

    const scoreChip = document.getElementById('sri-score-chip');
    scoreChip.className = totalScore > 0 ? 'chip chip--ready' : 'chip chip--incomplete';
    scoreChip.textContent = `${totalScore}%`;

    const classChip = document.getElementById('sri-class-chip');
    classChip.className = totalScore > 0 ? 'chip chip--ready' : 'chip chip--incomplete';
    classChip.textContent = `Class ${sriClass}`;

    const resultStatus = getStatusPresentation(summary.status || pageData.stateStatus);
    const resultStatusChip = document.getElementById('result-status-chip');
    resultStatusChip.className = resultStatus.className;
    resultStatusChip.textContent = resultStatus.label;

    const needle = document.getElementById('needle');
    needle.style.transform = `rotate(${-90 + (Math.max(0, Math.min(100, totalScore)) * 1.8)}deg)`;
  }

  function renderDomainCards(pageData) {
    const grid = document.getElementById('domains-grid');
    grid.innerHTML = '';
    (pageData.domainCards || []).forEach((domain) => {
      const status = getStatusPresentation(domain.status);
      const scoreText = domain.presence === 0 ? 'Excluded' : (typeof domain.score === 'number' ? `${domain.score}%` : 'Unavailable');
      const article = document.createElement('article');
      article.className = 'domain-card';
      article.innerHTML = `
        <h3>${domain.label}</h3>
        <div class="meta">
          <span class="${status.className}">${status.label}</span>
          <span class="chip">Score: ${scoreText}</span>
        </div>
        <p class="muted">Presence flag: ${domain.presence} · ${domain.message}</p>
        <div class="actions">
          <a class="btn btn-default" href="${domain.href || domainRoutes[domain.key] || './SRI14-results.html?nodata'}">Open ${domain.label}</a>
        </div>
      `;
      grid.appendChild(article);
    });
  }

  function renderResultsTable(pageData) {
    const body = document.getElementById('sri-results-body');
    const results = pageData.results || {};
    const domainCardsByKey = Object.fromEntries((pageData.domainCards || []).map((domain) => [domain.key, domain]));
    const detailedScores = results.detailedScores || {};
    const domainScores = results.domains || {};
    const impactScores = results.impacts || {};
    const impactKeys = Object.keys(impactLabels);
    body.innerHTML = '';

    Object.entries(domainLabels).forEach(([domainKey, domainLabel]) => {
      const tr = document.createElement('tr');
      const domainCard = domainCardsByKey[domainKey] || {};
      const domainScore = domainScores[domainKey];
      const domainScoreText = domainCard.presence === 0 ? 'Excluded' : (typeof domainScore === 'number' ? `${domainScore}%` : 'Unavailable');
      const cells = impactKeys.map((impactKey) => {
        const detailedValue = detailedScores?.[domainKey]?.[impactKey];
        return typeof detailedValue === 'number' ? `<td>${detailedValue}%</td>` : '<td class="disabled">No detailed result</td>';
      }).join('');
      tr.innerHTML = `<th>${domainLabel}<br><span class="caption">Domain score: ${domainScoreText}</span></th>` + cells;
      body.appendChild(tr);
    });

    const impactRow = document.createElement('tr');
    impactRow.innerHTML = Object.keys(impactScores).length
      ? '<th>ImpactScores</th>' + impactKeys.map((impactKey) => typeof impactScores[impactKey] === 'number' ? `<td>${impactScores[impactKey]}%</td>` : '<td class="disabled">Unavailable</td>').join('')
      : '<th>ImpactScores</th><td colspan="7" class="disabled">Impact score breakdown is unavailable.</td>';
    body.appendChild(impactRow);

    const aggregatedRow = document.createElement('tr');
    aggregatedRow.innerHTML = results.aggregatedScores
      ? `<th>AggregatedScores</th><td colspan="7">${Object.entries(results.aggregatedScores).map(([key, value]) => `${toTitleCaseFromEnum(key)}: ${value}`).join(' · ')}</td>`
      : '<th>AggregatedScores</th><td colspan="7" class="disabled">Aggregated score details are not available in the current result model.</td>';
    body.appendChild(aggregatedRow);
  }

  const pageData = loadPageData();
  renderStateExplanation(pageData);
  renderAssessmentSummary(pageData);
  renderDomainCards(pageData);
  renderResultsTable(pageData);
}());