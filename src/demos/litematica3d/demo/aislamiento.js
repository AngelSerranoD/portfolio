/**
 * Demo de Litematica3D — aislamiento en el build del portfolio (Node, no se
 * empaqueta: lo importan vite.config.js y postcss.config.js).
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 *
 * La copia de la app (src/demos/litematica3d/) se deja tal cual sale de su
 * repositorio; lo que no puede funcionar en la web se cambia desde fuera y
 * SOLO para los archivos de esta carpeta:
 *
 * - `sustitutosTauri()` (Vite): los imports de `@tauri-apps/*` y `r3f-perf`
 *   van a los sustitutos de demo/. El resto del portfolio no los ve y no hace
 *   falta instalar Tauri.
 * - `encerrarCss()` (PostCSS): cada selector del CSS de la app se encierra en
 *   `.l3d-raiz` (el div que monta index.jsx). `:root`, `html`, `body` y
 *   `#root` pasan a ser ese div. Así el reset, los tokens y el tema de la app
 *   no salen del marco aunque Vite deje cargadas sus hojas al salir de la demo.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
/** En minúsculas: en Windows la letra de unidad llega unas veces como `C:` y otras como `c:`. */
const CARPETA_DEMO = `${path.dirname(AQUI).replace(/\\/g, '/')}/`.toLowerCase();

export const RAIZ = '.l3d-raiz';

const enDemo = (archivo) =>
  !!archivo && archivo.replace(/\\/g, '/').toLowerCase().startsWith(CARPETA_DEMO);

const SUSTITUTOS = {
  '@tauri-apps/api/core': 'tauri/core.js',
  '@tauri-apps/api/window': 'tauri/window.js',
  '@tauri-apps/api/event': 'tauri/event.js',
  '@tauri-apps/api/webview': 'tauri/webview.js',
  '@tauri-apps/plugin-dialog': 'tauri/dialogo.js',
  'r3f-perf': 'r3f-perf.js',
};

export function sustitutosTauri() {
  return {
    name: 'demo-litematica3d-sustitutos',
    enforce: 'pre',
    resolveId(fuente, importador) {
      if (!enDemo(importador)) return null;
      const sustituto = SUSTITUTOS[fuente];
      if (sustituto) return path.join(AQUI, sustituto).replace(/\\/g, '/');
      if (fuente.startsWith('@tauri-apps/')) {
        // Un import nuevo de la app tras sincronizar: mejor fallar aquí.
        this.error(`La demo de Litematica3D no tiene sustituto para «${fuente}».`);
      }
      return null;
    },
  };
}

/** `html` / `:root…` → `.l3d-raiz…`; el resto, descendiente de `.l3d-raiz`. */
function encerrar(selector) {
  const s = selector.trim();
  const raiz = s.match(/^(?::root|html|body|#root)(?![\w-])/);
  if (raiz) return RAIZ + s.slice(raiz[0].length);
  return `${RAIZ} ${s}`;
}

export function encerrarCss() {
  return {
    postcssPlugin: 'demo-litematica3d-encerrar-css',
    Once(raiz) {
      if (!enDemo(raiz.source?.input.file)) return;
      raiz.walkRules((regla) => {
        if (regla.parent?.type === 'atrule' && /keyframes$/i.test(regla.parent.name)) return;
        regla.selectors = [...new Set(regla.selectors.map(encerrar))];
      });
    },
  };
}
encerrarCss.postcss = true;
