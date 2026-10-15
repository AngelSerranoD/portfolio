/**
 * Tarjeta del grid de proyectos.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 *
 * La portada es un mosaico de píxeles (pixeles.js). Al pasar el ratón se
 * caen de derecha a izquierda, como una página que se pasa, y debajo queda la
 * demo real funcionando en miniatura, con un «Abrir demo» que aparece poco a
 * poco. Al salir, los píxeles vuelven a su sitio y la demo se desmonta.
 * Pinchar lleva a la demo; la ficha técnica tiene su propio enlace debajo.
 *
 * En pantallas táctiles no hay hover: la portada se queda entera y un toque
 * abre la demo directamente.
 */
import { startTransition, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { crearPortada } from './portadaPixeles';
import MiniDemo from './MiniDemo';

/* Colores de tailwind.config.js, que el canvas no puede leer de las clases. */
const INK = [59, 56, 52];
const PAPER = [234, 230, 221];
const STONE = '#C7C2B9';
const CLAY = '#8F8C84';
const FUENTE = 'Ranade, system-ui, sans-serif';

/** Tiempo que se deja montada la demo tras salir, lo que tardan en volver los píxeles. */
const APAGADO_MS = 1500;

/**
 * Montar una demo es lo caro (es la app entera), así que solo se monta si el
 * puntero se queda este rato encima: al cruzar el grid de pasada, los
 * píxeles caen pero no se monta nada.
 */
const INTENCION_MS = 160;

/** Cómo apagar la demo que esté montada: nunca hay más de una a la vez. */
let apagarLaMontada = null;

/** Parte `texto` en líneas que quepan en `ancho` con la fuente actual del ctx. */
function partir(ctx, texto, ancho) {
  const lineas = [];
  let actual = '';
  for (const palabra of texto.split(' ')) {
    const prueba = actual ? `${actual} ${palabra}` : palabra;
    if (actual && ctx.measureText(prueba).width > ancho) {
      lineas.push(actual);
      actual = palabra;
    } else {
      actual = prueba;
    }
  }
  if (actual) lineas.push(actual);
  return lineas;
}

function pintarPortada(ctx, { dpr, ancho, alto }, project, index) {
  /* Fondo liso: los píxeles solo se notan cuando empiezan a caer. */
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = `rgb(${INK.join(',')})`;
  ctx.fillRect(0, 0, ancho, alto);
  const margen = 22;
  const espaciado = (px) => {
    if ('letterSpacing' in ctx) ctx.letterSpacing = `${px}px`;
  };

  /* Número, arriba a la izquierda. */
  ctx.textBaseline = 'top';
  ctx.font = `500 12px ${FUENTE}`;
  espaciado(1.5);
  ctx.fillStyle = CLAY;
  ctx.fillText(String(index + 1).padStart(2, '0'), margen, margen);

  /* Plataforma, abajo del todo. */
  ctx.textBaseline = 'alphabetic';
  espaciado(0);
  ctx.fillStyle = STONE;
  ctx.fillText(project.platform, margen, alto - margen, ancho - margen * 2);

  /* Nombre, encima de la plataforma y de abajo arriba. */
  const cuerpo = ancho > 480 ? 44 : 32;
  ctx.font = `700 ${cuerpo}px ${FUENTE}`;
  espaciado(-0.04 * cuerpo);
  ctx.fillStyle = `rgb(${PAPER.join(',')})`;
  const lineas = partir(ctx, project.name, ancho - margen * 2);
  let base = alto - margen - 26;
  for (let i = lineas.length - 1; i >= 0; i--) {
    ctx.fillText(lineas[i], margen, base, ancho - margen * 2);
    base -= cuerpo * 1.02;
  }
  espaciado(0);
}

export default function ProjectCard({ project, index }) {
  const escritorio = project.demoFrame === 'escritorio';
  const lienzo = useRef(null);
  const capa = useRef(null);
  const apagado = useRef(0);
  const encendido = useRef(0);
  /* `encendida`: la demo está montada. `abierta`: el puntero está encima. */
  const [encendida, setEncendida] = useState(false);
  const [abierta, setAbierta] = useState(false);

  useLayoutEffect(() => {
    const canvas = lienzo.current;
    const nueva = crearPortada(canvas, (ctx, medidas) =>
      pintarPortada(ctx, medidas, project, index)
    );
    capa.current = nueva;

    const ro = new ResizeObserver(([entrada]) => {
      const { width, height } = entrada.contentRect;
      if (width && height) nueva.redimensionar(width, height);
    });
    ro.observe(canvas);

    /* Ranade llega de Fontshare: si aún no estaba, se repinta al llegar. */
    let viva = true;
    document.fonts
      ?.load(`700 32px ${FUENTE}`)
      .then(() => document.fonts.load(`500 12px ${FUENTE}`))
      .then(() => viva && nueva.repintar())
      .catch(() => {});

    return () => {
      viva = false;
      ro.disconnect();
      nueva.destruir();
    };
  }, [project, index]);

  /* Estable entre renders: es la identidad con la que se guarda en `apagarLaMontada`. */
  const [apagar] = useState(() => () => {
    clearTimeout(apagado.current);
    setEncendida(false);
  });

  useEffect(
    () => () => {
      clearTimeout(apagado.current);
      clearTimeout(encendido.current);
      if (apagarLaMontada === apagar) apagarLaMontada = null;
    },
    [apagar]
  );

  const entrar = () => {
    clearTimeout(apagado.current);
    clearTimeout(encendido.current);
    setAbierta(true);
    capa.current?.desmoronar();
    encendido.current = setTimeout(() => {
      if (apagarLaMontada && apagarLaMontada !== apagar) apagarLaMontada();
      apagarLaMontada = apagar;
      /* En transición: React puede trocear el montaje y no frena los píxeles. */
      startTransition(() => setEncendida(true));
    }, INTENCION_MS);
  };

  const salir = () => {
    clearTimeout(encendido.current);
    setAbierta(false);
    capa.current?.recomponer();
    clearTimeout(apagado.current);
    apagado.current = setTimeout(() => {
      apagar();
      if (apagarLaMontada === apagar) apagarLaMontada = null;
    }, APAGADO_MS);
  };

  const conRaton = (e) => e.pointerType !== 'touch';

  return (
    <article
      className={`animate-fade-up ${escritorio ? 'sm:col-span-2' : ''}`}
      style={{ animationDelay: `${Math.min(index, 8) * 70}ms` }}
    >
      <h3 className="sr-only">{project.name}</h3>

      {/* La demo va fuera del enlace: trae sus propios enlaces y botones, y
          un <a> no puede ir dentro de otro. El enlace la tapa entera. */}
      <div className="relative h-[400px] overflow-hidden bg-stone ring-ink ring-offset-4 ring-offset-paper has-[:focus-visible]:ring-2">
        {encendida && <MiniDemo slug={project.slug} escritorio={escritorio} />}

        <Link
          to={`/demo/${project.slug}`}
          aria-label={`Abrir la demo de ${project.name}`}
          className="absolute inset-0 block outline-none"
          onPointerEnter={(e) => conRaton(e) && entrar()}
          onPointerLeave={(e) => conRaton(e) && salir()}
          onFocus={(e) => e.currentTarget.matches(':focus-visible') && entrar()}
          onBlur={salir}
        >
          <canvas ref={lienzo} aria-hidden="true" className="absolute inset-0 h-full w-full" />

          {/* Aparece cuando la página ya va por la mitad; al salir, se va sin esperar. */}
          <span
            className={`pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-ink/90 px-5 py-2.5 text-xs font-medium text-paper shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] transition-[opacity,transform,filter] ${
              abierta
                ? 'translate-y-0 opacity-100 blur-0 delay-700 duration-700 ease-out'
                : 'translate-y-3 opacity-0 blur-[2px] delay-0 duration-300 ease-in'
            }`}
          >
            Abrir demo
          </span>
        </Link>
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-6">
        <p className="text-sm leading-relaxed text-slate">{project.tagline}</p>
        <Link to={`/proyecto/${project.slug}`} className="link-quiet shrink-0 text-xs">
          Ficha técnica
        </Link>
      </div>
    </article>
  );
}
