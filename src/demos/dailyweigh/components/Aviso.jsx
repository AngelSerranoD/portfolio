/**
 * DailyWeigh — aviso breve en la parte baja de la pantalla.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
import { useEffect } from 'react';

export default function Aviso({ mensaje, onFin }) {
  useEffect(() => {
    if (!mensaje) return undefined;
    const id = setTimeout(onFin, 3200);
    return () => clearTimeout(id);
  }, [mensaje, onFin]);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+1rem)] z-[60] flex justify-center px-5"
    >
      {mensaje && (
        <p className="animate-asomar rounded-full bg-cacao px-5 py-3 text-center text-[0.95rem] font-medium text-crema shadow-xl shadow-cacao/30">
          {mensaje}
        </p>
      )}
    </div>
  );
}
