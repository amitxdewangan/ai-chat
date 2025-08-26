import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // Enable dark mode
  theme: {
    extend: {
      colors: {
        "accent-green": {
          DEFAULT: "#10a37f", // ✅ ChatGPT's green
          dark: "#0d8a6c",
        },
      },
    },
  },
  plugins: [],
};

export default config;
