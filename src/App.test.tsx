import { beforeEach, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { SettingsProvider } from "./context/SettingsProvider";

beforeEach(() => {
  localStorage.clear();
});

test("unknown URL renders the Not Found page", () => {
  render(
    <MemoryRouter initialEntries={["/unknown-page"]}>
      <AuthProvider>
        <SettingsProvider>
          <App />
        </SettingsProvider>
      </AuthProvider>
    </MemoryRouter>,
  );

  expect(
    screen.getByRole("heading", {
      name: /404 - page not found/i,
    }),
  ).toBeInTheDocument();
});
