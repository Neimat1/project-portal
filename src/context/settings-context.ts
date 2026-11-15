import { createContext } from "react";

export interface SettingsContextType {
  compactList: boolean;
  setCompactList: (value: boolean) => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);
