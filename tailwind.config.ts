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
        eau: {
          50: "#e6f4fa",
          100: "#b3dff0",
          200: "#80c9e6",
          300: "#4db4dc",
          400: "#1a9ed2",
          500: "#0077B6",
          600: "#005f92",
          700: "#00476d",
          800: "#003049",
          900: "#001824",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
