/**
 * DailyWeigh — media de cada semana anterior.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 *
 * Al tocar una semana se muestra arriba, con su gráfica y el peso de cada día.
 */
import { cx } from '../lib/cx.js';
import { rangoSemana, sumarDias } from '../lib/fechas.js';
import { diferenciaDeMedias, formatoPeso } from '../lib/pesos.js';
import { Derecha } from './Iconos.jsx';

export default function HistorialSemanas({ semanas, todas, lunesVisible, hoy, onSemana }) {
  const anio = Number(hoy.slice(0, 4));
  const porLunes = new Map(todas.map((s) => [s.lunes, s]));

  return (
    <section aria-labelledby="titulo-historial" className="mt-9">
      <h2 id="titulo-historial" className="px-1 text-xl font-bold">Semanas anteriores</h2>

      {semanas.length === 0 ? (
        <p className="mt-1.5 px-1 text-[0.95rem] leading-relaxed text-oxido">
          Cuando acabe tu primera semana verás aquí su media, y la de todas las que vengan.
        </p>
      ) : (
        <ul className="mt-3 overflow-hidden rounded-3xl bg-nata">
          {semanas.map((s, i) => {
            // Solo contra la semana justo anterior: con un hueco, «respecto a la anterior» engañaría.
            const previa = porLunes.get(sumarDias(s.lunes, -7));
            const dif = previa ? diferenciaDeMedias(s.media, previa.media) : null;
            const visible = s.lunes === lunesVisible;
            return (
              <li key={s.lunes} className={cx(i > 0 && 'border-t border-miel/30')}>
                <button
                  type="button"
                  onClick={() => onSemana(s.lunes)}
                  aria-current={visible ? 'true' : undefined}
                  className={cx(
                    'flex w-full items-center gap-3 px-5 py-3.5 text-left transition active:bg-miel/20',
                    visible && 'bg-miel/25'
                  )}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{rangoSemana(s.lunes, anio)}</span>
                    <span className="block text-sm text-oxido">
                      {s.dias} {s.dias === 1 ? 'día' : 'días'}
                    </span>
                  </span>
                  <span className="text-right tabular-nums">
                    <span className="block font-bold">{formatoPeso(s.media)} kg</span>
                    {dif && (
                      <span className="block text-sm text-oxido">
                        {dif.sentido === 'igual' ? '= igual' : `${dif.flecha} ${dif.texto}`}
                      </span>
                    )}
                  </span>
                  <Derecha className="h-4 w-4 shrink-0 text-cobre" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
