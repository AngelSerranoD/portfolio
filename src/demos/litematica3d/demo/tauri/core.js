/**
 * Demo de Litematica3D — sustituto de `@tauri-apps/api/core`.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 *
 * `invoke` va al núcleo falso en memoria (../nucleo.js). Solo lo importa la
 * copia de la app: la redirección está acotada a esta carpeta (../aislamiento.js).
 */
export { invoke } from '../nucleo.js';

/** Como dentro de la ventana de Tauri: barra con sus botones, sin modo navegador. */
export const isTauri = () => true;

/**
 * Las «rutas» de las miniaturas ya son URL. A las de memoria (blob:, data:)
 * se les añade `#` para que la `?v=fecha` que pone la app quede en el
 * fragmento y no rompa la URL.
 */
export function convertFileSrc(ruta) {
  return /^(blob|data):/.test(ruta) ? `${ruta}#` : ruta;
}
