import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertTermSchema, insertFormulaSchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  const httpServer = createServer(app);

  app.get("/api/terms", async (_req, res) => {
    const terms = await storage.getAllTerms();
    res.json(terms);
  });

  app.get("/api/formulas", async (_req, res) => {
    const formulas = await storage.getAllFormulas();
    res.json(formulas);
  });

  app.post("/api/terms", async (req, res) => {
    const parsed = insertTermSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }
    const term = await storage.createTerm(parsed.data);
    res.json(term);
  });

  app.post("/api/formulas", async (req, res) => {
    const parsed = insertFormulaSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }
    const formula = await storage.createFormula(parsed.data);
    res.json(formula);
  });

  return httpServer;
}
