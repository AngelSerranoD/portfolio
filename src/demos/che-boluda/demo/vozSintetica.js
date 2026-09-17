/**
 * Demo de Ché boluda — voces sintéticas.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 *
 * Un "murmullo" de sílabas: tono con entonación, armónicos filtrados por los
 * formantes de una vocal que cambia en cada sílaba, y pausas para respirar.
 * No dice nada, pero suena a alguien hablando por un walkie y no necesita
 * archivos de audio ni el micrófono de quien visita la demo.
 */

const FRECUENCIA = 16000;
const VOCALES = [
  [730, 1090], // a
  [270, 2290], // i
  [570, 840], // o
  [440, 1020], // u abierta
  [300, 870], // u
];

const campana = (f, centro, ancho) => Math.exp(-((f - centro) ** 2) / (2 * ancho * ancho));

/** PCM de 16 bits a 16 kHz. `desde` continúa la fase para ir generando a trozos. */
export function vozSintetica({ tono, semilla }, segundos, desde = 0) {
  const n = Math.round(segundos * FRECUENCIA);
  const pcm = new Int16Array(n);
  const ritmo = 3.2 + (semilla % 3) * 0.45; // sílabas por segundo
  const w1 = 0.6 + semilla * 0.07;
  const w2 = 4.7;
  const a1 = 0.1;
  const a2 = 0.04;

  for (let i = 0; i < n; i++) {
    const t = (desde + i) / FRECUENCIA;
    // Fase integrada: el tono sube y baja sin chasquidos entre trozos.
    const fase = 2 * Math.PI * tono * t - ((tono * a1) / w1) * Math.cos(2 * Math.PI * w1 * t + semilla) - ((tono * a2) / w2) * Math.cos(2 * Math.PI * w2 * t);
    const f0 = tono * (1 + a1 * Math.sin(2 * Math.PI * w1 * t + semilla) + a2 * Math.sin(2 * Math.PI * w2 * t));

    const silaba = Math.floor(t * ritmo + semilla);
    const [f1, f2] = VOCALES[(silaba * 7 + semilla) % VOCALES.length];
    let s = 0;
    for (let k = 1; k * f0 < 3400; k++) {
      const fk = k * f0;
      s += (Math.sin(k * fase) * (campana(fk, f1, 110) + 0.6 * campana(fk, f2, 160) + 0.08)) / Math.sqrt(k);
    }

    const dentro = (t * ritmo + semilla) % 1;
    const envolvente = Math.max(0, Math.sin(Math.PI * Math.min(1, dentro / 0.85))) ** 0.8;
    const respiro = Math.sin(2 * Math.PI * 0.23 * t + semilla * 1.7) > -0.75 ? 1 : 0.05;
    pcm[i] = Math.max(-32768, Math.min(32767, Math.round(s * envolvente * respiro * 4200)));
  }
  return pcm;
}
