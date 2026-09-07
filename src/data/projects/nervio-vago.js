/**
 * Nervio Vago
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
export default {
  "order": 10,
  "slug": "nervio-vago",
  "name": "Nervio Vago",
  "tagline": "Rutina diaria de estimulación vagal con rachas y recordatorios",
  "year": "2026",
  "category": "Salud y bienestar",
  "platform": "Android · Flutter",
  "description": "Rutina diaria guiada de estimulación del nervio vago, extraída de la guía «Estimula tu nervio vago». La pantalla principal no es una lista de tareas sino una agenda: 21 citas con hora, repartidas en siete franjas desde las 07:00 hasta las 23:00, de las que la app enseña una sola cada vez con su explicación entera y avanza al marcarla. Las técnicas que hay que repetir aparecen tantas veces como toca hacerlas —tres cortes de movimiento, tres de voz, dos de respiración antes de comer y dos tandas de gárgaras— cada una en su momento del día. Incluye una secuencia de anclaje rápido de cuatro pasos para momentos de crisis. Funciona completamente offline: sin cuentas, sin backend y sin analítica.",
  "features": [
    "Agenda del día: 21 citas con hora, de las 07:00 a las 23:00",
    "Guía paso a paso: solo se ve la cita que toca, y avanza al marcarla",
    "Las técnicas que se repiten salen varias veces, en su momento",
    "Siete franjas horarias con acento de color que oscurece según el día",
    "«Lo dejo para luego» aparta una cita sin contarla como hecha",
    "Secuencia de anclaje rápido de 4 pasos para episodios agudos",
    "Seguimiento de rachas y anillo de progreso diario",
    "Notificaciones locales programables por bloque",
    "Persistencia local: los datos nunca salen del dispositivo",
    "Tema propio con tipografía Sora empaquetada en la app"
  ],
  "stack": [
    "Flutter",
    "Dart 3.11",
    "Provider",
    "flutter_local_notifications",
    "timezone",
    "SharedPreferences"
  ],
  "highlights": [
    {
      "label": "Citas al día",
      "value": "21"
    },
    {
      "label": "Franjas",
      "value": "7"
    },
    {
      "label": "Backend",
      "value": "Ninguno"
    }
  ],
  "technical": [
    {
      "title": "Estado y modelo de datos",
      "body": "El estado global vive en un `AppState` que extiende `ChangeNotifier` y se inyecta con Provider. El historial no se guarda como una lista de eventos sino como un mapa `fecha → Set<id de ejercicio>`, serializado a JSON bajo la clave versionada `history_v1` en SharedPreferences. Esa forma hace que consultar «¿está hecho este ejercicio hoy?» sea O(1) (`_history[_todayKey]?.contains(id)`) y que calcular una racha sea recorrer claves de fecha hacia atrás, sin necesidad de base de datos ni de índices."
    },
    {
      "title": "La rutina como secuencia, no como lista",
      "body": "La primera versión mostraba los ejercicios a la vez, todos marcables y en el orden en que los agrupaba la guía original, que además escondía las repeticiones dentro del texto («cada hora», «dos o tres veces al día»). La lista se rehízo siguiendo el reloj en lugar del índice del PDF, y la pantalla como una línea temporal con un único paso abierto. La clave del diseño es que **no existe un índice guardado**: el ejercicio actual se deriva en cada `build` como el primero de la lista que no está ni hecho ni apartado. No hay estado que sincronizar ni que pueda corromperse al desmarcar algo a mitad, y reordenar `kExercises` reordena la guía sin tocar una línea de la interfaz. «Apartado» vive en su propia clave (`skipped_v1`) precisamente para que apartar algo no pueda contar nunca como hacerlo: no toca ni el anillo de progreso ni la racha, solo deja avanzar la guía. Cuando se agotan los pendientes, la app vuelve a ofrecer los apartados en orden, de modo que la secuencia nunca se queda sin siguiente paso mientras quede algo por hacer."
    },
    {
      "title": "Ampliar la rutina sin romper el pasado",
      "body": "Reordenar la rutina por horas la hizo crecer de 15 a 21 citas, y eso tiene un efecto que no se ve venir: «día completo» se calculaba comparando lo marcado contra el total actual, así que subir el total habría convertido en incompletos todos los días ya cerrados y habría mandado la racha a cero de golpe. La solución fue sellar el dato: junto al historial se guarda `totals_v1`, un mapa `fecha → cuántas citas tenía la rutina ese día`, y cada día se mide contra el suyo. Los días anteriores a esa clave caen en un total heredado declarado como constante. Además, los quince identificadores de la rutina anterior se conservaron en la cita principal de cada técnica y las repeticiones nuevas llevan sufijo (`d1b`, `d1c`), de modo que el historial existente sigue contando en lugar de quedar huérfano."
    },
    {
      "title": "El día como problema de estado",
      "body": "Una app de rutina diaria tiene un enemigo silencioso: la medianoche. `AppState` implementa `WidgetsBindingObserver` para reaccionar al ciclo de vida de la aplicación y recalcular la clave del día cuando vuelve a primer plano, de modo que dejarla abierta toda la noche no deja la interfaz anclada a la fecha de ayer. La clave se normaliza con `padLeft(2, \"0\")` para que el orden lexicográfico de las cadenas coincida con el orden cronológico real."
    },
    {
      "title": "Notificaciones con zona horaria",
      "body": "Los recordatorios usan `flutter_local_notifications` sobre `zonedSchedule`, que exige instantes `TZDateTime` en lugar de `DateTime`. El servicio inicializa la base de datos de zonas horarias y fija `Europe/Madrid` como localización, lo que evita que los cambios de hora estacionales desplacen los avisos. La reprogramación cancela y vuelve a crear la tanda completa en lugar de editar avisos sueltos: es más barato razonar sobre un estado que se reconstruye entero que sobre uno que se parchea."
    },
    {
      "title": "Tema como sistema, no como hoja de estilos",
      "body": "La paleta, los radios de borde, los espaciados y las dos elevaciones de sombra están centralizados como constantes tipadas en `app_theme.dart`. Ningún widget escribe un color ni un valor de padding literal. El resultado es que la identidad visual se cambia en un archivo, y que las pruebas *golden* (capturas de referencia que fallan si la interfaz cambia un píxel) son estables entre ejecuciones."
    },
    {
      "title": "Pruebas y distribución",
      "body": "El proyecto incluye pruebas unitarias sobre `AppState` y pruebas golden de pantallas completas. La build de release se genera dividida por ABI (`arm64-v8a`, `armeabi-v7a`, `x86_64`) en lugar de como APK universal, lo que reduce sustancialmente el tamaño de descarga. Los iconos de lanzador se generan por script (`tool/make_icons.py`) en vez de a mano, de forma que todas las densidades derivan de una única fuente."
    }
  ],
  "demoNote": "Réplica web fiel de la app Flutter. Las notificaciones del sistema solo funcionan en el dispositivo.",
  "repo": "https://github.com/AngelSerranoD/nervio-vago"
};
