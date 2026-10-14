import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { encerrarCss } from './src/demos/litematica3d/demo/aislamiento.js';

export default {
  plugins: [
    tailwindcss,
    autoprefixer,
    // Encierra el CSS de la demo de Litematica3D en su marco (solo sus archivos).
    encerrarCss(),
  ],
};
