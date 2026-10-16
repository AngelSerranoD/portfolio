/**
 * Taller del panorama: genera un mundo voxel propio y hornea su vista de 360°
 * en public/panorama/panorama.webp. Solo se usa en desarrollo
 * (npm run dev → /herramientas/panorama/index.html); no entra en el build.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 *
 * La tira usa proyección cilíndrica: cada columna es un ángulo de giro de la
 * cámara, así que en la web girar equivale a desplazarla en horizontal. Se
 * pinta en rebanadas estrechas de RANURA px, cada una con la cámara girada a
 * su ángulo, con supermuestreo ×2 para que las texturas lejanas no hagan ruido.
 */
import * as THREE from 'three';

const ANCHO = 3840; // 360°
const ALTO = 1024;
const RANURA = 8;
const SUPER = 2;
/* Campo vertical con el que un píxel del centro mide lo mismo en horizontal y en vertical. */
const FOV = (2 * Math.atan((Math.PI * ALTO) / ANCHO) * 180) / Math.PI; // ≈ 79,9°

const TAM = 192; // columnas por lado
const MITAD = TAM / 2;
const ALTURA_MAX = 64;
const MAR = 22;
const ALTURA_CAMARA = 7; // bloques por encima del suelo del centro
const UMBRAL_NUBES = 0.6;

const AIRE = 0, HIERBA = 1, TIERRA = 2, PIEDRA = 3, ARENA = 4, AGUA = 5, TRONCO = 6, HOJAS = 7;

/* Orden de los tiles en el atlas (archivos de ./texturas). */
const TILES = ['hierba_arriba', 'hierba_lado', 'tierra', 'piedra', 'arena', 'agua', 'tronco_lado', 'tronco_arriba', 'hojas'];
/* Tile de cada bloque: [arriba, lados, abajo]. */
const TEXTURAS = {
  [HIERBA]: [0, 1, 2],
  [TIERRA]: [2, 2, 2],
  [PIEDRA]: [3, 3, 3],
  [ARENA]: [4, 4, 4],
  [AGUA]: [5, 5, 5],
  [TRONCO]: [7, 6, 7],
  [HOJAS]: [8, 8, 8],
};

/*
 * Caras del cubo: dirección, sombra fija como en el juego y esquinas en
 * sentido antihorario vistas desde fuera. En las laterales, las dos primeras
 * son las de abajo, para que la hierba quede arriba. `tex`: 0 arriba, 1 lados, 2 abajo.
 */
const CARAS = [
  { d: [0, 1, 0], sombra: 1.0, tex: 0, v: [[0, 1, 1], [1, 1, 1], [1, 1, 0], [0, 1, 0]] },
  { d: [0, -1, 0], sombra: 0.5, tex: 2, v: [[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]] },
  { d: [1, 0, 0], sombra: 0.6, tex: 1, v: [[1, 0, 1], [1, 0, 0], [1, 1, 0], [1, 1, 1]] },
  { d: [-1, 0, 0], sombra: 0.6, tex: 1, v: [[0, 0, 0], [0, 0, 1], [0, 1, 1], [0, 1, 0]] },
  { d: [0, 0, 1], sombra: 0.8, tex: 1, v: [[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]] },
  { d: [0, 0, -1], sombra: 0.8, tex: 1, v: [[1, 0, 0], [0, 0, 0], [0, 1, 0], [1, 1, 0]] },
];

