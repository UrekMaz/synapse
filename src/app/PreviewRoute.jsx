import { useMemo } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useEditorStore } from "../store/editorStore.js";
import SiteRenderer from "./SiteRenderer.jsx";

// Live draft preview: /preview is the home page, /preview/:slug any other page.
export default function PreviewRoute() {
  const page = useEditorStore((s) => s.page);
  const pages = useEditorStore((s) => s.pages);
  const linkSettings = useEditorStore((s) => s.linkSettings);
  const { slug } = useParams();

  const all = useMemo(() => [page, ...(pages || [])].filter(Boolean), [page, pages]);
  const current = slug ? all.find((p) => p.slug === slug) : all.find((p) => p.home) || page;

  if (!page) return <Navigate to="/new" replace />;
  if (!current) return <Navigate to="/preview" replace />;
  return <SiteRenderer pages={all} current={current} linkSettings={linkSettings} basePath="/preview" />;
}
