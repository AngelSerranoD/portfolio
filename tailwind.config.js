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

        /* Paleta propia de la demo de Jib M3ak (src/demos/jib-m3ak). Su
           crema se llama aquí `jmcrema`: DailyWeigh ya tenía una. */
        jmcrema: '#EDE4D3',
        avena: '#C9B79C',
        canela: '#9C7A54',
        nogal: '#6B4F3A',
        cafe: '#3E2E22',
        leche: '#FBF8F2',

        /* Paleta propia de la demo de Ché boluda (src/demos/che-boluda). */
        blanco: '#FFFFFF',
        hueso: '#F4F1EC',
        arena: '#E8E2D8',
        lino: '#DAD3C6',
        piedra: '#CFC7B8',
        cuero: '#8C6444',
        corteza: '#6E5440',
        tinta: '#4A3526',
      },
      boxShadow: {
        /* Ché boluda: relieve de "arcilla", como su icono. */
        arcilla: 'inset 0 1.5px 0 rgba(255,255,255,0.85), 0 1px 0 rgba(140,100,68,0.18), 0 6px 16px -6px rgba(110,84,64,0.28)',
        hundido: 'inset 0 2px 6px rgba(110,84,64,0.28), inset 0 -1px 0 rgba(255,255,255,0.7)',
        /* Jib M3ak */
        flotante: '0 10px 30px -8px rgba(62,46,34,0.45)',
      },
      fontFamily: {
        /* Ranade en toda la página, con la variable de Fontshare (100-700). */
        sans: ['Ranade', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['Ranade', 'system-ui', 'sans-serif'],
        /* Jib M3ak: el naskh es el que dibuja bien el tashkil de la darija. */
        arabe: ['"Noto Naskh Arabic"', '"Geeza Pro"', '"Times New Roman"', 'serif'],
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
        /* Ché boluda */
        onda: {
          '0%': { transform: 'scale(1)', opacity: '0.55' },
          '100%': { transform: 'scale(1.9)', opacity: '0' },
        },
        latido: { '0%, 100%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.06)' } },
        /* Jib M3ak */
        destello: { '0%, 100%': { backgroundColor: 'transparent' }, '30%': { backgroundColor: 'rgba(156,122,84,0.22)' } },
        sello: { '0%': { transform: 'scale(0.6)', opacity: '0' }, '60%': { transform: 'scale(1.15)' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        rebote: { '0%, 100%': { transform: 'scale(1)' }, '40%': { transform: 'scale(1.25)' } },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both',
        subir: 'subir 280ms cubic-bezier(0.2, 0.9, 0.3, 1)',
        fundido: 'fundido 200ms ease-out',
        asomar: 'asomar 220ms ease-out',
        onda: 'onda 1.4s ease-out infinite',
        latido: 'latido 1.2s ease-in-out infinite',
        destello: 'destello 1.4s ease-out',
        sello: 'sello 320ms cubic-bezier(0.2, 0.9, 0.3, 1)',
        rebote: 'rebote 420ms ease-out',
      },
    },
  },
  plugins: [],
};
