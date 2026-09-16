/**
 * DailyWeigh — cabecera: saludo y media de la semana visible.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
import { capitalizar, fechaLarga, rangoSemana, sumarDias } from '../lib/fechas.js';
import { diferenciaDeMedias, formatoPeso } from '../lib/pesos.js';
import GraficaSemana from './GraficaSemana.jsx';
import { Derecha, Izquierda } from './Iconos.jsx';

function BotonSemana({ etiqueta, children, ...resto }) {
  return (
    <button
      type="button"
      aria-label={etiqueta}
      className="grid h-11 w-11 place-items-center rounded-full text-crema transition active:bg-crema/15 disabled:opacity-25"
      {...resto}
    >
      {children}
    </button>
  );
}

function Detalle({ semana, semanaPrevia, esActual }) {
  if (!semana) {
    return <>{esActual ? 'Apunta tu peso para empezar la media' : 'No apuntaste ningún peso esta semana'}</>;
  }
  const dias = `${semana.dias} de 7 días`;
  if (!semanaPrevia) return <>{dias}</>;
  const dif = diferenciaDeMedias(semana.media, semanaPrevia.media);
  return (
    <>
      {dias} ·{' '}
      {dif.sentido === 'igual' ? (
        'igual que la semana anterior'
      ) : (
        <>
          <span className="font-semibold text-miel">{dif.flecha} {dif.texto} kg</span> respecto a la anterior
        </>
      )}
    </>
  );
}

export default function Cabecera({
  saludo, hoy, lunes, lunesHoy, dias, pesos, semana, semanaPrevia, seleccion, onSemana,
}) {
  const esActual = lunes === lunesHoy;

  return (
    <header className="bg-cacao pb-12 pt-[calc(env(safe-area-inset-top)+1.75rem)] text-crema">
      <div className="mx-auto max-w-md px-5">
        <h1 className="text-[2rem] font-bold leading-tight tracking-tight">{saludo}</h1>
        <p className="mt-0.5 text-[0.95rem] text-miel">{capitalizar(fechaLarga(hoy))}</p>

        <section aria-labelledby="titulo-media" className="mt-8">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 id="titulo-media" className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-miel">
                Media semanal
              </h2>
              <p className="mt-0.5 text-[0.95rem] tabular-nums text-crema/85">
                {rangoSemana(lunes, Number(hoy.slice(0, 4)))}
                {esActual ? (
                  ' · esta semana'
                ) : (
                  <>
                    {' · '}
                    <button
                      type="button"
                      onClick={() => onSemana(lunesHoy)}
                      className="font-semibold text-miel underline decoration-miel/50 underline-offset-2"
                    >
                      volver a hoy
                    </button>
                  </>
                )}
              </p>
            </div>
            <div className="-mr-2.5 -mt-2 flex shrink-0">
              <BotonSemana etiqueta="Semana anterior" onClick={() => onSemana(sumarDias(lunes, -7))}>
                <Izquierda />
              </BotonSemana>
              <BotonSemana
                etiqueta="Semana siguiente"
                disabled={esActual}
                onClick={() => onSemana(sumarDias(lunes, 7))}
              >
                <Derecha />
              </BotonSemana>
            </div>
          </div>

          <p className="mt-3 flex h-[3.75rem] items-baseline gap-2 tabular-nums" aria-live="polite">
            {semana ? (
              <>
                <span className="text-[3.75rem] font-bold leading-none tracking-tight">{formatoPeso(semana.media)}</span>
                <span className="text-xl font-semibold text-miel">kg</span>
              </>
            ) : (
              <span className="self-end text-[1.75rem] font-bold text-crema/45">Sin pesos</span>
            )}
          </p>
          <p className="mt-2.5 text-[0.95rem] text-crema/85">
            <Detalle semana={semana} semanaPrevia={semanaPrevia} esActual={esActual} />
          </p>

          <GraficaSemana dias={dias} pesos={pesos} media={semana?.media} seleccion={seleccion} />
        </section>
      </div>
    </header>
  );
}
