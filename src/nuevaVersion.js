/**
 * Recarga la página cuando se ha desplegado una versión nueva.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 *
 * Cada despliegue cambia el nombre de los archivos de /assets/ y Vercel no
 * guarda los de antes. Una pestaña abierta desde antes que abre una demo pide
 * un archivo que ya no existe y falla: recargando, coge la versión nueva.
 * Solo se recarga una vez por minuto, para no entrar en bucle si el fallo es
 * otro, y nunca sin conexión (recargar solo empeoraría las cosas).
 */
const MARCA = 'portfolio:recarga-por-version';
const ESPERA_MS = 60_000;

/** Recarga si tiene sentido; devuelve `true` si lo ha hecho. */
export function recargarSiHayVersionNueva() {
  if (!navigator.onLine) return false;
  try {
    const antes = Number(sessionStorage.getItem(MARCA) || 0);
    if (Date.now() - antes < ESPERA_MS) return false;
    sessionStorage.setItem(MARCA, String(Date.now()));
  } catch {
    return false; // sin sessionStorage no hay forma de evitar el bucle
  }
  window.location.reload();
  return true;
}
