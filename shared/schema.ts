import { pgTable, text, serial, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const terms = pgTable("terms", {
  id: serial("id").primaryKey(),
  term: text("term").notNull(),
  definition: text("definition").notNull(),
  category: varchar("category", { length: 50 }).notNull(),
});

export const formulas = pgTable("formulas", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  formula: text("formula").notNull(),
  description: text("description").notNull(),
  variables: text("variables").notNull(),
});

// Define fallback terms
export const fallbackTerms = [
  {
    term: "Bahay Kubo",
    definition: "Traditional Filipino stilt house made of native materials like bamboo and nipa, designed for tropical climate with elevated living space, steep roof for rain runoff, and natural ventilation.",
    category: "Philippine Architecture"
  },
  {
    term: "Bahay na Bato",
    definition: "Spanish colonial-era Filipino house type combining native and Spanish architectural elements, featuring stone foundation, wooden upper floor, and large windows with capiz shell panes.",
    category: "Philippine Architecture"
  },
  {
    term: "BERDE",
    definition: "Building for Ecologically Responsive Design Excellence - Philippine's green building rating system that assesses buildings based on environmental performance and sustainability criteria.",
    category: "Sustainability"
  },
  {
    term: "Passive Cooling",
    definition: "Design strategies that maintain building comfort without mechanical cooling, including cross-ventilation, thermal mass, shading devices, and proper orientation.",
    category: "Environmental Design"
  },
  {
    term: "Solar Shading",
    definition: "Architectural elements like overhangs, louvers, or screens that protect buildings from direct sunlight while allowing natural light and ventilation.",
    category: "Environmental Design"
  },
  {
    term: "Floor Area Ratio (FAR)",
    definition: "The ratio of a building's total floor area to the size of the lot it occupies, used in urban planning to control building density and development intensity.",
    category: "Urban Planning"
  },
  {
    term: "Building Setback",
    definition: "Required minimum distance between a building and property lines, roads, or other structures as specified by local building codes and zoning regulations.",
    category: "Regulations"
  },
  {
    term: "Load-Bearing Wall",
    definition: "Wall that carries the weight of the building above it, including roof loads and upper floors, transferring these forces to the foundation.",
    category: "Construction"
  },
  {
    term: "Curtain Wall",
    definition: "Non-structural exterior wall system that protects against weather while allowing natural light, commonly using glass panels and aluminum frames.",
    category: "Construction"
  },
  {
    term: "Green Roof",
    definition: "Building roof partially or completely covered with vegetation, providing benefits like thermal insulation, stormwater management, and urban heat reduction.",
    category: "Sustainability"
  },
  {
    term: "Universal Design",
    definition: "Design approach that ensures buildings and spaces are accessible and usable by all people regardless of age, disability, or other factors.",
    category: "Design Principles"
  },
  {
    term: "Vernacular Architecture",
    definition: "Traditional building design using local materials and methods, reflecting local climate, culture, and building practices.",
    category: "Architectural Theory"
  },
  {
    term: "Building Envelope",
    definition: "Physical separator between interior and exterior environments, including walls, roof, windows, and doors, crucial for energy efficiency.",
    category: "Construction"
  },
  {
    term: "Spatial Hierarchy",
    definition: "Organization of spaces based on importance, function, or symbolic value, expressed through size, location, or architectural treatment.",
    category: "Design Principles"
  },
  {
    term: "Fenestration",
    definition: "Arrangement and design of windows, doors, and other openings in a building, affecting natural light, ventilation, and visual connection.",
    category: "Design Elements"
  },
  {
    term: "Adaptive Reuse",
    definition: "Process of repurposing existing buildings for new functions while preserving their historical or architectural significance.",
    category: "Sustainability"
  },
  {
    term: "Building Information Modeling (BIM)",
    definition: "Digital representation of physical and functional characteristics of buildings, used for design, construction, and facility management.",
    category: "Digital Tools"
  },
  {
    term: "Climate-Responsive Design",
    definition: "Architectural approach that considers local climate conditions to optimize building performance and occupant comfort naturally.",
    category: "Environmental Design"
  },
  {
    term: "Structural Grid",
    definition: "Regular pattern of load-bearing elements that provides organization for building structure and spaces.",
    category: "Construction"
  },
  {
    term: "Site Analysis",
    definition: "Evaluation of site conditions including topography, climate, vegetation, and context to inform architectural design decisions.",
    category: "Design Process"
  },
  {
    term: "Mixed-Use Development",
    definition: "Project combining multiple functions (residential, commercial, cultural) in an integrated development to create vibrant urban environments.",
    category: "Urban Planning"
  },
  {
    term: "Sustainable Materials",
    definition: "Building materials with minimal environmental impact, considering factors like renewability, local sourcing, and lifecycle costs.",
    category: "Sustainability"
  },
  {
    term: "Contextual Design",
    definition: "Architectural approach that responds to and respects the surrounding built and natural environment.",
    category: "Design Principles"
  },
  {
    term: "Building Systems Integration",
    definition: "Coordination of various building systems (structural, mechanical, electrical) to work together efficiently.",
    category: "Technical Systems"
  },
  {
    term: "Form Follows Function",
    definition: "Design principle where building shape is primarily determined by its intended purpose and functional requirements.",
    category: "Design Principles"
  }
];

export const insertTermSchema = createInsertSchema(terms).pick({
  term: true,
  definition: true,
  category: true,
});

export const insertFormulaSchema = createInsertSchema(formulas).pick({
  name: true,
  formula: true,
  description: true,
  variables: true,
});

export type Term = typeof terms.$inferSelect;
export type InsertTerm = z.infer<typeof insertTermSchema>;
export type Formula = typeof formulas.$inferSelect;
export type InsertFormula = z.infer<typeof insertFormulaSchema>;