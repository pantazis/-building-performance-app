Login: ./view/login.html
Description: Sign-in page where a user enters the prototype before reaching the project dashboard.
Data model: Not defined in `data_model/sri_epb_ui_data_model_v2.js`.

Projects Dashboard (A): ./view/A-projects-dashboard.html
Description: Main project overview page. It shows the user's buildings/projects, including a dropdown for projects where the user is a member, and provides actions to add a new building, open/edit an existing building, duplicate a building, delete a building, change language, or open the user profile.
Data model: `AppDataModel.ui.dashboardProjectVariants`, `AppDataModel.projects`, `AppDataModel.auth.currentUser`, `AppDataModel.users[0].memberships`, `AppDataModel.projects[0].building.general`, `AppDataModel.projects[0].building.epb.orchestration.status`, `AppDataModel.projects[0].building.epb.epcIndicators`, `AppDataModel.projects[0].building.sri.results`.

Add New Building (B): ./view/B-add-new-building.html
Description: Page for creating a new building/project record. It collects the initial building information before the user continues to the building edit/workflow area.
Data model: `AppDataModel.ui.selectOptions.countries`, `AppDataModel.ui.selectOptions.buildingTypes`, `AppDataModel.projects[0].building.general`.

Open / Edit Building (C): ./view/C-open-edit-building.html
Description: Building detail page for reviewing and editing an existing building. From here the user can continue into EPB workflows, SRI workflows, or calculation-related actions.
Data model: `AppDataModel.projects[0]`, `AppDataModel.projects[0].building`, `AppDataModel.projects[0].building.general`, `AppDataModel.projects[0].building.epb`, `AppDataModel.projects[0].building.sri`.

EPB View 1 (Calculation Settings): ./view/EPB1-calculation-settings.html
Description: First EPB setup page where the user configures calculation settings and key energy-performance assumptions.
Data model: `AppDataModel.projects[0].building.epb.settings`, `AppDataModel.projects[0].building.epb.provenance`, `AppDataModel.projects[0].building.epb.validation`, `AppDataModel.projects[0].building.epb.transformation`.

EPB View 1b (Climate Data): ./view/EPB1b-ground-temperature.html
Description: EPB climate input page for climate and ground-temperature data used by the energy-performance calculation.
Data model: `AppDataModel.projects[0].building.general.climateZone`, `AppDataModel.projects[0].building.general.location`, `AppDataModel.projects[0].building.epb.settings.groundTemperatureCalculationProperties`.

EPB View 2 (Building Envelope): ./view/EPB2-materials-constructions.html
Description: EPB building envelope page for defining materials, constructions, and fabric-related performance data.
Data model: `AppDataModel.projects[0].building.epb.library.materials`, `AppDataModel.projects[0].building.epb.library.materialOpaque`, `AppDataModel.projects[0].building.epb.library.glazingSimpleSystem`, `AppDataModel.projects[0].building.epb.library.construction`, `AppDataModel.projects[0].building.epb.zones[0].surfaces`.

EPB View 3 (Thermal Zone): ./view/EPB3-thermal-zones-envelope.html
Description: EPB thermal-zone page for defining zones and connecting envelope information to those zones.
Data model: `AppDataModel.projects[0].building.epb.zones`, `AppDataModel.projects[0].building.epb.zones[0].thermalZonePeopleGains`, `AppDataModel.projects[0].building.epb.zones[0].thermalZoneEquipmentGains`, `AppDataModel.projects[0].building.epb.zones[0].thermalZoneVentilationDesignFlowRate`, `AppDataModel.projects[0].building.epb.zones[0].thermalZoneNeedsSystem`.

EPB Spaces Tab: ./view/EPB-spaces-tab.html
Description: EPB page for reviewing or editing building spaces that support the energy-performance workflow.
Data model: `AppDataModel.projects[0].building.epb.zones[0].spaces`, `AppDataModel.projects[0].building.epb.zones[0].spacesDetailed`.

EPB Operations Tab: ./view/EPB-operations-tab.html
Description: EPB page for operational inputs such as usage assumptions, schedules, and operation-related settings.
Data model: `AppDataModel.projects[0].building.epb.library.scheduleConstant`, `AppDataModel.projects[0].building.epb.library.thermostat`, `AppDataModel.projects[0].building.epb.library.humidistat`, `AppDataModel.projects[0].building.epb.zones[0].thermalZonePeopleGains`, `AppDataModel.projects[0].building.epb.zones[0].thermalZoneEquipmentGains`, `AppDataModel.projects[0].building.epb.zones[0].thermalZoneVentilationDesignFlowRate`.

EPB Results / Performance Summary (EPB4): ./view/EPB4-results-summary.html
Description: EPB results page showing the final energy-performance summary, calculation indicators, and performance outputs.
Data model: `AppDataModel.projects[0].building.epb.orchestration`, `AppDataModel.projects[0].building.epb.epcIndicators`, `AppDataModel.projects[0].building.epb.validation`.

