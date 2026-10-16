/**
 * Capa que tapa la miniatura de un proyecto y se rompe como un bloque de Minecraft.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 *
 * Todo vive en un único <canvas>. Al entrar el puntero, sobre la portada
 * aparecen grietas en diez fases, como al picar un bloque; al acabar la
 * última el bloque se rompe: la portada desaparece de golpe y salta un puñado
 * de trocitos suyos que caen con gravedad. Donde no hay portada el canvas
 * queda transparente y se ve lo que hay debajo (la demo). Al salir, si no
 * llegó a romperse, las grietas se borran al instante, como cuando dejas de
 * picar; si se rompió, el bloque se vuelve a colocar con un pequeño rebote.
 *
 * Las grietas no son una textura del juego: se generan aquí, con una semilla
 * por tarjeta, como caminos que salen del centro sobre una rejilla de téxeles
 * (píxeles gordos). Cada téxel sabe en qué fase aparece, así que pintar la
 * fase n es pintar los téxeles de las fases 0…n. Ese dibujo vive en un lienzo
 * aparte (`rajas`) que solo se rehace al cambiar de fase: cada fotograma es
 * la portada más ese lienzo, o solo los trocitos en vuelo.
 *
 * Cada tarjeta corre en un Web Worker (grietas.worker.js) con su canvas
 * transferido: el hilo principal puede estar ocupado montando una demo y
 * las grietas siguen avanzando igual.
 *
 * Las coordenadas de la animación van en px CSS; las de los téxeles, en px
 * del dispositivo y redondeadas, para que entre vecinos no quede costura.
 */

const TEXEL = 8; //              lado de un téxel de grieta, en px CSS
const FASES = 10; //             fases de grieta, como en el juego
const ROTURA = 0.9; //           s desde la primera grieta hasta que se rompe
const RAMAS = 5; //              grietas que salen del centro
const TORCER = 0.7; //           cuánto se tuerce una grieta en cada paso (rad)
const BIFURCAR = 0.06; //        probabilidad de que una grieta se parta en cada paso
const PARTICULAS = 48; //        trocitos que saltan al romperse
const LADO_PARTICULA = 10; //    px CSS de cada trocito (±30 %)
const GRAVEDAD = 1400; //        px/s²
const VIDA_MIN = 0.45; //        s que dura un trocito, como mínimo…
const VIDA_MAX = 0.85; //        …y como máximo
const COLOCAR = 0.15; //         s del rebote al volver a colocar el bloque
const ESCALA_COLOCAR = 0.92; //  tamaño con el que empieza ese rebote

const NUCLEO = 'rgba(0, 0, 0, 0.85)'; //    la raja
const LUZ = 'rgba(255, 255, 255, 0.16)'; // su borde de abajo, que le da relieve

const ENTERA = 0;
const AGRIETANDO = 1;
const ROTA = 2;
const COLOCANDO = 3;

/** Azar con semilla (mulberry32): la misma tarjeta siempre se agrieta igual. */
function azarConSemilla(semilla) {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Rápido al principio y pasándose un pelín al final: el «toc» al colocar un bloque. */
function rebote(k) {
  const c1 = 1.70158;
  return 1 + (c1 + 1) * (k - 1) ** 3 + c1 * (k - 1) ** 2;
}

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
 * Grietas sobre una rejilla de `cols × filas` téxeles: devuelve, para cada
 * téxel agrietado (por su índice), la fase 0-9 en que aparece; cuanto más
 * lejos del centro, más tarde. Cada rama avanza un téxel por paso y se va
 * torciendo, así que queda en escalera, como en el juego; a veces se parte.
 */
function generarGrietas(cols, filas, azar) {
  const fases = new Map();
  const cx = cols / 2;
  const cy = filas / 2;
  const radio = Math.hypot(cx, cy);

  const marcar = (x, y) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    if (xi < 0 || yi < 0 || xi >= cols || yi >= filas) return false;
    /* ×1,15: la última fase llega antes de la esquina, no justo en ella. */
    const lejos = Math.hypot(xi + 0.5 - cx, yi + 0.5 - cy) / radio;
    const fase = Math.min(FASES - 1, Math.floor(lejos * FASES * 1.15));
    const i = yi * cols + xi;
    const antes = fases.get(i);
    if (antes === undefined || fase < antes) fases.set(i, fase);
    return true;
  };

  const rama = (x, y, angulo, largo) => {
    for (let paso = 0; paso < largo; paso++) {
      angulo += (azar() - 0.5) * TORCER;
      x += Math.cos(angulo);
      y += Math.sin(angulo);
      if (!marcar(x, y)) return;
      if (azar() < BIFURCAR && largo - paso > 6) {
        const lado = azar() < 0.5 ? -1 : 1;
        rama(x, y, angulo + lado * (0.6 + azar() * 0.6), (largo - paso) * 0.5);
      }
    }
  };

  marcar(cx, cy);
  for (let r = 0; r < RAMAS; r++) {
    const angulo = (r / RAMAS) * Math.PI * 2 + (azar() - 0.5) * 0.9;
    rama(cx, cy, angulo, radio * (0.85 + azar() * 0.3));
  }
  return fases;
}

