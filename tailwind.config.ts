import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      animation: {
        "fade-up": "fadeUp .9s cubic-bezier(.2,.7,.2,1) both",
        "card-in": "cardIn 1s cubic-bezier(.2,.8,.2,1) both",
        "spin-slow": "spin 120s linear infinite",
        pop: "pop .55s cubic-bezier(.2,1.4,.4,1) both",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "none" },
        },
        cardIn: {
          from: { opacity: "0", transform: "translateY(28px) scale(.97)" },
          to: { opacity: "1", transform: "none" },
        },
        pop: {
          from: { opacity: "0", transform: "scale(.9)" },
          to: { opacity: "1", transform: "none" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
