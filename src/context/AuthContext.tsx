import { useState, type ReactNode } from "react";

import type { User } from "../types";
import { login as apiLogin } from "../api/mockApi";

import { AuthContext } from "./auth-context";

// Storage reader
const STORAGE_KEY = "project-portal-user";

function isUser(value: unknown): value is User {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  if (
    !("id" in value) ||
    !("username" in value) ||
    !("name" in value) ||
    !("role" in value)
  ) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.username === "string" &&
    typeof value.name === "string" &&
    (value.role === "admin" || value.role === "member")
  );
}

function readStoredUser(): User | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return null;
    }

    const parsed: unknown = JSON.parse(stored);

    return isUser(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

// auth provider

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(readStoredUser);

  async function login(username: string): Promise<void> {
    const loggedInUser = await apiLogin(username);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedInUser));

    setUser(loggedInUser);
  }

  function logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
