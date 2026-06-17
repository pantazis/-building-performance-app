/**
 * =============================================================================
 * OpenBEP4EU Complete Domain Model v2 — TypeScript-style JS Object
 * =============================================================================
 *
 * This file is the canonical, numbered data model covering all 9 domain
 * sections of the OpenBEP4EU application. Each section is self-contained
 * with:
 *   - `completed: true` and the `[*]` marker in its description when finished
 *   - `rules` — a set of numbered rule objects
 *   - `dataShape` — the JS object shape matching the existing data model
 *   - `navigationRef` — cross-reference to plan_for_app/menu-diagram-example.mmd
 *   - `uiRef` — cross-reference to data_model/sri_epb_ui_data_model_v2.js
 *
 * Source of truth files:
 *   - data_model/sri_epb_ui_data_model_v2.js
 *   - plan_for_app/menu-diagram-example.mmd
 *   - plan_for_app/userRoles.md
 *   - plan_for_app/role-navigation-menus.md
 *   - plan_for_app/role-page-visibility.md
 *
 * =============================================================================
 */

var OpenBEP4EU_DomainModel = {
  meta: {
    version: "2.0",
    versionDate: "2026-06-17",
    description: "Complete OpenBEP4EU domain model — 9 sections, numbered, with TypeScript-style JSDoc annotations.",
    sourceFiles: [
      "data_model/sri_epb_ui_data_model_v2.js",
      "plan_for_app/menu-diagram-example.mmd",
      "plan_for_app/userRoles.md",
      "plan_for_app/role-navigation-menus.md",
      "plan_for_app/role-page-visibility.md",
      "plan_for_app/frontend-backend-data-model-map.md"
    ]
  },

  // ==========================================================================
  // [*] SECTION 1: User & Account
  // ==========================================================================
  /**
   * @description [*] Registration fields, login, profile, account roles
   * @completed true
   */
  section_1_user_account: {
    completed: true,
    description: "[*] User registration, authentication, profile editing, and account role model.",
    navigationRef: "menu-diagram-example.mmd: lines 79-92 — Register → Login → Auth check → Profile page",
    uiRef: "sri_epb_ui_data_model_v2.js: lines 30-75 (auth, users), lines 78-111 (login, register, user-profile pages)",

    rules: {
      rule_1_1: {
        id: "rule_1_1",
        title: "Registration fields",
        action: "register",
        fields: ["name", "email", "password", "confirmPassword", "accountRole"],
        requiredFields: ["name", "email", "password", "confirmPassword"],
        pageRef: "view/register.html",
        access: "Guest",
        nextPage: "view/login.html",
        detail: "When a Guest completes registration, they are redirected to login. accountRole is optional (default: 'Registered User')."
      },
      rule_1_2: {
        id: "rule_1_2",
        title: "Login fields and authentication check",
        action: "login",
        fields: ["email", "password"],
        requiredFields: ["email", "password"],
        pageRef: "view/login.html",
        access: "Guest",
        nextPage: "view/project-list.html",
        authFailRedirect: "view/login.html",
        detail: "User submits email + password. If auth fails, show error on login page and stay on login. If auth succeeds, redirect to project list."
      },
      rule_1_3: {
        id: "rule_1_3",
        title: "Profile (editable by authenticated user)",
        action: "editOwnProfile",
        pageRef: "view/user-profile.html",
        access: "Registered User, Project Member, Project Owner, Site Admin",
        previousPage: "view/project-list.html",
        nextPages: ["view/project-list.html"],
        sections: ["accountIntro", "accountDetails", "accountAccessNote"],
        fields: ["name", "email", "password", "confirmPassword", "accountRole"],
        requiredFields: ["name", "email", "password", "confirmPassword"],
        sourceOfTruth: "view/register.html — same account fields as registration",
        actions: ["saveOwnAccount", "openProjectList"],
        safeguards: ["authenticatedUsersOnly", "editOwnAccountOnly", "emailMustBeValid", "passwordMinLength8", "passwordConfirmationMustMatch", "projectRolesManagedOutsideProfile"]
      },
      rule_1_4: {
        id: "rule_1_4",
        title: "Account-level roles enum",
        enum: ["Guest", "Registered User"],
        detail: "Guest = unauthenticated, no account. Registered User = has an account, can log in, can create projects or request membership. Project-level roles (Project Member, Project Owner) are assigned per project, not at account level. Site Admin is a platform-level role."
      },
      rule_1_5: {
        id: "rule_1_5",
        title: "Safeguards for account operations",
        items: [
          "passwordMinLength8 — password must be at least 8 characters",
          "emailMustBeValid — email format must be valid",
          "passwordConfirmationMustMatch — password and confirmPassword must be identical",
          "authenticatedUsersOnly — profile page requires authentication",
          "editOwnAccountOnly — user can only edit their own profile, not others",
          "projectRolesManagedOutsideProfile — project memberships/roles are managed via Project Users page, not the profile"
        ]
      }
    },

    dataShape: {
      auth: {
        status: "AUTHENTICATED | UNAUTHENTICATED",
        currentUser: {
          id: "string",
          name: "string",
          email: "string",
          accountRole: "'Registered User'",
          platformRole: "'USER' | 'SITE_ADMIN'"
        }
      },
      users: [
        {
          id: "string",
          profile: {
            name: "string",
            email: "string"
          },
          memberships: [
            {
              projectId: "string",
              projectRole: "'PROJECT_OWNER' | 'PROJECT_MEMBER'",
              status: "'APPROVED' | 'PENDING' | 'INVITED' | 'REMOVED' | 'DISAPPROVED'",
              joinedAt: "ISO date",
              requestedAt: "ISO date (optional)",
              invitedAt: "ISO date (optional)"
            }
          ],
          permissions: ["string"]
        }
      ]
    }
  },

  // ==========================================================================
  // [*] SECTION 2: Roles & Platform Permissions
  // ==========================================================================
  /**
   * @description [*] Role hierarchy, platform-level permission strings, role-based access rules
   * @completed true
   */
  section_2_roles_permissions: {
    completed: true,
    description: "[*] Role hierarchy (Site Admin → Project Owner → Project Member → Registered User → Guest), platform-level permission strings, and role-based access control rules.",
    navigationRef: "menu-diagram-example.mmd: lines 76-174 (User management and permissions workflow), lines 145-173 (Final building access rules)",
    uiRef: "sri_epb_ui_data_model_v2.js: lines 36-39 (auth.currentUser roles), lines 51-52, 64, 73 (permissions arrays), lines 391-400 (allowedActionsByStatus), plan_for_app/userRoles.md (all lines)",

    rules: {
      rule_2_1: {
        id: "rule_2_1",
        title: "Role hierarchy (descending privilege)",
        hierarchy: [
          { rank: 1, role: "Site Admin", scope: "Platform-wide", detail: "Can access any project, manage project owners, use selected-owner or direct-admin modes." },
          { rank: 2, role: "Project Owner", scope: "Project-specific", detail: "Owns one or more specific projects. Can manage members, edit all project buildings, edit project settings." },
          { rank: 3, role: "Project Member", scope: "Project-specific", detail: "Approved member of a specific project. Can access dashboard, create buildings, edit own buildings only." },
          { rank: 4, role: "Registered User", scope: "Account-level", detail: "Has an account. Can create projects, request membership. No building access until approved into a project." },
          { rank: 5, role: "Guest", scope: "Public", detail: "Not logged in. Can only see login/register pages." }
        ]
      },
      rule_2_2: {
        id: "rule_2_2",
        title: "Platform-level permission strings",
        description: "These are stored in AppDataModel.users[].permissions and control what actions a user can perform globally.",
        permissions: [
          { id: "CREATE_PROJECT", allowed: ["Registered User", "Project Owner", "Site Admin"] },
          { id: "REQUEST_PROJECT_MEMBERSHIP", allowed: ["Registered User"] },
          { id: "EDIT_OWN_BUILDINGS", allowed: ["Project Member"] },
          { id: "MANAGE_OWN_PROJECT", allowed: ["Project Owner"] },
          { id: "EDIT_ALL_PROJECT_BUILDINGS", allowed: ["Project Owner", "Site Admin"] },
          { id: "APPROVE_MEMBERS", allowed: ["Project Owner", "Site Admin"] },
          { id: "MANAGE_ALL_PROJECTS", allowed: ["Site Admin"] },
          { id: "SITE_ADMIN_CONSOLE", allowed: ["Site Admin"] },
          { id: "ARCHIVE_PROJECT", allowed: ["Project Owner", "Site Admin"] },
          { id: "DELETE_PROJECT", allowed: ["Project Owner", "Site Admin"] }
        ]
      },
      rule_2_3: {
        id: "rule_2_3",
        title: "PlatformRole enum values",
        enum: ["USER", "SITE_ADMIN"],
        detail: "USER = standard authenticated user. SITE_ADMIN = platform-level administrator with elevated access."
      },
      rule_2_4: {
        id: "rule_2_4",
        title: "Multi-project membership rule",
        detail: "One person can have different project roles in different projects. Example: same user can be Project Owner in Project A and Project Member in Project B."
      },
      rule_2_5: {
        id: "rule_2_5",
        title: "Site Admin access modes",
        modes: [
          {
            mode: "selectedOwner",
            detail: "Site Admin selects a Project Owner from the Site Admin Console, then views/acts as that owner. Banner shows: 'Site Admin viewing as Project Owner: [owner name]'.",
            permissions: "Inherits all Project Owner permissions for that owner's projects. Can manage members, edit buildings, run calculations."
          },
          {
            mode: "directAdmin",
            detail: "Site Admin opens normal Project List directly. Banner shows: 'Site Admin direct project access'. Can open any project dashboard and edit through normal pages.",
            permissions: "Can open any project dashboard, create/edit buildings, SRI, EPB, calculations through existing normal pages."
          }
        ]
      },
      rule_2_6: {
        id: "rule_2_6",
        title: "Role-based page access matrix",
        source: "plan_for_app/role-page-visibility.md",
        pages: {
          "view/login.html": { Guest: true, "Registered User": false, "Project Member": false, "Project Owner": false, "Site Admin": false },
          "view/register.html": { Guest: true, "Registered User": false, "Project Member": false, "Project Owner": false, "Site Admin": false },
          "view/user-profile.html": { Guest: false, "Registered User": true, "Project Member": true, "Project Owner": true, "Site Admin": true },
          "view/project-list.html": { Guest: false, "Registered User": true, "Project Member": true, "Project Owner": true, "Site Admin": true },
          "view/create-project.html": { Guest: false, "Registered User": true, "Project Member": false, "Project Owner": true, "Site Admin": true },
          "view/project-details.html": { Guest: false, "Registered User": true, "Project Member": true, "Project Owner": true, "Site Admin": true },
          "view/project-users.html": { Guest: false, "Registered User": false, "Project Member": false, "Project Owner": true, "Site Admin": true },
          "view/project-settings.html": { Guest: false, "Registered User": false, "Project Member": true, "Project Owner": true, "Site Admin": true },
          "view/A-projects-dashboard.html": { Guest: false, "Registered User": false, "Project Member": true, "Project Owner": true, "Site Admin": true },
          "view/site-admin-console.html": { Guest: false, "Registered User": false, "Project Member": false, "Project Owner": false, "Site Admin": true },
          "view/C-open-edit-building.html": { Guest: false, "Registered User": false, "Project Member": true, "Project Owner": true, "Site Admin": true },
          "view/EPB1-calculation-settings.html": { Guest: false, "Registered User": false, "Project Member": true, "Project Owner": true, "Site Admin": true },
          "view/EPB1b-ground-temperature.html": { Guest: false, "Registered User": false, "Project Member": true, "Project Owner": true, "Site Admin": true },
          "view/EPB2-materials-constructions.html": { Guest: false, "Registered User": false, "Project Member": true, "Project Owner": true, "Site Admin": true },
          "view/EPB3-thermal-zones-envelope.html": { Guest: false, "Registered User": false, "Project Member": true, "Project Owner": true, "Site Admin": true },
          "view/EPB-spaces-tab.html": { Guest: false, "Registered User": false, "Project Member": true, "Project Owner": true, "Site Admin": true },
          "view/EPB-operations-tab.html": { Guest: false, "Registered User": false, "Project Member": true, "Project Owner": true, "Site Admin": true },
          "view/EPB4-results-summary.html": { Guest: false, "Registered User": false, "Project Member": true, "Project Owner": true, "Site Admin": true },
          "view/SRI1-methodology-selection.html": { Guest: false, "Registered User": false, "Project Member": true, "Project Owner": true, "Site Admin": true },
          "view/SRI2-Default-weightings.html": { Guest: false, "Registered User": false, "Project Member": true, "Project Owner": true, "Site Admin": true },
          "view/SRI3-weighting-settings.html": { Guest: false, "Registered User": false, "Project Member": true, "Project Owner": true, "Site Admin": true },
          "view/SRI14-results.html": { Guest: false, "Registered User": false, "Project Member": true, "Project Owner": true, "Site Admin": true }
        }
      }
    },

    dataShape: {
      platformRoles: {
        hierarchy: [
          { rank: 1, role: "SITE_ADMIN", scope: "platform" },
          { rank: 2, role: "PROJECT_OWNER", scope: "project" },
          { rank: 3, role: "PROJECT_MEMBER", scope: "project" },
          { rank: 4, role: "REGISTERED_USER", scope: "account" },
          { rank: 5, role: "GUEST", scope: "public" }
        ],
        permissionStrings: [
          "CREATE_PROJECT",
          "REQUEST_PROJECT_MEMBERSHIP",
          "EDIT_OWN_BUILDINGS",
          "MANAGE_OWN_PROJECT",
          "EDIT_ALL_PROJECT_BUILDINGS",
          "APPROVE_MEMBERS",
          "MANAGE_ALL_PROJECTS",
          "SITE_ADMIN_CONSOLE",
          "ARCHIVE_PROJECT",
          "DELETE_PROJECT"
        ]
      }
    }
  },

  // ==========================================================================
  // [*] SECTION 3: Project
  // ==========================================================================
  /**
   * @description [*] Project metadata, project status lifecycle, project creation flow
   * @completed true
   */
  section_3_project: {
    completed: true,
    description: "[*] Project metadata fields, status lifecycle (ACTIVE, IN_PROGRESS, CALCULATION_COMPLETED), project creation workflow, and project list rendering.",
    navigationRef: "menu-diagram-example.mmd: lines 8-15 (PL → A → PS → PU flow), lines 96-98 (CreateProject → BecomeOwner)",
    uiRef: "sri_epb_ui_data_model_v2.js: lines 138-147 (create-project page), lines 203-209 (projectList), lines 456-521 (projects array)",

    rules: {
      rule_3_1: {
        id: "rule_3_1",
        title: "Project metadata fields",
        action: "createProject",
        fields: ["projectName", "shortDescription", "description", "organisationName", "country", "city", "address", "ownerId", "ownerName"],
        requiredFields: ["projectName", "country"],
        defaults: {
          buildingCount: 0,
          membershipStatusForCreator: "OWNER",
          creatorProjectRole: "PROJECT_OWNER",
          status: "ACTIVE",
          createdAt: "current date",
          lastModified: "current date"
        },
        pageRef: "view/create-project.html",
        nextPage: "view/A-projects-dashboard.html",
        detail: "Creator becomes PROJECT_OWNER of the new project. Project is added to AppDataModel.projects[] and AppDataModel.ui.projectList[]."
      },
      rule_3_2: {
        id: "rule_3_2",
        title: "Project status lifecycle",
          enum: [
            { status: "ACTIVE", description: "Project is active and in normal operation." },
            { status: "IN_PROGRESS", description: "Project has buildings with calculation data in progress." },
            { status: "CALCULATION_COMPLETED", description: "Calculation engine has completed for the project's buildings." }
          ],
          transitions: [
            { from: "ACTIVE", to: "IN_PROGRESS", allowedRoles: ["PROJECT_OWNER", "PROJECT_MEMBER"], trigger: "building data entry started" },
            { from: "IN_PROGRESS", to: "CALCULATION_COMPLETED", allowedRoles: ["PROJECT_OWNER", "PROJECT_MEMBER", "system"], trigger: "calculation finished" }
          ]
      },
      rule_3_3: {
        id: "rule_3_3",
        title: "Project list display shape",
        source: "AppDataModel.ui.projectList[]",
        fields: ["id", "name", "shortDescription", "description", "ownerId", "ownerName", "organisationName", "country", "city", "address", "buildingCount", "membershipStatus", "projectStatus"],
        membershipStatuses: ["OWNER", "APPROVED", "PENDING", "INVITED", "DISAPPROVED", "REMOVED", "NONE"]
      },
      rule_3_4: {
        id: "rule_3_4",
        title: "Project dashboard variant shape",
        source: "AppDataModel.ui.dashboardProjectVariants[]",
        fields: ["id", "lastModified", "name", "country", "address", "type", "status", "score", "scoreClass"],
        scoreClassEnum: ["A", "B", "C", "D", "E", "F", "G", "-"]
      }
    },

    dataShape: {
      projects: [
        {
          id: "string",
          name: "string",
          shortDescription: "string",
          description: "string",
          ownerId: "string",
          ownerName: "string",
          organisationName: "string",
          country: "string",
          city: "string",
          address: "string",
          buildingCount: "number",
          createdAt: "ISO date",
          lastModified: "ISO date",
          status: "'ACTIVE' | 'IN_PROGRESS' | 'CALCULATION_COMPLETED'",
          members: [],
          membershipRequests: [],
          invitations: [],
          building: {} // Single building per project in prototype
        }
      ]
    }
  },

  // ==========================================================================
  // [*] SECTION 4: Project Membership
  // ==========================================================================
  /**
   * @description [*] Member entities, membership request/invitation entities, membership statuses, project-level permissions per role
   * @completed true
   */
  section_4_project_membership: {
    completed: true,
    description: "[*] Project membership model: member entities, membership requests, invitations, statuses (OWNER, APPROVED, PENDING, INVITED, DISAPPROVED, REMOVED, NONE), and project-level permissions per role.",
    navigationRef: "menu-diagram-example.mmd: lines 100-127 (ProjectList → ProjectDetail → AskMembership → OwnerManagementPage → Approve/Disapprove)",
    uiRef: "sri_epb_ui_data_model_v2.js: lines 159-172 (project-users page), lines 248-320 (projectUsers workflow), lines 391-400 (allowedActionsByStatus), lines 472-520 (members, membershipRequests, invitations in projects[])",

    rules: {
      rule_4_1: {
        id: "rule_4_1",
        title: "Member entity shape",
        source: "AppDataModel.projects[].members[]",
        fields: [
          { name: "userId", type: "string", description: "User ID reference to AppDataModel.users[].id" },
          { name: "name", type: "string", description: "Display name" },
          { name: "email", type: "string", description: "Email address" },
          { name: "projectRole", type: "enum", values: ["PROJECT_OWNER", "PROJECT_MEMBER"] },
          { name: "status", type: "enum", values: ["APPROVED", "PENDING", "INVITED", "DISAPPROVED", "REMOVED"] },
          { name: "joinedAt", type: "ISO date", description: "When the member was added/approved" },
          { name: "removedAt", type: "ISO date|null" },
          { name: "removedBy", type: "string|null" }
        ]
      },
      rule_4_2: {
        id: "rule_4_2",
        title: "Membership request entity shape",
        source: "AppDataModel.projects[].membershipRequests[]",
        fields: [
          { name: "id", type: "string" },
          { name: "projectId", type: "string" },
          { name: "userId", type: "string" },
          { name: "userName", type: "string" },
          { name: "email", type: "string" },
          { name: "message", type: "string", description: "Optional message from the requester" },
          { name: "status", type: "enum", values: ["PENDING", "APPROVED", "DISAPPROVED"] },
          { name: "requestedAt", type: "ISO date" },
          { name: "reviewedAt", type: "ISO date|null" },
          { name: "reviewedBy", type: "string|null" },
          { name: "decisionNote", type: "string|null" }
        ]
      },
      rule_4_3: {
        id: "rule_4_3",
        title: "Invitation entity shape (owner sends invitation by email)",
        source: "AppDataModel.projects[].invitations[]",
        fields: [
          { name: "id", type: "string" },
          { name: "projectId", type: "string" },
          { name: "email", type: "string", description: "Email of the invited registered user" },
          { name: "projectRole", type: "enum", values: ["PROJECT_MEMBER"] },
          { name: "message", type: "string", description: "Optional invitation message" },
          { name: "status", type: "enum", values: ["INVITED", "APPROVED", "DECLINED"] },
          { name: "invitedAt", type: "ISO date" },
          { name: "invitedBy", type: "string", description: "userId of the inviter" }
        ]
      },
      rule_4_4: {
        id: "rule_4_4",
        title: "Membership statuses and allowed actions",
        statuses: [
          { status: "OWNER", description: "Current user is the project owner", allowedActions: ["openDashboard", "manageProjectUsers", "editProjectSettings", "archiveProject", "deleteProject"] },
          { status: "APPROVED", description: "Current user is an approved member", allowedActions: ["openDashboard", "viewProjectSettings", "createBuilding", "editOwnBuildings"] },
          { status: "PENDING", description: "Membership request waiting for owner approval", allowedActions: ["viewPendingRequest", "backToProjectList"] },
          { status: "INVITED", description: "Owner invited the user", allowedActions: ["acceptInvitation", "declineInvitation", "backToProjectList"] },
          { status: "DISAPPROVED", description: "Membership request was rejected", allowedActions: ["backToProjectList", "openProjectDetails"] },
          { status: "REMOVED", description: "User was removed from the project", allowedActions: ["backToProjectList", "openProjectDetails", "requestMembership"] },
          { status: "NONE", description: "No membership relationship", allowedActions: ["openProjectDetails", "requestMembership", "backToProjectList"] }
        ]
      },
      rule_4_5: {
        id: "rule_4_5",
        title: "Add registered user by email rule (owner action)",
        allowedFor: ["PROJECT_OWNER", "SITE_ADMIN"],
        fields: { email: "string" },
        source: "AppDataModel.users[] by profile.email",
        rules: [
          "If email exists in AppDataModel.users and user is not already a member: add as APPROVED PROJECT_MEMBER.",
          "If email does not exist: show error 'User with email {email} does not exist.'",
          "If user is already a member: show error 'User with email {email} is already part of this project.'",
          "New member is created in both AppDataModel.projects[].members[] and AppDataModel.users[].memberships[]."
        ]
      },
      rule_4_6: {
        id: "rule_4_6",
        title: "Approve membership request rule",
        allowedFor: ["PROJECT_OWNER", "SITE_ADMIN"],
        updates: ["AppDataModel.projects[].membershipRequests[].status → APPROVED", "AppDataModel.projects[].members[] → add new member", "AppDataModel.users[].memberships[] → add new membership"],
        newProjectRole: "PROJECT_MEMBER"
      },
      rule_4_7: {
        id: "rule_4_7",
        title: "Disapprove / reject membership request rule",
        allowedFor: ["PROJECT_OWNER", "SITE_ADMIN"],
        updates: ["AppDataModel.projects[].membershipRequests[].status → DISAPPROVED"],
        requiresConfirmation: true
      },
      rule_4_8: {
        id: "rule_4_8",
        title: "Remove member rule",
        allowedFor: ["PROJECT_OWNER", "SITE_ADMIN"],
        updates: ["AppDataModel.projects[].members[].status → REMOVED", "AppDataModel.users[].memberships[].status → REMOVED", "AppDataModel.ui.projectList[].membershipStatus → NONE"],
        requiresConfirmation: true,
        safeguard: "Cannot remove the only PROJECT_OWNER from a project."
      },
      rule_4_9: {
        id: "rule_4_9",
        title: "Project-level permissions per role",
        matrix: {
          PROJECT_OWNER: [
            "openDashboard",
            "manageProjectUsers",
            "editProjectSettings",
            "archiveProject",
            "deleteProject",
            "createBuilding",
            "editAllProjectBuildings",
            "runCalculationEngine",
            "addRegisteredUser",
            "approveMembershipRequest",
            "rejectMembershipRequest",
            "removeMember"
          ],
          PROJECT_MEMBER: [
            "openDashboard",
            "viewProjectSettings",
            "createBuilding",
            "editOwnBuildings",
            "runCalculationEngineForOwnBuildings"
          ]
        },
        deniedFor: {
          PROJECT_MEMBER: [
            "editBuildingsCreatedByOtherUsers",
            "inviteUsers",
            "approveRequests",
            "manageProjectPermissions",
            "editProjectSettings",
            "archiveProject",
            "deleteProject"
          ]
        }
      }
    },

    dataShape: {
      membershipStatus: "'OWNER' | 'APPROVED' | 'PENDING' | 'INVITED' | 'DISAPPROVED' | 'REMOVED' | 'NONE'",
      member: {
        userId: "string",
        name: "string",
        email: "string",
        projectRole: "'PROJECT_OWNER' | 'PROJECT_MEMBER'",
        status: "'APPROVED' | 'PENDING' | 'INVITED' | 'DISAPPROVED' | 'REMOVED'",
        joinedAt: "ISO date",
        removedAt: "ISO date | null",
        removedBy: "string | null"
      },
      membershipRequest: {
        id: "string",
        projectId: "string",
        userId: "string",
        userName: "string",
        email: "string",
        message: "string",
        status: "'PENDING' | 'APPROVED' | 'DISAPPROVED'",
        requestedAt: "ISO date",
        reviewedAt: "ISO date | null",
        reviewedBy: "string | null",
        decisionNote: "string | null"
      },
      invitation: {
        id: "string",
        projectId: "string",
        email: "string",
        projectRole: "'PROJECT_MEMBER'",
        message: "string",
        status: "'INVITED' | 'APPROVED' | 'DECLINED'",
        invitedAt: "ISO date",
        invitedBy: "string"
      }
    }
  },

  // ==========================================================================
  // [*] SECTION 5: Building
  // ==========================================================================
  /**
   * @description [*] Building metadata, building-to-project relationship, location, climate zone, type/usage
   * @completed true
   */
  section_5_building: {
    completed: true,
    description: "[*] Building entity: metadata fields (type, usage, location, climate zone), belongs-to-Project relationship, and the building add/edit workflow.",
    navigationRef: "menu-diagram-example.mmd: lines 16-22 (A → B → C — Add New Building / Open Edit Building → C)",
    uiRef: "sri_epb_ui_data_model_v2.js: lines 522-541 (building.general), lines 456-521 (building inside project)",

    rules: {
      rule_5_1: {
        id: "rule_5_1",
        title: "Building belongs-to-Project relationship",
        detail: "Each project has exactly one building in the current prototype (buildingCount = 1). The building object lives at AppDataModel.projects[].building. In the future, a project can have multiple buildings."
      },
      rule_5_2: {
        id: "rule_5_2",
        title: "Building metadata fields",
        source: "AppDataModel.projects[].building",
        fields: [
          { name: "id", type: "string" },
          { name: "name", type: "string" },
          { name: "northAxis", type: "number", description: "Degrees from north" },
          { name: "general.type", type: "enum", values: ["Residential", "Non-Residential", "Offices", "Healthcare"] },
          { name: "general.usage", type: "string", description: "Building usage description" },
          { name: "general.country", type: "string" },
          { name: "general.climateZone", type: "string" },
          { name: "general.timeZone", type: "string", example: "Europe/Athens" },
          { name: "general.floorArea", type: "string", description: "Range or exact value" },
          { name: "general.buildingState", type: "string", enum: ["Existing", "Renovated", "New"] },
          { name: "general.year", type: "number", description: "Construction or renovation year" },
          { name: "general.address", type: "string" },
          { name: "general.location.lat", type: "number" },
          { name: "general.location.lng", type: "number" },
          { name: "general.location.elevation", type: "number" }
        ]
      },
      rule_5_3: {
        id: "rule_5_3",
        title: "Add new building workflow",
        action: "createBuilding",
        allowedRoles: ["PROJECT_MEMBER", "PROJECT_OWNER", "SITE_ADMIN"],
        pageRef: "view/C-open-edit-building.html",
        previousPage: "view/A-projects-dashboard.html",
        nextPage: "view/C-open-edit-building.html (to edit the newly created building)",
        fields: ["name", "type", "usage", "country", "climateZone", "timeZone", "floorArea", "buildingState", "year", "address", "lat", "lng", "elevation", "northAxis"]
      },
      rule_5_4: {
        id: "rule_5_4",
        title: "Open / edit existing building workflow",
        action: "editBuilding",
        allowedRoles: {
          "PROJECT_MEMBER": "Can edit only buildings they created (editOwnBuildings permission)",
          "PROJECT_OWNER": "Can edit all buildings in their project (editAllProjectBuildings permission)",
          "SITE_ADMIN": "Can edit all buildings via selected-owner or direct-admin mode"
        },
        pageRef: "view/C-open-edit-building.html",
        previousPage: "view/A-projects-dashboard.html",
        nextPages: ["view/SRI1-methodology-selection.html", "view/EPB1-calculation-settings.html"]
      }
    },

    dataShape: {
      building: {
        id: "string",
        name: "string",
        northAxis: "number",
        general: {
          type: "'Residential' | 'Non-Residential' | 'Offices' | 'Healthcare'",
          usage: "string",
          country: "string",
          climateZone: "string",
          timeZone: "string",
          floorArea: "string",
          buildingState: "'Existing' | 'Renovated' | 'New'",
          year: "number",
          address: "string",
          location: {
            lat: "number",
            lng: "number",
            elevation: "number"
          }
        },
        epb: {},
        sri: {}
      }
    }
  },

  // ==========================================================================
  // [*] SECTION 6: EPB Domain
  // ==========================================================================
  /**
   * @description [*] EPB calculation settings, materials & constructions, thermal zones & spaces, surfaces & subsurfaces, gains & ventilation, systems, results/indicators
   * @completed true
   */
  section_6_epb_domain: {
    completed: true,
    description: "[*] Complete EPB domain model: calculation settings (run period, timestep, ground temperature), materials & constructions library, thermal zones & spaces, surfaces & subsurfaces (walls, windows), gains & ventilation, systems (heating, cooling), and results/indicators (final energy, primary energy, GHG, renewables).",
    navigationRef: "menu-diagram-example.mmd: lines 26-32 (EPB1 → EPB1B → EPB2 → EPB3 → EPBSPACES → EPBOPS → EPB4), lines 60-73 (Calculation Engine D2.2 integration)",
    uiRef: "sri_epb_ui_data_model_v2.js: lines 544-837 (epb section in building), lines 9-28 (calculationEngine meta)",

    rules: {
      rule_6_1: {
        id: "rule_6_1",
        title: "EPB calculation settings (Tab 1)",
        pageRef: "view/EPB1-calculation-settings.html",
        fields: {
          runPeriod: { start: "MM-DD", end: "MM-DD" },
          runPeriodDetailed: {
            beginMonth: "number (1-12)",
            beginDayOfMonth: "number (1-31)",
            endMonth: "number (1-12)",
            endDayOfMonth: "number (1-31)"
          },
          timestep: "number (timestep in hours)",
          timeStep: { numberPerHour: "number" },
          groundTemperatureCalculationProperties: [
            {
              id: "string",
              name: "string",
              externalWallsThickness: "number (m)",
              exposedPerimeter: "number (m)",
              annualMeanInternalTemperature: "number (°C)",
              amplitudeOfInternalTemperatureVariations: "number",
              minExternalTemperatureMonth: "number (1-12)",
              linearThermalTransmittance: "number (W/m·K)",
              linearThermalTrasmittance: "number (W/m·K) — alias for spelling variant",
              conductivity: "number (W/m·K)",
              heatCapacity: "number (MJ/m³·K)"
            }
          ]
        }
      },
      rule_6_2: {
        id: "rule_6_2",
        title: "EPB ground temperature / climate data (Tab 1b)",
        pageRef: "view/EPB1b-ground-temperature.html",
        detail: "Extended climate data and ground temperature calculation properties. Reuses the groundTemperatureCalculationProperties array from EPB1."
      },
      rule_6_3: {
        id: "rule_6_3",
        title: "Materials & constructions library (Tab 2)",
        pageRef: "view/EPB2-materials-constructions.html",
        fields: {
          materialOpaque: [
            { id: "string", roughness: "'MediumRough' | 'Smooth' | ...", thickness: "number (m)", conductivity: "number (W/m·K)", density: "number (kg/m³)", specificHeat: "number (J/kg·K)" }
          ],
          glazingSimpleSystem: [
            { id: "string", uFactor: "number (W/m²·K)", solarHeatGainCoefficient: "number (0-1)", visibleTransmittance: "number (0-1)" }
          ],
          construction: [
            { id: "string", constructionClass: "'MassEquallyDistributed' | ...", outsideLayerMaterialId: "string", layerMaterialIds: ["string"] }
          ],
          scheduleConstant: [
            { id: "string", type: "'Occupancy' | 'Activity' | 'CoolingSetpoint' | 'Ventilation'", hourlyValue: "number" }
          ],
          thermostat: [
            { id: "string", constantHeatingSetpoint: "number (°C)", coolingSetpointSchedule: "string (scheduleId)" }
          ],
          humidistat: [
            { id: "string", constantDehumidificationSetpoint: "number (%)", constantHumidificationSetpoint: "number (%)" }
          ]
        }
      },
      rule_6_4: {
        id: "rule_6_4",
        title: "Thermal zones & spaces (Tab 3 + Spaces Tab)",
        pageRefs: ["view/EPB3-thermal-zones-envelope.html", "view/EPB-spaces-tab.html"],
        fields: {
          thermalZone: {
            id: "string",
            name: "string",
            volume: "number (m³)",
            floorArea: "number (m²)",
            surfaces: [],
            spaces: [],
            thermalZonePeopleGains: {},
            thermalZoneEquipmentGains: {},
            ventilation: {},
            thermalZoneVentilationDesignFlowRate: {},
            needsSystem: {},
            thermalZoneNeedsSystem: {},
            spacesDetailed: []
          }
        }
      },
      rule_6_5: {
        id: "rule_6_5",
        title: "Surfaces & subsurfaces (walls, windows)",
        source: "AppDataModel.projects[].building.epb.zones[].surfaces[]",
        fields: {
          surface: {
            id: "string",
            type: "'wall' | 'roof' | 'floor' | 'ceiling'",
            surfaceType: "'Wall' | 'Roof' | 'Floor' | 'Ceiling'",
            constructionId: "string",
            outsideBoundaryCondition: "'Outdoors' | 'Ground' | 'Adiabatic' | 'SameZone' | 'OtherZone'",
            area: "number (m²)",
            height: "number (m)",
            azimuth: "number (degrees)",
            azimuth_angle: "number (degrees)",
            tilt: "number (degrees)",
            tilt_angle: "number (degrees)",
            groundTemperatureCalculationPropertiesId: "string",
            subsurfaces: [
              {
                id: "string",
                type: "'window' | 'door' | 'skylight'",
                surfaceType: "'Window' | 'Door' | 'Skylight'",
                constructionId: "string",
                area: "number (m²)",
                height: "number (m)",
                azimuth_angle: "number (degrees)",
                tilt_angle: "number (degrees)"
              }
            ]
          }
        }
      },
      rule_6_6: {
        id: "rule_6_6",
        title: "Gains & ventilation",
        source: "AppDataModel.projects[].building.epb.zones[].spaces[].gains",
        fields: {
          people: { activityLevel: "number (W/person)", radiant: "number (0-1)" },
          equipment: { power: "number (W)", radiant: "number (0-1)" }
        },
        detailedGains: {
          thermalZonePeopleGains: {
            id: "string",
            numberOfPeopleSchedule: "string",
            numberOfPeopleCalculationMethod: "'people'",
            numberOfPeople: "number",
            activityLevelSchedule: "string",
            fractionRadiant: "number (0-1)"
          },
          thermalZoneEquipmentGains: {
            id: "string",
            fuelType: "'Electricity' | 'NaturalGas' | ...",
            schedule: "string",
            designLevelCalculationMethod: "'EquipmentLevel'",
            designLevel: "number (W)",
            fractionLatent: "number (0-1)",
            fractionRadiant: "number (0-1)",
            fractionLost: "number (0-1)"
          },
          ventilation: {
            airChangesPerHour: "number"
          },
          thermalZoneVentilationDesignFlowRate: {
            id: "string",
            calculationMethod: "'AirChangesPerHour' | 'FlowRate'",
            airChangesPerHour: "number",
            scheduleId: "string"
          }
        }
      },
      rule_6_7: {
        id: "rule_6_7",
        title: "Systems (heating, cooling) — via Operations Tab",
        pageRef: "view/EPB-operations-tab.html",
        source: "AppDataModel.projects[].building.epb.zones[].needsSystem / thermalZoneNeedsSystem",
        fields: {
          needsSystem: { heating: "number (W)", cooling: "number (W)" },
          thermalZoneNeedsSystem: {
            id: "string",
            maxHeatingPower: "number (W)",
            maxCoolingPower: "number (W)",
            thermostatId: "string",
            humidistatId: "string"
          }
        }
      },
      rule_6_8: {
        id: "rule_6_8",
        title: "EPB results / indicators (Tab 4)",
        pageRef: "view/EPB4-results-summary.html",
        source: "AppDataModel.projects[].building.epb.epcIndicators",
        fields: {
          finalEnergyByCarrier: {
            electricity_kWh: "number",
            naturalGas_kWh: "number"
          },
          primaryEnergy_kWh: "number",
          operationalGHG_kgCO2eq: "number",
          onsiteRenewablesShare_percent: "number"
        },
        orchestration: {
          executionOrder: ["import", "validation", "transformation", "hourlyNeeds", "systems", "aggregation"],
          status: "'READY' | 'PROCESSING' | 'CALCULATION_COMPLETED' | 'ERROR'"
        }
      },
      rule_6_9: {
        id: "rule_6_9",
        title: "EPB validation & transformation",
        source: "AppDataModel.projects[].building.epb.validation / epb.transformation",
        validation: {
          schemaValid: "boolean",
          referenceIntegrityValid: "boolean",
          semanticConstraintsValid: "boolean",
          issues: []
        },
        transformation: {
          helpersApplied: ["envelopeInputMapper", "climateInputMapper", "zoneAndSpaceMapper", "systemsInputMapper"],
          status: "'READY' | 'PROCESSING' | 'COMPLETED' | 'ERROR'"
        }
      }
    },

    dataShape: {
      epb: {
        provenance: {
          sourceType: "'JSON' | 'IFC4 Add2 DTV'",
          sourceFile: "string",
          ifcImport: {
            enabled: "boolean",
            ifcSchema: "string",
            idsValidated: "boolean"
          }
        },
        validation: {
          schemaValid: "boolean",
          referenceIntegrityValid: "boolean",
          semanticConstraintsValid: "boolean",
          issues: []
        },
        transformation: {
          helpersApplied: ["string"],
          status: "'READY' | 'PROCESSING' | 'COMPLETED' | 'ERROR'"
        },
        settings: {
          runPeriod: { start: "string", end: "string" },
          runPeriodDetailed: { beginMonth: "number", beginDayOfMonth: "number", endMonth: "number", endDayOfMonth: "number" },
          timestep: "number",
          timeStep: { numberPerHour: "number" },
          groundTemperatureCalculationProperties: []
        },
        library: {
          materials: [],
          materialOpaque: [],
          glazingSimpleSystem: [],
          construction: [],
          scheduleConstant: [],
          thermostat: [],
          humidistat: [],
          glazing: [],
          constructions: [],
          thermostats: [],
          humidistats: [],
          schedules: []
        },
        zones: [],
        orchestration: {
          executionOrder: ["string"],
          status: "'READY' | 'PROCESSING' | 'CALCULATION_COMPLETED' | 'ERROR'"
        },
        epcIndicators: {
          finalEnergyByCarrier: {},
          primaryEnergy_kWh: "number",
          operationalGHG_kgCO2eq: "number",
          onsiteRenewablesShare_percent: "number"
        }
      }
    }
  },

  // ==========================================================================
  // [*] SECTION 7: SRI Domain
  // ==========================================================================
  /**
   * @description [*] SRI methodology selection (A vs B), weightings (impact + domain), service catalogues, service entries, results, domain presence flags
   * @completed true
   */
  section_7_sri_domain: {
    completed: true,
    description: "[*] Complete SRI domain model: Method A vs B selection, impact weighting, domain weighting, service catalogues per method, service entries (level, compliance), results (total score, class, impact scores, domain scores), and domain presence flags.",
    navigationRef: "menu-diagram-example.mmd: lines 24 (C → SRI1), lines 34-57 (SRI1 → SRI2/SRI3 → SRI14 → domain tabs → back to SRI14)",
    uiRef: "sri_epb_ui_data_model_v2.js: lines 842-1047 (sri section in building)",

    rules: {
      rule_7_1: {
        id: "rule_7_1",
        title: "SRI methodology selection (Method A vs B)",
        pageRef: "view/SRI1-methodology-selection.html",
        enum: ["A", "B"],
        detail: "Method A: subset of services (fewer). Method B: full service catalogue with more services per domain. Selection affects which services are available in the domain tabs."
      },
      rule_7_2: {
        id: "rule_7_2",
        title: "Weightings: Impact weighting + Domain weighting",
        pageRefs: ["view/SRI2-Default-weightings.html", "view/SRI3-weighting-settings.html"],
        hasDefaultWeightings: "boolean",
        rules: [
          { rule: "If hasDefaultWeightings = true → use default weightings (SRI2 page), skip SRI3." },
          { rule: "If hasDefaultWeightings = false → user defines custom weightings (SRI3 page)." },
          { rule: "If jurisdiction.region = NON_EU → force hasDefaultWeightings = false (custom weightings required)." }
        ],
        weighting: {
          impacts: {
            energyEfficiency: "number (%) — sum should be 100",
            maintenance: "number (%)",
            comfort: "number (%)",
            convenience: "number (%)",
            health: "number (%)",
            info: "number (%)",
            flexibility: "number (%)"
          },
          domainWeightingsByImpact: {
            energyEfficiency: {
              heating: "number (%)", dhw: "number (%)", cooling: "number (%)",
              ventilation: "number (%)", lighting: "number (%)", envelope: "number (%)",
              electricity: "number (%)", ev: "number (%)", monitoring: "number (%)"
            },
            maintenance: {},
            comfort: {},
            convenience: {},
            health: {},
            info: {},
            flexibility: {}
          }
        }
      },
      rule_7_3: {
        id: "rule_7_3",
        title: "Domain presence flags",
        source: "AppDataModel.projects[].building.sri.domainsPresence",
        values: { 1: "present", 2: "absent but mandatory", 0: "absent and not mandatory" },
        domains: ["heating", "cooling", "dhw", "ventilation", "lighting", "envelope", "electricity", "ev", "monitoring"]
      },
      rule_7_4: {
        id: "rule_7_4",
        title: "Service catalogues per method",
        source: "AppDataModel.projects[].building.sri.serviceCatalogues",
        methodA: {
          heating: ["H1a", "H1c", "H2a", "H2b", "H3"],
          cooling: ["C1", "C2", "C3"],
          dhw: ["DHW1", "DHW2"],
          ventilation: ["V1", "V2"],
          lighting: ["L1", "L2"],
          envelope: ["DE1"],
          electricity: ["E1", "E2"],
          ev: ["EV1"],
          monitoring: ["MC1", "MC2"]
        },
        methodB: {
          heating: ["H1a", "H1b", "H1c", "H1d", "H1f", "H2a", "H2b", "H2d", "H3"],
          cooling: ["C1", "C2", "C3"],
          dhw: ["DHW1", "DHW2"],
          ventilation: ["V1", "V2"],
          lighting: ["L1", "L2"],
          envelope: ["DE1"],
          electricity: ["E1", "E2"],
          ev: ["EV1"],
          monitoring: ["MC1", "MC2"]
        }
      },
      rule_7_5: {
        id: "rule_7_5",
        title: "Service entries (level, compliance)",
        source: "AppDataModel.projects[].building.sri.services",
        serviceEntry: {
          id: "string (e.g. 'H1a')",
          applicable: "boolean",
          triage: "boolean — 'Affect Maximum Obtainable Score?'",
          level: "number (1-4)",
          compliance: "number (0-1, normalized)",
          entries: [
            { level: "number", compliance: "number" }
          ]
        }
      },
      rule_7_6: {
        id: "rule_7_6",
        title: "SRI results (total score, class, impact scores, domain scores)",
        pageRef: "view/SRI14-results.html",
        source: "AppDataModel.projects[].building.sri.results",
        fields: {
          totalScore: "number (0-100)",
          class: "'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'",
          impacts: {
            energyEfficiency: "number",
            maintenance: "number",
            comfort: "number",
            convenience: "number",
            health: "number",
            info: "number",
            flexibility: "number"
          },
          domains: {
            heating: "number",
            cooling: "number",
            dhw: "number",
            ventilation: "number",
            lighting: "number",
            envelope: "number",
            electricity: "number",
            ev: "number",
            monitoring: "number"
          }
        }
      },
      rule_7_7: {
        id: "rule_7_7",
        title: "SRI domain tabs (service entry pages per domain)",
        pageRefs: {
          heating: "view/SRI5-heating-tab.html",
          dhw: "view/SRI6-dhw-tab.html",
          cooling: "view/SRI7-cooling-tab.html",
          ventilation: "view/SRI8-ventilation-tab.html",
          lighting: "view/SRI9-lighting-tab.html",
          envelope: "view/SRI10-dynamic-envelope-tab.html",
          electricity: "view/SRI11-electricity-tab.html",
          ev: "view/SRI12-ev-charging-tab.html",
          monitoring: "view/SRI13-monitoring-control-tab.html"
        },
        navigation: "Each domain tab edits services.services[domain] entries and returns to view/SRI14-results.html."
      },
      rule_7_8: {
        id: "rule_7_8",
        title: "SRI jurisdiction context",
        source: "AppDataModel.projects[].building.sri.jurisdiction",
        fields: {
          region: "'EU' | 'NON_EU'",
          country: "string"
        },
        rule: "If region is NON_EU, UI must force hasDefaultWeightings = false (custom weightings required)."
      },
      rule_7_9: {
        id: "rule_7_9",
        title: "SRI assessment date",
        source: "AppDataModel.projects[].building.sri.assessmentDate",
        type: "ISO date"
      }
    },

    dataShape: {
      sri: {
        method: "'A' | 'B'",
        hasDefaultWeightings: "boolean",
        jurisdiction: { region: "'EU' | 'NON_EU'", country: "string" },
        assessmentDate: "ISO date",
        domainsPresence: {
          heating: "0 | 1 | 2",
          cooling: "0 | 1 | 2",
          dhw: "0 | 1 | 2",
          ventilation: "0 | 1 | 2",
          lighting: "0 | 1 | 2",
          envelope: "0 | 1 | 2",
          electricity: "0 | 1 | 2",
          ev: "0 | 1 | 2",
          monitoring: "0 | 1 | 2"
        },
        weighting: {
          impacts: {},
          domainImpact: {},
          domainWeightingsByImpact: {}
        },
        serviceCatalogues: {
          methodA: {},
          methodB: {}
        },
        services: {
          heating: [],
          cooling: [],
          dhw: [],
          ventilation: [],
          lighting: [],
          envelope: [],
          electricity: [],
          ev: [],
          monitoring: []
        },
        results: {
          totalScore: "number",
          class: "'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'",
          impacts: {},
          domains: {}
        }
      }
    }
  },

  // ==========================================================================
  // [*] SECTION 8: Calculation Engine
  // ==========================================================================
  /**
   * @description [*] Calculation engine input routes, workflow steps, standards coverage, EPC output indicators
   * @completed true
   */
  section_8_calculation_engine: {
    completed: true,
    description: "[*] OpenBEP4EU Calculation Engine D2.2: input routes (JSON, IFC), workflow steps (import → validate → transform → simulate → orchestrate → output), standards coverage per module, and EPC output indicators.",
    navigationRef: "menu-diagram-example.mmd: lines 59-73 (C → CE0 → CE1 → CE2 → CE3 → CE4 → CE5 → CE6 → EPB4), lines 60-70 (Calculation Engine D2.2 subgraph)",
    uiRef: "sri_epb_ui_data_model_v2.js: lines 9-28 (calculationEngine meta), lines 816-826 (orchestration), lines 828-836 (epcIndicators)",

    rules: {
      rule_8_1: {
        id: "rule_8_1",
        title: "Input routes",
        enum: ["JSON", "IFC4 Add2 DTV"],
        source: "AppDataModel.calculationEngine.inputRoutes",
        detail: "JSON: OpenBEP model instance in JSON format. IFC4 Add2 DTV: Industry Foundation Classes data model."
      },
      rule_8_2: {
        id: "rule_8_2",
        title: "Workflow steps (execution order)",
        source: "AppDataModel.calculationEngine.workflow",
        steps: [
          { step: "dataImport", description: "Import raw data from JSON or IFC input." },
          { step: "dataValidation", description: "Validate schema, reference integrity, and semantic constraints." },
          { step: "dataTransformation", description: "Transform data using helpers (envelopeInputMapper, climateInputMapper, zoneAndSpaceMapper, systemsInputMapper)." },
          { step: "simulationCoreModules", description: "Run EN ISO 52016-1 hourly needs simulation and all supporting module standards." },
          { step: "orchestration", description: "Execution sequence orchestration with intermediate results." },
          { step: "epcOutputAggregation", description: "Aggregate outputs into EPC-relevant indicators." }
        ]
      },
      rule_8_3: {
        id: "rule_8_3",
        title: "Standards coverage per module",
        source: "AppDataModel.calculationEngine.standardsCoverage",
        modules: {
          envelope: ["EN ISO 6946", "EN ISO 13370", "EN ISO 13789"],
          climate: ["EN ISO 52010-1"],
          indoorOperation: ["EN 16798-1"],
          hourlyNeeds: ["EN ISO 52016-1"],
          systems: ["EN 15316 series", "ISO 52031", "EN ISO 52032-1"],
          aggregation: ["EN ISO 52000-1"]
        }
      },
      rule_8_4: {
        id: "rule_8_4",
        title: "EPC output indicators",
        source: "AppDataModel.calculationEngine.epcOutputIndicators",
        indicators: [
          { id: "finalEnergyByCarrier", description: "Final energy consumption broken down by energy carrier (kWh)" },
          { id: "primaryEnergy", description: "Total primary energy consumption (kWh)" },
          { id: "operationalGHG", description: "Operational greenhouse gas emissions (kgCO₂eq)" },
          { id: "onsiteRenewablesShare", description: "On-site renewable energy share (%)" }
        ]
      },
      rule_8_5: {
        id: "rule_8_5",
        title: "Orchestration status states",
        source: "AppDataModel.projects[].building.epb.orchestration.status",
        enum: ["READY", "PROCESSING", "CALCULATION_COMPLETED", "ERROR"],
        descriptions: {
          READY: "Calculation is ready to be triggered.",
          PROCESSING: "Calculation is currently running.",
          CALCULATION_COMPLETED: "Calculation has completed successfully.",
          ERROR: "Calculation encountered an error."
        }
      },
      rule_8_6: {
        id: "rule_8_6",
        title: "Trigger calculation engine",
        action: "runCalculationEngine",
        pageRef: "view/C-open-edit-building.html (link 'Run OpenBEP4EU Calculation Engine D2.2')",
        allowedRoles: ["PROJECT_MEMBER", "PROJECT_OWNER", "SITE_ADMIN"],
        precondition: "All required EPB and SRI data must be populated.",
        postcondition: "Orchestration status transitions from READY → PROCESSING → CALCULATION_COMPLETED or ERROR. Results populate epcIndicators."
      }
    },

    dataShape: {
      calculationEngine: {
        name: "'OpenBEP4EU Calculation Engine'",
        inputRoutes: ["'JSON'", "'IFC4 Add2 DTV'"],
        workflow: [
          "'dataImport'",
          "'dataValidation'",
          "'dataTransformation'",
          "'simulationCoreModules'",
          "'orchestration'",
          "'epcOutputAggregation'"
        ],
        standardsCoverage: {
          envelope: ["string"],
          climate: ["string"],
          indoorOperation: ["string"],
          hourlyNeeds: ["string"],
          systems: ["string"],
          aggregation: ["string"]
        }
      }
    }
  },

  // ==========================================================================
  // [*] SECTION 9: Error / State Models
  // ==========================================================================
  /**
   * @description [*] Validation issues, processing states (READY, PROCESSING, COMPLETED, ERROR), error handling patterns
   * @completed true
   */
  section_9_error_state_models: {
    completed: true,
    description: "[*] Error and state models: validation issues (schema, reference integrity, semantic constraints), processing states (READY, PROCESSING, COMPLETED, ERROR), and error handling patterns across all domains.",
    navigationRef: "menu-diagram-example.mmd: lines 62-65 (CE2 Data Validation — Schema, references, semantic constraints), lines 86-87 (Auth Denied → login error)",
    uiRef: "sri_epb_ui_data_model_v2.js: lines 558-563 (validation), lines 565-573 (transformation), lines 816-826 (orchestration), lines 110-111, 135, 161, 315, 354-356, 370-383 (safeguards, confirmations, audit logs in actionRules)",

    rules: {
      rule_9_1: {
        id: "rule_9_1",
        title: "Validation issues model",
        source: "AppDataModel.projects[].building.epb.validation.issues[]",
        issue: {
          id: "string",
          type: "'SCHEMA' | 'REFERENCE_INTEGRITY' | 'SEMANTIC_CONSTRAINT'",
          severity: "'ERROR' | 'WARNING' | 'INFO'",
          message: "string",
          path: "string (JSON path to the field with the issue)",
          rule: "string (reference to the violated rule)",
          affectedFields: ["string"]
        }
      },
      rule_9_2: {
        id: "rule_9_2",
        title: "Validation result summary",
        source: "AppDataModel.projects[].building.epb.validation",
        fields: {
          schemaValid: "boolean",
          referenceIntegrityValid: "boolean",
          semanticConstraintsValid: "boolean",
          issues: []
        },
        rule: "All three booleans must be true for validation to pass. If any is false, the issues array contains the corresponding errors."
      },
      rule_9_3: {
        id: "rule_9_3",
        title: "Processing state enum (shared across EPB, SRI, Calculation Engine)",
        enum: ["READY", "PROCESSING", "COMPLETED", "ERROR"],
        applicableTo: [
          "epb.transformation.status",
          "epb.orchestration.status",
          "calculation engine overall status"
        ],
        states: {
          READY: { label: "Ready", description: "Initial state. No processing has started or data is ready for next step.", color: "blue" },
          PROCESSING: { label: "Processing", description: "Operation is currently in progress.", color: "orange" },
          COMPLETED: { label: "Completed", description: "Operation finished successfully.", color: "green" },
          ERROR: { label: "Error", description: "Operation encountered an error and could not complete.", color: "red" }
        }
      },
      rule_9_4: {
        id: "rule_9_4",
        title: "Processing state for project status",
        source: "AppDataModel.ui.dashboardProjectVariants[].status",
          relatedStates: {
            ACTIVE: "Project is active and in normal operation.",
            IN_PROGRESS: "Building data entry has started.",
            CALCULATION_COMPLETED: "Calculation has finished."
          }
      },
      rule_9_5: {
        id: "rule_9_5",
        title: "Auth error states",
        errors: [
          { code: "AUTH_001", message: "Invalid email or password.", context: "Login page when credentials don't match." },
          { code: "AUTH_002", message: "Access denied. You do not have permission to view this page.", context: "When a user tries to access a page their role doesn't allow." },
          { code: "AUTH_003", message: "Session expired. Please log in again.", context: "When an authenticated session has timed out." }
        ]
      },
      rule_9_6: {
        id: "rule_9_6",
        title: "Membership / project error states",
        errors: [
          { code: "MEM_001", message: "User with email {email} does not exist.", context: "Add registered user by email — email not found in AppDataModel.users." },
          { code: "MEM_002", message: "User with email {email} is already part of this project.", context: "Add registered user by email — user is already a member." },
          { code: "MEM_003", message: "Cannot remove the only Project Owner.", context: "Remove member — attempting to remove the last PROJECT_OWNER." },
          { code: "MEM_004", message: "Please confirm you want to reject this membership request.", context: "Reject request — requires confirmation." },
          { code: "MEM_005", message: "Please confirm you want to remove this member.", context: "Remove member — requires confirmation." }
        ]
      },
      rule_9_7: {
        id: "rule_9_7",
        title: "Destructive action safeguard rules",
        rules: [
          { action: "archiveProject", requiresConfirmation: true, requiresAuditLog: true, allowedRoles: ["PROJECT_OWNER", "SITE_ADMIN"] },
          { action: "deleteProject", requiresConfirmation: true, requiresAuditLog: true, allowedRoles: ["PROJECT_OWNER", "SITE_ADMIN"], safeguard: "Backend must prevent deletion where policy or ownership disallows it." },
          { action: "rejectRequest", requiresConfirmation: true, allowedRoles: ["PROJECT_OWNER", "SITE_ADMIN"] },
          { action: "removeMember", requiresConfirmation: true, allowedRoles: ["PROJECT_OWNER", "SITE_ADMIN"], safeguard: "Cannot remove only PROJECT_OWNER." }
        ]
      },
      rule_9_8: {
        id: "rule_9_8",
        title: "Validation error handling in UI",
        pattern: "For each validation error type, the affected field should be highlighted in the UI form, and the error message should be displayed near the field.",
        source: "AppDataModel.projects[].building.epb.validation.issues[]"
      },
      rule_9_9: {
        id: "rule_9_9",
        title: "Calculation engine error states",
        errors: [
          { code: "CALC_001", message: "Missing required EPB data for calculation.", context: "epb.validation issues exist before running calculation." },
          { code: "CALC_002", message: "Missing required SRI data for calculation.", context: "SRI required domains are not fully configured." },
          { code: "CALC_003", message: "Calculation engine encountered an internal error.", context: "Engine runtime error during simulation." }
        ]
      }
    },

    dataShape: {
      errorStates: {
        validationIssue: {
          id: "string",
          type: "'SCHEMA' | 'REFERENCE_INTEGRITY' | 'SEMANTIC_CONSTRAINT'",
          severity: "'ERROR' | 'WARNING' | 'INFO'",
          message: "string",
          path: "string",
          rule: "string",
          affectedFields: ["string"]
        },
        processingState: "'READY' | 'PROCESSING' | 'COMPLETED' | 'ERROR'",
        authErrors: {},
        membershipErrors: {},
        calculationErrors: {},
        destructiveActionRules: {}
      }
    }
  }
};

// =============================================================================
// EXPORT (for Node.js / ES module environments)
// =============================================================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { OpenBEP4EU_DomainModel };
}

// Legacy global variable for browser environments (matching AppDataModel pattern)
if (typeof window !== 'undefined') {
  window.OpenBEP4EU_DomainModel = OpenBEP4EU_DomainModel;
}