/**
 * Mando de una portada agrietable desde la página.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 *
 * La portada se pinta aquí, en el hilo principal, porque las fuentes de la
 * página (Monocraft) solo están cargadas aquí; se convierte en ImageBitmap y se
 * manda al worker, que es quien anima. Si el navegador no puede transferir
 * un canvas a un worker, la misma CapaDeGrietas corre en la página.
 */
import CapaDeGrietas from './grietas';

const conWorker =
  typeof Worker !== 'undefined' &&
  typeof OffscreenCanvas !== 'undefined' &&
  typeof createImageBitmap === 'function' &&
  'transferControlToOffscreen' in HTMLCanvasElement.prototype;

/** Un solo worker para todas las tarjetas: cada fotograma suyo es poquísimo trabajo. */
let worker = null;
let siguienteId = 1;

function elWorker() {
  worker ??= new Worker(new URL('./grietas.worker.js', import.meta.url), { type: 'module' });
  return worker;
}

/**
 * Un canvas solo se puede transferir una vez. En desarrollo, StrictMode
 * desmonta y vuelve a montar al momento: el registro deja que el segundo
 * montaje recupere la capa en vez de intentar transferirlo otra vez.
 */
const transferidos = new WeakMap(); // canvas → { id, adios }

/**
 * @param {HTMLCanvasElement} canvas
 * @param {(ctx: CanvasRenderingContext2D, medidas: {ancho: number, alto: number, dpr: number}) => void} pintar
 *   Pinta la portada en px del dispositivo; `ctx` empieza sin transformar.
 * @param {number} [semilla]  Elige el dibujo de las grietas.
 */
export function crearPortada(canvas, pintar, semilla = 1) {
  const reducido =
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const papel = document.createElement('canvas');
  let medidas = null;
  let vigente = 0; // descarta portadas que lleguen después de otra más nueva

  const pintarPapel = () => {
    const { ancho, alto, dpr } = medidas;
    papel.width = Math.round(ancho * dpr);
    papel.height = Math.round(alto * dpr);
    const ctx = papel.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, papel.width, papel.height);
    pintar(ctx, medidas);
  };

  if (!conWorker) {
    const capa = new CapaDeGrietas(canvas, { reducido, semilla });
    const repintar = () => {
      if (!medidas) return;
      pintarPapel();
      capa.preparar(medidas.ancho, medidas.alto, medidas.dpr, papel);
    };
    return {
      redimensionar(ancho, alto) {
        medidas = { ancho, alto, dpr: Math.min(window.devicePixelRatio || 1, 2) };
        repintar();
      },
      repintar,
      romper: () => capa.romper(),
      restaurar: () => capa.restaurar(),
      destruir: () => capa.destruir(),
    };
  }

  let registro = transferidos.get(canvas);
  if (registro) {
    clearTimeout(registro.adios);
  } else {
    registro = { id: siguienteId++, adios: 0 };
    transferidos.set(canvas, registro);
    const offscreen = canvas.transferControlToOffscreen();
    elWorker().postMessage({ tipo: 'crear', id: registro.id, canvas: offscreen, reducido, semilla }, [offscreen]);
  }
  const { id } = registro;
  const mandar = (tipo) => elWorker().postMessage({ tipo, id });

  const repintar = async () => {
    if (!medidas) return;
    const turno = ++vigente;
    pintarPapel();
    const portada = await createImageBitmap(papel);
    if (turno !== vigente) {
      portada.close();
      return;
    }
    elWorker().postMessage({ tipo: 'portada', id, ...medidas, portada }, [portada]);
  };

  return {
    redimensionar(ancho, alto) {
      medidas = { ancho, alto, dpr: Math.min(window.devicePixelRatio || 1, 2) };
      repintar();
    },
    repintar,
    romper: () => mandar('romper'),
    restaurar: () => mandar('restaurar'),
    destruir() {
      vigente++;
      registro.adios = setTimeout(() => {
        mandar('destruir');
        transferidos.delete(canvas);
      }, 0);
    },
  };
}
