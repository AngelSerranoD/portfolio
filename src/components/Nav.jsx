/**
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
import { Link } from 'react-router-dom';
import { GITHUB_USER, LINKEDIN, CV_FILE } from '../data/profile';

export default function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-black bg-black/70">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link
          to="/"
         
          className="font-mc text-[14px] font-bold text-mc-texto transition-colors duration-150 mc-sombra hover:text-mc-hover"
        >
          Ángel Serrano
        </Link>

        <nav className="flex items-center gap-4 font-mc text-[13px] sm:gap-6">
          {GITHUB_USER && (
            <a
              href={`https://github.com/${GITHUB_USER}`}
              target="_blank"
              rel="noreferrer noopener"
             
              className="link-quiet mc-sombra"
            >
              GitHub
            </a>
          )}
          <a href={LINKEDIN} target="_blank" rel="noreferrer noopener" className="link-quiet mc-sombra">
            LinkedIn
          </a>
          <a href={CV_FILE} download className="link-quiet mc-sombra hidden sm:inline">
            CV
          </a>
        </nav>
      </div>
    </header>
  );
}
