/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        candy: {
          base: "#0b0912",
          card: "#161224",
          elevated: "#1e1834",
          white: "#f8f6fc",
          lemon: "#FFE45E",
          pink: "#FF5CA8",
          mint: "#5CF2C0",
          sky: "#5CC8FF",
          grape: "#8B5CF6",
        },
        vault: {
          base: "#0b0912",
          pack: "#110e1a",
          elevated: "#181324",
          violet: "#8b5cf6",
          violetDeep: "#3b2a6b",
          lavender: "#c4b5fd",
          cyan: "#00f0ff",
        },
      },
      fontFamily: {
        display: ["'Bricolage Grotesque'", "'Fredoka'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
        hand: ["'Caveat'", "cursive"],
        mono: ["'DM Mono'", "monospace"],
      },
      boxShadow: {
        "hard-lemon": "6px 6px 0px #FFE45E",
        "hard-pink": "6px 6px 0px #FF5CA8",
        "hard-mint": "6px 6px 0px #5CF2C0",
        "hard-sky": "6px 6px 0px #5CC8FF",
        "hard-grape": "6px 6px 0px #8B5CF6",
        "hard-black": "4px 4px 0px #0b0912",
        "vault-pack": "6px 6px 0px #3b2a6b, 0 20px 50px rgba(0,0,0,0.5)",
      },
      borderRadius: {
        chunky: "20px",
        "chunky-lg": "28px",
      },
    },
  },
  plugins: [],
};
