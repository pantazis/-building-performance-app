# OpenBEP4EU missing prototype pages

This document lists pages and UI states mentioned in the planning documents that do **not** currently exist as standalone prototype files in `view/`.

Sources checked:

- `plan_for_app/menu-diagram-example.mmd`
- `plan_for_app/userRoles.md`
- `plan_for_app/role-page-visibility.md`
- Existing prototype files in `view/`

Existing core prototype coverage is already available for public pages, project dashboard/building pages, SRI workflow pages, and EPB workflow pages. The missing items below are mainly account, project membership, project management, and site-admin pages.

---

## Missing standalone pages

| Priority | Suggested file | Page / area | Purpose | Visible to roles |
|---:|---|---|---|---|
| 1 | `view/register.html` | Register account | Public account creation page used before login. | Guest |
| 2 | `view/user-profile.html` | User profile page | Let authenticated users view/edit their own profile data. | Registered User, Project Member, Project Owner, Site Admin |
| 3 | `view/project-list.html` | Project List | Browse/select projects, create a project, request membership, and view membership/request status. This is separate from `view/A-projects-dashboard.html`. | Registered User, Project Member, Project Owner, Site Admin |
| 4 | `view/project-details.html` | Project Info / Project Details | Show project summary and membership/request actions before the user can access the project dashboard. | Registered User, Project Member, Project Owner, Site Admin |
| 5 | `view/create-project.html` | Create Project | Allow a Registered User to create a new project and become its Project Owner. | Registered User, Project Owner, Site Admin |
| 6 | `view/pending-membership.html` | Pending membership status | Show applicant state while membership request waits for Project Owner approval. | Registered User / Pending Applicant |
| 7 | `view/project-users.html` | Project Users management | Combined owner page for current members, email invitations, pending membership requests, approve/disapprove actions, and member management. | Project Owner, Site Admin |
| 8 | `view/project-settings.html` | My Projects / Project Settings | Manage owned projects and project settings/edit/delete actions where allowed. | Project Owner, Site Admin |
| 9 | `view/site-admin-console.html` | Site Admin Console | Minimal site-admin page with Project Owners list, selected-owner details, continue-as-owner action, direct Project List as Site Admin action, and exit selected-owner mode. | Site Admin |

---

## Missing modal / popup UI states

These may be implemented as standalone pages for the prototype or as modals inside `view/project-list.html` / `view/project-details.html`.

| Suggested implementation | UI state | Purpose | Visible to roles |
|---|---|---|---|
| Modal in `view/project-list.html` or `view/project-details.html` | Request project membership | Let a Registered User ask to become a Project Member of an existing project. | Registered User |
| Section in `view/project-users.html` | Invite user by email | Let a Project Owner invite a new member by email. | Project Owner, Site Admin |
| Section in `view/project-users.html` | Approve/disapprove membership request | Let a Project Owner accept or reject pending membership requests. | Project Owner, Site Admin |
| Banner component reused across normal pages | `Site Admin viewing as Project Owner: [owner name]` | Persistent visual state for selected-owner mode. | Site Admin |
| Banner component reused across normal pages | `Site Admin direct project access` | Persistent visual state for direct admin project access. | Site Admin |
| Access-denied view or reusable component | Access denied / no access | Show when a user tries to open a page without permission, with a link back to an allowed page. | All roles, when unauthorized |

---

## Existing pages referenced by the current menu/workflow

The following planned pages already exist in `view/` and are **not missing**:

### Public pages

- `index.html`
- `view/login.html`
- `view/about.html`

### Project/building workflow

- `view/A-projects-dashboard.html` — current selected Project Dashboard / project workspace prototype
- `view/B-add-new-building.html`
- `view/C-open-edit-building.html`

### SRI workflow

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

Note: `view/SRI4-domain-dashboard.html` exists, but `plan_for_app/role-page-visibility.md` says it has been merged into `view/SRI14-results.html` and is no longer a separate current menu workflow page.

### EPB workflow

- `view/EPB1-calculation-settings.html`
- `view/EPB1b-ground-temperature.html`
- `view/EPB2-materials-constructions.html`
- `view/EPB3-thermal-zones-envelope.html`
- `view/EPB-spaces-tab.html`
- `view/EPB-operations-tab.html`
- `view/EPB4-results-summary.html`

---

## Recommended creation order

1. `view/project-list.html`
2. `view/project-details.html`
3. `view/user-profile.html`
4. `view/register.html`
5. `view/create-project.html`
6. `view/pending-membership.html`
7. `view/project-users.html`
8. `view/project-settings.html`
9. `view/site-admin-console.html`

This order supports the main access flow first: account → project selection/request/create → project access → owner/admin management.