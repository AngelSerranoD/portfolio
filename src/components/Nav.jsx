/**
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
import { Link } from 'react-router-dom';
import { GITHUB_USER, EMAIL } from '../data/profile';

export default function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-mono-800 bg-mono-950/85 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between">
        <Link
          to="/"
          className="font-display text-sm font-bold tracking-tight text-mono-50 transition-opacity duration-300 hover:opacity-60"
        >
          Ángel Serrano
        </Link>

        <nav className="flex items-center gap-7 text-sm">
          {GITHUB_USER && (
            <a
              href={`https://github.com/${GITHUB_USER}`}
              target="_blank"
              rel="noreferrer noopener"
              className="link-quiet"
            >
              GitHub
            </a>
          )}
          <a href={`mailto:${EMAIL}`} className="link-quiet">
            Contacto
          </a>
        </nav>
      </div>
    </header>
  );
}
