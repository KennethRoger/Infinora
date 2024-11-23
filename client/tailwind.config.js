/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,jsx,js}"],
  theme: {
    extend: {
      fontFamily: {
        "dancing-script": ['"Dancing Script"', "cursive"],
      },
      fontWeight: {
        "dancing-light": 400,
        "dancing-medium": 500,
        "dancing-bold": 700,
      },
    },
  },
  plugins: [],
};
