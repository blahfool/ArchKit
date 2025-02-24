import {
  type Term,
  type InsertTerm,
  type Formula,
  type InsertFormula,
} from "@shared/schema";

export interface IStorage {
  getAllTerms(): Promise<Term[]>;
  getAllFormulas(): Promise<Formula[]>;
  createTerm(term: InsertTerm): Promise<Term>;
  createFormula(formula: InsertFormula): Promise<Formula>;
}

export class MemStorage implements IStorage {
  private terms: Map<number, Term>;
  private formulas: Map<number, Formula>;
  private termId: number;
  private formulaId: number;

  constructor() {
    this.terms = new Map();
    this.formulas = new Map();
    this.termId = 1;
    this.formulaId = 1;
  }

  async getAllTerms(): Promise<Term[]> {
    return Array.from(this.terms.values());
  }

  async getAllFormulas(): Promise<Formula[]> {
    return Array.from(this.formulas.values());
  }

  async createTerm(insertTerm: InsertTerm): Promise<Term> {
    const id = this.termId++;
    const term: Term = { ...insertTerm, id };
    this.terms.set(id, term);
    return term;
  }

  async createFormula(insertFormula: InsertFormula): Promise<Formula> {
    const id = this.formulaId++;
    const formula: Formula = { ...insertFormula, id };
    this.formulas.set(id, formula);
    return formula;
  }
}

export const storage = new MemStorage();