SRI View 1 (Methodology Selection): ./view/SRI1-methodology-selection.html
Description: First SRI page where the user chooses the SRI methodology, weighting approach, assessment context, and which SRI domains are present.
Data model: `AppDataModel.projects[0].building.sri.method`, `AppDataModel.projects[0].building.sri.hasDefaultWeightings`, `AppDataModel.projects[0].building.sri.jurisdiction`, `AppDataModel.projects[0].building.sri.assessmentDate`, `AppDataModel.projects[0].building.sri.domainsPresence`.

SRI Decision (Default Weightings): ./view/SRI2-Default-weightings.html
Description: SRI decision/confirmation page for the selected weighting route before continuing to SRI results or domain work.
Data model: `AppDataModel.projects[0].building.sri.hasDefaultWeightings`, `AppDataModel.projects[0].building.sri.jurisdiction`, `AppDataModel.projects[0].building.sri.weighting`.

SRI View 2 (Weighting Settings): ./view/SRI3-weighting-settings.html
Description: SRI weighting setup page where the user edits and validates impact weightings and domain weightings.
Data model: `AppDataModel.projects[0].building.sri.weighting.impacts`, `AppDataModel.projects[0].building.sri.weighting.domainImpact`, `AppDataModel.projects[0].building.sri.weighting.domainWeightingsByImpact`.

SRI View 3 (Results): ./view/SRI14-results.html
Description: SRI results and domain hub page. It shows smart-readiness score information and provides access to the SRI domain tabs.
Data model: `AppDataModel.projects[0].building.sri.results`, `AppDataModel.projects[0].building.sri.domainsPresence`, `AppDataModel.projects[0].building.sri.serviceCatalogues`, `AppDataModel.projects[0].building.sri.services`.

Heating Tab (SRI5): ./view/SRI5-heating-tab.html
Description: SRI heating domain page for entering heating services, applicability, functionality levels, and compliance shares.
Data model: `AppDataModel.projects[0].building.sri.domainsPresence.heating`, `AppDataModel.projects[0].building.sri.serviceCatalogues.methodA.heating`, `AppDataModel.projects[0].building.sri.serviceCatalogues.methodB.heating`, `AppDataModel.projects[0].building.sri.services.heating`.

DHW Tab (SRI6): ./view/SRI6-dhw-tab.html
Description: SRI domestic hot water domain page for entering DHW smart-readiness service data.
Data model: `AppDataModel.projects[0].building.sri.domainsPresence.dhw`, `AppDataModel.projects[0].building.sri.serviceCatalogues.methodA.dhw`, `AppDataModel.projects[0].building.sri.serviceCatalogues.methodB.dhw`, `AppDataModel.projects[0].building.sri.services.dhw`.

Cooling Tab (SRI7): ./view/SRI7-cooling-tab.html
Description: SRI cooling domain page for entering cooling services and functionality-level assessment data.
Data model: `AppDataModel.projects[0].building.sri.domainsPresence.cooling`, `AppDataModel.projects[0].building.sri.serviceCatalogues.methodA.cooling`, `AppDataModel.projects[0].building.sri.serviceCatalogues.methodB.cooling`, `AppDataModel.projects[0].building.sri.services.cooling`.

Ventilation Tab (SRI8): ./view/SRI8-ventilation-tab.html
Description: SRI ventilation domain page for entering ventilation service readiness and control functionality data.
Data model: `AppDataModel.projects[0].building.sri.domainsPresence.ventilation`, `AppDataModel.projects[0].building.sri.serviceCatalogues.methodA.ventilation`, `AppDataModel.projects[0].building.sri.serviceCatalogues.methodB.ventilation`, `AppDataModel.projects[0].building.sri.services.ventilation`.

Lighting Tab (SRI9): ./view/SRI9-lighting-tab.html
Description: SRI lighting domain page for entering lighting services, control levels, and compliance information.
Data model: `AppDataModel.projects[0].building.sri.domainsPresence.lighting`, `AppDataModel.projects[0].building.sri.serviceCatalogues.methodA.lighting`, `AppDataModel.projects[0].building.sri.serviceCatalogues.methodB.lighting`, `AppDataModel.projects[0].building.sri.services.lighting`.

Dynamic Envelope Tab (SRI10): ./view/SRI10-dynamic-envelope-tab.html
Description: SRI dynamic envelope domain page for services such as automated shading or adaptive building-envelope features.
Data model: `AppDataModel.projects[0].building.sri.domainsPresence.envelope`, `AppDataModel.projects[0].building.sri.serviceCatalogues.methodA.envelope`, `AppDataModel.projects[0].building.sri.serviceCatalogues.methodB.envelope`, `AppDataModel.projects[0].building.sri.services.envelope`.

Electricity Tab (SRI11): ./view/SRI11-electricity-tab.html
Description: SRI electricity domain page for electricity-related smart services and energy-system readiness inputs.
Data model: `AppDataModel.projects[0].building.sri.domainsPresence.electricity`, `AppDataModel.projects[0].building.sri.serviceCatalogues.methodA.electricity`, `AppDataModel.projects[0].building.sri.serviceCatalogues.methodB.electricity`, `AppDataModel.projects[0].building.sri.services.electricity`.