function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Ruido de valor 2D con 4 octavas. Devuelve valores entre 0 y 1. */
function crearRuido(semilla) {
  const azar = mulberry32(semilla);
  const tabla = new Float32Array(256 * 256);
  for (let k = 0; k < tabla.length; k++) tabla[k] = azar();
  const valor = (x, z) => tabla[((z & 255) << 8) | (x & 255)];
  const suave = (t) => t * t * (3 - 2 * t);
  const ruido = (x, z) => {
    const x0 = Math.floor(x);
    const z0 = Math.floor(z);
    const fx = suave(x - x0);
    const fz = suave(z - z0);
    const a = valor(x0, z0);
    const b = valor(x0 + 1, z0);
    const c = valor(x0, z0 + 1);
    const d = valor(x0 + 1, z0 + 1);
    return a + (b - a) * fx + (c - a) * fz + (a - b - c + d) * fx * fz;
  };
  return (x, z) => {
    let suma = 0;
    let amplitud = 1;
    let frecuencia = 1 / 32;
    let total = 0;
    for (let o = 0; o < 4; o++) {
      suma += ruido(x * frecuencia, z * frecuencia) * amplitud;
      total += amplitud;
      amplitud /= 2;
      frecuencia *= 2;
    }
    return suma / total;
  };
}

function cargarTiles() {
  return Promise.all(
    TILES.map(async (nombre) => {
      const img = new Image();
      img.src = new URL(`./texturas/${nombre}.png`, import.meta.url).href;
      await img.decode();
      return img;
    })
  );
}

/** Atlas de 16 px por tile, con ruido por texel: reducidos sin él, los tiles quedan casi lisos. */
function crearAtlas(imagenes, azar) {
  const lienzo = document.createElement('canvas');
  lienzo.width = 16 * imagenes.length;
  lienzo.height = 16;
  const ctx = lienzo.getContext('2d', { willReadFrequently: true });
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  imagenes.forEach((img, i) => ctx.drawImage(img, i * 16, 0, 16, 16));
  const datos = ctx.getImageData(0, 0, lienzo.width, 16);
  for (let p = 0; p < datos.data.length; p += 4) {
    const f = 0.9 + azar() * 0.2;
    for (let k = 0; k < 3; k++) datos.data[p + k] = Math.min(255, datos.data[p + k] * f);
  }
  ctx.putImageData(datos, 0, 0);
  const textura = new THREE.CanvasTexture(lienzo);
  textura.magFilter = THREE.NearestFilter;
  textura.minFilter = THREE.NearestFilter;
  textura.generateMipmaps = false;
  textura.colorSpace = THREE.SRGBColorSpace;
  return textura;
}

function generarMundo(semilla) {
  const mundo = new Uint8Array(TAM * ALTURA_MAX * TAM);
  const dentro = (x, y, z) => x >= 0 && x < TAM && z >= 0 && z < TAM && y >= 0 && y < ALTURA_MAX;
  const indice = (x, y, z) => (y * TAM + z) * TAM + x;
  const poner = (x, y, z, b) => {
    if (dentro(x, y, z)) mundo[indice(x, y, z)] = b;
  };
  /* Fuera del mundo hay aire (la niebla tapa el borde); por debajo de y = 0, piedra. */
  const leer = (x, y, z) => (y < 0 ? PIEDRA : dentro(x, y, z) ? mundo[indice(x, y, z)] : AIRE);

  const ruido = crearRuido(semilla);
  const alturas = new Int16Array(TAM * TAM);
  for (let z = 0; z < TAM; z++) {
    for (let x = 0; x < TAM; x++) {
      const h = Math.round(8 + ruido(x, z) * 30);
      alturas[z * TAM + x] = h;
      const playa = h <= MAR + 1;
      for (let y = 0; y <= h; y++) {
        const b = y === h ? (playa ? ARENA : HIERBA) : y >= h - 3 ? (playa ? ARENA : TIERRA) : PIEDRA;
        poner(x, y, z, b);
      }
      for (let y = h + 1; y <= MAR; y++) poner(x, y, z, AGUA);
    }
  }

  const azar = mulberry32(semilla + 1);
  for (let z = 2; z < TAM - 2; z++) {
    for (let x = 2; x < TAM - 2; x++) {
      const h = alturas[z * TAM + x];
      if (leer(x, h, z) !== HIERBA || Math.hypot(x - MITAD, z - MITAD) < 6 || azar() >= 1 / 60) continue;
      const techo = h + 4 + Math.floor(azar() * 3);
      for (let dy = -1; dy <= 2; dy++) {
        const r = dy <= 0 ? 2 : 1;
        for (let dz = -r; dz <= r; dz++) {
          for (let dx = -r; dx <= r; dx++) {
            const esquina = Math.abs(dx) === r && Math.abs(dz) === r;
            if (esquina && (dy === 2 || azar() < 0.5)) continue;
            if (leer(x + dx, techo + dy, z + dz) === AIRE) poner(x + dx, techo + dy, z + dz, HOJAS);
          }
        }
      }
      for (let y = h + 1; y <= techo; y++) poner(x, y, z, TRONCO);
    }
  }
  return { leer, alturas };
}

