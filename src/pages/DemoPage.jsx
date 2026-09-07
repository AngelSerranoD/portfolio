/**
 * Página de demo: ejecuta la aplicación dentro de un marco de móvil.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
import { Suspense, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import PhoneFrame from '../components/PhoneFrame';
import NotFound from './NotFound';
import { getProject } from '../data/projects';
import { getDemo } from '../demos';
import { AUTHOR } from '../data/profile';

export default function DemoPage() {
  const { slug } = useParams();
  const project = getProject(slug);
  const Demo = getDemo(slug);

  useEffect(() => {
    if (project) document.title = `Demo · ${project.name}`;
  }, [project]);

  if (!project || !Demo) return <NotFound />;

  return (
    <div className="flex min-h-screen flex-col bg-ink-950">
      {/* Fondo con el color de la app */}
      <div
        className="pointer-events-none fixed left-1/2 top-0 h-[520px] w-[760px] -translate-x-1/2 rounded-full opacity-[0.10] blur-[130px]"
        style={{ backgroundColor: project.accent }}
        aria-hidden="true"
      />

      <header className="relative z-10 border-b border-white/5">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Link
            to={`/proyecto/${project.slug}`}
            className="inline-flex items-center gap-2 text-sm text-white/45 transition hover:text-white"
          >
            <ArrowLeft size={15} />
            <span className="hidden sm:inline">Volver a la ficha</span>
            <span className="sm:hidden">Volver</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <span className="text-lg">{project.emoji}</span>
            <span className="font-display text-sm font-bold">{project.name}</span>
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
              style={{ backgroundColor: `${project.accent}26`, color: project.accent }}
            >
              Demo
            </span>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-1.5 text-sm text-white/45 transition hover:text-white"
          >
            <RotateCcw size={14} />
            <span className="hidden sm:inline">Reiniciar</span>
          </button>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center gap-6 px-4 py-10">
        <PhoneFrame>
          <Suspense
            fallback={
              <div className="flex h-full items-center justify-center bg-ink-900">
                <span
                  className="h-7 w-7 animate-spin rounded-full border-2 border-white/15 border-t-transparent"
                  style={{ borderTopColor: project.accent }}
                />
              </div>
            }
          >
            <Demo />
          </Suspense>
        </PhoneFrame>

        {project.demoNote && (
          <p className="max-w-md text-center text-xs leading-relaxed text-white/30">
            {project.demoNote}
          </p>
        )}
      </main>

      <footer className="relative z-10 pb-6 text-center text-[11px] text-white/20">
        © {new Date().getFullYear()} {AUTHOR}
      </footer>
    </div>
  );
}
