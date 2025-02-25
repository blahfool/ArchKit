import { Term, Formula } from "@shared/schema";
import type { Question } from "@/lib/questionGenerator";
import { toast } from "@/hooks/use-toast";

const DB_NAME = 'archkit-offline';
const DB_VERSION = 3;

interface OfflineDB {
  terms: Term[];
  formulas: Formula[];
  quizScores: { score: number; total: number; timestamp: string }[];
  settings: { key: string; value: any }[];
  customTerms: (Term & { isCustom: boolean; createdAt: string })[]; 
}

class OfflineStorageError extends Error {
  constructor(message: string, public originalError?: Error) {
    super(message);
    this.name = 'OfflineStorageError';
  }
}

export async function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION + 1);

      request.onerror = () => {
        const error = new OfflineStorageError('Failed to open database', request.error);
        console.error(error);
        toast({
          title: "Storage Error",
          description: "Failed to access offline storage. Some features may not work properly.",
          variant: "destructive",
        });
        reject(error);
      };

      request.onblocked = () => {
        const error = new OfflineStorageError('Database blocked. Please close other tabs of this app');
        console.error(error);
        toast({
          title: "Storage Blocked",
          description: "Please close other tabs of this application and try again.",
          variant: "destructive",
        });
        reject(error);
      };

      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create stores if they don't exist
        const stores = [
          { name: 'terms', keyPath: 'id' },
          { name: 'formulas', keyPath: 'id' },
          { name: 'quizScores', keyPath: 'timestamp' },
          { name: 'settings', keyPath: 'key' },
          { name: 'customTerms', keyPath: 'id', autoIncrement: true }
        ];

        stores.forEach(store => {
          if (!db.objectStoreNames.contains(store.name)) {
            db.createObjectStore(store.name, store);
          }
        });
      };
    } catch (error) {
      const wrappedError = new OfflineStorageError('Critical database initialization error', error as Error);
      console.error(wrappedError);
      toast({
        title: "Critical Error",
        description: "Failed to initialize storage. Please refresh the page.",
        variant: "destructive",
      });
      reject(wrappedError);
    }
  });
}

async function withErrorHandling<T>(operation: () => Promise<T>, errorMessage: string): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    const wrappedError = new OfflineStorageError(errorMessage, error as Error);
    console.error(wrappedError);
    throw wrappedError;
  }
}

export async function addCustomTerm(term: Omit<Term, 'id'>): Promise<void> {
  return withErrorHandling(async () => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('customTerms', 'readwrite');
      const store = transaction.objectStore('customTerms');

      transaction.oncomplete = () => {
        toast({
          title: "Success",
          description: "Custom term saved successfully",
        });
        resolve();
      };

      transaction.onerror = () => reject(new OfflineStorageError('Failed to add custom term', transaction.error));

      store.add({
        ...term,
        isCustom: true,
        createdAt: new Date().toISOString()
      });
    });
  }, 'Failed to add custom term');
}

export async function getCustomTerms(): Promise<Term[]> {
  return withErrorHandling(
    () => getAllFromStore<Term>('customTerms'),
    'Failed to retrieve custom terms'
  );
}

export async function deleteCustomTerm(id: number): Promise<void> {
  return withErrorHandling(async () => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('customTerms', 'readwrite');
      const store = transaction.objectStore('customTerms');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new OfflineStorageError('Failed to delete term', request.error));
    });
  }, 'Failed to delete custom term');
}

export async function syncFromServer(): Promise<boolean> {
  return withErrorHandling(async () => {
    if (!navigator.onLine) {
      toast({
        title: "Offline Mode",
        description: "Working offline. Your changes will sync when you're back online.",
      });
      return false;
    }

    try {
      // Fetch and store terms
      const terms = await fetch('/api/terms').then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      });
      await Promise.all(terms.map((term: Term) => saveToStore('terms', term)));

      // Fetch and store formulas
      const formulas = await fetch('/api/formulas').then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      });
      await Promise.all(formulas.map((formula: Formula) => saveToStore('formulas', formula)));

      toast({
        title: "Sync Complete",
        description: "Your data has been updated successfully.",
      });

      return true;
    } catch (error) {
      console.error('Network sync error:', error);
      toast({
        title: "Sync Failed",
        description: "Failed to sync with server. Will try again later.",
        variant: "destructive",
      });
      throw error;
    }
  }, 'Failed to sync with server');
}

export async function saveToStore<T>(storeName: keyof OfflineDB, data: T): Promise<void> {
  return withErrorHandling(async () => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new OfflineStorageError(`Failed to save to ${storeName}`, request.error));
    });
  }, `Failed to save data to ${storeName}`);
}

export async function getAllFromStore<T>(storeName: keyof OfflineDB): Promise<T[]> {
  return withErrorHandling(async () => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new OfflineStorageError(`Failed to get all from ${storeName}`, request.error));
    });
  }, `Failed to retrieve data from ${storeName}`);
}

export async function getFromStore<T>(storeName: keyof OfflineDB, key: string): Promise<T | null> {
  return withErrorHandling(async () => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(new OfflineStorageError(`Failed to get from ${storeName}`, request.error));
    });
  }, `Failed to retrieve item from ${storeName}`);
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