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

// Acento por bloque, igual que en la app.
const ACCENT = { manana: '#E0A03D', dia: '#C67C4E', noche: '#623E26' };

// El orden de esta lista ES el orden del día: la guía saca el primero que no
// esté hecho ni apartado.
const EXERCISES = [
  {
    id: 'm1',
    block: 'manana',
    title: 'Estirarse al despertar',
    cue: 'Al abrir los ojos',
    duration: '2 min',
    detail:
      'Nada más abrir los ojos, sin salir de la cama y boca arriba.\n\n1. Estira los brazos por encima de la cabeza y las piernas hacia abajo.\n2. Tensa todo el cuerpo a la vez y aguanta 5 segundos.\n3. Suelta de golpe y bosteza.\n4. Repite 2 o 3 veces.',
  },
  {
    id: 'm2',
    block: 'manana',
    title: 'Sacudirse y darse golpecitos',
    cue: 'Nada más levantarte',
    duration: '2 min',
    detail:
      'De pie, descalzo si puedes.\n\n1. Rebota sobre los pies con las rodillas sueltas y deja que el temblor suba por todo el cuerpo. 1 minuto.\n2. Date golpecitos rápidos: pecho y clavículas, brazos, piernas, cara y cabeza. 1 minuto.',
  },
  {
    id: 'm3',
    block: 'manana',
    title: 'Agua tibia con limón y sal',
    cue: 'Antes de desayunar',
    duration: '2 min',
    detail:
      '1. Llena un vaso de agua tibia, no caliente.\n2. Exprime dentro medio limón.\n3. Añade una pizca de sal.\n4. Bébelo despacio, a sorbos.',
  },
  {
    id: 'm4',
    block: 'manana',
    title: 'Hipoxia intermitente',
    cue: 'En ayunas',
    duration: '10 min',
    detail:
      'Siéntate o túmbate antes de empezar. Nunca de pie.\n\n1. Haz 30 respiraciones seguidas, hondas y sin pausa entre ellas.\n2. Suelta el aire y aguanta vacío hasta que el cuerpo te pida aire de verdad.\n3. Coge aire, retenlo 15 segundos y suéltalo.\n4. Respira normal durante un minuto.\n\n3 rondas en total.',
  },
  {
    id: 'm5',
    block: 'manana',
    title: 'Ducha de agua fría y caliente',
    cue: 'Al final de la ducha',
    duration: '2 min',
    detail:
      '1. Agua tan caliente como aguantes, 30 segundos.\n2. Fría del todo a la cabeza, la nuca y la espalda, 10-20 segundos.\n3. Repite el ciclo 3 veces.\n4. Termina siempre en frío.',
  },
  {
    id: 'm6',
    block: 'manana',
    title: 'Gárgaras',
    cue: 'Tras lavarte los dientes',
    duration: '2 min',
    detail:
      '1. Da un trago de agua sin tragarla y echa la cabeza hacia atrás.\n2. Haz gárgaras con fuerza hasta quedarte sin aire.\n3. Escupe y vuelve a empezar hasta completar los 2 minutos.',
  },
  {
    id: 'm7',
    block: 'manana',
    title: 'Caminar al sol',
    cue: 'Primeras 2 horas del día',
    duration: '15 min',
    detail:
      '1. Sal a la calle. Aunque esté nublado sirve.\n2. Camina a paso cómodo.\n3. Respira por la nariz, con la boca cerrada.\n4. Mira lo más lejos que puedas, con la vista ancha y sin fijarla en nada.',
  },
  {
    id: 'd1',
    block: 'dia',
    title: 'Levantarse cada hora',
    cue: 'Cada hora sentado',
    duration: '2 min',
    detail:
      '1. Levántate de la silla.\n2. Muévete hasta notar el corazón algo más rápido.\n3. Estírate: brazos arriba y hombros atrás.\n4. Asómate a una ventana y mira lejos 30 segundos.',
  },
  {
    id: 'd2',
    block: 'dia',
    title: 'Cantar',
    cue: 'Cuando vayas solo',
    duration: '5 min',
    detail:
      '1. Canta en voz alta y con ganas. Da igual afinar.\n2. Busca las partes graves y las notas largas.\n3. Pon una mano en el pecho para notar la vibración.',
  },
  {
    id: 'd3',
    block: 'dia',
    title: '10 respiraciones antes de comer',
    cue: 'Con el plato delante',
    duration: '2 min',
    detail:
      '1. Haz 10 respiraciones lentas por la nariz.\n2. Que soltar dure el doble que coger: cuenta 4 y 8.\n3. Come sin pantallas y mastica cada bocado hasta que se deshaga.',
  },
  {
    id: 'd4',
    block: 'dia',
    title: 'Un minuto de «voooo»',
    cue: 'Cuando notes que te vas',
    duration: '1 min',
    detail:
      '1. Coge aire por la nariz sin llenarte del todo.\n2. Al soltarlo, di «voooo» con voz grave y alargada.\n3. Pon la mano en el pecho o la garganta y busca la vibración.\n4. Repite durante un minuto.',
  },
  {
    id: 'n1',
    block: 'noche',
    title: 'Suspiros fisiológicos',
    cue: 'Al caer la tarde',
    duration: '5 min',
    detail:
      '1. Coge aire por la nariz hasta notar los pulmones llenos.\n2. Sin soltar, coge un segundo sorbito corto por encima del primero.\n3. Suelta todo por la boca, lento y largo, el doble de las dos entradas.\n4. Respira normal un par de veces y repite. 5 minutos.',
  },
  {
    id: 'n2',
    block: 'noche',
    title: 'Estiramientos, rodillo y balanceo',
    cue: 'Después de cenar',
    duration: '5 min',
    detail:
      'Estiramientos (2 min): brazos arriba, inclinación a cada lado y giros de tronco.\n\nRodillo (2 min): túmbate a lo largo sobre él, con la columna encima y los brazos en cruz.\n\nBalanceo (1 min): abraza las rodillas y rueda despacio sobre la espalda.',
  },
  {
    id: 'n3',
    block: 'noche',
    title: 'Masaje del nervio vago',
    cue: 'Antes de acostarte',
    duration: '8 min',
    detail:
      'Regla que manda sobre todo lo demás: nunca debe doler.\n\n1. Cara (1 min): círculos en mandíbula, boca, ojos y sienes.\n2. Orejas (1 min): pellizca todo el contorno y haz círculos en el hueco.\n3. Cuello (1 min): círculos suaves de la oreja a la clavícula, un lado cada vez.\n4. Nuca (5 min): dos pelotas de tenis en un calcetín, bajo el hueso de la nuca.',
  },
  {
    id: 'n4',
    block: 'noche',
    title: 'Gárgaras y respiración 4-7-8',
    cue: 'Ya en la cama',
    duration: '5 min',
    detail:
      '1. Gárgaras otra vez, 2 minutos, después de lavarte los dientes.\n2. Ya en la cama, con la luz apagada: coge aire contando 4, retén 7, suelta 8.\n3. Repite 4 veces y ya está.',
  },
];

