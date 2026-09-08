/**
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
import { useEffect } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import ProjectRow from '../components/ProjectRow';
import { projects } from '../data/projects';
import {
  AUTHOR,
  ROLE,
  INTRO,
  ABOUT,
  LOCATION,
  EDUCATION,
  EXPERIENCE,
  LANGUAGES,
  LINKEDIN,
  CV_FILE,
  EMAIL,
} from '../data/profile';

/** Fila de la cronología de formación y experiencia. */
function TimelineRow({ title, subtitle, period, detail }) {
  return (
    <div className="border-t border-stone py-5 first:border-t-0 first:pt-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <p className="text-[15px] font-semibold text-ink">{title}</p>
        <span className="shrink-0 text-xs text-clay">{period}</span>
      </div>
      <p className="mt-1 text-sm text-slate">{subtitle}</p>
      {detail && (
        <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-slate">{detail}</p>
      )}
    </div>
  );
}

/** Bloque con etiqueta a la izquierda y contenido a la derecha. */
function Section({ label, children, className = '' }) {
  return (
    <section className={`mt-20 grid gap-x-16 gap-y-6 sm:grid-cols-[160px_1fr] ${className}`}>
      <h2 className="label pt-1">{label}</h2>
      <div className="max-w-2xl">{children}</div>
    </section>
  );
}

export default function Home() {
  useEffect(() => {
    document.title = `${AUTHOR} · Portfolio`;
  }, []);

  return (
    <div className="min-h-screen">
      <Nav />

      {/* Presentación */}
      <section className="container-page pb-24 pt-24 sm:pt-36">
        <p className="label animate-fade-up">{ROLE}</p>

        <h1 className="mt-7 max-w-3xl animate-fade-up font-display text-5xl font-bold leading-[1.04] tracking-tightest sm:text-7xl">
          Aplicaciones que
          <br />
          <span className="text-clay">llegan a producción.</span>
        </h1>

        <p className="mt-9 max-w-lg animate-fade-up text-base leading-relaxed text-slate">
          {INTRO}
        </p>

        <div className="mt-10 flex animate-fade-up flex-wrap gap-3">
          <a href={CV_FILE} download className="btn-primary">
            Descargar CV
          </a>
          <a href={LINKEDIN} target="_blank" rel="noreferrer noopener" className="btn-ghost">
            LinkedIn
          </a>
        </div>
      </section>

      {/* Proyectos */}
      <section className="container-page">
        <div className="flex items-baseline justify-between">
          <h2 className="label">Proyectos</h2>
          <span className="text-xs text-clay">
            {String(projects.length).padStart(2, '0')}
          </span>
        </div>

        <div className="mt-8 border-b border-stone">
          {projects.map((project, i) => (
            <ProjectRow key={project.slug} project={project} index={i} />
          ))}
        </div>
      </section>

      {/* Sobre mí */}
      <div className="container-page">
        <Section label="Sobre mí">
          {ABOUT.map((p) => (
            <p key={p} className="mb-4 text-[15px] leading-[1.8] text-ink last:mb-0">
              {p}
            </p>
          ))}
        </Section>

        <Section label="Experiencia">
          {EXPERIENCE.map((e) => (
            <TimelineRow
              key={e.role + e.place}
              title={e.role}
              subtitle={e.place}
              period={e.period}
              detail={e.detail}
            />
          ))}
        </Section>

        <Section label="Formación">
          {EDUCATION.map((e) => (
            <TimelineRow
              key={e.title}
              title={e.title}
              subtitle={`${e.level} · ${e.place}`}
              period={e.period}
            />
          ))}
        </Section>

        <Section label="Idiomas">
          <ul className="flex flex-wrap gap-x-8 gap-y-2 text-[15px] text-ink">
            {LANGUAGES.map((l) => (
              <li key={l.name}>
                {l.name} <span className="text-clay">· {l.level}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Contacto */}
        <Section label="Contacto">
          <p className="text-[15px] leading-relaxed text-ink">
            {LOCATION}. Disponible para incorporarme a un equipo donde seguir
            construyendo producto.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={`mailto:${EMAIL}`} className="btn-primary">
              Escríbeme
            </a>
            <a href={CV_FILE} download className="btn-ghost">
              Descargar CV
            </a>
          </div>
        </Section>
      </div>

      <Footer />
    </div>
  );
}
