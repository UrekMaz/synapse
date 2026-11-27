import { Navigate } from "react-router-dom";
import { useEditorStore } from "../store/editorStore.js";
import EditorLayout from "../components/editor/EditorLayout.jsx";

export default function Editor() {
  const page = useEditorStore((s) => s.page);
  if (!page) return <Navigate to="/new" replace />;
  return <EditorLayout />;
}