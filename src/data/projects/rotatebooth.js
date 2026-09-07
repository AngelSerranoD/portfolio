/**
 * RotateBooth
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
export default {
  order: 70,
  slug: 'rotatebooth',
  name: 'RotateBooth',
  tagline: 'Gira muchas fotos del carrete a la vez, sin salir del iPhone',
  year: '2026',
  category: 'Utilidades',
  platform: 'Web · PWA para iOS',
  description:
    'La app Fotos de iOS solo deja girar imágenes de una en una. RotateBooth las gira por lotes: se seleccionan del carrete, se aplican rotaciones o espejo a todas de golpe con vista previa inmediata, y se devuelven a la galería. Todo el procesamiento ocurre dentro del propio teléfono, sin servidor, sin subida y sin conexión. Está escrita en JavaScript sin frameworks ni dependencias.',
  features: [
    'Rotación e inversión por lotes sobre todas las fotos seleccionadas',
    'Vista previa inmediata y deshacer paso a paso',
    'Modo sin pérdida: reescribe solo la etiqueta de orientación del JPEG',
    'Modo recomprimir: conserva los datos EXIF de fecha y lugar del original',
    'Vista a pantalla completa con navegación por deslizamiento',
    'La sesión sobrevive al cierre de la app',
    'Instalable desde Safari y funcional sin conexión',
  ],
  stack: ['JavaScript sin framework', 'Canvas API', 'IndexedDB', 'Service Worker', 'Web Share API', 'PWA'],
  highlights: [
    { label: 'Líneas JS', value: '866' },
    { label: 'Dependencias', value: '0' },
    { label: 'Servidor', value: 'Ninguno' },
  ],
  technical: [
    {
      title: 'Girar sin tocar un solo píxel',
      body: 'Un JPEG guarda su orientación en una etiqueta EXIF: la imagen puede estar físicamente en horizontal y mostrarse en vertical porque un campo dice cómo hay que girarla. El modo sin pérdida aprovecha eso y **solo reescribe esa etiqueta**. El archivo resultante es idéntico al original salvo dos bytes: es instantáneo, no recomprime nada y no degrada la calidad. El modo alternativo sí redibuja los píxeles y copia el bloque EXIF del original, para que la galería siga ordenando la foto por su fecha y su lugar reales en lugar de por el momento de la edición.',
    },
    {
      title: 'El límite de canvas de Safari',
      body: 'Safari no permite dibujar en un canvas de más de 16,7 megapíxeles. Una foto de 48 Mpx de un móvil moderno se pasa de largo, así que al recomprimir se reduce y la app avisa de que va a pasar. En modo sin pérdida el límite no existe, porque nunca se abre la imagen: solo se toca su cabecera. Es un buen ejemplo de por qué la restricción de la plataforma acabó definiendo la función principal en lugar de ser un parche.',
    },
    {
      title: 'Guardar en tandas de veinte',
      body: 'iOS se atraganta si se le pasan cien archivos de golpe al menú de compartir. El guardado se parte en tandas de veinte, y cada tanda necesita su propio toque del usuario: los navegadores solo abren el diálogo de compartir dentro del gesto que lo originó, y un bucle automático perdería esa activación a partir de la primera. Lo que parece una limitación de la interfaz es en realidad el modelo de seguridad del navegador asomando.',
    },
    {
      title: 'Sesión persistida en IndexedDB',
      body: 'Las fotos añadidas y las transformaciones pendientes se guardan en IndexedDB conforme se trabaja, así que cerrar la app por accidente a mitad de un lote de cincuenta fotos no obliga a empezar de nuevo. Se puede desactivar desde Ajustes, porque guardar imágenes del carrete en el almacenamiento del navegador es una decisión que corresponde al usuario y no a la aplicación.',
    },
    {
      title: 'Sin framework, a propósito',
      body: 'La aplicación son 866 líneas de JavaScript, 681 de CSS y ninguna dependencia. El estado es un objeto y la interfaz se actualiza con funciones explícitas (`updateTile`, `updateChrome`). Para una herramienta de una sola pantalla que debe cargar al instante desde la pantalla de inicio de un iPhone, añadir un framework habría multiplicado el peso inicial sin resolver ningún problema que aquí exista. Los iconos son un sprite SVG en línea y el historial de deshacer es una pila de operaciones.',
    },
  ],
  demoNote:
    'Réplica web de la interfaz. La versión real accede al carrete de iOS y devuelve las fotos giradas mediante el menú de compartir del sistema.',
  repo: 'https://github.com/AngelSerranoD/rotateboothapp',
};
