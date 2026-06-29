import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Zentrale Marken-Palette von YKsystems
        ink: {
          DEFAULT: "#121212", // Tiefschwarz / Anthrazit (Haupt-Hintergrund)
          800: "#181818",
          700: "#1e1e1e",
          600: "#262626",
          500: "#2f2f2f",
        },
        accent: {
          DEFAULT: "#c7ff4a", // Neon-Grün/Gelb – Marken-Akzent
          dim: "#9fd92f",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        accent: "0 0 0 1px rgba(199,255,74,0.25), 0 12px 40px -12px rgba(199,255,74,0.35)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
