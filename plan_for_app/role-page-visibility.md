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

Site Admin can see all normal application pages:

- `view/A-projects-dashboard.html` — All projects dashboard
- `view/B-add-new-building.html` — Add new building in any project
- `view/C-open-edit-building.html` — Open/edit any building
- All SRI workflow pages
- All EPB workflow pages
- User profile page, when created
- Public landing/about/help pages:
  - `index.html`
  - `view/about.html`

Site Admin can also see global administration pages, when created:

- `view/site-admin-console.html` — Site Admin Console

To reduce extra pages, the Site Admin Console should be one compact page, not a complicated multi-view admin area. It should mainly contain:

- All users list
- Selected user details
- `Become User / View as User` action with an exit back to Site Admin Console
- `Open Project List as Admin` action with full access

The Site Admin should reuse the normal Project List, Project Dashboard, building, SRI, and EPB pages for project/building work instead of separate admin-only project/building views.

Site Admin permissions:

- Can access all projects.
- Can create/edit all buildings across all projects.
- Can run the OpenBEP4EU Calculation Engine D2.2 for all buildings across all projects.
- Can manage/access users from the compact all-users list.
- Can access the site admin console.
- Can view the application as a selected user for testing role-based navigation and visibility.
- Can use `Become User` mode to continue the normal app flow as a selected user for support/debugging.
- Can use `Admin Free Edit` mode by opening the normal Project List as Admin and then directly editing any project/building with full admin permission from the existing project dashboard and child pages.
- Does not need duplicate admin-only project/building workflow pages for the minimal prototype.

Site Admin safety rule:

- Destructive or sensitive actions should require confirmation and audit logging.
- `Become User` actions should show a clear persistent banner and be recorded in the audit log.
- `Admin Free Edit` actions should show a clear full-access/admin-mode indicator and be recorded in the audit log when data is changed.

Site Admin user/project navigation rule:

- Do not create a separate user-projects page for the minimal prototype.
- Use the Site Admin Console all-users list to select a user and show simple selected-user details.
- From that user details panel, Site Admin can either:
  - choose `Become User` to continue as that user, or
  - choose `Open Project List as Admin` to open the normal project list with full Site Admin permissions.
- Direct project/building edits should reuse the existing Project Dashboard / Project List / Open Edit Building flow.
- Admin Free Edit should be visually distinct from Become User / View as User mode so the admin knows whether they are acting as a selected user or with full admin permissions.

---

## Compact page visibility matrix

| Page / Area | Guest | Registered User | Project Member | Project Owner | Site Admin |
|---|---:|---:|---:|---:|---:|
| Login / Register | Yes | Yes | Yes | Yes | Yes |
| Public About / Help | Yes | Yes | Yes | Yes | Yes |
| User Profile | No | Yes | Yes | Yes | Yes |
| Project List + Project Info | No | Yes | Yes | Yes | Yes |
| Create Project | No | Yes | Optional | Optional | Yes |
| Request Project Membership | No | Yes | Optional | Optional | Yes |
| Projects Dashboard | No | No | Yes, approved projects | Yes, owned projects | Yes, all projects |
| Add New Building | No | No | Yes, approved projects | Yes, owned projects | Yes, all projects |
| Open/Edit Building | No | No | Own buildings only | All buildings in owned projects | All buildings |
| SRI Workflow | No | No | Yes, allowed buildings | Yes, owned projects | Yes, all buildings |
| EPB Workflow | No | No | Yes, allowed buildings | Yes, owned projects | Yes, all buildings |
| Project Members Management | No | No | No | Yes, owned projects | Yes, all projects |
| Invite Users | No | No | No | Yes, owned projects | Yes, all projects |
| Approve Membership Requests | No | No | No | Yes, owned projects | Yes, all projects |
| Site Admin Console | No | No | No | No | Yes |
| Global User Management | No | No | No | No | Yes |
| Audit Logs | No | No | No | Optional, project scope | Yes, global scope |

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
  - Site Admin: all buildings across all projects
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
  - Overview section
  - Users section
    - Selected user details panel
    - User project memberships list
    - Become User action
    - Open Project as Admin action
  - Projects section
  - Buildings section
  - Requests & Invitations section
  - Audit Log section
  - Role Preview section

---

## Notes for future menu design

- The UI menu should hide pages that a role cannot use.
- Backend permission checks must still protect every page and action.
- Project Member and Project Owner permissions are project-specific.
- One user can be Project Owner in one project and Project Member in another.
- Site Admin permissions are global and override project-level restrictions.
- If a user has no access to a page, show an access denied state and a link back to the allowed dashboard.