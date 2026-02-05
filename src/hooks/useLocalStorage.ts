import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Use ref to track if we've initialized
  // const initialized = useRef(false);
  
  // Get stored value without dependencies that change
  const getStoredValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key]); // Only depend on key, not initialValue

  const [storedValue, setStoredValue] = useState<T>(() => getStoredValue());

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue !== null) {
        try {
          setStoredValue(JSON.parse(event.newValue));
        } catch (error) {
          console.error(`Error parsing storage change for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue];
}

interface HistoryRecord {
  id: string;
  date: string;
  type: string;
  data: Record<string, number | string | boolean | undefined>;
}

export function useHealthHistory() {
  const [history, setHistory, clearHistory] = useLocalStorage<HistoryRecord[]>('healthHistory', []);

  const addRecord = useCallback((type: string, data: Record<string, number | string | boolean | undefined>) => {
    const newRecord: HistoryRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      type,
      data,
    };
    
    setHistory((prev: HistoryRecord[]) => [newRecord, ...prev].slice(0, 100));
  }, [setHistory]);

  const deleteRecord = useCallback((id: string) => {
    setHistory((prev: HistoryRecord[]) => prev.filter(record => record.id !== id));
  }, [setHistory]);

  const getRecordsByType = useCallback((type: string) => {
    return history.filter(record => record.type === type);
  }, [history]);

  const getLatestRecord = useCallback((type: string) => {
    return history.find(record => record.type === type);
  }, [history]);

  return {
    history,
    addRecord,
    deleteRecord,
    clearHistory,
    getRecordsByType,
    getLatestRecord,
  };
}

interface UserProfile {
  name: string;
  gender: 'male' | 'female';
  age: number;
  height: number;
  weight: number;
  activityLevel: string;
  updatedAt: string;
}

export function useUserProfile() {
  const [profile, setProfile, removeProfile] = useLocalStorage<UserProfile | null>('userProfile', null);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile((prev: UserProfile | null) => {
      if (!prev) return null;
      return {
        ...prev,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
    });
  }, [setProfile]);

  return {
    profile,
    setProfile,
    updateProfile,
    removeProfile,
  };
}
