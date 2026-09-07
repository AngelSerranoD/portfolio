/**
 * Página de demo: ejecuta la aplicación dentro de un marco de móvil.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
import { Suspense, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PhoneFrame from '../components/PhoneFrame';
import NotFound from './NotFound';
import { getProject } from '../data/projects';
import { getDemo } from '../demos';
import { AUTHOR } from '../data/profile';

export default function DemoPage() {
  const { slug } = useParams();
  /* Cambiar esta clave remonta la demo desde cero, sin recargar el portfolio. */
  const [runId, setRunId] = useState(0);
  const project = getProject(slug);
  const Demo = getDemo(slug);

  useEffect(() => {
    if (project) document.title = `Demo · ${project.name}`;
    window.scrollTo(0, 0);
  }, [project]);

  if (!project || !Demo) return <NotFound />;

  return (
    <div className="flex min-h-screen flex-col bg-mono-950">
      <header className="border-b border-mono-800">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Link to={`/proyecto/${project.slug}`} className="link-quiet text-sm">
            Volver a la ficha
          </Link>

          <div className="flex items-baseline gap-3">
            <span className="font-display text-sm font-bold text-mono-50">
              {project.name}
            </span>
            <span className="label">Demo</span>
          </div>

          <button onClick={() => setRunId((n) => n + 1)} className="link-quiet text-sm">
            Reiniciar
          </button>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-7 px-4 py-10">
        <PhoneFrame>
          <Suspense
            fallback={
              <div className="flex h-full items-center justify-center bg-mono-900">
                <span className="h-6 w-6 animate-spin rounded-full border border-mono-600 border-t-mono-50" />
              </div>
            }
          >
            <Demo key={runId} />
          </Suspense>
        </PhoneFrame>

        {project.demoNote && (
          <p className="max-w-md text-center text-xs leading-relaxed text-mono-500">
            {project.demoNote}
          </p>
        )}
      </main>

      <footer className="pb-6 text-center text-[11px] text-mono-600">
        © {new Date().getFullYear()} {AUTHOR}
      </footer>
    </div>
  );
}
