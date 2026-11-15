import { createContext } from "react";
import type { User } from "../types";

export interface AuthContextType {
  user: User | null;
  login: (username: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
