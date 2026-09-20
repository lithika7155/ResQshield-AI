/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        command: {
          bg: "#080A0F",
          card: "#0D121D",
          cardHover: "#121927",
          panel: "#151C2C",
          border: "rgba(255, 255, 255, 0.08)",
          borderHover: "rgba(255, 255, 255, 0.16)",
          muted: "#64748B",
          text: "#E2E8F0",
          heading: "#F8FAFC",
        },
        crimson: {
          500: "#EF4444",
          600: "#DC2626",
          700: "#B91C1C",
          900: "#450A0A",
          glow: "rgba(239, 68, 68, 0.15)",
        },
        tactical: {
          amber: "#F59E0B",
          cyan: "#06B6D4",
          blue: "#3B82F6",
          emerald: "#10B981",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'command': '0 4px 20px -2px rgba(0, 0, 0, 0.7)',
        'crimson-glow': '0 0 25px -5px rgba(239, 68, 68, 0.3)',
        'cyan-glow': '0 0 25px -5px rgba(6, 182, 212, 0.2)',
        'emerald-glow': '0 0 25px -5px rgba(16, 185, 129, 0.25)',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        radarScan: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        telemetryPulse: {
          '0%': { transform: 'scale(0.95)', opacity: 0.8 },
          '50%': { transform: 'scale(1.05)', opacity: 1 },
          '100%': { transform: 'scale(0.95)', opacity: 0.8 },
        }
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-scan': 'radarScan 8s linear infinite',
        'telemetry': 'telemetryPulse 2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
