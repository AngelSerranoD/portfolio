/**
 * Worker que anima las portadas agrietables del grid de proyectos.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 *
 * Cada tarjeta le transfiere su canvas (OffscreenCanvas) y desde entonces
 * solo le manda órdenes: la portada ya pintada, «rómpete» y «restáurate».
 * Aquí no llega nada del trabajo de la página (React, montar una demo), así
 * que la animación no se frena aunque el hilo principal esté ocupado.
 */
import CapaDeGrietas from './grietas';

const capas = new Map();

self.onmessage = ({ data: m }) => {
  if (m.tipo === 'crear') {
    capas.set(m.id, new CapaDeGrietas(m.canvas, { reducido: m.reducido, semilla: m.semilla }));
    return;
  }

  const capa = capas.get(m.id);
  if (!capa) return;

  switch (m.tipo) {
    case 'portada':
      capa.preparar(m.ancho, m.alto, m.dpr, m.portada);
      break;
    case 'romper':
      capa.romper();
      break;
    case 'restaurar':
      capa.restaurar();
      break;
    case 'destruir':
      capa.destruir();
      capas.delete(m.id);
      break;
    default:
      break;
  }
};
