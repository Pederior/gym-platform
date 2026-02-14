/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        hoverFloat: {
          "0%, 100%": {
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-5px)",
          },
        },
        fadeIn: {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        progress: {
          "0%": { width: "0", opacity: "1" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        hoverFloat: "hoverFloat 1.5s ease-in-out infinite",
        "fade-in": "fadeIn 0.6s ease-out",
        progress: "progress 0.4s ease-in-out forwards",
      },
      borderWidth: {
        3: "3px",
        6: "6px",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        primary: {
          DEFAULT: "oklch(var(--primary))",
          foreground: "oklch(var(--primary-foreground))",
          50: "rgb(var(--primary-rgb) / 0.5)",
          80: "rgb(var(--primary-rgb) / 0.8)",
          90: "rgb(var(--primary-rgb) / 0.9)",
        },

        background: "oklch(var(--background))",
        foreground: "oklch(var(--foreground))",

        card: {
          DEFAULT: "oklch(var(--card))",
          foreground: "oklch(var(--card-foreground))",
        },

        muted: {
          DEFAULT: "oklch(var(--muted))",
          foreground: "oklch(var(--muted-foreground))",
        },

        success: {
          DEFAULT: "oklch(var(--success))",
          foreground: "oklch(var(--success-foreground))",
        },

        warning: {
          DEFAULT: "oklch(var(--warning))",
          foreground: "oklch(var(--warning-foreground))",
        },

        accent: {
          DEFAULT: "oklch(var(--accent))",
          foreground: "oklch(var(--accent-foreground))",
        },

        border: "oklch(var(--border))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],

  corePlugins: {
    preflight: false,
  },
};
