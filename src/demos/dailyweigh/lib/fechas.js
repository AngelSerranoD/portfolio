/**
 * DailyWeigh — utilidades de fecha.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 *
 * Cada día se identifica con una clave local 'AAAA-MM-DD'. Nunca con
 * toISOString(): convierte a UTC, y a las 00:30 en Madrid devolvería el día
 * anterior. Las claves se ordenan como texto igual que como fechas.
 *
 * Los nombres de días y meses van escritos a mano en vez de pedírselos a Intl:
 * Safari y Chrome no abrevian igual ('sep' / 'sept.') y así se ve idéntico.
 */

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];
const MESES_CORTOS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

/** Iniciales de lunes a domingo (X para el miércoles, como en los calendarios). */
export const INICIALES = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

export const ES_CLAVE = /^\d{4}-\d{2}-\d{2}$/;

const dos = (n) => String(n).padStart(2, '0');

export function claveDia(fecha = new Date()) {
  return `${fecha.getFullYear()}-${dos(fecha.getMonth() + 1)}-${dos(fecha.getDate())}`;
}

/** A mediodía: sumar días nunca salta de fecha por un cambio de hora. */
export function fechaDeClave(clave) {
  const [anio, mes, dia] = clave.split('-').map(Number);
  return new Date(anio, mes - 1, dia, 12);
}

export function sumarDias(clave, dias) {
  const fecha = fechaDeClave(clave);
  fecha.setDate(fecha.getDate() + dias);
  return claveDia(fecha);
}

/** Días naturales de `desde` a `hasta` (negativo si `hasta` es anterior). */
export function diasEntre(desde, hasta) {
  return Math.round((fechaDeClave(hasta) - fechaDeClave(desde)) / 86_400_000);
}

/** Lunes de la semana del día (la semana empieza en lunes). */
export function inicioSemana(clave) {
  const diaSemana = fechaDeClave(clave).getDay(); // 0 = domingo
  return sumarDias(clave, -((diaSemana + 6) % 7));
}

export function diasDeSemana(lunes) {
  return Array.from({ length: 7 }, (_, i) => sumarDias(lunes, i));
}

/** Buenos días de 6:00 a 13:59, buenas tardes hasta las 20:59, y buenas noches. */
export function saludo(fecha = new Date()) {
  const hora = fecha.getHours();
  if (hora >= 6 && hora < 14) return 'Buenos días';
  if (hora >= 14 && hora < 21) return 'Buenas tardes';
  return 'Buenas noches';
}

export const capitalizar = (texto) => texto.charAt(0).toUpperCase() + texto.slice(1);

/** 'miércoles, 16 de septiembre' */
export function fechaLarga(clave) {
  const f = fechaDeClave(clave);
  return `${DIAS[f.getDay()]}, ${f.getDate()} de ${MESES[f.getMonth()]}`;
}

/** 'miércoles 16 sep', con el año si no es el de `anioActual`. */
export function fechaCorta(clave, anioActual) {
  const f = fechaDeClave(clave);
  const anio = anioActual != null && f.getFullYear() !== anioActual ? ` ${f.getFullYear()}` : '';
  return `${DIAS[f.getDay()]} ${f.getDate()} ${MESES_CORTOS[f.getMonth()]}${anio}`;
}

/** 'hoy', 'ayer' o 'el lunes 14 sep': para frases del tipo «desde …». */
export function referenciaDia(clave, hoy) {
  const distancia = diasEntre(clave, hoy);
  if (distancia === 0) return 'hoy';
  if (distancia === 1) return 'ayer';
  return `el ${fechaCorta(clave, Number(hoy.slice(0, 4)))}`;
}

/** 'Hoy · miércoles 16 sep', 'Ayer · martes 15 sep' o 'Lunes 14 sep'. */
export function etiquetaDia(clave, hoy) {
  const corta = fechaCorta(clave, Number(hoy.slice(0, 4)));
  const distancia = diasEntre(clave, hoy);
  if (distancia === 0) return `Hoy · ${corta}`;
  if (distancia === 1) return `Ayer · ${corta}`;
  return capitalizar(corta);
}

/**
 * '14 – 20 sep' · '28 sep – 4 oct' · '29 dic 2025 – 4 ene 2026'.
 * Con año solo si la semana cruza de año o no es del año en curso.
 */
export function rangoSemana(lunes, anioActual) {
  const ini = fechaDeClave(lunes);
  const fin = fechaDeClave(sumarDias(lunes, 6));
  const mesIni = MESES_CORTOS[ini.getMonth()];
  const mesFin = MESES_CORTOS[fin.getMonth()];

  if (ini.getFullYear() !== fin.getFullYear()) {
    return `${ini.getDate()} ${mesIni} ${ini.getFullYear()} – ${fin.getDate()} ${mesFin} ${fin.getFullYear()}`;
  }
  const anio = ini.getFullYear() !== anioActual ? ` ${ini.getFullYear()}` : '';
  if (ini.getMonth() === fin.getMonth()) {
    return `${ini.getDate()} – ${fin.getDate()} ${mesFin}${anio}`;
  }
  return `${ini.getDate()} ${mesIni} – ${fin.getDate()} ${mesFin}${anio}`;
}
