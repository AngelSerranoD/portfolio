/**
 * Función de Vercel: recibe el chat de contacto de la portada y me lo manda por
 * correo con Resend. Necesita RESEND_API_KEY en las variables del proyecto.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
import { EMAIL } from '../src/data/profile.js';

/* Solo se aceptan envíos desde la web, sus vistas previas y el servidor local. */
const ORIGENES = /^(https:\/\/(www\.)?aserrano\.dev|https:\/\/portfolio-[a-z0-9-]+\.vercel\.app|http:\/\/localhost:\d+)$/;
const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/* Menos de esto entre el saludo y el envío no lo hace una persona. */
const MINIMO_MS = 4000;

const responder = (estado, datos) => Response.json(datos, { status: estado });

/** Quita caracteres de control y espacios de los bordes; si se pasa del máximo, nada. */
function limpiar(valor, max) {
  if (typeof valor !== 'string') return '';
  const texto = valor.replace(/[\u0000-\u001F\u007F]/g, '').trim();
  return texto.length <= max ? texto : '';
}

export async function POST(request) {
  if (!ORIGENES.test(request.headers.get('origin') ?? '')) return responder(403, { error: 'origen' });

  let cuerpo;
  try {
    cuerpo = await request.json();
  } catch {
    return responder(400, { error: 'datos' });
  }

  const nombre = limpiar(cuerpo?.nombre, 60);
  const email = limpiar(cuerpo?.email, 254);
  const mensaje = limpiar(cuerpo?.mensaje, 1000);
  if (!nombre || !mensaje || !EMAIL_VALIDO.test(email)) return responder(400, { error: 'datos' });

  // Un robot: se le dice que sí y no se manda nada.
  if (!(Number(cuerpo.ms) >= MINIMO_MS)) return responder(200, { ok: true });

  const clave = process.env.RESEND_API_KEY;
  if (!clave) {
    console.error('Falta RESEND_API_KEY');
    return responder(500, { error: 'config' });
  }

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
