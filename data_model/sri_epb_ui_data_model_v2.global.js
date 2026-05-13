// Global (non-module) mirror for file:// usage without a dev server.
// Source of truth remains: sri_epb_ui_data_model_v2.js

window.AppDataModel = {
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
    ]
  },
  projects: [
    {
      id: "project-1",
      name: "Demo Building",
      lastModified: "2026-04-29",
      building: {
        id: "building-1",
        name: "Office Athens",
        epb: {
          provenance: {
            sourceType: "JSON",
            sourceFile: "openbep4eu-json-instance"
          },
          validation: {
            schemaValid: true,
            referenceIntegrityValid: true,
            semanticConstraintsValid: true,
            issues: []
          },
          transformation: {
            status: "READY"
          },
          settings: {
            runPeriod: { start: "01-01", end: "12-31" },
            runPeriodDetailed: {
              beginMonth: 1,
              beginDayOfMonth: 1,
              endMonth: 12,
              endDayOfMonth: 31
            },
            timestep: 1,
            timeStep: { numberPerHour: 1 },
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
                conductivity: 1.8,
                heatCapacity: 2.1
              }
            ]
          },
          library: {
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
            glazingSimpleSystem: [
              {
                id: "glz1",
                uFactor: 1.6,
                solarHeatGainCoefficient: 0.45,
                visibleTransmittance: 0.6
              }
            ],
            construction: [
              {
                id: "cons1",
                constructionClass: "MassEquallyDistributed",
                outsideLayerMaterialId: "mat1",
                layerMaterialIds: ["mat1"]
              }
            ],
            scheduleConstant: [
              { id: "sch-occ-1", type: "Occupancy", hourlyValue: 1 },
              { id: "sch-act-1", type: "Activity", hourlyValue: 120 },
              { id: "sch-cool-sp-1", type: "CoolingSetpoint", hourlyValue: 26 },
              { id: "sch-vent-1", type: "Ventilation", hourlyValue: 1 }
            ],
            thermostat: [
              { id: "th-1", constantHeatingSetpoint: 21, coolingSetpointSchedule: "sch-cool-sp-1" }
            ],
            humidistat: [
              { id: "hum-1", constantDehumidificationSetpoint: 60, constantHumidificationSetpoint: 35 }
            ]
          },
          orchestration: {
            executionOrder: ["dataImport", "dataValidation", "dataTransformation", "hourlyNeeds", "systems", "aggregation"],
            status: "READY_FOR_CALCULATION"
          }
        }
      }
    }
  ]
};
