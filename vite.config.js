/**
 * Configuración de Vite del portfolio y plugins de desarrollo.
 *
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
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

const MAX_PANORAMA = 5 * 1024 * 1024;

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
        const rechazar = (codigo) => {
          res.statusCode = codigo;
          res.end();
        };
        /* Una web ajena no puede escribir aquí: solo se acepta el mismo origen y image/webp. */
        const origen = req.headers['sec-fetch-site'];
        if (
          req.method !== 'POST' ||
          archivo !== 'panorama.webp' ||
          (origen && origen !== 'same-origin') ||
          req.headers['content-type'] !== 'image/webp'
        ) {
          return rechazar(400);
        }
        const trozos = [];
        let tamano = 0;
        req.on('data', (t) => {
          tamano += t.length;
          if (tamano > MAX_PANORAMA) {
            req.destroy();
            return;
          }
          trozos.push(t);
        });
        req.on('end', () => {
          const datos = Buffer.concat(trozos);
          const esWebp = datos.length > 12 && datos.toString('latin1', 0, 4) === 'RIFF' && datos.toString('latin1', 8, 12) === 'WEBP';
          if (tamano > MAX_PANORAMA || !esWebp) return rechazar(400);
          const dir = path.resolve('public/panorama');
          fs.mkdirSync(dir, { recursive: true });
          fs.writeFileSync(path.join(dir, archivo), datos);
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
