/**
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import GithubIcon from './GithubIcon';
import { GITHUB_USER, EMAIL } from '../data/profile';

export default function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-ink-950/80 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-extrabold text-ink-950">
            AS
          </span>
          <span className="font-display text-sm font-bold tracking-tight text-white">
            Ángel Serrano
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <a
            href={`mailto:${EMAIL}`}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white/50 transition hover:bg-white/5 hover:text-white"
            aria-label="Enviar correo"
          >
            <Mail size={17} />
          </a>
          {GITHUB_USER && (
            <a
              href={`https://github.com/${GITHUB_USER}`}
              target="_blank"
              rel="noreferrer noopener"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-white/50 transition hover:bg-white/5 hover:text-white"
              aria-label="Perfil de GitHub"
            >
              <GithubIcon size={17} />
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}
