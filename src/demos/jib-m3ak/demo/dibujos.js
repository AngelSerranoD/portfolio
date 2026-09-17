/**
 * Demo de Jib M3ak — las «fotos» de los artículos.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 *
 * En la app de verdad esto son fotos hechas con la cámara. Aquí se dibujan en
 * el momento sobre un lienzo, así la demo no arrastra imágenes ni pide permiso
 * para la cámara. Son formas planas, no emojis: en `canvas` los emojis salen
 * pequeños y desvaídos según el navegador, y esto se ve igual en todos.
 */

const LADO = 320;
const C = LADO / 2; // el centro, que se usa en todos los dibujos

const redondeado = (ctx, x, y, ancho, alto, radio) => {
  ctx.beginPath();
  ctx.roundRect(x, y, ancho, alto, radio);
  ctx.fill();
};

const circulo = (ctx, x, y, r, color) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
};

/** Cada producto es una función que pinta sobre el lienzo ya preparado. */
const PINTORES = {
  leche(ctx) {
    ctx.fillStyle = '#FBF8F2';
    redondeado(ctx, C - 52, 96, 104, 150, 10);
    ctx.fillStyle = '#4F86C6';
    redondeado(ctx, C - 52, 96, 104, 44, 10);
    ctx.beginPath();
    ctx.moveTo(C - 52, 96);
    ctx.lineTo(C, 58);
    ctx.lineTo(C + 52, 96);
    ctx.closePath();
    ctx.fillStyle = '#E8E2D8';
    ctx.fill();
    circulo(ctx, C, 176, 22, '#4F86C6');
  },
  pan(ctx) {
    ctx.save();
    ctx.translate(C, 168);
    ctx.rotate(-0.25);
    ctx.fillStyle = '#C98A45';
    redondeado(ctx, -104, -30, 208, 60, 30);
    ctx.strokeStyle = '#8A5A25';
    ctx.lineWidth = 5;
    for (let x = -66; x <= 66; x += 33) {
      ctx.beginPath();
      ctx.moveTo(x - 10, -16);
      ctx.lineTo(x + 10, 10);
      ctx.stroke();
    }
    ctx.restore();
  },
  queso(ctx) {
    ctx.fillStyle = '#E8B341';
    ctx.beginPath();
    ctx.moveTo(C - 90, 200);
    ctx.lineTo(C + 90, 200);
    ctx.lineTo(C + 90, 140);
    ctx.lineTo(C - 90, 96);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#F2CC6B';
    circulo(ctx, C - 30, 160, 14, '#F5D98A');
    circulo(ctx, C + 34, 172, 10, '#F5D98A');
    circulo(ctx, C + 6, 186, 7, '#F5D98A');
  },
  miel(ctx) {
    ctx.fillStyle = '#D79A2B';
    redondeado(ctx, C - 46, 110, 92, 116, 22);
    ctx.fillStyle = '#A8701A';
    redondeado(ctx, C - 30, 86, 60, 26, 8);
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    redondeado(ctx, C - 30, 128, 18, 70, 9);
  },
  aceituna(ctx) {
    circulo(ctx, C - 34, 170, 34, '#6E8B3D');
    circulo(ctx, C + 26, 186, 28, '#4F6B2A');
    circulo(ctx, C + 8, 132, 25, '#87A44E');
    circulo(ctx, C - 34, 170, 11, '#C0392B');
  },
  platano(ctx) {
    ctx.strokeStyle = '#E8C547';
    ctx.lineWidth = 42;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(C, 110, 82, 0.35, 2.1);
    ctx.stroke();
    ctx.strokeStyle = '#B8912B';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(C, 110, 82, 0.5, 1.9);
    ctx.stroke();
  },
  cafe(ctx) {
    ctx.fillStyle = '#FBF8F2';
    redondeado(ctx, C - 56, 120, 112, 78, 14);
    ctx.fillStyle = '#5A3A1E';
    redondeado(ctx, C - 44, 132, 88, 24, 8);
    ctx.strokeStyle = '#FBF8F2';
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.arc(C + 62, 158, 24, -1.2, 1.2);
    ctx.stroke();
    ctx.fillStyle = '#C9B79C';
    redondeado(ctx, C - 78, 198, 156, 14, 7);
  },
  champu(ctx) {
    ctx.fillStyle = '#7FB2C9';
    redondeado(ctx, C - 40, 108, 80, 122, 18);
    ctx.fillStyle = '#4E7E95';
    redondeado(ctx, C - 18, 82, 36, 30, 8);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    redondeado(ctx, C - 26, 140, 52, 44, 8);
  },
  tomate(ctx) {
    circulo(ctx, C - 28, 176, 42, '#C0392B');
    circulo(ctx, C + 36, 160, 34, '#D0483A');
    ctx.strokeStyle = '#4E7A32';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(C - 28, 136);
    ctx.lineTo(C - 40, 118);
    ctx.stroke();
  },
  huevo(ctx) {
    for (const [x, y] of [[C - 40, 176], [C + 32, 168], [C - 4, 130]]) {
      ctx.fillStyle = '#F6EFE2';
      ctx.beginPath();
      ctx.ellipse(x, y, 30, 38, 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(180,160,130,0.25)';
      ctx.beginPath();
      ctx.ellipse(x + 10, y + 8, 12, 18, 0.4, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  chocolate(ctx) {
    ctx.fillStyle = '#5A3A1E';
    redondeado(ctx, C - 70, 116, 140, 96, 10);
    ctx.strokeStyle = 'rgba(0,0,0,0.35)';
    ctx.lineWidth = 4;
    for (let x = C - 35; x < C + 70; x += 35) {
      ctx.beginPath(); ctx.moveTo(x, 116); ctx.lineTo(x, 212); ctx.stroke();
    }
    ctx.beginPath(); ctx.moveTo(C - 70, 164); ctx.lineTo(C + 70, 164); ctx.stroke();
  },
  fresa(ctx) {
    for (const [x, y, r] of [[C - 30, 178, 34], [C + 30, 166, 28]]) {
      ctx.fillStyle = '#D6455B';
      ctx.beginPath();
      ctx.moveTo(x, y + r);
      ctx.bezierCurveTo(x - r, y + r * 0.4, x - r * 0.9, y - r, x, y - r * 0.8);
      ctx.bezierCurveTo(x + r * 0.9, y - r, x + r, y + r * 0.4, x, y + r);
      ctx.fill();
      ctx.fillStyle = '#4E7A32';
      redondeado(ctx, x - 16, y - r - 6, 32, 12, 6);
    }
  },
  papel(ctx) {
    ctx.fillStyle = '#FBF8F2';
    redondeado(ctx, C - 44, 112, 88, 104, 14);
    circulo(ctx, C, 112, 44, '#F1EADD');
    circulo(ctx, C, 112, 14, '#C9B79C');
  },
  azucar(ctx) {
    ctx.fillStyle = '#EFE7DA';
    redondeado(ctx, C - 60, 116, 120, 104, 12);
    ctx.fillStyle = '#C9B79C';
    redondeado(ctx, C - 60, 116, 120, 26, 12);
    ctx.fillStyle = '#FFFFFF';
    for (const [x, y] of [[C - 20, 170], [C + 6, 186], [C + 26, 162]]) redondeado(ctx, x, y, 22, 22, 4);
  },
  cabra(ctx) {
    circulo(ctx, C, 168, 46, '#EFE7DA');
    ctx.fillStyle = '#EFE7DA';
    redondeado(ctx, C - 18, 196, 36, 34, 14);
    ctx.strokeStyle = '#B9A88E';
    ctx.lineWidth = 9;
    ctx.lineCap = 'round';
    for (const lado of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(C + lado * 26, 132);
      ctx.quadraticCurveTo(C + lado * 52, 104, C + lado * 30, 88);
      ctx.stroke();
    }
    circulo(ctx, C - 16, 160, 5, '#3E2E22');
    circulo(ctx, C + 16, 160, 5, '#3E2E22');
  },
};

/** Dibuja el «bodegón» de un producto y lo devuelve como data URL. */
export function dibujar(clave, tono = 0) {
  const lienzo = document.createElement('canvas');
  lienzo.width = LADO;
  lienzo.height = LADO;
  const ctx = lienzo.getContext('2d');

  const fondo = ctx.createLinearGradient(0, 0, LADO, LADO);
  fondo.addColorStop(0, `hsl(${34 + tono}, 32%, 80%)`);
  fondo.addColorStop(1, `hsl(${24 + tono}, 28%, 62%)`);
  ctx.fillStyle = fondo;
  ctx.fillRect(0, 0, LADO, LADO);

  // Vetas de la mesa, para que no parezca un color plano.
  ctx.strokeStyle = 'rgba(107, 79, 58, 0.12)';
  ctx.lineWidth = 6;
  for (let y = 20; y < LADO; y += 46) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(LADO / 3, y - 8, (LADO / 3) * 2, y + 8, LADO, y);
    ctx.stroke();
  }

  // Sombra bajo el producto.
  ctx.fillStyle = 'rgba(62, 46, 34, 0.20)';
  ctx.beginPath();
  ctx.ellipse(C, 232, 96, 20, 0, 0, Math.PI * 2);
  ctx.fill();

  (PINTORES[clave] ?? PINTORES.azucar)(ctx);

  // Viñeta: le da algo de cuerpo, como una foto hecha con el móvil.
  const vineta = ctx.createRadialGradient(C, C, LADO * 0.32, C, C, LADO * 0.78);
  vineta.addColorStop(0, 'rgba(0,0,0,0)');
  vineta.addColorStop(1, 'rgba(62,46,34,0.26)');
  ctx.fillStyle = vineta;
  ctx.fillRect(0, 0, LADO, LADO);

  return lienzo.toDataURL('image/jpeg', 0.88);
}

/** Lo que se ve por la «cámara» de la demo, en orden. */
export const PRODUCTOS = [
  { clave: 'tomate', nombre: 'Tomates' },
  { clave: 'pan', nombre: 'Pan' },
  { clave: 'queso', nombre: 'Queso' },
  { clave: 'miel', nombre: 'Miel' },
  { clave: 'aceituna', nombre: 'Aceitunas' },
  { clave: 'platano', nombre: 'Plátanos' },
  { clave: 'cafe', nombre: 'Café' },
  { clave: 'champu', nombre: 'Champú' },
];
