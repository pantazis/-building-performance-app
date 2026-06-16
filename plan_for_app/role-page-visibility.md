# OpenBEP4EU role page visibility

This document defines, in text format, which application pages each user role can see.
`plan_for_app/userRoles.md` is the source of truth for canonical roles, permission boundaries, and temporary workflow states.

Source role rules:

- `plan_for_app/userRoles.md`
- `plan_for_app/menu-diagram-example.svg`
- `plan_for_app/menu-diagram-example.mmd`

Temporary states such as Pending Member / Applicant, Invited User, and Access Denied / No Access are workflow states only. They must not be implemented as additional permanent roles.

Canonical roles:

1. Guest
2. Registered User
3. Project Member
4. Project Owner
5. Site Admin

Important view distinction:

- Project List and Project Dashboard are different views.
- Project List is for browsing/selecting projects, creating a project, requesting membership, and checking membership status.
- Project Dashboard is the selected project workspace after access is approved. It contains the building list/actions and entry points to Building, SRI, EPB, and calculation workflows.
- `view/A-projects-dashboard.html` is the current prototype file for the selected Project Dashboard / project workspace. The Project List page is mentioned in this document but has not been created yet as a prototype HTML file.

---

## Page visibility by role

### 1. Guest

Guest is not logged in.

Guest can see only public entry pages:

- `view/login.html` — Login page
- Public landing/about/help pages, if enabled:
  - `index.html`
  - `view/about.html`

Guest cannot see:

- Projects dashboard
- Add building page
- Edit building page
- SRI workflow pages
- EPB workflow pages
- User profile page
- Project user management pages
- Site admin console

---

### 2. Registered User

Registered User has an account and is logged in, but is not yet approved into a project.
If a Registered User creates a project, they become Project Owner for that project and gain Project Owner visibility inside that project scope.

Registered User can see:

- `view/login.html` — Login/logout entry page
- User profile page, when created
- Project List page, when created
- Project Info / Project Details page, when created
- Create project page, when created
- Request project membership popup/modal, when created
  - Opens from a button on the Project List page or Project Info / Project Details page
- Public landing/about/help pages:
  - `index.html`
  - `view/about.html`

Registered User cannot see until approved into a project:

- `view/A-projects-dashboard.html`
- `view/B-add-new-building.html`
- `view/C-open-edit-building.html`
- SRI workflow pages
- EPB workflow pages
- Project user management pages
- Site admin console

Registered User has no building access until they are approved into a project or create a project and become that project's owner.

Special state:

- If the user requested membership, they can see a pending/request status page when created.
- Pending users still have no building access.

---

### 3. Project Member

Project Member is an approved user inside a specific project.
Visibility is scoped to projects where the user is an approved Project Member. The same person can have a different project role in another project.

Project Member can see project and building workflow pages for approved projects:

- `view/A-projects-dashboard.html` — Projects dashboard
- `view/B-add-new-building.html` — Add new building
- `view/C-open-edit-building.html` — Open/edit building
- User profile page, when created
- Public landing/about/help pages:
  - `index.html`
  - `view/about.html`

Project Member can see SRI workflow pages for allowed buildings:

- `view/SRI1-methodology-selection.html`
- `view/SRI2-Default-weightings.html`
- `view/SRI3-weighting-settings.html`
- `view/SRI5-heating-tab.html`
- `view/SRI6-dhw-tab.html`
- `view/SRI7-cooling-tab.html`
- `view/SRI8-ventilation-tab.html`
- `view/SRI9-lighting-tab.html`
- `view/SRI10-dynamic-envelope-tab.html`
- `view/SRI11-electricity-tab.html`
- `view/SRI12-ev-charging-tab.html`
- `view/SRI13-monitoring-control-tab.html`
- `view/SRI14-results.html`

Note: `view/SRI4-domain-dashboard.html` has been merged into `view/SRI14-results.html` and is no longer a separate current menu workflow page in `plan_for_app/menu-diagram-example.mmd`. `view/SRI14-results.html` is the SRI results page and the hub for the SRI5-SRI13 domain tabs.

Project Member can see EPB workflow pages for allowed buildings:

- `view/EPB1-calculation-settings.html`
- `view/EPB1b-ground-temperature.html`
- `view/EPB2-materials-constructions.html`
- `view/EPB3-thermal-zones-envelope.html`
- `view/EPB-spaces-tab.html`
- `view/EPB-operations-tab.html`
- `view/EPB4-results-summary.html`

Project Member can run the OpenBEP4EU Calculation Engine D2.2 only for allowed buildings. The calculation-engine workflow shown in `plan_for_app/menu-diagram-example.mmd` runs from the open/edit building context and returns EPC-relevant outputs to the EPB results/performance summary.

Project Member restrictions:

- Can create buildings in approved projects.
- Can edit only buildings they created.
- Cannot edit buildings created by other users.
- Cannot manage project users.
- Cannot approve membership requests.
- Cannot access the site admin console.

---

### 4. Project Owner

