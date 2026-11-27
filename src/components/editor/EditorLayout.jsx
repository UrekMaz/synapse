import { useEffect } from "react";
import TopToolbar from "./TopToolbar.jsx";
import LeftSidebar from "./LeftSidebar.jsx";
import RightInspector from "./RightInspector.jsx";
import BottomToolbar from "./BottomToolbar.jsx";
import Canvas from "./Canvas/Canvas.jsx";
import HeroStudio from "../hero-studio/HeroStudio.jsx";
import DeleteGuard from "./DeleteGuard.jsx";
import ThemeStudio from "../theme-studio/ThemeStudio.jsx";
import TimelineDock from "../animation-studio/TimeLineDock.jsx";
import { useEditorStore } from "../../store/editorStore.js";
import { themeCssVars } from "../../utils/tokens.js";

export default function EditorLayout() {
  const { mode, undo, redo, page } = useEditorStore();

  useEffect(() => {
    const onKey = (e) => {
      if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        e.shiftKey ? redo() : undo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo]);

  return (
    // Theme vars at the root so library thumbnails and the studio preview use the page's design system too.
    <div className="flex h-full flex-col" style={themeCssVars(page.theme)}>
      <TopToolbar />
      <div className="relative min-h-0 flex-1">
        <Canvas />
        {mode === "edit" && (<><LeftSidebar /><RightInspector /><TimelineDock /></>)}
        <BottomToolbar />
      </div>
      <HeroStudio />
      <DeleteGuard />
      <ThemeStudio />
    </div>
  );
}