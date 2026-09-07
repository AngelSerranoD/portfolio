/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /*
         * Escala monocroma. Sin color: solo densidad.
         * Los tonos 300-500 se usan para texto sobre el fondo 950, así que
         * están fijados por contraste WCAG AA (>= 4.5:1), no por estética:
         * 300 → 8.8:1 · 400 → 6.1:1 · 500 → 4.6:1
         * Del 600 hacia abajo son superficies y bordes, nunca texto.
         */
        mono: {
          950: '#000000',
          900: '#070707',
          850: '#0D0D0D',
          800: '#141414',
          700: '#1F1F1F',
          600: '#2E2E2E',
          500: '#757575',
          400: '#8A8A8A',
          300: '#A8A8A8',
          200: '#CFCFCF',
          100: '#E9E9E9',
          50: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['Sora', 'Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.045em',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both',
      },
    },
  },
  plugins: [],
};
