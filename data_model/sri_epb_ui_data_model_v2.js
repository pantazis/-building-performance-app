export const AppDataModel = {
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

  projects: [
    {
      id: "project-1",
      name: "Demo Building",
      lastModified: "2026-04-29",

      building: {
        id: "building-1",
        name: "Office Athens",

        general: {
          type: "Non-Residential",
          usage: "Offices",
          country: "Greece",
          floorArea: "1000-10000",
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
            runPeriod: { start: "01-01", end: "12-31" },
            timestep: 1
          },

          library: {
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

              ventilation: {
                airChangesPerHour: 1.5
              },

              needsSystem: {
                heating: 5000,
                cooling: 4000
              },

              surfaces: [
                {
                  id: "wall1",
                  type: "wall",
                  area: 50,
                  azimuth: 90,
                  tilt: 90,

                  subsurfaces: [
                    {
                      id: "window1",
                      type: "window",
                      area: 10
                    }
                  ]
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
          method: "A",

          domainsPresence: {
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
            impacts: {
              energyEfficiency: 20,
              maintenance: 10,
              comfort: 15,
              convenience: 15,
              health: 10,
              info: 10,
              flexibility: 20
            },

            domainImpact: {
              heating: 20,
              cooling: 10,
              lighting: 10
            }
          },

          services: {
            heating: [
              {
                id: "H1a",
                applicable: true,
                level: 2,
                compliance: 1
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