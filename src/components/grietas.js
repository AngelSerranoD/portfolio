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
 * Las grietas siguen un patrón fijo de 16 × 16 téxeles, como en el juego,
 * pero dibujado aquí: no es su textura. La tarjeta mide un bloque de alto
 * (16 téxeles) y el patrón se repite a lo ancho, con un bloque centrado. Cada
 * fase añade rajas a la anterior, así que pintar la fase n es pintar las
 * rajas de las fases 0…n. Ese dibujo vive en dos lienzos aparte (`oscuras` y
 * `claras`) que solo se rehacen al cambiar de fase: cada fotograma es la
 * portada más esos dos lienzos, o solo los trocitos en vuelo.
 *
 * Cada tarjeta corre en un Web Worker (grietas.worker.js) con su canvas
 * transferido: el hilo principal puede estar ocupado montando una demo y
 * las grietas siguen avanzando igual.
 *
 * Las coordenadas de la animación van en px CSS; las de los téxeles, en px
 * del dispositivo y redondeadas, para que entre vecinos no quede costura.
 */

const FASES = 10; //             fases de grieta, como en el juego
const ROTURA = 0.9; //           s desde la primera grieta hasta que se rompe
const PARTICULAS = 48; //        trocitos que saltan al romperse
const LADO_PARTICULA = 10; //    px CSS de cada trocito (±30 %)
const GRAVEDAD = 1400; //        px/s²
const VIDA_MIN = 0.45; //        s que dura un trocito, como mínimo…
const VIDA_MAX = 0.85; //        …y como máximo
const COLOCAR = 0.15; //         s del rebote al volver a colocar el bloque
const ESCALA_COLOCAR = 0.92; //  tamaño con el que empieza ese rebote

/*
 * Patrón propio de 16 × 16 téxeles, al estilo del juego: cada carácter es la
 * fase (0-9) en que aparece la raja de ese téxel, y «.» que no hay. Nace en
 * el centro, avanza en escalera hacia los bordes y cada fase añade a la anterior.
 */
const PATRON = [
  '...6..........8.',
  '....5..78....7..',
  '....4.6..9..6...',
  '.....3....8.5...',
  '..9..2.....4....',
  '9..8..1...3.....',
  '.8..761...3.....',
  '..7....001......',
  '..6..22.0.22....',
  '...43...1...34..',
  '.65....2....5.56',
  '7......3..89.6..',
  '.....66.48...7..',
  '....7...5.....8.',
  '...8.....6.....9',
  '..9......7......',
];
const LADO = PATRON.length; // téxeles por lado de un bloque

/*
 * Fundido como el del juego: las rajas oscurecen lo que tienen debajo
 * (multiply) y su luz lo aclara (screen), sea el fondo o una letra.
 */
const OSCURA = '#2a2a2a';
const CLARA = '#4a4a4a';

/**
 * Téxeles del patrón por fase: las rajas y, justo debajo de cada una (si ahí
 * no hay raja), su luz, que aparece con ella.
 */
const PATRON_POR_FASE = (() => {
  const fases = Array.from({ length: FASES }, () => ({ rajas: [], luces: [] }));
  const hay = (x, y) => y < LADO && PATRON[y][x] !== '.';
  for (let y = 0; y < LADO; y++) {
    for (let x = 0; x < LADO; x++) {
      if (!hay(x, y)) continue;
      const fase = Number(PATRON[y][x]);
      fases[fase].rajas.push([x, y]);
      if (y + 1 < LADO && !hay(x, y + 1)) fases[fase].luces.push([x, y + 1]);
    }
  }
  return fases;
})();

const ENTERA = 0;
const AGRIETANDO = 1;
const ROTA = 2;
const COLOCANDO = 3;

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
 * No toca el DOM ni las fuentes: recibe la portada ya pintada (un canvas o
 * un ImageBitmap del tamaño del lienzo), así que funciona igual en el hilo
 * principal que en un Web Worker con un OffscreenCanvas (grietas.worker.js).
 */
