/** @type {import('tailwindcss').Config} */

export default {

  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],

  theme: {
    extend: {

      colors: {
        primary: "#0f172a",
        secondary: "#111827",
        accent: "#22c55e",
      },

      borderRadius: {
        xl2: "24px",
      },

    },
  },

  plugins: [],
}