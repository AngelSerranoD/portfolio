/**
 * La demo real de un proyecto, en miniatura y sin poder tocarla.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 *
 * Se monta al tamaño de su marco (el ancho de la pantalla del móvil o de la
 * ventana de escritorio) con el alto que haga falta para llenar la caja, y se
 * reduce con `transform: scale`. El transform hace además de contenedor de
 * los `position: fixed` de la app, que así no se escapan a la página.
 */
import { Component, Suspense, useLayoutEffect, useRef, useState } from 'react';
import { getDemo } from '../demos';

const ANCHO_MOVIL = 344; // el de la pantalla de PhoneFrame
const ANCHO_ESCRITORIO = 1280; // el de WindowFrame

/** Si una demo falla en miniatura, la portada no se rompe: queda el fondo. */
class SinFallos extends Component {
  state = { fallo: false };

  static getDerivedStateFromError() {
    return { fallo: true };
  }

  render() {
    return this.state.fallo ? null : this.props.children;
  }
}

export default function MiniDemo({ slug, escritorio = false }) {
  const caja = useRef(null);
  const [tam, setTam] = useState(null);
  const Demo = getDemo(slug);

  useLayoutEffect(() => {
    const el = caja.current;
    if (!el) return undefined;
    const medir = () => setTam({ w: el.clientWidth, h: el.clientHeight });
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const anchoNativo = escritorio ? ANCHO_ESCRITORIO : ANCHO_MOVIL;
  const escala = tam ? tam.w / anchoNativo : 1;

  return (
    <div
      ref={caja}
      inert
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden bg-stone"
    >
      {Demo && tam?.w > 0 && (
        <div
          className="relative overflow-hidden bg-black text-ink"
          style={{
            width: anchoNativo,
            height: tam.h / escala,
            transform: `scale(${escala})`,
            transformOrigin: 'top left',
          }}
        >
          <SinFallos>
            <Suspense
              fallback={
                <div className="flex h-full items-center justify-center bg-stone">
                  <span className="h-6 w-6 animate-spin rounded-full border border-clay border-t-ink" />
                </div>
              }
            >
              <Demo />
            </Suspense>
          </SinFallos>
        </div>
      )}
    </div>
  );
}