EV Charging Tab (SRI12): ./view/SRI12-ev-charging-tab.html
Description: SRI electric vehicle charging domain page for smart charging service inputs and functionality levels.
Data model: `AppDataModel.projects[0].building.sri.domainsPresence.ev`, `AppDataModel.projects[0].building.sri.serviceCatalogues.methodA.ev`, `AppDataModel.projects[0].building.sri.serviceCatalogues.methodB.ev`, `AppDataModel.projects[0].building.sri.services.ev`.

Monitoring & Control Tab (SRI13): ./view/SRI13-monitoring-control-tab.html
Description: SRI monitoring and control domain page for building-management, information, monitoring, and control services.
Data model: `AppDataModel.projects[0].building.sri.domainsPresence.monitoring`, `AppDataModel.projects[0].building.sri.serviceCatalogues.methodA.monitoring`, `AppDataModel.projects[0].building.sri.serviceCatalogues.methodB.monitoring`, `AppDataModel.projects[0].building.sri.services.monitoring`.

SRI Results (SRI14): ./view/SRI14-results.html
Description: Final SRI results page showing the smart-readiness score, class, and breakdowns by impact and domain.
Data model: `AppDataModel.projects[0].building.sri.results.totalScore`, `AppDataModel.projects[0].building.sri.results.class`, `AppDataModel.projects[0].building.sri.results.impacts`, `AppDataModel.projects[0].building.sri.results.domains`.

About: ./view/about.html
Description: Informational page explaining the prototype/application context.
Data model: `AppDataModel.meta`, `AppDataModel.calculationEngine`.

---

NOT IMPLEMENTED YET - Missing views from `menu-diagram-example.mmd` and dashboard actions

Register Account: ./view/register.html
Description: Registration page where a new user creates an account before logging in and reaching the authenticated application area.
Data model: `AppDataModel.auth.register`, `AppDataModel.users`, `AppDataModel.users[0].profile`, `AppDataModel.ui.validation`.

User Profile (H): ./view/H-user-profile.html
Description: User profile page where an authenticated user reviews and edits their own profile data.
Data model: `AppDataModel.auth.currentUser`, `AppDataModel.users[0].profile`, `AppDataModel.users[0].preferences`, `AppDataModel.users[0].permissions`.

Delete Building Popup (E): ./view/E-delete-building-popup.html
Description: Confirmation popup for deleting an existing building or project record, including warning text and final confirmation action.
Data model: `AppDataModel.projects`, `AppDataModel.projects[0]`, `AppDataModel.auth.currentUser`, `AppDataModel.users[0].permissions`.

Project List Page: ./view/project-list.html
Description: Page where an authenticated user can browse existing projects before requesting membership or opening an available project.
Data model: `AppDataModel.projects`, `AppDataModel.auth.currentUser`, `AppDataModel.users[0].memberships`, `AppDataModel.users[0].permissions`.

Project Detail Page: ./view/project-detail.html
Description: Project detail page where a user reviews project information and can ask to become a member when they do not already belong to the project.
Data model: `AppDataModel.projects[0]`, `AppDataModel.projects[0].members`, `AppDataModel.projects[0].membershipRequests`, `AppDataModel.auth.currentUser`.

Membership Request Popup: ./view/membership-request-popup.html
Description: Popup shown when a user clicks Project Join, allowing them to submit a request to become a project member and wait for owner approval.
Data model: `AppDataModel.projects[0].membershipRequests`, `AppDataModel.auth.currentUser`, `AppDataModel.users[0].memberships`, `AppDataModel.notifications`.

Pending Invitation Page: ./view/pending-invitation.html
Description: Waiting state shown to a user while their project membership request or invitation is pending owner approval.
Data model: `AppDataModel.projects[0].membershipRequests`, `AppDataModel.auth.currentUser`, `AppDataModel.users[0].memberships`, `AppDataModel.notifications`.

Owner Project Area / User Management Page: ./view/owner-user-management.html
Description: Project owner area for managing project users, inviting members by email, reviewing pending membership requests, and controlling access to project buildings.
Data model: `AppDataModel.projects[0]`, `AppDataModel.projects[0].members`, `AppDataModel.projects[0].membershipRequests`, `AppDataModel.users`, `AppDataModel.auth.currentUser`, `AppDataModel.users[0].permissions`.

Access Denied / Login Error: ./view/access-denied.html
Description: Error page or state shown when authentication fails or when a user tries to access a page without the required permissions.
Data model: `AppDataModel.auth.status`, `AppDataModel.auth.errors`, `AppDataModel.auth.currentUser`, `AppDataModel.users[0].permissions`.

No Project Building Access Guard: route guard / disabled edit buttons
Description: Permission state handled by route guards and disabled edit buttons when the user can see projects/buildings but does not have edit access; no separate special view is required.
Data model: `AppDataModel.auth.currentUser`, `AppDataModel.users[0].memberships`, `AppDataModel.projects[0].membershipRequests`, `AppDataModel.users[0].permissions`.