/**
 * Demo de Schematic Lab — núcleo falso en memoria.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 *
 * En la app de escritorio el frontend habla con Rust por `invoke` (todo pasa
 * por src/api/llamar.ts). Aquí `invoke` llega a este módulo, que responde con
 * lo que el propio núcleo volcó de tres schematics de prueba
 * (`cargo run --example volcar_demo`, copiado a ../datos/ por
 * scripts/sincronizar-demo-schematic-lab.sh). Los datos se piden con fetch al
 * usarlos: no van en el paquete de la demo.
 *
 * Sin jar de Minecraft, como la app recién instalada: colores planos y sin
 * texturas. Lo que escribiría en disco (importar, aplicar cambios, exportar,
 * guardar CSV) avisa de que en la demo no se guarda; renombrar, borrar,
 * marcar reunidos y los ajustes viven en memoria mientras la demo está abierta.
 */
import { AJUSTES_POR_DEFECTO } from '../api/atlas';
import { CABECERA_ID, CABECERA_TEXTURAS, claveTexturas } from '../api/miniaturas';
import { celdaImpactada, decodificarMalla, NORMALES } from '../api/visor';
import { avisarDemo, NO_SE_GUARDA } from './aviso.js';
import { colorDe, nombreDe, propiedadesDe, validarEstado } from './colores.js';
import * as catalogo from './parecidos.js';

/** URL de cada archivo volcado (`../datos/simple/malla.bin` → URL del asset). */
const DATOS = import.meta.glob('../datos/**/*', { query: '?url', import: 'default', eager: true });
/**
 * Miniaturas precalculadas: las dibujó una vez la propia app en la demo (sin
 * PNG, `guardar_miniatura` las recibe) y se guardaron aquí. Si falta alguna,
 * la app la genera al abrirse, como en escritorio.
 */
const MINIATURAS = import.meta.glob('./miniaturas/*.png', {
  query: '?url',
  import: 'default',
  eager: true,
});

const DIA = 86_400_000;
/** Como mucho tantos estados por llamada (MAX_CELDAS_ATLAS en la app y en Rust). */
const MAX_ESTADOS = 256;

const error = (tipo, mensaje) => ({ tipo, mensaje });
const noEncontrado = () => error('noEncontrado', 'Ese schematic ya no está en la biblioteca.');

// ── Archivos volcados (inmutables: se guardan entre montajes) ──

const descargas = new Map();

function cargar(ruta, binario = false) {
  if (!descargas.has(ruta)) {
    const url = DATOS[`../datos/${ruta}`];
    if (!url) return Promise.reject(noEncontrado());
    const peticion = fetch(url).then((r) => {
      if (!r.ok) throw error('io', `No se pudo leer ${ruta} (${r.status}).`);
      return binario ? r.arrayBuffer() : r.json();
    });
    peticion.catch(() => descargas.delete(ruta));
    descargas.set(ruta, peticion);
  }
  return descargas.get(ruta);
}

const tablaColores = () => cargar('colores_bloques.json');
const regionesDe = async (id) => (await cargar(`${id}/obtener.json`)).regiones;

/**
 * Celdas del modelo con su material, sacadas de la malla: cada triángulo
 * marca la celda que hay detrás de su cara (como el raycast del visor). Solo
 * ve los bloques con alguna cara visible, que es lo que se puede pulsar.
 */
const indices = new Map();

function celdasDe(id) {
  if (!indices.has(id)) {
    indices.set(
      id,
      cargar(`${id}/malla.bin`, true).then((buffer) => {
        const malla = decodificarMalla(buffer.slice(0));
        const celdas = new Map();
        for (const ch of malla.chunks) {
          const { posiciones: p, normales: n, materiales: mat, indices: tri } = ch;
          for (let t = 0; t < tri.length; t += 3) {
            const [a, b, c] = [tri[t], tri[t + 1], tri[t + 2]];
            const centro = [0, 1, 2].map(
              (k) => (p[a * 3 + k] + p[b * 3 + k] + p[c * 3 + k]) / 48 + ch.origen[k],
            );
            const clave = celdaImpactada(centro, NORMALES[n[a]]).join(',');
            if (!celdas.has(clave)) celdas.set(clave, mat[a]);
          }
        }
        /** Posiciones visibles por block state. */
        const cuentas = new Map();
        for (const m of celdas.values()) {
          const estado = malla.materiales[m].estado;
          cuentas.set(estado, (cuentas.get(estado) ?? 0) + 1);
        }
        return { malla, celdas, cuentas };
      }),
    );
  }
  return indices.get(id);
}

const dentroDe = (r, p) =>
  p[0] >= r.origen[0] &&
  p[0] < r.origen[0] + r.tamano.ancho &&
  p[1] >= r.origen[1] &&
  p[1] < r.origen[1] + r.tamano.alto &&
  p[2] >= r.origen[2] &&
  p[2] < r.origen[2] + r.tamano.largo;

// ── Estado de la sesión (se reinicia al volver a montar la demo) ──

