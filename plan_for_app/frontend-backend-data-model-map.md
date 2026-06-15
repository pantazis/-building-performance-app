# OpenBEP4EU frontend/backend data model map

This document is the shared data-model guide for frontend and backend developers. It connects the prototype UI pages, role rules, navigation, and the current SRI/EPB data structure.

Source files:

- `plan_for_app/userRoles.md`
- `plan_for_app/menu-diagram-example.mmd`
- `plan_for_app/role-page-visibility.md`
- `plan_for_app/role-navigation-menus.md`
- `index.html`
- `data_model/sri_epb_ui_data_model_v2.js`

---

## 1. Core application flow

Project List and Project Dashboard are different views.

```text
Login / Register
  -> Project List / Project Selection
    -> Project Dashboard / Selected Project Workspace
      -> Add New Building
      -> Open / Edit Building
        -> SRI Workflow
        -> EPB Workflow
        -> Run OpenBEP4EU Calculation Engine
```

### Project List

The Project List is the project browsing and selection area.

Responsibilities:

- show projects available to the current user
- show current membership/request state
- allow a Registered User to request membership
- allow an authenticated user to create a new project, if allowed
- allow Site Admin to open any project with admin permissions

The Project List page is planned but not yet implemented as a prototype HTML file.

### Project Dashboard

The Project Dashboard is the selected project workspace.

Current prototype file:

```text
view/A-projects-dashboard.html
```

Responsibilities:

- show buildings inside one selected project
- create/open/edit/duplicate/delete buildings, depending on permission
- show SRI, EPB, score, and calculation status per building
- start Building, SRI, EPB, and calculation workflows

---

## 2. Canonical backend entities

| Entity | Purpose | Key relationships |
|---|---|---|
| `User` | Authenticated person/account | has memberships, creates buildings, triggers audit logs |
| `Project` | Project container | has memberships, invitations, requests, buildings |
| `ProjectMembership` | User role inside one project | links user + project; stores Project Member / Project Owner |
| `MembershipRequest` | Request to join a project | requested by user, approved/rejected by owner/admin |
| `Invitation` | Owner/admin invitation by email | targets email/user and project |
| `Building` | Building record inside project | belongs to project; has SRI and EPB models |
| `BuildingGeneralData` | Basic building metadata/location | usually embedded in or linked to Building |
| `SRIModel` | Smart Readiness Indicator assessment | belongs to one building |
| `SRIServiceEntry` | Domain/service-level SRI input | belongs to SRIModel |
| `SRIResults` | Calculated SRI output | belongs to SRIModel/calculation snapshot |
| `EPBModel` | Energy Performance of Buildings input model | belongs to one building |
| `EPBLibrary` | Materials, constructions, glazing, schedules, controls | belongs to EPBModel/project library |
| `EPBZone` | Thermal zone | belongs to EPBModel |
| `EPBSpace` | Space inside a thermal zone | belongs to EPBZone |
| `EPBSurface` | Envelope or subsurface geometry | belongs to EPBZone/space |
| `CalculationRun` | Engine execution record and outputs | belongs to building; references input snapshot |
| `AuditLog` | Security/action history | records user, action, target, timestamp |

---

## 3. Recommended backend model pattern

The current `AppDataModel` is useful for the prototype because it gives the frontend one nested object. For production/backend work, use a normalized model with IDs and references.

Recommended domains:

```text
Identity and access
  User
  ProjectMembership
  MembershipRequest
  Invitation
  AuditLog

Project and building
  Project
  Building
  BuildingGeneralData

SRI
  SRIModel
  SRIServiceEntry
  SRIResults

EPB
  EPBModel
  EPBLibrary
  EPBZone
  EPBSpace
  EPBSurface

Calculation
  CalculationRun
  CalculationInputSnapshot
  CalculationOutput
```

Best-practice rules:

- Use stable IDs for all entities.
- Do not rely on frontend-hidden menus for security.
- Keep calculation input snapshots immutable after a run starts.
- Store schema/model versions with SRI, EPB, and calculation records.
- Separate project-level roles from platform-level roles.
- Treat pending/applicant/invited/no-access as workflow states, not permanent roles.

---

## 4. Frontend composed view models

The frontend can use composed/nested view models returned by the backend. This keeps screens simple without forcing the database to be one large JSON document.

### ProjectListViewModel

