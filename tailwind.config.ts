import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        foreground: "var(--foreground)",
        "custom-gray": "#FAFAFB",
      },
    },
  },
  plugins: [
    require("daisyui"),
    require("tailwind-scrollbar")({
      nocompatible: true, // Ensures it uses its own custom styles without fallback to browser defaults
    }),
  ],
} satisfies Config;
