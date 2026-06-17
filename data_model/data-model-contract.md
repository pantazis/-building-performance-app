# OpenBEP4EU Data Model Contract v2.0

> **One file to rule them all.**  
> Frontend derives TypeScript interfaces + view models.  
> Backend derives CREATE TABLE + API routes.  
> Both agree on names, types, keys, constraints, and permissions.

---

## Table of Contents

1. [Enum Catalog](#1-enum-catalog)
2. [Entity Definitions (Tables)](#2-entity-definitions-tables)
3. [Relationship Map & FK Matrix](#3-relationship-map--fk-matrix)
4. [State Machines](#4-state-machines)
5. [Frontend View Models (TypeScript Interfaces)](#5-frontend-view-models-typescript-interfaces)
6. [API Contract](#6-api-contract)
7. [Permission Matrix](#7-permission-matrix)
8. [Page-to-Data Map](#8-page-to-data-map)

---

## 1. Enum Catalog

All enum values used across the domain. Reference by name in entity tables.

### `AccountRole`
| Value | Scope | Description |
|---|---|---|
| `Registered User` | platform | Standard authenticated user |
| `Guest` | platform | Unauthenticated visitor (not stored) |

### `PlatformRole`
| Value | Description |
|---|---|
| `USER` | Standard authenticated user |
| `SITE_ADMIN` | Platform-level administrator |

### `ProjectRole` (per-project)
| Value | Privilege |
|---|---|
| `PROJECT_OWNER` | Full project control |
| `PROJECT_MEMBER` | Limited building editor |

### `MembershipStatus`
| Status | Meaning | Display |
|---|---|---|
| `OWNER` | Current user owns the project | green badge |
| `APPROVED` | Approved member | green badge |
| `PENDING` | Request waiting for approval | yellow badge |
| `INVITED` | User was invited by owner | blue badge |
| `DISAPPROVED` | Request rejected | red badge |
| `REMOVED` | User removed from project | grey badge |
| `NONE` | No relationship | none |

### `RequestStatus`
| Value | Description |
|---|---|
| `PENDING` | Awaiting owner review |
| `APPROVED` | Approved by owner |
| `DISAPPROVED` | Rejected by owner |

### `InvitationStatus`
| Value | Description |
|---|---|
| `INVITED` | Sent, awaiting response |
| `APPROVED` | Accepted by invitee |
| `DECLINED` | Declined by invitee |

### `ProjectStatus`
| Value | Description |
|---|---|
| `ACTIVE` | Normal operation |
| `IN_PROGRESS` | Building data entry started |
| `CALCULATION_COMPLETED` | Calculation finished |

### `BuildingType`
| Value |
|---|
| `Residential` |
| `Non-Residential` |
| `Offices` |
| `Healthcare` |

### `BuildingState`
| Value |
|---|
| `Existing` |
| `Renovated` |
| `New` |

### `ScoreClass`
| Value |
|---|
| `A` | `B` | `C` | `D` | `E` | `F` | `G` | `-` |

### `SRIMethod`
| Value | Description |
|---|---|
| `A` | Subset of services (fewer) |
| `B` | Full service catalogue |

### `RegionType`
| Value | Rule |
|---|---|
| `EU` | Default weightings allowed |
| `NON_EU` | Must use custom weightings |

### `DomainPresence` (0/1/2)
| Value | Meaning |
|---|---|
| `0` | Absent and not mandatory |
| `1` | Present |
| `2` | Absent but mandatory |

### `SRI_Domain`
| Value | Tab View |
|---|---|
| `heating` | `view/SRI5-heating-tab.html` |
| `dhw` | `view/SRI6-dhw-tab.html` |
| `cooling` | `view/SRI7-cooling-tab.html` |
| `ventilation` | `view/SRI8-ventilation-tab.html` |
| `lighting` | `view/SRI9-lighting-tab.html` |
| `envelope` | `view/SRI10-dynamic-envelope-tab.html` |
| `electricity` | `view/SRI11-electricity-tab.html` |
| `ev` | `view/SRI12-ev-charging-tab.html` |
| `monitoring` | `view/SRI13-monitoring-control-tab.html` |

### `ProcessingState`
| Value | Label | Color |
|---|---|---|
| `READY` | Ready | blue |
| `PROCESSING` | Processing | orange |
| `COMPLETED` | Completed | green |
| `ERROR` | Error | red |

### `ValidationIssueType`
| Value |
|---|
| `SCHEMA` |
| `REFERENCE_INTEGRITY` |
| `SEMANTIC_CONSTRAINT` |

### `ValidationIssueSeverity`
| Value |
|---|
| `ERROR` |
| `WARNING` |
| `INFO` |

### `InputRoute`
| Value |
|---|
| `JSON` |
| `IFC4 Add2 DTV` |

### `CalculationStep`
| Value | Description |
|---|---|
| `dataImport` | Import raw data |
| `dataValidation` | Validate schema + references + semantics |
| `dataTransformation` | Transform via helpers |
| `simulationCoreModules` | Run EN ISO 52016-1 + supporting standards |
| `orchestration` | Execution sequence orchestration |
| `epcOutputAggregation` | Aggregate EPC indicators |

### `PermissionString`
| Value | Allowed For |
|---|---|
| `CREATE_PROJECT` | Registered User, Project Owner, Site Admin |
| `REQUEST_PROJECT_MEMBERSHIP` | Registered User |
| `EDIT_OWN_BUILDINGS` | Project Member |
| `MANAGE_OWN_PROJECT` | Project Owner |
| `EDIT_ALL_PROJECT_BUILDINGS` | Project Owner, Site Admin |
| `APPROVE_MEMBERS` | Project Owner, Site Admin |
| `MANAGE_ALL_PROJECTS` | Site Admin |
| `SITE_ADMIN_CONSOLE` | Site Admin |
| `ARCHIVE_PROJECT` | Project Owner, Site Admin |
| `DELETE_PROJECT` | Project Owner, Site Admin |

---

## 2. Entity Definitions (Tables)

### 2.1 `User`

| Field | Type | Nullable | FK | Notes |
|---|---|---|---|---|
| `id` | UUID | NOT NULL | PK | Stable identifier |
| `name` | VARCHAR(255) | NOT NULL | | Display name |
| `email` | VARCHAR(255) | NOT NULL | UNIQUE | Login credential |
| `password_hash` | VARCHAR(255) | NOT NULL | | BCrypt hash |
| `account_role` | ENUM(AccountRole) | NOT NULL | | Default: `Registered User` |
| `platform_role` | ENUM(PlatformRole) | NOT NULL | | Default: `USER` |
| `created_at` | TIMESTAMP | NOT NULL | | |
| `updated_at` | TIMESTAMP | NOT NULL | | |

### 2.2 `Project`

| Field | Type | Nullable | FK | Notes |
|---|---|---|---|---|
| `id` | UUID | NOT NULL | PK | |
| `name` | VARCHAR(255) | NOT NULL | | |
| `short_description` | TEXT | YES | | |
| `description` | TEXT | YES | | |
| `organisation_name` | VARCHAR(255) | YES | | |
| `country` | VARCHAR(128) | NOT NULL | | |
| `city` | VARCHAR(128) | YES | | |
| `address` | TEXT | YES | | |
| `owner_id` | UUID | NOT NULL | FK → User.id | Creator becomes owner |
| `owner_name` | VARCHAR(255) | NOT NULL | | Denormalized for display |
| `building_count` | INTEGER | NOT NULL | | Default: 0 |
| `status` | ENUM(ProjectStatus) | NOT NULL | | Default: `ACTIVE` |
| `created_at` | TIMESTAMP | NOT NULL | | |
| `last_modified` | TIMESTAMP | NOT NULL | | |

### 2.3 `ProjectMembership`

| Field | Type | Nullable | FK | Notes |
|---|---|---|---|---|
| `id` | UUID | NOT NULL | PK | |
| `project_id` | UUID | NOT NULL | FK → Project.id | |
| `user_id` | UUID | NOT NULL | FK → User.id | |
| `project_role` | ENUM(ProjectRole) | NOT NULL | | `PROJECT_OWNER` or `PROJECT_MEMBER` |
| `status` | ENUM(MembershipStatus) | NOT NULL | | `APPROVED`, `PENDING`, etc. |
| `joined_at` | TIMESTAMP | YES | | |
| `removed_at` | TIMESTAMP | YES | | |
| `removed_by` | UUID | YES | FK → User.id | |
| UNIQUE | (project_id, user_id) | | | One membership per user per project |

### 2.4 `MembershipRequest`

| Field | Type | Nullable | FK | Notes |
|---|---|---|---|---|
| `id` | UUID | NOT NULL | PK | |
| `project_id` | UUID | NOT NULL | FK → Project.id | |
| `user_id` | UUID | NOT NULL | FK → User.id | Requester |
| `user_name` | VARCHAR(255) | NOT NULL | | Denormalized |
| `email` | VARCHAR(255) | NOT NULL | | Denormalized |
| `message` | TEXT | YES | | Optional note from requester |
| `status` | ENUM(RequestStatus) | NOT NULL | | Default: `PENDING` |
| `requested_at` | TIMESTAMP | NOT NULL | | |
| `reviewed_at` | TIMESTAMP | YES | | |
| `reviewed_by` | UUID | YES | FK → User.id | Owner who approved/rejected |
| `decision_note` | TEXT | YES | | |

### 2.5 `Invitation`

| Field | Type | Nullable | FK | Notes |
|---|---|---|---|---|
| `id` | UUID | NOT NULL | PK | |
| `project_id` | UUID | NOT NULL | FK → Project.id | |
| `email` | VARCHAR(255) | NOT NULL | | Target user's email |
| `project_role` | ENUM(ProjectRole) | NOT NULL | | Always `PROJECT_MEMBER` |
| `message` | TEXT | YES | | Optional message |
| `status` | ENUM(InvitationStatus) | NOT NULL | | Default: `INVITED` |
| `invited_at` | TIMESTAMP | NOT NULL | | |
| `invited_by` | UUID | NOT NULL | FK → User.id | The inviter |

### 2.6 `Building`

| Field | Type | Nullable | FK | Notes |
|---|---|---|---|---|
| `id` | UUID | NOT NULL | PK | |
| `project_id` | UUID | NOT NULL | FK → Project.id | |
| `created_by_user_id` | UUID | NOT NULL | FK → User.id | |
| `name` | VARCHAR(255) | NOT NULL | | |
| `north_axis` | DECIMAL | YES | | Degrees from north |
| `created_at` | TIMESTAMP | NOT NULL | | |
| `updated_at` | TIMESTAMP | NOT NULL | | |

### 2.7 `BuildingGeneralData`

| Field | Type | Nullable | FK | Notes |
|---|---|---|---|---|
| `id` | UUID | NOT NULL | PK | |
| `building_id` | UUID | NOT NULL | FK → Building.id (1:1) | |
| `type` | ENUM(BuildingType) | YES | | |
| `usage` | VARCHAR(255) | YES | | Free text |
| `country` | VARCHAR(128) | YES | | |
| `climate_zone` | VARCHAR(128) | YES | | |
| `time_zone` | VARCHAR(128) | YES | | e.g. `Europe/Athens` |
| `floor_area` | VARCHAR(64) | YES | | Range or exact |
| `building_state` | ENUM(BuildingState) | YES | | |
| `year` | INTEGER | YES | | Construction/renovation year |
| `address` | TEXT | YES | | |
| `location_lat` | DECIMAL(10,7) | YES | | |
| `location_lng` | DECIMAL(10,7) | YES | | |
| `location_elevation` | DECIMAL | YES | | meters |

### 2.8 `SRIModel`

| Field | Type | Nullable | FK | Notes |
|---|---|---|---|---|
| `id` | UUID | NOT NULL | PK | |
| `building_id` | UUID | NOT NULL | FK → Building.id (1:1) | |
| `method` | ENUM(SRIMethod) | NOT NULL | | `A` or `B` |
| `has_default_weightings` | BOOLEAN | NOT NULL | | |
| `jurisdiction_region` | ENUM(RegionType) | NOT NULL | | |
| `jurisdiction_country` | VARCHAR(128) | YES | | |
| `assessment_date` | DATE | YES | | |
| `created_at` | TIMESTAMP | NOT NULL | | |
| `updated_at` | TIMESTAMP | NOT NULL | | |

### 2.9 `SRIDomainPresence`

| Field | Type | Nullable | FK | Notes |
|---|---|---|---|---|
| `sri_model_id` | UUID | NOT NULL | FK → SRIModel.id | |
| `domain` | ENUM(SRI_Domain) | NOT NULL | | |
| `presence` | INTEGER | NOT NULL | | 0, 1, or 2 (see DomainPresence enum) |
| UNIQUE | (sri_model_id, domain) | | | |

### 2.10 `SRIWeighting`

| Field | Type | Nullable | FK | Notes |
|---|---|---|---|---|
| `id` | UUID | NOT NULL | PK | |
| `sri_model_id` | UUID | NOT NULL | FK → SRIModel.id | |
| `impact` | ENUM(ImpactName) | NOT NULL | | see below |
| `weight_pct` | DECIMAL(5,2) | NOT NULL | | percentage |
| UNIQUE | (sri_model_id, impact) | | | |

Impact names: `energy_efficiency`, `maintenance`, `comfort`, `convenience`, `health`, `info`, `flexibility`.

### 2.11 `SRIDomainWeighting`

| Field | Type | Nullable | FK | Notes |
|---|---|---|---|---|
| `id` | UUID | NOT NULL | PK | |
| `sri_weighting_id` | UUID | NOT NULL | FK → SRIWeighting.id | |
| `domain` | ENUM(SRI_Domain) | NOT NULL | | |
| `weight_pct` | DECIMAL(5,2) | NOT NULL | | |
| UNIQUE | (sri_weighting_id, domain) | | | |

### 2.12 `SRIServiceEntry`

| Field | Type | Nullable | FK | Notes |
|---|---|---|---|---|
| `id` | UUID | NOT NULL | PK | |
| `sri_model_id` | UUID | NOT NULL | FK → SRIModel.id | |
| `domain` | ENUM(SRI_Domain) | NOT NULL | | |
| `service_code` | VARCHAR(16) | NOT NULL | | e.g. `H1a`, `C1`, `V2` |
| `applicable` | BOOLEAN | NOT NULL | | |
| `triage` | BOOLEAN | NOT NULL | | Affects max obtainable score? |
| `level` | INTEGER | YES | | 1-4 |
| `compliance` | DECIMAL(5,2) | YES | | 0.00 - 1.00 |
| UNIQUE | (sri_model_id, service_code) | | | |

### 2.13 `SRIResults`

| Field | Type | Nullable | FK | Notes |
|---|---|---|---|---|
| `id` | UUID | NOT NULL | PK | |
| `sri_model_id` | UUID | NOT NULL | FK → SRIModel.id (1:1) | |
| `total_score` | DECIMAL(5,2) | YES | | 0-100 |
| `class` | ENUM(ScoreClass) | YES | | |
| `energy_efficiency_score` | DECIMAL(5,2) | YES | | |
| `maintenance_score` | DECIMAL(5,2) | YES | | |
| `comfort_score` | DECIMAL(5,2) | YES | | |
| `convenience_score` | DECIMAL(5,2) | YES | | |
| `health_score` | DECIMAL(5,2) | YES | | |
| `info_score` | DECIMAL(5,2) | YES | | |
| `flexibility_score` | DECIMAL(5,2) | YES | | |
| `heating_score` | DECIMAL(5,2) | YES | | |
| `cooling_score` | DECIMAL(5,2) | YES | | |
| `dhw_score` | DECIMAL(5,2) | YES | | |
| `ventilation_score` | DECIMAL(5,2) | YES | | |
| `lighting_score` | DECIMAL(5,2) | YES | | |
| `envelope_score` | DECIMAL(5,2) | YES | | |
| `electricity_score` | DECIMAL(5,2) | YES | | |
| `ev_score` | DECIMAL(5,2) | YES | | |
| `monitoring_score` | DECIMAL(5,2) | YES | | |
| `calculated_at` | TIMESTAMP | YES | | |

### 2.14 `EPBModel`

| Field | Type | Nullable | FK | Notes |
|---|---|---|---|---|
| `id` | UUID | NOT NULL | PK | |
| `building_id` | UUID | NOT NULL | FK → Building.id (1:1) | |
| `provenance_source_type` | ENUM(InputRoute) | YES | | |
| `provenance_source_file` | VARCHAR(512) | YES | | |
| `provenance_ifc_enabled` | BOOLEAN | YES | | Default: false |
| `created_at` | TIMESTAMP | NOT NULL | | |
| `updated_at` | TIMESTAMP | NOT NULL | | |

### 2.15 `EPBSettings`

| Field | Type | Nullable | FK | Notes |
|---|---|---|---|---|
| `id` | UUID | NOT NULL | PK | |
| `epb_model_id` | UUID | NOT NULL | FK → EPBModel.id (1:1) | |
| `run_period_start` | VARCHAR(5) | YES | | MM-DD |
| `run_period_end` | VARCHAR(5) | YES | | MM-DD |
| `run_begin_month` | INTEGER | YES | | 1-12 |
| `run_begin_day` | INTEGER | YES | | 1-31 |
| `run_end_month` | INTEGER | YES | | 1-12 |
| `run_end_day` | INTEGER | YES | | 1-31 |
| `timestep` | DECIMAL | YES | | hours |
| `timestep_per_hour` | INTEGER | YES | | |

### 2.16 `EPBGroundTemperature`

| Field | Type | Nullable | FK | Notes |
|---|---|---|---|---|
| `id` | UUID | NOT NULL | PK | |
| `epb_model_id` | UUID | NOT NULL | FK → EPBModel.id | |
| `name` | VARCHAR(255) | YES | | |
| `external_walls_thickness` | DECIMAL | YES | | meters |
| `exposed_perimeter` | DECIMAL | YES | | meters |
| `annual_mean_internal_temp` | DECIMAL | YES | | °C |
| `amplitude_internal_temp_var` | DECIMAL | YES | | |
| `min_external_temp_month` | INTEGER | YES | | 1-12 |
| `linear_thermal_transmittance` | DECIMAL | YES | | W/m·K |
| `conductivity` | DECIMAL | YES | | W/m·K |
| `heat_capacity` | DECIMAL | YES | | MJ/m³·K |

### 2.17 `EPBLibrary`

| Field | Type | Nullable | FK | Notes |
|---|---|---|---|---|
| `id` | UUID | NOT NULL | PK | |
| `epb_model_id` | UUID | NOT NULL | FK → EPBModel.id | |

### 2.18 `EPBMaterialOpaque`

| Field | Type | Nullable | FK | Notes |
|---|---|---|---|---|
| `id` | UUID | NOT NULL | PK | |
| `library_id` | UUID | NOT NULL | FK → EPBLibrary.id | |
| `name` | VARCHAR(255) | YES | | |
| `roughness` | VARCHAR(64) | YES | | e.g. `MediumRough`, `Smooth` |
| `thickness` | DECIMAL | YES | | m |
| `conductivity` | DECIMAL | YES | | W/m·K |
| `density` | DECIMAL | YES | | kg/m³ |
| `specific_heat` | DECIMAL | YES | | J/kg·K |

### 2.19 `EPBGlazing`

| Field | Type | Nullable | FK | Notes |
|---|---|---|---|---|
| `id` | UUID | NOT NULL | PK | |
| `library_id` | UUID | NOT NULL | FK → EPBLibrary.id | |
| `name` | VARCHAR(255) | YES | | |
| `u_factor` | DECIMAL | YES | | W/m²·K |
| `solar_heat_gain_coeff` | DECIMAL | YES | | 0-1 |
| `visible_transmittance` | DECIMAL | YES | | 0-1 |

### 2.20 `EPBConstruction`

| Field | Type | Nullable | FK | Notes |
|---|---|---|---|---|
| `id` | UUID | NOT NULL | PK | |
| `library_id` | UUID | NOT NULL | FK → EPBLibrary.id | |
| `name` | VARCHAR(255) | YES | | |
| `construction_class` | VARCHAR(64) | YES | | e.g. `MassEquallyDistributed` |
| `outside_layer_material_id` | UUID | YES | FK → EPBMaterialOpaque.id | |
| `layer_material_ids` | JSON | YES | | Array of material UUIDs |

### 2.21 `EPBScheduleConstant`

| Field | Type | Nullable | FK | Notes |
|---|---|---|---|---|
| `id` | UUID | NOT NULL | PK | |
| `library_id` | UUID | NOT NULL | FK → EPBLibrary.id | |
| `name` | VARCHAR(255) | YES | | |
| `type` | VARCHAR(64) | NOT NULL | | `Occupancy`, `Activity`, `CoolingSetpoint`, `Ventilation` |
| `hourly_value` | DECIMAL | NOT NULL | | |

### 2.22 `EPBThermostat`

| Field | Type | Nullable | FK | Notes |
|---|---|---|---|---|
| `id` | UUID | NOT NULL | PK | |
| `library_id` | UUID | NOT NULL | FK → EPBLibrary.id | |
| `name` | VARCHAR(255) | YES | | |
| `constant_heating_setpoint` | DECIMAL | YES | | °C |
| `cooling_setpoint_schedule_id` | UUID | YES | FK → EPBScheduleConstant.id | |

### 2.23 `EPBHumidistat`

| Field | Type | Nullable | FK | Notes |
|---|---|---|---|---|
| `id` | UUID | NOT NULL | PK | |
| `library_id` | UUID | NOT NULL | FK → EPBLibrary.id | |
| `name` | VARCHAR(255) | YES | | |
| `dehumidification_setpoint` | DECIMAL | YES | | % |
| `humidification_setpoint` | DECIMAL | YES | | % |

### 2.24 `EPBZone`

| Field | Type | Nullable | FK | Notes |
|---|---|---|---|---|
| `id` | UUID | NOT NULL | PK | |
| `epb_model_id` | UUID | NOT NULL | FK → EPBModel.id | |
| `name` | VARCHAR(255) | NOT NULL | | |
| `volume` | DECIMAL | YES | | m³ |
| `floor_area` | DECIMAL | YES | | m² |
| `thermostat_id` | UUID | YES | FK → EPBThermostat.id | |
| `humidistat_id` | UUID | YES | FK → EPBHumidistat.id | |
| `max_heating_power` | DECIMAL | YES | | W |
| `max_cooling_power` | DECIMAL | YES | | W |

### 2.25 `EPBSpace`

| Field | Type | Nullable | FK | Notes |
|---|---|---|---|---|
| `id` | UUID | NOT NULL | PK | |
| `zone_id` | UUID | NOT NULL | FK → EPBZone.id | |
| `name` | VARCHAR(255) | YES | | |

### 2.26 `EPBSurface`

| Field | Type | Nullable | FK | Notes |
|---|---|---|---|---|
| `id` | UUID | NOT NULL | PK | |
| `zone_id` | UUID | NOT NULL | FK → EPBZone.id | |
| `type` | VARCHAR(64) | NOT NULL | | `wall`, `roof`, `floor`, `ceiling` |
| `construction_id` | UUID | YES | FK → EPBConstruction.id | |
| `outside_boundary_condition` | VARCHAR(64) | YES | | `Outdoors`, `Ground`, `Adiabatic`, `SameZone`, `OtherZone` |
| `area` | DECIMAL | YES | | m² |
| `height` | DECIMAL | YES | | m |
| `azimuth` | DECIMAL | YES | | degrees |
| `tilt` | DECIMAL | YES | | degrees |
| `ground_temp_props_id` | UUID | YES | FK → EPBGroundTemperature.id | |

### 2.27 `EPBSubSurface` (windows/doors)

| Field | Type | Nullable | FK | Notes |
|---|---|---|---|---|
| `id` | UUID | NOT NULL | PK | |
| `surface_id` | UUID | NOT NULL | FK → EPBSurface.id | |
| `type` | VARCHAR(64) | NOT NULL | | `window`, `door`, `skylight` |
| `construction_id` | UUID | YES | FK → EPBConstruction.id | |
| `area` | DECIMAL | YES | | m² |
| `height` | DECIMAL | YES | | m |
| `azimuth` | DECIMAL | YES | | degrees |
| `tilt` | DECIMAL | YES | | degrees |

### 2.28 `EPBPersonGains`

| Field | Type | Nullable | FK | Notes |
|---|---|---|---|---|
| `id` | UUID | NOT NULL | PK | |
| `zone_id` | UUID | NOT NULL | FK → EPBZone.id (1:1) | |
| `number_of_people` | INTEGER | YES | | |
| `number_of_people_schedule_id` | UUID | YES | FK → EPBScheduleConstant.id | |
| `activity_level` | DECIMAL | YES | | W/person |
| `activity_level_schedule_id` | UUID | YES | FK → EPBScheduleConstant.id | |
| `fraction_radiant` | DECIMAL | YES | | 0-1 |

### 2.29 `EPBEquipmentGains`

| Field | Type | Nullable | FK | Notes |
|---|---|---|---|---|
| `id` | UUID | NOT NULL | PK | |
| `zone_id` | UUID | NOT NULL | FK → EPBZone.id (1:1) | |
| `fuel_type` | VARCHAR(64) | YES | | `Electricity`, `NaturalGas`, etc. |
| `design_level` | DECIMAL | YES | | W |
| `schedule_id` | UUID | YES | FK → EPBScheduleConstant.id | |
| `fraction_latent` | DECIMAL | YES | | 0-1 |
| `fraction_radiant` | DECIMAL | YES | | 0-1 |
| `fraction_lost` | DECIMAL | YES | | 0-1 |

### 2.30 `EPBVentilation`

| Field | Type | Nullable | FK | Notes |
|---|---|---|---|---|
| `id` | UUID | NOT NULL | PK | |
| `zone_id` | UUID | NOT NULL | FK → EPBZone.id (1:1) | |
| `calculation_method` | VARCHAR(64) | YES | | `AirChangesPerHour`, `FlowRate` |
| `air_changes_per_hour` | DECIMAL | YES | | |
| `schedule_id` | UUID | YES | FK → EPBScheduleConstant.id | |

### 2.31 `EPBValidation`

| Field | Type | Nullable | FK | Notes |
|---|---|---|---|---|
| `id` | UUID | NOT NULL | PK | |
| `epb_model_id` | UUID | NOT NULL | FK → EPBModel.id (1:1) | |
| `schema_valid` | BOOLEAN | NOT NULL | | |
| `reference_integrity_valid` | BOOLEAN | NOT NULL | | |
| `semantic_constraints_valid` | BOOLEAN | NOT NULL | | |

### 2.32 `EPBValidationIssue`

| Field | Type | Nullable | FK | Notes |
|---|---|---|---|---|
| `id` | UUID | NOT NULL | PK | |
| `validation_id` | UUID | NOT NULL | FK → EPBValidation.id | |
| `type` | ENUM(ValidationIssueType) | NOT NULL | | |
| `severity` | ENUM(ValidationIssueSeverity) | NOT NULL | | |
| `message` | TEXT | NOT NULL | | |
| `path` | VARCHAR(512) | YES | | JSON path |
| `rule` | VARCHAR(255) | YES | | Rule reference |
| `affected_fields` | JSON | YES | | Array of field paths |

### 2.33 `EPBTransformation`

| Field | Type | Nullable | FK | Notes |
|---|---|---|---|---|
| `id` | UUID | NOT NULL | PK | |
| `epb_model_id` | UUID | NOT NULL | FK → EPBModel.id (1:1) | |
| `helpers_applied` | JSON | NOT NULL | | Array of helper names |
| `status` | ENUM(ProcessingState) | NOT NULL | | Default: `READY` |

### 2.34 `EPBOrchestration`

| Field | Type | Nullable | FK | Notes |
|---|---|---|---|---|
| `id` | UUID | NOT NULL | PK | |
| `epb_model_id` | UUID | NOT NULL | FK → EPBModel.id (1:1) | |
| `execution_order` | JSON | NOT NULL | | Array of CalculationStep values |
| `status` | ENUM(ProcessingState) | NOT NULL | | Default: `READY` |

### 2.35 `EPCIndicators`

| Field | Type | Nullable | FK | Notes |
|---|---|---|---|---|
| `id` | UUID | NOT NULL | PK | |
| `epb_model_id` | UUID | NOT NULL | FK → EPBModel.id (1:1) | |
| `electricity_kwh` | DECIMAL | YES | | Final energy, electricity |
| `natural_gas_kwh` | DECIMAL | YES | | Final energy, natural gas |
| `primary_energy_kwh` | DECIMAL | YES | | |
| `operational_ghg_kgco2eq` | DECIMAL | YES | | |
| `onsite_renewables_share_pct` | DECIMAL | YES | | |

### 2.36 `CalculationRun`

| Field | Type | Nullable | FK | Notes |
|---|---|---|---|---|
| `id` | UUID | NOT NULL | PK | |
| `building_id` | UUID | NOT NULL | FK → Building.id | |
| `input_snapshot_id` | UUID | YES | | References immutable input state |
| `status` | ENUM(ProcessingState) | NOT NULL | | |
| `started_at` | TIMESTAMP | YES | | |
| `completed_at` | TIMESTAMP | YES | | |
| `error_message` | TEXT | YES | | |
| `triggered_by` | UUID | YES | FK → User.id | |

### 2.37 `AuditLog`

| Field | Type | Nullable | FK | Notes |
|---|---|---|---|---|
| `id` | UUID | NOT NULL | PK | |
| `user_id` | UUID | NOT NULL | FK → User.id | |
| `action` | VARCHAR(64) | NOT NULL | | e.g. `CREATE_PROJECT`, `REMOVE_MEMBER` |
| `target_type` | VARCHAR(64) | YES | | e.g. `Project`, `Building`, `Membership` |
| `target_id` | UUID | YES | | Polymorphic reference |
| `details` | JSON | YES | | Extra context |
| `actor_context` | JSON | YES | | For Site Admin: real_user + context |
| `created_at` | TIMESTAMP | NOT NULL | | |

---

## 3. Relationship Map & FK Matrix

```
User ──< ProjectMembership >── Project
User ──< MembershipRequest >── Project
User ──< Invitation >── Project
Project ──< Building
Building ── BuildingGeneralData (1:1)
Building ── SRIModel (1:1)
  SRIModel ──< SRIDomainPresence
  SRIModel ──< SRIWeighting
    SRIWeighting ──< SRIDomainWeighting
  SRIModel ──< SRIServiceEntry
  SRIModel ── SRIResults (1:1)
Building ── EPBModel (1:1)
  EPBModel ── EPBSettings (1:1)
  EPBModel ──< EPBGroundTemperature
  EPBModel ── EPBLibrary (1:1)
    EPBLibrary ──< EPBMaterialOpaque
    EPBLibrary ──< EPBGlazing
    EPBLibrary ──< EPBConstruction
    EPBLibrary ──< EPBScheduleConstant
    EPBLibrary ──< EPBThermostat
    EPBLibrary ──< EPBHumidistat
  EPBModel ──< EPBZone
    EPBZone ──< EPBSpace
    EPBZone ──< EPBSurface
      EPBSurface ──< EPBSubSurface
    EPBZone ── EPBPersonGains (1:1)
    EPBZone ── EPBEquipmentGains (1:1)
    EPBZone ── EPBVentilation (1:1)
  EPBModel ── EPBValidation (1:1)
    EPBValidation ──< EPBValidationIssue
  EPBModel ── EPBTransformation (1:1)
  EPBModel ── EPBOrchestration (1:1)
  EPBModel ── EPCIndicators (1:1)
Building ──< CalculationRun
User ──< AuditLog
```

### FK Cross-Reference

| Source Entity | FK Field | Target Entity | Relationship |
|---|---|---|---|
| Project | owner_id | User | many-to-one |
| ProjectMembership | project_id | Project | many-to-one |
| ProjectMembership | user_id | User | many-to-one |
| MembershipRequest | project_id | Project | many-to-one |
| MembershipRequest | user_id | User | many-to-one |
| Invitation | project_id | Project | many-to-one |
| Invitation | invited_by | User | many-to-one |
| Building | project_id | Project | many-to-one |
| Building | created_by_user_id | User | many-to-one |
| BuildingGeneralData | building_id | Building | one-to-one |
| SRIModel | building_id | Building | one-to-one |
| SRIDomainPresence | sri_model_id | SRIModel | many-to-one |
| SRIWeighting | sri_model_id | SRIModel | many-to-one |
| SRIDomainWeighting | sri_weighting_id | SRIWeighting | many-to-one |
| SRIServiceEntry | sri_model_id | SRIModel | many-to-one |
| SRIResults | sri_model_id | SRIModel | one-to-one |
| EPBModel | building_id | Building | one-to-one |
| EPBSettings | epb_model_id | EPBModel | one-to-one |
| EPBGroundTemperature | epb_model_id | EPBModel | many-to-one |
| EPBLibrary | epb_model_id | EPBModel | one-to-one |
| EPBMaterialOpaque | library_id | EPBLibrary | many-to-one |
| EPBGlazing | library_id | EPBLibrary | many-to-one |
| EPBConstruction | library_id | EPBLibrary | many-to-one |
| EPBConstruction | outside_layer_material_id | EPBMaterialOpaque | many-to-one |
| EPBScheduleConstant | library_id | EPBLibrary | many-to-one |
| EPBThermostat | library_id | EPBLibrary | many-to-one |
| EPBThermostat | cooling_setpoint_schedule_id | EPBScheduleConstant | many-to-one |
| EPBHumidistat | library_id | EPBLibrary | many-to-one |
| EPBZone | epb_model_id | EPBModel | many-to-one |
| EPBZone | thermostat_id | EPBThermostat | many-to-one |
| EPBZone | humidistat_id | EPBHumidistat | many-to-one |
| EPBSpace | zone_id | EPBZone | many-to-one |
| EPBSurface | zone_id | EPBZone | many-to-one |
| EPBSurface | construction_id | EPBConstruction | many-to-one |
| EPBSurface | ground_temp_props_id | EPBGroundTemperature | many-to-one |
| EPBSubSurface | surface_id | EPBSurface | many-to-one |
| EPBSubSurface | construction_id | EPBConstruction | many-to-one |
| EPBPersonGains | zone_id | EPBZone | one-to-one |
| EPBPersonGains | number_of_people_schedule_id | EPBScheduleConstant | many-to-one |
| EPBPersonGains | activity_level_schedule_id | EPBScheduleConstant | many-to-one |
| EPBEquipmentGains | zone_id | EPBZone | one-to-one |
| EPBEquipmentGains | schedule_id | EPBScheduleConstant | many-to-one |
| EPBVentilation | zone_id | EPBZone | one-to-one |
| EPBVentilation | schedule_id | EPBScheduleConstant | many-to-one |
| EPBValidation | epb_model_id | EPBModel | one-to-one |
| EPBValidationIssue | validation_id | EPBValidation | many-to-one |
| EPBTransformation | epb_model_id | EPBModel | one-to-one |
| EPBOrchestration | epb_model_id | EPBModel | one-to-one |
| EPCIndicators | epb_model_id | EPBModel | one-to-one |
| CalculationRun | building_id | Building | many-to-one |
| CalculationRun | triggered_by | User | many-to-one |
| AuditLog | user_id | User | many-to-one |

---

## 4. State Machines

### 4.1 Membership Status Lifecycle

```
                   ┌─────────────┐
                   │   NONE      │
                   └──────┬──────┘
                          │ requestMembership (user)
                          ▼
                   ┌─────────────┐
              ┌─── │  PENDING    │ ◄──── invitedByOwner
              │    └──────┬──────┘
              │           │
              │    ┌──────┴──────┐
              │    │             │
              │ approve      disapprove
              │    │             │
              │    ▼             ▼
              │ ┌────────┐ ┌────────────┐
              │ │APPROVED│ │DISAPPROVED │
              │ └───┬────┘ └────────────┘
              │     │
              │     │ removeMember (owner)
              │     ▼
              │ ┌────────┐
              └─│ REMOVED│
                └────────┘
```

| From | To | Trigger | Allowed By |
|---|---|---|---|
| NONE | PENDING | requestMembership | Registered User |
| NONE | INVITED | inviteUser | Project Owner, Site Admin |
| PENDING | APPROVED | approveRequest | Project Owner, Site Admin |
| PENDING | DISAPPROVED | disapproveRequest | Project Owner, Site Admin |
| INVITED | APPROVED | acceptInvitation | Invited User |
| INVITED | DECLINED | declineInvitation | Invited User |
| APPROVED | REMOVED | removeMember | Project Owner, Site Admin |
| REMOVED | PENDING | requestMembership | Previously removed user |

### 4.2 Project Status Lifecycle

```
┌────────┐    buildingDataEntryStarted    ┌────────────┐
│ ACTIVE │ ──────────────────────────────► │IN_PROGRESS │
└────────┘                                 └──────┬─────┘
                                                   │ calculationFinished
                                                   ▼
                                          ┌─────────────────────┐
                                          │CALCULATION_COMPLETED│
                                          └─────────────────────┘
```

| From | To | Trigger | Allowed By |
|---|---|---|---|
| ACTIVE | IN_PROGRESS | building data entry started | Project Owner, Project Member |
| IN_PROGRESS | CALCULATION_COMPLETED | calculation finished | System, Project Owner, Project Member |

### 4.3 Calculation Engine Workflow

```
┌──────┐   ┌──────┐   ┌────────┐   ┌──────────┐   ┌──────┐   ┌──────┐
│data  │──►│data  │──►│data    │──►│simulation│──►│orches│──►│epc   │
│Import│   │Valid │   │Transf. │   │Core Mod. │   │trat. │   │Output│
└──────┘   └──────┘   └────────┘   └──────────┘   └──────┘   └──────┘
  │           │           │              │            │          │
  └─►ERROR    └─►ERROR    └─►ERROR       └─►ERROR     └─►ERROR   done
```

### 4.4 Processing State Transitions (shared)

```
┌───────┐
│ READY │
└───┬───┘
    │ start
    ▼
┌──────────┐
│PROCESSING│
└───┬───┬──┘
    │   │
    │   └────► ERROR
    ▼
┌─────────┐
│COMPLETED│
└─────────┘
```

---

## 5. Frontend View Models (TypeScript Interfaces)

### 5.1 `AuthState`

```typescript
interface AuthState {
  status: 'AUTHENTICATED' | 'UNAUTHENTICATED';
  currentUser: {
    id: string;
    name: string;
    email: string;
    accountRole: AccountRole;         // 'Registered User'
    platformRole: PlatformRole;       // 'USER' | 'SITE_ADMIN'
  } | null;
}
```

### 5.2 `ProjectListViewModel`

```typescript
interface ProjectListViewModel {
  currentUser: {
    id: string;
    name: string;
    email: string;
    platformRole: PlatformRole;
  };
  projects: Array<{
    id: string;
    name: string;
    ownerName: string;
    membershipStatus: MembershipStatus;
    currentUserProjectRole: ProjectRole | null;   // null unless approved/owner
    canOpenDashboard: boolean;
    canRequestMembership: boolean;
    canCreateBuilding: boolean;
  }>;
  permissions: {
    canCreateProject: boolean;
    canSelectProjectOwnerAsSiteAdmin: boolean;
  };
}
```

### 5.3 `ProjectDashboardViewModel`

```typescript
interface ProjectDashboardViewModel {
  currentUser: {
    id: string;
    name: string;
    platformRole: PlatformRole;
  };
  project: {
    id: string;
    name: string;
    country: string;
    status: ProjectStatus;
    createdAt: string; // ISO date
    lastModified: string; // ISO date
  };
  currentUserProjectRole: ProjectRole;
  permissions: {
    canManageProjectUsers: boolean;
    canCreateBuilding: boolean;
    canEditAllBuildings: boolean;
    canRunCalculation: boolean;
  };
  buildings: Array<{
    id: string;
    name: string;
    createdByUserId: string;
    status: string;
    sriStatus: ProcessingState;
    epbStatus: ProcessingState;
    latestScore: number | null;
    scoreClass: ScoreClass | null;
    canEdit: boolean;
    canOpenSri: boolean;
    canOpenEpb: boolean;
    canRunCalculation: boolean;
  }>;
}
```

### 5.4 `BuildingEditorViewModel`

```typescript
interface BuildingEditorViewModel {
  currentUser: {
    id: string;
    name: string;
    platformRole: PlatformRole;
  };
  project: {
    id: string;
    name: string;
  };
  building: {
    id: string;
    projectId: string;
    createdByUserId: string;
    name: string;
    northAxis: number;
    general: {
      type: BuildingType;
      usage: string;
      country: string;
      climateZone: string;
      timeZone: string;
      floorArea: string;
      buildingState: BuildingState;
      year: number;
      address: string;
      location: {
        lat: number;
        lng: number;
        elevation: number;
      };
    };
    permissions: {
      canEditGeneral: boolean;
      canEditSri: boolean;
      canEditEpb: boolean;
      canRunCalculation: boolean;
    };
  };
}
```

### 5.5 `SRIWorkflowViewModel`

```typescript
interface SRIWorkflowViewModel {
  buildingId: string;
  sri: {
    method: SRIMethod;
    hasDefaultWeightings: boolean;
    jurisdiction: {
      region: RegionType;
      country: string;
    };
    assessmentDate: string; // ISO date
    domainsPresence: Record<SRIDomain, 0 | 1 | 2>;
    weighting: {
      impacts: Record<ImpactName, number>;          // sum = 100%
      domainWeightingsByImpact: Record<ImpactName, Record<SRIDomain, number>>;
    };
    serviceCatalogues: {
      methodA: Record<SRIDomain, string[]>;
      methodB: Record<SRIDomain, string[]>;
    };
    services: Record<SRIDomain, Array<{
      id: string;
      applicable: boolean;
      triage: boolean;
      level: number;     // 1-4
      compliance: number; // 0-1
    }>>;
    results: {
      totalScore: number;
      class: ScoreClass;
      impacts: Record<ImpactName, number>;
      domains: Record<SRIDomain, number>;
    };
  };
  permissions: {
    canEditSri: boolean;
    canCalculateSri: boolean;
    canViewResults: boolean;
  };
}
```

### 5.6 `EPBWorkflowViewModel`

```typescript
interface EPBWorkflowViewModel {
  buildingId: string;
  epb: {
    provenance: {
      sourceType: InputRoute;
      sourceFile: string;
      ifcImport: {
        enabled: boolean;
        ifcSchema: string;
        idsValidated: boolean;
      };
    };
    validation: {
      schemaValid: boolean;
      referenceIntegrityValid: boolean;
      semanticConstraintsValid: boolean;
      issues: Array<{
        id: string;
        type: ValidationIssueType;
        severity: ValidationIssueSeverity;
        message: string;
        path: string;
        rule: string;
        affectedFields: string[];
      }>;
    };
    transformation: {
      helpersApplied: string[];
      status: ProcessingState;
    };
    settings: {
      runPeriod: { start: string; end: string };
      runPeriodDetailed: {
        beginMonth: number;
        beginDayOfMonth: number;
        endMonth: number;
        endDayOfMonth: number;
      };
      timestep: number;
      timeStep: { numberPerHour: number };
      groundTemperatureCalculationProperties: Array<{
        id: string;
        name: string;
        externalWallsThickness: number;
        exposedPerimeter: number;
        annualMeanInternalTemperature: number;
        amplitudeOfInternalTemperatureVariations: number;
        minExternalTemperatureMonth: number;
        linearThermalTransmittance: number;
        conductivity: number;
        heatCapacity: number;
      }>;
    };
    library: {
      materialOpaque: Array<{
        id: string;
        roughness: string;
        thickness: number;
        conductivity: number;
        density: number;
        specificHeat: number;
      }>;
      glazingSimpleSystem: Array<{
        id: string;
        uFactor: number;
        solarHeatGainCoefficient: number;
        visibleTransmittance: number;
      }>;
      construction: Array<{
        id: string;
        constructionClass: string;
        outsideLayerMaterialId: string;
        layerMaterialIds: string[];
      }>;
      scheduleConstant: Array<{
        id: string;
        type: string;
        hourlyValue: number;
      }>;
      thermostat: Array<{
        id: string;
        constantHeatingSetpoint: number;
        coolingSetpointSchedule: string;
      }>;
      humidistat: Array<{
        id: string;
        constantDehumidificationSetpoint: number;
        constantHumidificationSetpoint: number;
      }>;
    };
    zones: Array<{
      id: string;
      name: string;
      volume: number;
      floorArea: number;
      surfaces: Array<{
        id: string;
        type: string;
        constructionId: string;
        outsideBoundaryCondition: string;
        area: number;
        height: number;
        azimuth: number;
        tilt: number;
        subsurfaces: Array<{
          id: string;
          type: string;
          constructionId: string;
          area: number;
          height: number;
          azimuth: number;
          tilt: number;
        }>;
      }>;
      spaces: Array<{ id: string; name: string }>;
      peopleGains: {
        numberOfPeople: number;
        activityLevel: number;
        fractionRadiant: number;
      };
      equipmentGains: {
        fuelType: string;
        designLevel: number;
        fractionLatent: number;
        fractionRadiant: number;
        fractionLost: number;
      };
      ventilation: {
        calculationMethod: string;
        airChangesPerHour: number;
      };
      needsSystem: {
        heating: number;
        cooling: number;
      };
    }>;
    orchestration: {
      executionOrder: CalculationStep[];
      status: ProcessingState;
    };
    epcIndicators: {
      finalEnergyByCarrier: {
        electricity_kWh: number;
        naturalGas_kWh: number;
      };
      primaryEnergy_kWh: number;
      operationalGHG_kgCO2eq: number;
      onsiteRenewablesShare_percent: number;
    };
  };
  permissions: {
    canEditEpb: boolean;
    canRunCalculation: boolean;
    canViewResults: boolean;
  };
}
```

### 5.7 `UserProfileViewModel`

```typescript
interface UserProfileViewModel {
  user: {
    id: string;
    name: string;
    email: string;
    accountRole: AccountRole;
    platformRole: PlatformRole;
  };
  memberships: Array<{
    projectId: string;
    projectName: string;
    projectRole: ProjectRole;
    status: MembershipStatus;
    joinedAt: string;
  }>;
  permissions: {
    canEditProfile: boolean;
    canCreateProject: boolean;
  };
}
```

---

## 6. API Contract

### 6.1 Authentication

| Method | Path | Auth | Request | Response |
|---|---|---|---|---|
| POST | `/auth/register` | Public | `{ name, email, password, confirmPassword, accountRole? }` | `{ userId, email }` → redirect login |
| POST | `/auth/login` | Public | `{ email, password }` | `{ token, currentUser }` |
| POST | `/auth/logout` | Authenticated | — | `{ success: true }` |
| GET | `/auth/me` | Authenticated | — | `AuthState` |

### 6.2 Users

| Method | Path | Auth | Request | Response |
|---|---|---|---|---|
| GET | `/users/{userId}` | Authenticated | — | `UserProfileViewModel` |
| PUT | `/users/{userId}` | Self only | `{ name, email, password?, confirmPassword? }` | `{ user }` |
| GET | `/users` | Site Admin | — | `User[]` |

### 6.3 Projects

| Method | Path | Auth | Request | Response |
|---|---|---|---|---|
| GET | `/projects` | Authenticated | query: `?ownerId=` | `ProjectListViewModel` |
| POST | `/projects` | Authenticated | `{ name, shortDescription?, description?, organisationName?, country, city?, address? }` | `{ projectId }` → redirect |
| GET | `/projects/{projectId}` | Project Member+ | — | `ProjectDashboardViewModel` |
| PUT | `/projects/{projectId}` | Project Owner+ | `{ name?, country?, ... }` | `{ project }` |
| DELETE | `/projects/{projectId}` | Project Owner+ (confirm) | — | `{ success }` |

### 6.4 Memberships

| Method | Path | Auth | Request | Response |
|---|---|---|---|---|
| GET | `/projects/{projectId}/memberships` | Project Owner+ | — | `ProjectMembership[]` |
| POST | `/projects/{projectId}/memberships` | Project Owner+ | `{ email, projectRole }` | `{ membership }` |
| DELETE | `/projects/{projectId}/memberships/{userId}` | Project Owner+ (confirm) | — | `{ success }` |

### 6.5 Membership Requests

| Method | Path | Auth | Request | Response |
|---|---|---|---|---|
| POST | `/projects/{projectId}/requests` | Registered User | `{ message? }` | `{ request }` |
| GET | `/projects/{projectId}/requests` | Project Owner+ | — | `MembershipRequest[]` |
| PUT | `/projects/{projectId}/requests/{requestId}/approve` | Project Owner+ | — | `{ membership }` |
| PUT | `/projects/{projectId}/requests/{requestId}/disapprove` | Project Owner+ (confirm) | `{ decisionNote? }` | `{ request }` |

### 6.6 Invitations

| Method | Path | Auth | Request | Response |
|---|---|---|---|---|
| POST | `/projects/{projectId}/invitations` | Project Owner+ | `{ email, message? }` | `{ invitation }` |
| GET | `/projects/{projectId}/invitations` | Project Owner+ | — | `Invitation[]` |
| PUT | `/invitations/{invitationId}/accept` | Authenticated | — | `{ membership }` |
| PUT | `/invitations/{invitationId}/decline` | Authenticated | — | `{ invitation }` |

### 6.7 Buildings

| Method | Path | Auth | Request | Response |
|---|---|---|---|---|
| GET | `/projects/{projectId}/buildings` | Project Member+ | — | `Building[]` |
| POST | `/projects/{projectId}/buildings` | Project Member+ | `{ name, northAxis?, general... }` | `{ buildingId }` |
| GET | `/buildings/{buildingId}` | Project Member+ | — | `BuildingEditorViewModel` |
| PUT | `/buildings/{buildingId}` | Edit allowed | `{ name?, general... }` | `{ building }` |
| DELETE | `/buildings/{buildingId}` | Project Owner+ (confirm) | — | `{ success }` |

### 6.8 SRI

| Method | Path | Auth | Request | Response |
|---|---|---|---|---|
| GET | `/buildings/{buildingId}/sri` | Project Member+ | — | `SRIWorkflowViewModel` |
| PUT | `/buildings/{buildingId}/sri/method` | Edit allowed | `{ method, jurisdiction, assessmentDate }` | `{ sri }` |
| PUT | `/buildings/{buildingId}/sri/weightings` | Edit allowed | `{ hasDefaultWeightings, impacts?, domainWeightings? }` | `{ sri }` |
| GET | `/buildings/{buildingId}/sri/services` | Project Member+ | — | `SRIServiceEntry[]` |
| PUT | `/buildings/{buildingId}/sri/services/{domain}` | Edit allowed | `{ services: [{ serviceCode, applicable, triage, level, compliance }] }` | `{ services }` |
| GET | `/buildings/{buildingId}/sri/results` | Project Member+ | — | `SRIResults` |
| POST | `/buildings/{buildingId}/sri/calculate` | Edit allowed | — | `{ results }` |

### 6.9 EPB

| Method | Path | Auth | Request | Response |
|---|---|---|---|---|
| GET | `/buildings/{buildingId}/epb` | Project Member+ | — | `EPBWorkflowViewModel` |
| PUT | `/buildings/{buildingId}/epb/settings` | Edit allowed | `{ runPeriod, timestep, groundTemp? }` | `{ settings }` |
| PUT | `/buildings/{buildingId}/epb/library` | Edit allowed | `{ materials?, glazing?, constructions?, schedules?, thermostats?, humidistats? }` | `{ library }` |
| PUT | `/buildings/{buildingId}/epb/zones` | Edit allowed | `{ zones: [...] }` | `{ zones }` |
| GET | `/buildings/{buildingId}/epb/validation` | Project Member+ | — | `{ validation, issues }` |
| GET | `/buildings/{buildingId}/epb/results` | Project Member+ | — | `EPCIndicators` |

### 6.10 Calculation

| Method | Path | Auth | Request | Response |
|---|---|---|---|---|
| POST | `/buildings/{buildingId}/calculation-runs` | Project Member+ | — | `{ runId }` → queued |
| GET | `/buildings/{buildingId}/calculation-runs` | Project Member+ | — | `CalculationRun[]` |
| GET | `/calculation-runs/{runId}` | Project Member+ | — | `CalculationRun + output` |

### 6.11 Site Admin

| Method | Path | Auth | Request | Response |
|---|---|---|---|---|
| GET | `/admin/project-owners` | Site Admin | — | `User[]` (only owners) |
| POST | `/admin/select-owner/{userId}` | Site Admin | — | `{ sessionContext }` |
| POST | `/admin/exit-owner-view` | Site Admin | — | `{ success }` |

### 6.12 Audit

| Method | Path | Auth | Request | Response |
|---|---|---|---|---|
| GET | `/audit-logs` | Site Admin | query: `?userId=&action=&from=&to=` | `AuditLog[]` |

---

## 7. Permission Matrix

### 7.1 By Role × Action

| Action | Guest | Registered User | Project Member | Project Owner | Site Admin |
|---|---|---|---|---|---|
| View login/register | ✅ | ❌ | ❌ | ❌ | ❌ |
| Edit own profile | ❌ | ✅ | ✅ | ✅ | ✅ |
| Create project | ❌ | ✅ | ❌ | ✅ | ✅ |
| Request membership | ❌ | ✅ | ❌ | ❌ | ❌ |
| View project list | ❌ | ✅ | ✅ | ✅ | ✅ |
| View project dashboard | ❌ | ❌* | ✅ (own) | ✅ (own) | ✅ (context) |
| Create building | ❌ | ❌ | ✅ | ✅ | ✅ (context) |
| Edit own building | ❌ | ❌ | ✅ | ✅ | ✅ (context) |
| Edit any building in project | ❌ | ❌ | ❌ | ✅ | ✅ (context) |
| Run calculation | ❌ | ❌ | ✅ (own) | ✅ | ✅ (context) |
| Manage project users | ❌ | ❌ | ❌ | ✅ | ✅ |
| Approve membership requests | ❌ | ❌ | ❌ | ✅ | ✅ |
| Invite by email | ❌ | ❌ | ❌ | ✅ | ✅ |
| Remove member | ❌ | ❌ | ❌ | ✅ | ✅ |
| Edit project settings | ❌ | ❌ | ❌ (read-only) | ✅ | ✅ |
| Archive project | ❌ | ❌ | ❌ | ✅ | ✅ |
| Delete project | ❌ | ❌ | ❌ | ✅ (confirm) | ✅ (confirm) |
| Site Admin Console | ❌ | ❌ | ❌ | ❌ | ✅ |
| Select owner context | ❌ | ❌ | ❌ | ❌ | ✅ |
| View audit logs | ❌ | ❌ | ❌ | ❌ | ✅ |

> *Registered User can see project details but cannot open the dashboard unless they are a member/owner.

### 7.2 Membership Status × Allowed Actions

| Status | openDashboard | manageUsers | createBuilding | editOwn | editAll | runCalc |
|---|---|---|---|---|---|---|
| OWNER | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| APPROVED | ✅ | ❌ | ✅ | ✅ | ❌ | ✅ (own) |
| PENDING | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| INVITED | ❌ (accept first) | ❌ | ❌ | ❌ | ❌ | ❌ |
| DISAPPROVED | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| REMOVED | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| NONE | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

### 7.3 Destructive Action Safeguards

| Action | Requires Confirmation | Audit Log | Allowed Roles | Additional Guard |
|---|---|---|---|---|
| Archive project | ✅ | ✅ | Project Owner, Site Admin | — |
| Delete project | ✅ | ✅ | Project Owner, Site Admin | Backend must prevent if policy disallows |
| Reject membership request | ✅ | ❌ | Project Owner, Site Admin | — |
| Remove member | ✅ | ❌ | Project Owner, Site Admin | Cannot remove only Project Owner |

---

## 8. Page-to-Data Map

| Page / View | File | Consumes View Model | Writes To | Backend Permission |
|---|---|---|---|---|
| Login | `view/login.html` | `AuthState` | `/auth/login` | Public |
| Register | `view/register.html` | — | `/auth/register` | Public |
| User Profile | `view/user-profile.html` | `UserProfileViewModel` | `/users/{userId}` | Self-only |
| Project List | `view/project-list.html` | `ProjectListViewModel` | `/projects`, `/projects/{id}/requests` | Authenticated |
| Create Project | `view/create-project.html` | — | `POST /projects` | Authenticated (create allowed) |
| Project Dashboard | `view/A-projects-dashboard.html` | `ProjectDashboardViewModel` | building actions | Project Member+ |
| Project Users | `view/project-users.html` | members, requests, invitations | membership endpoints | Project Owner+ |
| Project Settings | `view/project-settings.html` | `project` | `PUT /projects/{id}` | Project Owner+ |
| Add New Building | `view/B-add-new-building.html` | project context | `POST /projects/{id}/buildings` | Project Member+ |
| Open/Edit Building | `view/C-open-edit-building.html` | `BuildingEditorViewModel` | `PUT /buildings/{id}` | Edit allowed |
| SRI Methodology | `view/SRI1-methodology-selection.html` | sri.method, jurisdiction | `PUT /buildings/{id}/sri/method` | Edit allowed |
| SRI Default Weightings | `view/SRI2-Default-weightings.html` | sri.weighting, domainsPresence | `PUT /buildings/{id}/sri/weightings` | Edit allowed |
| SRI Custom Weightings | `view/SRI3-weighting-settings.html` | sri.weighting (custom) | `PUT /buildings/{id}/sri/weightings` | Edit allowed |
| SRI Domain Tabs | `view/SRI[5-13]-*.html` | `SRIServiceEntry[]` per domain | `PUT /buildings/{id}/sri/services/{domain}` | Edit allowed |
| SRI Results | `view/SRI14-results.html` | `SRIWorkflowViewModel` | `POST /buildings/{id}/sri/calculate` | View/Edit allowed |
| EPB Calculation Settings | `view/EPB1-calculation-settings.html` | epb.settings | `PUT /buildings/{id}/epb/settings` | Edit allowed |
| EPB Ground Temperature | `view/EPB1b-ground-temperature.html` | epb.settings.groundTemp | `PUT /buildings/{id}/epb/settings` | Edit allowed |
| EPB Materials & Constructions | `view/EPB2-materials-constructions.html` | epb.library | `PUT /buildings/{id}/epb/library` | Edit allowed |
| EPB Thermal Zones | `view/EPB3-thermal-zones-envelope.html` | epb.zones, surfaces, subsurfaces | `PUT /buildings/{id}/epb/zones` | Edit allowed |
| EPB Spaces | `view/EPB-spaces-tab.html` | epb.zones.spaces | `PUT /buildings/{id}/epb/zones` | Edit allowed |
| EPB Operations | `view/EPB-operations-tab.html` | schedules, thermostats, gains | `PUT /buildings/{id}/epb/library + zones` | Edit allowed |
| EPB Results Summary | `view/EPB4-results-summary.html` | `EPCIndicators` | (read-only) | View allowed |
| Site Admin Console | `view/site-admin-console.html` | project owners list | `/admin/select-owner/{id}` | Site Admin only |

---

## Appendix: Navigation Flow

```
Login/Register
  ↓ auth success
Project List                         ← also after profile edit
  ├─→ Create Project → become owner → Project Dashboard
  ├─→ Project Details popup → request membership → Pending state
  ├─→ (if owner) Project Users management
  ├─→ (if owner) Project Settings
  └─→ (if approved/owner) Project Dashboard
       ├─→ Add New Building → Building Editor
       ├─→ Open/Edit Building → Building Editor
       │    ├─→ SRI1 (methodology) → SRI2/SRI3 (weightings) → SRI14 (results)
       │    │    └─→ SRI[5-13] domain tabs ←→ SRI14
       │    ├─→ EPB1 (settings) → EPB1b → EPB2 → EPB3 → EPB Spaces → EPB Ops → EPB4
       │    └─→ Run Calculation Engine → CE0→CE1→...→CE6 → EPB4
       └─→ Project Settings
```

---

> **End of Contract Document v2.0**  
> Frontend: generate interfaces from sections 1 + 5.  
> Backend: generate tables from sections 1 + 2 + 3 + 4.  
> API: implement routes from section 6.  
> Permissions: enforce rules from sections 7 + 6.