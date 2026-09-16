/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        /*
         * Paleta de cinco tonos cálidos.
         *
         * Reparto de papeles, tomado de la referencia: el texto va siempre
         * en `ink` o `slate`; los grises medios son superficie y bloque,
         * nunca texto pequeño. `clay` sobre `paper` da 2,7:1, insuficiente
         * para leer, de ahí que solo se use en reglas, bordes y detalles.
         *
         * Contraste sobre `paper`:  ink 9,4:1 · slate 4,3:1 · clay 2,7:1
         */
        paper: '#EAE6DD',
        stone: '#C7C2B9',
        clay: '#8F8C84',
        slate: '#6E6A63',
        ink: '#3B3834',

        /* Paleta propia de la demo de DailyWeigh (src/demos/dailyweigh). */
        crema: '#F4E1C1',
        miel: '#D9A05B',
        cobre: '#B5651D',
        oxido: '#8C3B1B',
        cacao: '#5A2A1B',
        nata: '#FAF0E0',
      },
      fontFamily: {
        /* Ranade en toda la página, con la variable de Fontshare (100-700). */
        sans: ['Ranade', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['Ranade', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        /* DailyWeigh */
        subir: { from: { transform: 'translateY(100%)' }, to: { transform: 'translateY(0)' } },
        fundido: { from: { opacity: '0' }, to: { opacity: '1' } },
        asomar: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both',
        subir: 'subir 280ms cubic-bezier(0.2, 0.9, 0.3, 1)',
        fundido: 'fundido 200ms ease-out',
        asomar: 'asomar 220ms ease-out',
      },
    },
  },
  plugins: [],
};
