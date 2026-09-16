/**
 * DailyWeigh — copia de seguridad en JSON.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 *
 * Los datos solo están en el iPhone: si se borra la app de la pantalla de
 * inicio, se van con ella. La copia es un archivo que se guarda donde se quiera.
 */
import { limpiarPesos } from './pesos.js';

export const FORMATO_COPIA = 1;

export function crearCopia(pesos, ahora = new Date()) {
  return {
    app: 'DailyWeigh',
    formato: FORMATO_COPIA,
    exportado: ahora.toISOString(),
    pesos,
  };
}

/** Lee el texto de un archivo de copia. Lanza Error con un mensaje para el usuario. */
export function leerCopia(texto) {
  let datos;
  try {
    datos = JSON.parse(texto);
  } catch {
    throw new Error('El archivo no es una copia de DailyWeigh.');
  }
  if (!datos || datos.app !== 'DailyWeigh' || typeof datos.pesos !== 'object') {
    throw new Error('El archivo no es una copia de DailyWeigh.');
  }
  if (datos.formato > FORMATO_COPIA) {
    throw new Error('La copia es de una versión más nueva de la app.');
  }
  return limpiarPesos(datos.pesos);
}

/**
 * Junta la copia con lo que ya hay. Lo de la copia manda en los días que
 * coinciden; los días que solo están en el iPhone se conservan.
 */
export function fusionar(actuales, importados) {
  let nuevos = 0;
  let distintos = 0;
  for (const [clave, kilos] of Object.entries(importados)) {
    if (!(clave in actuales)) nuevos += 1;
    else if (actuales[clave] !== kilos) distintos += 1;
  }
  return { pesos: { ...actuales, ...importados }, nuevos, distintos };
}
