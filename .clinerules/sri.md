# SRI Current Human-Readable Flow and Data Map

This file documents the current **SRI UI journey** in plain language. It maps the SRI flow to the existing relative HTML files in `/view` and lists the data each page needs from the default data model.

## Sources Used

- Flow source: `../plan.mmd`
- Plain-language product context: `../info.txt`
- Breadcrumb/navigation source: `../view/breadcrumbs.js`
- Official SRI UI documentation: `3_UI_SRI_v5.0.docx`
- Default UI data model: `../data_model/sri_epb_ui_data_model_v2.js`

## Current View Coverage

All SRI views from the current flow are present in `/view`.

Missing non-SRI views from the master list:

- `G` - Language Selection
- `H` - User Profile

## Simple SRI User Journey

The SRI journey starts after the user has selected or created a building.

1. User opens a building from the Projects Dashboard.
2. User enters the Building Tab.
3. User chooses the SRI workflow.
4. User selects the SRI methodology and domain presence.
5. If default rules need confirmation, user passes through the SRI rules decision page.
6. EU + User-defined weighting now continues directly to the domain dashboard.
7. User reviews the domain dashboard.
8. User fills smart-readiness information for each relevant domain.
9. System displays the final SRI score, class, and breakdowns.

## SRI Flow With Relative HTML Files

| Flow ID | Screen / Step | Relative HTML file | Previous step | Next step(s) | Human-readable purpose |
|---|---|---|---|---|---|
| `I` | Building Tab | `../view/I-building-tab.html` | Projects Dashboard / Add Building / Open Building | `SRI1` | Entry point for EPB and SRI workflows after a building exists. |
| `SRI1` | Methodology Selection | `../view/SRI1-methodology-selection.html` | `I` | `SRI2` for default confirmation, `SRI4` for EU + User-defined | Choose Method A or B, default/user-defined weightings, assessment date, and which SRI domains exist. |
| `SRI2` | User-defined Weightings Decision | `../view/SRI2-Default-weightings.html` | `SRI1` | `SRI4` | Confirm selected SRI rules and continue to the domain dashboard. |
| `SRI3` | Weighting Settings | `../view/SRI3-weighting-settings.html` | Legacy/manual access | `SRI4` | Legacy weighting settings view; not part of the current EU + User-defined live route. |
| `SRI4` | Results | `../view/SRI14-results.html` | `SRI1` or `SRI2` | `SRI5`-`SRI13`, then `SRI14` | Shows available SRI domains and their completion state based on domain presence and method. |
| `SRI5` | Heating Tab | `../view/SRI5-heating-tab.html` | `SRI4` | `SRI14` | Fill Heating service categories and functionality levels. |
| `SRI6` | Domestic Hot Water Tab | `../view/SRI6-dhw-tab.html` | `SRI4` | `SRI14` | Fill DHW service categories and functionality levels. |
| `SRI7` | Cooling Tab | `../view/SRI7-cooling-tab.html` | `SRI4` | `SRI14` | Fill Cooling service categories and functionality levels. |
| `SRI8` | Ventilation Tab | `../view/SRI8-ventilation-tab.html` | `SRI4` | `SRI14` | Fill Ventilation service categories and functionality levels. |
| `SRI9` | Lighting Tab | `../view/SRI9-lighting-tab.html` | `SRI4` | `SRI14` | Fill Lighting service categories and functionality levels. |
| `SRI10` | Dynamic Envelope Tab | `../view/SRI10-dynamic-envelope-tab.html` | `SRI4` | `SRI14` | Fill Dynamic Building Envelope service categories and functionality levels. |
| `SRI11` | Electricity Tab | `../view/SRI11-electricity-tab.html` | `SRI4` | `SRI14` | Fill Electricity service categories and functionality levels. |
| `SRI12` | EV Charging Tab | `../view/SRI12-ev-charging-tab.html` | `SRI4` | `SRI14` | Fill Electric Vehicle Charging service categories and functionality levels. |
| `SRI13` | Monitoring & Control Tab | `../view/SRI13-monitoring-control-tab.html` | `SRI4` | `SRI14` | Fill Monitoring and Control service categories and functionality levels. |
| `SRI14` | SRI Results | `../view/SRI14-results.html` | Any SRI domain tab | End / return to dashboard | Shows final score, performance class, and score breakdowns. |

