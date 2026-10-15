/**
 * Capa de píxeles que tapa la miniatura de un proyecto y se desmorona.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 *
 * Todo vive en un único <canvas>: la portada se pinta una vez en un lienzo
 * aparte y cada píxel copia su trozo con drawImage. Así pueden caer cientos
 * de píxeles sin meter cientos de nodos en la página. Donde falta un píxel
 * el canvas queda transparente y se ve lo que hay debajo (la demo).
 *
 * La caída es como pasar la página de un libro: un frente que barre de
 * derecha a izquierda, algo inclinado (la esquina de abajo va primero), y
 * cada píxel cae despacio mientras se desvanece. Al salir, la página vuelve:
 * los píxeles regresan empezando por la izquierda.
 *
 * Cada tarjeta corre en un Web Worker (pixeles.worker.js) con su canvas
 * transferido: el hilo principal puede estar ocupado montando una demo y
 * los píxeles siguen cayendo igual. Además, para que varias tarjetas
 * puedan animarse a la vez sin tirones, los píxeles
 * que están en su sitio no se dibujan uno a uno en cada fotograma: viven en
 * un lienzo de fondo (`base`) que solo se toca cuando un píxel se va o
 * vuelve. Cada fotograma es ese fondo de una vez más los píxeles en vuelo.
 *
 * Las coordenadas de la animación van en px CSS; las de las celdas, en px
 * del dispositivo y redondeadas, para que entre vecinos no quede costura.
 */

const LADO = 12; //           lado aproximado de un píxel, en px CSS
const BARRIDO = 1.3; //       s que tarda el frente en cruzar la portada
const INCLINACION = 0.18; //  parte del barrido que adelanta la fila de abajo
const CAIDA = 0.95; //        s que tarda cada píxel en caer y desvanecerse
const BAJADA = 70; //         px que baja un píxel al caer
const DERIVA = 26; //         px que se desplaza hacia la izquierda al caer
const VUELTA_BARRIDO = 0.7; // s que tarda el frente de vuelta
const VUELTA = 0.55; //       s que tarda cada píxel en volver

const QUIETO = 0;
const ESPERA = 1; // soltado, esperando a que llegue el frente
const CAE = 2;
const FUERA = 3;
const VUELVE = 4;

const QUIETA = { dx: 0, dy: 0, giro: 0, alfa: 1 };

/** Suave al empezar y al acabar. */
const suave = (k) => k * k * (3 - 2 * k);

/* En un worker puede no haber requestAnimationFrame (Safari): se tira de un temporizador. */
const pedirFotograma =
  globalThis.requestAnimationFrame?.bind(globalThis) ??
  ((cb) => setTimeout(() => cb(performance.now()), 16));
const cancelarFotograma =
  globalThis.cancelAnimationFrame?.bind(globalThis) ?? clearTimeout;

/** Lienzo auxiliar que vale tanto en la página como dentro de un worker. */
function lienzo(w, h) {
  if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(w, h);
  return Object.assign(document.createElement('canvas'), { width: w, height: h });
}

/**
 * No toca el DOM ni las fuentes: recibe la portada ya pintada (un canvas o
 * un ImageBitmap del tamaño del lienzo), así que funciona igual en el hilo
 * principal que en un Web Worker con un OffscreenCanvas (pixeles.worker.js).
 */
export default class CapaDePixeles {
  /**
   * @param {HTMLCanvasElement | OffscreenCanvas} canvas
   * @param {{ reducido?: boolean }} opciones  `reducido`: prefers-reduced-motion.
   */
  constructor(canvas, { reducido = false } = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.portada = null;
    this.base = lienzo(1, 1);
    this.celdas = [];
    this.ancho = 0;
    this.alto = 0;
    this.dpr = 1;
    this.raf = 0;
    this.ultimo = 0;
    this.reducido = reducido;
    this.paso = this.paso.bind(this);
  }

  /**
   * Fija el tamaño (px CSS y densidad) y la portada, que mide
   * `ancho·dpr × alto·dpr`. Solo rehace las celdas si cambia el tamaño.
   */
  preparar(ancho, alto, dpr, portada) {
    if (this.portada && this.portada !== portada) this.portada.close?.();
    this.portada = portada;

    const W = Math.round(ancho * dpr);
    const H = Math.round(alto * dpr);
    if (!this.celdas.length || W !== this.canvas.width || H !== this.canvas.height) {
      Object.assign(this, { ancho, alto, dpr });
      this.canvas.width = this.base.width = W;
      this.canvas.height = this.base.height = H;
      this.celdas = [];
      const cols = Math.max(1, Math.round(ancho / LADO));
      const filas = Math.max(1, Math.round(alto / LADO));
      for (let f = 0; f < filas; f++) {
        for (let c = 0; c < cols; c++) {
          const x = Math.round((c * W) / cols);
          const y = Math.round((f * H) / filas);
          const w = Math.round(((c + 1) * W) / cols) - x;
          const h = Math.round(((f + 1) * H) / filas) - y;
          this.celdas.push({
            x, y, w, h,
            /* Posición relativa (0-1) dentro de la portada. */
            u: (c + 0.5) / cols,
            v: (f + 0.5) / filas,
            /* Giro propio y un pelín de desorden en el frente, para que no
               caiga como una persiana; siempre el mismo para cada píxel. */
            giroFinal: (Math.sin(c * 12.9898 + f * 78.233) * 0.5) * 0.9,
            desfase: (Math.sin(c * 39.346 + f * 11.135) * 0.5 + 0.5) * 0.08,
            estado: QUIETO,
            enBase: true, // está pintado en `base` (en su sitio y entero)
            ...QUIETA,
            t: 0,
            desde: QUIETA,
          });
        }
      }
    }
    this.rehacerBase();
    this.dibujar();
  }

