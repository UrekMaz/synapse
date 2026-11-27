import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "../ui/Logo.jsx";

export default function WizardHeader({ step, backTo }) {
  const navigate = useNavigate();
  return (
    <header className="flex h-14 items-center gap-4 border-b border-ed-border px-6">
      <Logo />
      <button onClick={() => navigate(backTo)} className="flex items-center gap-1.5 text-sm text-ed-muted hover:text-white">
        <ArrowLeft size={14} /> Back
      </button>
      <div className="ml-auto flex items-center gap-3">
        <div className="flex gap-1.5">
          {[1, 2].map((n) => (
            <span key={n} className={`h-1 w-14 rounded-full ${n <= step ? "bg-ed-accent" : "bg-ed-raised"}`} />
          ))}
        </div>
        <span className="text-xs text-ed-muted">Step {step} of 2</span>
      </div>
    </header>
  );
}