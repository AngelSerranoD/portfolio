/**
 * Demo web de "InfoMap" — réplica de la interfaz original.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
import { useState } from 'react';
import { StatusBar } from '../components/PhoneFrame';

const C = {
  indigo: '#345DA7',
  blue: '#3B8AC4',
  sky: '#4BB4DE',
  sand: '#EFDBCB',
  ink900: '#16293D',
  ink800: '#1B3049',
  ink700: '#22354B',
  ink600: '#2C4260',
  text: '#F4F7FB',
  textDim: '#B6C6D8',
  textMute: '#8399B1',
  onSand: '#1B3049',
};

const CATEGORIAS = ['Cultura', 'Comida', 'Parques', 'Alojamiento', 'Tiendas', 'Servicios'];

/** Coordenadas en porcentaje sobre el lienzo del mapa. */
const SITIOS = [
  {
    id: 1, x: 30, y: 32, cat: 'Cultura', nombre: 'Palacio del Infantado',
    tipo: 'Museo · Palacio gótico',
    wiki: 'Palacio construido a finales del siglo XV por encargo del segundo duque del Infantado. Su fachada de puntas de diamante y su patio de dos alturas son el ejemplo más reconocible del gótico isabelino civil.',
    horario: 'Mar-Dom 10:00-14:00', tel: '+34 949 21 33 01', dist: '240 m',
  },
  {
    id: 2, x: 62, y: 46, cat: 'Parques', nombre: 'Parque de la Concordia',
    tipo: 'Parque urbano',
    wiki: 'Principal zona verde del casco urbano, abierta en 1858. Conserva un templete de música de hierro fundido y varios ejemplares de cedro del Himalaya de gran porte.',
    horario: 'Abierto 24 h', tel: '—', dist: '520 m',
  },
  {
    id: 3, x: 46, y: 66, cat: 'Comida', nombre: 'Asador Los Arcos',
    tipo: 'Restaurante · Castellano',
    wiki: 'Sin artículo de Wikipedia. Los datos mostrados proceden de OpenStreetMap.',
    horario: 'Lun-Sáb 13:00-16:00, 20:30-23:30', tel: '+34 949 22 18 40', dist: '310 m',
  },
  {
    id: 4, x: 68, y: 34, cat: 'Cultura', nombre: 'Concatedral de Santa María',
    tipo: 'Iglesia · Mudéjar',
    wiki: 'Templo de origen mudéjar del siglo XIV, levantado sobre una antigua mezquita. Sus tres portadas de arco apuntado con alfiz son el rasgo mudéjar mejor conservado del conjunto.',
    horario: 'Lun-Dom 09:00-13:00', tel: '+34 949 21 15 27', dist: '680 m',
  },
];