  rehacerBase() {
    if (!this.portada) return;
    const ctx = this.base.getContext('2d');
    ctx.clearRect(0, 0, this.base.width, this.base.height);
    ctx.drawImage(this.portada, 0, 0);
    for (const c of this.celdas) if (!c.enBase) ctx.clearRect(c.x, c.y, c.w, c.h);
  }

  quitarDeBase(c) {
    c.enBase = false;
    this.base.getContext('2d').clearRect(c.x, c.y, c.w, c.h);
  }

  ponerEnBase(c) {
    Object.assign(c, QUIETA, { estado: QUIETO, enBase: true });
    this.base.getContext('2d').drawImage(this.portada, c.x, c.y, c.w, c.h, c.x, c.y, c.w, c.h);
  }

  /** Al entrar el puntero: la página se pasa de derecha a izquierda. */
  desmoronar() {
    for (const c of this.celdas) {
      if (c.estado === CAE || c.estado === FUERA || c.estado === ESPERA) continue;
      const frente = (1 - c.u) * (1 - INCLINACION) + (1 - c.v) * INCLINACION;
      c.desde = this.ahora(c);
      c.estado = ESPERA;
      c.t = -(frente * BARRIDO + c.desfase);
    }
    this.arrancar();
  }

  /** Al salir: la página vuelve, empezando por la izquierda. */
  recomponer() {
    for (const c of this.celdas) {
      if (c.estado === QUIETO || c.estado === VUELVE) continue;
      if (c.estado === ESPERA) {
        if (c.enBase) c.estado = QUIETO;
        else this.ponerEnBase(c);
        continue;
      }
      const frente = c.u * (1 - INCLINACION) + c.v * INCLINACION;
      c.desde = this.ahora(c);
      c.estado = VUELVE;
      c.t = -(frente * VUELTA_BARRIDO + c.desfase);
    }
    this.arrancar();
  }

  destruir() {
    cancelarFotograma(this.raf);
    this.raf = 0;
    this.portada?.close?.();
    this.portada = null;
  }

  ahora(c) {
    return { dx: c.dx, dy: c.dy, giro: c.giro, alfa: c.alfa };
  }

  /** Dónde acaba un píxel caído. */
  caido(c) {
    if (this.reducido) return { ...QUIETA, alfa: 0 };
    return { dx: -DERIVA, dy: BAJADA, giro: c.giroFinal, alfa: 0 };
  }

  arrancar() {
    if (this.raf) return;
    this.ultimo = performance.now();
    this.raf = pedirFotograma(this.paso);
  }

  paso(ahora) {
    /* Tiempo real, sin tope: si un fotograma llega tarde, la animación salta
       hasta donde debe estar en vez de ir a cámara lenta. */
    const dt = Math.max(0, (ahora - this.ultimo) / 1000);
    this.ultimo = ahora;
    let vivos = false;

    for (const c of this.celdas) {
      if (c.estado === ESPERA) {
        vivos = true;
        c.t += dt;
        if (c.t >= 0) {
          c.estado = CAE;
          if (c.enBase) this.quitarDeBase(c);
        }
      } else if (c.estado === CAE) {
        vivos = true;
        c.t += dt;
        const k = Math.min(1, c.t / CAIDA);
        const fin = this.caido(c);
        const e = k * k; // la caída acelera, como con gravedad
        const a = suave(k);
        c.dx = c.desde.dx + (fin.dx - c.desde.dx) * e;
        c.dy = c.desde.dy + (fin.dy - c.desde.dy) * e;
        c.giro = c.desde.giro + (fin.giro - c.desde.giro) * a;
        c.alfa = c.desde.alfa + (fin.alfa - c.desde.alfa) * a;
        if (k === 1) c.estado = FUERA;
      } else if (c.estado === VUELVE) {
        vivos = true;
        c.t += dt;
        if (c.t < 0) continue;
        const k = Math.min(1, c.t / VUELTA);
        const e = 1 - (1 - k) ** 3;
        c.dx = c.desde.dx * (1 - e);
        c.dy = c.desde.dy * (1 - e);
        c.giro = c.desde.giro * (1 - e);
        c.alfa = c.desde.alfa + (1 - c.desde.alfa) * e;
        if (k === 1) this.ponerEnBase(c);
      }
    }

    this.dibujar();
    this.raf = vivos ? pedirFotograma(this.paso) : 0;
  }

  dibujar() {
    const { ctx, dpr, portada } = this;
    if (!portada) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.drawImage(this.base, 0, 0);

    /* Los que están en vuelo, encima. Giro y traslación en una sola matriz. */
    for (const c of this.celdas) {
      if (c.enBase || c.alfa <= 0.01) continue;
      const cos = Math.cos(c.giro);
      const sin = Math.sin(c.giro);
      ctx.globalAlpha = c.alfa;
      ctx.setTransform(cos, sin, -sin, cos, c.x + c.w / 2 + c.dx * dpr, c.y + c.h / 2 + c.dy * dpr);
      ctx.drawImage(portada, c.x, c.y, c.w, c.h, -c.w / 2, -c.h / 2, c.w, c.h);
    }
    ctx.globalAlpha = 1;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
}