```js
{
  currentUser: {
    id,
    firstName,
    lastName,
    organization, // optional
    platformRole // Registered User | App Admin
  },
  projects: [
    {
      id,
      name,
      ownerName,
      membershipStatus, // none | pending | approved | invited | owner
      currentUserProjectRole, // null | Project Member | Project Owner
      canOpenDashboard,
      canRequestMembership,
      canCreateBuilding: false
    }
  ],
  permissions: {
    canCreateProject,
    canViewAllProjectsAsAdmin
  }
}
```

Role/membership notes:

- A user can be a `Project Owner` in many projects.
- A user can be a `Project Member` in many projects.
- A user can have different roles in different projects at the same time, for example `Project Owner` in Project A and `Project Member` in Project B.
- `Project Owner` and `Project Member` are project-scoped roles stored through `ProjectMembership`, not global user roles.
- `App Admin` is a platform-level role stored on the user/account and is independent from project memberships.
- `membershipStatus` describes the current user's state for that project row.
- `currentUserProjectRole` is only populated when `membershipStatus` is `approved` or `owner`; otherwise it should be `null`.
- `canCreateBuilding` should be computed per project. It is usually `true` for `Project Member`, `Project Owner`, and `App Admin` with project access, but `false` for `none`, `pending`, and `invited` states.

### ProjectDashboardViewModel

```js
{
  currentUser,
  project: {
    id,
    name,
    country,
    settings
  },
  currentUserProjectRole,
  permissions: {
    canManageProjectUsers,
    canCreateBuilding,
    canEditAllBuildings,
    canRunCalculation
  },
  buildings: [
    {
      id,
      name,
      createdByUserId,
      status,
      sriStatus,
      epbStatus,
      latestScore,
      canEdit,
      canOpenSri,
      canOpenEpb,
      canRunCalculation
    }
  ]
}
```

### BuildingEditorViewModel

```js
{
  currentUser,
  project,
  building: {
    id,
    projectId,
    createdByUserId,
    general,
    permissions
  },
  uiOptions
}
```

### SRIWorkflowViewModel

```js
{
  buildingId,
  sri: {
    method,
    hasDefaultWeightings,
    jurisdiction,
    assessmentDate,
    domainsPresence,
    weighting,
    serviceCatalogues,
    services,
    results
  },
  permissions: {
    canEditSri,
    canCalculateSri,
    canViewResults
  }
}
```

### EPBWorkflowViewModel

```js
{
  buildingId,
  epb: {
    provenance,
    validation,
    transformation,
    settings,
    library,
    zones,
    orchestration,
    epcIndicators
  },
  permissions: {
    canEditEpb,
    canRunCalculation,
    canViewResults
  }
}
```

---

## 5. Page-to-data map

| Page / View | Existing file | Reads | Writes | Backend permission |
|---|---|---|---|---|
| Login / Register | `view/login.html` | auth config | session/login/register action | public/auth |
| Project List | not created yet | project summaries, memberships, requests | create project, request membership | authenticated |
| Project Dashboard | `view/A-projects-dashboard.html` | selected project, buildings, statuses, scores | building actions when allowed | project access |
| Add New Building | `view/B-add-new-building.html` | project context, UI options | new building | create building in project |
| Open/Edit Building | `view/C-open-edit-building.html` | building general data | building general data | edit allowed building |
| SRI Methodology | `view/SRI1-methodology-selection.html` | `building.sri.method`, jurisdiction, weighting mode | method, weighting mode, assessment context | edit allowed building |
| SRI Default Weightings | `view/SRI2-Default-weightings.html` | default weightings, domains presence | weighting confirmation | edit allowed building |
| SRI Weighting Settings | `view/SRI3-weighting-settings.html` | custom weighting model | custom impact/domain weightings | edit allowed building |
| SRI Domain Tabs | `view/SRI5-*` to `view/SRI13-*` | SRI service catalogue and domain entries | service applicability, levels, compliance | edit allowed building |
| SRI Results | `view/SRI14-results.html` | SRI services, weightings, results | calculate/update results if allowed | view/edit allowed building |
| EPB Calculation Settings | `view/EPB1-calculation-settings.html` | EPB settings | run period, timestep, climate/ground settings | edit allowed building |
| EPB Ground Temperature | `view/EPB1b-ground-temperature.html` | ground temperature properties | ground temperature properties | edit allowed building |
| EPB Materials & Constructions | `view/EPB2-materials-constructions.html` | EPB library | materials, glazing, constructions | edit allowed building |
| EPB Thermal Zones & Envelope | `view/EPB3-thermal-zones-envelope.html` | zones, surfaces, envelope | zones, surfaces, needs systems | edit allowed building |
| EPB Spaces | `view/EPB-spaces-tab.html` | spaces and zone links | spaces | edit allowed building |
| EPB Operations | `view/EPB-operations-tab.html` | schedules, thermostats, humidistats, gains | operational controls | edit allowed building |
| EPB Results Summary | `view/EPB4-results-summary.html` | EPC indicators, calculation run | mostly read-only | view allowed building |
| Site Admin Console | `view/site-admin-console.html` when created | users, selected user, memberships | admin actions, become-user/admin-mode actions | Site Admin |

