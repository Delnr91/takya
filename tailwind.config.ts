import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        forest: "var(--color-forest)",
        ivory: "var(--color-ivory)",
        sage: "var(--color-sage)",
        "dark-surface": "var(--color-dark-surface)",
        "dark-deep": "var(--color-dark-deep)",
        critical: "var(--color-critical)",
        medium: "var(--color-medium)",
        info: "var(--color-info)",
        terracotta: "#E05D44",
      },
      fontFamily: {
        display: ["var(--font-sora)", "sans-serif"],
        sans: ["var(--font-jakarta)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
