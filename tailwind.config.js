import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["light"], // 🔥 FORCE LIGHT THEME
    darkTheme: "light", // 🔥 EVEN IF SYSTEM IS DARK
  },
};
