/**
 * Demo de Ché boluda — el servicio local de la app con amigas simuladas.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 *
 * Es el mismo `crearServicioLocal` que usa la app sin Supabase, con tres cambios:
 *  - todo en memoria (no escribe en el localStorage de quien visita);
 *  - el bus entre pestañas es un simulador: Marta y Sofi "tienen la app
 *    abierta en otra pestaña", anuncian presencia, hablan en directo de vez en
 *    cuando y contestan cuando se les habla;
 *  - el micrófono es una voz sintética, así que no se pide permiso.
 */
import { crearServicioLocal } from '../lib/servicio/local.js';
import { crearCodificador, duracionMs, unirArchivo } from '../lib/audio/contenedor.js';
import { aBase64, formaDeOnda } from '../lib/audio/senal.js';
import { vozSintetica } from './vozSintetica.js';

const CLAVE = 'cheboluda:local:v1';
const CLAVE_SESION = 'cheboluda:local:yo';

const PERSONAS = {
  yo: { id: 'demo-lucia', usuario: 'lucia', nombre: 'Lucía', avatar: '🌸', voz: { tono: 235, semilla: 1 } },
  marta: { id: 'demo-marta', usuario: 'marta', nombre: 'Marta', avatar: '🍉', voz: { tono: 205, semilla: 2 } },
  sofi: { id: 'demo-sofi', usuario: 'sofi.g', nombre: 'Sofi', avatar: '🦋', voz: { tono: 255, semilla: 3 } },
  carla: { id: 'demo-carla', usuario: 'carla_22', nombre: 'Carla', avatar: '🧉', voz: { tono: 190, semilla: 4 } },
};
const POR_ID = Object.fromEntries(Object.values(PERSONAS).map((p) => [p.id, p]));

const SALAS = {
  chicas: 'a1b2c3d4-0000-4000-8000-000000000001',
  cadiz: 'a1b2c3d4-0000-4000-8000-000000000002',
  marta: 'a1b2c3d4-0000-4000-8000-000000000003',
};

/** Quién tiene la app abierta en cada sala (y contesta). */
const CONECTADAS = {
  [SALAS.chicas]: [PERSONAS.marta.id, PERSONAS.sofi.id],
  [SALAS.marta]: [PERSONAS.marta.id],
  [SALAS.cadiz]: [PERSONAS.sofi.id],
};

function memoria() {
  const datos = new Map();
  return { getItem: (k) => (datos.has(k) ? datos.get(k) : null), setItem: (k, v) => datos.set(k, String(v)), removeItem: (k) => datos.delete(k) };
}

function grabar(persona, segundos) {
  const pcm = vozSintetica(persona.voz, segundos);
  const codificador = crearCodificador();
  const bloques = [...codificador.añadir(pcm), codificador.terminar()].filter(Boolean);
  return { pcm, bloques, ms: duracionMs(codificador.muestras) };
}

function datosDeEjemplo(ahora) {
  const hace = (minutos) => new Date(ahora - minutos * 60_000).toISOString();
  const { yo, marta, sofi, carla } = PERSONAS;
  const db = { perfiles: {}, contrasenas: {}, codigos: {}, amistades: [], salas: {}, miembros: [], mensajes: [], audios: {} };

  Object.values(PERSONAS).forEach((p, i) => {
    db.perfiles[p.id] = { id: p.id, usuario: p.usuario, nombre: p.nombre, avatar: p.avatar, foto: null };
    db.codigos[p.id] = ['K7M2QX9P', 'H4TR8WNB', 'P3CZ6YDM', 'R9FJ2KVA'][i];
  });
  db.amistades = [marta, sofi, carla].map((p) => [yo.id, p.id]);

  const sala = (id, datos, miembros, leidoHace) => {
    db.salas[id] = { id, emoji: '📻', nombre: null, clave_directo: null, creado_por: yo.id, creado_en: hace(3000), ultima_actividad: hace(3000), ...datos };
    for (const p of miembros) {
      db.miembros.push({ sala_id: id, perfil_id: p.id, rol: p === yo ? 'admin' : 'miembro', silenciada: false, ultimo_leido: p === yo ? hace(leidoHace) : hace(0), unido_en: hace(3000) });
    }
  };
  sala(SALAS.chicas, { tipo: 'grupo', nombre: 'Las chicas', emoji: '💅' }, [yo, marta, sofi, carla], 30);
  sala(SALAS.cadiz, { tipo: 'grupo', nombre: 'Viaje a Cádiz', emoji: '🏖️' }, [yo, marta, sofi], 0);
  sala(SALAS.marta, { tipo: 'directo', clave_directo: [yo.id, marta.id].sort().join(':') }, [yo, marta], 15);

  const mensaje = (salaId, persona, segundos, minutos) => {
    const { pcm, bloques, ms } = grabar(persona, segundos);
    const id = crypto.randomUUID();
    const ruta = `${salaId}/${id}.cba`;
    db.audios[ruta] = aBase64(unirArchivo(bloques));
    db.mensajes.push({ id, sala_id: salaId, autor_id: persona.id, audio: ruta, duracion_ms: ms, onda: formaDeOnda(pcm), creado_en: hace(minutos) });
    db.salas[salaId].ultima_actividad = hace(minutos);
  };
  mensaje(SALAS.cadiz, sofi, 3.8, 1500);
  mensaje(SALAS.cadiz, yo, 2.2, 1490);
  mensaje(SALAS.chicas, carla, 3.1, 180);
  mensaje(SALAS.chicas, yo, 2.0, 170);
  mensaje(SALAS.marta, marta, 2.4, 60);
  mensaje(SALAS.marta, yo, 1.8, 58);
  mensaje(SALAS.chicas, marta, 2.6, 25);
  mensaje(SALAS.marta, marta, 2.9, 10);
  mensaje(SALAS.chicas, sofi, 3.4, 3);
  db.mensajes.sort((a, b) => (a.creado_en < b.creado_en ? -1 : 1));
  return db;
}