const opaco = (b) => b === HIERBA || b === TIERRA || b === PIEDRA || b === ARENA || b === TRONCO;

/** Una cara se dibuja si da al aire, o a agua u hojas distintas de ella (se ve a través). */
function visible(b, vecino) {
  if (vecino === AIRE) return true;
  if (opaco(vecino)) return false;
  return b !== AGUA && vecino !== b;
}

function mallar(leer) {
  const solido = { pos: [], uv: [], color: [], idx: [] };
  const agua = { pos: [], uv: [], color: [], idx: [] };
  /* La sombra va en sRGB, como en el juego; los colores de vértice de three son lineales. */
  const sombras = CARAS.map((c) => new THREE.Color().setRGB(c.sombra, c.sombra, c.sombra, THREE.SRGBColorSpace));
  const anchoAtlas = 16 * TILES.length;
  for (let y = 0; y < ALTURA_MAX; y++) {
    for (let z = 0; z < TAM; z++) {
      for (let x = 0; x < TAM; x++) {
        const b = leer(x, y, z);
        if (b === AIRE) continue;
        CARAS.forEach((cara, n) => {
          const [dx, dy, dz] = cara.d;
          if (!visible(b, leer(x + dx, y + dy, z + dz))) return;
          const destino = b === AGUA ? agua : solido;
          const tile = TEXTURAS[b][cara.tex];
          const u0 = (tile * 16 + 0.01) / anchoAtlas;
          const u1 = ((tile + 1) * 16 - 0.01) / anchoAtlas;
          const base = destino.pos.length / 3;
          for (const [vx, vy, vz] of cara.v) {
            destino.pos.push(x - MITAD + vx, y + vy, z - MITAD + vz);
            destino.color.push(sombras[n].r, sombras[n].g, sombras[n].b);
          }
          destino.uv.push(u0, 0, u1, 0, u1, 1, u0, 1);
          destino.idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
        });
      }
    }
  }
  return [solido, agua].map((g) => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(g.pos, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(g.uv, 2));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(g.color, 3));
    geo.setIndex(g.idx);
    return geo;
  });
}

function crearCielo() {
  const radio = 450;
  const geo = new THREE.SphereGeometry(radio, 32, 16);
  const arriba = new THREE.Color('#78A7FF');
  const horizonte = new THREE.Color('#C0D8FF');
  const pos = geo.attributes.position;
  const colores = [];
  for (let k = 0; k < pos.count; k++) {
    const t = THREE.MathUtils.smoothstep(pos.getY(k) / radio, 0, 0.45);
    const c = horizonte.clone().lerp(arriba, t);
    colores.push(c.r, c.g, c.b);
  }
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colores, 3));
  const cielo = new THREE.Mesh(
    geo,
    new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false, depthWrite: false })
  );
  cielo.renderOrder = -1;
  return cielo;
}

