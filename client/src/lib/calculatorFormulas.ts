import { z } from "zod";

export interface CalculationResult {
  result: number;
  unit: string;
  steps: string[];
}

export interface Formula {
  name: string;
  description: string;
  category: string;
  calculate: (inputs: Record<string, number>) => CalculationResult;
  inputs: {
    name: string;
    unit: string;
    description: string;
  }[];
}

export const formulas: Formula[] = [
  {
    name: "Floor Area Ratio (FAR)",
    description: "Calculate the ratio of total floor area to lot area",
    category: "Zoning",
    inputs: [
      {
        name: "totalFloorArea",
        unit: "sq ft",
        description: "Total floor area of all stories"
      },
      {
        name: "lotArea",
        unit: "sq ft",
        description: "Total lot area"
      }
    ],
    calculate: (inputs): CalculationResult => {
      const far = inputs.totalFloorArea / inputs.lotArea;
      return {
        result: far,
        unit: "ratio",
        steps: [
          `Total Floor Area: ${inputs.totalFloorArea} sq ft`,
          `Lot Area: ${inputs.lotArea} sq ft`,
          `FAR = Total Floor Area / Lot Area`,
          `FAR = ${inputs.totalFloorArea} / ${inputs.lotArea} = ${far.toFixed(2)}`
        ]
      };
    }
  },
  {
    name: "Window-to-Wall Ratio",
    description: "Calculate the ratio between window area and total wall area",
    category: "Building Envelope",
    inputs: [
      {
        name: "windowArea",
        unit: "sq ft",
        description: "Total area of windows"
      },
      {
        name: "wallArea",
        unit: "sq ft",
        description: "Total wall area"
      }
    ],
    calculate: (inputs): CalculationResult => {
      const ratio = (inputs.windowArea / inputs.wallArea) * 100;
      return {
        result: ratio,
        unit: "%",
        steps: [
          `Window Area: ${inputs.windowArea} sq ft`,
          `Wall Area: ${inputs.wallArea} sq ft`,
          `Window-to-Wall Ratio = (${inputs.windowArea} / ${inputs.wallArea}) × 100`,
          `Window-to-Wall Ratio = ${ratio.toFixed(2)}%`
        ]
      };
    }
  },
  {
    name: "Occupancy Load Calculator",
    description: "Calculate maximum occupancy based on floor area",
    category: "Building Code",
    inputs: [
      {
        name: "floorArea",
        unit: "sq ft",
        description: "Total usable floor area"
      },
      {
        name: "areaPerOccupant",
        unit: "sq ft",
        description: "Required area per occupant"
      }
    ],
    calculate: (inputs): CalculationResult => {
      const occupants = Math.floor(inputs.floorArea / inputs.areaPerOccupant);
      return {
        result: occupants,
        unit: "people",
        steps: [
          `Floor Area: ${inputs.floorArea} sq ft`,
          `Area per Occupant: ${inputs.areaPerOccupant} sq ft`,
          `Occupancy = Floor Area ÷ Area per Occupant`,
          `Occupancy = ${inputs.floorArea} ÷ ${inputs.areaPerOccupant} = ${occupants} people`
        ]
      };
    }
  },
  {
    name: "Room Acoustics",
    description: "Calculate reverberation time using Sabine's formula",
    category: "Acoustics",
    inputs: [
      {
        name: "volume",
        unit: "cu ft",
        description: "Room volume"
      },
      {
        name: "surfaceArea",
        unit: "sq ft",
        description: "Total surface area"
      },
      {
        name: "absorptionCoeff",
        unit: "α",
        description: "Average absorption coefficient (0-1)"
      }
    ],
    calculate: (inputs): CalculationResult => {
      const rt60 = (0.049 * inputs.volume) / (inputs.surfaceArea * inputs.absorptionCoeff);
      return {
        result: rt60,
        unit: "seconds",
        steps: [
          `Room Volume: ${inputs.volume} cu ft`,
          `Surface Area: ${inputs.surfaceArea} sq ft`,
          `Absorption Coefficient: ${inputs.absorptionCoeff}`,
          `RT60 = (0.049 × Volume) / (Surface Area × Absorption)`,
          `RT60 = (0.049 × ${inputs.volume}) / (${inputs.surfaceArea} × ${inputs.absorptionCoeff})`,
          `RT60 = ${rt60.toFixed(2)} seconds`
        ]
      };
    }
  },
  {
    name: "Thermal Resistance (R-Value)",
    description: "Calculate total R-value for a wall assembly",
    category: "Building Envelope",
    inputs: [
      {
        name: "layers",
        unit: "R-values",
        description: "Number of material layers"
      },
      {
        name: "rValuePerLayer",
        unit: "ft²·°F·h/BTU",
        description: "R-value per layer"
      }
    ],
    calculate: (inputs): CalculationResult => {
      const totalR = inputs.layers * inputs.rValuePerLayer;
      return {
        result: totalR,
        unit: "ft²·°F·h/BTU",
        steps: [
          `Number of Layers: ${inputs.layers}`,
          `R-Value per Layer: ${inputs.rValuePerLayer}`,
          `Total R-Value = Layers × R-Value per Layer`,
          `Total R-Value = ${inputs.layers} × ${inputs.rValuePerLayer} = ${totalR.toFixed(2)}`
        ]
      };
    }
  },
  {
    name: "Daylight Factor",
    description: "Calculate average daylight factor for a room",
    category: "Environmental Design",
    inputs: [
      {
        name: "windowArea",
        unit: "sq ft",
        description: "Total window area"
      },
      {
        name: "floorArea",
        unit: "sq ft",
        description: "Floor area"
      },
      {
        name: "glazingTransmittance",
        unit: "%",
        description: "Glass transmittance (0-100)"
      }
    ],
    calculate: (inputs): CalculationResult => {
      const df = (inputs.windowArea * (inputs.glazingTransmittance / 100)) / (inputs.floorArea * 0.2) * 100;
      return {
        result: df,
        unit: "%",
        steps: [
          `Window Area: ${inputs.windowArea} sq ft`,
          `Floor Area: ${inputs.floorArea} sq ft`,
          `Glass Transmittance: ${inputs.glazingTransmittance}%`,
          `Daylight Factor = (Window Area × Transmittance) / (Floor Area × 0.2) × 100`,
          `Daylight Factor = ${df.toFixed(2)}%`
        ]
      };
    }
  },
  {
    name: "Parking Space Requirements",
    description: "Calculate required parking spaces based on building area",
    category: "Parking",
    inputs: [
      {
        name: "buildingArea",
        unit: "sq ft",
        description: "Total building floor area"
      },
      {
        name: "ratio",
        unit: "sq ft per space",
        description: "Required floor area per parking space"
      },
      {
        name: "visitorPercentage",
        unit: "%",
        description: "Additional percentage for visitor parking"
      }
    ],
    calculate: (inputs): CalculationResult => {
      const baseSpaces = Math.ceil(inputs.buildingArea / inputs.ratio);
      const totalSpaces = Math.ceil(baseSpaces * (1 + inputs.visitorPercentage / 100));
      return {
        result: totalSpaces,
        unit: "spaces",
        steps: [
          `Building Area: ${inputs.buildingArea} sq ft`,
          `Area per Space: ${inputs.ratio} sq ft`,
          `Base Spaces = ${inputs.buildingArea} / ${inputs.ratio} = ${baseSpaces}`,
          `Visitor Addition: ${inputs.visitorPercentage}%`,
          `Total Spaces = ${baseSpaces} × (1 + ${inputs.visitorPercentage}%) = ${totalSpaces}`
        ]
      };
    }
  },
  {
    name: "U-Value Calculator",
    description: "Calculate U-value from wall assembly R-values",
    category: "Building Envelope",
    inputs: [
      {
        name: "exteriorFilm",
        unit: "R-value",
        description: "Exterior air film"
      },
      {
        name: "wallMaterial",
        unit: "R-value",
        description: "Main wall material"
      },
      {
        name: "insulation",
        unit: "R-value",
        description: "Insulation layer"
      },
      {
        name: "interiorFinish",
        unit: "R-value",
        description: "Interior finish"
      },
      {
        name: "interiorFilm",
        unit: "R-value",
        description: "Interior air film"
      }
    ],
    calculate: (inputs): CalculationResult => {
      const totalR = inputs.exteriorFilm + inputs.wallMaterial + inputs.insulation +
                    inputs.interiorFinish + inputs.interiorFilm;
      const uValue = 1 / totalR;
      return {
        result: uValue,
        unit: "BTU/(ft²·°F·h)",
        steps: [
          `Exterior Film: R-${inputs.exteriorFilm}`,
          `Wall Material: R-${inputs.wallMaterial}`,
          `Insulation: R-${inputs.insulation}`,
          `Interior Finish: R-${inputs.interiorFinish}`,
          `Interior Film: R-${inputs.interiorFilm}`,
          `Total R-value = ${inputs.exteriorFilm} + ${inputs.wallMaterial} + ${inputs.insulation} + ${inputs.interiorFinish} + ${inputs.interiorFilm} = ${totalR.toFixed(2)}`,
          `U-value = 1 / R-value = 1 / ${totalR.toFixed(2)} = ${uValue.toFixed(4)}`
        ]
      };
    }
  },
  {
    name: "Egress Width Calculator",
    description: "Calculate required egress width based on occupant load",
    category: "Life Safety",
    inputs: [
      {
        name: "occupants",
        unit: "people",
        description: "Number of occupants"
      },
      {
        name: "widthPerOccupant",
        unit: "inches",
        description: "Required width per occupant"
      }
    ],
    calculate: (inputs): CalculationResult => {
      const width = inputs.occupants * inputs.widthPerOccupant;
      return {
        result: width,
        unit: "inches",
        steps: [
          `Occupants: ${inputs.occupants}`,
          `Width per Occupant: ${inputs.widthPerOccupant} inches`,
          `Required Width = ${inputs.occupants} × ${inputs.widthPerOccupant} = ${width} inches`
        ]
      };
    }
  }
];