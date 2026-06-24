import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: { DEFAULT: "#FFFFFF", 2: "#F6F9FC" },
        ink: { DEFAULT: "#080810", 2: "#0E0E18" },
        volt: { DEFAULT: "#0094FF", deep: "#0077D4" },
        mist: { DEFAULT: "#E8F4FF", line: "#CFE6FB" },
        grade: { a: "#10B981", b: "#F59E0B", c: "#94A3B8" },
        muted: "#5B6573",
        hairline: "#E9ECF1",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      boxShadow: {
        volt: "0 22px 50px -16px rgba(0,148,255,.35)",
        "volt-sm": "0 10px 28px -8px rgba(0,148,255,.35)",
      },
      keyframes: {
        scroll: { to: { transform: "translateX(-50%)" } },
        rise: {
          from: { opacity: "0", transform: "translateY(22px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        scan: { "0%": { top: "0" }, "100%": { top: "100%" } },
        bob: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
        pulse2: {
          "0%": { boxShadow: "0 0 0 0 rgba(0,148,255,.35)" },
          "70%": { boxShadow: "0 0 0 8px transparent" },
          "100%": { boxShadow: "0 0 0 0 transparent" },
        },
      },
      animation: {
        scroll: "scroll 28s linear infinite",
        "scroll-slow": "scroll 30s linear infinite",
        rise: "rise .8s cubic-bezier(.2,.8,.2,1) forwards",
        scan: "scan 4s linear infinite",
        bob: "bob 5s ease-in-out infinite",
        pulse2: "pulse2 2s infinite",
      },
    },
  },
  plugins: [],
};
export default config;
