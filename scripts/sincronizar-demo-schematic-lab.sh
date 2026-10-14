#!/usr/bin/env bash
#
# Copia la app real de Schematic Lab (su frontend) a su demo del portfolio,
# vuelca con el núcleo de Rust los datos de tres schematics de prueba y aplica
# los parches para que viva dentro del marco de la ventana. Repetirlo cada vez
# que cambie la app. Lo propio de la demo (núcleo falso, sustitutos de Tauri y
# miniaturas) está en demo/ y no se toca.
#
# Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.

set -euo pipefail

ORIGEN="/c/dev/schematic-lab"
DEMO="/c/dev/portfolio/src/demos/schematic-lab"
PARTES=(App.tsx App.css index.css api assets componentes estado estilos logica vistas)

[ -d "$DEMO/demo" ] || { echo "No encuentro $DEMO/demo"; exit 1; }

# 1. Volcado del núcleo a un temporal (cargo run --example volcar_demo).
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
(cd "$ORIGEN/src-tauri" && cargo run --quiet --example volcar_demo "$(cygpath -m "$TMP")")

# 2. Copia del frontend. main.tsx no: la entrada de la demo es index.jsx.
for parte in "${PARTES[@]}"; do rm -rf "${DEMO:?}/$parte"; done
for parte in "${PARTES[@]}"; do cp -r "$ORIGEN/src/$parte" "$DEMO/"; done
find "$DEMO/api" "$DEMO/estado" "$DEMO/logica" -name '*.test.ts' -exec rm {} +

# Los tokens de color y de movimiento y el tema viven en la raíz de la demo,
# no en <html> (el CSS está encerrado en ella, ver demo/aislamiento.js).
parchear_raiz() { # archivo, ruta relativa hasta demo/
  sed -i -e "0,/^import /s##import { raizDemo } from \"$2demo/raiz.js\";\nimport #" \
    -e 's/document\.documentElement/raizDemo()/g' "$DEMO/$1"
}
parchear_raiz estado/ajustes.ts ../
parchear_raiz estilos/movimiento.ts ../
parchear_raiz componentes/visor/colores.ts ../../

# 3. Datos con ids estables: el volcado da uuid nuevos y la fecha de cada
# importación; se fijan para que volver a sincronizar no cambie nada.
rm -rf "${DEMO:?}/datos"
node - "$TMP" "$DEMO/datos" <<'NODE'
const fs = require('fs');
const path = require('path');
const [origen, destino] = process.argv.slice(2);
const ESTABLES = {
  'litematic_simple.litematic': 'simple',
  'litematic_multi.litematic': 'multi',
  'sponge_v2.schem': 'sponge',
};
/** Fechas de importación fijas (la demo las acerca a hoy al cargarlas). */
const BASE = Date.UTC(2026, 0, 1);

const lista = JSON.parse(fs.readFileSync(path.join(origen, 'listar.json'), 'utf8'));
const ids = new Map();
lista.forEach((e, i) => {
  const estable = ESTABLES[e.nombreOriginal];
  if (!estable) throw new Error(`Schematic sin id estable: ${e.nombreOriginal}`);
  ids.set(e.id, { estable, fecha: BASE - i * 3_600_000 });
});

const reescribir = (texto) => {
  for (const [uuid, { estable }] of ids) texto = texto.split(uuid).join(estable);
  return texto;
};
const fijarFecha = (entrada) => {
  const fecha = [...ids.values()].find((v) => v.estable === entrada.id)?.fecha;
  return fecha === undefined ? entrada : { ...entrada, fechaImportacion: fecha };
};
const escribir = (ruta, valor) => {
  fs.mkdirSync(path.dirname(ruta), { recursive: true });
  fs.writeFileSync(ruta, `${JSON.stringify(valor)}\n`);
};

escribir(
  path.join(destino, 'listar.json'),
  JSON.parse(reescribir(JSON.stringify(lista))).map(fijarFecha),
);
// La tabla sale de un HashMap: orden distinto en cada volcado. Se ordena.
const colores = JSON.parse(fs.readFileSync(path.join(origen, 'colores_bloques.json'), 'utf8'));
escribir(
  path.join(destino, 'colores_bloques.json'),
  Object.fromEntries(Object.keys(colores).sort().map((k) => [k, colores[k]])),
);

for (const [uuid, { estable }] of ids) {
  const dir = path.join(origen, uuid);
  for (const archivo of fs.readdirSync(dir)) {
    const de = path.join(dir, archivo);
    const a = path.join(destino, estable, archivo);
    if (archivo.endsWith('.json')) {
      let valor = JSON.parse(reescribir(fs.readFileSync(de, 'utf8')));
      if (valor && valor.entrada) valor = { ...valor, entrada: fijarFecha(valor.entrada) };
      escribir(a, valor);
    } else {
      fs.mkdirSync(path.dirname(a), { recursive: true });
      fs.copyFileSync(de, a);
    }
  }
}
console.log(`Datos: ${[...ids.values()].map((v) => v.estable).join(', ')}`);
NODE

# Comprobación: si queda algo sin parchear, se para aquí.
PARTES_COPIADAS=("${PARTES[@]/#/$DEMO/}")
if grep -rn 'document\.documentElement' "${PARTES_COPIADAS[@]}"; then
  echo "Quedan parches sin aplicar (arriba)."; exit 1
fi
for id in simple multi sponge; do
  [ -f "$DEMO/demo/miniaturas/$id.png" ] \
    || echo "Aviso: falta demo/miniaturas/$id.png (la demo la generará al abrirse)."
done
echo "Demo sincronizada desde $ORIGEN"
