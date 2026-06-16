# OpenBEP4EU role navigation menus

This document defines the application navigation menu for each canonical role.
`plan_for_app/userRoles.md` is the source of truth for role names, permission boundaries, and temporary workflow states.

Purpose:

- Keep navigation separate from page visibility rules.
- Define which pages can appear in the visible menu for each role.
- Use stable, unique menu item IDs so the menu can be implemented consistently in HTML, JS, or a future app router.
- Do not list every internal dashboard subview unless it needs its own unique menu entry.
- Keep child pages out of the main menu; users reach them through the parent dashboard/workflow page.
- Keep temporary workflow states such as Pending Member / Applicant, Invited User, and Access Denied out of the canonical role list.

Important view distinction:

- Project List and Project Dashboard are different views.
- Project List is the project browsing/selection view for available projects, membership requests, membership status, and create-project actions.
- Project Dashboard is the selected project workspace for one project after access is approved. It contains buildings and entry points to Building, SRI, EPB, and calculation workflows.
- `nav-project-list` and `nav-project-dashboard` must remain separate menu/navigation concepts.
- `view/A-projects-dashboard.html` is the current prototype file for the selected Project Dashboard / project workspace. The Project List page is planned but not yet implemented as a prototype HTML file.

Source documents:

- `plan_for_app/userRoles.md`
- `plan_for_app/role-page-visibility.md`
- `plan_for_app/menu-diagram-example.mmd`

Canonical roles:

1. Guest
2. Registered User
3. Project Member
4. Project Owner
5. Site Admin

---

## Menu design rules

1. Every menu item must have a unique ID.
2. A page can be shown in the menu only if the role can access it.
3. Main menus should contain only parent/navigation entry pages.
4. Child pages such as Add New Building, Open/Edit Building, SRI Assessment pages, and EPB Assessment pages must not appear as top-level menu items.
5. For project/building workflows, use `nav-project-dashboard` as the parent menu entry.
6. SRI and EPB pages are dashboard/workflow children and should be reached from the dashboard or building detail flow, not from the global main menu.
7. Hidden menu items are not enough for security; backend/page permission checks must still protect every route.
8. If a user has several roles, show the union of allowed menu items, scoped by project where needed.
9. Project Member and Project Owner navigation is always project-scoped; the same person can be Owner in one project and Member in another.
10. Site Admin permissions are global and override project restrictions, but admin users should still reuse normal project/dashboard/building flows where possible.

---

## Shared menu item registry

These are stable menu IDs that can be reused across roles.

| Menu ID | Label | Target | Notes |
|---|---|---|---|
| `nav-home` | Home | `index.html` | Public landing/home page. |
| `nav-about` | About | `view/about.html` | Public information page. |
| `nav-login` | Login | `view/login.html` | Guest login entry. |
| `nav-logout` | Logout | `view/login.html` or logout action | Authenticated users only. |
| `nav-profile` | My Profile | User profile page, when created | Authenticated users only. |
| `nav-project-list` | Projects | Project List page, when created | For browsing available projects. |
| `nav-project-create` | Create Project | Create Project page, when created | Registered users and admins. |
| `nav-project-request-status` | Membership Status | Pending membership status page, when created | Optional pending/applicant state. |
| `nav-project-dashboard` | Project Dashboard | `view/A-projects-dashboard.html` | Selected project workspace after opening an allowed project from the Project List. |
| `nav-project-members` | Project Users | Project users management page, when created | Project Owner and Site Admin. One page for members, invitations, and membership requests. |
| `nav-project-settings` | My Projects | My projects list page, when created | Project Owner and Site Admin. Lists manageable projects; each project has Edit/Delete actions. |
| `nav-admin-console` | Site Admin Console | `view/site-admin-console.html`, when created | Site Admin only. One compact page that lists Project Owners and starts selected-owner mode. |

---

## Role menu: Guest

Guest is not logged in.

Guest menu:

| Order | Menu ID | Label | Target |
|---:|---|---|---|
| 1 | `nav-home` | Home | `index.html` |
| 2 | `nav-about` | About | `view/about.html` |
| 3 | `nav-login` | Login | `view/login.html` |

