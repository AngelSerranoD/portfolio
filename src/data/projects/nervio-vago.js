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
  "description": "Checklist diaria de ejercicios de estimulación del nervio vago, extraídos de la guía «Estimula tu nervio vago». Quince ejercicios repartidos en tres bloques —mañana, día y noche— más una secuencia de anclaje rápido de cuatro pasos para momentos de crisis. Funciona completamente offline: sin cuentas, sin backend y sin analítica.",
  "features": [
    "15 ejercicios organizados en bloques de mañana, día y noche",
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
      "label": "Ejercicios",
      "value": "15"
    },
    {
      "label": "Bloques",
      "value": "3"
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
