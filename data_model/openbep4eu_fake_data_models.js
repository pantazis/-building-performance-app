/**
 * OpenBEP4EU fake data models
 * Source: ../../Downloads/openbep4eu_fake_json_data_models.md
 */

const users = [
  {
    id: "usr_001",
    fullName: "Maria Papadopoulou",
    email: "maria.assessor@example.com",
    role: "ASSESSOR",
    organisationId: "org_001",
    status: "ACTIVE",
    createdAt: "2026-04-24T09:00:00Z",
  },
  {
    id: "usr_002",
    fullName: "Nikos Georgiou",
    email: "nikos.owner@example.com",
    role: "BUILDING_OWNER",
    organisationId: "org_002",
    status: "ACTIVE",
    createdAt: "2026-04-24T09:10:00Z",
  },
  {
    id: "usr_003",
    fullName: "Admin User",
    email: "admin@example.com",
    role: "ADMIN",
    organisationId: "org_001",
    status: "ACTIVE",
    createdAt: "2026-04-24T09:20:00Z",
  },
];

const organisations = [
  {
    id: "org_001",
    name: "OpenBEP Assessment Office",
    type: "ASSESSOR_COMPANY",
    country: "Greece",
    city: "Athens",
    email: "info@openbep-assessors.example.com",
    status: "ACTIVE",
  },
  {
    id: "org_002",
    name: "Green Buildings Group",
    type: "BUILDING_OWNER",
    country: "Greece",
    city: "Athens",
    email: "office@greenbuildings.example.com",
    status: "ACTIVE",
  },
];

const buildings = [
  {
    id: "bld_001",
    name: "Athens Office Building",
    type: "OFFICE",
    status: "READY_FOR_CALCULATION",
    ownerOrganisationId: "org_002",
    assessorUserId: "usr_001",
    address: {
      country: "Greece",
      city: "Athens",
      street: "Example Street 10",
      postcode: "10557",
      latitude: 37.9838,
      longitude: 23.7275,
    },
    basicInfo: {
      yearBuilt: 2005,
      floors: 5,
      totalAreaM2: 4200,
      heatedAreaM2: 3900,
      cooledAreaM2: 3200,
      occupancyType: "COMMERCIAL",
      usageSchedule: "MON_FRI_08_18",
    },
    createdAt: "2026-04-24T10:00:00Z",
    updatedAt: "2026-04-24T11:00:00Z",
  },
  {
    id: "bld_002",
    name: "Residential Block A",
    type: "MULTI_FAMILY_RESIDENTIAL",
    status: "MISSING_DATA",
    ownerOrganisationId: "org_002",
    assessorUserId: "usr_001",
    address: {
      country: "Greece",
      city: "Thessaloniki",
      street: "Demo Avenue 22",
      postcode: "54623",
      latitude: 40.6401,
      longitude: 22.9444,
    },
    basicInfo: {
      yearBuilt: 1998,
      floors: 6,
      totalAreaM2: 5800,
      heatedAreaM2: 5400,
      cooledAreaM2: 2100,
      occupancyType: "RESIDENTIAL",
      usageSchedule: "DAILY",
    },
    createdAt: "2026-04-24T10:20:00Z",
    updatedAt: "2026-04-24T10:30:00Z",
  },
];

const buildingEnvelope = [
  {
    id: "env_001",
    buildingId: "bld_001",
    walls: [
      {
        id: "wall_001",
        name: "External wall north",
        areaM2: 650,
        uValueWm2K: 0.45,
        material: "Brick + insulation",
        orientation: "NORTH",
      },
      {
        id: "wall_002",
        name: "External wall south",
        areaM2: 720,
        uValueWm2K: 0.48,
        material: "Brick + insulation",
        orientation: "SOUTH",
      },
    ],
    windows: [
      {
        id: "win_001",
        name: "Double glazing north",
        areaM2: 180,
        uValueWm2K: 2.1,
        gValue: 0.62,
        frameType: "Aluminium",
        orientation: "NORTH",
      },
    ],
    roof: {
      areaM2: 850,
      uValueWm2K: 0.32,
      material: "Concrete roof with insulation",
    },
    floor: {
      areaM2: 850,
      uValueWm2K: 0.55,
      material: "Concrete slab",
    },
  },
];

const technicalSystems = [
  {
    id: "sys_001",
    buildingId: "bld_001",
    heating: {
      systemType: "GAS_BOILER",
      efficiency: 0.88,
      fuel: "NATURAL_GAS",
      capacityKw: 350,
      yearInstalled: 2015,
    },
    cooling: {
      systemType: "VRF",
      seer: 4.2,
      capacityKw: 280,
      yearInstalled: 2018,
    },
    ventilation: {
      systemType: "MECHANICAL_VENTILATION",
      heatRecovery: true,
      heatRecoveryEfficiency: 0.72,
    },
    domesticHotWater: {
      systemType: "ELECTRIC_BOILER",
      efficiency: 0.95,
      capacityKw: 40,
    },
    lighting: {
      systemType: "LED",
      installedPowerWm2: 8.5,
      controls: "OCCUPANCY_AND_DAYLIGHT",
    },
    renewables: [
      {
        type: "PV",
        capacityKw: 60,
        annualProductionKwh: 84000,
      },
    ],
  },
];

