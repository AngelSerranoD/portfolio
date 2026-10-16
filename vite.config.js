import fs from 'node:fs';
import path from 'node:path';
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

/**
 * Solo en desarrollo: el taller de herramientas/panorama envía aquí la tira
 * horneada y se guarda en public/panorama. Únicamente acepta ese nombre.
 */
function guardarPanorama() {
  return {
    name: 'guardar-panorama',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__panorama', (req, res) => {
        const archivo = new URL(req.url, 'http://x').searchParams.get('archivo') ?? '';
        if (req.method !== 'POST' || archivo !== 'panorama.webp') {
          res.statusCode = 400;
          res.end();
          return;
        }
        const trozos = [];
        req.on('data', (t) => trozos.push(t));
        req.on('end', () => {
          const dir = path.resolve('public/panorama');
          fs.mkdirSync(dir, { recursive: true });
          fs.writeFileSync(path.join(dir, archivo), Buffer.concat(trozos));
          res.end('ok');
        });
      });
    },
  };
}

export default defineConfig({
  // sustitutosTauri: solo afecta a los archivos de src/demos/schematic-lab/.
  plugins: [sustitutosTauri(), react(), urlDelSitio(), guardarPanorama()],
  build: {
    // Three.js (~750 kB minificado) va en su propio trozo y solo lo pide la
    // demo de Schematic Lab al abrir un schematic; no se puede partir más. Se
    // sube el aviso para que salte solo si algo crece por encima de eso.
    chunkSizeWarningLimit: 800,
  },
});
