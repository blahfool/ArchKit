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
