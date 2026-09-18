/**
 * Demo de PocketPC — el visor: el PC en pantalla completa, gestos y teclado.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 *
 * Réplica de ui/sesion/SesionActiva.kt y ui/visor/VisorRemoto.kt. La geometría
 * es la misma: el escritorio va a su tamaño real y se encaja con escala y
 * traslación, así el zoom amplía «píxeles del PC» y no una imagen reducida.
 */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { C, Icono } from './tema';
import { Escritorio, MONITORES, clic, teclear } from './Escritorio';

const CALIDADES = [
  ['alta', 'Alta (60 fps, wifi)', { lado: 1920, fps: 60, mbit: '7.8' }],
  ['media', 'Media (30 fps)', { lado: 1600, fps: 30, mbit: '3.9' }],
  ['ahorro', 'Ahorro de datos', { lado: 1280, fps: 15, mbit: '1.2' }],
];
const acotar = (v, min, max) => Math.min(max, Math.max(min, v));

export default function Visor({ pcNombre, monitor, escritorio, setEscritorio, alPantallas, alSalir }) {
  const m = MONITORES.find((x) => x.id === monitor);
  const caja = useRef(null);
  const [tam, setTam] = useState({ w: 0, h: 0 });
  const [vista, setVista] = useState({ zoom: 1, tx: 0, ty: 0 });
  const [cursor, setCursor] = useState({ x: 0.52, y: 0.42 });
  const [modo, setModo] = useState('raton');
  const [soloVer, setSoloVer] = useState(false);
  const [barra, setBarra] = useState(true);
  const [menu, setMenu] = useState(false);
  const [teclado, setTeclado] = useState(false);
  const [datos, setDatos] = useState(false);
  const [calidad, setCalidad] = useState('alta');
  const [salir, setSalir] = useState(false);
  const [modificadores, setModificadores] = useState([]);

  // Lo que leen los gestos: siempre el último valor, sin esperar al repintado.
  const ref = useRef({});
  ref.current = { vista, cursor, tam, modo, soloVer };

  useLayoutEffect(() => {
    const el = caja.current;
    const medir = () => setTam({ w: el.clientWidth, h: el.clientHeight });
    medir();
    const obs = new ResizeObserver(medir);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const base = (t = ref.current.tam) => (t.w ? Math.min(t.w / m.ancho, t.h / m.alto) : 1);

  /** Encaja la vista: centrada si el escritorio cabe, sin salirse si no. */
  const colocar = (v, centrar = false) => {
    const t = ref.current.tam;
    const e = base(t) * v.zoom;
    const cw = m.ancho * e;
    const ch = m.alto * e;
    let { tx, ty } = v;
    if (centrar) { tx = (t.w - cw) / 2; ty = (t.h - ch) / 2; }
    tx = cw <= t.w ? (t.w - cw) / 2 : acotar(tx, t.w - cw, 0);
    ty = ch <= t.h ? (t.h - ch) / 2 : acotar(ty, t.h - ch, 0);
    return { zoom: v.zoom, tx, ty };
  };

  // Otro monitor u otro tamaño (el teclado ocupa sitio): encajar de nuevo.
  useEffect(() => { setVista(colocar({ zoom: 1, tx: 0, ty: 0 }, true)); }, [monitor, tam.w, tam.h]);

  const zoomAlrededor = (factor, fx, fy) => {
    const v = ref.current.vista;
    const eAntes = base() * v.zoom;
    const vx = (fx - v.tx) / eAntes;
    const vy = (fy - v.ty) / eAntes;
    const zoom = acotar(v.zoom * factor, 1, 8);
    const e = base() * zoom;
    setVista(colocar({ zoom, tx: fx - vx * e, ty: fy - vy * e }));
  };

  const normal = (sx, sy) => {
    const v = ref.current.vista;
    const e = base() * v.zoom;
    return { x: acotar((sx - v.tx) / (m.ancho * e), 0, 1), y: acotar((sy - v.ty) / (m.alto * e), 0, 1) };
  };

  /** Con zoom, la vista acompaña al puntero cuando se acerca al borde. */
  const seguir = (c) => {
    const { vista: v, tam: t } = ref.current;
    if (v.zoom <= 1.01) return;
    const e = base() * v.zoom;
    const sx = v.tx + c.x * m.ancho * e;
    const sy = v.ty + c.y * m.alto * e;
    const margen = Math.min(t.w, t.h) * 0.12;
    let { tx, ty } = v;
    if (sx < margen) tx += margen - sx;
    if (sx > t.w - margen) tx -= sx - (t.w - margen);
    if (sy < margen) ty += margen - sy;
    if (sy > t.h - margen) ty -= sy - (t.h - margen);
    setVista(colocar({ ...v, tx, ty }));
  };

  const ultimoClic = useRef({ t: 0, x: 0, y: 0 });
  const clicAqui = (p) => {
    if (ref.current.soloVer) return;
    const ahora = performance.now();
    const u = ultimoClic.current;
    const doble = ahora - u.t < 450 && Math.hypot(p.x - u.x, p.y - u.y) < 0.03;
    ultimoClic.current = { t: doble ? 0 : ahora, x: p.x, y: p.y };
    setEscritorio((e) => clic(e, monitor, p.x * m.ancho, p.y * m.alto, doble));
  };

  /* ─────────── Gestos (Pointer Events: ratón y dedos) ─────────── */

  const punteros = useRef(new Map());
  const gesto = useRef(null);
  const local = (e) => {
    const r = caja.current.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const dosDedos = () => {
    const [a, b] = [...punteros.current.values()];
    return { d: Math.hypot(a.x - b.x, a.y - b.y), cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2 };
  };

  const alBajar = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    punteros.current.set(e.pointerId, local(e));
    if (punteros.current.size === 1) {
      const p = local(e);
      gesto.current = { tipo: 'uno', x0: p.x, y0: p.y, ult: p, t0: e.timeStamp, movido: false };
    } else if (punteros.current.size === 2) {
      const d = dosDedos();
      gesto.current = { tipo: 'dos', ult: d, t0: e.timeStamp, movido: false };
    }
  };

  const alMover = (e) => {
    if (!punteros.current.has(e.pointerId) || !gesto.current) return;
    const p = local(e);
    punteros.current.set(e.pointerId, p);
    const g = gesto.current;
    if (g.tipo === 'uno') {
      if (!g.movido && Math.hypot(p.x - g.x0, p.y - g.y0) > 6) g.movido = true;
      if (!g.movido) return;
      const dx = p.x - g.ult.x;
      const dy = p.y - g.ult.y;
      g.ult = p;
      const { modo: md, soloVer: sv, vista: v } = ref.current;
      if (md === 'raton' && !sv) {
        const esc = base() * v.zoom;
        const acel = 1.25 + Math.min(Math.hypot(dx, dy) / 18, 1.4);
        const c = ref.current.cursor;
        const nuevo = { x: acotar(c.x + (dx * acel) / (m.ancho * esc), 0, 1), y: acotar(c.y + (dy * acel) / (m.alto * esc), 0, 1) };
        setCursor(nuevo);
        seguir(nuevo);
      } else if (v.zoom > 1.01) {
        setVista(colocar({ ...v, tx: v.tx + dx, ty: v.ty + dy }));
      }
    } else if (g.tipo === 'dos' && punteros.current.size === 2) {
      const d = dosDedos();
      if (!g.movido && Math.abs(d.d - g.ult.d) < 2) return;
      g.movido = true;
      zoomAlrededor(d.d / g.ult.d, d.cx, d.cy);
      g.ult = d;
    }
  };

  const alSubir = (e) => {
    const g = gesto.current;
    punteros.current.delete(e.pointerId);
    if (g?.tipo === 'uno' && !g.movido && e.timeStamp - g.t0 < 350) {
      if (ref.current.modo === 'raton') clicAqui(ref.current.cursor);
      else {
        const p = normal(g.x0, g.y0);
        setCursor(p);
        clicAqui(p);
      }
    }
    if (punteros.current.size === 0) gesto.current = null;
  };

  // En un ordenador no hay pellizco: la rueda del ratón hace de zoom. Tiene que
  // ser un oyente no pasivo para poder frenar el desplazamiento de la página.
  useEffect(() => {
    const el = caja.current;
    const rueda = (e) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      zoomAlrededor(Math.exp(-e.deltaY * 0.0015), e.clientX - r.left, e.clientY - r.top);
    };
    el.addEventListener('wheel', rueda, { passive: false });
    return () => el.removeEventListener('wheel', rueda);
  });

  /* ─────────── Teclado ─────────── */

  const pulsar = useCallback((tecla) => {
    if (modificadores.length) { setModificadores([]); return; }   // atajo: en la demo no cambia el escritorio
    setEscritorio((e) => teclear(e, tecla));
  }, [modificadores, setEscritorio]);

  // Con el teclado abierto, también se puede escribir con el del ordenador.
  useEffect(() => {
    if (!teclado) return undefined;
    const alTeclear = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Enter') {
        e.preventDefault();
        pulsar(e.key);
      }
    };
    window.addEventListener('keydown', alTeclear);
    return () => window.removeEventListener('keydown', alTeclear);
  }, [teclado, pulsar]);

  const e = base() * vista.zoom;
  const q = CALIDADES.find(([k]) => k === calidad)[2];
  const factor = Math.max(1, Math.max(m.ancho, m.alto) / q.lado);
  const medidas = `${Math.round(m.ancho / factor)}×${Math.round(m.alto / factor)} · ${q.fps} fps · ${q.mbit} Mbit/s · H264 · 12 ms · directa P2P`;

  return (
    <div className="relative flex h-full flex-col" style={{ background: C.noche }}>
      <div className="relative min-h-0 flex-1">
        <div
          ref={caja}
          className="absolute inset-0 overflow-hidden"
          style={{ touchAction: 'none', cursor: modo === 'raton' ? 'none' : 'pointer' }}
          onPointerDown={alBajar}
          onPointerMove={alMover}
          onPointerUp={alSubir}
          onPointerCancel={alSubir}
        >
          <div style={{ position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', transform: `translate(${vista.tx}px, ${vista.ty}px) scale(${e})` }}>
            <Escritorio monitor={monitor} estado={escritorio} cursor={cursor} />
          </div>
          {modo === 'raton' && !soloVer && (
            <div
              className="pointer-events-none absolute rounded-full"
              style={{
                width: 28, height: 28, left: vista.tx + cursor.x * m.ancho * e - 14, top: vista.ty + cursor.y * m.alto * e - 14,
                border: '2.5px solid rgba(255,255,255,.8)', boxShadow: '0 0 0 3px rgba(62,143,214,.4)',
              }}
            />
          )}
        </div>

        {datos && (
          <div className="pointer-events-none absolute bottom-3 left-3 right-3 rounded-lg px-2.5 py-1.5 text-[10px] text-white" style={{ background: 'rgba(11,27,46,.7)' }}>
            {medidas}
          </div>
        )}

        {!teclado && barra && (
          <div className="absolute left-2 right-2 top-10 flex items-center rounded-2xl px-1 py-0.5" style={{ background: 'rgba(15,46,82,.9)' }}>
            <Boton icono="atras" titulo="Salir" alTocar={() => setSalir(true)} />
            <div className="min-w-0 flex-1 px-1 leading-tight">
              <div className="truncate text-[12px] font-semibold text-white">{pcNombre}</div>
              <div className="truncate text-[10px]" style={{ color: C.bruma }}>{m.nombre}</div>
            </div>
            <Boton icono="monitor" titulo="Cambiar de pantalla" alTocar={alPantallas} />
            <Boton icono="teclado" titulo="Teclado" alTocar={() => setTeclado(true)} />
            <Boton icono={modo === 'raton' ? 'raton' : 'tactil'} titulo={modo === 'raton' ? 'Modo ratón (cambiar a táctil)' : 'Modo táctil (cambiar a ratón)'} alTocar={() => setModo(modo === 'raton' ? 'tactil' : 'raton')} />
            <Boton icono="mas" titulo="Más opciones" alTocar={() => setMenu(true)} />
          </div>
        )}
        {!teclado && !barra && (
          <button type="button" aria-label="Mostrar la barra" onClick={() => setBarra(true)} className="absolute left-1/2 top-9 -translate-x-1/2 rounded-b-xl px-4" style={{ background: 'rgba(15,46,82,.6)' }}>
            <Icono nombre="desplegar" color="#fff" tam={20} />
          </button>
        )}

        {menu && (
          <Menu
            calidad={calidad}
            soloVer={soloVer}
            datos={datos}
            alCerrar={() => setMenu(false)}
            alCalidad={setCalidad}
            alSoloVer={() => setSoloVer(!soloVer)}
            alDatos={() => setDatos(!datos)}
            alAjustar={() => setVista(colocar({ zoom: 1, tx: 0, ty: 0 }, true))}
            alOcultar={() => setBarra(false)}
          />
        )}
      </div>

      {teclado && (
        <>
          <BarraTeclas modificadores={modificadores} setModificadores={setModificadores} alPulsar={pulsar} alCerrar={() => setTeclado(false)} />
          <TecladoAndroid alPulsar={pulsar} />
        </>
      )}

      {salir && (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-6" style={{ background: 'rgba(0,0,0,.45)' }}>
          <div className="w-full rounded-3xl bg-white p-6" style={{ color: C.tinta }}>
            <div className="text-lg">¿Desconectar de {pcNombre}?</div>
            <div className="mt-6 flex justify-end gap-2 text-sm font-medium" style={{ color: C.marino }}>
              <button type="button" className="rounded-full px-3 py-2" onClick={() => setSalir(false)}>Seguir</button>
              <button type="button" className="rounded-full px-3 py-2" onClick={alSalir}>Desconectar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Boton({ icono, titulo, alTocar }) {
  return (
    <button type="button" title={titulo} aria-label={titulo} onClick={alTocar} className="flex h-10 w-9 shrink-0 items-center justify-center">
      <Icono nombre={icono} color="#fff" tam={20} />
    </button>
  );
}

function Menu({ calidad, soloVer, datos, alCerrar, alCalidad, alSoloVer, alDatos, alAjustar, alOcultar }) {
  const opcion = (texto, icono, accion, marcada = false) => (
    <button
      type="button"
      key={texto}
      onClick={() => { alCerrar(); accion(); }}
      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-[13px]"
      style={{ color: C.tinta }}
    >
      <span className="flex w-5 justify-center">{icono && <Icono nombre={icono} color={C.marino} tam={18} />}</span>
      <span className="flex-1">{texto}</span>
      {marcada && <Icono nombre="hecho" color={C.azul} tam={18} />}
    </button>
  );
  return (
    <div className="absolute inset-0 z-10" onClick={alCerrar}>
      <div className="absolute right-2 top-20 w-60 rounded-lg bg-white py-2 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="px-4 py-1 text-[11px] font-medium" style={{ color: C.tintaSuave }}>Calidad de imagen</div>
        {CALIDADES.map(([k, texto]) => opcion(texto, calidad === k ? 'hecho' : null, () => alCalidad(k)))}
        <div className="my-1 h-px" style={{ background: C.bruma }} />
        {opcion('Solo ver (sin tocar el PC)', 'ojo', alSoloVer, soloVer)}
        {opcion('Datos de la conexión', 'velocimetro', alDatos, datos)}
        {opcion('Ajustar a la pantalla', 'ajustar', alAjustar)}
        {opcion('Ocultar esta barra', 'plegar', alOcultar)}
      </div>
    </div>
  );
}

const MODIFICADORES = [['Control', 'Ctrl'], ['Alt', 'Alt'], ['Shift', 'Mayús'], ['Meta', 'Win']];
const ESPECIALES = [['Escape', 'Esc'], ['Tab', 'Tab'], ['ArrowLeft', '←'], ['ArrowUp', '↑'], ['ArrowDown', '↓'], ['ArrowRight', '→'], ['Backspace', '⌫'], ['Delete', 'Supr'], ['Home', 'Inicio'], ['End', 'Fin']];
const ATAJOS = ['Copiar', 'Pegar', 'Cortar', 'Deshacer', 'Alt+Tab', 'Escritorio', 'Tareas'];

function BarraTeclas({ modificadores, setModificadores, alPulsar, alCerrar }) {
  const tecla = (clave, texto, accion, activa = false) => (
    <button
      type="button"
      key={clave}
      onClick={accion}
      className="h-8 shrink-0 rounded-lg px-2.5 text-[12px] text-white"
      style={{ background: activa ? C.azul : C.tecla }}
    >
      {texto}
    </button>
  );
  const separador = (k) => <div key={k} className="h-5 w-px shrink-0" style={{ background: 'rgba(127,196,242,.25)' }} />;
  return (
    <div className="no-scrollbar flex shrink-0 items-center gap-1.5 overflow-x-auto px-1.5 py-1.5" style={{ background: C.barra }}>
      <button type="button" aria-label="Cerrar el teclado" onClick={alCerrar} className="flex h-8 w-8 shrink-0 items-center justify-center">
        <Icono nombre="desplegar" color="#fff" tam={20} />
      </button>
      {MODIFICADORES.map(([k, t]) => tecla(k, t, () => setModificadores((m) => (m.includes(k) ? m.filter((x) => x !== k) : [...m, k])), modificadores.includes(k)))}
      {separador('s1')}
      {ESPECIALES.map(([k, t]) => tecla(k, t, () => alPulsar(k)))}
      {separador('s2')}
      {ATAJOS.map((t) => tecla(t, t, () => setModificadores([])))}
    </div>
  );
}

/** Teclado del móvil (como el de Android): lo que se pulsa va directo al PC. */
function TecladoAndroid({ alPulsar }) {
  const filas = ['qwertyuiop', 'asdfghjklñ', 'zxcvbnm'];
  const tecla = (texto, valor, ancho = 'flex-1', oscura = false) => (
    <button
      type="button"
      key={valor + texto}
      onClick={() => alPulsar(valor)}
      className={`${ancho} flex h-9 items-center justify-center rounded-md text-[15px] shadow-sm`}
      style={{ background: oscura ? '#DCE3EC' : '#fff', color: '#1B1B1F' }}
    >
      {texto}
    </button>
  );
  return (
    <div className="shrink-0 space-y-1.5 px-1 pb-3 pt-2" style={{ background: '#EEF1F6' }}>
      {filas.map((f, i) => (
        <div key={f} className="flex gap-1 px-0.5">
          {i === 2 && tecla('⇧', 'Shift', 'w-9', true)}
          {[...f].map((l) => tecla(l, l))}
          {i === 2 && tecla('⌫', 'Backspace', 'w-9', true)}
        </div>
      ))}
      <div className="flex gap-1 px-0.5">
        {tecla(',', ',', 'w-9', true)}
        {tecla('espacio', ' ')}
        {tecla('.', '.', 'w-9', true)}
        {tecla('↵', 'Enter', 'w-12', true)}
      </div>
    </div>
  );
}
