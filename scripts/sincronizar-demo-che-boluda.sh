#!/usr/bin/env bash
#
# Copia la app real de Ché boluda a su demo del portfolio y aplica los parches
# para que viva dentro del marco del móvil. Repetirlo cada vez que cambie la app.
#
# Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.

set -euo pipefail

ORIGEN="/c/dev/che-boluda"
DEMO="/c/dev/portfolio/src/demos/che-boluda"
PARTES=(App.jsx contexto.js componentes hooks lib pantallas)

[ -d "$DEMO/demo" ] || { echo "No encuentro $DEMO/demo"; exit 1; }

for parte in "${PARTES[@]}"; do rm -rf "${DEMO:?}/$parte"; done
for parte in "${PARTES[@]}"; do cp -r "$ORIGEN/src/$parte" "$DEMO/"; done

# Sin Supabase: la demo usa el servicio local con amigas simuladas.
rm "$DEMO/lib/servicio/supabase.js" "$DEMO/lib/servicio/index.js" "$DEMO/lib/servicio/canales.js"

# Rutas en memoria: no tocar la barra de direcciones del portfolio.
cp "$DEMO/demo/ruta.js" "$DEMO/lib/ruta.js"

# Alturas del marco, no de la ventana (de más largo a más corto).
grep -rl --include='*.jsx' 'dvh' "$DEMO/App.jsx" "$DEMO/componentes" "$DEMO/pantallas" \
  | xargs sed -i -e 's/min-h-dvh/min-h-full/g' -e 's/max-h-\[90dvh\]/max-h-[90%]/g' -e 's/\bh-dvh\b/h-full/g'

# Iconos de la demo y enlaces de invitación a la app publicada.
grep -rl '/icons/icon-' "$DEMO/App.jsx" "$DEMO/componentes" "$DEMO/pantallas" \
  | xargs sed -i 's#/icons/icon-#/demos/che-boluda/icon-#g'
sed -i "s#location\.origin#'https://che-boluda.vercel.app'#g" "$DEMO/componentes/Hojas.jsx" "$DEMO/pantallas/Invitacion.jsx"

mkdir -p /c/dev/portfolio/public/demos/che-boluda
cp "$ORIGEN/public/icons/icon-192.png" "$ORIGEN/public/icons/icon-512.png" /c/dev/portfolio/public/demos/che-boluda/

# Comprobación: si queda algo sin parchear, se para aquí.
if grep -rn -e 'dvh' -e '/icons/icon-' -e 'location\.origin' "$DEMO/App.jsx" "$DEMO/componentes" "$DEMO/pantallas"; then
  echo "Quedan parches sin aplicar (arriba)."; exit 1
fi
echo "Demo sincronizada desde $ORIGEN"
