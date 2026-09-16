/**
 * DailyWeigh — hoja para apuntar o corregir el peso de un día.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 *
 * Se abre sola la primera vez que se entra cada día. El peso se guarda en el
 * día que muestra la hoja, que empieza en el seleccionado y se puede mover
 * hacia atrás (nunca a un día futuro).
 */
import { useEffect, useId, useRef, useState } from 'react';
import { useAlturaTeclado } from '../hooks/useTeclado.js';
import { cx } from '../lib/cx.js';
import { etiquetaDia, referenciaDia, sumarDias } from '../lib/fechas.js';
import {
  PESO_MAX, PESO_MIN, describirDiferencia, formatoPeso, limitarPeso, limpiarTecleo, parsearPeso,
  pesoDeReferencia,
} from '../lib/pesos.js';
import { Derecha, Izquierda, Mas, Menos } from './Iconos.jsx';

const PASO = 0.1;
const textoDe = (kilos) => (kilos != null ? formatoPeso(kilos) : '');

/** Pulsar + o − no debe quitar el foco al campo: en iPhone se escondería el teclado. */
const sinRobarFoco = (e) => e.preventDefault();

function BotonPaso({ etiqueta, onClick, children }) {
  return (
    <button
      type="button"
      aria-label={etiqueta}
      onMouseDown={sinRobarFoco}
      onClick={onClick}
      className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-nata text-oxido transition active:scale-90 active:bg-miel/30"
    >
      {children}
    </button>
  );
}

function Pista({ dia, hoy, valor, referencia }) {
  if (!referencia) return 'Tu primer registro';
  const cuando = referenciaDia(referencia.clave, hoy);
  if (referencia.clave > dia) return `Registro más cercano: ${formatoPeso(referencia.kilos)} kg, ${cuando}`;
  if (valor == null) return `Último registro: ${formatoPeso(referencia.kilos)} kg, ${cuando}`;
  const dif = describirDiferencia(valor - referencia.kilos);
  if (dif.sentido === 'igual') return `Igual que ${cuando}`;
  return `${dif.flecha} ${dif.texto} kg desde ${cuando}`;
}