function estadoNuevo() {
  return { entradas: null, ajustes: { ...AJUSTES_POR_DEFECTO }, reunidos: new Map(), blobs: [] };
}
let sesion = estadoNuevo();

export function reiniciarNucleo() {
  sesion.blobs.forEach((u) => URL.revokeObjectURL(u));
  sesion = estadoNuevo();
}

/** La biblioteca: las fechas de importación se acercan a hoy (una por día). */
function entradas() {
  const mia = sesion;
  mia.entradas ??= cargar('listar.json').then((lista) => {
    const ahora = Date.now();
    return [...lista]
      .sort((a, b) => b.fechaImportacion - a.fechaImportacion)
      .map((e, i) => {
        const png = MINIATURAS[`./miniaturas/${e.id}.png`];
        return {
          ...e,
          fechaImportacion: ahora - (i + 1) * DIA,
          miniatura: png ? { ruta: png, fecha: 1, texturas: claveTexturas(null) } : null,
        };
      });
  });
  return mia.entradas;
}

async function entrada(id) {
  const e = (await entradas()).find((x) => x.id === id);
  if (!e) throw noEncontrado();
  return e;
}

/** `desglosar` de src-tauri/src/materiales/mod.rs. */
function desglosar(item, cantidad, tamanoStack) {
  const t = Math.max(1, tamanoStack);
  const caja = 27 * t;
  return {
    item,
    cantidad,
    tamanoStack: t,
    stacks: Math.floor(cantidad / t),
    sueltos: cantidad % t,
    shulkers: Math.floor(cantidad / caja),
    stacksEnShulker: Math.floor((cantidad % caja) / t),
    sueltosEnShulker: cantidad % t,
  };
}

/**
 * Materiales. Sin filtros, los que calculó el núcleo. Con región o capas, una
 * aproximación: cada ítem se reparte en la proporción de sus bloques visibles
 * que caen dentro del filtro (el cálculo exacto es de Rust).
 */
async function materiales(id, opciones = {}) {
  await entrada(id);
  const base = await cargar(`${id}/${opciones.incluirFluidos ? 'materiales_fluidos' : 'materiales'}.json`);
  const { region = null, yMin = null, yMax = null, capas = null } = opciones;
  if (region === null && yMin === null && yMax === null && !capas) return base;

  const [{ malla, celdas }, regiones] = await Promise.all([celdasDe(id), regionesDe(id)]);
  const total = new Map();
  const dentro = new Map();
  let todas = 0;
  let filtradas = 0;
  for (const [clave, m] of celdas) {
    const [x, y, z] = clave.split(',').map(Number);
    const pos = [x + malla.origen[0], y + malla.origen[1], z + malla.origen[2]];
    const nombre = nombreDe(malla.materiales[m].estado);
    const vale =
      (!capas || (y >= capas[0] && y <= capas[1])) &&
      (yMin === null || pos[1] >= yMin) &&
      (yMax === null || pos[1] <= yMax) &&
      (region === null || regiones.find((r) => dentroDe(r, pos))?.nombre === region);
    total.set(nombre, (total.get(nombre) ?? 0) + 1);
    todas++;
    if (vale) {
      dentro.set(nombre, (dentro.get(nombre) ?? 0) + 1);
      filtradas++;
    }
  }
  const proporcion = (item) =>
    total.get(item) ? (dentro.get(item) ?? 0) / total.get(item) : todas ? filtradas / todas : 0;
  const lista = base.materiales
    .map((m) => desglosar(m.item, Math.round(m.cantidad * proporcion(m.item)), m.tamanoStack))
    .filter((m) => m.cantidad > 0)
    .sort((a, b) => b.cantidad - a.cantidad || a.item.localeCompare(b.item));
  const totalStacks = lista.reduce((s, m) => s + m.stacks + (m.sueltos > 0 ? 1 : 0), 0);
  return {
    materiales: lista,
    totalItems: lista.reduce((s, m) => s + m.cantidad, 0),
    totalStacks,
    totalShulkers: Math.ceil(totalStacks / 27),
    desconocidos: todas ? Math.round((base.desconocidos * filtradas) / todas) : 0,
  };
}

async function bloqueEn({ id, x, y, z }) {
  await entrada(id);
  const [{ malla, celdas }, regiones] = await Promise.all([celdasDe(id), regionesDe(id)]);
  const m = celdas.get(`${x},${y},${z}`);
  if (m === undefined) return null;
  const estado = malla.materiales[m].estado;
  const posicion = [x + malla.origen[0], y + malla.origen[1], z + malla.origen[2]];
  const region = regiones.find((r) => dentroDe(r, posicion)) ?? regiones[0];
  return {
    estado,
    nombre: nombreDe(estado),
    propiedades: propiedadesDe(estado),
    posicion,
    region: region?.nombre ?? null,
  };
}

