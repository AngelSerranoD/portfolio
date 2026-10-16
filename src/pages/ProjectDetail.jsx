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

      <article className="container-page pt-10">
        <Link to="/" className="mc-boton mc-boton-peque">
          Todos los proyectos
        </Link>

        {/* Cabecera */}
        <header className="mc-panel mt-6">
          <p className="label">
            {project.platform} · {project.category} · {project.year}
          </p>
          <h1 className="mt-5 font-mc text-[27px] font-bold leading-tight text-mc-texto mc-sombra sm:text-[45px]">
            {project.name}
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-mc-suave">{project.tagline}</p>

          <div className="mt-8 flex flex-wrap gap-2">
            {hasDemo(project.slug) && (
              <Link to={`/demo/${project.slug}`} className="mc-boton">
                Abrir demo
              </Link>
            )}
            {project.url && (
              <a href={project.url} target="_blank" rel="noreferrer noopener" className="mc-boton">
                Abrir la app
              </a>
            )}
            {/* Apps nativas: enlaces directos a los instalables (APK, .exe…). */}
            {project.downloads?.map(({ label, href }) => (
              <a key={href} href={href} className="mc-boton" rel="noreferrer noopener">
                {label}
              </a>
            ))}
            {project.repo && (
              <a href={project.repo} target="_blank" rel="noreferrer noopener" className="mc-boton">
                Ver código
              </a>
            )}
          </div>
        </header>

        {/* Métricas, como casillas de inventario. La rejilla se adapta a cuántas haya. */}
        {project.highlights?.length > 0 && (
          <div
            className="mt-6 grid gap-2"
            style={{ gridTemplateColumns: `repeat(${project.highlights.length}, minmax(0, 1fr))` }}
          >
            {project.highlights.map((h) => (
              <div key={h.label} className="mc-ranura px-3 py-5 sm:px-6 sm:py-7">
                <p className="font-mc text-[18px] font-bold leading-tight mc-sombra sm:text-[27px]">{h.value}</p>
                <p className="label mt-2 break-words">{h.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Descripción */}
        <section className="mc-panel mt-6 grid gap-x-16 gap-y-6 sm:grid-cols-[160px_1fr]">
          <h2 className="label pt-1">Sobre el proyecto</h2>
          <p className="max-w-2xl text-[15px] leading-[1.8] text-mc-texto">{project.description}</p>
        </section>

        {/* Características */}
        {project.features?.length > 0 && (
          <section className="mc-panel mt-6 grid gap-x-16 gap-y-6 sm:grid-cols-[160px_1fr]">
            <h2 className="label pt-1">Características</h2>
            <ul className="max-w-2xl">
              {project.features.map((f) => (
                <li
                  key={f}
                  className="border-b border-white/15 py-3.5 text-[15px] leading-relaxed text-mc-texto first:pt-0 last:border-b-0"
                >
                  {f}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Notas técnicas */}
        {project.technical?.length > 0 && (
          <section className="mc-panel mt-6 grid gap-x-16 gap-y-8 sm:grid-cols-[160px_1fr]">
            <div>
              <h2 className="label pt-1">Notas técnicas</h2>
              <p className="mt-3 max-w-[160px] text-xs leading-relaxed text-mc-suave">
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

        {/* Tecnologías, como casillas */}
        {project.stack?.length > 0 && (
          <section className="mc-panel mt-6 grid gap-x-16 gap-y-6 sm:grid-cols-[160px_1fr]">
            <h2 className="label pt-1">Tecnologías</h2>
            <ul className="flex max-w-2xl flex-wrap gap-2">
              {project.stack.map((t) => (
                <li key={t} className="mc-ranura px-2.5 py-1 font-mc text-[12px] mc-sombra">
                  {t}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Nota sobre la demo */}
        {project.demoNote && (
          <section className="mc-panel mt-6 grid gap-x-16 gap-y-6 sm:grid-cols-[160px_1fr]">
            <h2 className="label pt-1">Sobre la demo</h2>
            <p className="max-w-2xl text-[15px] leading-relaxed text-mc-suave">{project.demoNote}</p>
          </section>
        )}

        {/* Otros proyectos, como filas de la lista de mundos */}
        <section className="mc-panel mt-6">
          <h2 className="label">Otros proyectos</h2>
          <div className="mt-4 flex flex-col gap-1">
            {others.map((p) => (
              <Link
                key={p.slug}
                to={`/proyecto/${p.slug}`}
               
                className="group flex items-baseline justify-between gap-6 border-2 border-transparent px-3 py-3 outline-none hover:border-white focus-visible:border-white"
              >
                <span className="font-mc text-[16px] font-bold text-mc-texto mc-sombra group-hover:text-mc-hover">
                  {p.name}
                </span>
                <span className="shrink-0 text-xs text-mc-suave">{p.platform}</span>
              </Link>
            ))}
          </div>
        </section>
      </article>

      <Footer />
    </div>
  );
}
