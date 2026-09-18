/**
 * Demo de PocketPC — el PC simulado: dos monitores con su escritorio.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 *
 * El escritorio se pinta a su tamaño real (1920×1080 o 1080×1920) y el visor
 * lo escala, igual que la app pinta el vídeo del PC a resolución completa. Los
 * clics se resuelven con geometría sobre el modelo, no con el DOM: así el
 * «ratón» del PC no depende de lo que haya encima en la interfaz del móvil.
 */

export const MONITORES = [
  { id: 'vertical', nombre: '1 · Monitor vertical', ancho: 1080, alto: 1920, real: '1080×1920', principal: false },
  { id: 'principal', nombre: '2 · Monitor principal', ancho: 1920, alto: 1080, real: '2560×1440', principal: true },
];

const BARRA = 64;   // barra de tareas
const ICONOS = [
  { id: 'notas', nombre: 'Notas.txt', x: 28, y: 28 },
  { id: 'documentos', nombre: 'Documentos', x: 28, y: 168 },
  { id: 'papelera', nombre: 'Papelera', x: 28, y: 308 },
];
const TAM_ICONO = { w: 120, h: 124 };
const VENTANAS = {
  notas: { titulo: 'Notas.txt — Bloc de notas', x: 470, y: 140, w: 700, h: 460 },
  documentos: { titulo: 'Documentos', x: 780, y: 250, w: 700, h: 430 },
  papelera: { titulo: 'Papelera de reciclaje', x: 940, y: 340, w: 540, h: 300 },
};
const TITULO = 48;
const INICIO = { x: 1920 / 2 - 140, y: 1080 - BARRA + 8, w: 48, h: 48 };
const MENU_INICIO = { x: 660, y: 1080 - BARRA - 560, w: 600, h: 548 };

export const estadoInicial = () => ({
  seleccionado: null,
  ventanas: [],          // orden de apilado: la última está encima y tiene el foco
  inicio: false,
  notas: 'Lista para el finde:\n- Revisar el portfolio\n- ',
});

const dentro = (px, py, r) => px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h;

/** Un clic del ratón del PC en (px, py), en píxeles del monitor. */
export function clic(estado, monitor, px, py, doble) {
  if (monitor !== 'principal') return estado;
  if (estado.inicio && !dentro(px, py, MENU_INICIO) && !dentro(px, py, INICIO)) {
    return { ...estado, inicio: false };
  }
  if (dentro(px, py, INICIO)) return { ...estado, inicio: !estado.inicio };

  for (let i = estado.ventanas.length - 1; i >= 0; i--) {
    const id = estado.ventanas[i];
    const v = VENTANAS[id];
    if (!dentro(px, py, v)) continue;
    const enCerrar = py <= v.y + TITULO && px >= v.x + v.w - 64;
    const resto = estado.ventanas.filter((x) => x !== id);
    return { ...estado, ventanas: enCerrar ? resto : [...resto, id] };
  }
  const icono = ICONOS.find((c) => dentro(px, py, { ...c, ...TAM_ICONO }));
  if (icono && doble) {
    return { ...estado, seleccionado: icono.id, ventanas: [...estado.ventanas.filter((x) => x !== icono.id), icono.id] };
  }
  return { ...estado, seleccionado: icono?.id ?? null };
}

/** Una tecla del móvil: solo la recibe la ventana que tiene el foco. */
export function teclear(estado, tecla) {
  if (estado.ventanas.at(-1) !== 'notas') return estado;
  let t = estado.notas;
  if (tecla === 'Backspace') t = t.slice(0, -1);
  else if (tecla === 'Enter') t += '\n';
  else if (tecla.length === 1) t += tecla;
  else return estado;
  return { ...estado, notas: t.slice(-400) };
}

/* ─────────────────────────── Pintado ─────────────────────────── */

const LETRA = '"Segoe UI Variable Text", "Segoe UI", system-ui, sans-serif';

export function Escritorio({ monitor, estado, cursor }) {
  const m = MONITORES.find((x) => x.id === monitor);
  return (
    <div style={{ position: 'relative', width: m.ancho, height: m.alto, overflow: 'hidden', fontFamily: LETRA }}>
      {monitor === 'principal' ? <Principal estado={estado} /> : <Vertical />}
      {cursor && <Puntero x={cursor.x * m.ancho} y={cursor.y * m.alto} />}
    </div>
  );
}

