/**
 * Demo de Litematica3D — sustituto de `@tauri-apps/api/webview`.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 *
 * Soltar archivos no llega a la app (index.jsx avisa si se intenta).
 */
const webview = { onDragDropEvent: async () => () => {} };

export const getCurrentWebview = () => webview;
