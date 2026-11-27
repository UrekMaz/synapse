import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard.jsx";
import Landing from "./Landing.jsx";
import Editor from "./Editor.jsx";
import PreviewRoute from "./PreviewRoute.jsx";
import PublishedSiteRoute from "./PublishedSiteRoute.jsx";
import LayoutSelectionPage from "../components/layout-selection/LayoutSelectionPage.jsx";
import ConfigureLayoutPage from "../components/layout-selection/ConfigureLayoutPage.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/new" element={<LayoutSelectionPage />} />
      <Route path="/new/configure" element={<ConfigureLayoutPage />} />
      <Route path="/editor" element={<Editor />} />
      <Route path="/preview" element={<PreviewRoute />} />
      <Route path="/preview/:slug" element={<PreviewRoute />} />
      <Route path="/s/:site" element={<PublishedSiteRoute />} />
      <Route path="/s/:site/:page" element={<PublishedSiteRoute />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}