function Puntero({ x, y }) {
  return (
    <svg width="34" height="50" viewBox="0 0 17 25" style={{ position: 'absolute', left: x, top: y, filter: 'drop-shadow(0 2px 3px rgba(0,0,0,.45))' }}>
      <path d="M1 1 L1 20 L6 15.5 L9.5 23.5 L12.5 22 L9 14.5 L15.5 14.5 Z" fill="#fff" stroke="#111" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

function Principal({ estado }) {
  return (
    <>
      <div
        style={{
          position: 'absolute', inset: 0,
          background:
            'radial-gradient(900px 600px at 70% 60%, rgba(143,196,255,.55), transparent 60%),' +
            'radial-gradient(700px 500px at 25% 25%, rgba(62,143,214,.5), transparent 65%),' +
            'linear-gradient(160deg, #0B2A55 0%, #1E5A9C 55%, #7FC4F2 100%)',
        }}
      />
      {ICONOS.map((c) => (
        <div
          key={c.id}
          style={{
            position: 'absolute', left: c.x, top: c.y, width: TAM_ICONO.w, height: TAM_ICONO.h,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, paddingTop: 10, borderRadius: 8,
            background: estado.seleccionado === c.id ? 'rgba(255,255,255,.22)' : 'transparent',
            outline: estado.seleccionado === c.id ? '2px solid rgba(255,255,255,.45)' : 'none',
          }}
        >
          <DibujoIcono id={c.id} />
          <span style={{ color: '#fff', fontSize: 20, textShadow: '0 1px 3px rgba(0,0,0,.8)' }}>{c.nombre}</span>
        </div>
      ))}
      {estado.ventanas.map((id, i) => (
        <Ventana key={id} id={id} foco={i === estado.ventanas.length - 1} estado={estado} />
      ))}
      {estado.inicio && <MenuInicio />}
      <BarraTareas estado={estado} />
    </>
  );
}

function DibujoIcono({ id }) {
  if (id === 'notas') {
    return (
      <div style={{ width: 52, height: 64, background: '#fff', borderRadius: 4, boxShadow: '0 2px 6px rgba(0,0,0,.35)', padding: '14px 10px' }}>
        {[1, 2, 3, 4].map((n) => <div key={n} style={{ height: 4, background: '#9AB4CF', margin: '0 0 7px', width: n === 4 ? '60%' : '100%' }} />)}
      </div>
    );
  }
  if (id === 'documentos') {
    return (
      <div style={{ position: 'relative', width: 70, height: 56 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: 32, height: 14, background: '#E8B64C', borderRadius: '4px 4px 0 0' }} />
        <div style={{ position: 'absolute', left: 0, top: 8, width: 70, height: 48, background: '#F7C95C', borderRadius: 4, boxShadow: '0 2px 6px rgba(0,0,0,.35)' }} />
      </div>
    );
  }
  return (
    <div style={{ position: 'relative', width: 50, height: 62 }}>
      <div style={{ position: 'absolute', left: 4, top: 0, width: 42, height: 7, background: '#DCE7F2', borderRadius: 3 }} />
      <div style={{ position: 'absolute', left: 8, top: 10, width: 34, height: 52, background: 'rgba(220,231,242,.9)', borderRadius: '0 0 6px 6px', boxShadow: '0 2px 6px rgba(0,0,0,.35)' }} />
    </div>
  );
}

function Ventana({ id, foco, estado }) {
  const v = VENTANAS[id];
  return (
    <div
      style={{
        position: 'absolute', left: v.x, top: v.y, width: v.w, height: v.h, background: '#fff', borderRadius: 12,
        boxShadow: foco ? '0 24px 60px rgba(0,0,0,.45)' : '0 10px 30px rgba(0,0,0,.3)', overflow: 'hidden',
        border: '1px solid rgba(0,0,0,.15)',
      }}
    >
      <div style={{ height: TITULO, display: 'flex', alignItems: 'center', background: foco ? '#F3F6FA' : '#FAFAFA', borderBottom: '1px solid #E3E8EE', fontSize: 20, color: '#222' }}>
        <span style={{ flex: 1, paddingLeft: 18 }}>{v.titulo}</span>
        <span style={{ width: 64, textAlign: 'center', fontSize: 26, color: '#555' }}>—</span>
        <span style={{ width: 64, height: TITULO, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, color: '#333', background: foco ? '#E81123' : 'transparent', ...(foco ? { color: '#fff' } : {}) }}>✕</span>
      </div>
      {id === 'notas' && (
        <pre style={{ margin: 0, padding: '18px 22px', fontFamily: 'Consolas, "Cascadia Mono", monospace', fontSize: 26, lineHeight: 1.45, color: '#1A1A1A', whiteSpace: 'pre-wrap' }}>
          {estado.notas}
          {foco && <span style={{ borderLeft: '3px solid #1A1A1A', marginLeft: 1 }} />}
        </pre>
      )}
      {id === 'documentos' && (
        <div style={{ padding: '10px 0', fontSize: 21, color: '#222' }}>
          {[['CV-Angel-Serrano.pdf', '152 KB'], ['Presupuesto 2026.xlsx', '38 KB'], ['Fotos del viaje', 'Carpeta'], ['Apuntes DAM', 'Carpeta']].map(([n, t]) => (
            <div key={n} style={{ display: 'flex', padding: '12px 26px', borderBottom: '1px solid #F0F2F5' }}>
              <span style={{ flex: 1 }}>{n}</span>
              <span style={{ color: '#777' }}>{t}</span>
            </div>
          ))}
        </div>
      )}
      {id === 'papelera' && (
        <div style={{ height: v.h - TITULO, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: 22 }}>
          La papelera está vacía
        </div>
      )}
    </div>
  );
}

function MenuInicio() {
  const apps = ['Correo', 'Calendario', 'Fotos', 'Música', 'Ajustes', 'Terminal', 'Explorador', 'Navegador', 'Bloc de notas'];
  return (
    <div
      style={{
        position: 'absolute', left: MENU_INICIO.x, top: MENU_INICIO.y, width: MENU_INICIO.w, height: MENU_INICIO.h,
        background: 'rgba(242,246,251,.96)', borderRadius: 14, boxShadow: '0 24px 60px rgba(0,0,0,.45)', padding: 34,
      }}
    >
      <div style={{ background: '#fff', borderRadius: 8, padding: '12px 18px', fontSize: 20, color: '#777', marginBottom: 28 }}>Escribe aquí para buscar</div>
      <div style={{ fontSize: 20, fontWeight: 600, color: '#222', marginBottom: 20 }}>Anclado</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        {apps.map((a, i) => (
          <div key={a} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, fontSize: 18, color: '#333' }}>
            <div style={{ width: 52, height: 52, borderRadius: 12, background: `hsl(${200 + i * 17} 70% ${48 + (i % 3) * 8}%)` }} />
            {a}
          </div>
        ))}
      </div>
    </div>
  );
}

