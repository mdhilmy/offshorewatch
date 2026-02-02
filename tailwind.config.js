/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        weather: {
          calm: '#22c55e',
          moderate: '#84cc16',
          elevated: '#eab308',
          high: '#f97316',
          severe: '#ef4444',
          extreme: '#7c2d12',
        },
        storm: {
          td: '#60a5fa',
          ts: '#34d399',
          cat1: '#fbbf24',
          cat2: '#f97316',
          cat3: '#ef4444',
          cat4: '#dc2626',
          cat5: '#7f1d1d',
        },
        seismic: {
          minor: '#93c5fd',
          light: '#86efac',
          moderate: '#fde047',
          strong: '#fb923c',
          major: '#f87171',
          great: '#dc2626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
      },
    },
  },
  plugins: [],
}
