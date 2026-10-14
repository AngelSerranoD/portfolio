/**
 * Litematica3D (ficha provisional)
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
export default {
  order: 130,
  slug: 'litematica3d',
  name: 'Litematica3D',
  tagline: 'Un visor de escritorio para schematics de Minecraft',
  year: '2026',
  category: 'Herramientas',
  platform: 'Escritorio · Windows',
  description: 'Ficha provisional. Visor 3D de schematics de Litematica hecho con Tauri.',
  features: ['Visor 3D de schematics'],
  stack: ['Tauri', 'React'],
  demoFrame: 'escritorio',
  demoNote:
    'Es la interfaz real de la app de escritorio; lo que hace su núcleo de Rust lo responde aquí una copia en memoria con tres schematics de prueba que el propio núcleo dejó preparados. Sin Minecraft instalado, los bloques van con su color medio, como la app recién instalada. Se puede girar el modelo, inspeccionar bloques, ver los materiales y preparar cambios en Modificar, pero nada se guarda: ni importar, ni aplicar cambios, ni exportar.',
};
