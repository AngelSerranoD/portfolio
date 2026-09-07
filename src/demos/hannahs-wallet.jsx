/**
 * Demo web de "Hannah's Wallet" — réplica de la app Flutter original.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
import { useMemo, useState } from 'react';
import { StatusBar } from '../components/PhoneFrame';

const C = {
  darkGreen: '#0A3323',
  moss: '#839958',
  beige: '#F7F4D5',
  rosyBrown: '#D3968C',
  midnight: '#105666',
  surface: '#FBFAEC',
  surfaceAlt: '#E4E5C7',
  outline: '#CCD1B5',
  textTertiary: '#558587',
  textDisabled: '#9AAFA4',
};

const MOVIMIENTOS = [
  { id: 1, nombre: 'Nómina', cat: 'Salario', importe: 1840, dia: '1 sep' },
  { id: 2, nombre: 'Alquiler', cat: 'Vivienda', importe: -720, dia: '2 sep' },
  { id: 3, nombre: 'Compra semanal', cat: 'Alimentación', importe: -86.4, dia: '3 sep' },
  { id: 4, nombre: 'Gasolina', cat: 'Transporte', importe: -62.1, dia: '4 sep' },
  { id: 5, nombre: 'Gimnasio', cat: 'Salud', importe: -34.9, dia: '5 sep' },
  { id: 6, nombre: 'Cena fuera', cat: 'Ocio', importe: -41.5, dia: '6 sep' },
  { id: 7, nombre: 'Venta de segunda mano', cat: 'Otros', importe: 55, dia: '6 sep' },
];

const PRESUPUESTOS = [
  { cat: 'Alimentación', gastado: 186.4, limite: 320 },
  { cat: 'Transporte', gastado: 142.1, limite: 150 },
  { cat: 'Ocio', gastado: 138.5, limite: 120 },
  { cat: 'Salud', gastado: 34.9, limite: 90 },
];

/** Límite global del mes: el dinero total que reparten las categorías. */
const TOTAL_MES = 900;

/** Categorías sin límite propio todavía, para el formulario de la demo. */
const CATEGORIAS_LIBRES = ['Vivienda', 'Suscripciones', 'Ropa', 'Viajes'];

const eur = (n) =>
  `${n < 0 ? '−' : '+'}${Math.abs(n).toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} €`;

/**
 * El gato de la app reacciona al estado del presupuesto. Aquí se representa
 * con su expresión escrita, ya que el portfolio no usa iconografía.
 */
function Mascota({ estado }) {
  const caras = {
    bien: ['Tranquilo', 'Vas holgado este mes'],
    justo: ['Atento', 'Queda poco margen'],
    mal: ['Preocupado', 'Te has pasado en Ocio'],
  };
  const [titulo, sub] = caras[estado];

  return (
    <div
      className="flex items-center gap-4 rounded-[22px] p-4"
      style={{ backgroundColor: C.darkGreen }}
    >
      <div
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold"
        style={{ backgroundColor: C.moss, color: C.darkGreen }}
      >
        {estado === 'bien' ? 'ᴗ ᴗ' : estado === 'justo' ? '· ·' : 'ᵕ ᵕ'}
      </div>
      <div className="min-w-0">
        <p className="text-[14px] font-extrabold" style={{ color: C.beige }}>
          {titulo}
        </p>
        <p className="mt-0.5 text-[11.5px]" style={{ color: C.moss }}>
          {sub}
        </p>
      </div>
    </div>
  );
}

function Barra({ valor, limite }) {
  const pct = Math.min((valor / limite) * 100, 100);
  const excedido = valor > limite;
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ backgroundColor: C.outline }}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, backgroundColor: excedido ? C.rosyBrown : C.midnight }}
      />
    </div>
  );
}

/**
 * Cabecera de Presupuestos: el dinero total del mes y lo que queda libre.
 *
 * El límite global es la bolsa; cada límite por categoría saca una parte. Sin
 * este resumen había que sumar las tarjetas a mano para saber si cabía otra.
 */
