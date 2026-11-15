import { useState, type ReactNode } from "react";

import { SettingsContext } from "./settings-context";

const STORAGE_KEY = "project-portal-compact-list";

function readCompactList(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [compactList, setCompactListState] = useState<boolean>(readCompactList);

  function setCompactList(value: boolean): void {
    setCompactListState(value);

    try {
      localStorage.setItem(STORAGE_KEY, String(value));
    } catch {
      // Keep the preference in React state if storage fails.
    }
  }

  return (
    <SettingsContext.Provider value={{ compactList, setCompactList }}>
      {children}
    </SettingsContext.Provider>
  );
}
