/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "blue-lighter": "#f7fafc",
        "blue-light": "#edf2f7",
      },
    },
  },
  variants: {},
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".scrollbar-w-2": {
          "::-webkit-scrollbar": {
            width: "0.25rem",
            height: "0.25rem",
          },
        },
        ".scrollbar-track-blue-lighter": {
          "::-webkit-scrollbar-track": {
            background: "#f7fafc",
            "background-opacity": "1",
          },
        },
        ".scrollbar-thumb-blue": {
          "::-webkit-scrollbar-thumb": {
            background: "#edf2f7",
            "background-opacity": "1",
          },
        },
        ".scrollbar-thumb-rounded": {
          "::-webkit-scrollbar-thumb": {
            "border-radius": "0.25rem",
          },
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
