import { Term, Formula } from "@shared/schema";

const DB_NAME = 'archkit-offline';
const DB_VERSION = 2; // Increased version for new stores

interface OfflineDB {
  terms: Term[];
  formulas: Formula[];
  quizScores: { score: number; total: number; timestamp: string }[];
  studyTime: { duration: number; timestamp: string }[];
  settings: { key: string; value: any }[];
}

export async function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

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
    };
  });
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

// Save AR calibration data
export async function saveCalibrationData(calibrationFactor: number): Promise<void> {
  await saveToStore('settings', {
    key: 'arCalibration',
    value: calibrationFactor,
    timestamp: new Date().toISOString()
  });
}

// Get AR calibration data
export async function getCalibrationData(): Promise<number | null> {
  const data = await getFromStore<{value: number}>('settings', 'arCalibration');
  return data ? data.value : null;
}

// Function to sync data from server to IndexedDB
export async function syncFromServer() {
  try {
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