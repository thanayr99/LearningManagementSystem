/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef7ff",
          100: "#d9ecff",
          200: "#bce0ff",
          300: "#8ccfff",
          400: "#56b5ff",
          500: "#2a94ff",
          600: "#1874f5",
          700: "#145ddf",
          800: "#164db4",
          900: "#184489"
        }
      }
    }
  },
  plugins: []
};
