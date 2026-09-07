/**
 * Sehati
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
export default {
  order: 80,
  slug: 'sehati',
  name: 'Sehati',
  tagline: 'Seguimiento de una dieta pautada, en español y árabe',
  year: '2026',
  category: 'Salud y bienestar',
  platform: 'Android · Flutter',
  description:
    'Aplicación de seguimiento de una dieta pautada de cinco tomas diarias. Al abrirla muestra la toma que corresponde según el día y la hora; al marcarla como hecha, salta sola a la siguiente. Un botón cambia toda la aplicación entre español y árabe, incluida la dirección de lectura, y traduce tanto la interfaz como el nombre de cada plato del plan.',
  features: [
    'Recordatorio automático de la toma que toca según día y hora',
    'Avance al siguiente plato al marcar el actual como comido',
    'Notificaciones diarias del sistema en el idioma elegido',
    'Horarios de cada comida configurables, con reprogramación automática',
    'Español y árabe completos, con lectura derecha-izquierda',
    'Plan semanal completo consultable día a día',
    'Guía de valor nutricional y tamaños de ración',
    'Progreso guardado por fecha, que se reinicia cada día',
  ],
  stack: ['Flutter', 'flutter_localizations', 'flutter_local_notifications', 'flutter_timezone', 'intl', 'SharedPreferences'],
  highlights: [
    { label: 'Idiomas', value: '2' },
    { label: 'Tomas diarias', value: '5' },
    { label: 'Líneas Dart', value: '3.4k' },
  ],
  technical: [
    {
      title: 'Bilingüe de verdad, no solo la interfaz',
      body: 'El diccionario `S` cubre a la vez los textos de la interfaz y el nombre de cada plato del plan, de modo que cambiar de idioma no deja la mitad de la pantalla en español. El idioma es un valor del estado, no una configuración del sistema: la app declara `supportedLocales: [Locale("es"), Locale("ar")]` y el botón de cambio reconstruye el árbol entero. Eso permite alternar sin reiniciar y sin depender del idioma del teléfono, que es justo lo que hace falta cuando la app la usan dos personas distintas en el mismo dispositivo.',
    },
    {
      title: 'Derecha a izquierda de forma automática',
      body: 'Al pasar a árabe no se voltea nada a mano. Flutter propaga la direccionalidad por el árbol de widgets, así que usar `start` y `end` en lugar de `left` y `right` hace que rellenos, alineaciones, iconos direccionales y el propio orden de las filas se inviertan solos. El trabajo real no fue escribir el volteo, sino no escribir en ningún sitio «izquierda».',
    },
    {
      title: 'Notificaciones con la zona horaria del dispositivo',
      body: 'Los avisos usan `flutter_local_notifications` sobre `zonedSchedule`, que exige instantes con zona horaria. A diferencia de otro proyecto donde la zona está fijada, aquí se obtiene la del dispositivo con `flutter_timezone`, porque la app está pensada para usarse también fuera de España. Cambiar la hora de una comida en Ajustes cancela y reprograma la tanda completa de avisos, y además los reemite en el idioma que esté activo en ese momento.',
    },
    {
      title: 'Qué toma corresponde ahora',
      body: 'La pantalla de inicio no muestra una lista: muestra la toma concreta que toca. Eso se resuelve comparando la hora actual con los horarios configurados y el registro de lo ya comido hoy. El recordatorio aparece al arrancar, al volver a la app desde segundo plano y también cuando entra una toma nueva estando abierta, lo que obliga a observar el ciclo de vida en lugar de calcularlo una sola vez al construir la pantalla.',
    },
    {
      title: 'El día como unidad de estado',
      body: 'El progreso se guarda en `SharedPreferences` indexado por fecha, y cada día empieza a cero. No hay tarea programada que lo reinicie: al abrir la app se compara la fecha guardada con la de hoy y, si no coinciden, se descarta el progreso anterior. Es la misma solución que en otras rutinas diarias del portfolio, y por el mismo motivo: Android no garantiza ejecutar nada a medianoche, pero sí que la app lea el reloj al arrancar.',
    },
  ],
  demoNote:
    'Réplica web de la app Flutter, con el cambio real entre español y árabe y la inversión de la dirección de lectura.',
  repo: 'https://github.com/AngelSerranoD/sehatiapp',
};
