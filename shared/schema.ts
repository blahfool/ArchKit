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
