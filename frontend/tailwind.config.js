/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          bg: "#0A0E14",
          surface: "#111721",
          raised: "#161D29",
          border: "#212A38",
        },
        ink: {
          primary: "#E7ECF3",
          secondary: "#8C99AB",
          muted: "#5B6779",
        },
        accent: {
          DEFAULT: "#2DD4BF",
          dim: "#1B8F80",
          glow: "#5EEAD4",
        },
        risk: {
          safe: "#22C55E",
          low: "#84CC16",
          medium: "#EAB308",
          high: "#F97316",
          critical: "#EF4444",
          unknown: "#64748B",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(45, 212, 191, 0.35)",
      },
      keyframes: {
        scanbeam: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeScaleIn: {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        cardIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pageFade: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        scanbeam: "scanbeam 1.6s ease-in-out infinite",
        "fade-up": "fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-scale-in": "fadeScaleIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
        "card-in": "cardIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both",
        "page-fade": "pageFade 0.3s ease-out both",
      },
    },
  },
  plugins: [],
};
