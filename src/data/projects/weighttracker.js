/**
 * WeightTracker
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
export default {
  "order": 30,
  "slug": "weighttracker",
  "name": "WeightTracker",
  "tagline": "Seguimiento de peso y evolución física con comparador de fotos",
  "year": "2026",
  "category": "Fitness",
  "platform": "Android nativo",
  "description": "Aplicación de seguimiento corporal construida íntegramente en Jetpack Compose. Registra el peso diario y lo representa en una gráfica dibujada a mano con Canvas, sin librerías externas. Incluye un módulo de estado físico donde se suben tres fotos periódicas y un comparador que enfrenta dos fechas para visualizar el progreso real.",
  "features": [
    "Registro diario de peso con historial persistente",
    "Gráfica de evolución dibujada con Canvas nativo de Compose",
    "Subida de 3 fotos de estado físico por sesión",
    "Comparador lado a lado entre dos fechas cualesquiera",
    "Temporizador de cuenta atrás hasta la próxima subida",
    "Navegación inferior de 4 secciones con animaciones de entrada"
  ],
  "stack": [
    "Kotlin",
    "Jetpack Compose",
    "Material 3",
    "Navigation Compose",
    "Coil",
    "SharedPreferences"
  ],
  "highlights": [
    {
      "label": "Pantallas",
      "value": "5"
    },
    {
      "label": "Líneas Kotlin",
      "value": "662"
    },
    {
      "label": "Librerías gráficas",
      "value": "0"
    }
  ],
  "technical": [
    {
      "title": "Gráfica dibujada a mano",
      "body": "La curva de evolución no usa MPAndroidChart ni ninguna librería equivalente: se dibuja sobre un `Canvas` de Compose. El código normaliza los pesos al alto disponible calculando el rango con `coerceAtLeast(1f)` —una guarda contra la división por cero cuando todos los registros tienen el mismo valor—, construye un `Path` punto a punto y lo traza con `Stroke`. Los vértices se pintan como dos círculos concéntricos para lograr el efecto de punto hueco sin recurrir a máscaras."
    },
    {
      "title": "Animación del trazado",
      "body": "La entrada de la gráfica se anima con un `Animatable` que va de 0 a 1 en 1.500 ms con interpolación `FastOutSlowInEasing`, lanzado desde un `LaunchedEffect` con la lista de datos como clave: si el historial cambia, la animación se reinicia sola. El valor animado multiplica la coordenada X de cada segmento, de modo que la línea parece dibujarse de izquierda a derecha, y los vértices se revelan solo cuando el progreso los alcanza."
    },
    {
      "title": "Persistencia con claves compuestas",
      "body": "El repositorio usa SharedPreferences con un esquema de claves derivadas en lugar de una base de datos: `w_2026-09-07` para el peso, `photos_2026-09-07` para las rutas de las imágenes. Recuperar el historial completo consiste en filtrar `prefs.all.keys` por prefijo, reconstruir el `LocalDate` con `LocalDate.parse` y ordenar. El nombre del fichero (`weight_data_v2`) está versionado, lo que permite cambiar el esquema en el futuro sin corromper instalaciones existentes. Es una decisión proporcionada: para unos cientos de pares fecha-valor, Room sería infraestructura sin retorno."
    },
    {
      "title": "Navegación con estado preservado",
      "body": "Las cuatro secciones se declaran en un `NavHost` con la pantalla de registro aceptando la fecha como argumento opcional en la ruta (`input_screen?date={date}`). La barra inferior navega con `popUpTo(STATS) { saveState = true }`, `launchSingleTop` y `restoreState`, la combinación que evita que la pila crezca sin control al alternar pestañas y que hace que cada sección recupere su posición de scroll al volver a ella."
    },
    {
      "title": "Fotografías sin copia propia",
      "body": "El selector de imágenes se abre con `rememberLauncherForActivityResult` sobre `ActivityResultContracts`, y la app guarda las URI de contenido en lugar de duplicar los archivos en su almacenamiento interno. Coil se encarga de la carga y el caché mediante `AsyncImage`. La consecuencia de diseño es explícita: las fotos siguen siendo del usuario y de su galería, y la app no acumula copias."
    }
  ],
  "demoNote": "Réplica web de la interfaz Compose original, incluida la gráfica dibujada a mano.",
  "repo": "https://github.com/AngelSerranoD/WeightTracker"
};
