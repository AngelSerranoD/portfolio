/**
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-7 px-6 text-center">
      <p className="font-display text-7xl font-bold tracking-tightest text-stone">
        404
      </p>
      <h1 className="font-display text-2xl font-bold tracking-tight">
        Esta página no existe
      </h1>
      <Link to="/" className="btn-primary">
        Volver al portfolio
      </Link>
    </div>
  );
}
