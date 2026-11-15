import { NavLink } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="app-header">
      <h2>Project Portal</h2>

      <nav aria-label="Main navigation">
        <NavLink to="/" end>
          Home
        </NavLink>

        <NavLink to="/dashboard">Dashboard</NavLink>
      </nav>

      <div className="user-section">
        {user ? (
          <>
            <span>Welcome, {user.name}</span>
            <button type="button" onClick={logout}>
              Log out
            </button>
          </>
        ) : (
          <NavLink to="/login">Login</NavLink>
        )}
      </div>
    </header>
  );
}