function Reparto({ total, repartido, libre, n }) {
  const pasado = libre < 0;
  const pct = Math.round((repartido / total) * 100);

  return (
    <div
      className="mt-4 rounded-[20px] p-4"
      style={{
        backgroundColor: C.surfaceAlt,
        border: `1px solid ${pasado ? C.rosyBrown : C.outline}`,
      }}
    >
      <p
        className="text-[11px] font-bold uppercase tracking-wide"
        style={{ color: pasado ? C.rosyBrown : C.textTertiary }}
      >
        {pasado ? 'Te has pasado del total' : 'Libre para nuevas categorías'}
      </p>
      <div className="mt-1 flex items-baseline justify-between gap-2">
        <p
          className="text-[28px] font-extrabold leading-none"
          style={{ color: pasado ? C.rosyBrown : C.darkGreen }}
        >
          {Math.abs(libre).toFixed(2)} €
        </p>
        <span className="text-[12px]" style={{ color: C.textTertiary }}>
          de {total.toFixed(2)} €
        </span>
      </div>
      <div className="mt-3">
        <Barra valor={repartido} limite={total} />
      </div>
      <div className="mt-2 flex items-baseline justify-between gap-2">
        <span className="text-[11px]" style={{ color: pasado ? C.rosyBrown : C.textTertiary }}>
          {n === 0
            ? 'Todavía no has repartido nada por categorías.'
            : `Repartido en ${n} ${n === 1 ? 'categoría' : 'categorías'}: ${repartido.toFixed(2)} €`}
        </span>
        <span className="shrink-0 text-[11px] font-extrabold" style={{ color: C.midnight }}>
          {pct} %
        </span>
      </div>
    </div>
  );
}

/**
 * Alta de un límite por categoría. La pista de debajo del importe descuenta en
 * vivo lo escrito, que es donde la cuenta sirve: al decidir el número, no
 * después de guardar.
 */
function NuevoLimite({ libre, usadas, onCrear }) {
  const [abierto, setAbierto] = useState(false);
  const [cat, setCat] = useState('');
  const [importe, setImporte] = useState('');

  const disponibles = CATEGORIAS_LIBRES.filter((c) => !usadas.includes(c));
  const pedido = Number.parseFloat(importe.replace(',', '.')) || 0;
  const restante = libre - pedido;

  if (disponibles.length === 0) return null;

  if (!abierto) {
    return (
      <button
        onClick={() => setAbierto(true)}
        className="mt-3 w-full rounded-full py-2.5 text-[12px] font-extrabold transition active:scale-[0.98]"
        style={{ backgroundColor: C.darkGreen, color: C.beige }}
      >
        + Nuevo límite
      </button>
    );
  }

  return (
    <div
      className="mt-3 rounded-[20px] p-4"
      style={{ backgroundColor: C.surface, border: `1px solid ${C.outline}` }}
    >
      <p className="text-[13px] font-extrabold">Nuevo límite</p>

      <input
        value={importe}
        onChange={(e) => setImporte(e.target.value)}
        inputMode="decimal"
        placeholder="Límite mensual"
        className="mt-3 w-full rounded-[14px] px-3 py-2 text-[13px] outline-none"
        style={{ backgroundColor: C.beige, border: `1px solid ${C.outline}`, color: C.darkGreen }}
      />

      <p
        className="mt-2 text-[11px]"
        style={{ color: restante < 0 ? C.rosyBrown : C.textTertiary }}
      >
        Libre: {libre.toFixed(2)} €.{' '}
        {restante < 0
          ? `Con este límite te pasarías ${Math.abs(restante).toFixed(2)} € del total.`
          : `Con este límite quedarían ${restante.toFixed(2)} €.`}
      </p>

      <p className="mt-3 text-[11px] font-bold uppercase" style={{ color: C.textTertiary }}>
        Se aplica a
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {disponibles.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className="rounded-full px-3 py-1.5 text-[11.5px] transition"
            style={{
              backgroundColor: cat === c ? C.darkGreen : C.surfaceAlt,
              color: cat === c ? C.beige : C.darkGreen,
              fontWeight: cat === c ? 800 : 500,
            }}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => {
            setAbierto(false);
            setCat('');
            setImporte('');
          }}
          className="flex-1 rounded-full py-2 text-[12px] font-bold"
          style={{ backgroundColor: C.surfaceAlt, color: C.darkGreen }}
        >
          Cancelar
        </button>
        <button
          disabled={!cat || pedido <= 0}
          onClick={() => {
            onCrear(cat, pedido);
            setAbierto(false);
            setCat('');
            setImporte('');
          }}
          className="flex-1 rounded-full py-2 text-[12px] font-extrabold transition active:scale-[0.98] disabled:opacity-40"
          style={{ backgroundColor: C.darkGreen, color: C.beige }}
        >
          Guardar
        </button>
      </div>
    </div>
  );
}

