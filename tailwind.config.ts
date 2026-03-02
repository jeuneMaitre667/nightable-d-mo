import { heroui } from "@heroui/react";
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    heroui({
      themes: {
        dark: {
          colors: {
            primary: {
              DEFAULT: "#C9973A",
              foreground: "#050508",
            },
            secondary: {
              DEFAULT: "#C4567A",
              foreground: "#FFFFFF",
            },
            background: "#050508",
            foreground: "#F7F6F3",
            focus: "#C9973A",
          },
        },
      },
    }),
  ],
};

export default config;
