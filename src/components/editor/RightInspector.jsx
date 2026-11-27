import { useEditorStore } from "../../store/editorStore.js";
import PageSettingsInspector from "./inspector/PageSettingsInspector.jsx";
import StoreHeroInspector from "./inspector/StoreHeroInspector.jsx";

export default function RightInspector() {
  const { page, selectedId } = useEditorStore();
  const section = page.sections.find((x) => x.id === selectedId);
  return (
    <aside className="panel absolute bottom-16 right-3 top-3 z-20 flex w-[300px] flex-col overflow-hidden">
      {section ? <StoreHeroInspector key={section.id} section={section} /> : <PageSettingsInspector />}
    </aside>
  );
}