Project Owner is the owner/admin of one specific project.
Visibility is scoped to projects where the user is Project Owner. The same person can be Project Owner in one project and Project Member in another.

Project Owner can see everything a Project Member can see inside owned projects:

- `view/A-projects-dashboard.html` — Projects dashboard
- `view/B-add-new-building.html` — Add new building
- `view/C-open-edit-building.html` — Open/edit building
- All SRI workflow pages
- All EPB workflow pages
- User profile page, when created
- Public landing/about/help pages:
  - `index.html`
  - `view/about.html`

Project Owner can also see project management pages, when created. Prefer compact combined management pages instead of many duplicate standalone pages:

- Project Users page — one combined page for current members, email invitations, pending membership requests, and approve/disapprove actions
- My Projects / Project Settings page — manageable owned projects with edit/delete actions where allowed

Project Owner permissions:

- Can create buildings inside owned projects.
- Can edit all buildings inside owned projects.
- Can run the OpenBEP4EU Calculation Engine D2.2 for all buildings inside owned projects.
- Can invite users by email.
- Can approve or disapprove membership requests.
- Can manage members inside owned projects.

Project Owner restrictions:

- Cannot manage unrelated projects unless assigned there.
- Cannot access global site administration unless also Site Admin.

---

### 5. Site Admin

Site Admin is a platform-level administrator.
Site Admin permissions are global and override project-level restrictions.

Site Admin can see all normal application pages in two ways:

1. **Selected-owner mode** — select a Project Owner and continue as that owner.
2. **Direct Site Admin Project List access** — open the normal Project List as Site Admin, open any project dashboard, and create/edit through the existing normal pages.

Visible normal pages include:

- `view/A-projects-dashboard.html` — selected owner's project dashboard or any project dashboard opened from direct Site Admin Project List access
- `view/B-add-new-building.html` — add new building in projects managed by the selected owner or any project opened as Site Admin
- `view/C-open-edit-building.html` — open/edit buildings managed by the selected owner or any project opened as Site Admin
- All SRI workflow pages
- All EPB workflow pages
- User profile page, when created
- Public landing/about/help pages:
  - `index.html`
  - `view/about.html`

Site Admin can also see one focused administration page, when created:

- `view/site-admin-console.html` — Site Admin Console

The Site Admin Console must be clear and minimal. It is not a broad multi-section admin area. It should mainly contain:

- Project Owners list
- Select Project Owner action
- Clear selected-owner details
- Continue as selected Project Owner action
- Open normal Project List as Site Admin action
- Exit selected-owner view and return to the Project Owner list

After selecting a Project Owner, the Site Admin should reuse the normal Project List, Project Dashboard, Project Users, building, SRI, and EPB pages as that selected owner. The UI must clearly show a persistent banner/state such as `Site Admin viewing as Project Owner: [owner name]`.

When using direct Site Admin Project List access, the Site Admin should also reuse the normal Project List, Project Dashboard, building, SRI, and EPB pages, but with Site Admin permissions. The UI must clearly show a persistent banner/state such as `Site Admin direct project access`.

Site Admin permissions:

- Can access projects by selecting a Project Owner and continuing as that owner.
- Can open the normal Project List as Site Admin, open any project dashboard, and edit through the existing normal pages.
- Can create/edit buildings that the selected Project Owner can manage.
- Can create/edit buildings in any project when using direct Site Admin Project List access.
- Can run the OpenBEP4EU Calculation Engine D2.2 for buildings managed by the selected Project Owner.
- Can run the OpenBEP4EU Calculation Engine D2.2 for any building opened through direct Site Admin Project List access.
- Can access the compact Project Owners list.
- Can access the site admin console.
- Can view/manage the application as a selected Project Owner for support/debugging.
- Can use selected-owner mode to continue the normal app flow as that Project Owner.
- Can use direct Site Admin Project List access to open any dashboard and edit with Site Admin permissions.
- Should not use a separate direct-edit mode in the minimal prototype.
- Does not need duplicate admin-only project/building workflow pages for the minimal prototype.

Site Admin safety rule:

- Destructive or sensitive actions should require confirmation and audit logging.
- Selected Project Owner actions should show a clear persistent banner and be recorded in the audit log.
- Direct Site Admin Project List actions should show a clear persistent banner and be recorded in the audit log.

Site Admin project-owner navigation rule:

- Do not create a separate user-projects page for the minimal prototype.
- Use the Site Admin Console Project Owners list to select a Project Owner and show simple selected-owner details.
- From that owner details panel, Site Admin chooses `Continue as Project Owner`.
- The app then opens the normal Project List / Project Dashboard / Open Edit Building flow as the selected owner.
- Site Admin can also choose `Open Project List as Site Admin` to open any project dashboard and edit through the existing Project Dashboard / Project List / Open Edit Building flow.
- Selected-owner mode must be visually distinct so the admin knows they are managing as the selected Project Owner.
- Direct Site Admin Project List access must be visually distinct so the admin knows they are editing with Site Admin permissions.

---

## Compact page visibility matrix

