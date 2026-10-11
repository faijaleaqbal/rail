import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#ffffff",
        surface: "#f6f7f9",
        "surface-raised": "#ffffff",
        border: "#8a929e",
        "border-input": "#868e98",
        text: "#1a1a2e",
        "text-muted": "#6b7280",
        accent: "#B8450A",
        "accent-hover": "#B8450A",
        "accent-subtle": "#FFF8F0",
        "on-accent": "#ffffff",
        danger: "#c62f2f",
        "danger-subtle": "#fdecec",
        success: "#1f7a4d",
        "success-subtle": "#e6f4ec",
        warning: "#b45309",
        "warning-subtle": "#fef3c7",
        info: "#1e88e5",
        "info-subtle": "#e3f2fd",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "'Segoe UI'", "Roboto", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
        pill: "999px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,.06), 0 1px 3px rgba(16,24,40,.10)",
        pop: "0 12px 32px rgba(16,24,40,.16)",
      },
    },
  },
  plugins: [],
} satisfies Config;
