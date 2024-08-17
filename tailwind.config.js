/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3490DC",
        secondary: "#FFC107",
        danger: "#E74C3C",
        success: "#2ECC71",
        warning: "#F1C40F",
        info: "#34495E",
        light: "#ECF0F1",
        dark: "#34495E",
      },
    },
  },
  plugins: [],
};
