/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#21153F",
        navyLight: "#4B3375",
        indigoDeep: "#21153F",
        indigo: "#43218A",
        violet: "#7028EF",
        violetLight: "#F0E8FF",
        forest: "#5E8E17",
        forestLight: "#F1FFD8",
        orange: "#FF7A5A",
        orangeLight: "#FFF0E9",
        pink: "#FF5A60",
        pinkLight: "#FFF0EF",
        blue: "#6F7BFF",
        blueLight: "#ECEEFF",
        paper: "#FFF9ED",
        ink: "#201A32",
        line: "#E8E0D3",
        rose: "#FF5A60",
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      backgroundImage: {
        "vm-gradient": "linear-gradient(135deg, #21153F 0%, #43218A 55%, #7028EF 100%)",
        "vm-warm": "linear-gradient(120deg, #FF5A60 0%, #FF8C5A 100%)",
        "vm-rainbow": "linear-gradient(120deg, #6F7BFF 0%, #7028EF 50%, #FF5A60 100%)",
      },
    },
  },
  plugins: [],
};
