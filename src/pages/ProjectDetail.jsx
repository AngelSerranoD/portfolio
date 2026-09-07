/**
 * Ficha de un proyecto.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Check, ExternalLink, Info } from 'lucide-react';
import GithubIcon from '../components/GithubIcon';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import NotFound from './NotFound';
import { getProject, projects } from '../data/projects';
import { AUTHOR } from '../data/profile';

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = getProject(slug);

  useEffect(() => {
    if (project) document.title = `${project.name} · ${AUTHOR}`;
    window.scrollTo(0, 0);
  }, [project]);

  if (!project) return <NotFound />;

  const others = projects.filter((p) => p.slug !== project.slug).slice(0, 3);

  return (
    <div className="min-h-screen">
      <Nav />

      <article className="container-page pt-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-white/40 transition hover:text-white"
        >
          <ArrowLeft size={15} /> Todos los proyectos
        </Link>

        {/* Cabecera */}
        <header className="relative mt-8 overflow-hidden rounded-xl2 border border-white/10 bg-ink-900 p-8 sm:p-12">
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-20 blur-[90px]"
            style={{ backgroundColor: project.accent }}
            aria-hidden="true"
          />

          <div className="relative flex flex-wrap items-center gap-3">
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold"
              style={{ backgroundColor: `${project.accent}26`, color: project.accent }}
            >
              {project.platform}
            </span>
            <span className="chip">{project.category}</span>
            <span className="chip">{project.year}</span>
          </div>

          <div className="relative mt-6 flex items-center gap-4">
            <span
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-3xl"
              style={{ backgroundColor: `${project.accent}1F` }}
            >
              {project.emoji}
            </span>
            <div>
              <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
                {project.name}
              </h1>
              <p className="mt-1.5 text-white/45">{project.tagline}</p>
            </div>
          </div>

          <div className="relative mt-8 flex flex-wrap gap-3">
            {project.demo && (
              <a
                href={`/demo/${project.slug}`}
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
              >
                Abrir demo <ExternalLink size={15} />
              </a>
            )}
            {project.repo ? (
              <a href={project.repo} target="_blank" rel="noreferrer noopener" className="btn-ghost">
                <GithubIcon size={15} /> Ver código
              </a>
            ) : (
              <span className="btn-ghost cursor-default opacity-40">
                <GithubIcon size={15} /> Código privado
              </span>
            )}
          </div>
        </header>

        {/* Métricas */}
        <div className="mt-5 grid grid-cols-3 gap-4">
          {project.highlights.map((h) => (
            <div key={h.label} className="surface p-5 text-center sm:p-6">
              <p className="font-display text-2xl font-extrabold sm:text-3xl" style={{ color: project.accent }}>
                {h.value}
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-wider text-white/35 sm:text-xs">
                {h.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
          {/* Descripción y características */}
          <div className="space-y-5">
            <section className="surface p-8">
              <h2 className="font-display text-lg font-bold">Sobre el proyecto</h2>
              <p className="mt-4 leading-relaxed text-white/55">{project.description}</p>
            </section>

            <section className="surface p-8">
              <h2 className="font-display text-lg font-bold">Características</h2>
              <ul className="mt-5 space-y-3.5">
                {project.features.map((f) => (
                  <li key={f} className="flex gap-3 text-sm leading-relaxed text-white/60">
                    <Check size={16} className="mt-0.5 shrink-0" style={{ color: project.accent }} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Lateral */}
          <aside className="space-y-5">
            <section className="surface p-8">
              <h2 className="font-display text-lg font-bold">Tecnologías</h2>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.stack.map((t) => (
                  <span key={t} className="chip">{t}</span>
                ))}
              </div>
            </section>

            {project.demoNote && (
              <section className="rounded-card border border-white/10 bg-white/[0.03] p-6">
                <div className="flex gap-3">
                  <Info size={16} className="mt-0.5 shrink-0 text-white/40" />
                  <p className="text-sm leading-relaxed text-white/45">{project.demoNote}</p>
                </div>
              </section>
            )}
          </aside>
        </div>

        {/* Otros proyectos */}
        <section className="mt-16">
          <h2 className="border-b border-white/5 pb-5 font-display text-lg font-bold">
            Otros proyectos
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {others.map((p) => (
              <Link
                key={p.slug}
                to={`/proyecto/${p.slug}`}
                className="group flex items-center gap-3 rounded-card border border-white/10 bg-ink-900 p-5 transition hover:border-white/20 hover:bg-ink-850"
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg"
                  style={{ backgroundColor: `${p.accent}1F` }}
                >
                  {p.emoji}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold">{p.name}</p>
                  <p className="truncate text-xs text-white/35">{p.category}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </article>

      <Footer />
    </div>
  );
}
