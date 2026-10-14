import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { encerrarCss } from './src/demos/schematic-lab/demo/aislamiento.js';

export default {
  plugins: [
    tailwindcss,
    autoprefixer,
    // Encierra el CSS de la demo de Schematic Lab en su marco (solo sus archivos).
    encerrarCss(),
  ],
};
