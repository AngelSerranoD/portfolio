/**
 * Lo que envuelve todas las rutas: el panorama de fondo y, encima, la página.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 *
 * Está fuera de <Routes>: al navegar, el panorama no se remonta y sigue
 * girando, como al pasar de un menú a otro en el juego.
 */
import Panorama from './Panorama';

export default function Escenario({ children }) {
  return (
    <>
      <Panorama />
      <div className="relative z-10">{children}</div>
    </>
  );
}
