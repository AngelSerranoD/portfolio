/**
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
import { AUTHOR, EMAIL, LINKEDIN, GITHUB_USER } from '../data/profile';

export default function Footer() {
  return (
    <footer className="mt-32 border-t border-mono-800 py-10">
      <div className="container-page flex flex-col items-start justify-between gap-3 text-xs text-mono-500 sm:flex-row sm:items-center">
        <p>
          © {new Date().getFullYear()} {AUTHOR}. Todos los derechos reservados.
        </p>
        <div className="flex flex-wrap items-center gap-5">
          <a href={`mailto:${EMAIL}`} className="link-quiet">
            {EMAIL}
          </a>
          <a href={LINKEDIN} target="_blank" rel="noreferrer noopener" className="link-quiet">
            LinkedIn
          </a>
          <a
            href={`https://github.com/${GITHUB_USER}`}
            target="_blank"
            rel="noreferrer noopener"
            className="link-quiet"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
