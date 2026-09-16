/**
 * DailyWeigh — los siete días de la semana visible.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 *
 * Sin `gap` en la rejilla (el hueco va dentro de cada celda) para que el centro
 * de cada día coincida con su punto en la gráfica de la cabecera.
 */
import { cx } from '../lib/cx.js';
import { INICIALES, etiquetaDia } from '../lib/fechas.js';
import { formatoPeso } from '../lib/pesos.js';

export default function TiraDias({ dias, pesos, hoy, seleccion, onDia }) {
  return (
    <div className="grid grid-cols-7" role="group" aria-label="Días de la semana">
      {dias.map((clave, i) => {
        const kilos = pesos[clave];
        const futuro = clave > hoy;
        const elegido = clave === seleccion;
        const esHoy = clave === hoy;
        return (
          <div key={clave} className="px-[3px]">
            <button
              type="button"
              disabled={futuro}
              aria-pressed={elegido}
              aria-label={`${etiquetaDia(clave, hoy)}: ${kilos != null ? `${formatoPeso(kilos)} kg` : 'sin peso'}`}
              onClick={() => onDia(clave)}
              className={cx(
                'flex w-full flex-col items-center rounded-2xl pb-2 pt-2.5 transition active:scale-95',
                elegido ? 'bg-oxido text-crema shadow-md shadow-oxido/25' : 'bg-nata text-cacao',
                esHoy && !elegido && 'ring-2 ring-inset ring-cobre',
                futuro && 'opacity-40'
              )}
            >
              <span className={cx('text-[0.7rem] font-semibold', elegido ? 'text-crema/80' : 'text-oxido')}>
                {INICIALES[i]}
              </span>
              <span className="mt-0.5 text-lg font-bold leading-tight tabular-nums">{Number(clave.slice(8))}</span>
              <span
                className={cx(
                  'mt-0.5 text-[0.7rem] font-medium tabular-nums',
                  kilos == null && !elegido && 'text-oxido'
                )}
              >
                {kilos != null ? formatoPeso(kilos) : '—'}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
