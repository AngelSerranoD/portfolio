/**
 * DailyWeigh — detalle del día seleccionado.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
import { etiquetaDia, referenciaDia } from '../lib/fechas.js';
import { describirDiferencia, formatoPeso, pesoAnterior } from '../lib/pesos.js';

function Cambio({ clave, kilos, pesos, hoy }) {
  const anterior = pesoAnterior(clave, pesos);
  if (!anterior) return 'Primer registro';
  const cuando = referenciaDia(anterior.clave, hoy);
  const dif = describirDiferencia(kilos - anterior.kilos);
  if (dif.sentido === 'igual') return `Igual que ${cuando}`;
  return `${dif.flecha} ${dif.texto} kg desde ${cuando}`;
}

export default function PanelDia({ clave, hoy, pesos, onEditar }) {
  const kilos = pesos[clave];
  const tiene = kilos != null;

  return (
    <section
      aria-label="Día seleccionado"
      className="mt-3 flex min-h-[7.25rem] items-center justify-between gap-4 rounded-3xl bg-nata px-5 py-4"
    >
      <div className="min-w-0" aria-live="polite">
        <p className="text-sm font-semibold text-oxido">{etiquetaDia(clave, hoy)}</p>
        {tiene ? (
          <>
            <p className="mt-1 flex items-baseline gap-1.5 tabular-nums">
              <span className="text-[2.25rem] font-bold leading-none tracking-tight">{formatoPeso(kilos)}</span>
              <span className="text-lg font-semibold text-oxido">kg</span>
            </p>
            <p className="mt-1.5 text-sm tabular-nums text-oxido">
              <Cambio clave={clave} kilos={kilos} pesos={pesos} hoy={hoy} />
            </p>
          </>
        ) : (
          <p className="mt-1 text-[1.35rem] font-bold">Sin registro</p>
        )}
      </div>
      <button
        type="button"
        onClick={onEditar}
        className="shrink-0 rounded-full bg-oxido px-5 py-3 font-semibold text-crema shadow-md shadow-oxido/20 transition active:scale-95"
      >
        {tiene ? 'Editar' : 'Añadir peso'}
      </button>
    </section>
  );
}
