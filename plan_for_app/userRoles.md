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
- Cannot edit buildings created by other users.
- Cannot invite users, approve requests, or manage project permissions.

4. Project Owner
- Owner/admin of one specific project.
- Can access and manage their own project.
- Can create/edit all buildings inside their project.
- Can run the OpenBEP4EU Calculation Engine D2.2 for all buildings inside their project.
- Can invite users by email.
- Can approve/disapprove membership requests.
- Can manage project members.
- Cannot manage unrelated projects unless also assigned there.
- Cannot access global site administration unless also Site Admin.

5. Site Admin
- Platform-level administrator.
- Can access all projects.
- Can create/edit all buildings across all projects.
- Can run the OpenBEP4EU Calculation Engine D2.2 for all buildings across all projects.
- Can manage/access users globally from the compact Site Admin Console and use existing project/dashboard flows with full admin permission.
- Can access the site admin console.
- Can use Become User / View as User mode to continue the app as a selected user for support, debugging, and role visibility checks.
- Can use Admin Free Edit mode to directly edit any project/building from the existing project list/dashboard and building flows.
- Should still use confirmations/audit logs for destructive or sensitive actions.

Role model rules:
- Guest is unauthenticated.
- Registered User is an account-level role.
- Project Member and Project Owner are project-level roles.
- Site Admin is a platform-level role.
- One person can have different project roles in different projects.
- Example: same user can be Project Owner in Project A and Project Member in Project B.
- Site Admin permissions are global and override normal project restrictions.
- Site Admin does not need separate admin-only duplicate pages for user projects; the Site Admin Console can show user project memberships, then link into the existing project/dashboard flow.
- Become User mode and Admin Free Edit mode must be visually distinct so the admin knows whether they are acting as a user or acting with full admin permissions.

Temporary workflow states, not permanent roles:
- Pending Member / Applicant: requested membership, no building access yet.
- Invited User: invited by owner, becomes Project Member after accepting/approval.
- Access Denied / No Access: authentication or permission failure state.