## Breadcrumb Flow Summary

`../view/breadcrumbs.js` confirms the user-facing breadcrumb pattern:

```text
Projects Dashboard → Building Tab → SRI: Methodology Selection → SRI: Results → Domain Tab / Results
```

For domain pages, the current breadcrumb keeps a grouped label `SRI: Domain Tabs` before the specific domain tab, for example:

```text
Projects Dashboard → Building Tab → SRI: Methodology Selection → SRI: Results → SRI: Domain Tabs → Heating Tab
```

## Main Data Location

All SRI pages should use the default data source:

```text
../data_model/sri_epb_ui_data_model_v2.js
```

Main object path:

```text
AppDataModel.projects[0].building.sri
```

## Per-Page Data Requirements

### `SRI1` - Methodology Selection

Relative file:

```text
../view/SRI1-methodology-selection.html
```

Needs these data fields:

| Data path | Meaning | UI requirement |
|---|---|---|
| `sri.method` | Preferred service catalogue | Dropdown: Method A or Method B. |
| `sri.hasDefaultWeightings` | Preferred weightings | `true` = Default, `false` = User-defined. |
| `sri.jurisdiction.region` | EU / Non-EU context | If `NON_EU`, force `hasDefaultWeightings = false`. |
| `sri.jurisdiction.country` | Country of assessment | Used for mandatory-domain context. |
| `sri.assessmentDate` | Assessment date | Date input. |
| `sri.domainsPresence` | Present/absent/mandatory status for every domain | Dropdown per domain: `1`, `2`, or `0`. |

Domain presence values:

| Value | Human label | Meaning |
|---|---|---|
| `1` | Present | Domain exists and should be visible/editable. |
| `2` | Absent but mandatory | Domain is not present, but mandatory for new construction; keep as readable/flagged data. |
| `0` | Absent and not mandatory | Domain is excluded from calculation. |

### `SRI2` - User-defined Weightings Decision

Relative file:

```text
../view/SRI2-Default-weightings.html
```

Needs these data fields:

| Data path | Meaning | UI requirement |
|---|---|---|
| `sri.hasDefaultWeightings` | Whether default weightings are used | Current live route continues to `SRI4` for both default and user-defined modes. |
| `sri.jurisdiction.region` | EU / Non-EU context | Non-EU forces user-defined weighting. |

### `SRI3` - Weighting Settings

Relative file:

```text
../view/SRI3-weighting-settings.html
```

Needs these data fields:

| Data path | Meaning | UI requirement |
|---|---|---|
| `sri.weighting.impacts.energyEfficiency` | Energy efficiency impact weighting | Percent input. |
| `sri.weighting.impacts.maintenance` | Maintenance and fault prediction weighting | Percent input. |
| `sri.weighting.impacts.comfort` | Comfort weighting | Percent input. |
| `sri.weighting.impacts.convenience` | Convenience weighting | Percent input. |
| `sri.weighting.impacts.health` | Health, well-being and accessibility weighting | Percent input. |
| `sri.weighting.impacts.info` | Information to occupants weighting | Percent input. |
| `sri.weighting.impacts.flexibility` | Energy flexibility and storage weighting | Percent input. |
| `sri.weighting.domainWeightingsByImpact` | Domain weights for each impact category | Multi-tabbed inputs; each impact group must total 100%. |

Validation:

- Sum of all impact weighting fields must equal **100%**.
- For each impact category, domain weightings must equal **100%**.
- The Next button should remain disabled until all required totals are valid.

### `SRI4` - Results

Relative file:

```text
../view/SRI14-results.html
```

Needs these data fields:

| Data path | Meaning | UI requirement |
|---|---|---|
| `sri.method` | Method A or B | Determines available service catalogue and level descriptions. |
| `sri.domainsPresence` | Domain presence map | Determines visible/editable/hidden domains. |
| `sri.serviceCatalogues.methodA` | Method A available services | Used when `sri.method = "A"`. |
| `sri.serviceCatalogues.methodB` | Method B available services | Used when `sri.method = "B"`. |
| `sri.services` | Entered service data by domain | Used for completion status and routing to domain tabs. |

Rules:

- If domain presence is `1`, show the domain tab as visible and interactive.
- If domain presence is `2`, hide normal editing but keep the domain flagged as absent but mandatory.
- If domain presence is `0`, hide and exclude the domain from calculation.

## Domain Tabs Data Matrix

Each domain tab uses the same data pattern. The specific domain key changes.

| Flow ID | Domain | Relative HTML file | Presence path | Services path | Catalogue path for Method A | Catalogue path for Method B |
|---|---|---|---|---|---|---|
| `SRI5` | Heating | `../view/SRI5-heating-tab.html` | `sri.domainsPresence.heating` | `sri.services.heating` | `sri.serviceCatalogues.methodA.heating` | `sri.serviceCatalogues.methodB.heating` |
| `SRI6` | Domestic Hot Water | `../view/SRI6-dhw-tab.html` | `sri.domainsPresence.dhw` | `sri.services.dhw` | `sri.serviceCatalogues.methodA.dhw` | `sri.serviceCatalogues.methodB.dhw` |
| `SRI7` | Cooling | `../view/SRI7-cooling-tab.html` | `sri.domainsPresence.cooling` | `sri.services.cooling` | `sri.serviceCatalogues.methodA.cooling` | `sri.serviceCatalogues.methodB.cooling` |
| `SRI8` | Ventilation | `../view/SRI8-ventilation-tab.html` | `sri.domainsPresence.ventilation` | `sri.services.ventilation` | `sri.serviceCatalogues.methodA.ventilation` | `sri.serviceCatalogues.methodB.ventilation` |
| `SRI9` | Lighting | `../view/SRI9-lighting-tab.html` | `sri.domainsPresence.lighting` | `sri.services.lighting` | `sri.serviceCatalogues.methodA.lighting` | `sri.serviceCatalogues.methodB.lighting` |
| `SRI10` | Dynamic Envelope | `../view/SRI10-dynamic-envelope-tab.html` | `sri.domainsPresence.envelope` | `sri.services.envelope` | `sri.serviceCatalogues.methodA.envelope` | `sri.serviceCatalogues.methodB.envelope` |
| `SRI11` | Electricity | `../view/SRI11-electricity-tab.html` | `sri.domainsPresence.electricity` | `sri.services.electricity` | `sri.serviceCatalogues.methodA.electricity` | `sri.serviceCatalogues.methodB.electricity` |
| `SRI12` | EV Charging | `../view/SRI12-ev-charging-tab.html` | `sri.domainsPresence.ev` | `sri.services.ev` | `sri.serviceCatalogues.methodA.ev` | `sri.serviceCatalogues.methodB.ev` |
| `SRI13` | Monitoring & Control | `../view/SRI13-monitoring-control-tab.html` | `sri.domainsPresence.monitoring` | `sri.services.monitoring` | `sri.serviceCatalogues.methodA.monitoring` | `sri.serviceCatalogues.methodB.monitoring` |

## Domain Service Data Shape

Each service item should follow this shape:

```js
{
  id: "H1a",
  applicable: true,
  triage: true,
  level: 2,
  compliance: 1,
  entries: [
    { level: 2, compliance: 1 }
  ]
}
```

Human-readable meaning:

