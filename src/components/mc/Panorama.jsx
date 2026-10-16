/**
 * Fondo de todas las páginas: el panorama del mundo voxel girando despacio,
 * como en la pantalla de título del juego.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 *
 * Es una tira de 360° horneada en herramientas/panorama, en proyección
 * cilíndrica, así que girar la cámara equivale a desplazarla en horizontal:
 * sin WebGL y en el compositor. La tira mide dos vueltas y se desplaza una,
 * de modo que el bucle no salta.
 */
export default function Panorama() {
  return (
    <div className="mc-panorama" aria-hidden="true">
      <div className="mc-panorama__tira" />
    </div>
  );
}
