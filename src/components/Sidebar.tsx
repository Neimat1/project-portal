import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h3>Dashboard</h3>

      <nav aria-label="Dashboard navigation">
        <NavLink to="/dashboard" end>
          Overview
        </NavLink>

        <NavLink to="/dashboard/projects">Projects</NavLink>

        <NavLink to="/dashboard/settings">Settings</NavLink>
      </nav>
    </aside>
  );
}
