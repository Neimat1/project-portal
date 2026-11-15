import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RootLayout from "./layouts/RootLayout";
import HomePage from "./pages/HomePage";
import DashboardLayout from "./layouts/DashboardLayout";

import OverviewPage from "./pages/OverviewPage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import ProjectListPage from "./pages/ProjectListPage";
import { lazy, Suspense } from "react";
import NotFoundPage from "./pages/NotFoundPage";
import { withAuth } from "./hoc/withAuth";

const ProtectedDashboardLayout = withAuth(DashboardLayout);

const SettingsPage = lazy(() => import("./pages/SettingsPage"));

const ProtectedSettingsPage = withAuth(SettingsPage, { role: "admin" });

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="dashboard" element={<ProtectedDashboardLayout />}>
          <Route index element={<OverviewPage />} />
          <Route path="projects" element={<ProjectListPage />} />
          <Route path="projects/:projectId" element={<ProjectDetailsPage />} />
          <Route
            path="settings"
            element={
              <Suspense fallback={<p>Loading settings ...</p>}>
                <ProtectedSettingsPage />
              </Suspense>
            }
          />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
