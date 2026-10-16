/**
 * Contacto en forma de chat privado del juego: pide nombre, email y mensaje y
 * lo manda a /api/contacto (función de Vercel con Resend).
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
import { useEffect, useRef, useState } from 'react';
import { EMAIL } from '../data/profile';

const YO = 'Ángel';
const RETARDO = 700; // lo que «tarda» Ángel en contestar, en ms
const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* Lo que se pide en cada paso. Los máximos son los mismos que en api/contacto.js. */
const PASOS = {
  nombre: { etiqueta: 'Tu nombre', max: 60, tipo: 'text', autocompletar: 'name', pista: 'Escribe tu nombre' },
  email: { etiqueta: 'Tu email', max: 254, tipo: 'email', autocompletar: 'email', pista: 'tu@email.com' },
  mensaje: { etiqueta: 'Tu mensaje', max: 1000, tipo: 'text', autocompletar: 'off', pista: 'Escribe tu mensaje' },
};
const PISTAS = { enviando: 'Enviando…', hecho: 'Mensaje enviado' };

/** Pone el cursor en la línea de escribir; lo usa el botón «Escríbeme» de la portada. */
export function enfocarChat() {
  // Después del scroll suave hasta #contacto; preventScroll para que no dé un salto.
  setTimeout(() => document.getElementById('chat-entrada')?.focus({ preventScroll: true }), 450);
}

let siguienteId = 0;

export default function ChatContacto() {
  const [lineas, setLineas] = useState([]);
  // espera → nombre → email → mensaje → enviando → hecho | error
  const [paso, setPaso] = useState('espera');
  const [texto, setTexto] = useState('');
  const datos = useRef({ nombre: '', email: '', mensaje: '' });
  const inicio = useRef(0);
  const empezado = useRef(false);
  const vivo = useRef(true);
  const caja = useRef(null);
  const registro = useRef(null);

  const decir = (partes) => setLineas((l) => [...l, { id: siguienteId++, partes }]);
  const susurra = (t) => decir([{ color: 'gris', t: `${YO} te susurra: ${t}`, cursiva: true }]);
  const tras = (fn) => setTimeout(() => vivo.current && fn(), RETARDO);

  /** Ángel entra y saluda; una sola vez, aunque la llamen el scroll y el foco. */
  function empezar() {
    if (empezado.current) return;
    empezado.current = true;
    inicio.current = Date.now();
    decir([{ color: 'amarillo', t: `${YO} se ha unido a la partida` }]);
    tras(() => {
      susurra('¡Hola! ¿Cómo te llamas?');
      setPaso('nombre');
    });
  }

  useEffect(() => {
    vivo.current = true;
    const observador = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) empezar();
      },
      { threshold: 0.4 }
    );
    observador.observe(caja.current);
    return () => {
      vivo.current = false;
      observador.disconnect();
    };
  }, []);

  // Las líneas nuevas entran por abajo, como en el juego.
  useEffect(() => {
    const el = registro.current;
    el.scrollTop = el.scrollHeight;
  }, [lineas]);

  async function mandar() {
    setPaso('enviando');
    try {
      const respuesta = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...datos.current, ms: Date.now() - inicio.current }),
        signal: AbortSignal.timeout(10000),
      });
      if (!respuesta.ok) throw new Error(String(respuesta.status));
      tras(() => {
        susurra(`¡Recibido! Te contesto en ${datos.current.email} lo antes posible.`);
        decir([
          { color: 'blanco', t: `${datos.current.nombre} ha conseguido el logro ` },
          { color: 'verde', t: '[Primer contacto]' },
        ]);
        setPaso('hecho');
      });
    } catch {
      if (!vivo.current) return;
      decir([{ color: 'rojo', t: 'No se ha podido enviar el mensaje.' }]);
      setPaso('error');
    }
  }

  function enviar(evento) {
    evento.preventDefault();
    const t = texto.trim();
    if (!t || !(paso in PASOS)) return;
    setTexto('');
    decir([{ color: 'gris', t: `Le susurras a ${YO}: ${t}`, cursiva: true }]);

    if (paso === 'nombre') {
      datos.current.nombre = t;
      setPaso('espera');
      tras(() => {
        susurra(`Encantado, ${t}. ¿A qué email te respondo?`);
        setPaso('email');
      });
    } else if (paso === 'email') {
      if (!EMAIL_VALIDO.test(t)) {
        decir([{ color: 'rojo', t: 'Ese email no parece válido. Prueba otra vez.' }]);
        return;
      }
      datos.current.email = t;
      setPaso('espera');
      tras(() => {
        susurra('Perfecto. ¿Qué me quieres contar?');
        setPaso('mensaje');
      });
    } else {
      datos.current.mensaje = t;
      mandar();
    }
  }

  const actual = PASOS[paso];
  const { nombre, mensaje } = datos.current;
  const correo = `mailto:${EMAIL}?subject=${encodeURIComponent(`Portfolio · ${nombre}`)}&body=${encodeURIComponent(mensaje)}`;

  return (
    <div ref={caja}>
      <div ref={registro} role="log" aria-live="polite" aria-label={`Chat con ${YO}`} className="mc-chat-registro no-scrollbar">
        <div className="flex min-h-full flex-col justify-end gap-1">
          {lineas.map((linea) => (
            <p key={linea.id} className="animate-asomar break-words motion-reduce:animate-none">
              {linea.partes.map((parte, i) => (
                <span key={i} className={`mc-chat-${parte.color}${parte.cursiva ? ' italic' : ''}`}>
                  {parte.t}
                </span>
              ))}
            </p>
          ))}
        </div>
      </div>

      {paso === 'error' && (
        <div className="mt-2 flex flex-wrap gap-2">
          <button type="button" onClick={mandar} className="mc-boton mc-boton-peque">
            Reintentar
          </button>
          <a href={correo} className="mc-boton mc-boton-peque">
            Abrir mi correo
          </a>
        </div>
      )}

      <form onSubmit={enviar} noValidate className="mc-chat-entrada">
        <span aria-hidden="true" className="mc-chat-gris hidden shrink-0 sm:inline">
          /msg {YO}
        </span>
        <input
          id="chat-entrada"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onFocus={empezar}
          type={actual?.tipo ?? 'text'}
          maxLength={actual?.max ?? 1000}
          autoComplete={actual?.autocompletar ?? 'off'}
          aria-label={actual?.etiqueta ?? `Chat con ${YO}`}
          placeholder={actual?.pista ?? PISTAS[paso] ?? ''}
          disabled={paso === 'enviando' || paso === 'hecho' || paso === 'error'}
          enterKeyHint="send"
          spellCheck={paso === 'mensaje'}
        />
        <button type="submit" disabled={!actual || !texto.trim()} className="mc-boton mc-boton-peque shrink-0">
          Enviar
        </button>
      </form>

      <p className="mt-3 text-[13px] leading-relaxed text-mc-suave">
        Tu nombre, tu email y tu mensaje solo se usan para contestarte: me llegan por correo a través de Resend.
      </p>
    </div>
  );
}
