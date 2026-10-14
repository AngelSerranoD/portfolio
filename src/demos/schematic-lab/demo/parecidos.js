/**
 * Demo de Schematic Lab — bloques y familias parecidos para el modo Modificar.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 *
 * El núcleo de verdad tiene un catálogo de bloques con su forma, familia y
 * variante. Aquí se deduce todo del nombre (sufijos y prefijos de Minecraft)
 * sobre los bloques de la tabla de colores: basta para enseñar el flujo de
 * sugerencias, que en la demo nunca llega a guardarse.
 */
import { colorDe, distanciaColor, nombreDe, propiedadesTexto } from './colores.js';

/** Sufijo → forma, de más largo a más corto. */
const FORMAS = [
  ['_pressure_plate', 'placaPresion'],
  ['_fence_gate', 'puertaValla'],
  ['_trapdoor', 'trampilla'],
  ['_stairs', 'escalera'],
  ['_button', 'boton'],
  ['_carpet', 'alfombra'],
  ['_fence', 'valla'],
  ['_slab', 'losa'],
  ['_wall', 'muro'],
  ['_door', 'puerta'],
  ['_pane', 'panel'],
];
/** Bloques que no son cubos ni de las formas de arriba. */
const OTROS =
  /(torch|sign|rail|banner|head|skull|sapling|flower(?!ing)|tulip|(?<!sea_)lantern|chain|bars|rod|_bed$|chest|pot|candle|^short_grass|^tall_grass|^grass$|fern|vine|lever|wire|repeater|comparator|ladder|hopper|bell|anvil|bush|coral(?!_block)|mushroom$|seagrass|kelp(?!_block)|lichen)/;
const NO_SUGERIBLES = /^(air|cave_air|void_air|water|lava|.*chest|barrier|bedrock|spawner|command_block|structure_.*|jigsaw|light)$/;

const VARIANTES = [
  ['polished_', 'pulido'],
  ['smooth_', 'liso'],
  ['cut_', 'cortado'],
  ['chiseled_', 'cincelado'],
  ['cracked_', 'agrietado'],
  ['mossy_', 'musgoso'],
  ['stripped_', 'descortezado'],
];
const SUFIJOS_VARIANTE = [
  ['_bricks', 'ladrillo'],
  ['_brick', 'ladrillo'],
  ['_tiles', 'baldosa'],
  ['_tile', 'baldosa'],
  ['_planks', ''],
  ['_log', 'tronco'],
  ['_wood', 'madera'],
  ['_block', ''],
];

const sinNamespace = (nombre) => nombre.replace(/^[^:]+:/, '');

export function formaDe(nombre) {
  const id = sinNamespace(nombre);
  for (const [sufijo, forma] of FORMAS) if (id.endsWith(sufijo)) return forma;
  return OTROS.test(id) ? 'otro' : 'entero';
}

/** Familia y variante a partir del nombre: `polished_blackstone_brick_stairs` → blackstone, [pulido, ladrillo]. */
export function familiaDe(nombre) {
  let id = sinNamespace(nombre);
  for (const [sufijo] of FORMAS) if (id.endsWith(sufijo)) id = id.slice(0, -sufijo.length);
  const variante = [];
  for (const [prefijo, etiqueta] of VARIANTES) {
    if (id.startsWith(prefijo)) {
      id = id.slice(prefijo.length);
      variante.push(etiqueta);
    }
  }
  for (const [sufijo, etiqueta] of SUFIJOS_VARIANTE) {
    if (id.endsWith(sufijo) && id.length > sufijo.length) {
      id = id.slice(0, -sufijo.length);
      if (etiqueta) variante.push(etiqueta);
      break;
    }
  }
  const forma = formaDe(nombre);
  return {
    familia: id,
    variante,
    nombreVariante: variante.length ? variante.join('+') : 'base',
    forma,
    sugerible: forma !== 'otro' && !NO_SUGERIBLES.test(sinNamespace(nombre)),
  };
}

/** Estado destino con las propiedades del origen si las dos son de la misma forma. */
function conservando(destino, estadoOrigen) {
  const mismaForma = formaDe(destino) === formaDe(nombreDe(estadoOrigen));
  return mismaForma ? `${destino}${propiedadesTexto(estadoOrigen)}` : destino;
}