| Field | Meaning | UI requirement |
|---|---|---|
| `id` | SRI service/category code | Must match the selected method catalogue. |
| `applicable` | Whether the service applies | Yes/No switch. |
| `triage` | Affect maximum obtainable score? | Checkbox. |
| `level` | Selected functionality level | Dropdown level, typically `0`-`4`; `-1` means not applicable. |
| `compliance` | Total share for selected level(s) | Normalized value `0`-`1`; equivalent to 0%-100%. |
| `entries` | Multi-row level/compliance pairs | Used when different functionality levels share the total compliance. |

Domain tab validation:

- If `applicable = false`, use `level = -1` and `compliance = 1` for not-applicable handling.
- If `applicable = true`, show level dropdown and compliance input.
- If compliance is below 100%, add another level/compliance row for the remaining share.
- User should not continue until cumulative compliance equals **100%** for the current service/category.

## Method Catalogue Differences

Current data model service catalogue:

### Method A

```text
Heating: H1a, H1c, H2a, H2b, H3
Cooling: C1, C2, C3
DHW: DHW1, DHW2
Ventilation: V1, V2
Lighting: L1, L2
Dynamic Envelope: DE1
Electricity: E1, E2
EV Charging: EV1
Monitoring & Control: MC1, MC2
```

### Method B

```text
Heating: H1a, H1b, H1c, H1d, H1f, H2a, H2b, H2d, H3
Cooling: C1, C2, C3
DHW: DHW1, DHW2
Ventilation: V1, V2
Lighting: L1, L2
Dynamic Envelope: DE1
Electricity: E1, E2
EV Charging: EV1
Monitoring & Control: MC1, MC2
```

Important rule from the official SRI documentation:

- Every service defined in the selected method enumeration must appear exactly once in the `Services` collection.
- Some services/categories may be hidden for Method A.
- For services appearing in both methods, dropdown level text must match the selected method definitions.

## `SRI14` - Results Data

Relative file:

```text
../view/SRI14-results.html
```

Needs these data fields:

| Data path | Meaning | UI requirement |
|---|---|---|
| `sri.results.totalScore` | Overall SRI score | Show as percentage and pair with accessible text. |
| `sri.results.class` | SRI performance class | Show A-G style label. |
| `sri.results.impacts` | Impact scores | Table and/or bar chart by impact. |
| `sri.results.domains` | Domain scores | Table and/or bar chart by domain. |
| `sri.results.detailedScores` | Detailed domain/impact matrix | If available, table or heatmap. |
| `sri.results.aggregatedScores` | Aggregated score data | If available, detailed table. |

Official documentation names:

- `TotalScore`
- `ImpactScores`
- `DomainScores`
- `DetailedScores`
- `AggregatedScores`

Current data model names:

- `sri.results.totalScore`
- `sri.results.class`
- `sri.results.impacts`
- `sri.results.domains`

If detailed or aggregated results are not present in the current model, the UI should either hide those sections or show a clear empty-state message.

## Required Validation Summary

| Area | Rule |
|---|---|
| Methodology | Method must be Method A or Method B. |
| Non-EU weighting | If region is Non-EU, preferred weightings must be User-defined and current live route continues to SRI4. |
| Domain presence | Each domain must be `0`, `1`, or `2`. |
| Impact weightings | Seven impact weights must total exactly 100%. |
| Domain weighting per impact | Each impact-specific domain weighting group must total exactly 100%. |
| Domain services | Applicable services must have functionality level and compliance data. |
| Compliance rows | Compliance entries for a service/category must total exactly 100%. |
| Results | Final score must include a clear percentage and class/rating label. |

## Human-Readable SRI Concept

SRI measures the building's **smart readiness**. In simple terms, it is the building's “brain score”.

It checks whether systems such as heating, cooling, lighting, ventilation, electricity, EV charging, dynamic envelope, and monitoring/control can:

- react automatically,
- support occupant comfort,
- improve energy efficiency,
- predict faults or maintenance needs,
- provide useful information,
- and adapt to signals from the energy grid.

Final output:

- SRI Score (%)
- Performance Class (A-G)
- Breakdown by impact
- Breakdown by domain
- Detailed domain/impact scores when available
