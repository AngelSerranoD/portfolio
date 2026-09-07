/**
 * Registro de demos. Para publicar una app nueva, añade aquí su entrada
 * con el mismo slug que en src/data/projects.js.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
import { lazy } from 'react';

export const demoRegistry = {
  'nervio-vago': lazy(() => import('./NervioVagoDemo')),
  sangria: lazy(() => import('./sangria/SangriaDemo')),
  weighttracker: lazy(() => import('./WeightTrackerDemo')),
  'salud-diaria': lazy(() => import('./SaludDiariaDemo')),
};

export const getDemo = (slug) => demoRegistry[slug] ?? null;
