/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc5fb',
          400: '#36a9f7',
          500: '#2563eb', // Primary Blue accent
          600: '#1d4ed8',
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#172554',
        },
        emerald: {
          500: '#059669', // Primary Emerald success
          600: '#047857',
        },
        nta: {
          unvisited: '#e2e8f0', // Gray slate-200
          unanswered: '#ef4444', // Red 500
          answered: '#10b981', // Green 500
          review: '#8b5cf6', // Purple 500
          ansReview: '#7c3aed', // Purple 600 with Green dot
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'card-hover': '0 20px 25px -5px rgba(37, 99, 235, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