/** La miniatura que acaba de dibujar la app: se queda en memoria (blob:). */
async function guardarMiniatura(png, opciones = {}) {
  const cabeceras = opciones.headers ?? {};
  const e = await entrada(cabeceras[CABECERA_ID]);
  const ruta = URL.createObjectURL(new Blob([png], { type: 'image/png' }));
  sesion.blobs.push(ruta);
  e.miniatura = { ruta, fecha: Date.now(), texturas: cabeceras[CABECERA_TEXTURAS] ?? null };
  return e;
}

function reunidos(id) {
  if (!sesion.reunidos.has(id)) sesion.reunidos.set(id, new Set());
  return sesion.reunidos.get(id);
}

const COMANDOS = {
  // Biblioteca
  listar: () => entradas(),
  obtener: async ({ id }) => ({ entrada: await entrada(id), regiones: await regionesDe(id) }),
  renombrar: async ({ id, nombre }) => {
    const e = await entrada(id);
    const limpio = String(nombre ?? '').trim();
    if (!limpio) throw error('nombreInvalido', 'El nombre no puede quedar vacío.');
    e.nombre = limpio;
    return e;
  },
  eliminar: async ({ id }) => {
    const lista = await entradas();
    const i = lista.findIndex((x) => x.id === id);
    if (i < 0) throw noEncontrado();
    lista.splice(i, 1);
    return null;
  },
  importar: () => {
    avisarDemo('En la demo no se importan archivos: prueba con los tres de ejemplo.');
    return [];
  },
  archivo_pendiente: () => null,

  // Materiales
  materiales: ({ id, opciones }) => materiales(id, opciones),
  comprobacion: async ({ id }) => [...reunidos((await entrada(id)).id)],
  marcar: ({ id, item, reunido }) => {
    if (reunido) reunidos(id).add(item);
    else reunidos(id).delete(item);
    return null;
  },
  nombres_items: () => ({}),
  guardar_csv: () => {
    avisarDemo(NO_SE_GUARDA);
    return false;
  },

  // Visor
  malla: async ({ id }) => {
    await entrada(id);
    // Con `capas` el núcleo remalla el corte cerrado; aquí va el modelo
    // entero y el visor lo recorta (queda hueco, como mientras se arrastra).
    return cargar(`${id}/malla.bin`, true);
  },
  malla_miniatura: async ({ id }) => {
    await entrada(id);
    return cargar(`${id}/malla.bin`, true);
  },
  bloque_en: bloqueEn,
  guardar_miniatura: guardarMiniatura,

  // Ajustes y texturas: sin Minecraft instalado.
  ajustes: () => sesion.ajustes,
  guardar_ajustes: ({ ajustes }) => {
    sesion.ajustes = { ...ajustes };
    return false;
  },
  versiones_minecraft: () => [],
  carpeta_minecraft_por_defecto: () => null,
  atlas_info: () => null,
  atlas: () => new ArrayBuffer(0),
  celdas_atlas: () => null,
  colores_bloques: async ({ estados }) => {
    if (estados.length > MAX_ESTADOS) {
      throw error('edicionInvalida', `Como mucho ${MAX_ESTADOS} bloques por llamada.`);
    }
    const tabla = await tablaColores();
    return estados.map((e) => {
      const valido = validarEstado(e);
      return valido ? colorDe(tabla, nombreDe(valido)) : null;
    });
  },

  // Modificar: las sugerencias funcionan; guardar, no.
  aplicar_cambios: () => {
    throw error('io', 'en la demo no se guardan los cambios (siguen en la lista de pendientes).');
  },
  historial: () => [],
  restaurar_version: () => {
    throw error('versionNoEncontrada', 'En la demo no hay versiones anteriores.');
  },
  exportar_schematic: () => {
    avisarDemo(NO_SE_GUARDA);
    return null;
  },
  parecidos: async ({ estado, n }) => catalogo.parecidos(await tablaColores(), estado, n),
  familia_de: ({ estado }) => {
    const { familia, variante, nombreVariante, forma, sugerible } = catalogo.familiaDe(nombreDe(estado));
    return { familia, variante, nombreVariante, forma, sugerible };
  },
  miembros_familia: async ({ id, familia }) =>
    catalogo.miembrosFamilia((await celdasDe(id)).cuentas, familia),
  familias_parecidas: async ({ familia, n }) =>
    catalogo.familiasParecidas(await tablaColores(), familia, n),
  plan_familia: async ({ id, familiaOrigen, familiaDestino }) =>
    catalogo.planFamilia(await tablaColores(), (await celdasDe(id)).cuentas, familiaOrigen, familiaDestino),
  destinos_conservando: ({ estadoDestino, estadosOrigen }) =>
    catalogo.destinosConservando(estadoDestino, estadosOrigen),
};

/** El `invoke` de Tauri: asíncrono y con copia de lo que devuelve, como por IPC. */
export async function invoke(orden, args, opciones) {
  const comando = COMANDOS[orden];
  if (!comando) throw error('interno', `La demo no simula «${orden}».`);
  await Promise.resolve();
  const respuesta = await comando(args ?? {}, opciones ?? {});
  if (respuesta instanceof ArrayBuffer) return respuesta.slice(0);
  return respuesta === undefined ? null : structuredClone(respuesta);
}