export default function HannahsWalletDemo() {
  const [tab, setTab] = useState('resumen');
  const [bloqueada, setBloqueada] = useState(true);
  const [presupuestos, setPresupuestos] = useState(PRESUPUESTOS);

  // Lo repartido y lo que queda libre del total del mes. Es la cuenta que la
  // app enseña arriba de Presupuestos: cada categoría nueva la baja.
  const repartido = presupuestos.reduce((a, p) => a + p.limite, 0);
  const libre = TOTAL_MES - repartido;

  const { ingresos, gastos, saldo } = useMemo(() => {
    const ingresos = MOVIMIENTOS.filter((m) => m.importe > 0).reduce((a, m) => a + m.importe, 0);
    const gastos = MOVIMIENTOS.filter((m) => m.importe < 0).reduce((a, m) => a + m.importe, 0);
    return { ingresos, gastos, saldo: ingresos + gastos };
  }, []);

  if (bloqueada) {
    return (
      <div
        className="flex h-full flex-col items-center justify-center px-8 text-center"
        style={{ backgroundColor: C.darkGreen }}
      >
        <p className="text-[22px] font-extrabold" style={{ color: C.beige }}>
          Hannah&apos;s Wallet
        </p>
        <p className="mt-3 text-[12.5px] leading-relaxed" style={{ color: C.moss }}>
          Los movimientos están cifrados en el dispositivo. Desbloquea para verlos.
        </p>
        <button
          onClick={() => setBloqueada(false)}
          className="mt-8 w-full rounded-full py-3.5 text-[13px] font-extrabold transition active:scale-[0.98]"
          style={{ backgroundColor: C.beige, color: C.darkGreen }}
        >
          Desbloquear
        </button>
        <p className="mt-4 text-[10.5px]" style={{ color: C.textDisabled }}>
          En el móvil se usa huella, cara o PIN
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col" style={{ backgroundColor: C.beige, color: C.darkGreen }}>
      <StatusBar />

      <div className="no-scrollbar flex-1 overflow-y-auto px-5 pb-5">
        {tab === 'resumen' && (
          <>
            <p className="pt-2 text-[11px] font-bold uppercase tracking-wider" style={{ color: C.textTertiary }}>
              Septiembre 2026
            </p>
            <p className="mt-1 text-[38px] font-extrabold leading-none">
              {saldo.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
            </p>
            <p className="mt-1 text-[12px]" style={{ color: C.textTertiary }}>
              Saldo del mes
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-[18px] p-4" style={{ backgroundColor: C.surface, border: `1px solid ${C.outline}` }}>
                <p className="text-[10.5px] font-bold uppercase" style={{ color: C.textTertiary }}>
                  Ingresos
                </p>
                <p className="mt-1 text-[19px] font-extrabold" style={{ color: C.midnight }}>
                  {ingresos.toFixed(2)} €
                </p>
              </div>
              <div className="rounded-[18px] p-4" style={{ backgroundColor: C.surface, border: `1px solid ${C.outline}` }}>
                <p className="text-[10.5px] font-bold uppercase" style={{ color: C.textTertiary }}>
                  Gastos
                </p>
                <p className="mt-1 text-[19px] font-extrabold" style={{ color: C.rosyBrown }}>
                  {Math.abs(gastos).toFixed(2)} €
                </p>
              </div>
            </div>

            <div className="mt-4">
              <Mascota estado="mal" />
            </div>

            <p className="mt-5 text-[13px] font-extrabold">Últimos movimientos</p>
            <div className="mt-2">
              {MOVIMIENTOS.slice(0, 5).map((m, i, arr) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between py-3"
                  style={{ borderBottom: i < arr.length - 1 ? `1px solid ${C.outline}` : 'none' }}
                >
                  <div className="min-w-0">
                    <p className="truncate text-[13.5px] font-bold">{m.nombre}</p>
                    <p className="text-[11px]" style={{ color: C.textTertiary }}>
                      {m.cat} · {m.dia}
                    </p>
                  </div>
                  <span
                    className="shrink-0 text-[13.5px] font-extrabold"
                    style={{ color: m.importe > 0 ? C.midnight : C.rosyBrown }}
                  >
                    {eur(m.importe)}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'presupuestos' && (
          <>
            <p className="pt-3 text-[24px] font-extrabold">Presupuestos</p>

            <Reparto total={TOTAL_MES} repartido={repartido} libre={libre} n={presupuestos.length} />

            <NuevoLimite
              libre={libre}
              usadas={presupuestos.map((p) => p.cat)}
              onCrear={(cat, limite) =>
                setPresupuestos((prev) => [...prev, { cat, gastado: 0, limite }])
              }
            />

            <div className="mt-4 space-y-3">
              {presupuestos.map((p) => {
                const excedido = p.gastado > p.limite;
                return (
                  <div
                    key={p.cat}
                    className="rounded-[18px] p-4"
                    style={{
                      backgroundColor: C.surface,
                      border: `1px solid ${excedido ? C.rosyBrown : C.outline}`,
                    }}
                  >
                    <div className="flex items-baseline justify-between">
                      <p className="text-[13.5px] font-bold">{p.cat}</p>
                      <span
                        className="text-[12px] font-extrabold"
                        style={{ color: excedido ? C.rosyBrown : C.midnight }}
                      >
                        {p.gastado.toFixed(2)} / {p.limite} €
                      </span>
                    </div>
                    <div className="mt-2.5">
                      <Barra valor={p.gastado} limite={p.limite} />
                    </div>
                    {excedido && (
                      <p className="mt-2 text-[11px] font-bold" style={{ color: C.rosyBrown }}>
                        Te has pasado {(p.gastado - p.limite).toFixed(2)} €
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {tab === 'estadisticas' && (
          <>
            <p className="pt-3 text-[24px] font-extrabold">Estadísticas</p>
            <p className="mt-4 text-[11px] font-bold uppercase" style={{ color: C.textTertiary }}>
              Gasto por categoría
            </p>
            <div className="mt-3 space-y-3">
              {presupuestos.map((p) => (
                <div key={p.cat}>
                  <div className="flex items-baseline justify-between">
                    <span className="text-[12.5px]">{p.cat}</span>
                    <span className="text-[12px] font-bold">{p.gastado.toFixed(2)} €</span>
                  </div>
                  <div className="mt-1.5">
                    <Barra valor={p.gastado} limite={320} />
                  </div>
                </div>
              ))}
            </div>

            <div
              className="mt-6 rounded-[18px] p-4"
              style={{ backgroundColor: C.surfaceAlt, border: `1px solid ${C.outline}` }}
            >
              <p className="text-[12px] leading-relaxed" style={{ color: C.darkGreen }}>
                Nada de esto sale del dispositivo. La base de datos está cifrada con SQLCipher
                y la clave vive en el almacén seguro del sistema.
              </p>
            </div>
          </>
        )}
      </div>

      <nav
        className="flex shrink-0 items-center px-2 pb-6 pt-2"
        style={{ backgroundColor: C.surface, borderTop: `1px solid ${C.outline}` }}
      >
        {[
          ['resumen', 'Resumen'],
          ['presupuestos', 'Presupuestos'],
          ['estadisticas', 'Estadísticas'],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className="flex-1 rounded-full py-2 text-[11.5px] transition"
            style={{
              backgroundColor: tab === id ? C.surfaceAlt : 'transparent',
              color: tab === id ? C.darkGreen : C.textDisabled,
              fontWeight: tab === id ? 800 : 500,
            }}
          >
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}
