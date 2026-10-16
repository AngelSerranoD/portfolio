/**
 * Pie como las esquinas de la pantalla de título: versión a la izquierda y
 * derechos a la derecha.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
import { AUTHOR, EMAIL, LINKEDIN, GITHUB_USER } from '../data/profile';

export default function Footer() {
  return (
    <footer className="mt-24 border-t-2 border-black bg-black/70 py-6 font-mc text-[12px] mc-sombra">
      <div className="container-page flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-mc-suave">Portfolio 2026 · React 19</p>
        <p className="text-mc-texto">
          © {new Date().getFullYear()} {AUTHOR}. Todos los derechos reservados.
        </p>
      </div>
      <div className="container-page mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
        <a href={`mailto:${EMAIL}`} className="link-quiet">
          {EMAIL}
        </a>
        <a href={LINKEDIN} target="_blank" rel="noreferrer noopener" className="link-quiet">
          LinkedIn
        </a>
        <a href={`https://github.com/${GITHUB_USER}`} target="_blank" rel="noreferrer noopener" className="link-quiet">
          GitHub
        </a>
        <a href="/licencias/OFL-Monocraft.txt" className="link-quiet">
          Fuente: Monocraft (OFL)
        </a>
        <span className="text-mc-suave">Sin afiliación con Mojang ni Microsoft</span>
      </div>
    </footer>
  );
}
