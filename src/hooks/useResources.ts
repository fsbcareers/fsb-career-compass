import { useCallback, useEffect, useState } from "react";
import { starterResources, type Resource } from "@/config/resources";

const STORAGE_KEY = "fsb_resources_v1";

/**
 * useResources — localStorage-backed CRUD for the resource library.
 *
 * Storage strategy: seed from starterResources on first load, then admin
 * edits persist per-device. A future sprint will swap this hook's
 * implementation for a Google Sheet read/write adapter without touching
 * any consuming components.
 */
function loadFromStorage(): Resource[] {
  if (typeof window === "undefined") return starterResources;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return starterResources;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return starterResources;
    return parsed as Resource[];
  } catch {
    return starterResources;
  }
}

function saveToStorage(list: Resource[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore quota errors
  }
}

export function useResources() {
  const [resources, setResources] = useState<Resource[]>(() => loadFromStorage());

  // Sync across tabs.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setResources(loadFromStorage());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const persist = useCallback((next: Resource[]) => {
    setResources(next);
    saveToStorage(next);
  }, []);

  const addResource = useCallback(
    (resource: Resource) => persist([...loadFromStorage(), resource]),
    [persist]
  );

  const updateResource = useCallback(
    (id: string, patch: Partial<Resource>) => {
      const current = loadFromStorage();
      const next = current.map((r) => (r.id === id ? { ...r, ...patch } : r));
      persist(next);
    },
    [persist]
  );

  const removeResource = useCallback(
    (id: string) => {
      const current = loadFromStorage();
      persist(current.filter((r) => r.id !== id));
    },
    [persist]
  );

  const resetToDefaults = useCallback(() => {
    persist(starterResources);
  }, [persist]);

  return { resources, addResource, updateResource, removeResource, resetToDefaults };
}