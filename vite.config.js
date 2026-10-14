import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { SITE_URL } from './src/data/profile.js';
import { sustitutosTauri } from './src/demos/schematic-lab/demo/aislamiento.js';

/**
 * Sustituye `%SITE_URL%` en index.html por la URL de `src/data/profile.js`.
 *
 * Las etiquetas Open Graph necesitan la URL absoluta del sitio (los
 * rastreadores de LinkedIn y WhatsApp no resuelven rutas relativas). Antes
 * estaba escrita a mano en el HTML y en profile.js, y al cambiar de dominio
 * solo se actualizó uno de los dos: las previsualizaciones apuntaban a un
 * dominio que no era el del portfolio. Ahora hay una única fuente.
 */
function urlDelSitio() {
  return {
    name: 'url-del-sitio',
    transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', SITE_URL),
  };
}

export default defineConfig({
  // sustitutosTauri: solo afecta a los archivos de src/demos/schematic-lab/.
  plugins: [sustitutosTauri(), react(), urlDelSitio()],
  build: {
    // Three.js (~750 kB minificado) va en su propio trozo y solo lo pide la
    // demo de Schematic Lab al abrir un schematic; no se puede partir más. Se
    // sube el aviso para que salte solo si algo crece por encima de eso.
    chunkSizeWarningLimit: 800,
  },
});
