import Database from "better-sqlite3";
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

export class SQLiteStorage implements IStorage {
  private db: Database.Database;

  constructor() {
    this.db = new Database("archkit.db");
    this.initDatabase();
  }

  private initDatabase() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS terms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        term TEXT NOT NULL,
        definition TEXT NOT NULL,
        category VARCHAR(50) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS formulas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        formula TEXT NOT NULL,
        description TEXT NOT NULL,
        variables TEXT NOT NULL
      );
    `);
  }

  async getAllTerms(): Promise<Term[]> {
    return this.db.prepare("SELECT * FROM terms").all() as Term[];
  }

  async getAllFormulas(): Promise<Formula[]> {
    return this.db.prepare("SELECT * FROM formulas").all() as Formula[];
  }

  async createTerm(insertTerm: InsertTerm): Promise<Term> {
    const result = this.db
      .prepare(
        "INSERT INTO terms (term, definition, category) VALUES (?, ?, ?) RETURNING *"
      )
      .get(insertTerm.term, insertTerm.definition, insertTerm.category) as Term;

    return result;
  }

  async createFormula(insertFormula: InsertFormula): Promise<Formula> {
    const result = this.db
      .prepare(
        "INSERT INTO formulas (name, formula, description, variables) VALUES (?, ?, ?, ?) RETURNING *"
      )
      .get(
        insertFormula.name,
        insertFormula.formula,
        insertFormula.description,
        insertFormula.variables
      ) as Formula;

    return result;
  }
}

// Initialize storage with SQLite implementation
export const storage = new SQLiteStorage();