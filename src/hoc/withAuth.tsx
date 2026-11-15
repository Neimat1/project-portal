import type { ComponentType } from "react";
import { Navigate, useLocation } from "react-router-dom";

import type { Role } from "../types";
import { useAuth } from "../context/useAuth";

interface AuthOptions {
  role?: Role;
}

export function withAuth<P extends object>(
  Component: ComponentType<P>,
  options?: AuthOptions,
) {
  function WithAuth(props: P) {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
      return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (options?.role && user.role !== options.role) {
      return <p>You do not have access to this page.</p>;
    }

    return <Component {...props} />;
  }

  WithAuth.displayName = `withAuth(${
    Component.displayName || Component.name || "Component"
  })`;

  return WithAuth;
}
