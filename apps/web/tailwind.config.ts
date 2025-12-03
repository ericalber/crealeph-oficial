const config = {
  content: [
    "./src/app/**/*.{ts,tsx,mdx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/sections/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        line: "var(--line)",
        ink: "var(--ink)",
        "ink-2": "var(--ink-2)",
        text: "var(--text)",
        muted: "var(--muted)",
        brand: "var(--brand)",
        "brand-600": "var(--brand-600)",
        // shadcn-style tokens (HSL)
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        // Importante: mantemos 'muted' original em HEX (texto),
        // e oferecemos apenas 'muted-foreground' em HSL para compatibilidade.
        "muted-foreground": "hsl(var(--muted-foreground))",
      },
      keyframes: {
        shine: {
          "0%": { transform: "translateX(-150%)" },
          "100%": { transform: "translateX(150%)" },
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        shine: "shine 1.6s ease-in-out",
        ticker: "ticker 18s linear infinite",
      },
      boxShadow: {
        mdx: "var(--shadow-md)",
        lgx: "var(--shadow-lg)",
        glow: "var(--glow)",
      },
      borderRadius: {
        base: "var(--radius)",
      },
      fontSize: {
        h1: "var(--h1)",
        h2: "var(--h2)",
        h3: "var(--h3)",
      },
    },
  },
  safelist: [
    "bg-ink",
    "text-white",
    "bg-surface",
    "bg-brand",
    "hover:bg-brand-600",
    "border-white/10",
    "shadow-[var(--glow)]",
  ],
  plugins: [],
} as const;

export default config;