export default class CapaDeGrietas {
  /**
   * @param {HTMLCanvasElement | OffscreenCanvas} canvas
   * @param {{ reducido?: boolean }} opciones  `reducido`: prefers-reduced-motion (sin trocitos ni rebote).
   */
  constructor(canvas, { reducido = false } = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.portada = null;
    this.oscuras = lienzo(1, 1); // las rajas hasta la fase actual, ya pintadas…
    this.claras = lienzo(1, 1); //  …y su luz
    this.grietas = []; //            por fase, sus rectángulos en px del dispositivo
    this.particulas = [];
    this.ancho = 0;
    this.alto = 0;
    this.dpr = 1;
    this.estado = ENTERA;
    this.t = 0;
    this.fase = -1; // última fase pintada en `oscuras` y `claras` (−1: ninguna)
    this.raf = 0;
    this.ultimo = 0;
    this.reducido = reducido;
    this.paso = this.paso.bind(this);
  }

  /**
   * Fija el tamaño (px CSS y densidad) y la portada, que mide
   * `ancho·dpr × alto·dpr`. Solo recoloca el patrón si cambia el tamaño.
   */
  preparar(ancho, alto, dpr, portada) {
    if (this.portada && this.portada !== portada) this.portada.close?.();
    this.portada = portada;

    const W = Math.round(ancho * dpr);
    const H = Math.round(alto * dpr);
    if (!this.grietas.length || W !== this.canvas.width || H !== this.canvas.height) {
      Object.assign(this, { ancho, alto, dpr });
      this.canvas.width = this.oscuras.width = this.claras.width = W;
      this.canvas.height = this.oscuras.height = this.claras.height = H;

      /* La tarjeta mide un bloque de alto; a lo ancho, un bloque centrado y
         el patrón repetido a los lados hasta cubrirla. */
      const texel = alto / LADO; // px CSS
      const bloque = texel * LADO;
      const x0 = ancho / 2 - bloque / 2;
      const desde = Math.floor(-x0 / bloque);
      const hasta = Math.ceil((ancho - x0) / bloque);
      const rect = (columna, fila) => {
        const x = Math.round((x0 + columna * texel) * dpr);
        const y = Math.round(fila * texel * dpr);
        return {
          x,
          y,
          w: Math.round((x0 + (columna + 1) * texel) * dpr) - x,
          h: Math.round((fila + 1) * texel * dpr) - y,
        };
      };
      const enLienzo = (lista) => {
        const salida = [];
        for (let b = desde; b < hasta; b++) {
          for (const [x, y] of lista) salida.push(rect(b * LADO + x, y));
        }
        return salida;
      };
      this.grietas = PATRON_POR_FASE.map(({ rajas, luces }) => ({
        rajas: enLienzo(rajas),
        luces: enLienzo(luces),
      }));
      /* Cambiar el tamaño borra los lienzos: se repinta la fase en que iba. */
      this.pintarRajas(this.fase);
    }
    this.dibujar();
  }

  /** Pinta las grietas de las fases 0…`fase`; con −1 deja los lienzos limpios. */
  pintarRajas(fase) {
    this.fase = fase;
    const oscuras = this.oscuras.getContext('2d');
    const claras = this.claras.getContext('2d');
    oscuras.clearRect(0, 0, this.oscuras.width, this.oscuras.height);
    claras.clearRect(0, 0, this.claras.width, this.claras.height);
    oscuras.fillStyle = OSCURA;
    claras.fillStyle = CLARA;
    for (let f = 0; f <= fase; f++) {
      for (const r of this.grietas[f].rajas) oscuras.fillRect(r.x, r.y, r.w, r.h);
      for (const r of this.grietas[f].luces) claras.fillRect(r.x, r.y, r.w, r.h);
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
      if (this.fase >= 0) {
        ctx.globalCompositeOperation = 'multiply';
        ctx.drawImage(this.oscuras, 0, 0);
        ctx.globalCompositeOperation = 'screen';
        ctx.drawImage(this.claras, 0, 0);
        ctx.globalCompositeOperation = 'source-over';
      }
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
