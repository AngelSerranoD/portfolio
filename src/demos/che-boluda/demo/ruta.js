/**
 * Demo de Ché boluda — rutas en memoria.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 *
 * La app real usa la barra de direcciones (history.pushState). Dentro del
 * portfolio eso cambiaría la URL de la página, así que la copia de la demo
 * sustituye lib/ruta.js por este archivo, con la misma interfaz.
 * Lo copia scripts/sincronizar-demo-che-boluda.sh.
 */
import { useEffect, useState } from 'react';

let actual = '/';
const anteriores = [];
const oyentes = new Set();

export function reiniciarRuta() {
  actual = '/';
  anteriores.length = 0;
  oyentes.forEach((cb) => cb());
}

export function navegar(destino, { reemplazar = false } = {}) {
  if (destino === actual) return;
  if (!reemplazar) anteriores.push(actual);
  actual = destino;
  oyentes.forEach((cb) => cb());
}

export function atras(respaldo = '/') {
  navegar(anteriores.length ? anteriores.pop() : respaldo, { reemplazar: true });
}

export function useRuta() {
  const [ruta, setRuta] = useState(actual);
  useEffect(() => {
    const actualizar = () => setRuta(actual);
    oyentes.add(actualizar);
    actualizar();
    return () => oyentes.delete(actualizar);
  }, []);
  return ruta;
}

/** Igual que en la app: '/sala/abc/info' → { pantalla: 'info', sala: 'abc' } */
export function leerRuta(ruta) {
  const sala = ruta.match(/^\/sala\/([0-9a-f-]{36})(\/info)?\/?$/i);
  if (sala) return { pantalla: sala[2] ? 'info' : 'sala', sala: sala[1] };
  if (ruta.startsWith('/amigos')) return { pantalla: 'amigos' };
  if (ruta.startsWith('/yo')) return { pantalla: 'yo' };
  return { pantalla: 'salas' };
}
