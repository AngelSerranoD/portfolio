/**
 * Demo web de "RotateBooth" — réplica de la PWA original.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
import { useState } from 'react';
import { StatusBar } from '../components/PhoneFrame';

const C = {
  bg: '#000000',
  surface: 'rgba(255,255,255,0.06)',
  surface2: 'rgba(255,255,255,0.11)',
  hairline: 'rgba(255,255,255,0.13)',
  text: '#F2F2F7',
  text2: 'rgba(235,235,245,0.62)',
  text3: 'rgba(235,235,245,0.34)',
  accent: '#5E8AD8',
  accentHi: '#8FB0F0',
  tile: '#101014',
};

/** Fotos simuladas: cada una con su relación de aspecto y su tono. */
const FOTOS = [
  { id: 1, w: 3, h: 4, tono: 32 },
  { id: 2, w: 4, h: 3, tono: 48 },
  { id: 3, w: 3, h: 4, tono: 22 },
  { id: 4, w: 3, h: 4, tono: 56 },
  { id: 5, w: 4, h: 3, tono: 38 },
  { id: 6, w: 3, h: 4, tono: 44 },
];

const inicial = () =>
  Object.fromEntries(FOTOS.map((f) => [f.id, { deg: 0, flip: false }]));

export default function RotateBoothDemo() {
  const [estado, setEstado] = useState(inicial);
  const [sel, setSel] = useState(() => new Set(FOTOS.map((f) => f.id)));
  const [historial, setHistorial] = useState([]);
  const [modo, setModo] = useState('lossless');
  const [aviso, setAviso] = useState(null);

  const aplicar = (op) => {
    setHistorial((h) => [...h, estado]);
    setEstado((prev) => {
      const next = { ...prev };
      for (const id of sel) {
        const p = { ...next[id] };
        if (op === 'izq') p.deg = (p.deg + 270) % 360;
        if (op === 'der') p.deg = (p.deg + 90) % 360;
        if (op === 'inv') p.deg = (p.deg + 180) % 360;
        if (op === 'esp') p.flip = !p.flip;
        next[id] = p;
      }
      return next;
    });
  };

  const deshacer = () => {
    if (!historial.length) return;
    setEstado(historial[historial.length - 1]);
    setHistorial((h) => h.slice(0, -1));
  };

  const guardar = () => {
    setAviso(
      modo === 'lossless'
        ? 'Reescrita la etiqueta de orientación. Ni un píxel tocado.'
        : 'Recomprimidas con los datos EXIF del original.'
    );
    setTimeout(() => setAviso(null), 2600);
  };

  const toggleSel = (id) =>
    setSel((prev) => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id);
      else s.add(id);
      return s;
    });

  const movidas = Object.entries(estado).filter(
    ([, p]) => p.deg !== 0 || p.flip
  ).length;

  return (
    <div className="flex h-full flex-col" style={{ backgroundColor: C.bg, color: C.text }}>
      <StatusBar dark />

      {/* Cabecera */}
      <div className="flex shrink-0 items-baseline justify-between px-5 pb-3 pt-1">
        <div>
          <p className="text-[18px] font-extrabold leading-none">RotateBooth</p>
          <p className="mt-1 text-[10.5px]" style={{ color: C.text2 }}>
            {sel.size} de {FOTOS.length} seleccionadas · {movidas} giradas
          </p>
        </div>
        <span className="text-[12px] font-semibold" style={{ color: C.accent }}>
          Añadir
        </span>
      </div>

      {/* Cuadrícula de miniaturas */}
      <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-3">
        <div className="grid grid-cols-3 gap-2">
          {FOTOS.map((f) => {
            const p = estado[f.id];
            const marcada = sel.has(f.id);
            return (
              <button
                key={f.id}
                onClick={() => toggleSel(f.id)}
                className="relative aspect-square overflow-hidden rounded-[14px] transition"
                style={{
                  backgroundColor: C.tile,
                  outline: marcada ? `2px solid ${C.accent}` : `1px solid ${C.hairline}`,
                  outlineOffset: marcada ? '-2px' : '-1px',
                }}
              >
                {/* La "foto": un rectángulo que rota como lo haría la imagen */}
                <span
                  className="absolute left-1/2 top-1/2 block transition-transform duration-300"
                  style={{
                    width: `${f.w * 13}px`,
                    height: `${f.h * 13}px`,
                    backgroundColor: `hsl(215 22% ${f.tono}%)`,
                    transform: `translate(-50%,-50%) rotate(${p.deg}deg) scaleX(${p.flip ? -1 : 1})`,
                    borderRadius: '3px',
                  }}
                >
                  <span
                    className="absolute bottom-1 left-1 text-[8px] font-bold"
                    style={{ color: 'rgba(255,255,255,0.55)' }}
                  >
                    {f.id}
                  </span>
                </span>

                {marcada && (
                  <span
                    className="absolute right-1.5 top-1.5 h-3 w-3 rounded-full"
                    style={{ backgroundColor: C.accent }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Selector de modo de guardado */}
        <div className="mt-4 rounded-[16px] p-3" style={{ backgroundColor: C.surface }}>
          <p className="text-[10.5px] font-bold uppercase tracking-wider" style={{ color: C.text3 }}>
            Modo de guardado
          </p>
          <div className="mt-2 flex gap-1.5">
            {[
              ['lossless', 'Sin pérdida'],
              ['reencode', 'Recomprimir'],
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setModo(id)}
                className="flex-1 rounded-full py-2 text-[11.5px] font-semibold transition"
                style={{
                  backgroundColor: modo === id ? C.accent : C.surface2,
                  color: modo === id ? '#fff' : C.text2,
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="mt-2.5 text-[10.5px] leading-relaxed" style={{ color: C.text3 }}>
            {modo === 'lossless'
              ? 'Solo reescribe la etiqueta de orientación del JPEG: instantáneo y sin perder ni un píxel.'
              : 'Vuelve a generar el JPEG con los píxeles ya girados y le copia los datos EXIF del original.'}
          </p>
        </div>

        {aviso && (
          <div
            className="mt-3 rounded-[14px] px-4 py-3 text-[11.5px] leading-relaxed"
            style={{ backgroundColor: C.surface2, color: C.accentHi }}
          >
            {aviso}
          </div>
        )}
      </div>

      {/* Barra de acciones */}
      <div
        className="shrink-0 px-4 pb-6 pt-3"
        style={{ borderTop: `1px solid ${C.hairline}`, backgroundColor: 'rgba(0,0,0,0.6)' }}
      >
        <div className="grid grid-cols-4 gap-1.5">
          {[
            ['izq', 'Izquierda'],
            ['der', 'Derecha'],
            ['inv', 'Del revés'],
            ['esp', 'Espejo'],
          ].map(([op, label]) => (
            <button
              key={op}
              onClick={() => aplicar(op)}
              disabled={sel.size === 0}
              className="rounded-[14px] py-2.5 text-[10.5px] font-semibold transition active:scale-95"
              style={{
                backgroundColor: C.surface,
                color: sel.size === 0 ? C.text3 : C.text,
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-2 flex gap-1.5">
          <button
            onClick={deshacer}
            disabled={!historial.length}
            className="rounded-full px-5 py-2.5 text-[12px] font-semibold transition"
            style={{
              backgroundColor: C.surface,
              color: historial.length ? C.text : C.text3,
            }}
          >
            Deshacer
          </button>
          <button
            onClick={guardar}
            className="flex-1 rounded-full py-2.5 text-[12.5px] font-extrabold transition active:scale-[0.98]"
            style={{ backgroundColor: C.accent, color: '#fff' }}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
