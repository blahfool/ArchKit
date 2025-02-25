import { z } from "zod";

export interface Term {
  id: number;
  term: string;
  definition: string;
  category: string;
}

export interface Formula {
  id: number;
  name: string;
  formula: string;
  description: string;
  variables: string;
}

// Define fallback terms
export const fallbackTerms: Term[] = [
  {
    id: 1,
    term: "Bahay Kubo",
    definition: "Traditional Filipino stilt house made of native materials like bamboo and nipa, designed for tropical climate with elevated living space, steep roof for rain runoff, and natural ventilation.",
    category: "Philippine Architecture"
  },
  {
    id: 2,
    term: "Bahay na Bato",
    definition: "Spanish colonial-era Filipino house type combining native and Spanish architectural elements, featuring stone foundation, wooden upper floor, and large windows with capiz shell panes.",
    category: "Philippine Architecture"
  },
  {
    id: 3,
    term: "BERDE",
    definition: "Building for Ecologically Responsive Design Excellence - Philippine's green building rating system that assesses buildings based on environmental performance and sustainability criteria.",
    category: "Sustainability"
  },
  {
    id: 4,
    term: "Passive Cooling",
    definition: "Design strategies that maintain building comfort without mechanical cooling, including cross-ventilation, thermal mass, shading devices, and proper orientation.",
    category: "Environmental Design"
  },
  {
    id: 5,
    term: "Solar Shading",
    definition: "Architectural elements like overhangs, louvers, or screens that protect buildings from direct sunlight while allowing natural light and ventilation.",
    category: "Environmental Design"
  },
  {
    id: 6,
    term: "Floor Area Ratio (FAR)",
    definition: "The ratio of a building's total floor area to the size of the lot it occupies, used in urban planning to control building density and development intensity.",
    category: "Urban Planning"
  },
  {
    id: 7,
    term: "Building Setback",
    definition: "Required minimum distance between a building and property lines, roads, or other structures as specified by local building codes and zoning regulations.",
    category: "Regulations"
  },
  {
    id: 8,
    term: "Load-Bearing Wall",
    definition: "Wall that carries the weight of the building above it, including roof loads and upper floors, transferring these forces to the foundation.",
    category: "Construction"
  },
  {
    id: 9,
    term: "Curtain Wall",
    definition: "Non-structural exterior wall system that protects against weather while allowing natural light, commonly using glass panels and aluminum frames.",
    category: "Construction"
  },
  {
    id: 10,
    term: "Green Roof",
    definition: "Building roof partially or completely covered with vegetation, providing benefits like thermal insulation, stormwater management, and urban heat reduction.",
    category: "Sustainability"
  },
  {
    id: 11,
    term: "Universal Design",
    definition: "Design approach that ensures buildings and spaces are accessible and usable by all people regardless of age, disability, or other factors.",
    category: "Design Principles"
  },
  {
    id: 12,
    term: "Vernacular Architecture",
    definition: "Traditional building design using local materials and methods, reflecting local climate, culture, and building practices.",
    category: "Architectural Theory"
  },
  {
    id: 13,
    term: "Building Envelope",
    definition: "Physical separator between interior and exterior environments, including walls, roof, windows, and doors, crucial for energy efficiency.",
    category: "Construction"
  },
  {
    id: 14,
    term: "Spatial Hierarchy",
    definition: "Organization of spaces based on importance, function, or symbolic value, expressed through size, location, or architectural treatment.",
    category: "Design Principles"
  },
  {
    id: 15,
    term: "Fenestration",
    definition: "Arrangement and design of windows, doors, and other openings in a building, affecting natural light, ventilation, and visual connection.",
    category: "Design Elements"
  },
  {
    id: 16,
    term: "Adaptive Reuse",
    definition: "Process of repurposing existing buildings for new functions while preserving their historical or architectural significance.",
    category: "Sustainability"
  },
  {
    id: 17,
    term: "Building Information Modeling (BIM)",
    definition: "Digital representation of physical and functional characteristics of buildings, used for design, construction, and facility management.",
    category: "Digital Tools"
  },
  {
    id: 18,
    term: "Climate-Responsive Design",
    definition: "Architectural approach that considers local climate conditions to optimize building performance and occupant comfort naturally.",
    category: "Environmental Design"
  },
  {
    id: 19,
    term: "Structural Grid",
    definition: "Regular pattern of load-bearing elements that provides organization for building structure and spaces.",
    category: "Construction"
  },
  {
    id: 20,
    term: "Site Analysis",
    definition: "Evaluation of site conditions including topography, climate, vegetation, and context to inform architectural design decisions.",
    category: "Design Process"
  },
  {
    id: 21,
    term: "Mixed-Use Development",
    definition: "Project combining multiple functions (residential, commercial, cultural) in an integrated development to create vibrant urban environments.",
    category: "Urban Planning"
  },
  {
    id: 22,
    term: "Sustainable Materials",
    definition: "Building materials with minimal environmental impact, considering factors like renewability, local sourcing, and lifecycle costs.",
    category: "Sustainability"
  },
  {
    id: 23,
    term: "Contextual Design",
    definition: "Architectural approach that responds to and respects the surrounding built and natural environment.",
    category: "Design Principles"
  },
  {
    id: 24,
    term: "Building Systems Integration",
    definition: "Coordination of various building systems (structural, mechanical, electrical) to work together efficiently.",
    category: "Technical Systems"
  },
  {
    id: 25,
    term: "Form Follows Function",
    definition: "Design principle where building shape is primarily determined by its intended purpose and functional requirements.",
    category: "Design Principles"
  },
  {
    id: 26,
    term: "HVAC System",
    definition: "Heating, Ventilation, and Air Conditioning system that controls indoor environmental conditions for occupant comfort and air quality.",
    category: "Building Systems"
  },
  {
    id: 27,
    term: "Post-Tensioning",
    definition: "Construction method where steel cables in concrete are tensioned after the concrete has hardened to provide additional structural strength.",
    category: "Construction"
  },
  {
    id: 28,
    term: "Professional Liability Insurance",
    definition: "Insurance coverage protecting architects against claims of negligence or failure to perform professional duties.",
    category: "Professional Practice"
  },
  {
    id: 29,
    term: "Means of Egress",
    definition: "Continuous and unobstructed path of exit travel from any point in a building to a public way, including exit access, exit, and exit discharge.",
    category: "Building Codes"
  },
  {
    id: 30,
    term: "Moment Frame",
    definition: "Structural system where beams and columns are rigidly connected to resist lateral forces through bending of frame elements.",
    category: "Structural Systems"
  },
  {
    id: 31,
    term: "Value Engineering",
    definition: "Systematic method to improve value by analyzing function versus cost while maintaining performance requirements.",
    category: "Project Management"
  },
  {
    id: 32,
    term: "Building Envelope",
    definition: "Physical separator between interior and exterior environments, including walls, roof, and foundation, crucial for energy efficiency.",
    category: "Building Systems"
  },
  {
    id: 33,
    term: "Fire-Resistance Rating",
    definition: "Time period that a building element can withstand standard fire test conditions while maintaining structural integrity.",
    category: "Building Codes"
  },
  {
    id: 34,
    term: "ADA Compliance",
    definition: "Meeting requirements of the Americans with Disabilities Act for accessible design in buildings and facilities.",
    category: "Regulations"
  },
  {
    id: 35,
    term: "Vapor Barrier",
    definition: "Material that restricts the passage of water vapor through walls, ceilings, and floors to prevent condensation.",
    category: "Construction"
  },
  {
    id: 36,
    term: "Design Development",
    definition: "Phase of architectural services where preliminary design is refined with detailed drawings and specifications.",
    category: "Professional Practice"
  },
  {
    id: 37,
    term: "Curtain Wall System",
    definition: "Non-load-bearing exterior wall system attached to the building structure, typically consisting of glass and metal framing.",
    category: "Building Systems"
  },
  {
    id: 38,
    term: "Critical Path Method",
    definition: "Project management technique identifying activities that directly impact the project completion time.",
    category: "Project Management"
  },
  {
    id: 39,
    term: "Thermal Bridge",
    definition: "Area of construction with higher heat transfer than surrounding materials, reducing overall thermal efficiency.",
    category: "Environmental Design"
  },
  {
    id: 40,
    term: "Construction Administration",
    definition: "Architect's role during construction to ensure project is built according to design intent and contract documents.",
    category: "Professional Practice"
  },
  {
    id: 41,
    term: "Structural Grid",
    definition: "System of reference lines used to organize and coordinate building structure and components.",
    category: "Construction"
  },
  {
    id: 42,
    term: "Daylighting",
    definition: "Use of natural light to illuminate building interiors, reducing energy consumption and improving occupant well-being.",
    category: "Environmental Design"
  },
  {
    id: 43,
    term: "Specification Writing",
    definition: "Detailed description of materials, products, and workmanship required for construction projects.",
    category: "Professional Practice"
  },
  {
    id: 44,
    term: "Building Code Analysis",
    definition: "Evaluation of building design against applicable codes and regulations for compliance.",
    category: "Regulations"
  },
  {
    id: 45,
    term: "Construction Documents",
    definition: "Drawings, specifications, and other documents prepared by architects for building permit and construction.",
    category: "Professional Practice"
  },
  {
    id: 46,
    term: "Site Analysis",
    definition: "Evaluation of site conditions including topography, climate, vegetation, and context to inform design decisions.",
    category: "Design Process"
  },
  {
    id: 47,
    term: "Load Calculations",
    definition: "Determination of structural loads and forces acting on building elements for proper design.",
    category: "Structural Systems"
  },
  {
    id: 48,
    term: "Building Commissioning",
    definition: "Process of verifying building systems perform according to design intent and owner requirements.",
    category: "Building Systems"
  },
  {
    id: 49,
    term: "Zoning Requirements",
    definition: "Local regulations controlling land use, building height, setbacks, and density in specific areas.",
    category: "Urban Planning"
  },
  {
    id: 50,
    term: "Cantilever",
    definition: "A structural element that projects horizontally beyond its vertical support, supported on only one end. Common in modern architecture for creating dramatic overhangs and balconies.",
    category: "Structural Systems"
  },
  {
    id: 51,
    term: "Biophilic Design",
    definition: "An architectural approach that seeks to connect building occupants with nature, incorporating natural materials, vegetation, natural light, and views of nature into the built environment.",
    category: "Design Principles"
  },
  {
    id: 52,
    term: "Parametric Design",
    definition: "A design process based on algorithmic thinking, using parameters and rules to define the relationship between design intent and design response.",
    category: "Digital Tools"
  },
  {
    id: 53,
    term: "Building Commissioning",
    definition: "A systematic process of verifying that building systems are installed, calibrated, and perform according to design intent and owner's operational needs.",
    category: "Building Systems"
  },
  {
    id: 54,
    term: "Acoustical Design",
    definition: "The science and art of managing sound within buildings, including sound isolation, room acoustics, and mechanical system noise control.",
    category: "Environmental Design"
  },
  {
    id: 55,
    term: "Building Envelope Commissioning",
    definition: "Process of testing and verifying the performance of exterior wall systems, including air barriers, waterproofing, and thermal performance.",
    category: "Building Systems"
  },
  {
    id: 56,
    term: "Net Zero Energy Building",
    definition: "A building that produces as much energy as it consumes over the course of a year, typically through a combination of energy efficiency and renewable energy production.",
    category: "Sustainability"
  },
  {
    id: 57,
    term: "Space Syntax",
    definition: "A set of theories and techniques for analyzing spatial configurations and understanding how spatial layout affects human behavior and movement patterns.",
    category: "Design Theory"
  },
  {
    id: 58,
    term: "Building Typology",
    definition: "The systematic classification of buildings based on common characteristics, including form, function, construction method, and historical period.",
    category: "Architectural Theory"
  },
  {
    id: 59,
    term: "Design Development",
    definition: "Phase of architectural design process where initial concepts are refined, including detailed drawings, material selections, and system specifications.",
    category: "Professional Practice"
  },
  {
    id: 60,
    term: "Thermal Mass",
    definition: "Materials with high heat capacity used to stabilize temperature fluctuations in buildings by absorbing and releasing heat slowly.",
    category: "Environmental Design"
  },
  {
    id: 61,
    term: "Program Analysis",
    definition: "Systematic evaluation of client requirements, spatial needs, functional relationships, and operational parameters to inform architectural design.",
    category: "Design Process"
  },
  {
    id: 62,
    term: "Building Performance Simulation",
    definition: "Computer-based modeling to predict and optimize building performance aspects including energy use, daylighting, and thermal comfort.",
    category: "Digital Tools"
  },
  {
    id: 63,
    term: "Integrated Project Delivery",
    definition: "Collaborative project delivery approach integrating people, systems, and practices into a process that optimizes project results.",
    category: "Professional Practice"
  },
  {
    id: 64,
    term: "Passive House",
    definition: "Ultra-low energy building standard requiring minimal heating/cooling, achieved through superinsulation, airtightness, and heat recovery ventilation.",
    category: "Sustainability"
  }
];

// Create schemas for validation
export const termSchema = z.object({
  id: z.number(),
  term: z.string(),
  definition: z.string(),
  category: z.string()
});

export const formulaSchema = z.object({
  id: z.number(),
  name: z.string(),
  formula: z.string(),
  description: z.string(),
  variables: z.string()
});

export type InsertTerm = Omit<Term, 'id'>;
export type InsertFormula = Omit<Formula, 'id'>;