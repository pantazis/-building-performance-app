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

  projects: [
    {
      id: "project-1",
      name: "Demo Building",
      lastModified: "2026-04-29",

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

            // Tab 1: Ground Temperature Calculation Properties
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