---

## 6. Frontend/backend ownership

| Area | Frontend owns | Backend owns |
|---|---|---|
| Authentication UI | login/register screens and session UX | authentication, tokens/session, current user |
| Menus/navigation | render allowed menu from permissions | return role/scope permissions; enforce every route/action |
| Project List | browse/select/request UI | filter projects, create project, manage membership request state |
| Project Dashboard | selected project workspace UI | project/building access filtering and action authorization |
| Building editor | forms and validation messages | persist building data and enforce edit permissions |
| SRI workflow | form state, domain tabs, progress display | persist SRI model, validate, calculate/store results |
| EPB workflow | form state for settings/library/zones/spaces | validate schema, prepare engine inputs, persist EPB model |
| Calculation engine | run button, status display, results UI | queue/run calculation, snapshots, output aggregation |
| Admin/owner actions | management screens and confirmations | permission checks, state transitions, audit logs |

---

## 7. Permission rules

| Role/state | Project List | Project Dashboard | Building/SRI/EPB access |
|---|---|---|---|
| Guest | no | no | no |
| Registered User | yes | no, unless they create/own a project | no building access |
| Pending Member / Applicant | yes, with pending state | no | no building access |
| Project Member | yes | approved projects | create buildings; edit only own buildings |
| Project Owner | yes | owned projects | create/edit all buildings in owned projects |
| Site Admin | yes, all projects | all projects | create/edit all buildings globally |

Backend must enforce permissions even when the frontend hides pages or actions.

---

## 8. Recommended API/resource map

```text
/users
/me
/projects
/projects/{projectId}
/projects/{projectId}/memberships
/projects/{projectId}/membership-requests
/projects/{projectId}/invitations
/projects/{projectId}/buildings
/buildings/{buildingId}
/buildings/{buildingId}/sri
/buildings/{buildingId}/sri/services/{domain}
/buildings/{buildingId}/sri/results
/buildings/{buildingId}/epb
/buildings/{buildingId}/epb/library
/buildings/{buildingId}/epb/zones
/buildings/{buildingId}/epb/results
/buildings/{buildingId}/calculation-runs
/audit-logs
```

---

## 9. Mapping to current prototype data

Current prototype root:

```js
AppDataModel.projects[].building
```

Recommended conceptual split:

| Current prototype path | Future/backend concept |
|---|---|
| `AppDataModel.projects[]` | `Project` plus dashboard summary data |
| `project.building` | `Building` |
| `building.general` | `BuildingGeneralData` |
| `building.sri` | `SRIModel` |
| `building.sri.services` | `SRIServiceEntry[]` grouped by domain |
| `building.sri.results` | `SRIResults` |
| `building.epb` | `EPBModel` |
| `building.epb.library` | `EPBLibrary` |
| `building.epb.zones` | `EPBZone[]` with spaces/surfaces |
| `building.epb.epcIndicators` | `CalculationRun.output.epcIndicators` or latest EPB results |
| `building.epb.orchestration` | latest `CalculationRun` status |

---

## 10. Success criteria for developers

Frontend developers should be able to answer:

- Which page am I rendering?
- Which view model do I need?
- Which fields are editable here?
- Which permission flags control buttons/actions?

Backend developers should be able to answer:

- Which entity owns this data?
- Which project/building scope applies?
- Which role can read/write/run this action?
- Which APIs compose the frontend view model?
- Which calculation snapshot produced each result?
