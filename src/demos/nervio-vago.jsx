/**
 * Demo web de "Nervio Vago" — réplica de la app Flutter original.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
import { useState } from 'react';
import { StatusBar } from '../components/PhoneFrame';

const C = {
  primary: '#C67C4E',
  deepBrown: '#623E26',
  cream: '#F9F2ED',
  sand: '#EDD6C8',
  surface: '#FFFFFF',
  textPrimary: '#313131',
  textSecondary: '#9B9B9B',
  divider: '#EDEDED',
  anchor: '#2F5D57',
};

const EXERCISES = [
  { id: 'm1', block: 'manana', title: 'Estirarse al despertar', hint: 'Nada más abrir los ojos, sin salir de la cama y boca arriba.' },
  { id: 'm2', block: 'manana', title: 'Sacudirse y darse golpecitos', hint: 'De pie, descalzo si puedes. Unos 2 minutos en total.' },
  { id: 'm3', block: 'manana', title: 'Agua tibia con limón y sal', hint: 'Antes de desayunar, a sorbos y sin prisa.' },
  { id: 'm4', block: 'manana', title: 'Hipoxia intermitente', hint: 'Respiración fuerte seguida de aguantar sin aire. 3 rondas.' },
  { id: 'm5', block: 'manana', title: 'Ducha de agua fría y caliente', hint: '3 ciclos al final de la ducha, terminando siempre en frío.' },
  { id: 'm6', block: 'manana', title: 'Gárgaras', hint: 'Justo después de lavarte los dientes. 2 minutos.' },
  { id: 'm7', block: 'manana', title: 'Caminar al sol', hint: '10-15 min dentro de las dos primeras horas tras levantarte.' },
  { id: 'd1', block: 'dia', title: 'Levantarse cada hora', hint: 'Cada hora que pases sentado. 2 minutos.' },
  { id: 'd2', block: 'dia', title: 'Cantar', hint: 'En el coche, la ducha o andando. 5 minutos bastan.' },
  { id: 'd3', block: 'dia', title: '10 respiraciones antes de comer', hint: 'Con el plato delante, antes del primer bocado.' },
  { id: 'd4', block: 'dia', title: 'Un minuto de «voooo»', hint: 'Sobre todo cuando notes que empiezas a irte.' },
  { id: 'n1', block: 'noche', title: 'Suspiros fisiológicos', hint: 'Dos entradas de aire seguidas y una salida muy larga. 5 min.' },
  { id: 'n2', block: 'noche', title: 'Estiramientos, rodillo y balanceo', hint: 'Tres partes seguidas, unos 5 minutos.' },
  { id: 'n3', block: 'noche', title: 'Masaje del nervio vago', hint: 'Cara, orejas, cuello y nuca. Nunca debe doler.' },
  { id: 'n4', block: 'noche', title: 'Gárgaras y respiración 4-7-8', hint: 'Lo último del día, ya en la cama.' },
];

const BLOCKS = [
  { id: 'manana', label: 'Mañana', sub: 'Activar y anclar · 12-15 min' },
  { id: 'dia', label: 'Día', sub: 'Cortar la quietud · 10 min' },
  { id: 'noche', label: 'Noche', sub: 'Bajar revoluciones · 20 min' },
];

const ANCHOR_STEPS = [
  { title: 'Agua fría en la cara', detail: 'Ve al baño y mójate la cara con agua lo más fría que salga. Aguanta unos segundos.' },
  { title: 'Suspiro fisiológico ×3', detail: 'Dos entradas de aire seguidas por la nariz y una salida muy larga por la boca. Tres veces.' },
  { title: 'Sacúdete y date golpecitos', detail: 'Rebota sobre los pies y date golpecitos rápidos en pecho, brazos y piernas.' },
  { title: 'Nombra 5, 4 y 3', detail: 'Cinco cosas que ves, cuatro que puedes tocar y tres que oyes. En voz alta si puedes.' },
];

function ProgressRing({ done, total }) {
  const pct = total ? done / total : 0;
  const r = 52;
  const circ = 2 * Math.PI * r;

  return (
    <div className="relative h-[136px] w-[136px] shrink-0">
      <svg width="136" height="136" viewBox="0 0 136 136" className="-rotate-90">
        <circle cx="68" cy="68" r={r} fill="none" stroke={C.sand} strokeWidth="10" />
        <circle
          cx="68"
          cy="68"
          r={r}
          fill="none"
          stroke={C.primary}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct)}
          style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.22,1,0.36,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[30px] font-extrabold leading-none" style={{ color: C.deepBrown }}>
          {done}
          <span className="text-base font-bold" style={{ color: C.textSecondary }}>
            /{total}
          </span>
        </span>
        <span className="mt-1 text-[11px] font-semibold" style={{ color: C.textSecondary }}>
          ejercicios
        </span>
      </div>
    </div>
  );
}

function ExerciseCard({ ex, done, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="flex w-full items-center gap-3 rounded-[20px] p-3.5 text-left transition active:scale-[0.98]"
      style={{
        backgroundColor: C.surface,
        boxShadow: '0 2px 10px rgba(49,49,49,0.06)',
        opacity: done ? 0.6 : 1,
      }}
    >
      <span
        className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border-2 transition"
        style={{
          borderColor: done ? C.primary : C.sand,
          backgroundColor: done ? C.primary : 'transparent',
        }}
      >
        {done && <span className="h-[9px] w-[9px] rounded-full bg-white" />}
      </span>
      <span className="min-w-0 flex-1">
        <span
          className="block text-[13.5px] font-bold leading-snug"
          style={{ color: C.textPrimary, textDecoration: done ? 'line-through' : 'none' }}
        >
          {ex.title}
        </span>
        <span className="mt-0.5 block text-[11px] leading-snug" style={{ color: C.textSecondary }}>
          {ex.hint}
        </span>
      </span>
    </button>
  );
}

export default function NervioVagoDemo() {
  const [tab, setTab] = useState('hoy');
  const [done, setDone] = useState(() => new Set(['m1', 'm2', 'm6']));
  const [openStep, setOpenStep] = useState(0);

  const toggle = (id) =>
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const streak = 12;
  const total = EXERCISES.length;
  const doneCount = done.size;
  const complete = doneCount === total;

  return (
    <div className="flex h-full flex-col" style={{ backgroundColor: C.cream }}>
      <StatusBar />

      <div className="no-scrollbar flex-1 overflow-y-auto">
        {tab === 'hoy' && (
          <div className="px-5 pb-6">
            <div className="pt-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: C.textSecondary }}>
                Lunes, 7 de septiembre
              </p>
              <h1 className="mt-1 text-[26px] font-extrabold leading-tight" style={{ color: C.deepBrown }}>
                Tu rutina de hoy
              </h1>
            </div>

            <div
              className="mt-5 flex items-center gap-4 rounded-[24px] p-4"
              style={{ backgroundColor: C.surface, boxShadow: '0 4px 20px rgba(49,49,49,0.07)' }}
            >
              <ProgressRing done={doneCount} total={total} />
              <div className="min-w-0 flex-1">
                <span className="text-[22px] font-extrabold" style={{ color: C.primary }}>
                  {streak}
                </span>
                <p className="text-[11.5px] font-semibold" style={{ color: C.textSecondary }}>
                  días seguidos
                </p>
                <p className="mt-2.5 text-[11.5px] leading-snug" style={{ color: C.textSecondary }}>
                  {complete
                    ? '¡Día completo! Nos vemos mañana.'
                    : `Te quedan ${total - doneCount} para cerrar el día.`}
                </p>
              </div>
            </div>

            {BLOCKS.map((b) => {
              const items = EXERCISES.filter((e) => e.block === b.id);
              const d = items.filter((e) => done.has(e.id)).length;
              return (
                <section key={b.id} className="mt-6">
                  <div className="flex items-center justify-between px-1">
                    <div>
                      <h2 className="text-[15px] font-extrabold" style={{ color: C.deepBrown }}>
                        {b.label}
                      </h2>
                      <p className="text-[10px]" style={{ color: C.textSecondary }}>
                        {b.sub}
                      </p>
                    </div>
                    <span
                      className="rounded-full px-2.5 py-1 text-[11px] font-bold"
                      style={{ backgroundColor: C.sand, color: C.deepBrown }}
                    >
                      {d}/{items.length}
                    </span>
                  </div>
                  <div className="mt-2.5 space-y-2">
                    {items.map((ex) => (
                      <ExerciseCard key={ex.id} ex={ex} done={done.has(ex.id)} onToggle={() => toggle(ex.id)} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        {tab === 'anclaje' && (
          <div className="px-5 pb-6">
            <div className="pt-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: C.anchor }}>
                Rescate rápido
              </p>
              <h1 className="mt-1 text-[26px] font-extrabold leading-tight" style={{ color: C.deepBrown }}>
                Anclaje en 4 pasos
              </h1>
              <p className="mt-2 text-[12px] leading-relaxed" style={{ color: C.textSecondary }}>
                Cuando la desconexión sube de golpe. Dos minutos, en este orden.
              </p>
            </div>

            <div className="mt-5 space-y-2.5">
              {ANCHOR_STEPS.map((s, i) => {
                const open = openStep === i;
                return (
                  <button
                    key={s.title}
                    onClick={() => setOpenStep(open ? -1 : i)}
                    className="w-full rounded-[20px] p-4 text-left transition"
                    style={{
                      backgroundColor: open ? C.anchor : C.surface,
                      boxShadow: '0 2px 12px rgba(49,49,49,0.07)',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-extrabold"
                        style={{
                          backgroundColor: open ? 'rgba(255,255,255,0.2)' : C.sand,
                          color: open ? '#fff' : C.deepBrown,
                        }}
                      >
                        {i + 1}
                      </span>
                      <span className="flex-1 text-[13.5px] font-bold" style={{ color: open ? '#fff' : C.textPrimary }}>
                        {s.title}
                      </span>
                    </div>
                    {open && (
                      <p className="mt-3 pl-11 text-[12px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>
                        {s.detail}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {tab === 'perfil' && (
          <div className="px-5 pb-6">
            <h1 className="pt-3 text-[26px] font-extrabold" style={{ color: C.deepBrown }}>
              Tu progreso
            </h1>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {[
                { v: streak, l: 'Racha actual', s: 'días' },
                { v: 28, l: 'Mejor racha', s: 'días' },
                { v: 341, l: 'Ejercicios', s: 'completados' },
                { v: '86%', l: 'Constancia', s: 'último mes' },
              ].map((k) => (
                <div
                  key={k.l}
                  className="rounded-[20px] p-4"
                  style={{ backgroundColor: C.surface, boxShadow: '0 2px 12px rgba(49,49,49,0.06)' }}
                >
                  <p className="text-[26px] font-extrabold leading-none" style={{ color: C.primary }}>
                    {k.v}
                  </p>
                  <p className="mt-1.5 text-[12px] font-bold" style={{ color: C.textPrimary }}>
                    {k.l}
                  </p>
                  <p className="text-[10px]" style={{ color: C.textSecondary }}>
                    {k.s}
                  </p>
                </div>
              ))}
            </div>

            <div
              className="mt-4 rounded-[20px] p-5"
              style={{ backgroundColor: C.surface, boxShadow: '0 2px 12px rgba(49,49,49,0.06)' }}
            >
              <p className="text-[13px] font-extrabold" style={{ color: C.deepBrown }}>
                Recordatorios
              </p>
              {[
                ['Bloque de mañana', '07:30'],
                ['Bloque de día', '13:00'],
                ['Bloque de noche', '22:30'],
              ].map(([l, t], i) => (
                <div
                  key={l}
                  className="flex items-center justify-between py-3"
                  style={{ borderTop: i ? `1px solid ${C.divider}` : 'none' }}
                >
                  <span className="text-[13px]" style={{ color: C.textPrimary }}>
                    {l}
                  </span>
                  <span className="text-[13px] font-bold" style={{ color: C.primary }}>
                    {t}
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-5 text-center text-[10px] leading-relaxed" style={{ color: C.textSecondary }}>
              Todos los datos se guardan en el dispositivo.
              <br />
              Sin cuentas, sin servidores, sin analítica.
            </p>
          </div>
        )}
      </div>

      <nav
        className="flex shrink-0 items-center justify-around px-2 pb-6 pt-2"
        style={{ backgroundColor: C.surface, borderTop: `1px solid ${C.divider}` }}
      >
        {[
          ['hoy', 'Hoy'],
          ['anclaje', 'Anclaje'],
          ['perfil', 'Perfil'],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className="flex-1 rounded-2xl py-2.5 text-[12px] font-bold transition"
            style={{
              backgroundColor: tab === id ? C.cream : 'transparent',
              color: tab === id ? C.primary : C.textSecondary,
            }}
          >
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}
