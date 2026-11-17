import type { Config } from "tailwindcss";
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { page: "var(--color-page)", "accent-text": "var(--color-accent-text)" },
      fontFamily: { display: ["var(--font-display)", "ui-sans-serif", "system-ui"] },
    },
  },
  plugins: [],
} satisfies Config;
