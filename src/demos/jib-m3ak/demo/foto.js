/**
 * Demo de Jib M3ak — la cámara, sin cámara.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 *
 * Misma interfaz que `src/lib/foto.js` de la app (la demo sustituye ese
 * archivo por este). El visor enseña un lienzo con un producto distinto cada
 * vez, así que el recorte cuadrado, el disparo y la animación de encogido son
 * exactamente los de la app… sin pedirle la cámara a nadie.
 */
import { PRODUCTOS, dibujar } from './dibujos.js';

const LADO = 480;
let turno = 0;

/** El producto que toca «tener delante» ahora mismo. */
export const productoActual = () => PRODUCTOS[turno % PRODUCTOS.length];

export async function abrirCamara() {
  const producto = productoActual();
  turno += 1;

  const lienzo = document.createElement('canvas');
  lienzo.width = 720;
  lienzo.height = 1280;
  const ctx = lienzo.getContext('2d');

  const foto = new Image();
  foto.src = dibujar(producto.clave, turno * 9);
  await new Promise((listo) => { foto.onload = listo; foto.onerror = listo; });

  let angulo = 0;
  const pintar = () => {
    ctx.fillStyle = '#3E2E22';
    ctx.fillRect(0, 0, lienzo.width, lienzo.height);
    // Un vaivén muy suave: sin movimiento, un vídeo parece una imagen pegada.
    angulo += 0.04;
    const lado = 660 + Math.sin(angulo) * 8;
    ctx.drawImage(foto, (720 - lado) / 2, (1280 - lado) / 2 + Math.cos(angulo) * 6, lado, lado);
  };
  pintar();

  const reloj = setInterval(pintar, 80);
  const flujo = lienzo.captureStream(12);
  flujo.getVideoTracks()[0].addEventListener('ended', () => clearInterval(reloj));
  flujo.parar = () => clearInterval(reloj);
  return flujo;
}

export function cerrarCamara(stream) {
  stream?.parar?.();
  stream?.getTracks().forEach((pista) => pista.stop());
}

function lienzoCuadrado() {
  const lienzo = document.createElement('canvas');
  lienzo.width = LADO;
  lienzo.height = LADO;
  const ctx = lienzo.getContext('2d');
  ctx.imageSmoothingQuality = 'high';
  return { lienzo, ctx };
}

export function capturarDelVideo(video, visor) {
  const anchoReal = video.videoWidth;
  const altoReal = video.videoHeight;
  if (!anchoReal || !altoReal) throw new Error('el vídeo todavía no tiene imagen');

  const { clientWidth: ancho, clientHeight: alto } = video;
  const escala = Math.max(ancho / anchoReal, alto / altoReal);
  const margenX = (ancho - anchoReal * escala) / 2;
  const margenY = (alto - altoReal * escala) / 2;

  const lado = Math.min(visor.lado / escala, anchoReal, altoReal);
  const x = Math.max(0, Math.min((visor.x - margenX) / escala, anchoReal - lado));
  const y = Math.max(0, Math.min((visor.y - margenY) / escala, altoReal - lado));

  const { lienzo, ctx } = lienzoCuadrado();
  ctx.drawImage(video, x, y, lado, lado, 0, 0, LADO, LADO);
  return lienzo.toDataURL('image/jpeg', 0.82);
}

export async function capturarDeArchivo() {
  return dibujar(productoActual().clave, turno * 9);
}
