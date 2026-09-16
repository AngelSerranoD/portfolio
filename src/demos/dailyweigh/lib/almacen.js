/**
 * DailyWeigh — persistencia en el propio dispositivo.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 *
 * Sin servidor: los pesos viven en el localStorage de la app instalada.
 * El almacén es inyectable para que la demo del portfolio use uno en memoria.
 */
import { ES_CLAVE } from './fechas.js';
import { limpiarPesos } from './pesos.js';

export const CLAVE_ALMACEN = 'dailyweigh:v1';

const vacio = () => ({ pesos: {}, ultimoAviso: null });

/**
 * `ultimoAviso` es el último día en que la app abrió sola la hoja de peso.
 * Así solo se ofrece una vez al día aunque se cierre sin guardar.
 */
export function normalizar(datos) {
  if (!datos || typeof datos !== 'object') return vacio();
  return {
    pesos: limpiarPesos(datos.pesos),
    ultimoAviso: typeof datos.ultimoAviso === 'string' && ES_CLAVE.test(datos.ultimoAviso)
      ? datos.ultimoAviso
      : null,
  };
}

export function crearAlmacenLocal(clave = CLAVE_ALMACEN) {
  return {
    /** Pide al navegador que no borre los datos cuando ande corto de espacio. */
    persistir() {
      try {
        navigator.storage?.persist?.().catch(() => {});
      } catch { /* no disponible */ }
    },
    leer() {
      let bruto = null;
      try {
        bruto = localStorage.getItem(clave);
        return bruto === null ? vacio() : normalizar(JSON.parse(bruto));
      } catch {
        // Datos ilegibles: se apartan antes de que el próximo guardado los pise.
        try {
          if (bruto !== null) localStorage.setItem(`${clave}:ilegible:${Date.now()}`, bruto);
        } catch { /* sin espacio ni para eso */ }
        return vacio();
      }
    },
    guardar(datos) {
      try {
        localStorage.setItem(clave, JSON.stringify(datos));
        return true;
      } catch {
        return false;
      }
    },
  };
}

export function crearAlmacenMemoria(inicial) {
  let datos = normalizar(inicial);
  return {
    leer: () => structuredClone(datos),
    guardar(nuevos) {
      datos = structuredClone(nuevos);
      return true;
    },
  };
}
