import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEditorStore } from "../../store/editorStore.js";
import LayoutConfiguration from "./LayoutConfiguration.jsx";
import WizardHeader from "./WizardHeader.jsx";

export default function ConfigureLayoutPage() {
  const navigate = useNavigate();
  const createPage = useEditorStore((s) => s.createPage);
  const portfolio = useEditorStore((s) => (s.draft.siteType || "portfolio") === "portfolio");

  const onCreate = () => {
    createPage();
    if (portfolio) {
      // Turn the starter's "#work" style links into real section links, without leaving an undo step behind.
      useEditorStore.getState().autoConnectLinks();
      useEditorStore.setState({ past: [], future: [] });
    }
    navigate("/editor");
  };

  return (
    <div className="h-full overflow-y-auto">
      <WizardHeader step={2} backTo="/new" />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="mb-6 text-3xl font-semibold">Configure layout</h1>
        <LayoutConfiguration
          footer={
            <div className="flex justify-end pt-2">
              <button onClick={onCreate}
                      className="flex h-11 items-center gap-2 rounded-xl bg-ed-accent px-5 text-sm font-semibold hover:brightness-110">
                {portfolio ? "Create my portfolio" : "Create website"} <ArrowRight size={16} />
              </button>
            </div>
          }
        />
      </main>
    </div>
  );
}