function crearNubes(semilla, y) {
  const ruido = crearRuido(semilla + 2);
  const celdas = [];
  for (let cz = -40; cz < 40; cz++) {
    for (let cx = -40; cx < 40; cx++) {
      if (ruido(cx * 3, cz * 3) > UMBRAL_NUBES) celdas.push([cx, cz]);
    }
  }
  const geo = new THREE.BoxGeometry(4, 1.5, 4);
  /* BoxGeometry ordena sus caras +X, -X, +Y, -Y, +Z, -Z, con 4 vértices cada una. */
  const tonos = [0.85, 0.85, 1, 0.7, 0.9, 0.9];
  const colores = [];
  for (const t of tonos) {
    const c = new THREE.Color().setRGB(t, t, t, THREE.SRGBColorSpace);
    for (let k = 0; k < 4; k++) colores.push(c.r, c.g, c.b);
  }
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colores, 3));
  const nubes = new THREE.InstancedMesh(geo, new THREE.MeshBasicMaterial({ vertexColors: true }), celdas.length);
  const m = new THREE.Matrix4();
  celdas.forEach(([cx, cz], k) => {
    m.makeTranslation(cx * 4 + 2, y, cz * 4 + 2);
    nubes.setMatrixAt(k, m);
  });
  nubes.frustumCulled = false;
  return nubes;
}

const estado = document.querySelector('#estado');
const tira = document.querySelector('#tira');
const botonHornear = document.querySelector('#hornear');
const botonGuardar = document.querySelector('#guardar');
tira.width = ANCHO;
tira.height = ALTO;

async function hornear(semilla) {
  estado.textContent = 'Generando el mundo…';
  await new Promise(requestAnimationFrame);
  const atlas = crearAtlas(await cargarTiles(), mulberry32(semilla + 3));
  const { leer, alturas } = generarMundo(semilla);
  const [geoSolido, geoAgua] = mallar(leer);

  const escena = new THREE.Scene();
  escena.fog = new THREE.Fog('#C0D8FF', 32, 90);
  escena.add(new THREE.Mesh(geoSolido, new THREE.MeshBasicMaterial({ map: atlas, vertexColors: true, alphaTest: 0.5 })));
  escena.add(
    new THREE.Mesh(
      geoAgua,
      new THREE.MeshBasicMaterial({ map: atlas, vertexColors: true, transparent: true, opacity: 0.8, depthWrite: false })
    )
  );
  escena.add(crearNubes(semilla, MAR + 40));
  const cielo = crearCielo();
  escena.add(cielo);

  const suelo = Math.max(alturas[MITAD * TAM + MITAD], MAR) + 1;
  const camara = new THREE.PerspectiveCamera(FOV, RANURA / ALTO, 0.1, 500);
  camara.position.set(0.5, suelo + ALTURA_CAMARA, 0.5);
  cielo.position.copy(camara.position);

  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1);
  renderer.setSize(RANURA * SUPER, ALTO * SUPER, false);
  const ctx = tira.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  /* De izquierda a derecha, la cámara gira hacia la derecha (rotation.y negativa). */
  const rebanadas = ANCHO / RANURA;
  for (let n = 0; n < rebanadas; n++) {
    camara.rotation.y = -(((n + 0.5) * RANURA) / ANCHO) * Math.PI * 2;
    renderer.render(escena, camara);
    ctx.drawImage(renderer.domElement, n * RANURA, 0, RANURA, ALTO);
    if (n % 40 === 39) {
      estado.textContent = `Horneando ${n + 1}/${rebanadas}`;
      await new Promise(requestAnimationFrame);
    }
  }
  renderer.dispose();
  estado.textContent = `Semilla ${semilla} lista`;
}

botonHornear.onclick = async () => {
  botonHornear.disabled = true;
  botonGuardar.disabled = true;
  await hornear(Number(document.querySelector('#semilla').value) || 0);
  botonHornear.disabled = false;
  botonGuardar.disabled = false;
};

botonGuardar.onclick = () =>
  tira.toBlob(
    async (blob) => {
      const r = await fetch('/__panorama?archivo=panorama.webp', {
        method: 'POST',
        headers: { 'Content-Type': 'image/webp' },
        body: blob,
      });
      estado.textContent = r.ok ? `Guardado: ${Math.round(blob.size / 1024)} kB` : `Error ${r.status}`;
    },
    'image/webp',
    0.82
  );