const auditRecords = [
  {
    id: "aud_001",
    buildingId: "bld_001",
    assessorUserId: "usr_001",
    status: "VALIDATED",
    inputMethod: "BIM_AND_MANUAL",
    bimFileId: "file_001",
    manualDataCompleted: true,
    validation: {
      isValid: true,
      missingFields: [],
      warnings: ["Cooling system maintenance date is older than 3 years."],
      errors: [],
    },
    createdAt: "2026-04-24T10:30:00Z",
    validatedAt: "2026-04-24T10:45:00Z",
  },
  {
    id: "aud_002",
    buildingId: "bld_002",
    assessorUserId: "usr_001",
    status: "MISSING_DATA",
    inputMethod: "MANUAL",
    bimFileId: null,
    manualDataCompleted: false,
    validation: {
      isValid: false,
      missingFields: ["roof.uValueWm2K", "heating.efficiency", "windows.gValue"],
      warnings: [],
      errors: ["Heating system efficiency is required before calculation."],
    },
    createdAt: "2026-04-24T10:35:00Z",
    validatedAt: null,
  },
];

const files = [
  {
    id: "file_001",
    buildingId: "bld_001",
    fileName: "athens-office.ifc",
    fileType: "IFC",
    sizeMb: 12.5,
    uploadedBy: "usr_001",
    uploadStatus: "PROCESSED",
    url: "/fake-files/athens-office.ifc",
    createdAt: "2026-04-24T10:25:00Z",
  },
  {
    id: "file_002",
    buildingId: "bld_001",
    fileName: "energy-report-draft.pdf",
    fileType: "PDF",
    sizeMb: 1.8,
    uploadedBy: "usr_001",
    uploadStatus: "READY",
    url: "/fake-files/energy-report-draft.pdf",
    createdAt: "2026-04-24T11:10:00Z",
  },
];

const epbCalculations = [
  {
    id: "epb_001",
    buildingId: "bld_001",
    auditRecordId: "aud_001",
    status: "COMPLETED",
    standardFamily: "CEN_ISO_52000",
    calculationType: "ASSET_RATING",
    scenario: "AS_IS",
    startedAt: "2026-04-24T11:00:00Z",
    completedAt: "2026-04-24T11:02:00Z",
    results: {
      primaryEnergyKwhM2Year: 145.7,
      finalEnergyKwhM2Year: 118.4,
      co2KgM2Year: 32.5,
      renewableSharePercent: 18,
      energyClass: "C",
      heatingDemandKwhM2Year: 55.2,
      coolingDemandKwhM2Year: 34.7,
    },
  },
];

const sriCalculations = [
  {
    id: "sri_001",
    buildingId: "bld_001",
    auditRecordId: "aud_001",
    status: "COMPLETED",
    startedAt: "2026-04-24T11:03:00Z",
    completedAt: "2026-04-24T11:04:00Z",
    results: {
      sriScorePercent: 62,
      smartReadinessClass: "B",
      domains: [
        { name: "Heating", scorePercent: 58 },
        { name: "Cooling", scorePercent: 64 },
        { name: "Lighting", scorePercent: 72 },
        { name: "Energy Management", scorePercent: 55 },
      ],
    },
  },
];

const kpis = [
  {
    id: "kpi_001",
    buildingId: "bld_001",
    epbCalculationId: "epb_001",
    sriCalculationId: "sri_001",
    summary: {
      energyClass: "C",
      sriClass: "B",
      primaryEnergyKwhM2Year: 145.7,
      co2KgM2Year: 32.5,
      annualEnergyCostEuro: 68200,
      renewableSharePercent: 18,
    },
    labels: ["Needs improvement", "Good smart readiness", "PV installed"],
    updatedAt: "2026-04-24T11:05:00Z",
  },
];

const renovationRecommendations = [
  {
    id: "rec_001",
    buildingId: "bld_001",
    title: "Improve roof insulation",
    category: "ENVELOPE",
    priority: "HIGH",
    description: "Improve the roof insulation to reduce heating and cooling demand.",
    estimatedCostEuro: 42000,
    estimatedAnnualSavingsEuro: 8200,
    estimatedEnergySavingPercent: 12,
    paybackYears: 5.1,
    impact: {
      energyClassAfter: "B",
      co2ReductionKgYear: 18500,
    },
  },
  {
    id: "rec_002",
    buildingId: "bld_001",
    title: "Upgrade lighting controls",
    category: "SMART_SYSTEMS",
    priority: "MEDIUM",
    description: "Add more advanced daylight and occupancy controls.",
    estimatedCostEuro: 15000,
    estimatedAnnualSavingsEuro: 3600,
    estimatedEnergySavingPercent: 5,
    paybackYears: 4.2,
    impact: {
      sriClassAfter: "A",
      co2ReductionKgYear: 4200,
    },
  },
];