/**
 * No toca el DOM ni las fuentes: recibe la portada ya pintada (un canvas o
 * un ImageBitmap del tamaño del lienzo), así que funciona igual en el hilo
 * principal que en un Web Worker con un OffscreenCanvas (grietas.worker.js).
 */
export default class CapaDeGrietas {
  /**
   * @param {HTMLCanvasElement | OffscreenCanvas} canvas
   * @param {{ reducido?: boolean, semilla?: number }} opciones
   *   `reducido`: prefers-reduced-motion (sin trocitos ni rebote).
   *   `semilla`: elige el dibujo de las grietas; cada tarjeta, el suyo.
   */
  constructor(canvas, { reducido = false, semilla = 1 } = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.portada = null;
    this.rajas = lienzo(1, 1); // las grietas hasta la fase actual, ya pintadas
    this.grietas = []; //         por fase, los téxeles que aparecen en ella
    this.particulas = [];
    this.ancho = 0;
    this.alto = 0;
    this.dpr = 1;
    this.estado = ENTERA;
    this.t = 0;
    this.fase = -1; // última fase pintada en `rajas` (−1: ninguna)
    this.raf = 0;
    this.ultimo = 0;
    this.reducido = reducido;
    this.semilla = semilla;
    this.paso = this.paso.bind(this);
  }

  /**
   * Fija el tamaño (px CSS y densidad) y la portada, que mide
   * `ancho·dpr × alto·dpr`. Solo rehace las grietas si cambia el tamaño.
   */
  preparar(ancho, alto, dpr, portada) {
    if (this.portada && this.portada !== portada) this.portada.close?.();
    this.portada = portada;

    const W = Math.round(ancho * dpr);
    const H = Math.round(alto * dpr);
    if (!this.grietas.length || W !== this.canvas.width || H !== this.canvas.height) {
      Object.assign(this, { ancho, alto, dpr });
      this.canvas.width = this.rajas.width = W;
      this.canvas.height = this.rajas.height = H;
      const cols = Math.max(1, Math.ceil(ancho / TEXEL));
      const filas = Math.max(1, Math.ceil(alto / TEXEL));
      const lado = TEXEL * dpr;
      this.grietas = Array.from({ length: FASES }, () => []);
      for (const [i, fase] of generarGrietas(cols, filas, azarConSemilla(this.semilla))) {
        const xi = i % cols;
        const yi = Math.floor(i / cols);
        const x = Math.round(xi * lado);
        const y = Math.round(yi * lado);
        this.grietas[fase].push({
          x,
          y,
          w: Math.round((xi + 1) * lado) - x,
          h: Math.round((yi + 1) * lado) - y,
        });
      }
      /* Cambiar el tamaño borra `rajas`: se repinta la fase en que iba. */
      this.pintarRajas(this.fase);
    }
    this.dibujar();
  }

  /** Pinta en `rajas` las grietas de las fases 0…`fase`; con −1 lo deja limpio. */
  pintarRajas(fase) {
    this.fase = fase;
    const ctx = this.rajas.getContext('2d');
    ctx.clearRect(0, 0, this.rajas.width, this.rajas.height);
    /* Primero la luz, un téxel más abajo; luego las rajas encima, para que
       la luz solo asome por debajo de cada una. */
    ctx.fillStyle = LUZ;
    for (let f = 0; f <= fase; f++) {
      for (const r of this.grietas[f]) ctx.fillRect(r.x, r.y + r.h, r.w, r.h);
    }
    ctx.fillStyle = NUCLEO;
    for (let f = 0; f <= fase; f++) {
      for (const r of this.grietas[f]) ctx.fillRect(r.x, r.y, r.w, r.h);
    }
  }