| Page / Area | Guest | Registered User | Project Member | Project Owner | Site Admin |
|---|---:|---:|---:|---:|---:|
| Login / Register | Yes | Yes | Yes | Yes | Yes |
| Public About / Help | Yes | Yes | Yes | Yes | Yes |
| User Profile | No | Yes | Yes | Yes | Yes |
| Project List + Project Info | No | Yes | Yes | Yes | Yes |
| Create Project | No | Yes | Optional | Optional | Selected-owner mode or direct Site Admin Project List access |
| Request Project Membership | No | Yes | Optional | Optional | Selected-owner mode if applicable |
| Projects Dashboard | No | No | Yes, approved projects | Yes, owned projects | Selected owner's projects or any project via direct Site Admin access |
| Add New Building | No | No | Yes, approved projects | Yes, owned projects | Selected owner's projects or any project via direct Site Admin access |
| Open/Edit Building | No | No | Own buildings only | All buildings in owned projects | Selected owner's buildings or any building via direct Site Admin access |
| SRI Workflow | No | No | Yes, allowed buildings | Yes, owned projects | Selected owner's buildings or any building via direct Site Admin access |
| EPB Workflow | No | No | Yes, allowed buildings | Yes, owned projects | Selected owner's buildings or any building via direct Site Admin access |
| Project Members Management | No | No | No | Yes, owned projects | Selected-owner mode or direct Site Admin Project List access |
| Invite Users | No | No | No | Yes, owned projects | Selected-owner mode or direct Site Admin Project List access |
| Approve Membership Requests | No | No | No | Yes, owned projects | Selected-owner mode or direct Site Admin Project List access |
| Site Admin Console | No | No | No | No | Yes |
| Global User Management | No | No | No | No | Not in minimal prototype |
| Audit Logs | No | No | No | Optional, project scope | Used by backend/safety controls; not a broad admin-console page in minimal prototype |

Note: `Project List + Project Info` and `Projects Dashboard` are intentionally separate rows. Project List is the project selection/membership area. Projects Dashboard is the selected project workspace with buildings and workflow actions.

---

## Existing prototype/view files mapped to menus

### Public menu

- `index.html`
- `view/about.html`
- `view/login.html`

### Project and building menu

- Project List page — not created yet; browse/select/request/create projects before opening a project dashboard
- `view/A-projects-dashboard.html`
- `view/B-add-new-building.html`
- `view/C-open-edit-building.html`

### SRI menu

- `view/SRI1-methodology-selection.html`
- `view/SRI2-Default-weightings.html`
- `view/SRI3-weighting-settings.html`
- `view/SRI5-heating-tab.html`
- `view/SRI6-dhw-tab.html`
- `view/SRI7-cooling-tab.html`
- `view/SRI8-ventilation-tab.html`
- `view/SRI9-lighting-tab.html`
- `view/SRI10-dynamic-envelope-tab.html`
- `view/SRI11-electricity-tab.html`
- `view/SRI12-ev-charging-tab.html`
- `view/SRI13-monitoring-control-tab.html`
- `view/SRI14-results.html`

Merged/deprecated SRI page:

- `view/SRI4-domain-dashboard.html` — merged into `view/SRI14-results.html`; not shown as a separate current menu node in `menu-diagram-example.mmd`

### EPB menu

- `view/EPB1-calculation-settings.html`
- `view/EPB1b-ground-temperature.html`
- `view/EPB2-materials-constructions.html`
- `view/EPB3-thermal-zones-envelope.html`
- `view/EPB-spaces-tab.html`
- `view/EPB-operations-tab.html`
- `view/EPB4-results-summary.html`

### Calculation engine action

- Run OpenBEP4EU Calculation Engine D2.2 — available from the open/edit building context for roles with building edit/run permission:
  - Project Member: allowed/own buildings only
  - Project Owner: all buildings in owned projects
  - Site Admin: buildings managed by the selected Project Owner while in selected-owner mode, or any building opened through direct Site Admin Project List access
  - Guest and Registered User without project approval: no access

### Management pages to create later

- User profile page
- Project List page
- Project Info / Project Details page
- Create project page
- Request project membership popup/modal
- Pending membership status page
- Project Users page
  - Current members section
  - Invite user by email action
  - Pending membership requests section
  - Approve/disapprove membership request actions
- My Projects / Project Settings page
- Site admin console: `view/site-admin-console.html`
  - Project Owners list
  - Selected Project Owner details panel
  - Continue as selected Project Owner action
  - Open normal Project List as Site Admin action
  - Exit selected-owner view action
  - Clear persistent banner: `Site Admin viewing as Project Owner: [owner name]`
  - Clear persistent banner: `Site Admin direct project access`

---

## Notes for future menu design

- The UI menu should hide pages that a role cannot use.
- Backend permission checks must still protect every page and action.
- Project Member and Project Owner permissions are project-specific.
- One user can be Project Owner in one project and Project Member in another.
- Site Admin permissions are global and override project-level restrictions.
- If a user has no access to a page, show an access denied state and a link back to the allowed dashboard.