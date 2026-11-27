import { createContext } from "react";
// Shared by HeroRuntime and EditableText (kept separate to avoid a circular import).
export const HeroCtx = createContext(null);
