import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#E8F1F3",
          100: "#D0E3E7",
          200: "#A8C9D0",
          300: "#74A8B3",
          400: "#4A8896",
          500: "#3D7380",
          600: "#2F5D6A",
          700: "#244A54",
          800: "#1B3840",
          900: "#142A30",
          950: "#0C1A1E",
        },
        paper: {
          DEFAULT: "#F3F4F6",
          raised: "#FFFFFF",
          muted: "#E8EAED",
          line: "#D4D7DC",
        },
        ink: {
          DEFAULT: "#1A1C1E",
          muted: "#5C6168",
          faint: "#8B9097",
        },
        night: {
          DEFAULT: "#111213",
          raised: "#1A1B1D",
          border: "#2C2E32",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "6px",
      },
    },
  },
  plugins: [],
};

export default config;
