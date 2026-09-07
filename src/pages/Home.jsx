/**
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
import { useEffect } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import ProjectRow from '../components/ProjectRow';
import { projects } from '../data/projects';
import { AUTHOR, ROLE, INTRO } from '../data/profile';

export default function Home() {
  useEffect(() => {
    document.title = `${AUTHOR} · Portfolio`;
  }, []);

  return (
    <div className="min-h-screen">
      <Nav />

      <section className="container-page pb-24 pt-24 sm:pt-36">
        <p className="label animate-fade-up">{ROLE}</p>

        <h1 className="mt-7 max-w-3xl animate-fade-up font-display text-5xl font-extrabold leading-[1.04] tracking-tightest sm:text-7xl">
          Aplicaciones que
          <br />
          <span className="text-mono-500">llegan a producción.</span>
        </h1>

        <p className="mt-9 max-w-lg animate-fade-up text-base leading-relaxed text-mono-400">
          {INTRO}
        </p>
      </section>

      <section className="container-page">
        <div className="flex items-baseline justify-between">
          <h2 className="label">Proyectos</h2>
          <span className="text-xs text-mono-500">
            {String(projects.length).padStart(2, '0')}
          </span>
        </div>

        <div className="mt-8 border-b border-mono-800">
          {projects.map((project, i) => (
            <ProjectRow key={project.slug} project={project} index={i} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
