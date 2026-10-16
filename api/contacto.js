/**
 * Función de Vercel: recibe el chat de contacto de la portada y me lo manda por
 * correo con Resend. Necesita RESEND_API_KEY en las variables del proyecto.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
import { createHmac, timingSafeEqual } from 'node:crypto';
import { EMAIL } from '../src/data/profile.js';

/* Solo se aceptan envíos desde la web; localhost solo fuera de producción. */
const ORIGENES = /^https:\/\/(www\.)?aserrano\.dev$/;
const ORIGEN_LOCAL = /^http:\/\/localhost:\d+$/;
const origenValido = (origen) =>
  ORIGENES.test(origen) || (process.env.VERCEL_ENV !== 'production' && ORIGEN_LOCAL.test(origen));
const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/* El token de «inicio» lo firma el servidor: menos de MINIMO_MS desde que se pidió no lo hace una
   persona, y pasada una hora caduca. */
const MINIMO_MS = 4000;
const MAXIMO_MS = 60 * 60 * 1000;
const MAX_BYTES = 6000;
/* Límite por IP, solo dentro de la instancia (el límite real va en el cortafuegos de Vercel). */
const MAX_ENVIOS = 3;
const VENTANA_MS = 10 * 60 * 1000;
const envios = new Map();

const firmar = (marca) => createHmac('sha256', process.env.RESEND_API_KEY ?? '').update(String(marca)).digest('hex');

function tokenValido(token) {
  if (typeof token !== 'string') return false;
  const [marca, firma = ''] = token.split('.');
  const esperada = firmar(marca);
  if (firma.length !== esperada.length || !timingSafeEqual(Buffer.from(firma), Buffer.from(esperada))) return false;
  const edad = Date.now() - Number(marca);
  return edad >= MINIMO_MS && edad <= MAXIMO_MS;
}

function excedeLimite(ip) {
  const ahora = Date.now();
  const recientes = (envios.get(ip) ?? []).filter((t) => ahora - t < VENTANA_MS);
  recientes.push(ahora);
  envios.set(ip, recientes);
  if (envios.size > 500) for (const [clave, lista] of envios) if (ahora - lista[lista.length - 1] > VENTANA_MS) envios.delete(clave);
  return recientes.length > MAX_ENVIOS;
}

const responder = (estado, datos) => Response.json(datos, { status: estado });

/** Quita caracteres de control y espacios de los bordes; si se pasa del máximo, nada. */
function limpiar(valor, max) {
  if (typeof valor !== 'string') return '';
  const texto = valor.replace(/[\u0000-\u001F\u007F]/g, '').trim();
  return texto.length <= max ? texto : '';
}

export async function POST(request) {
  if (!origenValido(request.headers.get('origin') ?? '')) return responder(403, { error: 'origen' });
  if (Number(request.headers.get('content-length') ?? 0) > MAX_BYTES) return responder(413, { error: 'tamano' });

  let cuerpo;
  try {
    cuerpo = await request.json();
  } catch {
    return responder(400, { error: 'datos' });
  }

  // El saludo del chat pide un token; sin RESEND_API_KEY no se puede firmar ni enviar.
  if (cuerpo?.accion === 'inicio') {
    if (!process.env.RESEND_API_KEY) return responder(500, { error: 'config' });
    const marca = Date.now();
    return responder(200, { token: `${marca}.${firmar(marca)}` });
  }

  const nombre = limpiar(cuerpo?.nombre, 60);
  const email = limpiar(cuerpo?.email, 254);
  const mensaje = limpiar(cuerpo?.mensaje, 1000);
  if (!nombre || !mensaje || !EMAIL_VALIDO.test(email)) return responder(400, { error: 'datos' });

  const clave = process.env.RESEND_API_KEY;
  if (!clave) {
    console.error('Falta RESEND_API_KEY');
    return responder(500, { error: 'config' });
  }

  // Un robot (o un token falso o caducado): se le dice que sí y no se manda nada.
  if (!tokenValido(cuerpo.token)) return responder(200, { ok: true });

  const ip = request.headers.get('x-real-ip') ?? request.headers.get('x-forwarded-for')?.split(',')[0] ?? '';
  if (excedeLimite(ip)) return responder(429, { error: 'limite' });

  const respuesta = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${clave}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.CONTACTO_REMITENTE || 'Portfolio <onboarding@resend.dev>',
      to: [EMAIL],
      reply_to: email,
      subject: `Portfolio · ${nombre}`,
      text: `${nombre} <${email}> te escribe desde el chat del portfolio:\n\n${mensaje}`,
    }),
  });
  if (!respuesta.ok) {
    console.error('Resend', respuesta.status, await respuesta.text());
    return responder(502, { error: 'envio' });
  }
  return responder(200, { ok: true });
}
