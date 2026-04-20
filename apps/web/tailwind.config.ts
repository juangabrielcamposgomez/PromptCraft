import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B0B0B", // Deep Space
        foreground: "#F3EFE0", // Solar Sand
        primary: {
          DEFAULT: "#00A67E", // Emerald Innovation
          foreground: "#F3EFE0",
        },
        accent: {
          DEFAULT: "#9177C7", // Cybernetic Purple
          foreground: "#F3EFE0",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        display: ["var(--font-outfit)"],
      },
    },
  },
  plugins: [],
};
export default config;
