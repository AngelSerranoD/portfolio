/**
 * DailyWeigh — cálculo de pesos y medias.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 *
 * `pesos` es siempre un objeto { 'AAAA-MM-DD': kilos }. Un día sin peso
 * simplemente no está: las medias se calculan solo sobre los días escritos.
 */
import { ES_CLAVE, inicioSemana } from './fechas.js';

export const PESO_MIN = 20;
export const PESO_MAX = 350;

const redondear = (kilos) => Math.round(kilos * 10) / 10;

export const pesoValido = (kilos) =>
  typeof kilos === 'number' && Number.isFinite(kilos) && kilos >= PESO_MIN && kilos <= PESO_MAX;

/** Acepta '72,4' o '72.4'. Devuelve kilos con un decimal, o null si no vale. */
export function parsearPeso(texto) {
  if (typeof texto !== 'string') return null;
  const limpio = texto.trim().replace(',', '.');
  if (!/^\d{1,3}(\.\d*)?$/.test(limpio)) return null;
  const kilos = redondear(Number(limpio));
  return pesoValido(kilos) ? kilos : null;
}

/**
 * Lo que se deja escribir en el campo: hasta 3 cifras, coma y un decimal.
 * Recorta en vez de rechazar, para que pegar '72.46' deje '72,4' y no nada.
 */
export function limpiarTecleo(texto) {
  const [entero = '', ...resto] = texto.replace(/\./g, ',').replace(/[^\d,]/g, '').split(',');
  const cifras = entero.slice(0, 3);
  return resto.length ? `${cifras},${resto.join('').slice(0, 1)}` : cifras;
}

/** 72.4 → '72,4' */
export const formatoPeso = (kilos) => redondear(kilos).toFixed(1).replace('.', ',');

export const limitarPeso = (kilos) => redondear(Math.min(PESO_MAX, Math.max(PESO_MIN, kilos)));

/**
 * Diferencia lista para mostrar: { flecha: '↓', texto: '0,4', sentido: 'baja' }.
 * Menos de 0,05 kg cuenta como igual, que es lo que se ve con un decimal.
 */
export function describirDiferencia(kilos) {
  if (Math.abs(kilos) < 0.05) return { flecha: '=', texto: '0,0', sentido: 'igual' };
  return {
    flecha: kilos < 0 ? '↓' : '↑',
    texto: formatoPeso(Math.abs(kilos)),
    sentido: kilos < 0 ? 'baja' : 'sube',
  };
}

/**
 * Diferencia entre dos medias tal y como se leen en pantalla: 75,7 y 75,1
 * tienen que dar 0,6 aunque sin redondear salga 0,54.
 */
export const diferenciaDeMedias = (media, anterior) => describirDiferencia(redondear(media) - redondear(anterior));

/** Media de los días que tienen peso. null si ninguno lo tiene. */
export function mediaDe(claves, pesos) {
  const valores = claves.map((c) => pesos[c]).filter((v) => v != null);
  if (valores.length === 0) return null;
  return { media: valores.reduce((a, b) => a + b, 0) / valores.length, dias: valores.length };
}

/** Todas las semanas con algún peso, de la más reciente a la más antigua. */
export function resumenSemanas(pesos) {
  const porSemana = new Map();
  for (const [clave, kilos] of Object.entries(pesos)) {
    const lunes = inicioSemana(clave);
    const acumulado = porSemana.get(lunes) ?? { suma: 0, dias: 0 };
    acumulado.suma += kilos;
    acumulado.dias += 1;
    porSemana.set(lunes, acumulado);
  }
  return [...porSemana.entries()]
    .map(([lunes, { suma, dias }]) => ({ lunes, media: suma / dias, dias }))
    .sort((a, b) => (a.lunes < b.lunes ? 1 : -1));
}

/** Último registro anterior al día dado: { clave, kilos } o null. */
export function pesoAnterior(clave, pesos) {
  let mejor = null;
  for (const otra of Object.keys(pesos)) {
    if (otra < clave && (mejor === null || otra > mejor)) mejor = otra;
  }
  return mejor === null ? null : { clave: mejor, kilos: pesos[mejor] };
}

/** Registro más cercano a un día, antes o después: sirve de punto de partida al teclear. */
export function pesoDeReferencia(clave, pesos) {
  const anterior = pesoAnterior(clave, pesos);
  if (anterior) return anterior;
  const posteriores = Object.keys(pesos).filter((c) => c > clave).sort();
  return posteriores.length ? { clave: posteriores[0], kilos: pesos[posteriores[0]] } : null;
}

/** Se queda solo con las entradas bien formadas. Nunca lanza. */
export function limpiarPesos(bruto) {
  const pesos = {};
  if (!bruto || typeof bruto !== 'object' || Array.isArray(bruto)) return pesos;
  for (const [clave, kilos] of Object.entries(bruto)) {
    if (ES_CLAVE.test(clave) && pesoValido(kilos)) pesos[clave] = redondear(kilos);
  }
  return pesos;
}
