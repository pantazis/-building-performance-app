# OpenBEP4EU Website — Data Map and User Journeys

## 1. Data Map

The system is built around this main flow:

```text
INPUT → PROCESS → OUTPUT → SHARE
```

## Core Data Flow

```text
[User / External App]
        ↓
[Audit / Input Layer]
        ↓
[Common Data Model / Storage]
        ↓
[Calculation Engine]
        ↓
[Results / KPIs / Reports]
        ↓
[Sharing / API / Data Hub]
```

## Main Data Objects

### Building

```text
Building
├── id
├── name
├── address / location
├── type
├── owner
├── geometry
├── materials
├── technical systems
├── usage data
├── BIM / IFC file
└── audit status
```

### Audit Data

```text
Audit Data
├── building_id
├── uploaded BIM / IFC
├── manual form inputs
├── missing data fields
├── validation status
└── submitted_by
```

### Calculation Engine

```text
Engine
├── EPB calculation
├── SRI calculation
├── KPI generation
├── validation rules
└── report generation
```

### Results

```text
Results
├── EPC / EPB score
├── SRI score
├── energy KPIs
├── CO2 KPIs
├── renovation recommendations
├── report file
└── export status
```

### Sharing / Data Hub

```text
Sharing
├── API access
├── Data Hub records
├── shared datasets
├── access permissions
├── download options
└── external app integrations
```

---

# 2. Website Views Needed

## MVP Views

Minimum website needs **7–8 views**.

### 1. Dashboard

Purpose:

- Show overview
- Show buildings
- Show recent calculations
- Show alerts / status

### 2. Building List

Purpose:

- View all buildings
- Search buildings
- Filter by status
- Open building details

### 3. Building Details

Purpose:

- View full building information
- View audit data
- View EPB / SRI results
- Start calculation

### 4. Create / Edit Building

Purpose:

- Add building
- Upload BIM / IFC file
- Fill missing audit data
- Validate form fields

### 5. Calculation View

Purpose:

- Run EPB calculation
- Run SRI calculation
- Show calculation status
- Show validation errors

### 6. Results View

Purpose:

- Show KPIs
- Show EPC / EPB score
- Show SRI score
- Show charts
- Show recommendations

### 7. Reports View

Purpose:

- Generate report
- Preview report
- Export PDF
- Download report

### 8. Data Hub / Sharing View

Purpose:

- Browse shared data
- Upload dataset
- Search data hub
- Share results with external systems

## Full System Views

Full version can have **10–12 views**.

Extra views:

### 9. API / Developer View

Purpose:

- API keys
- API documentation
- External app connection

### 10. User Profile / Settings

Purpose:

- User account
- Preferences
- Organisation settings

### 11. Admin Users / Roles

Purpose:

- Manage users
- Manage permissions
- Assign roles

### 12. Notifications / Activity Log

Purpose:

- Show system events
- Show completed calculations
- Show upload / validation history

---

# 3. All Possible User Journeys

## Journey 1 — Energy Assessor: Audit → Calculate → Report

```text
Login
→ Dashboard
→ Buildings list
→ Add new building
→ Upload BIM / IFC file
→ Fill missing audit data
→ Validate data
→ Save building
→ Run EPB calculation
→ Run SRI calculation
→ View KPIs / scores
→ Generate report
→ Export / share report
```

Goal:

The assessor collects building data, runs calculations, and creates the final report.

Needed views:

```text
Login
Dashboard
Building List
Create / Edit Building
Calculation View
Results View
Reports View
```

---

## Journey 2 — Building Owner / Manager: View Results

```text
Login
→ My buildings
→ Select building
→ View EPC / EPB result
→ View SRI result
→ View recommendations
→ View renovation guidance
→ Download report
```

Goal:

The building owner understands the building performance and what to improve.

Needed views:

```text
Login
Dashboard
Building Details
Results View
Reports View
```

---

## Journey 3 — Data Owner: Upload to Bauhaus Data Hub

```text
Login
→ Data Hub
→ Add dataset / file
→ Select data type
→ Upload file or enter data
→ Validate metadata
→ Save to Data Hub
→ Confirmation
```

Goal:

A privileged user uploads useful datasets or good practices into the Data Hub.

Needed views:

```text
Login
Data Hub
Upload Dataset
Validation / Confirmation
```

---

## Journey 4 — Anonymous / Public User: Browse Data Hub

```text
Open website
→ Data Hub
→ Search / filter
→ Open dataset or good practice
→ Read online
→ Download if allowed
```

Goal:

A public user can browse open information without logging in.

Needed views:

```text
Public Home
Data Hub
Dataset Details
Download / Read View
```

---

## Journey 5 — External App / API Developer

```text
Developer app connects
→ Sends building / audit data
→ Calls EPB calculation API
→ Calls SRI calculation API
→ Receives KPIs / results
→ Shows results inside external app
```

Goal:

Third-party applications use the engine without using the main website UI.

Needed views:

```text
API Documentation
Developer Dashboard
API Keys
Integration Logs
```

---

## Journey 6 — External Data Consumer: Secure Data Sharing

```text
External consumer requests data
→ Data provider reviews request
→ Data sharing agreement / negotiation
→ Secure data transfer
→ Consumer receives building data or simulation results
```

Goal:

External systems can access data safely using data-space principles.

Needed views:

```text
Sharing Requests
Request Details
Permissions
Data Transfer Status
```

---

## Journey 7 — Admin: Users, Roles, Permissions

```text
Admin login
→ Users / roles
→ Create user
→ Assign role
→ Set permissions
→ Manage upload / read / share rights
```

Goal:

Admin controls who can upload, calculate, view, and share data.

Needed views:

```text
Admin Dashboard
User Management
Role Management
Permission Settings
Activity Log
```

---

# 4. User Roles

## Main Roles

```text
Assessor
Building Owner / Manager
Data Owner
Anonymous User
External App Developer
External Data Consumer
Admin
```

## Role Permissions

| Role | Main Permissions |
|---|---|
| Assessor | Add building, upload BIM, input audit data, run calculations, generate reports |
| Building Owner / Manager | View building results, view recommendations, download reports |
| Data Owner | Upload datasets, manage data hub records |
| Anonymous User | Browse public data hub content |
| External App Developer | Use APIs, connect third-party apps |
| External Data Consumer | Request and receive shared data |
| Admin | Manage users, roles, permissions, system activity |

---

# 5. Recommended MVP Scope

Start with these **4 journeys** first:

```text
1. Assessor: Add building → Calculate → Report
2. Owner: View results → Download report
3. Public/Data Hub user: Search → View dataset
4. Admin: Manage users and roles
```

## MVP View Count

```text
1. Login
2. Dashboard
3. Building List
4. Building Details
5. Create / Edit Building
6. Calculation View
7. Results View
8. Reports View
9. Data Hub
10. Admin Users / Roles
```

Recommended MVP total: **10 views**.

---

# 6. Simple Mental Model

Think of the website like this:

```text
Add building
→ Fill / upload data
→ Validate
→ Calculate
→ See results
→ Export report
→ Share data
```

That is the main product flow.