const BLOCKS = [
  { id: 'manana', label: 'Mañana', sub: 'Activar y anclar' },
  { id: 'dia', label: 'Durante el día', sub: 'Mantener presencia' },
  { id: 'noche', label: 'Tarde-noche', sub: 'Integrar y dormir' },
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

function Chip({ children, color, filled }) {
  return (
    <span
      className="rounded-[10px] px-2 py-1 text-[10px] font-bold"
      style={{
        backgroundColor: filled ? color : C.cream,
        color: filled ? '#fff' : C.textSecondary,
      }}
    >
      {children}
    </span>
  );
}

/** Nodo + tramo de línea del carril izquierdo. */
function Rail({ number, status, accent, isLast }) {
  const done = status === 'done';
  const active = status === 'current';

  return (
    <div className="flex w-[30px] shrink-0 flex-col items-center">
      <div style={{ height: active ? 14 : 9 }} />
      <span
        className="flex shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
        style={{
          width: active ? 28 : 23,
          height: active ? 28 : 23,
          backgroundColor: done || active ? accent : C.surface,
          border: `2px solid ${done || active ? accent : C.divider}`,
          color: active ? '#fff' : C.textSecondary,
          boxShadow: active ? `0 0 0 4px ${accent}33` : 'none',
        }}
      >
        {done ? '✓' : status === 'skipped' ? '···' : number}
      </span>
      {!isLast && (
        <span
          className="my-1 w-[2px] flex-1"
          style={{ backgroundColor: done ? `${accent}66` : C.divider }}
        />
      )}
    </div>
  );
}

function CurrentCard({ ex, number, total, accent, retaking, onDone, onSkip }) {
  return (
    <div
      className="rounded-[18px] p-4"
      style={{
        backgroundColor: C.surface,
        border: `1.5px solid ${accent}59`,
        boxShadow: '0 6px 22px rgba(49,49,49,0.10)',
      }}
    >
      <div className="flex flex-wrap items-center gap-1.5">
        <Chip color={accent} filled>
          {retaking ? 'Lo dejaste antes' : `Paso ${number} de ${total}`}
        </Chip>
        <Chip>{ex.cue}</Chip>
        <Chip>⏱ {ex.duration}</Chip>
      </div>

      <h3 className="mt-3 text-[17px] font-extrabold leading-tight" style={{ color: C.textPrimary }}>
        {ex.title}
      </h3>

      <div className="my-3 h-px" style={{ backgroundColor: C.divider }} />

      <p className="whitespace-pre-line text-[12px] leading-relaxed" style={{ color: C.textPrimary }}>
        {ex.detail}
      </p>

      <button
        onClick={onDone}
        className="mt-4 w-full rounded-[14px] py-3 text-[13px] font-bold text-white transition active:scale-[0.98]"
        style={{ backgroundColor: accent }}
      >
        ✓ Hecho, siguiente
      </button>

      {!retaking && (
        <button
          onClick={onSkip}
          className="mt-1 w-full py-2 text-[11.5px] font-semibold"
          style={{ color: C.textSecondary }}
        >
          Ahora no puedo, lo dejo para luego
        </button>
      )}
    </div>
  );
}

function TimelineStep({ ex, number, total, status, isLast, open, retaking, onDone, onSkip, onUndo, onUnskip, onToggle }) {
  const accent = ACCENT[ex.block];

  return (
    <div className="flex items-stretch gap-2.5">
      <Rail number={number} status={status} accent={accent} isLast={isLast} />

      <div className="min-w-0 flex-1" style={{ paddingBottom: isLast ? 0 : 8 }}>
        {status === 'current' && (
          <CurrentCard
            ex={ex}
            number={number}
            total={total}
            accent={accent}
            retaking={retaking}
            onDone={onDone}
            onSkip={onSkip}
          />
        )}

        {status === 'done' && (
          <div className="overflow-hidden rounded-[12px]" style={{ backgroundColor: C.surface }}>
            <button onClick={onToggle} className="flex w-full items-center gap-2 px-3 py-2.5 text-left">
              <span
                className="min-w-0 flex-1 text-[12.5px] font-bold"
                style={{ color: C.textSecondary, textDecoration: 'line-through' }}
              >
                {ex.title}
              </span>
              <span className="text-[11px]" style={{ color: C.textSecondary }}>
                {open ? '▲' : '▼'}
              </span>
            </button>
            {open && (
              <div className="px-3 pb-3">
                <div className="mb-2 h-px" style={{ backgroundColor: C.divider }} />
                <p className="whitespace-pre-line text-[11.5px] leading-relaxed" style={{ color: C.textPrimary }}>
                  {ex.detail}
                </p>
                <button onClick={onUndo} className="mt-2 text-[11px] font-bold" style={{ color: C.textSecondary }}>
                  ↺ Desmarcar
                </button>
              </div>
            )}
          </div>
        )}

        {status === 'skipped' && (
          <button onClick={onUnskip} className="flex w-full items-center gap-2 px-1 py-2.5 text-left">
            <span className="min-w-0 flex-1 text-[12.5px] font-semibold" style={{ color: C.textSecondary }}>
              {ex.title}
            </span>
            <span className="text-[10px] font-bold" style={{ color: C.textSecondary }}>
              Lo dejaste ↺
            </span>
          </button>
        )}

        {status === 'pending' && (
          <div className="flex items-center gap-2 px-1 py-2.5">
            <span className="min-w-0 flex-1 text-[12.5px] font-semibold" style={{ color: C.textSecondary }}>
              {ex.title}
            </span>
            <span className="shrink-0 text-[10px]" style={{ color: C.textSecondary }}>
              {ex.cue}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function NervioVagoDemo() {
  const [tab, setTab] = useState('hoy');
  const [done, setDone] = useState(() => new Set(['m1', 'm2', 'm3']));
  const [skipped, setSkipped] = useState(() => new Set());
  const [openDone, setOpenDone] = useState(null);
  const [openStep, setOpenStep] = useState(0);

  const total = EXERCISES.length;
  const doneCount = done.size;
  const streak = 12;

  // El actual: el primero que no está hecho ni apartado. Cuando se agotan,
  // vuelven a ofrecerse los apartados, también en orden.
  const current =
    EXERCISES.find((e) => !done.has(e.id) && !skipped.has(e.id)) ??
    EXERCISES.find((e) => !done.has(e.id)) ??
    null;
  const retaking = current != null && skipped.has(current.id);
  const currentStep = current ? EXERCISES.indexOf(current) + 1 : 0;
  const skippedPending = EXERCISES.filter((e) => skipped.has(e.id) && !done.has(e.id)).length;

  const markDone = (id) => {
    setDone((prev) => new Set(prev).add(id));
    setSkipped((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };
  const undo = (id) => {
    setOpenDone(null);
    setDone((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };
  const skip = (id) => setSkipped((prev) => new Set(prev).add(id));
  const unskip = (id) =>
    setSkipped((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });

  const banner = current
    ? retaking
      ? {
          title: 'Vuelta a los que dejaste',
          sub:
            skippedPending === 1
              ? 'Queda 1 que apartaste. Este es el momento.'
              : `Quedan ${skippedPending} que apartaste. Uno a uno, igual que antes.`,
        }
      : doneCount === 0 && skippedPending === 0
        ? { title: 'Empezamos', sub: `Paso 1 de ${total}. Ve bajando según los hagas.` }
        : {
            title: `Vas por el ${currentStep} de ${total}`,
            sub:
              skippedPending > 0
                ? `Con ${skippedPending} apartado${skippedPending === 1 ? '' : 's'} para el final.`
                : 'Solo tienes que mirar la tarjeta abierta.',
          }
    : { title: 'Día completo', sub: `${streak} días seguidos. La constancia es el mecanismo.` };

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
                <p className="mt-2.5 text-[12px] font-bold leading-snug" style={{ color: C.textPrimary }}>
                  {banner.title}
                </p>
                <p className="mt-0.5 text-[11px] leading-snug" style={{ color: C.textSecondary }}>
                  {banner.sub}
                </p>
              </div>
            </div>

            <div className="mt-6">
              {EXERCISES.map((ex, i) => {
                const startsBlock = i === 0 || EXERCISES[i - 1].block !== ex.block;
                const b = BLOCKS.find((x) => x.id === ex.block);
                const isCurrent = current != null && current.id === ex.id;
                const status = done.has(ex.id)
                  ? 'done'
                  : isCurrent
                    ? 'current'
                    : skipped.has(ex.id)
                      ? 'skipped'
                      : 'pending';

                return (
                  <div key={ex.id}>
                    {startsBlock && (
                      <div className={`flex items-center gap-2.5 pb-2.5 ${i === 0 ? '' : 'pt-3'}`}>
                        <span
                          className="h-[30px] w-[30px] shrink-0 rounded-[9px]"
                          style={{ backgroundColor: `${ACCENT[ex.block]}29` }}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-[14px] font-extrabold" style={{ color: C.deepBrown }}>
                            {b.label}
                          </p>
                          <p className="text-[10px]" style={{ color: C.textSecondary }}>
                            {b.sub}
                          </p>
                        </div>
                        <span
                          className="rounded-full px-2.5 py-1 text-[11px] font-bold"
                          style={{ backgroundColor: `${ACCENT[ex.block]}29`, color: ACCENT[ex.block] }}
                        >
                          {EXERCISES.filter((e) => e.block === ex.block && done.has(e.id)).length}/
                          {EXERCISES.filter((e) => e.block === ex.block).length}
                        </span>
                      </div>
                    )}

                    <TimelineStep
                      ex={ex}
                      number={i + 1}
                      total={total}
                      status={status}
                      isLast={i === EXERCISES.length - 1}
                      open={openDone === ex.id}
                      retaking={isCurrent && retaking}
                      onDone={() => markDone(ex.id)}
                      onSkip={() => skip(ex.id)}
                      onUndo={() => undo(ex.id)}
                      onUnskip={() => unskip(ex.id)}
                      onToggle={() => setOpenDone(openDone === ex.id ? null : ex.id)}
                    />
                  </div>
                );
              })}
            </div>

            {!current && (
              <div className="mt-5 rounded-[20px] p-5 text-center" style={{ backgroundColor: C.sand }}>
                <p className="text-[13px] font-extrabold" style={{ color: C.deepBrown }}>
                  Se acabó el recorrido de hoy
                </p>
                <p className="mt-1 text-[11px]" style={{ color: C.textSecondary }}>
                  Mañana vuelve a empezar por el paso 1.
                </p>
              </div>
            )}
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
