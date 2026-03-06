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
    extend: {
      colors: {
        background: "#09090B",
        foreground: "#FAFAFA",
        border: "#E4E4E7",
        input: "#09090B",
        primary: {
          DEFAULT: "#7C3AED",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#09090B",
          foreground: "#E0E7FF",
        },
        muted: {
          DEFAULT: "#09090B",
          foreground: "#71717A",
        },
        success: {
          DEFAULT: "#22C55E",
          foreground: "#09090B",
        },
        accent: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        warning: {
          DEFAULT: "#F59E0B",
          foreground: "#1C1400",
        },
        card: {
          DEFAULT: "#09090B",
          foreground: "#FAFAFA",
        },
        sidebar: {
          DEFAULT: "#09090B",
          foreground: "#E0E7FF",
          primary: "#7C3AED",
          primaryForeground: "#FFFFFF",
        },
      },
      borderRadius: {
        sm: "4px",
        md: "6px",
        lg: "8px",
        xl: "12px",
      },
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
      },
    },
  },
  plugins: [
    heroui({
      themes: {
        dark: {
          colors: {
            primary: {
              DEFAULT: "#7C3AED",
              foreground: "#FFFFFF",
            },
            secondary: {
              DEFAULT: "#09090B",
              foreground: "#E0E7FF",
            },
            background: "#09090B",
            foreground: "#FAFAFA",
            focus: "#7C3AED",
          },
        },
      },
    }),
  ],
};

export default config;
