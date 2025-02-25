import { Term, Formula } from "@shared/schema";
import type { Question } from "@/lib/questionGenerator";

const DB_NAME = 'archkit-offline';
const DB_VERSION = 3; // Increased version for assessment store

interface OfflineDB {
  terms: Term[];
  formulas: Formula[];
  quizScores: { score: number; total: number; timestamp: string }[];
  studyTime: { duration: number; timestamp: string }[];
  settings: { key: string; value: any }[];
  assessmentQuestions: { questions: Question[]; timestamp: string; type: string; }[];
  customTerms: (Term & { isCustom: boolean; createdAt: string })[]; // Updated type for custom terms
}

export async function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION + 1); // Increment version for new store

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains('terms')) {
        db.createObjectStore('terms', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('formulas')) {
        db.createObjectStore('formulas', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('quizScores')) {
        db.createObjectStore('quizScores', { keyPath: 'timestamp' });
      }
      if (!db.objectStoreNames.contains('studyTime')) {
        db.createObjectStore('studyTime', { keyPath: 'timestamp' });
      }
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains('assessmentQuestions')) {
        db.createObjectStore('assessmentQuestions', { keyPath: 'timestamp' });
      }
      if (!db.objectStoreNames.contains('customTerms')) {
        db.createObjectStore('customTerms', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

// Add functions to manage custom terms
export async function addCustomTerm(term: Omit<Term, 'id'>): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('customTerms', 'readwrite');
    const store = transaction.objectStore('customTerms');
    const request = store.add({
      ...term,
      isCustom: true,
      createdAt: new Date().toISOString()
    });

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function getCustomTerms(): Promise<Term[]> {
  return getAllFromStore<Term>('customTerms');
}

export async function deleteCustomTerm(id: number): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('customTerms', 'readwrite');
    const store = transaction.objectStore('customTerms');
    const request = store.delete(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function saveAssessmentQuestions(questions: Question[], type: string): Promise<void> {
  await saveToStore('assessmentQuestions', {
    questions,
    type,
    timestamp: new Date().toISOString()
  });
}

export async function getLatestAssessmentQuestions(type: string): Promise<Question[] | null> {
  const questions = await getAllFromStore<{questions: Question[], timestamp: string, type: string}>('assessmentQuestions');
  const typeQuestions = questions.filter(q => q.type === type);
  if (typeQuestions.length === 0) return null;

  // Get most recent questions
  const latest = typeQuestions.reduce((prev, current) => 
    prev.timestamp > current.timestamp ? prev : current
  );

  return latest.questions;
}

export async function saveToStore<T>(storeName: keyof OfflineDB, data: T): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(data);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function getAllFromStore<T>(storeName: keyof OfflineDB): Promise<T[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

export async function getFromStore<T>(storeName: keyof OfflineDB, key: string): Promise<T | null> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(key);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || null);
  });
}

export async function syncFromServer() {
  try {
    // Only sync if online
    if (!navigator.onLine) return false;

    // Fetch and store terms
    const terms = await fetch('/api/terms').then(res => res.json());
    await Promise.all(terms.map((term: Term) => saveToStore('terms', term)));

    // Fetch and store formulas
    const formulas = await fetch('/api/formulas').then(res => res.json());
    await Promise.all(formulas.map((formula: Formula) => saveToStore('formulas', formula)));

    return true;
  } catch (error) {
    console.error('Error syncing data:', error);
    return false;
  }
}

export async function saveCalibrationData(calibrationFactor: number): Promise<void> {
  await saveToStore('settings', {
    key: 'arCalibration',
    value: calibrationFactor,
    timestamp: new Date().toISOString()
  });
}

export async function getCalibrationData(): Promise<number | null> {
  const data = await getFromStore<{value: number}>('settings', 'arCalibration');
  return data ? data.value : null;
}