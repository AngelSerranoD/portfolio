/**
 * Demo web de "WeightTracker" — réplica de la app Android (Jetpack Compose).
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
import { useMemo, useState } from 'react';
import { StatusBar } from '../components/PhoneFrame';

const C = {
  background: '#F1F3F4',
  primaryYellow: '#E7F19A',
  secondaryPink: '#FAD1E6',
  accentTeal: '#C0E8D5',
  accentBlue: '#B2C5FF',
  textDark: '#1C1B1F',
  textGray: '#757575',
  surface: '#FFFFFF',
};

/** Historial de ejemplo: peso en kg por fecha. */
const HISTORY = [
  ['12 jul', 84.2],
  ['19 jul', 83.6],
  ['26 jul', 83.1],
  ['2 ago', 82.4],
  ['9 ago', 82.7],
  ['16 ago', 81.8],
  ['23 ago', 81.2],
  ['30 ago', 80.6],
  ['6 sep', 80.1],
];

function Card({ color = C.surface, className = '', children }) {
  return (
    <div className={`rounded-[24px] p-5 ${className}`} style={{ backgroundColor: color }}>
      {children}
    </div>
  );
}

/**
 * Gráfica de evolución. En la app original se dibuja con Canvas de Compose;
 * aquí se reproduce el mismo trazado con un path SVG.
 */
function WeightGraph({ data }) {
  const W = 280;
  const H = 130;
  const pad = 6;

  const { line, area, points, min, max } = useMemo(() => {
    const values = data.map((d) => d[1]);
    const min = Math.min(...values) - 0.4;
    const max = Math.max(...values) + 0.4;
    const span = max - min || 1;

    const pts = data.map((d, i) => {
      const x = pad + (i / (data.length - 1)) * (W - pad * 2);
      const y = pad + (1 - (d[1] - min) / span) * (H - pad * 2);
      return [x, y];
    });

    const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
    const area = `${line} L${pts[pts.length - 1][0].toFixed(1)},${H} L${pts[0][0].toFixed(1)},${H} Z`;
    return { line, area, points: pts, min, max };
  }, [data]);

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="wt-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.textDark} stopOpacity="0.16" />
            <stop offset="100%" stopColor={C.textDark} stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0, 0.5, 1].map((t) => (
          <line
            key={t}
            x1={pad}
            x2={W - pad}
            y1={pad + t * (H - pad * 2)}
            y2={pad + t * (H - pad * 2)}
            stroke={C.textGray}
            strokeOpacity="0.15"
            strokeDasharray="3 4"
          />
        ))}

        <path d={area} fill="url(#wt-fill)" />
        <path d={line} fill="none" stroke={C.textDark} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {points.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={i === points.length - 1 ? 5 : 3}
            fill={i === points.length - 1 ? C.textDark : C.surface}
            stroke={C.textDark}
            strokeWidth="2"
          />
        ))}
      </svg>

      <div className="mt-2 flex justify-between text-[10px] font-semibold" style={{ color: C.textGray }}>
        <span>{data[0][0]}</span>
        <span>{data[data.length - 1][0]}</span>
      </div>
      <div className="mt-1 flex justify-between text-[10px]" style={{ color: C.textGray }}>
        <span>mín {min.toFixed(1)} kg</span>
        <span>máx {max.toFixed(1)} kg</span>
      </div>
    </div>
  );
}

function PhotoSlot({ label, filled }) {
  return (
    <div
      className="flex aspect-[3/4] flex-1 flex-col items-center justify-center rounded-2xl"
      style={{
        backgroundColor: filled ? C.accentBlue : 'rgba(0,0,0,0.045)',
        border: filled ? 'none' : `1.5px dashed ${C.textGray}55`,
      }}
    >
      <span className="text-[9.5px] font-bold uppercase" style={{ color: C.textGray }}>
        {label}
      </span>
      <span className="mt-1 text-[9px]" style={{ color: C.textGray }}>
        {filled ? 'Subida' : 'Pendiente'}
      </span>
    </div>
  );
}

