import type { Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#f9fafb",
        foreground: "#111827"
      }
    }
  },
  plugins: []
} satisfies Config;