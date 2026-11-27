import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, RotateCcw } from "lucide-react";
import StitchedWordmark from "../components/landing/StitchedWordmark.jsx";

// Public landing page: "Synapse" stitched in thread, then the way into the builder.
export default function Landing() {
  const [run, setRun] = useState(0);
  const [done, setDone] = useState(false);
  const replay = () => { setDone(false); setRun((r) => r + 1); };

  return (
    <div className="landing h-full overflow-y-auto">
      <div className="landing-weave" aria-hidden />
      <main className="relative mx-auto flex min-h-full max-w-5xl flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="sr-only">Synapse</h1>
        <div className="landing-hoop w-full max-w-3xl">
          <StitchedWordmark key={run} onDone={() => setDone(true)} className="w-full" />
        </div>

        <div className={`landing-reveal mt-6 flex flex-col items-center ${done ? "is-in" : ""}`}>
          <p className="max-w-xl text-lg text-ed-text/90 sm:text-xl">Stitch together a portfolio that gets you hired.</p>
          <p className="mt-2 max-w-lg text-sm text-ed-muted">Show your best work, tell your story and publish it to your own link. No code needed.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/dashboard" className="flex h-11 items-center gap-2 rounded-2xl bg-ed-accent px-6 text-sm font-semibold text-white shadow-glow transition hover:brightness-110">
              Start building <ArrowRight size={16} />
            </Link>
            <button onClick={replay} className="flex h-11 items-center gap-2 rounded-2xl border border-ed-border bg-ed-raised/70 px-4 text-sm text-ed-muted transition hover:text-white">
              <RotateCcw size={14} /> Stitch again
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
