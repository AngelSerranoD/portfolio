#!/usr/bin/env bash
#
# Copia la app real de Jib M3ak a su demo del portfolio y aplica los parches
# para que viva dentro del marco del móvil. Repetirlo cada vez que cambie la app.
#
# Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.

set -euo pipefail

ORIGEN="/c/dev/jib-m3ak"
DEMO="/c/dev/portfolio/src/demos/jib-m3ak"
PARTES=(App.jsx componentes i18n lib)

[ -d "$DEMO/demo" ] || { echo "No encuentro $DEMO/demo"; exit 1; }

for parte in "${PARTES[@]}"; do rm -rf "${DEMO:?}/$parte"; done
for parte in "${PARTES[@]}"; do cp -r "$ORIGEN/src/$parte" "$DEMO/"; done

# Sin Supabase y sin cámara: la demo trae su servidor en memoria, su cámara de
# mentira y un idioma que no toca el <html> del portfolio.
cp "$DEMO/demo/servidor.js" "$DEMO/lib/servidor.js"
cp "$DEMO/demo/foto.js" "$DEMO/lib/foto.js"
cp "$DEMO/demo/idioma.jsx" "$DEMO/i18n/idioma.jsx"
# Al bajar a lib/, los dibujos se quedan una carpeta más arriba.
sed -i "s#from './dibujos.js'#from '../demo/dibujos.js'#" "$DEMO/lib/servidor.js" "$DEMO/lib/foto.js"

# Alturas del marco, no de la ventana.
grep -rl --include='*.jsx' 'dvh' "$DEMO" | xargs -r sed -i -e 's/min-h-\[100dvh\]/min-h-full/g' -e 's/\bh-dvh\b/h-full/g'

# El portfolio ya tiene .tarjeta, .campo y una `crema` de otra demo: aquí todo
# eso lleva el prefijo jm-. De más largo a más corto, o se pisan entre ellos.
ARCHIVOS=$(grep -rl --include='*.jsx' -e 'boton-suave' -e 'tarjeta' -e 'campo' -e 'crema' -e 'voltear' "$DEMO" || true)
[ -n "$ARCHIVOS" ] && echo "$ARCHIVOS" | xargs sed -i -E \
  -e 's/\bboton-suave\b/jm-boton-suave/g' \
  -e 's/(^|[^-])\bboton\b/\1jm-boton/g' \
  -e 's/\btarjeta\b/jm-tarjeta/g' \
  -e 's/\bcampo\b/jm-campo/g' \
  -e 's/\bvoltear\b/jm-voltear/g' \
  -e 's/\b(bg|text|border|from|via|to|ring|fill|stroke|placeholder|divide|outline|shadow|accent|caret|decoration)-crema\b/\1-jmcrema/g'

# El icono de la cabecera se sirve desde el portfolio.
grep -rl '/icons/icon-192' "$DEMO" | xargs -r sed -i 's#/icons/icon-192.png#/demos/jib-m3ak/icon-192.png#g'

mkdir -p /c/dev/portfolio/public/demos/jib-m3ak
cp "$ORIGEN/public/icons/icon-192.png" /c/dev/portfolio/public/demos/jib-m3ak/

# Comprobación: si queda algo sin parchear, se para aquí.
if grep -rn --include='*.jsx' -e '100dvh' -e '/icons/icon-' -e '"tarjeta' -e ' tarjeta' -e 'bg-crema' "$DEMO"; then
  echo "Quedan parches sin aplicar (arriba)."; exit 1
fi

echo "Demo de Jib M3ak sincronizada."
