/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* Escala monocroma. Sin color: solo densidad. */
        mono: {
          950: '#000000',
          900: '#070707',
          850: '#0D0D0D',
          800: '#141414',
          700: '#1F1F1F',
          600: '#2E2E2E',
          500: '#4A4A4A',
          400: '#6E6E6E',
          300: '#949494',
          200: '#BFBFBF',
          100: '#E4E4E4',
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
