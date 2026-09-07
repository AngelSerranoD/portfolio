/**
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export default function ProjectCard({ project, index = 0 }) {
  return (
    <Link
      to={`/proyecto/${project.slug}`}
      className="group relative flex animate-fade-up flex-col overflow-hidden rounded-card border border-white/10 bg-ink-900 p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-ink-850"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Halo con el color de la app */}
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-[0.12] blur-3xl transition-opacity duration-500 group-hover:opacity-25"
        style={{ backgroundColor: project.accent }}
      />

      <div className="relative flex items-start justify-between">
        <span
          className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl"
          style={{ backgroundColor: `${project.accent}1F` }}
        >
          {project.emoji}
        </span>
        <ArrowUpRight
          size={18}
          className="text-white/25 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
        />
      </div>

      <h3 className="relative mt-5 font-display text-xl font-bold tracking-tight text-white">
        {project.name}
      </h3>
      <p className="relative mt-2 flex-1 text-sm leading-relaxed text-white/50">
        {project.tagline}
      </p>

      <div className="relative mt-5 flex flex-wrap items-center gap-2">
        <span
          className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
          style={{ backgroundColor: `${project.accent}1F`, color: project.accent }}
        >
          {project.platform}
        </span>
        <span className="text-[11px] text-white/30">{project.year}</span>
      </div>
    </Link>
  );
}
