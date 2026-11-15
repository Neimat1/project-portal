import { useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

interface LoginLocationState {
  from?: {
    pathname: string;
    search?: string;
    hash?: string;
  };
}

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user, login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const state: unknown = location.state;

  let redirectTo = "/dashboard";

  if (typeof state === "object" && state !== null && "from" in state) {
    const loginState = state as LoginLocationState;
    const from = loginState.from;

    if (
      from &&
      typeof from.pathname === "string" &&
      from.pathname.startsWith("/") &&
      !from.pathname.startsWith("//") &&
      !from.pathname.startsWith("/\\")
    ) {
      redirectTo =
        from.pathname +
        (typeof from.search === "string" ? from.search : "") +
        (typeof from.hash === "string" ? from.hash : "");
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (isLoading || !username.trim()) {
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await login(username);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <main className="login-page">
      <h1>Project Portal Login</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>

        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
          autoComplete="username"
          required
        />

        {error && (
          <p className="red" role="alert">
            {error}
          </p>
        )}

        <button type="submit" disabled={isLoading || !username.trim()}>
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}
