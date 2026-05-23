/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#0C0A09",
          100: "#1C1916",
          200: "#3C3731",
          300: "#5C564F",
          400: "#767069",
          500: "#8E8981",
          600: "#D4CEC5",
          700: "#F2EFF9",
          800: "#EAE7E2",
          900: "#F9F8F6",
          950: "#FDFCFB",
        },
        accent: {
          50: "#FDFBF7",
          100: "#F6EDE9",
          200: "#ECCFCE",
          300: "#DE9F93",
          400: "#C46D4B",
          500: "#B85C38",
          600: "#9A4B2C",
          700: "#7A3B21",
          800: "#5A2B18",
          900: "#3B1B0F",
          950: "#1E0D07",
        },
      },
    },
  },
  plugins: [],
};
