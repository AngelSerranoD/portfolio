/**
 * Página de demo: ejecuta la aplicación dentro de un marco de móvil.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
import { Suspense, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PhoneFrame from '../components/PhoneFrame';
import WindowFrame from '../components/WindowFrame';
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

  /* Las apps de escritorio van en una ventana; el resto, en un móvil. */
  const escritorio = project.demoFrame === 'escritorio';
  const Marco = escritorio ? WindowFrame : PhoneFrame;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b-2 border-black bg-black/70">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Link to={`/proyecto/${project.slug}`} className="mc-boton mc-boton-peque">
            Volver a la ficha
          </Link>

          <div className="hidden items-baseline gap-3 min-[480px]:flex">
            <span className="font-mc text-sm font-bold text-mc-texto mc-sombra">
              {project.name}
            </span>
            <span className="label">Demo</span>
          </div>

          <button onClick={() => setRunId((n) => n + 1)} className="mc-boton mc-boton-peque">
            Reiniciar
          </button>
        </div>
      </header>

      <main
        className={`flex flex-1 flex-col items-center justify-center gap-7 px-4 py-10 ${
          escritorio ? 'mx-auto w-full max-w-[1312px]' : ''
        }`}
      >
        <Marco>
          <Suspense
            fallback={
              <div className="flex h-full items-center justify-center bg-stone">
                <span className="h-6 w-6 animate-spin rounded-full border border-clay border-t-ink" />
              </div>
            }
          >
            <Demo key={runId} />
          </Suspense>
        </Marco>

        {project.demoNote && (
          <p className="mc-franja max-w-md px-4 py-3 text-center text-xs leading-relaxed text-mc-suave">
            {project.demoNote}
          </p>
        )}
      </main>

      <footer className="mc-franja py-3 text-center font-mc text-[12px] text-mc-suave">
        © {new Date().getFullYear()} {AUTHOR}
      </footer>
    </div>
  );
}
