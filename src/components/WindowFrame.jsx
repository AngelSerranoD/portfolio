/**
 * Marco de ventana de escritorio para las demos de apps de escritorio.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 *
 * La app de dentro pinta su propia barra de título, así que el marco es solo
 * un borde fino con el tamaño de la ventana. Si el espacio disponible es más
 * estrecho que la ventana, se reduce con `transform: scale` y se reserva el
 * alto ya escalado para no dejar hueco.
 */
import { useLayoutEffect, useRef, useState } from 'react';

export default function WindowFrame({ children, width = 1280, height = 800 }) {
  const medidor = useRef(null);
  const [disponible, setDisponible] = useState(width);

  useLayoutEffect(() => {
    const el = medidor.current;
    if (!el) return undefined;
    const medir = () => setDisponible(el.clientWidth);
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* Nunca se agranda por encima del tamaño real de la ventana. */
  const escala = Math.min(1, disponible / width);

  return (
    <div ref={medidor} className="flex w-full justify-center">
      {/* Caja con el tamaño ya escalado: es lo que ocupa en la página. */}
      <div
        className="relative shrink-0 overflow-hidden bg-ink p-px ring-1 ring-ink"
        style={{ width: width * escala, height: height * escala }}
      >
        <div
          className="relative overflow-hidden bg-black"
          style={{
            width,
            height,
            transform: `scale(${escala})`,
            transformOrigin: 'top left',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
