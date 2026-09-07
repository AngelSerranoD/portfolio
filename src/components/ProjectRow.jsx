/**
 * Fila del índice de proyectos. Sin tarjeta: solo tipografía y una regla.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
import { Link } from 'react-router-dom';

export default function ProjectRow({ project, index }) {
  return (
    <Link
      to={`/proyecto/${project.slug}`}
      className="group block animate-fade-up border-t border-mono-800 py-9 transition-colors duration-500 hover:border-mono-500"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <div className="flex items-baseline gap-5 sm:gap-8">
        <span className="w-6 shrink-0 font-display text-xs text-mono-500">
          {String(index + 1).padStart(2, '0')}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h3 className="font-display text-2xl font-bold tracking-tightest text-mono-200 transition-colors duration-500 group-hover:text-mono-50 sm:text-3xl">
              {project.name}
            </h3>
            <span className="text-xs text-mono-500">{project.platform}</span>
          </div>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-mono-400">
            {project.tagline}
          </p>
        </div>

        <span className="hidden shrink-0 text-xs text-mono-500 transition-colors duration-500 group-hover:text-mono-200 sm:block">
          Ver proyecto
        </span>
      </div>
    </Link>
  );
}