Guest must not see project, building, SRI, EPB, profile, or admin menu items.

---

## Role menu: Registered User

Registered User is logged in but is not yet approved into a project.
If a Registered User creates a project, they become Project Owner for that project and then use the Project Owner menu for that project scope.

Registered User menu:

| Order | Menu ID | Label | Target |
|---:|---|---|---|
| 1 | `nav-home` | Home | `index.html` |
| 2 | `nav-project-list` | Projects | Project List page, when created |
| 3 | `nav-project-create` | Create Project | Create Project page, when created |
| 4 | `nav-profile` | My Profile | User profile page, when created |
| 5 | `nav-about` | About | `view/about.html` |
| 6 | `nav-logout` | Logout | Logout action |

Optional pending state menu item:

| Menu ID | Label | Target | When shown |
|---|---|---|---|
| `nav-project-request-status` | Membership Status | Pending membership status page, when created | Show only after the user requests project membership. |

Registered User must not see building workflow menu items until approved into a project or until they create a project and become Project Owner.
Pending membership, invitation, and no-access screens are temporary workflow states, not additional roles.

---

## Role menu: Project Member

Project Member is an approved user inside a specific project.
Project Member menu visibility applies only inside projects where the user has approved member access.

Project Member menu:

| Order | Menu ID | Label | Target |
|---:|---|---|---|
| 1 | `nav-project-list` | Projects | Project List page, when created |
| 2 | `nav-project-dashboard` | Project Dashboard | `view/A-projects-dashboard.html` |
| 3 | `nav-profile` | My Profile | User profile page, when created |
| 4 | `nav-about` | About | `view/about.html` |
| 5 | `nav-logout` | Logout | Logout action |

Project Member menu scope:

- Show `nav-project-dashboard` only for approved projects.
- Project List is used first to select an approved project; Project Dashboard opens after project selection.
- Child pages such as Add New Building, Open/Edit Building, SRI, and EPB are opened from the dashboard/building flow, not from the main menu.
- Project Member can edit only buildings they created.
- Do not show project user management or site admin menu items.

---

## Role menu: Project Owner

Project Owner is the owner/admin of one specific project.
Project Owner menu visibility applies only inside projects where the user is the owner/admin.

Project Owner menu:

| Order | Menu ID | Label | Target |
|---:|---|---|---|
| 1 | `nav-project-list` | Projects | Project List page, when created |
| 2 | `nav-project-dashboard` | Project Dashboard | `view/A-projects-dashboard.html` |
| 3 | `nav-project-members` | Project Users | Project users management page, when created |
| 4 | `nav-project-settings` | My Projects | My projects list page, when created |
| 5 | `nav-profile` | My Profile | User profile page, when created |
| 6 | `nav-about` | About | `view/about.html` |
| 7 | `nav-logout` | Logout | Logout action |

Project Owner menu scope:

- Show management items only inside projects the user owns.
- Project List is used first to select or manage an owned project; Project Dashboard opens after project selection.
- Child pages such as Add New Building, Open/Edit Building, SRI, and EPB are opened from the dashboard/building flow, not from the main menu.
- Project Owner can edit all buildings inside owned projects.
- Do not show global Site Admin items unless the same user is also Site Admin.

---

## Role menu: Site Admin

Site Admin is a platform-level administrator.
Site Admin access is exercised through selected Project Owner context in the minimal prototype, while sensitive or destructive actions still require confirmations and audit logging.

Site Admin should keep the global menu compact. Do not create separate top-level menu pages for every admin function unless a future requirement explicitly needs them. Use one compact Site Admin Console page focused on selecting a Project Owner and handing off into the existing Project List / Project Dashboard flow as that selected owner.

Site Admin menu:

| Order | Menu ID | Label | Target |
|---:|---|---|---|
| 1 | `nav-admin-console` | Site Admin Console | `view/site-admin-console.html`, when created |
| 2 | `nav-project-list` | Projects | Project List page, when created; shown after selecting a Project Owner |
| 3 | `nav-project-dashboard` | Project Dashboard | `view/A-projects-dashboard.html`; shown after selecting a Project Owner and opening an allowed project |
| 4 | `nav-profile` | My Profile | User profile page, when created |
| 5 | `nav-about` | About | `view/about.html` |
| 6 | `nav-logout` | Logout | Logout action |