/** Catálogo: los bloques de la tabla de colores, agrupados por familia. */
function familias(tabla) {
  const grupos = new Map();
  for (const id of Object.keys(tabla)) {
    const info = familiaDe(id);
    if (!info.sugerible) continue;
    if (!grupos.has(info.familia)) grupos.set(info.familia, []);
    grupos.get(info.familia).push({ id, forma: info.forma, variante: info.variante, sugerible: true });
  }
  return grupos;
}

const colorMedio = (tabla, miembros) => {
  const suma = [0, 0, 0];
  for (const m of miembros) colorDe(tabla, m.id).forEach((v, i) => (suma[i] += v));
  return suma.map((v) => Math.round(v / miembros.length));
};

export function parecidos(tabla, estado, n = 12) {
  const nombre = nombreDe(estado);
  const forma = formaDe(nombre);
  const color = colorDe(tabla, nombre);
  return Object.keys(tabla)
    .filter((id) => id !== nombre && formaDe(id) === forma && familiaDe(id).sugerible)
    .map((id) => ({
      id,
      estado: conservando(id, estado),
      forma,
      familia: familiaDe(id).familia,
      color: colorDe(tabla, id),
      distancia: distanciaColor(color, colorDe(tabla, id)),
    }))
    .sort((a, b) => a.distancia - b.distancia)
    .slice(0, Math.min(n ?? 12, 100));
}

export function familiasParecidas(tabla, familia, n = 12) {
  const grupos = familias(tabla);
  const origen = grupos.get(familia);
  if (!origen) return [];
  const colorOrigen = colorMedio(tabla, origen);
  const formasOrigen = new Set(origen.map((m) => m.forma));
  const variantesOrigen = new Set(origen.map((m) => m.variante.join('+')));
  return [...grupos]
    .filter(([nombre]) => nombre !== familia)
    .map(([nombre, miembros]) => {
      const color = colorMedio(tabla, miembros);
      const distancia = distanciaColor(colorOrigen, color);
      const formasComunes = new Set(miembros.map((m) => m.forma).filter((x) => formasOrigen.has(x))).size;
      const variantes = new Set(miembros.map((m) => m.variante.join('+')));
      const variantesComunes =
        [...variantesOrigen].filter((v) => variantes.has(v)).length / variantesOrigen.size;
      const puntuacion = distancia * (2 - formasComunes / formasOrigen.size) * (2 - variantesComunes);
      return { familia: nombre, color, distancia, formasComunes, variantesComunes, puntuacion, miembros };
    })
    .filter((f) => f.formasComunes > 0)
    .sort((a, b) => a.puntuacion - b.puntuacion)
    .slice(0, Math.min(n ?? 12, 100));
}

/** `{ estado: cantidad }` de los presentes → los de una familia, ordenados. */
export function miembrosFamilia(cuentas, familia) {
  return [...cuentas]
    .filter(([estado]) => familiaDe(nombreDe(estado)).familia === familia)
    .map(([estado, cantidad]) => ({ estado, cantidad }))
    .sort((a, b) => a.estado.localeCompare(b.estado));
}

export function planFamilia(tabla, cuentas, familiaOrigen, familiaDestino) {
  const destino = familias(tabla).get(familiaDestino) ?? [];
  const plan = [];
  for (const { estado } of miembrosFamilia(cuentas, familiaOrigen)) {
    const info = familiaDe(nombreDe(estado));
    const clave = info.variante.join('+');
    const elegido =
      destino.find((m) => m.forma === info.forma && m.variante.join('+') === clave) ??
      destino.find((m) => m.forma === info.forma);
    if (elegido) plan.push({ estadoOrigen: estado, estadoDestino: conservando(elegido.id, estado) });
  }
  return plan;
}

export function destinosConservando(estadoDestino, estadosOrigen) {
  const destino = nombreDe(estadoDestino);
  return estadosOrigen.map((estadoOrigen) => ({
    estadoOrigen,
    estadoDestino: conservando(destino, estadoOrigen),
  }));
}
