var AppDataModel = {
  meta: {
    sourceDeliverable: "OpenBEP4EU-D2.2-vf.docx",
    deliverable: "D2.2 – Advanced EU Kernel EPC Engine",
    version: "1.0",
    versionDate: "2026-04-30"
  },

  calculationEngine: {
    name: "OpenBEP4EU Calculation Engine",
    inputRoutes: ["JSON", "IFC4 Add2 DTV"],
    workflow: [
      "dataImport",
      "dataValidation",
      "dataTransformation",
      "simulationCoreModules",
      "orchestration",
      "epcOutputAggregation"
    ],
    standardsCoverage: {
      envelope: ["EN ISO 6946", "EN ISO 13370", "EN ISO 13789"],
      climate: ["EN ISO 52010-1"],
      indoorOperation: ["EN 16798-1"],
      hourlyNeeds: ["EN ISO 52016-1"],
      systems: ["EN 15316 series", "ISO 52031", "EN ISO 52032-1"],
      aggregation: ["EN ISO 52000-1"]
    }
  },

  auth: {
    status: "AUTHENTICATED",
    currentUser: {
      id: "user-2",
      name: "Demo User",
      email: "demo.user@example.eu",
      accountRole: "Registered User",
      platformRole: "USER"
    }
  },

  users: [
    {
      id: "user-1",
      profile: {
        name: "Maria Owner",
        email: "maria.owner@example.eu"
      },
      memberships: [
        { projectId: "project-1", projectRole: "PROJECT_OWNER", status: "APPROVED", joinedAt: "2026-04-20" }
      ],
      permissions: ["CREATE_PROJECT", "MANAGE_OWN_PROJECT", "EDIT_ALL_PROJECT_BUILDINGS", "APPROVE_MEMBERS"]
    },
    {
      id: "user-2",
      profile: {
        name: "Demo User",
        email: "demo.user@example.eu"
      },
      memberships: [
        { projectId: "project-2", projectRole: "PROJECT_MEMBER", status: "APPROVED", joinedAt: "2026-04-24" },
        { projectId: "project-3", projectRole: "PROJECT_MEMBER", status: "PENDING", requestedAt: "2026-04-29" },
        { projectId: "project-4", projectRole: "PROJECT_MEMBER", status: "INVITED", invitedAt: "2026-04-28" }
      ],
      permissions: ["CREATE_PROJECT", "REQUEST_PROJECT_MEMBERSHIP", "EDIT_OWN_BUILDINGS"]
    },
    {
      id: "user-8",
      profile: {
        name: "Applicant User",
        email: "applicant.user@example.eu"
      },
      memberships: [],
      permissions: ["CREATE_PROJECT", "REQUEST_PROJECT_MEMBERSHIP", "EDIT_OWN_BUILDINGS"]
    }
  ],

  ui: {
    pages: [
      {
        id: "login",
        title: "Login",
        path: "view/login.html",
        access: "Guest",
        workflow: "authentication"
      },
      {
        id: "register",
        title: "Register account",
        path: "view/register.html",
        access: "Guest",
        workflow: "authentication",
        nextPage: "view/login.html"
      },
      {
        id: "user-profile",
        title: "User Profile",
        path: "view/user-profile.html",
        access: "Registered User, Project Member, Project Owner, Site Admin",
        workflow: "userProfile",
        purpose: "Allow authenticated users to edit their own account data using the same account fields as registration.",
        previousPage: "view/project-list.html",
        nextPages: ["view/project-list.html"],
        sourceOfTruth: "view/register.html",
        sections: ["accountIntro", "accountDetails", "accountAccessNote"],
        fields: ["name", "email", "password", "confirmPassword", "accountRole"],
        requiredFields: ["name", "email", "password", "confirmPassword"],
        actions: ["saveOwnAccount", "openProjectList"],
        safeguards: ["authenticatedUsersOnly", "editOwnAccountOnly", "emailMustBeValid", "passwordMinLength8", "passwordConfirmationMustMatch", "projectRolesManagedOutsideProfile"]
      },
      {
        id: "project-list",
        title: "Project List",
        path: "view/project-list.html",
        access: "Registered User, Project Member, Project Owner, Site Admin",
        workflow: "projectSelection",
        purpose: "Browse/select projects, open a project details popup from project click, create a project, request membership, and view membership/request status without opening member management from project click.",
        nextPage: "view/A-projects-dashboard.html",
        nextPages: ["view/create-project.html", "view/project-details.html", "view/A-projects-dashboard.html"],
        sections: ["projectSummaryCards", "projectSearchAndFilters", "projectTable", "projectDetailsPopup"],
        fields: ["projectId", "projectName", "shortDescription", "description", "ownerName", "organisationName", "country", "city", "address", "buildingCount", "projectStatus", "membershipStatus", "allowedActions"]
      },
      {
        id: "site-admin-console",
        title: "Site Admin Console",
        path: "view/site-admin-console.html",
        access: "Site Admin",
        workflow: "siteAdministration",
        purpose: "Minimal Site Admin page for selecting Project Owners, reviewing selected-owner details and owner projects, opening a project info popup, continuing as a selected owner, opening the normal Project List as Site Admin, and exiting selected-owner mode.",
        previousPage: "view/login.html",
        nextPages: ["view/project-list.html"],
        sourceOfTruth: "plan_for_app/userRoles.md",
        sections: ["adminModeBanner", "projectOwnersList", "selectedOwnerDetails", "ownerProjects", "ownerProjectDetailsPopup"],
        fields: ["ownerId", "ownerName", "ownerEmail", "organisationName", "ownedProjectCount", "projectId", "projectName", "shortDescription", "description", "country", "city", "address", "buildingCount", "projectStatus", "adminMode", "allowedActions"],
        actions: ["selectProjectOwner", "openOwnerProjectPopup", "continueAsSelectedOwner", "openProjectListAsSiteAdmin", "exitSelectedOwnerMode"],
        safeguards: ["siteAdminOnly", "showSelectedOwnerModeBanner", "showDirectAdminModeBanner", "reuseNormalProjectListAndDashboardFlows", "noDuplicateBroadAdminConsole"]
      },
      {
        id: "create-project",
        title: "Create Project",
        path: "view/create-project.html",
        access: "Registered User, Project Owner, Site Admin",
        workflow: "projectCreation",
        purpose: "Create a new project and assign the creator as Project Owner.",
        previousPage: "view/project-list.html",
        nextPage: "view/A-projects-dashboard.html",
        fields: ["projectName", "shortDescription", "description", "country", "city", "address", "organisationName"]
      },
      {
        id: "project-details",
        title: "Project Details",
        path: "view/project-details.html",
        access: "Registered User, Project Member, Project Owner, Site Admin",
        workflow: "projectMembership",
        purpose: "Show project summary, membership status, and request/open actions before dashboard access.",
        previousPage: "view/project-list.html",
        nextPages: ["view/project-list.html", "view/A-projects-dashboard.html", "view/pending-membership.html"],
        fields: ["projectId", "projectName", "description", "ownerName", "country", "city", "address", "buildingCount", "membershipStatus", "allowedActions"]
      },
      {
        id: "project-users",
        title: "Project Users",
        path: "view/project-users.html",
        access: "Project Owner, Site Admin",
        workflow: "projectUserManagement",
        purpose: "Manage current members, add existing registered users by email, approve or disapprove membership requests, and remove members for a selected project.",
        previousPage: "view/project-list.html",
        nextPages: ["view/project-list.html", "view/A-projects-dashboard.html"],
        sections: ["projectSummary", "managementRules", "userSummary", "addRegisteredUser", "currentMembers", "pendingMembershipRequests"],
        fields: ["projectId", "projectName", "ownerName", "organisationName", "country", "city", "buildingCount", "members", "membershipRequests", "registeredUserEmail", "userLookupResult", "userLookupError", "allowedActions"],
        actions: ["addRegisteredUser", "approveRequest", "rejectRequest", "removeMember", "backToProjectList", "openDashboard"],
        safeguards: ["userEmailMustExist", "userMustNotAlreadyBeProjectMember", "doNotRemoveOnlyProjectOwner", "confirmRemoveMember", "confirmRejectRequest", "ownerOrSiteAdminOnly"]
      },
      {
        id: "project-settings",
        title: "My Projects / Project Settings",
        path: "view/project-settings.html",
        access: "Project Member, Project Owner, Site Admin",
        workflow: "projectSettings",
        purpose: "Show project metadata and allow project settings edit/archive/delete actions where the role allows it. Project Members can view read-only and only continue to the dashboard.",
        previousPage: "view/project-list.html",
        nextPages: ["view/project-list.html", "view/A-projects-dashboard.html", "view/project-users.html"],
        sections: ["projectSummary", "permissionBanner", "projectMetadata", "allowedActions", "dangerZone"],
        fields: ["projectId", "projectName", "shortDescription", "description", "ownerName", "organisationName", "country", "city", "address", "buildingCount", "members", "status", "visibility", "lastModified", "allowedActions"],
        actions: ["viewProjectSettings", "openDashboard", "backToProjectList", "saveProjectSettings", "archiveProject", "deleteProject"],
        safeguards: ["memberReadOnly", "ownerOrSiteAdminCanEdit", "confirmArchiveProject", "confirmDeleteProject", "auditDestructiveActions"]
      }
    ],
    selectOptions: {
      countries: ["Greece", "Italy", "Spain", "Portugal"],
      buildingTypes: ["Residential", "Non-Residential", "Offices", "Healthcare"],
      monthNames: [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ]
    },
    dashboardProjectVariants: [
      { id: "project-2", lastModified: "2026-04-28", name: "Harbor Residences", country: "Greece", address: "Messinias 21, Athens 15234", type: "Residential", status: "IN_PROGRESS", score: 62, scoreClass: "C" },
      { id: "project-3", lastModified: "2026-04-27", name: "Metro Plaza", country: "Greece", address: "Kifisias 120, Marousi 15125", type: "Retail", status: "MISSING_DATA", score: 48, scoreClass: "D" },
      { id: "project-4", lastModified: "2026-04-26", name: "Innovation Campus", country: "Italy", address: "Via Roma 45, Milan 20121", type: "Non-Residential", status: "READY_FOR_CALCULATION", score: 0, scoreClass: "-" },
      { id: "project-5", lastModified: "2026-04-25", name: "Green Port Offices", country: "Spain", address: "Calle Mayor 8, Madrid 28013", type: "Offices", status: "CALCULATION_COMPLETED", score: 79, scoreClass: "B" },
      { id: "project-6", lastModified: "2026-04-24", name: "City Health Center", country: "Portugal", address: "Avenida da Liberdade 32, Lisbon 1250-145", type: "Healthcare", status: "PROCESSING", score: 55, scoreClass: "C" }
    ],
    projectList: [
      { id: "project-1", name: "Demo Building Project", shortDescription: "Owned project with full building workflow access.", ownerId: "user-1", ownerName: "Maria Owner", organisationName: "OpenBEP Demo Organisation", country: "Greece", city: "Athens", address: "Athens", buildingCount: 1, membershipStatus: "OWNER", description: "Owned project with full building workflow access." },
      { id: "project-2", name: "Harbor Residences", shortDescription: "Approved member access; dashboard can be opened.", ownerId: "user-3", ownerName: "Nikos Papadakis", organisationName: "Harbor Residences Consortium", country: "Greece", city: "Athens", address: "Messinias 21, Athens 15234", buildingCount: 8, membershipStatus: "APPROVED", description: "Residential project where the current user is already an approved member." },
      { id: "project-3", name: "Metro Plaza", shortDescription: "Membership request is waiting for owner approval.", ownerId: "user-4", ownerName: "Elena Rossi", organisationName: "Metro Plaza Management", country: "Greece", city: "Marousi", address: "Kifisias 120, Marousi 15125", buildingCount: 4, membershipStatus: "PENDING", description: "Retail project with a pending membership request from the current user." },
      { id: "project-4", name: "Innovation Campus", shortDescription: "Owner invitation is ready to accept.", ownerId: "user-5", ownerName: "Luca Bianchi", organisationName: "Innovation Campus Partners", country: "Italy", city: "Milan", address: "Via Roma 45, Milan 20121", buildingCount: 12, membershipStatus: "INVITED", description: "Campus project where the current user has an open invitation." },
      { id: "project-5", name: "Green Port Offices", shortDescription: "Public project summary; request membership to access buildings.", ownerId: "user-6", ownerName: "Sofia Garcia", organisationName: "Green Port Offices SA", country: "Spain", city: "Madrid", address: "Calle Mayor 8, Madrid 28013", buildingCount: 6, membershipStatus: "NONE", description: "Office project available for membership request." },
      { id: "project-6", name: "City Health Center", shortDescription: "Healthcare project available for membership request.", ownerId: "user-7", ownerName: "Ana Silva", organisationName: "City Health Network", country: "Portugal", city: "Lisbon", address: "Avenida da Liberdade 32, Lisbon 1250-145", buildingCount: 3, membershipStatus: "NONE", description: "Healthcare project available for membership request." }
    ],
    projectWorkflow: {
      listPage: {
        pageId: "project-list",
        path: "view/project-list.html",
        purpose: "Browse projects, filter by membership/access state, create a project, open a project details popup from the project row/name, open an approved dashboard, or request membership. Project click must not open member management.",
        fields: ["projectId", "projectName", "shortDescription", "description", "ownerName", "organisationName", "country", "city", "address", "buildingCount", "membershipStatus", "allowedActions"],
        popup: {
          component: "modal",
          opensFrom: ["projectName", "pendingAction", "invitedAction", "requestMembershipAction"],
          fields: ["projectId", "projectName", "description", "ownerName", "organisationName", "country", "city", "address", "buildingCount", "membershipStatus"],
          excludedActions: ["manageProjectUsers"]
        },
        actions: ["createProject", "openDashboard", "openProjectDetailsPopup", "acceptInvitation", "viewPendingRequest", "requestMembership", "manageProjectUsers", "openProjectSettings"]
      },
      createPage: {
        pageId: "create-project",
        path: "view/create-project.html",
        purpose: "Collect minimum project metadata, create the project, and make the creator Project Owner.",
        fields: ["projectName", "shortDescription", "description", "country", "city", "address", "organisationName"],
        requiredFields: ["projectName", "country"],
        defaults: {
          buildingCount: 0,
          membershipStatusForCreator: "OWNER",
          creatorProjectRole: "PROJECT_OWNER"
        },
        result: {
          addTo: ["AppDataModel.projects", "AppDataModel.ui.projectList", "AppDataModel.users[].memberships"],
          nextPage: "view/A-projects-dashboard.html"
        }
      },
      detailsPage: {
        pageId: "project-details",
        path: "view/project-details.html",
        purpose: "Show project summary and membership state before dashboard access.",
        fields: ["projectId", "projectName", "description", "ownerName", "country", "city", "address", "buildingCount", "membershipStatus", "allowedActions", "members", "membershipRequests"],
        actions: ["backToProjectList", "requestMembership", "openDashboard", "acceptInvitation", "viewPendingRequest"]
      },
      usersPage: {
        pageId: "project-users",
        path: "view/project-users.html",
        purpose: "Owner and Site Admin page for project members, adding existing registered users by email, pending membership requests, approvals, disapprovals, and member removal.",
        access: "Project Owner, Site Admin",
        previousPage: "view/project-list.html",
        nextPages: ["view/project-list.html", "view/A-projects-dashboard.html"],
        sections: {
          projectSummary: {
            title: "Selected project summary",
            fields: ["projectName", "ownerName", "organisationName", "country", "city", "buildingCount"]
          },
          userSummary: {
            title: "Project user summary cards",
            fields: ["approvedMemberCount", "projectOwnerCount", "pendingRequestCount", "openInvitationCount"]
          },
          addRegisteredUser: {
            title: "Add registered user by email",
            fields: ["registeredUserEmail", "userLookupResult", "userLookupError"],
            requiredFields: ["registeredUserEmail"],
            assignedProjectRole: "PROJECT_MEMBER",
            result: "If the email exists in AppDataModel.users and is not already a member, add the user directly as an APPROVED project member. Otherwise show an error."
          },
          currentMembers: {
            title: "Current members",
            source: "AppDataModel.projects[].members",
            fields: ["userId", "name", "email", "projectRole", "status", "joinedAt"],
            rowActions: ["removeMember"]
          },
          pendingMembershipRequests: {
            title: "Pending membership requests",
            source: "AppDataModel.projects[].membershipRequests",
            fields: ["id", "userId", "userName", "email", "message", "status", "requestedAt", "reviewedAt", "reviewedBy"],
            rowActions: ["approveRequest", "rejectRequest"]
          }
        },
        fields: ["projectId", "projectName", "ownerName", "organisationName", "country", "city", "buildingCount", "members", "membershipRequests", "registeredUserEmail", "userLookupResult", "userLookupError", "allowedActions"],
        actions: ["addRegisteredUser", "approveRequest", "rejectRequest", "removeMember", "backToProjectList", "openDashboard"],
        actionRules: {
          addRegisteredUser: {
            allowedFor: ["PROJECT_OWNER", "SITE_ADMIN_SELECTED_OWNER", "SITE_ADMIN_DIRECT"],
            lookup: "AppDataModel.users[] by profile.email",
            errorIfMissing: "User with email {email} does not exist.",
            errorIfAlreadyMember: "User with email {email} is already part of this project.",
            creates: ["AppDataModel.projects[].members[]", "AppDataModel.users[].memberships[]"],
            newProjectRole: "PROJECT_MEMBER",
            defaultStatus: "APPROVED"
          },
          approveRequest: {
            allowedFor: ["PROJECT_OWNER", "SITE_ADMIN_SELECTED_OWNER", "SITE_ADMIN_DIRECT"],
            updates: ["AppDataModel.projects[].membershipRequests[].status", "AppDataModel.projects[].members[]", "AppDataModel.users[].memberships[]"],
            fromStatus: "PENDING",
            toStatus: "APPROVED",
            newProjectRole: "PROJECT_MEMBER"
          },
          rejectRequest: {
            allowedFor: ["PROJECT_OWNER", "SITE_ADMIN_SELECTED_OWNER", "SITE_ADMIN_DIRECT"],
            updates: ["AppDataModel.projects[].membershipRequests[].status"],
            fromStatus: "PENDING",
            toStatus: "DISAPPROVED",
            requiresConfirmation: true
          },
          removeMember: {
            allowedFor: ["PROJECT_OWNER", "SITE_ADMIN_SELECTED_OWNER", "SITE_ADMIN_DIRECT"],
            updates: ["AppDataModel.projects[].members[]", "AppDataModel.users[].memberships[].status", "AppDataModel.ui.projectList[].membershipStatus"],
            toStatus: "REMOVED",
            projectListStatusAfterRemoval: "NONE",
            requiresConfirmation: true,
            safeguard: "Cannot remove the only PROJECT_OWNER from a project."
          }
        },
        safeguards: ["userEmailMustExist", "userMustNotAlreadyBeProjectMember", "doNotRemoveOnlyProjectOwner", "confirmRemoveMember", "confirmRejectRequest", "ownerOrSiteAdminOnly"]
      },
      settingsPage: {
        pageId: "project-settings",
        path: "view/project-settings.html",
        purpose: "Project-scoped settings page for selected project metadata, read-only member context, and owner/admin edit/archive/delete actions where allowed.",
        access: "Project Member, Project Owner, Site Admin",
        previousPage: "view/project-list.html",
        nextPages: ["view/project-list.html", "view/A-projects-dashboard.html", "view/project-users.html"],
        sections: {
          permissionBanner: {
            title: "Role-aware permission state",
            fields: ["currentProjectRole", "platformRole", "canEditProjectSettings", "canArchiveProject", "canDeleteProject"]
          },
          projectSummary: {
            title: "Selected project summary cards",
            fields: ["buildingCount", "approvedMemberCount", "projectStatus", "currentAccess"]
          },
          projectMetadata: {
            title: "Project metadata form",
            fields: ["projectName", "shortDescription", "description", "organisationName", "country", "city", "address", "status", "visibility"],
            readOnlyFor: ["PROJECT_MEMBER"]
          },
          allowedActions: {
            title: "Allowed actions by role",
            roleRules: {
              PROJECT_MEMBER: ["viewProjectSettings", "openDashboard"],
              PROJECT_OWNER: ["viewProjectSettings", "saveProjectSettings", "archiveProject", "deleteProject", "openDashboard", "backToProjectList"],
              SITE_ADMIN_SELECTED_OWNER: ["viewProjectSettings", "saveProjectSettings", "archiveProject", "deleteProject", "openDashboard", "backToProjectList"],
              SITE_ADMIN_DIRECT: ["viewProjectSettings", "saveProjectSettings", "archiveProject", "deleteProject", "openDashboard", "backToProjectList"]
            }
          },
          dangerZone: {
            title: "Archive/delete project actions",
            actions: ["archiveProject", "deleteProject"],
            requiresConfirmation: true,
            requiresAuditLog: true
          }
        },
        fields: ["projectId", "projectName", "shortDescription", "description", "ownerName", "organisationName", "country", "city", "address", "buildingCount", "members", "status", "visibility", "lastModified", "allowedActions"],
        actions: ["viewProjectSettings", "openDashboard", "backToProjectList", "saveProjectSettings", "archiveProject", "deleteProject"],
        actionRules: {
          viewProjectSettings: {
            allowedFor: ["PROJECT_MEMBER", "PROJECT_OWNER", "SITE_ADMIN_SELECTED_OWNER", "SITE_ADMIN_DIRECT"],
            behavior: "Project Members see project metadata read-only; Project Owners and Site Admins see editable controls."
          },
          saveProjectSettings: {
            allowedFor: ["PROJECT_OWNER", "SITE_ADMIN_SELECTED_OWNER", "SITE_ADMIN_DIRECT"],
            updates: ["AppDataModel.projects[]", "AppDataModel.ui.projectList[]"],
            deniedFor: ["PROJECT_MEMBER", "Registered User", "Guest"]
          },
          archiveProject: {
            allowedFor: ["PROJECT_OWNER", "SITE_ADMIN_SELECTED_OWNER", "SITE_ADMIN_DIRECT"],
            updates: ["AppDataModel.projects[].status", "AppDataModel.ui.projectList[].status"],
            toStatus: "ARCHIVED",
            requiresConfirmation: true,
            requiresAuditLog: true
          },
          deleteProject: {
            allowedFor: ["PROJECT_OWNER", "SITE_ADMIN_SELECTED_OWNER", "SITE_ADMIN_DIRECT"],
            updates: ["AppDataModel.projects[]", "AppDataModel.ui.projectList[]"],
            requiresConfirmation: true,
            requiresAuditLog: true,
            safeguard: "Backend must prevent deleting projects where policy, ownership, or retained records disallow deletion."
          },
          openDashboard: {
            allowedFor: ["PROJECT_MEMBER", "PROJECT_OWNER", "SITE_ADMIN_SELECTED_OWNER", "SITE_ADMIN_DIRECT"],
            nextPage: "view/A-projects-dashboard.html"
          }
        },
        safeguards: ["memberReadOnly", "ownerOrSiteAdminCanEdit", "confirmArchiveProject", "confirmDeleteProject", "auditDestructiveActions"]
      },
      membershipStatuses: ["OWNER", "APPROVED", "PENDING", "INVITED", "DISAPPROVED", "REMOVED", "NONE"],
      allowedActionsByStatus: {
        OWNER: ["openDashboard", "manageProjectUsers", "editProjectSettings", "archiveProject", "deleteProject"],
        APPROVED: ["openDashboard", "viewProjectSettings", "createBuilding", "editOwnBuildings"],
        PENDING: ["viewPendingRequest", "backToProjectList"],
        INVITED: ["acceptInvitation", "declineInvitation", "backToProjectList"],
        DISAPPROVED: ["backToProjectList", "openProjectDetails"],
        REMOVED: ["backToProjectList", "openProjectDetails", "requestMembership"],
        NONE: ["openProjectDetails", "requestMembership", "backToProjectList"]
      }
    },
    projectUserManagement: {
      pageId: "project-users",
      path: "view/project-users.html",
      routeParam: "project",
      selectedProjectSource: "AppDataModel.projects[].id",
      displaySources: {
        projectSummary: "AppDataModel.projects[]",
        currentMembers: "AppDataModel.projects[].members",
        membershipRequests: "AppDataModel.projects[].membershipRequests",
        registeredUsers: "AppDataModel.users"
      },
      roleAccess: {
        allowedProjectRoles: ["PROJECT_OWNER"],
        allowedPlatformRoles: ["SITE_ADMIN"],
        deniedRoles: ["Guest", "Registered User", "Project Member"]
      },
      memberFields: ["userId", "name", "email", "projectRole", "status", "joinedAt", "removedAt", "removedBy"],
      addRegisteredUserFields: ["registeredUserEmail", "userLookupResult", "userLookupError"],
      membershipRequestFields: ["id", "projectId", "userId", "userName", "email", "message", "status", "requestedAt", "reviewedAt", "reviewedBy"],
      summaryCounters: {
        approvedMemberCount: "members where status APPROVED",
        projectOwnerCount: "members where projectRole PROJECT_OWNER and status APPROVED",
        pendingRequestCount: "membershipRequests where status PENDING",
        registeredUserCount: "AppDataModel.users length"
      }
    },
    projectSettings: {
      pageId: "project-settings",
      path: "view/project-settings.html",
      routeParam: "project",
      selectedProjectSource: "AppDataModel.projects[].id",
      displaySources: {
        projectSummary: "AppDataModel.projects[]",
        projectListStatus: "AppDataModel.ui.projectList[]",
        currentMembers: "AppDataModel.projects[].members"
      },
      roleAccess: {
        readOnlyProjectRoles: ["PROJECT_MEMBER"],
        editableProjectRoles: ["PROJECT_OWNER"],
        editablePlatformRoles: ["SITE_ADMIN"],
        deniedRoles: ["Guest", "Registered User"]
      },
      metadataFields: ["projectName", "shortDescription", "description", "organisationName", "country", "city", "address", "status", "visibility"],
      summaryCounters: {
        buildingCount: "project.buildingCount",
        approvedMemberCount: "members where status APPROVED",
        projectStatus: "project.status",
        currentAccess: "project membership or Site Admin context"
      },
      memberRule: "Project Members can view project settings for approved projects but can only use the Open Dashboard navigation action from this page.",
      ownerAdminRule: "Project Owners and Site Admins can save settings and use archive/delete actions where allowed, with confirmation and audit logging for destructive actions."
    }
  },

  projects: [
    {
      id: "project-1",
      name: "Demo Building Project",
      shortDescription: "Owned project with full building workflow access.",
      description: "Demo project used to show the connected project list, details, dashboard, building, EPB, and SRI workflows.",
      ownerId: "user-1",
      ownerName: "Maria Owner",
      organisationName: "OpenBEP Demo Organisation",
      country: "Greece",
      city: "Athens",
      address: "Athens",
      buildingCount: 1,
      createdAt: "2026-04-20",
      lastModified: "2026-04-29",

      members: [
        {
          userId: "user-1",
          name: "Maria Owner",
          email: "maria.owner@example.eu",
          projectRole: "PROJECT_OWNER",
          status: "APPROVED",
          joinedAt: "2026-04-20"
        },
        {
          userId: "user-2",
          name: "Demo User",
          email: "demo.user@example.eu",
          projectRole: "PROJECT_MEMBER",
          status: "APPROVED",
          joinedAt: "2026-04-24",
          removedAt: null,
          removedBy: null
        }
      ],

      membershipRequests: [
        {
          id: "request-1",
          projectId: "project-1",
          userId: "user-8",
          userName: "Applicant User",
          email: "applicant.user@example.eu",
          message: "I would like to join this project to work on building assessments.",
          status: "PENDING",
          requestedAt: "2026-04-29",
          reviewedAt: null,
          reviewedBy: null,
          decisionNote: null
        }
      ],

      invitations: [
        {
          id: "invite-1",
          projectId: "project-1",
          email: "new.member@example.eu",
          projectRole: "PROJECT_MEMBER",
          message: "Please join this OpenBEP project workspace.",
          status: "INVITED",
          invitedAt: "2026-04-28",
          invitedBy: "user-1"
        }
      ],

      building: {
        id: "building-1",
        name: "Office Athens",
        northAxis: 180,

        general: {
          type: "Non-Residential",
          usage: "Offices",
          country: "Greece",
          climateZone: "Mediterranean",
          timeZone: "Europe/Athens",
          floorArea: "1000-10000",
          buildingState: "Renovated",
          year: 2015,
          address: "Athens",
          location: {
            lat: 37.98,
            lng: 23.72,
            elevation: 100
          }
        },

        // =====================
        // EPB
        // =====================
        epb: {
          provenance: {
            sourceType: "JSON",
            sourceFile: "openbep4eu-json-instance",
            ifcImport: {
              enabled: false,
              ifcSchema: "IFC4 Add2 DTV",
              idsValidated: false
            }
          },

          validation: {
            schemaValid: true,
            referenceIntegrityValid: true,
            semanticConstraintsValid: true,
            issues: []
          },

          transformation: {
            helpersApplied: [
              "envelopeInputMapper",
              "climateInputMapper",
              "zoneAndSpaceMapper",
              "systemsInputMapper"
            ],
            status: "READY"
          },

          settings: {
            // Legacy shape used by existing views
            runPeriod: { start: "01-01", end: "12-31" },

            // UI-EPB v4 aligned shape
            runPeriodDetailed: {
              beginMonth: 1,
              beginDayOfMonth: 1,
              endMonth: 12,
              endDayOfMonth: 31
            },
            timestep: 1,
            timeStep: {
              numberPerHour: 1
            },

            // Tab 1: Climate Data Calculation Properties
            groundTemperatureCalculationProperties: [
              {
                id: "gtcp-1",
                name: "Default Ground Profile",
                externalWallsThickness: 0.3,
                exposedPerimeter: 120,
                annualMeanInternalTemperature: 21,
                amplitudeOfInternalTemperatureVariations: 3,
                minExternalTemperatureMonth: 1,
                linearThermalTransmittance: 0.25,
                // Compatibility alias kept for requested JSON spelling variant
                linearThermalTrasmittance: 0.25,
                conductivity: 1.8,
                heatCapacity: 2.1
              }
            ]
          },

          library: {
            // Legacy bucket used by current EPB views
            materials: [
              {
                id: "mat1",
                name: "Concrete",
                thickness: 0.2,
                conductivity: 1.4,
                density: 2400,
                specificHeat: 880
              }
            ],

            // UI-EPB aligned materials schema
            materialOpaque: [
              {
                id: "mat1",
                roughness: "MediumRough",
                thickness: 0.2,
                conductivity: 1.4,
                density: 2400,
                specificHeat: 880
              }
            ],

            // UI-EPB aligned glazing schema
            glazingSimpleSystem: [
              {
                id: "glz1",
                uFactor: 1.6,
                solarHeatGainCoefficient: 0.45,
                visibleTransmittance: 0.6
              }
            ],

            // UI-EPB aligned construction schema
            construction: [
              {
                id: "cons1",
                constructionClass: "MassEquallyDistributed",
                outsideLayerMaterialId: "mat1",
                layerMaterialIds: ["mat1"]
              }
            ],

            // UI-EPB aligned schedule schema
            scheduleConstant: [
              {
                id: "sch-occ-1",
                type: "Occupancy",
                hourlyValue: 1
              },
              {
                id: "sch-act-1",
                type: "Activity",
                hourlyValue: 120
              },
              {
                id: "sch-cool-sp-1",
                type: "CoolingSetpoint",
                hourlyValue: 26
              },
              {
                id: "sch-vent-1",
                type: "Ventilation",
                hourlyValue: 1
              }
            ],

            // UI-EPB aligned controls schema
            thermostat: [
              {
                id: "th-1",
                constantHeatingSetpoint: 21,
                coolingSetpointSchedule: "sch-cool-sp-1"
              }
            ],
            humidistat: [
              {
                id: "hum-1",
                constantDehumidificationSetpoint: 60,
                constantHumidificationSetpoint: 35
              }
            ],

            glazing: [],
            constructions: [],
            thermostats: [],
            humidistats: [],
            schedules: []
          },

          zones: [
            {
              id: "zone1",
              name: "Main Zone",
              volume: 300,
              floorArea: 100,

              spaces: [
                {
                  id: "space1",
                  name: "Office Room",
                  people: 5,

                  gains: {
                    people: {
                      activityLevel: 120,
                      radiant: 0.5
                    },
                    equipment: {
                      power: 500,
                      radiant: 0.3
                    }
                  }
                }
              ],

              // UI-EPB aligned gains entities
              thermalZonePeopleGains: {
                id: "tzpg-1",
                numberOfPeopleSchedule: "sch-occ-1",
                numberOfPeopleCalculationMethod: "people",
                numberOfPeople: 5,
                activityLevelSchedule: "sch-act-1",
                fractionRadiant: 0.5
              },

              thermalZoneEquipmentGains: {
                id: "tzeg-1",
                fuelType: "Electricity",
                schedule: "sch-occ-1",
                designLevelCalculationMethod: "EquipmentLevel",
                designLevel: 500,
                fractionLatent: 0,
                fractionRadiant: 0.3,
                fractionLost: 0
              },

              ventilation: {
                airChangesPerHour: 1.5
              },

              thermalZoneVentilationDesignFlowRate: {
                id: "tzv-1",
                calculationMethod: "AirChangesPerHour",
                airChangesPerHour: 1.5,
                scheduleId: "sch-vent-1"
              },

              needsSystem: {
                heating: 5000,
                cooling: 4000
              },

              thermalZoneNeedsSystem: {
                id: "tzns-1",
                maxHeatingPower: 5000,
                maxCoolingPower: 4000,
                thermostatId: "th-1",
                humidistatId: "hum-1"
              },

              surfaces: [
                {
                  id: "wall1",
                  type: "wall",
                  surfaceType: "Wall",
                  constructionId: "cons1",
                  outsideBoundaryCondition: "Outdoors",
                  area: 50,
                  height: 3,
                  azimuth: 90,
                  azimuth_angle: 90,
                  tilt: 90,
                  tilt_angle: 90,
                  groundTemperatureCalculationPropertiesId: "gtcp-1",

                  subsurfaces: [
                    {
                      id: "window1",
                      type: "window",
                      surfaceType: "Window",
                      constructionId: "glz1",
                      area: 10,
                      height: 1.5,
                      azimuth_angle: 90,
                      tilt_angle: 90
                    }
                  ]
                }
              ],

              // Tab 4 explicit spaces list + zone link
              spacesDetailed: [
                {
                  id: "space1",
                  thermalZoneId: "zone1",
                  volume: 300,
                  floorArea: 100
                }
              ]
            }
          ]
          ,

          orchestration: {
            executionOrder: [
              "import",
              "validation",
              "transformation",
              "hourlyNeeds",
              "systems",
              "aggregation"
            ],
            status: "CALCULATION_COMPLETED"
          },

          epcIndicators: {
            finalEnergyByCarrier: {
              electricity_kWh: 12000,
              naturalGas_kWh: 8400
            },
            primaryEnergy_kWh: 24600,
            operationalGHG_kgCO2eq: 5100,
            onsiteRenewablesShare_percent: 18
          }
        },

        // =====================
        // SRI
        // =====================
        sri: {
          // Preferred Service Catalogue (UI-SRI: Method A / Method B)
          method: "A",

          // Preferred weightings selector (UI-SRI)
          // true => Default, false => User-defined
          hasDefaultWeightings: true,

          // Assessment context for mandatory weighting behavior
          // If region is NON_EU, UI should force hasDefaultWeightings=false
          jurisdiction: {
            region: "EU",
            country: "Greece"
          },

          // Assessment date (UI-SRI)
          assessmentDate: "2026-04-29",

          domainsPresence: {
            // 1: present, 2: absent but mandatory, 0: absent and not mandatory
            heating: 1,
            cooling: 1,
            dhw: 1,
            ventilation: 1,
            lighting: 1,
            envelope: 1,
            electricity: 1,
            ev: 0,
            monitoring: 1
          },

          weighting: {
            // Level 1: Impact weighting (%)
            impacts: {
              energyEfficiency: 20,
              maintenance: 10,
              comfort: 15,
              convenience: 15,
              health: 10,
              info: 10,
              flexibility: 20
            },

            // Legacy field kept for backward compatibility with existing views
            domainImpact: {
              heating: 20,
              cooling: 10,
              lighting: 10
            },

            // Level 2: Domain weighting per impact category (%)
            // Each impact sub-object should sum to 100 in UI validation.
            domainWeightingsByImpact: {
              energyEfficiency: {
                heating: 20,
                dhw: 10,
                cooling: 15,
                ventilation: 10,
                lighting: 10,
                envelope: 10,
                electricity: 10,
                ev: 5,
                monitoring: 10
              },
              maintenance: {
                heating: 15,
                dhw: 10,
                cooling: 15,
                ventilation: 10,
                lighting: 10,
                envelope: 10,
                electricity: 10,
                ev: 10,
                monitoring: 10
              },
              comfort: {
                heating: 20,
                dhw: 10,
                cooling: 20,
                ventilation: 15,
                lighting: 10,
                envelope: 10,
                electricity: 5,
                ev: 0,
                monitoring: 10
              },
              convenience: {
                heating: 15,
                dhw: 10,
                cooling: 15,
                ventilation: 10,
                lighting: 15,
                envelope: 10,
                electricity: 10,
                ev: 5,
                monitoring: 10
              },
              health: {
                heating: 15,
                dhw: 10,
                cooling: 15,
                ventilation: 20,
                lighting: 15,
                envelope: 10,
                electricity: 5,
                ev: 0,
                monitoring: 10
              },
              info: {
                heating: 10,
                dhw: 10,
                cooling: 10,
                ventilation: 10,
                lighting: 10,
                envelope: 10,
                electricity: 10,
                ev: 10,
                monitoring: 20
              },
              flexibility: {
                heating: 15,
                dhw: 10,
                cooling: 10,
                ventilation: 10,
                lighting: 10,
                envelope: 10,
                electricity: 15,
                ev: 10,
                monitoring: 10
              }
            }
          },

          // Method-specific service catalogues (for UI completeness checks)
          serviceCatalogues: {
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

          services: {
            heating: [
              {
                id: "H1a",
                applicable: true,

                // UI-SRI: "Affect Maximum Obtainable Score?" (JSON Triage)
                triage: true,

                // Backward-compatible single-value fields
                level: 2,

                // Total compliance share for selected level(s), normalized 0..1
                compliance: 1,

                // UI-SRI compliant multi-row level-compliance representation
                entries: [
                  { level: 2, compliance: 1 }
                ]
              }
            ],

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
            totalScore: 75,
            class: "B",

            impacts: {
              energyEfficiency: 70,
              comfort: 80
            },

            domains: {
              heating: 80,
              cooling: 70
            }
          }
        }
      }
    }
  ]
};