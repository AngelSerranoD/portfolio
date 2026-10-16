/**
 * Registro de demos.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 *
 * Tampoco hay que registrar nada: la demo de un proyecto es el archivo
 * `<slug>.jsx` de esta carpeta, o `<slug>/index.jsx` si necesita archivos
 * propios. Vite las carga bajo demanda, así que el peso de cada demo no
 * entra en el paquete inicial del portfolio. Si una demo no
 * carga porque la pestaña es de antes del último despliegue, se recarga la
 * página (nuevaVersion.js).
 */
import { lazy } from 'react';
import { recargarSiHayVersionNueva } from '../nuevaVersion';

const modules = import.meta.glob(['./*.jsx', './*/index.jsx']);

/** Deriva el slug de la ruta: './sangria/index.jsx' → 'sangria'. */
function slugFromPath(path) {
  const clean = path.replace('./', '').replace(/\.jsx$/, '');
  return clean.endsWith('/index') ? clean.slice(0, -'/index'.length) : clean;
}

const demos = Object.fromEntries(
  Object.entries(modules).map(([path, loader]) => [
    slugFromPath(path),
    lazy(() =>
      loader().catch((error) => {
        /* Mientras recarga, la demo sigue «cargando» en vez de fallar. */
        if (recargarSiHayVersionNueva()) return new Promise(() => {});
        throw error;
      })
    ),
  ])
);

export const hasDemo = (slug) => slug in demos;

export const getDemo = (slug) => demos[slug] ?? null;
