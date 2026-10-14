/**
 * Demo de Schematic Lab — sustituto de `@tauri-apps/api/window`.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 *
 * La ventana es el marco del portfolio: sus botones solo avisan.
 */
import { avisarDemo } from '../aviso.js';

const nada = () => {};
const ventana = {
  isMaximized: async () => false,
  onResized: async () => nada,
  onCloseRequested: async () => nada,
  minimize: async () => avisarDemo('En la demo, la ventana no se minimiza.'),
  toggleMaximize: async () => avisarDemo('En la demo, la ventana no se maximiza.'),
  close: async () => avisarDemo('En la demo, la ventana no se cierra.'),
  destroy: async () => {},
};

export const getCurrentWindow = () => ventana;