const reports = [
  {
    id: "rep_001",
    buildingId: "bld_001",
    type: "EPC_AND_SRI_REPORT",
    status: "GENERATED",
    title: "Athens Office Building Energy Performance Report",
    generatedBy: "usr_001",
    generatedAt: "2026-04-24T11:15:00Z",
    fileUrl: "/fake-files/reports/athens-office-epc-sri-report.pdf",
    sections: [
      "Building summary",
      "EPB results",
      "SRI results",
      "KPIs",
      "Renovation recommendations",
    ],
  },
];

const dataHubItems = [
  {
    id: "hub_001",
    title: "Example office building EPC dataset",
    description: "An anonymised example dataset for office building energy performance.",
    type: "DATASET",
    visibility: "PUBLIC",
    uploadedBy: "usr_001",
    organisationId: "org_001",
    tags: ["EPC", "office", "Greece", "SRI"],
    fileUrl: "/fake-files/data-hub/office-epc-dataset.json",
    createdAt: "2026-04-24T12:00:00Z",
  },
  {
    id: "hub_002",
    title: "Good practice: smart lighting upgrade",
    description: "Example of a smart lighting upgrade that improved SRI score.",
    type: "GOOD_PRACTICE",
    visibility: "PUBLIC",
    uploadedBy: "usr_001",
    organisationId: "org_001",
    tags: ["lighting", "smart readiness", "renovation"],
    fileUrl: "/fake-files/data-hub/smart-lighting-good-practice.pdf",
    createdAt: "2026-04-24T12:20:00Z",
  },
];

const sharingRequests = [
  {
    id: "shr_001",
    requesterOrganisationId: "org_003",
    providerOrganisationId: "org_001",
    buildingId: "bld_001",
    requestedData: ["EPB_RESULTS", "SRI_RESULTS", "ANONYMISED_KPIS"],
    purpose: "Green financing assessment",
    status: "PENDING_APPROVAL",
    createdAt: "2026-04-24T12:30:00Z",
    reviewedAt: null,
  },
];

const notifications = [
  {
    id: "not_001",
    userId: "usr_001",
    type: "CALCULATION_COMPLETED",
    title: "EPB calculation completed",
    message: "The EPB calculation for Athens Office Building is complete.",
    read: false,
    createdAt: "2026-04-24T11:02:10Z",
  },
  {
    id: "not_002",
    userId: "usr_001",
    type: "VALIDATION_ERROR",
    title: "Missing building data",
    message: "Residential Block A is missing heating efficiency and roof U-value.",
    read: false,
    createdAt: "2026-04-24T10:36:00Z",
  },
];

const activityLog = [
  {
    id: "log_001",
    actorUserId: "usr_001",
    action: "BUILDING_CREATED",
    entityType: "BUILDING",
    entityId: "bld_001",
    description: "Created building Athens Office Building.",
    createdAt: "2026-04-24T10:00:00Z",
  },
  {
    id: "log_002",
    actorUserId: "usr_001",
    action: "EPB_CALCULATION_COMPLETED",
    entityType: "EPB_CALCULATION",
    entityId: "epb_001",
    description: "Completed EPB calculation for Athens Office Building.",
    createdAt: "2026-04-24T11:02:00Z",
  },
];

const enums = {
  userRoles: [
    "ADMIN",
    "ASSESSOR",
    "BUILDING_OWNER",
    "DATA_OWNER",
    "EXTERNAL_DEVELOPER",
    "EXTERNAL_DATA_CONSUMER",
    "PUBLIC_USER",
  ],
  buildingStatus: [
    "DRAFT",
    "MISSING_DATA",
    "READY_FOR_CALCULATION",
    "CALCULATION_RUNNING",
    "CALCULATED",
    "REPORT_GENERATED",
    "ARCHIVED",
  ],
  calculationStatus: ["QUEUED", "RUNNING", "COMPLETED", "FAILED"],
  buildingTypes: [
    "SINGLE_FAMILY_RESIDENTIAL",
    "MULTI_FAMILY_RESIDENTIAL",
    "OFFICE",
    "SCHOOL",
    "HOSPITAL",
    "RETAIL",
    "HOTEL",
    "MIXED_USE",
  ],
  dataHubItemTypes: ["DATASET", "GOOD_PRACTICE", "REPORT", "GUIDELINE", "CASE_STUDY"],
};

const dataModel = {
  users,
  organisations,
  buildings,
  buildingEnvelope,
  technicalSystems,
  auditRecords,
  files,
  epbCalculations,
  sriCalculations,
  kpis,
  renovationRecommendations,
  reports,
  dataHubItems,
  sharingRequests,
  notifications,
  activityLog,
  enums,
};

module.exports = {
  users,
  organisations,
  buildings,
  buildingEnvelope,
  technicalSystems,
  auditRecords,
  files,
  epbCalculations,
  sriCalculations,
  kpis,
  renovationRecommendations,
  reports,
  dataHubItems,
  sharingRequests,
  notifications,
  activityLog,
  enums,
  dataModel,
};
