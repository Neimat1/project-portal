import { beforeEach, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { AuthProvider } from "../context/AuthContext";
import { withAuth } from "./withAuth";

function PrivatePage() {
  return <h1>Private Dashboard</h1>;
}

// Create the HOC at module level
const ProtectedPrivatePage = withAuth(PrivatePage);

beforeEach(() => {
  localStorage.clear();
});

test("withAuth redirects a signed-out user to login", async () => {
  render(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <AuthProvider>
        <Routes>
          <Route path="/dashboard" element={<ProtectedPrivatePage />} />

          <Route path="/login" element={<h1>Login Page</h1>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );

  expect(
    await screen.findByRole("heading", {
      name: "Login Page",
    }),
  ).toBeInTheDocument();

  expect(
    screen.queryByRole("heading", {
      name: "Private Dashboard",
    }),
  ).not.toBeInTheDocument();
});