Site Admin menu scope:

- Site Admin first opens the Site Admin Console and selects a Project Owner.
- Site Admin then continues into the normal Project List as the selected Project Owner.
- Site Admin can access the projects and buildings that the selected Project Owner can manage.
- Child pages such as Add New Building, Open/Edit Building, SRI, and EPB are opened from the dashboard/building flow, not from the main menu.
- Site Admin can exit selected-owner mode and return to the Project Owners list.
- Full permission does not require one menu item per admin function; keep the menu compact and reuse existing project list, dashboard, building, SRI, and EPB pages.
- Destructive or sensitive actions should require confirmation and audit logging.

Site Admin Console required content:

| Area / Action ID | Label | What it contains | Notes |
|---|---|---|---|
| `admin-area-project-owners-list` | Project Owners List | Search/select Project Owners only. | Main content of the compact console. |
| `admin-area-selected-owner-details` | Selected Project Owner Details | Show simple details for the selected Project Owner. | Confirms the owner context before continuing. |
| `admin-action-continue-as-owner` | Continue as Project Owner | Continue the normal application flow as the selected Project Owner. | Show a persistent banner and exit control back to Site Admin Console. |
| `admin-action-exit-owner-view` | Exit Selected-Owner View | Leave selected-owner mode and return to the Project Owners list. | Available from the banner/state control. |

Prototype role preview guidance:

- A demo login selector may let testers choose a role and see the matching menu.
- The Site Admin Console can support owner-context visibility checks through `Continue as Project Owner` from the selected Project Owner.
- Role preview changes visible navigation only in the prototype; real applications still need server-side permission checks.

Site Admin selected-owner mode:

| Mode ID | Label | Purpose | Typical flow | Safety notes |
|---|---|---|---|---|
| `admin-mode-selected-owner` | Site Admin viewing as Project Owner | Continue the application as a selected Project Owner to support or manage that owner's projects through the normal owner workflow. | Site Admin Console → Project Owners list → Select Project Owner → Continue as Project Owner → Project List → Project Dashboard → Building / SRI / EPB flow. | Show a persistent banner such as `Site Admin viewing as Project Owner: Maria — Exit owner view`. Log actions with both the real Site Admin actor and the selected Project Owner context. |

No separate user-projects page is required for the minimal prototype. The compact Site Admin Console should show a Project Owners list and, when an owner is selected, a simple details panel/card with:

- Project Owner profile summary.
- Owned project count/status summary, if available.
- `Continue as Project Owner` action.
- `Exit selected-owner view` action when already viewing as an owner.

For project editing, Site Admin should reuse the existing Project List, Project Dashboard, and building child pages as the selected Project Owner instead of a new admin-only duplicate flow. The Site Admin Console should not become a complicated multi-view admin area.

---

## Dashboard child pages

Parent menu item: `nav-project-dashboard`

These pages are allowed for Project Member, Project Owner, and Site Admin when scoped permissions allow them. They are not main menu items.

| Child Page ID | Label | Target | Opened from |
|---|---|---|---|
| `child-building-add` | Add New Building | `view/B-add-new-building.html` | Project Dashboard action/button |
| `child-building-open-edit` | Open / Edit Building | `view/C-open-edit-building.html` | Project Dashboard building list/card |
| `child-sri-workflow` | SRI Assessment | `view/SRI1-methodology-selection.html` | Open/Edit Building or building workflow action |
| `child-epb-workflow` | EPB Assessment | `view/EPB1-calculation-settings.html` | Open/Edit Building or building workflow action |

---

## Project Users page capabilities

Parent menu item: `nav-project-members`

The `nav-project-members` menu item opens one combined Project Users management page. It replaces separate top-level menu items for Project Members, Invitations, and Membership Requests.

This page can include these sections/actions:

| Area / Action ID | Label | What the user can do | Notes |
|---|---|---|---|
| `section-project-members` | Project Members | View current project members, review member roles/status, and remove or update members when allowed. | Available to Project Owner for owned projects and Site Admin through selected-owner mode. |
| `action-project-invite-user` | Invite User | Invite a user by email to join the selected project. | Previously represented by `nav-project-invitations`. Now an action inside `nav-project-members`. |
| `section-project-membership-requests` | Membership Requests | View pending project membership requests and approve or reject them. | Previously represented by `nav-project-requests`. Now a section inside `nav-project-members`. |

---

## My Projects list child actions

Parent menu item: `nav-project-settings`

This page lists projects the user can manage. Project Owner sees owned projects. Site Admin sees projects for the selected Project Owner while in selected-owner mode. These actions are not top-level main menu items.

| Action ID | Label | Target | Opened from | Notes |
|---|---|---|---|---|
| `action-project-edit` | Edit Project | Project edit form/page, when created | Each project row/card Edit button | Allows editing project metadata, configuration, and non-destructive settings. |
| `action-project-delete` | Delete Project | Delete confirmation modal/page, when created | Each project row/card Delete button | Destructive action; must require confirmation and audit logging. |

---

## Workflow child navigation guidance

The main menu should stay compact. Workflow pages can appear as child navigation inside the selected workflow only.

### SRI workflow submenu

Parent child page: `child-sri-workflow`

| Step ID | Label | Target |
|---|---|---|
| `sri-step-methodology` | Methodology Selection | `view/SRI1-methodology-selection.html` |
| `sri-step-default-weightings` | Default Weightings | `view/SRI2-Default-weightings.html` |
| `sri-step-weighting-settings` | Weighting Settings | `view/SRI3-weighting-settings.html` |
| `sri-step-domain-dashboard` | Domain Dashboard | `view/SRI4-domain-dashboard.html` |
| `sri-domain-heating` | Heating | `view/SRI5-heating-tab.html` |
| `sri-domain-dhw` | Domestic Hot Water | `view/SRI6-dhw-tab.html` |
| `sri-domain-cooling` | Cooling | `view/SRI7-cooling-tab.html` |
| `sri-domain-ventilation` | Ventilation | `view/SRI8-ventilation-tab.html` |
| `sri-domain-lighting` | Lighting | `view/SRI9-lighting-tab.html` |
| `sri-domain-dynamic-envelope` | Dynamic Envelope | `view/SRI10-dynamic-envelope-tab.html` |
| `sri-domain-electricity` | Electricity | `view/SRI11-electricity-tab.html` |
| `sri-domain-ev-charging` | EV Charging | `view/SRI12-ev-charging-tab.html` |
| `sri-domain-monitoring-control` | Monitoring & Control | `view/SRI13-monitoring-control-tab.html` |
| `sri-step-results` | Results | `view/SRI14-results.html` |

### EPB workflow submenu

Parent child page: `child-epb-workflow`

| Step ID | Label | Target |
|---|---|---|
| `epb-step-calculation-settings` | Calculation Settings | `view/EPB1-calculation-settings.html` |
| `epb-step-ground-temperature` | Ground Temperature | `view/EPB1b-ground-temperature.html` |
| `epb-step-materials-constructions` | Materials & Constructions | `view/EPB2-materials-constructions.html` |
| `epb-step-thermal-zones-envelope` | Thermal Zones & Envelope | `view/EPB3-thermal-zones-envelope.html` |
| `epb-step-spaces` | Spaces | `view/EPB-spaces-tab.html` |
| `epb-step-operations` | Operations | `view/EPB-operations-tab.html` |
| `epb-step-results-summary` | Results Summary | `view/EPB4-results-summary.html` |

---

## Implementation note

Use this document to generate role-based menus.

Recommended data shape:

```js
{
  id: "nav-project-dashboard",
  label: "Project Dashboard",
  href: "view/A-projects-dashboard.html",
  roles: ["Project Member", "Project Owner", "Site Admin"]
}
```

The menu should filter items by role and project scope before rendering.