export default function WeightTrackerDemo() {
  const [tab, setTab] = useState('hoy');
  const [peso, setPeso] = useState('80.1');
  const [entrada, setEntrada] = useState('');
  const [guardado, setGuardado] = useState(false);
  const [f1, setF1] = useState('12 jul');
  const [f2, setF2] = useState('6 sep');

  const actual = parseFloat(peso);
  const inicial = HISTORY[0][1];
  const diff = actual - inicial;

  const guardar = () => {
    const v = parseFloat(entrada.replace(',', '.'));
    if (!Number.isNaN(v) && v > 20 && v < 300) {
      setPeso(v.toFixed(1));
      setEntrada('');
      setGuardado(true);
      setTimeout(() => setGuardado(false), 1800);
    }
  };

  const TABS = [
    ['hoy', 'Hoy'],
    ['grafica', 'Gráfica'],
    ['estado', 'Estado'],
    ['comparar', 'Comparar'],
  ];

  return (
    <div className="flex h-full flex-col" style={{ backgroundColor: C.background }}>
      <StatusBar />

      <div className="no-scrollbar flex-1 overflow-y-auto px-5 pb-5">
        {tab === 'hoy' && (
          <>
            <h1 className="pt-3 text-[28px] font-extrabold leading-tight" style={{ color: C.textDark }}>
              Resumen
            </h1>

            <Card color={C.primaryYellow} className="mt-4">
              <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: C.textGray }}>
                Peso actual
              </p>
              <div className="mt-1 flex items-end gap-1.5">
                <span className="text-[48px] font-extrabold leading-none" style={{ color: C.textDark }}>
                  {peso}
                </span>
                <span className="mb-1.5 text-[18px] font-bold" style={{ color: C.textGray }}>
                  kg
                </span>
              </div>
              <p className="mt-2 text-[12px] font-semibold" style={{ color: C.textDark }}>
                {diff <= 0 ? '▼' : '▲'} {Math.abs(diff).toFixed(1)} kg desde el {HISTORY[0][0]}
              </p>
            </Card>

            <Card className="mt-4">
              <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: C.textGray }}>
                Registrar peso
              </p>
              <div className="mt-3 flex items-center gap-2">
                <input
                  value={entrada}
                  onChange={(e) => setEntrada(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && guardar()}
                  inputMode="decimal"
                  placeholder="0.0"
                  className="w-full rounded-2xl px-4 py-3 text-[22px] font-extrabold outline-none"
                  style={{ backgroundColor: C.background, color: C.textDark }}
                />
                <span className="text-[15px] font-bold" style={{ color: C.textGray }}>
                  kg
                </span>
              </div>
              <button
                onClick={guardar}
                className="mt-3 w-full rounded-full py-3.5 text-[13px] font-extrabold uppercase tracking-wide transition active:scale-[0.98]"
                style={{ backgroundColor: C.textDark, color: '#fff' }}
              >
                {guardado ? '¡Peso guardado!' : 'Guardar peso'}
              </button>
            </Card>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Card color={C.accentTeal}>
                <p className="text-[11px] font-bold uppercase" style={{ color: C.textGray }}>
                  Registros
                </p>
                <p className="mt-1 text-[30px] font-extrabold leading-none" style={{ color: C.textDark }}>
                  {HISTORY.length}
                </p>
              </Card>
              <Card color={C.secondaryPink}>
                <p className="text-[11px] font-bold uppercase" style={{ color: C.textGray }}>
                  Media
                </p>
                <p className="mt-1 text-[30px] font-extrabold leading-none" style={{ color: C.textDark }}>
                  {(HISTORY.reduce((a, b) => a + b[1], 0) / HISTORY.length).toFixed(1)}
                </p>
              </Card>
            </div>
          </>
        )}

        {tab === 'grafica' && (
          <>
            <h1 className="pt-3 text-[28px] font-extrabold leading-tight" style={{ color: C.textDark }}>
              Progreso
            </h1>

            <Card className="mt-4">
              <p className="text-[13px] font-extrabold" style={{ color: C.textDark }}>
                Evolución de Peso
              </p>
              <p className="mt-0.5 text-[11px]" style={{ color: C.textGray }}>
                Últimas {HISTORY.length} mediciones
              </p>
              <div className="mt-4">
                <WeightGraph data={HISTORY} />
              </div>
            </Card>

            <Card color={C.accentBlue} className="mt-4">
              <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: C.textGray }}>
                Variación total
              </p>
              <p className="mt-1 text-[34px] font-extrabold leading-none" style={{ color: C.textDark }}>
                {diff.toFixed(1)} kg
              </p>
            </Card>

            <Card className="mt-4">
              <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: C.textGray }}>
                Registro
              </p>
              <div className="mt-2">
                {[...HISTORY].reverse().slice(0, 5).map(([fecha, kg], i, arr) => (
                  <div
                    key={fecha}
                    className="flex items-center justify-between py-2.5"
                    style={{ borderBottom: i < arr.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none' }}
                  >
                    <span className="text-[13px]" style={{ color: C.textGray }}>
                      {fecha}
                    </span>
                    <span className="text-[14px] font-bold" style={{ color: C.textDark }}>
                      {kg.toFixed(1)} kg
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

        {tab === 'estado' && (
          <>
            <h1 className="pt-3 text-[28px] font-extrabold leading-tight" style={{ color: C.textDark }}>
              Estado físico
            </h1>

            <Card color={C.secondaryPink} className="mt-4">
              <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: C.textGray }}>
                Próxima subida en:
              </p>
              <p className="mt-1 text-[34px] font-extrabold leading-none" style={{ color: C.textDark }}>
                4d 06h
              </p>
            </Card>

            <Card className="mt-4">
              <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: C.textGray }}>
                Fotos de hoy
              </p>
              <div className="mt-3 flex gap-2.5">
                <PhotoSlot label="Frente" filled />
                <PhotoSlot label="Perfil" filled />
                <PhotoSlot label="Espalda" />
              </div>
              <button
                className="mt-4 w-full rounded-full py-3.5 text-[13px] font-extrabold uppercase tracking-wide transition active:scale-[0.98]"
                style={{ backgroundColor: C.textDark, color: '#fff' }}
              >
                Añadir 3 fotos
              </button>
            </Card>

            <Card color={C.accentTeal} className="mt-4">
              <p className="text-[12px] font-semibold leading-relaxed" style={{ color: C.textDark }}>
                Las fotos se guardan solo en tu dispositivo. La app nunca las sube a ningún servidor.
              </p>
            </Card>
          </>
        )}

        {tab === 'comparar' && (
          <>
            <h1 className="pt-3 text-[28px] font-extrabold leading-tight" style={{ color: C.textDark }}>
              Comparar
            </h1>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                ['Fecha 1', f1, setF1],
                ['Fecha 2', f2, setF2],
              ].map(([label, value, setter]) => (
                <Card key={label} className="!p-4">
                  <p className="text-[10.5px] font-bold uppercase" style={{ color: C.textGray }}>
                    {label}
                  </p>
                  <select
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    className="mt-1.5 w-full bg-transparent text-[14px] font-extrabold outline-none"
                    style={{ color: C.textDark }}
                  >
                    {HISTORY.map(([d]) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </Card>
              ))}
            </div>

            <div className="mt-3 flex gap-3">
              {[f1, f2].map((f, i) => (
                <div key={f + i} className="flex-1">
                  <div
                    className="flex aspect-[3/4] items-center justify-center rounded-2xl text-[10px] font-bold uppercase"
                    style={{
                      backgroundColor: i === 0 ? C.accentBlue : C.accentTeal,
                      color: C.textGray,
                    }}
                  >
                    Foto
                  </div>
                  <p className="mt-2 text-center text-[12px] font-bold" style={{ color: C.textDark }}>
                    {f}
                  </p>
                  <p className="text-center text-[12px]" style={{ color: C.textGray }}>
                    {(HISTORY.find(([d]) => d === f) || [, 0])[1].toFixed(1)} kg
                  </p>
                </div>
              ))}
            </div>

            <Card color={C.primaryYellow} className="mt-4">
              <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: C.textGray }}>
                Diferencia
              </p>
              <p className="mt-1 text-[32px] font-extrabold leading-none" style={{ color: C.textDark }}>
                {(
                  (HISTORY.find(([d]) => d === f2) || [, 0])[1] -
                  (HISTORY.find(([d]) => d === f1) || [, 0])[1]
                ).toFixed(1)}{' '}
                kg
              </p>
            </Card>
          </>
        )}
      </div>

      <nav
        className="flex shrink-0 items-center justify-around rounded-t-[24px] px-2 pb-6 pt-3"
        style={{ backgroundColor: C.surface, boxShadow: '0 -4px 20px rgba(0,0,0,0.06)' }}
      >
        {TABS.map(([id, label]) => {
          const activo = tab === id;
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="flex-1 rounded-full py-2 text-[11px] transition"
              style={{
                backgroundColor: activo ? C.primaryYellow : 'transparent',
                color: activo ? C.textDark : `${C.textGray}99`,
                fontWeight: activo ? 700 : 500,
              }}
            >
              {label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
