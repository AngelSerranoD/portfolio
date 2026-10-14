/**
 * Demo de Litematica3D — sustituto de `@tauri-apps/plugin-dialog`.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 *
 * Sin selector de archivos del sistema: avisa y responde como si se cancelara.
 */
import { avisarDemo } from '../aviso.js';

export async function open(opciones = {}) {
  avisarDemo(
    opciones.directory
      ? 'En la demo no se puede elegir la carpeta de Minecraft.'
      : 'En la demo no se importan archivos: prueba con los tres de ejemplo.',
  );
  return null;
}