function crearSimulador(almacen) {
  const temporizadores = new Set();
  const hablando = new Set(); // salas con alguien simulado hablando
  let respuestas = 0;

  const luego = (ms, fn) => {
    const t = setTimeout(() => {
      temporizadores.delete(t);
      fn();
    }, ms);
    temporizadores.add(t);
  };

  const bus = {
    onmessage: null,
    postMessage(msg) {
      // La visitante suelta el botón: contesta alguien que tenga la app abierta.
      if (msg?.tipo !== 'voz' || msg.payload?.t !== 'fin' || msg.de !== PERSONAS.yo.id) return;
      const quien = (CONECTADAS[msg.sala] ?? [])[respuestas++ % 2] ?? CONECTADAS[msg.sala]?.[0];
      if (quien && !hablando.has(msg.sala)) luego(1300, () => hablar(msg.sala, POR_ID[quien], 1.8 + Math.random() * 1.4));
    },
    close() {
      temporizadores.forEach(clearTimeout);
      temporizadores.clear();
      clearInterval(latido);
    },
  };
  const entregar = (data) => bus.onmessage?.({ data });

  const latido = setInterval(() => {
    for (const [sala, quienes] of Object.entries(CONECTADAS)) quienes.forEach((quien) => entregar({ tipo: 'presente', sala, quien }));
  }, 2000);
  luego(50, () => {
    for (const [sala, quienes] of Object.entries(CONECTADAS)) quienes.forEach((quien) => entregar({ tipo: 'presente', sala, quien }));
  });

  function hablar(sala, persona, segundos) {
    hablando.add(sala);
    const id = crypto.randomUUID();
    const { pcm, bloques, ms } = grabar(persona, segundos);
    const voz = (payload) => entregar({ tipo: 'voz', sala, de: persona.id, payload: { ...payload, id, de: persona.id } });
    voz({ t: 'ini' });
    bloques.forEach((bloque, n) => luego(300 * n, () => voz({ t: 'voz', n, b: aBase64(bloque) })));
    luego(300 * bloques.length, () => {
      voz({ t: 'fin' });
      hablando.delete(sala);
      // Se guarda como haría la app de la amiga al soltar el botón.
      const db = JSON.parse(almacen.getItem(CLAVE));
      const ruta = `${sala}/${id}.cba`;
      const creado = new Date().toISOString();
      db.audios[ruta] = aBase64(unirArchivo(bloques));
      db.mensajes.push({ id, sala_id: sala, autor_id: persona.id, audio: ruta, duracion_ms: ms, onda: formaDeOnda(pcm), creado_en: creado });
      db.salas[sala].ultima_actividad = creado;
      almacen.setItem(CLAVE, JSON.stringify(db));
      entregar({ tipo: 'cambio', cambio: { tabla: 'mensajes', evento: 'INSERT', fila: { sala_id: sala } } });
    });
  }

  // Para que se vea el directo sin tener que hacer nada.
  luego(6000, () => hablar(SALAS.chicas, PERSONAS.sofi, 2.6));
  luego(40000, () => hablar(SALAS.marta, PERSONAS.marta, 2.2));

  return bus;
}

/** Micrófono de mentira: la voz de Lucía, a trozos de 50 ms como un micro real. */
function abrirMicrofono({ alPcm }) {
  let desde = 0;
  const id = setInterval(() => {
    const pcm = vozSintetica(PERSONAS.yo.voz, 0.05, desde);
    desde += pcm.length;
    alPcm(pcm);
  }, 50);
  return Promise.resolve({
    async cerrar() {
      clearInterval(id);
    },
  });
}

export function crearServicioDemo() {
  const almacen = memoria();
  almacen.setItem(CLAVE, JSON.stringify(datosDeEjemplo(Date.now())));
  const sesionTab = memoria();
  sesionTab.setItem(CLAVE_SESION, PERSONAS.yo.id);
  const base = crearServicioLocal({ almacen, sesionTab, bus: crearSimulador(almacen) });
  return { ...base, modo: 'demo', id: crypto.randomUUID(), abrirMicrofono };
}
