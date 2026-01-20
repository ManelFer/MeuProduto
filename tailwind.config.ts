import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        pastel: {
          lavender: "#e8e5ff",
          "lavender-hover": "#d4d1ff",
          "lavender-dark": "#b8b3ff",
          pink: "#ffe5f0",
          "pink-hover": "#ffd1e8",
          blue: "#e5f2ff",
          "blue-hover": "#d1ebff",
          green: "#e5f7e8",
          "green-hover": "#d1f4d8",
          yellow: "#fffbe5",
          "yellow-hover": "#fff8d1",
          orange: "#fff4e5",
          "orange-hover": "#ffeed1",
        },
        soft: {
          gray: "#f5f5f7",
          border: "#e8e8ea",
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'pastel': '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.06)',
        'pastel-lg': '0 4px 16px rgba(0, 0, 0, 0.06), 0 2px 6px rgba(0, 0, 0, 0.08)',
        'pastel-hover': '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};
export default config;
