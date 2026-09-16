/**
 * DailyWeigh — gráfica de la semana.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 *
 * Cada día ocupa una séptima parte del ancho, igual que en la tira de días de
 * debajo, así que cada punto cae justo encima de su día. La línea se dibuja en
 * SVG estirado y los puntos en HTML: estirar el SVG deformaría los círculos.
 */
import { cx } from '../lib/cx.js';
import { formatoPeso } from '../lib/pesos.js';

const RANGO_MINIMO = 1.2; // kg: una semana casi plana no debe parecer una montaña rusa

export default function GraficaSemana({ dias, pesos, media, seleccion }) {
  const puntos = dias
    .map((clave, i) => ({ clave, i, kilos: pesos[clave] }))
    .filter((p) => p.kilos != null);

  if (puntos.length === 0) {
    return (
      <div className="relative mt-6 h-24" aria-hidden="true">
        <div className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-crema/15" />
      </div>
    );
  }

  let min = Math.min(...puntos.map((p) => p.kilos));
  let max = Math.max(...puntos.map((p) => p.kilos));
  if (max - min < RANGO_MINIMO) {
    const centro = (min + max) / 2;
    min = centro - RANGO_MINIMO / 2;
    max = centro + RANGO_MINIMO / 2;
  }
  const y = (kilos) => ((max - kilos) / (max - min)) * 100;
  const x = (i) => ((i + 0.5) / 7) * 100;

  const descripcion = puntos.map((p) => `${formatoPeso(p.kilos)} kg`).join(', ');

  return (
    <div className="relative mt-6 h-24" role="img" aria-label={`Pesos de la semana: ${descripcion}`}>
      <div className="absolute inset-x-0 inset-y-2.5">
        {media != null && (
          <div
            className="absolute inset-x-0 border-t-2 border-dashed border-miel/35"
            style={{ top: `${y(media)}%` }}
          />
        )}
        {puntos.length > 1 && (
          <svg
            className="absolute inset-0 h-full w-full overflow-visible"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polyline
              points={puntos.map((p) => `${x(p.i)},${y(p.kilos)}`).join(' ')}
              fill="none"
              stroke="#D9A05B"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        )}
        {puntos.map((p) => (
          <span
            key={p.clave}
            aria-hidden="true"
            className={cx(
              'absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-crema transition-all',
              p.clave === seleccion ? 'h-4 w-4 ring-4 ring-cobre' : 'h-2.5 w-2.5'
            )}
            style={{ left: `${x(p.i)}%`, top: `${y(p.kilos)}%` }}
          />
        ))}
      </div>
    </div>
  );
}