export default function HojaPeso({
  diaInicial, hoy, pesos, onGuardar, onBorrar, onCerrar, seguirTeclado = true,
}) {
  const [dia, setDia] = useState(diaInicial);
  const [texto, setTexto] = useState(() => textoDe(pesos[diaInicial]));
  const [error, setError] = useState(null);
  const [confirmando, setConfirmando] = useState(false);

  const teclado = useAlturaTeclado(seguirTeclado);
  const dialogo = useRef(null);
  const botonCancelar = useRef(null);
  const cerrar = useRef(onCerrar);
  const idTitulo = useId();
  const idPista = useId();

  const existente = pesos[dia];
  const referencia = pesoDeReferencia(dia, pesos);
  const valor = parsearPeso(texto);

  useEffect(() => {
    cerrar.current = onCerrar;
  }, [onCerrar]);

  // Bloquea el scroll de detrás, lleva el foco a la hoja y cierra con Escape.
  useEffect(() => {
    const raiz = document.documentElement;
    const overflowPrevio = raiz.style.overflow;
    const focoPrevio = document.activeElement;
    raiz.style.overflow = 'hidden';
    dialogo.current?.focus({ preventScroll: true });
    const alPulsar = (e) => {
      if (e.key === 'Escape') cerrar.current();
    };
    document.addEventListener('keydown', alPulsar);
    return () => {
      raiz.style.overflow = overflowPrevio;
      document.removeEventListener('keydown', alPulsar);
      focoPrevio?.focus?.({ preventScroll: true });
    };
  }, []);

  // En una confirmación destructiva el foco empieza en «Cancelar».
  useEffect(() => {
    if (confirmando) botonCancelar.current?.focus();
  }, [confirmando]);

  const cambiarDia = (salto) => {
    const nuevo = sumarDias(dia, salto);
    if (nuevo > hoy) return;
    setDia(nuevo);
    setTexto(textoDe(pesos[nuevo]));
    setError(null);
    setConfirmando(false);
  };

  const ajustar = (salto) => {
    const base = valor ?? referencia?.kilos ?? 70;
    setTexto(formatoPeso(limitarPeso(base + salto)));
    setError(null);
  };

  const alEscribir = (e) => {
    setTexto(limpiarTecleo(e.target.value));
    setError(null);
  };

  const guardar = (e) => {
    e.preventDefault();
    if (valor == null) {
      setError(`Escribe un peso entre ${PESO_MIN} y ${PESO_MAX} kg`);
      return;
    }
    onGuardar(dia, valor);
  };

  const deDia = referenciaDia(dia, hoy).replace(/^el /, 'del ').replace(/^(hoy|ayer)$/, 'de $1');

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 animate-fundido bg-cacao/60" onClick={onCerrar} aria-hidden="true" />

      <div
        ref={dialogo}
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        tabIndex={-1}
        className={cx(
          'absolute inset-x-0 mx-auto max-w-md animate-subir rounded-t-[28px] bg-crema px-5 pt-2.5 shadow-2xl outline-none transition-[bottom] duration-200',
          teclado ? 'pb-4' : 'pb-[calc(env(safe-area-inset-bottom)+1rem)]'
        )}
        style={{ bottom: teclado }}
      >
        <div className="mx-auto h-1.5 w-10 rounded-full bg-miel/70" aria-hidden="true" />

        <div className="mt-3 flex items-center justify-between gap-3">
          <h2 id={idTitulo} className="text-[1.4rem] font-bold">
            {existente != null ? 'Editar peso' : '¿Cuánto pesas?'}
          </h2>
          <button
            type="button"
            onClick={onCerrar}
            className="-mr-2 rounded-full px-3 py-2 font-semibold text-oxido transition active:bg-miel/25"
          >
            Ahora no
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-2xl bg-nata p-1">
          <button
            type="button"
            aria-label="Día anterior"
            onMouseDown={sinRobarFoco}
            onClick={() => cambiarDia(-1)}
            className="grid h-11 w-11 place-items-center rounded-xl text-oxido transition active:bg-miel/30"
          >
            <Izquierda />
          </button>
          <p className="font-semibold" aria-live="polite">{etiquetaDia(dia, hoy)}</p>
          <button
            type="button"
            aria-label="Día siguiente"
            disabled={dia >= hoy}
            onMouseDown={sinRobarFoco}
            onClick={() => cambiarDia(1)}
            className="grid h-11 w-11 place-items-center rounded-xl text-oxido transition active:bg-miel/30 disabled:opacity-25"
          >
            <Derecha />
          </button>
        </div>

        <form onSubmit={guardar} noValidate className="mt-6">
          <div className="flex items-center justify-center gap-3">
            <BotonPaso etiqueta="Restar 100 gramos" onClick={() => ajustar(-PASO)}>
              <Menos className="h-6 w-6" />
            </BotonPaso>
            <label className="flex items-baseline gap-1.5 px-1">
              <input
                value={texto}
                onChange={alEscribir}
                inputMode="decimal"
                enterKeyHint="done"
                autoComplete="off"
                placeholder={referencia ? formatoPeso(referencia.kilos) : '00,0'}
                aria-label="Peso en kilos"
                aria-invalid={error ? 'true' : undefined}
                aria-describedby={idPista}
                className="w-[5ch] border-b-2 border-miel bg-transparent pb-1 text-center text-[3.25rem] font-bold leading-none tabular-nums text-cacao caret-oxido outline-none transition-colors placeholder:text-miel/60 focus:border-oxido"
              />
              <span className="text-xl font-semibold text-oxido">kg</span>
            </label>
            <BotonPaso etiqueta="Sumar 100 gramos" onClick={() => ajustar(PASO)}>
              <Mas className="h-6 w-6" />
            </BotonPaso>
          </div>

          <p
            id={idPista}
            aria-live="polite"
            className={cx('mt-3 min-h-[1.25rem] text-center text-sm tabular-nums text-oxido', error && 'font-semibold')}
          >
            {error ?? <Pista dia={dia} hoy={hoy} valor={valor} referencia={referencia} />}
          </p>

          <button
            type="submit"
            disabled={texto === ''}
            className="mt-5 w-full rounded-2xl bg-oxido py-4 text-lg font-semibold text-crema shadow-lg shadow-oxido/25 transition active:scale-[0.99] disabled:opacity-45"
          >
            Guardar
          </button>
        </form>

        {existente != null &&
          (confirmando ? (
            <div role="group" aria-label="Confirmar borrado" className="mt-3 rounded-2xl bg-nata p-4">
              <p className="text-center font-semibold">¿Borrar el peso {deDia}?</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <button
                  ref={botonCancelar}
                  type="button"
                  onClick={() => setConfirmando(false)}
                  className="rounded-xl bg-crema py-3 font-semibold transition active:scale-[0.98]"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => onBorrar(dia)}
                  className="rounded-xl bg-cacao py-3 font-semibold text-crema transition active:scale-[0.98]"
                >
                  Borrar
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmando(true)}
              className="mt-2 w-full rounded-2xl py-3 font-semibold text-oxido transition active:bg-miel/25"
            >
              Borrar registro
            </button>
          ))}
      </div>
    </div>
  );
}
