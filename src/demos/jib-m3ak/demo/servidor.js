/**
 * Demo de Jib M3ak — el servidor, sin Supabase.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 *
 * Misma interfaz que `src/lib/servidor.js` de la app (la demo sustituye ese
 * archivo por este), pero las dos listas viven en memoria: nadie escribe en la
 * base de datos de la familia. Lo demás es la app real, tal cual.
 *
 * De regalo, la demo enseña algo que en una captura no se ve: cada pocos
 * segundos «otra persona de la casa» apunta algo desde su móvil, que es lo que
 * hace Realtime en la app publicada.
 */
import { dibujar } from './dibujos.js';

const RETARDO = 260; // lo que tardaría la red de verdad
const CADA = 9000; // cada cuánto aparece algo apuntado por otra persona

const FOTOS = new Map();
const oyentes = new Set();

const uuid = () => crypto.randomUUID();

function sembrar() {
  const arranque = [
    ['Leche', 'leche'],
    ['حْلِيبْ دْ الْمَاعَزْ', 'cabra'],
    ['Huevos', 'huevo'],
    ['Aceite de oliva', 'aceituna'],
    ['Nocilla', 'chocolate'],
  ];
  const articulos = arranque.map(([nombre, dibujo], i) => {
    const id = uuid();
    FOTOS.set(id, dibujar(dibujo, i * 7));
    return { id, nombre, creado_en: new Date(Date.now() - (arranque.length - i) * 60000).toISOString() };
  });
  const compra = [
    { id: uuid(), articulo_id: articulos[0].id, creado_en: new Date(Date.now() - 50000).toISOString() },
    { id: uuid(), articulo_id: articulos[3].id, creado_en: new Date(Date.now() - 20000).toISOString() },
  ];
  return { articulos, compra };
}

let datos = sembrar();
let visitas = 0;

const copia = () => ({ articulos: [...datos.articulos], compra: [...datos.compra] });
const avisar = () => oyentes.forEach((oyente) => oyente());
const esperar = (ms = RETARDO) => new Promise((sigue) => setTimeout(sigue, ms));

export const hayConfiguracion = true;

export const urlFoto = (articuloId) => FOTOS.get(articuloId) ?? '';

export const sb = null;

export const servidorSupabase = {
  async leer() {
    await esperar(visitas++ === 0 ? 420 : 120);
    return copia();
  },

  async crearArticulo({ id, nombre, fotoLocal }) {
    await esperar();
    if (fotoLocal) FOTOS.set(id, fotoLocal);
    if (!datos.articulos.some((a) => a.id === id)) {
      datos.articulos.push({ id, nombre, creado_en: new Date().toISOString() });
    }
    avisar();
  },

  async borrarArticulo({ articuloId }) {
    await esperar();
    datos.articulos = datos.articulos.filter((a) => a.id !== articuloId);
    datos.compra = datos.compra.filter((c) => c.articulo_id !== articuloId);
    FOTOS.delete(articuloId);
    avisar();
  },

  async aCompra({ id, articuloId }) {
    await esperar();
    if (!datos.compra.some((c) => c.articulo_id === articuloId)) {
      datos.compra.push({ id, articulo_id: articuloId, creado_en: new Date().toISOString() });
    }
    avisar();
  },

  async quitarCompra({ id }) {
    await esperar();
    datos.compra = datos.compra.filter((c) => c.id !== id);
    avisar();
  },

  async vaciarCompra({ ids }) {
    await esperar();
    datos.compra = datos.compra.filter((c) => !ids.includes(c.id));
    avisar();
  },
};

/** «Otra persona de la casa» apuntando cosas, como haría Realtime. */
const DE_LA_FAMILIA = [
  ['Pan', 'pan'],
  ['مَاطِيشَة', 'tomate'],
  ['Yogur de fresa', 'fresa'],
  ['Papel higiénico', 'papel'],
  ['سُكَّرْ', 'azucar'],
];

export function escucharCambios(alCambiar) {
  oyentes.add(alCambiar);
  let turno = 0;

  const reloj = setInterval(() => {
    const [nombre, dibujo] = DE_LA_FAMILIA[turno % DE_LA_FAMILIA.length];
    turno += 1;
    if (datos.articulos.some((a) => a.nombre === nombre)) return;
    const id = uuid();
    FOTOS.set(id, dibujar(dibujo, turno * 11));
    datos.articulos.push({ id, nombre, creado_en: new Date().toISOString() });
    datos.compra.push({ id: uuid(), articulo_id: id, creado_en: new Date().toISOString() });
    avisar();
  }, CADA);

  alCambiar();
  return () => {
    clearInterval(reloj);
    oyentes.delete(alCambiar);
  };
}

export function olvidarFotoCacheada() {}

export function blobDesdeDataUrl(dataUrl) {
  return new Blob([dataUrl], { type: 'text/plain' });
}

/** La demo empieza de cero cada vez que se abre. */
export function reiniciarDemo() {
  FOTOS.clear();
  oyentes.clear();
  datos = sembrar();
  visitas = 0;
  try {
    localStorage.removeItem('jibm3ak:base');
    localStorage.removeItem('jibm3ak:pendientes');
    // En la demo no tiene sentido el cartel de «instala la app».
    localStorage.setItem('jibm3ak:instalar-visto', 'si');
  } catch { /* en modo privado no hay nada que limpiar */ }
}
