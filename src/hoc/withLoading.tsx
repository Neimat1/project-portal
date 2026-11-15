import type { ComponentType } from "react";

interface LoadingProps {
  isLoading: boolean;
}

export function withLoading<P extends object>(Component: ComponentType<P>) {
  function WithLoading({ isLoading, ...componentProps }: P & LoadingProps) {
    if (isLoading) {
      return <p role="status">Loading...</p>;
    }

    return <Component {...(componentProps as P)} />;
  }

  WithLoading.displayName = `withLoading(${Component.displayName || Component.name || "Component"})`;
  return WithLoading;
}
