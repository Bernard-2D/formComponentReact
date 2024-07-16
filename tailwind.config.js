/** @type {import('tailwindcss').Config} */

export default {
  content: ["./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      ...["width", "minWidth", "maxWidth"].reduce(
        (tmp, d) => ({
          ...tmp,
          [d]: {
            25: "6.25rem",
            106: "26.5rem",
            180: "45rem",
            250: "62.5rem",
            300: "75rem",
            pop: "var(--radix-popover-trigger-width)",
          },
        }),
        {}
      ),
      ...["height", "minHeight", "maxHeight"].reduce(
        (tmp, d) => ({
          ...tmp,
          [d]: {
            25: "6.25rem",
          },
        }),
        {}
      ),
      lineHeight: {
        11: "2.75rem",
      },
      fontSize: {
        7: "1.75rem",
      },
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        main: "var(--zg-main)",
        "main-1": "var(--zg-main-1)",
        "main-2": "var(--zg-main-2)",
        success: "var(--zg-success)",
        "success-1": "var(--zg-success-1)",
        warn: "var(--zg-warn)",
        error: "var(--zg-error)",
        "error-1": "var(--zg-error-1)",
        minor: "var(--zg-minor)",
        "minor-1": "var(--zg-minor-1)",
        "minor-2": "var(--zg-minor-2)",
        "minor-3": "var(--zg-minor-3)",
        "minor-4": "var(--zg-minor-4)",
        "minor-5": "var(--zg-minor-5)",
        "minor-6": "var(--zg-minor-6)",
        "minor-7": "var(--zg-minor-7)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
};