  /**
   * Al entrar el puntero: se empieza a picar. Si el bloque se estaba
   * volviendo a colocar, se pica otra vez desde cero, como en el juego.
   */
  romper() {
    if (!this.portada) return;
    if (this.estado !== ENTERA && this.estado !== COLOCANDO) return;
    this.estado = AGRIETANDO;
    this.t = 0;
    this.arrancar();
  }

  /**
   * Al salir: si no llegó a romperse, las grietas se borran al momento; si
   * se rompió, el bloque se vuelve a colocar.
   */
  restaurar() {
    if (this.estado === AGRIETANDO) {
      this.estado = ENTERA;
      this.pintarRajas(-1);
      this.dibujar();
    } else if (this.estado === ROTA) {
      this.particulas = [];
      this.t = 0;
      if (this.reducido) {
        this.estado = ENTERA;
        this.dibujar();
      } else {
        this.estado = COLOCANDO;
        this.arrancar();
      }
    }
  }

  /** Acabada la última fase: la portada se va y salta un puñado de trocitos suyos. */
  romperYa() {
    this.estado = ROTA;
    this.pintarRajas(-1);
    if (this.reducido) return;
    const { ancho, alto, dpr } = this;
    const W = this.canvas.width;
    const H = this.canvas.height;
    this.particulas = [];
    for (let i = 0; i < PARTICULAS; i++) {
      const lado = LADO_PARTICULA * (0.7 + Math.random() * 0.6);
      const l = Math.max(1, Math.round(lado * dpr));
      const x = Math.random() * ancho; // centro del trocito, en px CSS
      const y = Math.random() * alto;
      this.particulas.push({
        x,
        y,
        /* Trozo de la portada que se lleva: el que había donde nace. */
        sx: Math.max(0, Math.min(W - l, Math.round((x - lado / 2) * dpr))),
        sy: Math.max(0, Math.min(H - l, Math.round((y - lado / 2) * dpr))),
        l,
        /* Hacia fuera desde el centro y un poco hacia arriba. */
        vx: ((x - ancho / 2) / (ancho / 2)) * 90 + (Math.random() - 0.5) * 60,
        vy: -(80 + Math.random() * 160),
        vida: VIDA_MIN + Math.random() * (VIDA_MAX - VIDA_MIN),
        t: 0,
      });
    }
  }

  destruir() {
    cancelarFotograma(this.raf);
    this.raf = 0;
    this.portada?.close?.();
    this.portada = null;
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

    if (this.estado === AGRIETANDO) {
      this.t += dt;
      if (this.t >= ROTURA) {
        this.romperYa();
      } else {
        const fase = Math.min(FASES - 1, Math.floor((this.t / ROTURA) * FASES));
        if (fase !== this.fase) this.pintarRajas(fase);
      }
    } else if (this.estado === COLOCANDO) {
      this.t += dt;
      if (this.t >= COLOCAR) this.estado = ENTERA;
    }

    for (const p of this.particulas) {
      p.t += dt;
      p.vy += GRAVEDAD * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }
    /* Como en el juego, un trocito no se desvanece: se acaba y ya. */
    this.particulas = this.particulas.filter((p) => p.t < p.vida);

    this.dibujar();
    const vivos =
      this.estado === AGRIETANDO || this.estado === COLOCANDO || this.particulas.length > 0;
    this.raf = vivos ? pedirFotograma(this.paso) : 0;
  }

  dibujar() {
    const { ctx, dpr, portada } = this;
    if (!portada) return;
    const W = this.canvas.width;
    const H = this.canvas.height;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, W, H);

    if (this.estado === ENTERA || this.estado === AGRIETANDO) {
      ctx.drawImage(portada, 0, 0);
      if (this.fase >= 0) ctx.drawImage(this.rajas, 0, 0);
    } else if (this.estado === COLOCANDO) {
      const k = Math.min(1, this.t / COLOCAR);
      const s = ESCALA_COLOCAR + (1 - ESCALA_COLOCAR) * rebote(k);
      ctx.setTransform(s, 0, 0, s, (W * (1 - s)) / 2, (H * (1 - s)) / 2);
      ctx.drawImage(portada, 0, 0);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    for (const p of this.particulas) {
      const x = Math.round(p.x * dpr - p.l / 2);
      const y = Math.round(p.y * dpr - p.l / 2);
      ctx.drawImage(portada, p.sx, p.sy, p.l, p.l, x, y, p.l, p.l);
    }
  }
}
