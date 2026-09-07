/**
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
import { AUTHOR, EMAIL } from '../data/profile';

export default function Footer() {
  return (
    <footer className="mt-32 border-t border-white/5 py-10">
      <div className="container-page flex flex-col items-center justify-between gap-3 text-xs text-white/35 sm:flex-row">
        <p>© {new Date().getFullYear()} {AUTHOR}. Todos los derechos reservados.</p>
        <a href={`mailto:${EMAIL}`} className="transition hover:text-white/70">
          {EMAIL}
        </a>
      </div>
    </footer>
  );
}
