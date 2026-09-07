/**
 * Catálogo de proyectos.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 *
 * No hay que registrar nada aquí: cada proyecto es un archivo suelto en
 * `src/data/projects/`, y Vite los recoge todos en tiempo de compilación.
 * Para publicar uno nuevo basta con crear su archivo y darle un `order`.
 */
const modules = import.meta.glob('./projects/*.js', { eager: true });

export const projects = Object.values(modules)
  .map((m) => m.default)
  .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

export const getProject = (slug) => projects.find((p) => p.slug === slug);
