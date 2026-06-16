LLM guidance: OpenBEP4EU user roles and permissions

Use 5 canonical roles:

1. Guest
- Not logged in.
- Can only open public/login/register pages.
- Cannot access dashboard, projects, buildings, SRI, EPB, or user management.

2. Registered User
- Has an account and can log in.
- Can edit own profile.
- Can create a new project or request membership in an existing project.
- Has no building access until they are approved into a project or create one.

3. Project Member
- Approved user inside a specific project.
- Can access that project dashboard.
- Can create buildings in that project.
- Can edit only buildings they created.
- Can use SRI/EPB workflows for allowed buildings.
- Can run the OpenBEP4EU Calculation Engine D2.2 only for allowed buildings.
- Can view `view/project-settings.html` for approved projects in read-only mode, but the only project-settings action available to a member is opening/returning to the project dashboard.
- Cannot edit buildings created by other users.
- Cannot invite users, approve requests, or manage project permissions.
- Cannot edit project settings, archive projects, or delete projects.

4. Project Owner
- Owner/admin of one specific project.
- Can access and manage their own project.
- Can create/edit all buildings inside their project.
- Can run the OpenBEP4EU Calculation Engine D2.2 for all buildings inside their project.
- Can add an already registered user to their project by email.
- If the email is not registered, the system must show an error and must not add the user.
- Can approve/disapprove membership requests.
- Can manage project members.
- Can manage owned project settings in `view/project-settings.html`, including editing project metadata and using archive/delete actions where allowed and confirmed.
- Cannot manage unrelated projects unless also assigned there.
- Cannot access global site administration unless also Site Admin.

5. Site Admin
- Platform-level administrator.
- Can access the Site Admin Console.
- Site Admin has two supported ways to work in the minimal prototype:
  1. Select a Project Owner in the Site Admin Console, then continue into the normal application as that selected owner.
  2. Open the normal Project List as Site Admin, open any project dashboard, and create/edit buildings, SRI, EPB, and calculation workflows through the existing normal pages.
- Site Admin Console must be simple and focused: it shows a list of Project Owners to select from and a link/action to open the normal Project List as Site Admin.
- While acting as the selected Project Owner, Site Admin can manage the same projects, buildings, members, registered-user additions, membership requests, SRI, EPB, and calculation workflows that the selected owner can manage.
- While using direct Site Admin Project List access, Site Admin can open any project dashboard and edit/manage project settings, buildings, SRI, EPB, and calculation workflows through the normal project/building pages.
- Site Admin should not use a broad multi-section admin console for users/projects/buildings/audit logs in the minimal prototype; direct project/building work must reuse the normal Project List / Dashboard / Building flow.
- The UI must clearly show a persistent banner/state such as "Site Admin viewing as Project Owner: [owner name]".
- The UI must also clearly show a persistent banner/state for direct admin project access, such as "Site Admin direct project access".
- Site Admin can exit owner-view mode and return to the Project Owner selection list.
- Should still use confirmations/audit logs for destructive or sensitive actions.

Role model rules:
- Guest is unauthenticated.
- Registered User is an account-level role.
- Project Member and Project Owner are project-level roles.
- Site Admin is a platform-level role.
- One person can have different project roles in different projects.
- Example: same user can be Project Owner in Project A and Project Member in Project B.
- Site Admin permissions are exercised either through selected Project Owner context or through direct Site Admin Project List access in the minimal prototype.
- Site Admin does not need separate admin-only duplicate pages for user projects.
- Site Admin Console should list Project Owners, allow selecting one owner, open the normal owner project/dashboard flow, and also provide a direct action to open the normal Project List as Site Admin.
- Owner-view mode must be visually distinct so the admin knows they are managing as the selected Project Owner.
- Direct Site Admin project access must be visually distinct so the admin knows they are editing with Site Admin permissions.

Project List vs Project Dashboard:
- Project List and Project Dashboard are different views.
- Project List is the project browsing/selection view. It is used to find projects, create a project, request membership, and see membership/request status.
- Pending membership/request status is shown in the Project List (`view/project-list.html`); do not create or document a separate pending-membership page.
- Project Dashboard is the selected project workspace after the user has access to a specific project. It shows buildings and starts building, SRI, EPB, and calculation workflows.
- Registered Users can see the Project List, but they cannot open a Project Dashboard until they are approved into that project or create a project and become its Project Owner.
- Project Members and Project Owners open the Project Dashboard only for projects allowed by their project permissions. Site Admin can open dashboards through selected Project Owner context or through direct Site Admin Project List access.
- Project Settings (`view/project-settings.html`) is project-scoped: Project Members may view settings read-only and go to the dashboard; Project Owners and Site Admins may edit settings and use confirmed archive/delete actions where allowed.

Temporary workflow states, not permanent roles:
- Pending Member / Applicant: requested membership, no building access yet.
- Invited User: temporary legacy/project-list state only. For the Project Users management page, owners add existing registered users directly by email; if the email does not exist, show an error.
- Access Denied / No Access: authentication or permission failure state.