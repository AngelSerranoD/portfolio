/**
 * Portada: la pantalla de título del portfolio.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
import { useEffect, useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import ProjectCard from '../components/ProjectCard';
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
  GITHUB_USER,
  SPLASHES,
} from '../data/profile';

/* Relieve de piedra del logo, con contorno negro para leerse sobre cualquier cielo. */
const LOGO_SOMBRA = [
  '0 2px 0 #8a8a8a',
  '0 4px 0 #6a6a6a',
  '0 6px 0 #4a4a4a',
  '0 8px 0 #2a2a2a',
  '2px 0 0 #000',
  '-2px 0 0 #000',
  '0 -2px 0 #000',
  '0 10px 0 #000',
  '0 14px 18px rgba(0,0,0,.6)',
].join(', ');

/** Fila de la cronología de formación y experiencia. */
function TimelineRow({ title, subtitle, period, detail }) {
  return (
    <div className="border-t border-white/15 py-5 first:border-t-0 first:pt-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <p className="text-[15px] font-semibold text-mc-texto">{title}</p>
        <span className="shrink-0 font-mc text-[12px] text-mc-suave">{period}</span>
      </div>
      <p className="mt-1 text-sm text-mc-suave">{subtitle}</p>
      {detail && <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-mc-suave">{detail}</p>}
    </div>
  );
}

/** Panel con etiqueta a la izquierda y contenido a la derecha. */
function Section({ label, children }) {
  return (
    <section className="mc-panel mt-6 grid gap-x-16 gap-y-6 sm:grid-cols-[160px_1fr]">
      <h2 className="label pt-1">{label}</h2>
      <div className="max-w-2xl">{children}</div>
    </section>
  );
}

/** Frase amarilla de la pantalla de título: una al azar en cada visita. */
function Splash() {
  const [texto] = useState(() => SPLASHES[Math.floor(Math.random() * SPLASHES.length)]);
  return (
    <p
      aria-hidden="true"
      className="pointer-events-none absolute -bottom-3 right-0 animate-splash whitespace-nowrap font-mc text-[13px] font-bold text-mc-splash motion-reduce:animate-none sm:-right-10 sm:text-[18px]"
      style={{ textShadow: '2px 2px 0 #3F3F00' }}
    >
      {texto}
    </p>
  );
}

export default function Home() {
  useEffect(() => {
    document.title = `${AUTHOR} · Portfolio`;
  }, []);

  return (
    <div className="min-h-screen">
      <Nav />

      {/* Pantalla de título */}
      <section className="relative flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center overflow-x-clip px-6 py-16 text-center">
        <div className="relative animate-fade-up">
          <h1
            className="font-mc text-[36px] font-bold leading-none text-[#C6C6C6] sm:text-[72px] lg:text-[81px]"
            style={{ textShadow: LOGO_SOMBRA }}
          >
            ÁNGEL SERRANO
          </h1>
          <Splash />
        </div>

        <p className="mc-franja mt-8 px-3 py-1.5 font-mc text-[13px] uppercase text-mc-texto mc-sombra sm:text-[16px]">
          {ROLE}
        </p>

        <div className="mt-12 flex w-full max-w-[400px] animate-fade-up flex-col gap-2">
          <a href="#proyectos" className="mc-boton mc-boton-ancho">
            Proyectos
          </a>
          <a href={CV_FILE} download className="mc-boton mc-boton-ancho">
            Descargar CV
          </a>
          <a href={LINKEDIN} target="_blank" rel="noreferrer noopener" className="mc-boton mc-boton-ancho">
            LinkedIn
          </a>
          <div className="grid grid-cols-2 gap-2">
            <a href={`https://github.com/${GITHUB_USER}`} target="_blank" rel="noreferrer noopener" className="mc-boton">
              GitHub
            </a>
            <a href={`mailto:${EMAIL}`} className="mc-boton">
              Escríbeme
            </a>
          </div>
        </div>
      </section>

      {/* Proyectos */}
      <section id="proyectos" className="container-page scroll-mt-20">
        <div className="mc-franja flex items-baseline justify-center gap-3 border-y-2 border-black py-3">
          <h2 className="font-mc text-[18px] text-mc-texto mc-sombra">Proyectos</h2>
          <span className="font-mc text-[12px] text-mc-suave">{String(projects.length).padStart(2, '0')}</span>
        </div>

        <div className="mt-8 grid grid-flow-row-dense gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </section>

      <div className="container-page mt-16">
        <Section label="Sobre mí">
          {[INTRO, ...ABOUT].map((p) => (
            <p key={p} className="mb-4 text-[15px] leading-[1.8] text-mc-texto last:mb-0">
              {p}
            </p>
          ))}
        </Section>

        <Section label="Experiencia">
          {EXPERIENCE.map((e) => (
            <TimelineRow key={e.role + e.place} title={e.role} subtitle={e.place} period={e.period} detail={e.detail} />
          ))}
        </Section>

        <Section label="Formación">
          {EDUCATION.map((e) => (
            <TimelineRow key={e.title} title={e.title} subtitle={`${e.level} · ${e.place}`} period={e.period} />
          ))}
        </Section>

        <Section label="Idiomas">
          <ul className="flex flex-wrap gap-x-8 gap-y-2 text-[15px] text-mc-texto">
            {LANGUAGES.map((l) => (
              <li key={l.name}>
                {l.name} <span className="text-mc-suave">· {l.level}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section label="Contacto">
          <p className="text-[15px] leading-relaxed text-mc-texto">
            {LOCATION}. Disponible para incorporarme a un equipo donde seguir construyendo producto.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <a href={`mailto:${EMAIL}`} className="mc-boton">
              Escríbeme
            </a>
            <a href={CV_FILE} download className="mc-boton">
              Descargar CV
            </a>
          </div>
        </Section>
      </div>

      <Footer />
    </div>
  );
}
