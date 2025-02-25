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
  addQuizScore(score: number, total: number): Promise<void>;
  getQuizScores(): Promise<any[]>;
  addStudyTime(duration: number): Promise<void>;
  getTotalStudyTime(): Promise<number>;
}

export class SQLiteStorage implements IStorage {
  private db: Database.Database;

  constructor() {
    this.db = new Database("archkit.db");
    this.initDatabase();
  }

  private initDatabase() {
    // Create all tables if they don't exist
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

      CREATE TABLE IF NOT EXISTS quiz_scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        score INTEGER NOT NULL,
        total INTEGER NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS study_time (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        duration INTEGER NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
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

  async addQuizScore(score: number, total: number): Promise<void> {
    this.db.prepare(
      "INSERT INTO quiz_scores (score, total) VALUES (?, ?)"
    ).run(score, total);
  }

  async getQuizScores(): Promise<any[]> {
    return this.db.prepare("SELECT * FROM quiz_scores ORDER BY timestamp DESC LIMIT 10").all();
  }

  async addStudyTime(duration: number): Promise<void> {
    this.db.prepare(
      "INSERT INTO study_time (duration) VALUES (?)"
    ).run(duration);
  }

  async getTotalStudyTime(): Promise<number> {
    const result = this.db.prepare("SELECT SUM(duration) as total FROM study_time").get();
    return result.total || 0;
  }
}

// Initialize storage with SQLite implementation
export const storage = new SQLiteStorage();