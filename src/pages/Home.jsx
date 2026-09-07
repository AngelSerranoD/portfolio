/**
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
import { useEffect } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import ProjectCard from '../components/ProjectCard';
import { projects } from '../data/projects';
import { AUTHOR, ROLE, INTRO } from '../data/profile';

export default function Home() {
  useEffect(() => {
    document.title = `${AUTHOR} · Portfolio`;
  }, []);

  const platforms = [...new Set(projects.map((p) => p.platform.split(' · ')[0]))];

  return (
    <div className="min-h-screen">
      <Nav />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="grid-bg absolute inset-0" aria-hidden="true" />
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-[380px] w-[680px] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]"
          aria-hidden="true"
        />

        <div className="container-page relative pb-20 pt-24 sm:pt-32">
          <p className="animate-fade-up text-sm font-medium text-accent">{ROLE}</p>
          <h1 className="mt-4 max-w-3xl animate-fade-up font-display text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl">
            Aplicaciones que
            <br />
            <span className="text-white/40">llegan a producción.</span>
          </h1>
          <p className="mt-7 max-w-xl animate-fade-up text-base leading-relaxed text-white/50">
            {INTRO}
          </p>

          <div className="mt-10 flex animate-fade-up flex-wrap items-center gap-2">
            {platforms.map((p) => (
              <span key={p} className="chip">{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Proyectos */}
      <section className="container-page">
        <div className="flex items-baseline justify-between border-b border-white/5 pb-5">
          <h2 className="font-display text-lg font-bold tracking-tight">Proyectos</h2>
          <span className="text-sm text-white/30">
            {projects.length} {projects.length === 1 ? 'aplicación' : 'aplicaciones'}
          </span>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
