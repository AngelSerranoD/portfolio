import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { SITE_URL } from './src/data/profile.js';

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
  plugins: [react(), urlDelSitio()],
});
