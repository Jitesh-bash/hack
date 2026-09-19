/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#0a0d14',
          card: '#121824',
          border: '#1e293b',
          accent: '#00f2fe',
          purple: '#7928ca',
          pink: '#ff0080',
          danger: '#ff4d4d',
          warning: '#fbbf24',
          safe: '#10b981'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(0, 242, 254, 0.2)' },
          '100%': { boxShadow: '0 0 25px rgba(0, 242, 254, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}