function BarraTareas({ estado }) {
  const abiertas = new Set(estado.ventanas);
  return (
    <div
      style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: BARRA, background: 'rgba(232,240,250,.88)',
        borderTop: '1px solid rgba(255,255,255,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}
    >
      <div style={{ width: INICIO.w, height: INICIO.h, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, padding: 10, borderRadius: 8, background: estado.inicio ? 'rgba(0,0,0,.08)' : 'transparent' }}>
        {[0, 1, 2, 3].map((n) => <div key={n} style={{ background: '#1E78D4', borderRadius: 2 }} />)}
      </div>
      {[['#F7C95C', 'documentos'], ['#3E8FD6', null], ['#1F9D55', null], ['#FFFFFF', 'notas']].map(([color, id], i) => (
        <div key={i} style={{ position: 'relative', width: 48, height: 48, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 30, height: 30, borderRadius: 6, background: color, boxShadow: '0 1px 3px rgba(0,0,0,.3)' }} />
          {id && abiertas.has(id) && <div style={{ position: 'absolute', bottom: 2, width: 16, height: 4, borderRadius: 2, background: '#1E78D4' }} />}
        </div>
      ))}
      <div style={{ position: 'absolute', right: 26, textAlign: 'right', fontSize: 17, color: '#222', lineHeight: 1.25 }}>
        <div>18:42</div>
        <div>18/09/2026</div>
      </div>
    </div>
  );
}

/** El monitor vertical: un editor con el código del propio visor de la app. */
function Vertical() {
  const codigo = [
    'class VisorRemoto(contexto: Context) : FrameLayout(contexto) {',
    '',
    '    /** Lo que el visor sabe pedirle al ratón del PC. */',
    '    interface Raton {',
    '        fun mover(x: Float, y: Float)',
    '        fun clic(boton: Int, x: Float? = null, y: Float? = null)',
    '        fun rueda(dx: Float, dy: Float)',
    '    }',
    '',
    '    private fun zoomAlrededor(factor: Float, fx: Float, fy: Float) {',
    '        val eAntes = escala()',
    '        val vx = (fx - tx) / eAntes',
    '        val vy = (fy - ty) / eAntes',
    '        zoom = (zoom * factor).coerceIn(1f, 8f)',
    '        val e = escala()',
    '        tx = fx - vx * e',
    '        ty = fy - vy * e',
    '        colocar()',
    '    }',
    '',
    '    /** Con zoom, la vista acompaña al puntero. */',
    '    private fun seguirPuntero() {',
    '        if (zoom <= 1.01f) return',
    '        val e = escala()',
    '        val sx = tx + cx * anchoVideo * e',
    '        val margen = min(width, height) * 0.12f',
    '        if (sx < margen) tx += margen - sx',
    '        colocar()',
    '    }',
    '}',
  ];
  const color = (l) => (l.trim().startsWith('/**') ? '#6A9955' : l.includes('fun ') || l.includes('class ') ? '#7FC4F2' : '#D4D4D4');
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#1E1E1E', fontFamily: 'Consolas, "Cascadia Mono", monospace' }}>
      <div style={{ height: 56, background: '#2D2D2D', color: '#CCC', fontSize: 22, display: 'flex', alignItems: 'center', paddingLeft: 24 }}>
        VisorRemoto.kt — pocketpc
      </div>
      <div style={{ padding: '24px 0', fontSize: 24, lineHeight: 1.65 }}>
        {codigo.map((l, i) => (
          <div key={i} style={{ display: 'flex', whiteSpace: 'pre' }}>
            <span style={{ width: 80, textAlign: 'right', paddingRight: 24, color: '#6E7681' }}>{i + 1}</span>
            <span style={{ color: color(l) }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
