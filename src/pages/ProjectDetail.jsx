/**
 * Ficha de un proyecto.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import TechnicalNote from '../components/TechnicalNote';
import NotFound from './NotFound';
import { getProject, projects } from '../data/projects';
import { hasDemo } from '../demos';
import { AUTHOR } from '../data/profile';

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = getProject(slug);

  useEffect(() => {
    if (project) document.title = `${project.name} · ${AUTHOR}`;
    window.scrollTo(0, 0);
  }, [project]);

  if (!project) return <NotFound />;

  const others = projects.filter((p) => p.slug !== project.slug);

  return (
    <div className="min-h-screen">
      <Nav />

      <article className="container-page pt-12">
        <Link to="/" className="link-quiet text-sm">
          Todos los proyectos
        </Link>

        {/* Cabecera */}
        <header className="mt-12">
          <p className="label">
            {project.platform} · {project.category} · {project.year}
          </p>

          <h1 className="mt-6 font-display text-5xl font-bold tracking-tightest sm:text-6xl">
            {project.name}
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate">
            {project.tagline}
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            {hasDemo(project.slug) && (
              <Link to={`/demo/${project.slug}`} className="btn-primary">
                Abrir demo
              </Link>
            )}
            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer noopener"
                className="btn-ghost"
              >
                Ver código
              </a>
            )}
          </div>
        </header>

        {/* Métricas. La rejilla se adapta a cuántas haya, no siempre son tres. */}
        {project.highlights?.length > 0 && (
        <div
          className="mt-16 grid border-y border-stone"
          style={{ gridTemplateColumns: `repeat(${project.highlights.length}, minmax(0, 1fr))` }}
        >
          {project.highlights.map((h, i) => (
            <div
              key={h.label}
              className={`py-8 pr-3 ${i > 0 ? 'border-l border-stone pl-4 sm:pl-8' : ''}`}
            >
              {/* Valores como "Ninguno" no caben a 3xl en un tercio de 375 px. */}
              <p className="font-display text-xl font-bold leading-tight tracking-tightest sm:text-4xl">
                {h.value}
              </p>
              <p className="label mt-2 break-words">{h.label}</p>
            </div>
          ))}
        </div>
        )}

        {/* Descripción */}
        <section className="mt-20 grid gap-x-16 gap-y-6 sm:grid-cols-[160px_1fr]">
          <h2 className="label pt-1">Sobre el proyecto</h2>
          <p className="max-w-2xl text-[15px] leading-[1.8] text-ink">
            {project.description}
          </p>
        </section>

        {/* Características */}
        {project.features?.length > 0 && (
        <section className="mt-20 grid gap-x-16 gap-y-6 sm:grid-cols-[160px_1fr]">
          <h2 className="label pt-1">Características</h2>
          <ul className="max-w-2xl">
            {project.features.map((f) => (
              <li
                key={f}
                className="border-b border-stone py-3.5 text-[15px] leading-relaxed text-ink first:pt-0 last:border-b-0"
              >
                {f}
              </li>
            ))}
          </ul>
        </section>
        )}

        {/* Notas técnicas */}
        {project.technical?.length > 0 && (
          <section className="mt-20 grid gap-x-16 gap-y-8 sm:grid-cols-[160px_1fr]">
            <div>
              <h2 className="label pt-1">Notas técnicas</h2>
              <p className="mt-3 max-w-[160px] text-xs leading-relaxed text-clay">
                Decisiones de arquitectura y por qué se tomaron.
              </p>
            </div>
            <div className="max-w-2xl">
              {project.technical.map((note, i) => (
                <TechnicalNote key={note.title} note={note} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* Tecnologías */}
        {project.stack?.length > 0 && (
        <section className="mt-20 grid gap-x-16 gap-y-6 sm:grid-cols-[160px_1fr]">
          <h2 className="label pt-1">Tecnologías</h2>
          <ul className="flex max-w-2xl flex-wrap gap-x-6 gap-y-2 text-[15px] text-ink">
            {project.stack.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </section>
        )}

        {/* Nota sobre la demo */}
        {project.demoNote && (
          <section className="mt-20 grid gap-x-16 gap-y-6 sm:grid-cols-[160px_1fr]">
            <h2 className="label pt-1">Sobre la demo</h2>
            <p className="max-w-2xl text-[15px] leading-relaxed text-slate">
              {project.demoNote}
            </p>
          </section>
        )}

        {/* Otros proyectos */}
        <section className="mt-24">
          <h2 className="label">Otros proyectos</h2>
          <div className="mt-6 border-b border-stone">
            {others.map((p) => (
              <Link
                key={p.slug}
                to={`/proyecto/${p.slug}`}
                className="group flex items-baseline justify-between gap-6 border-t border-stone py-5 transition-colors duration-500 hover:border-clay"
              >
                <span className="font-display text-lg font-bold tracking-tight text-ink transition-colors duration-500 group-hover:text-ink">
                  {p.name}
                </span>
                <span className="shrink-0 text-xs text-clay">{p.platform}</span>
              </Link>
            ))}
          </div>
        </section>
      </article>

      <Footer />
    </div>
  );
}