export default function InfoMapDemo() {
  const [sel, setSel] = useState(null);
  const [cats, setCats] = useState(() => new Set(CATEGORIAS));
  const [seguimiento, setSeguimiento] = useState(true);

  const toggleCat = (c) =>
    setCats((prev) => {
      const s = new Set(prev);
      if (s.has(c)) s.delete(c);
      else s.add(c);
      return s;
    });

  const visibles = SITIOS.filter((s) => cats.has(s.cat));

  return (
    <div className="relative flex h-full flex-col" style={{ backgroundColor: C.ink900, color: C.text }}>
      <StatusBar dark />

      {/* Barra superior */}
      <div className="shrink-0 px-4 pb-2">
        <div
          className="flex h-10 items-center rounded-full px-4 text-[13px]"
          style={{ backgroundColor: C.ink700, color: C.textMute }}
        >
          Buscar sitios o direcciones
        </div>
        <div className="no-scrollbar mt-2.5 flex gap-2 overflow-x-auto pb-1">
          {CATEGORIAS.map((c) => {
            const on = cats.has(c);
            return (
              <button
                key={c}
                onClick={() => toggleCat(c)}
                className="shrink-0 rounded-full px-3 py-1.5 text-[11.5px] font-semibold transition"
                style={{
                  backgroundColor: on ? C.sky : C.ink700,
                  color: on ? C.onSand : C.textDim,
                }}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lienzo del mapa */}
      <button
        onClick={() => setSel(null)}
        className="relative flex-1 cursor-default overflow-hidden text-left"
        style={{ backgroundColor: C.ink800 }}
        aria-label="Mapa"
      >
        {/* Retícula de calles */}
        <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            <pattern id="im-grid" width="46" height="46" patternUnits="userSpaceOnUse">
              <path d="M46 0H0V46" fill="none" stroke={C.ink600} strokeWidth="1.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#im-grid)" />
          <path
            d="M-10 210 Q110 150 180 250 T400 220"
            fill="none"
            stroke={C.ink600}
            strokeWidth="14"
            strokeLinecap="round"
          />
        </svg>

        {/* Posición del usuario */}
        <span
          className="absolute h-16 w-16 rounded-full"
          style={{
            left: '48%',
            top: '52%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: `${C.sky}22`,
          }}
        />
        <span
          className="absolute h-3.5 w-3.5 rounded-full ring-2"
          style={{
            left: '48%',
            top: '52%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: C.sky,
            boxShadow: `0 0 0 2px ${C.ink800}`,
          }}
        />

        {/* Chinchetas */}
        {visibles.map((s) => {
          const activo = sel?.id === s.id;
          return (
            <span
              key={s.id}
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                setSel(s);
              }}
              onKeyDown={(e) => e.key === 'Enter' && setSel(s)}
              className="absolute flex cursor-pointer flex-col items-center transition-transform"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                transform: `translate(-50%, -100%) scale(${activo ? 1.15 : 1})`,
              }}
            >
              <span
                className="rounded-full px-2.5 py-1 text-[10.5px] font-bold shadow-lg"
                style={{
                  backgroundColor: activo ? C.sand : C.indigo,
                  color: activo ? C.onSand : C.text,
                }}
              >
                {s.nombre.split(' ')[0]}
              </span>
              <span
                className="h-2 w-2 -translate-y-1 rotate-45"
                style={{ backgroundColor: activo ? C.sand : C.indigo }}
              />
            </span>
          );
        })}

        {/* Control de seguimiento */}
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            setSeguimiento((v) => !v);
          }}
          onKeyDown={(e) => e.key === 'Enter' && setSeguimiento((v) => !v)}
          className="absolute right-3 top-3 cursor-pointer rounded-full px-3 py-2 text-[11px] font-bold"
          style={{
            backgroundColor: seguimiento ? C.sky : C.ink700,
            color: seguimiento ? C.onSand : C.textDim,
          }}
        >
          {seguimiento ? 'Siguiendo' : 'Libre'}
        </span>
      </button>

      {/* Hoja inferior */}
      <div
        className="shrink-0 rounded-t-[22px] px-5 pb-6 pt-4"
        style={{
          backgroundColor: C.ink700,
          boxShadow: '0 -10px 40px rgba(6,16,27,0.55)',
          maxHeight: '54%',
          overflowY: 'auto',
        }}
      >
        <span
          className="mx-auto mb-3 block h-1 w-10 rounded-full"
          style={{ backgroundColor: C.ink600 }}
        />

        {sel ? (
          <>
            <p className="text-[17px] font-extrabold leading-tight">{sel.nombre}</p>
            <p className="mt-0.5 text-[11.5px]" style={{ color: C.sky }}>
              {sel.tipo} · {sel.dist}
            </p>
            <p className="mt-3 text-[12px] leading-relaxed" style={{ color: C.textDim }}>
              {sel.wiki}
            </p>
            <div className="mt-3 space-y-1.5 text-[11.5px]" style={{ color: C.textMute }}>
              <p>Horario · {sel.horario}</p>
              <p>Teléfono · {sel.tel}</p>
            </div>
            <div className="mt-4 flex gap-2">
              <span
                className="flex-1 rounded-full py-2.5 text-center text-[12px] font-bold"
                style={{ backgroundColor: C.sand, color: C.onSand }}
              >
                Cómo llegar
              </span>
              <span
                className="flex-1 rounded-full py-2.5 text-center text-[12px] font-bold"
                style={{ backgroundColor: C.ink600, color: C.text }}
              >
                Guardar
              </span>
            </div>
          </>
        ) : (
          <>
            <p className="text-[13px] font-extrabold">
              {visibles.length} sitios alrededor
            </p>
            <p className="mt-1 text-[11.5px]" style={{ color: C.textMute }}>
              Toca una chincheta para ver su ficha
            </p>
            <div className="mt-3 space-y-2">
              {visibles.slice(0, 3).map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSel(s)}
                  className="flex w-full items-center justify-between rounded-[14px] px-3.5 py-3 text-left"
                  style={{ backgroundColor: C.ink600 }}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-[12.5px] font-bold">{s.nombre}</span>
                    <span className="block text-[10.5px]" style={{ color: C.textMute }}>
                      {s.tipo}
                    </span>
                  </span>
                  <span className="shrink-0 text-[11px] font-bold" style={{ color: C.sky }}>
                    {s.dist}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
