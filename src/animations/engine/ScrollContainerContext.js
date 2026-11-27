import { createContext } from "react";
// The editor canvas scrolls inside a div, not the window. Canvas provides that ref here.
export const ScrollContainerContext = createContext(null);