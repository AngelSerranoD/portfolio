/**
 * Demo de DailyWeigh — siete semanas de pesos inventados.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 *
 * Relativas a hoy, para que la demo siempre enseñe la semana en curso y un
 * historial. Azar con semilla fija: cada visita ve la misma serie. Hoy no
 * lleva peso, así que la hoja se abre sola como en la primera apertura del día.
 */
import { claveDia, diasEntre, inicioSemana, sumarDias } from './lib/fechas.js';

function azarConSemilla(semilla) {
  let estado = semilla;
  return () => {
    estado = (estado + 0x6d2b79f5) | 0;
    let t = Math.imul(estado ^ (estado >>> 15), 1 | estado);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function datosDeEjemplo(hoy = claveDia()) {
  const azar = azarConSemilla(20260916);
  const inicio = sumarDias(inicioSemana(hoy), -49);
  const dias = diasEntre(inicio, hoy); // hasta ayer
  const pesos = {};
  for (let i = 0; i < dias; i++) {
    const tendencia = 75.6 - (i / dias) * 2.8;
    const ruido = (azar() - 0.5) * 0.7;
    if (azar() < 0.16) continue; // algún día sin pesarse
    pesos[sumarDias(inicio, i)] = Math.round((tendencia + ruido) * 10) / 10;
  }
  return { pesos, ultimoAviso: null };
}
