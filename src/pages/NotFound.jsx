/**
 * Página 404 como la pantalla de muerte del juego.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
import { Link, useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  /* react-router guarda en history.state.idx cuántas entradas hay detrás; 0 = se entró directamente aquí. */
  const reaparecer = () => (window.history.state?.idx > 0 ? navigate(-1) : navigate('/'));

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-red-950/80 px-6 text-center">
      <h1 className="font-mc text-[36px] font-bold text-mc-texto mc-sombra sm:text-[54px]">¡Has muerto!</h1>
      <p className="font-mc text-[16px] text-mc-texto mc-sombra">Esta página no existe</p>
      <p className="font-mc text-[14px] text-mc-texto mc-sombra">
        Puntuación: <span className="text-mc-splash">404</span>
      </p>
      <div className="mt-8 flex w-full max-w-[400px] flex-col gap-2">
        <button type="button" onClick={reaparecer} className="mc-boton mc-boton-ancho">
          Reaparecer
        </button>
        <Link to="/" className="mc-boton mc-boton-ancho">
          Pantalla de título
        </Link>
      </div>
    </div>
  );
}
