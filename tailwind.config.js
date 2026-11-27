/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ed: {
          bg: "#0a0a14",
          panel: "#12121f",
          raised: "#1a1a2e",
          border: "rgba(255,255,255,0.08)",
          text: "#e8e8f5",
          muted: "#8b8ba7",
          accent: "#8b6cff",
          accent2: "#4fb8e8",
        },
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(139,108,255,.9), 0 0 24px rgba(139,108,255,.35)",
      },
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
};
