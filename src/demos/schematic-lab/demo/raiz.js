/**
 * Demo de Schematic Lab — raíz de la app dentro del marco.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 *
 * La app real lee sus tokens (colores del visor, muelles de Motion) y pone el
 * tema en <html>. En la demo todo eso vive en el div que la envuelve (el CSS
 * de la app está encerrado en él), así que la copia cambia
 * `document.documentElement` por `raizDemo()`. Lo parchea
 * scripts/sincronizar-demo-schematic-lab.sh.
 */
let raiz = null;

/** La fija index.jsx antes de montar la app (y la suelta al desmontarla). */
export function fijarRaizDemo(elemento) {
  raiz = elemento;
}

export function raizDemo() {
  return raiz ?? document.documentElement;
}
