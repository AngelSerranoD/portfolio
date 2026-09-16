/**
 * DailyWeigh — iconos de trazo.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */

function Trazo({ children, className = 'h-5 w-5' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const Izquierda = (p) => <Trazo {...p}><path d="M15 5l-7 7 7 7" /></Trazo>;
export const Derecha = (p) => <Trazo {...p}><path d="M9 5l7 7-7 7" /></Trazo>;
export const Mas = (p) => <Trazo {...p}><path d="M12 5v14M5 12h14" /></Trazo>;
export const Menos = (p) => <Trazo {...p}><path d="M5 12h14" /></Trazo>;
