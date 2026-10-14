/**
 * Demo de Schematic Lab — colores planos de los bloques, como el núcleo sin
 * jar de Minecraft (src-tauri/src/malla/apariencia.rs).
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 *
 * La tabla `colores_bloques.json` la vuelca el propio núcleo; lo que no está
 * en ella cae a `colorHash`, port fiel de `color_hash` (FNV-1a → HSL) con la
 * aritmética en f32 de Rust (`Math.fround`).
 */
const f = Math.fround;

function hslARgb(h, s, l) {
  const c = f(f(1 - Math.abs(f(f(2 * l) - 1))) * s);
  const hp = f(h / 60);
  const x = f(c * f(1 - Math.abs(f(f(hp % 2) - 1))));
  const [r, g, b] = [
    [c, x, 0],
    [x, c, 0],
    [0, c, x],
    [0, x, c],
    [x, 0, c],
  ][Math.trunc(hp)] ?? [c, 0, x];
  const m = f(l - f(c / 2));
  const canal = (v) => Math.min(255, Math.max(0, Math.round(f(f(v + m) * 255))));
  return [canal(r), canal(g), canal(b)];
}

/** Color estable a partir del nombre (`color_hash` en Rust). */
export function colorHash(nombre) {
  let h = 0x811c9dc5;
  for (const byte of new TextEncoder().encode(nombre)) {
    h = Math.imul((h ^ byte) >>> 0, 0x01000193) >>> 0;
  }
  const tono = f(h % 360);
  const saturacion = f(f(0.35) + f(f((h >>> 9) % 30) / 100));
  const luz = f(f(0.4) + f(f((h >>> 17) % 25) / 100));
  return hslARgb(tono, saturacion, luz);
}

/** `minecraft:oak_stairs[facing=north]` → `minecraft:oak_stairs`. */
export function nombreDe(estado) {
  const i = estado.indexOf('[');
  return i < 0 ? estado : estado.slice(0, i);
}

/** `…[facing=north,half=top]` → `[facing=north,half=top]` (o cadena vacía). */
export function propiedadesTexto(estado) {
  const i = estado.indexOf('[');
  return i < 0 ? '' : estado.slice(i);
}

export function propiedadesDe(estado) {
  const texto = propiedadesTexto(estado).slice(1, -1);
  if (!texto) return {};
  return Object.fromEntries(texto.split(',').map((par) => par.split('=')));
}

/**
 * Normaliza un block state como `validar_estado` en lo esencial: namespace
 * `minecraft:` por defecto y solo caracteres válidos. `null` si no vale.
 */
export function validarEstado(estado) {
  const limpio = String(estado ?? '').trim();
  const conNamespace = limpio.includes(':') ? limpio : `minecraft:${limpio}`;
  return /^[a-z0-9_.-]+:[a-z0-9_./-]+(\[[a-z0-9_]+=[a-z0-9_]+(,[a-z0-9_]+=[a-z0-9_]+)*\])?$/.test(conNamespace)
    ? conNamespace
    : null;
}

/** Color de un bloque por su nombre sin propiedades (`color_de`). */
export const colorDe = (tabla, nombre) => tabla[nombre] ?? colorHash(nombre);

/** sRGB 0..255 → OKLab (para ordenar parecidos por color). */
export function oklab([r, g, b]) {
  const lineal = (v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const [lr, lg, lb] = [lineal(r), lineal(g), lineal(b)];
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

export function distanciaColor(a, b) {
  const [x, y] = [oklab(a), oklab(b)];
  return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]);
}
