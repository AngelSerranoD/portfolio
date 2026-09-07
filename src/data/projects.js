/**
 * Catálogo de proyectos del portfolio.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 *
 * Para publicar una app nueva basta con añadir aquí su entrada y registrar
 * su demo en src/demos/index.js.
 */

export const projects = [
  {
    slug: 'nervio-vago',
    name: 'Nervio Vago',
    tagline: 'Rutina diaria de estimulación vagal con rachas y recordatorios',
    year: '2026',
    category: 'Salud y bienestar',
    platform: 'Android · Flutter',
    description:
      'Checklist diaria de ejercicios de estimulación del nervio vago, extraídos de la guía «Estimula tu nervio vago». Quince ejercicios repartidos en tres bloques —mañana, día y noche— más una secuencia de anclaje rápido de cuatro pasos para momentos de crisis. Funciona completamente offline: sin cuentas, sin backend y sin analítica.',
    features: [
      '15 ejercicios organizados en bloques de mañana, día y noche',
      'Secuencia de anclaje rápido de 4 pasos para episodios agudos',
      'Seguimiento de rachas y anillo de progreso diario',
      'Notificaciones locales programables por bloque',
      'Persistencia local: los datos nunca salen del dispositivo',
      'Tema propio con tipografía Sora empaquetada en la app',
    ],
    stack: ['Flutter', 'Dart 3.11', 'Provider', 'flutter_local_notifications', 'timezone', 'SharedPreferences'],
    highlights: [
      { label: 'Ejercicios', value: '15' },
      { label: 'Bloques', value: '3' },
      { label: 'Backend', value: 'Ninguno' },
    ],
    technical: [
      {
        title: 'Estado y modelo de datos',
        body: 'El estado global vive en un `AppState` que extiende `ChangeNotifier` y se inyecta con Provider. El historial no se guarda como una lista de eventos sino como un mapa `fecha → Set<id de ejercicio>`, serializado a JSON bajo la clave versionada `history_v1` en SharedPreferences. Esa forma hace que consultar «¿está hecho este ejercicio hoy?» sea O(1) (`_history[_todayKey]?.contains(id)`) y que calcular una racha sea recorrer claves de fecha hacia atrás, sin necesidad de base de datos ni de índices.',
      },
      {
        title: 'El día como problema de estado',
        body: 'Una app de rutina diaria tiene un enemigo silencioso: la medianoche. `AppState` implementa `WidgetsBindingObserver` para reaccionar al ciclo de vida de la aplicación y recalcular la clave del día cuando vuelve a primer plano, de modo que dejarla abierta toda la noche no deja la interfaz anclada a la fecha de ayer. La clave se normaliza con `padLeft(2, "0")` para que el orden lexicográfico de las cadenas coincida con el orden cronológico real.',
      },
      {
        title: 'Notificaciones con zona horaria',
        body: 'Los recordatorios usan `flutter_local_notifications` sobre `zonedSchedule`, que exige instantes `TZDateTime` en lugar de `DateTime`. El servicio inicializa la base de datos de zonas horarias y fija `Europe/Madrid` como localización, lo que evita que los cambios de hora estacionales desplacen los avisos. La reprogramación cancela y vuelve a crear la tanda completa en lugar de editar avisos sueltos: es más barato razonar sobre un estado que se reconstruye entero que sobre uno que se parchea.',
      },
      {
        title: 'Tema como sistema, no como hoja de estilos',
        body: 'La paleta, los radios de borde, los espaciados y las dos elevaciones de sombra están centralizados como constantes tipadas en `app_theme.dart`. Ningún widget escribe un color ni un valor de padding literal. El resultado es que la identidad visual se cambia en un archivo, y que las pruebas *golden* (capturas de referencia que fallan si la interfaz cambia un píxel) son estables entre ejecuciones.',
      },
      {
        title: 'Pruebas y distribución',
        body: 'El proyecto incluye pruebas unitarias sobre `AppState` y pruebas golden de pantallas completas. La build de release se genera dividida por ABI (`arm64-v8a`, `armeabi-v7a`, `x86_64`) en lugar de como APK universal, lo que reduce sustancialmente el tamaño de descarga. Los iconos de lanzador se generan por script (`tool/make_icons.py`) en vez de a mano, de forma que todas las densidades derivan de una única fuente.',
      },
    ],
    demo: 'nervio-vago',
    demoNote: 'Réplica web fiel de la app Flutter. Las notificaciones del sistema solo funcionan en el dispositivo.',
    repo: 'https://github.com/AngelSerranoD/nervio-vago',
  },
  {
    slug: 'sangria',
    name: 'Sangría',
    tagline: 'Calendario menstrual con recordatorio de píldora y estadísticas',
    year: '2026',
    category: 'Salud y bienestar',
    platform: 'Web · PWA instalable',
    description:
      'Calendario de seguimiento menstrual diseñado con lenguaje visual iOS. Permite registrar el ciclo día a día, controlar la toma de la píldora anticonceptiva y consultar un panel de estadísticas que cruza el historial para anticipar cómo será el día siguiente. Es una PWA instalable que guarda todo en el propio dispositivo.',
    features: [
      'Calendario mensual con celdas de estado por día',
      'Registro de menstruación con flujo, textura, dolores y estado físico',
      'Control de píldora configurable: días activos y días de descanso',
      'Panel de estadísticas con predicción basada en el historial',
      'Registro de relaciones con detalle por día',
      'Tema claro y oscuro con cambio instantáneo',
      'Instalable como PWA y funcional sin conexión',
    ],
    stack: ['React 19', 'Vite', 'Tailwind CSS', 'Framer Motion', 'date-fns', 'vite-plugin-pwa', 'Workbox'],
    highlights: [
      { label: 'Componentes', value: '12' },
      { label: 'Líneas', value: '1.8k' },
      { label: 'Offline', value: '100%' },
    ],
    technical: [
      {
        title: 'localStorage como base de datos',
        body: 'No hay servidor ni IndexedDB: todo el historial es un único objeto JSON en `localStorage["sangria_records"]`, indexado por fecha en formato `YYYY-MM-DD`. La decisión es deliberada y responde al dominio: son datos íntimos de salud, y la garantía más fuerte de privacidad que puede dar una aplicación es no tener adónde enviarlos. Cada acceso está envuelto en `try/catch` porque en navegación privada el almacenamiento puede lanzar excepción en lugar de devolver vacío.',
      },
      {
        title: 'Modelo de día extensible',
        body: 'Un `DayRecord` es un objeto plano con cuatro dimensiones independientes: toma de píldora, menstruación, relación y notas. Los detalles se anidan como subobjetos opcionales (`menstruationDetail`, `relationshipDetail`) en lugar de aplanarse en el registro. Así, añadir un campo nuevo —una textura, un tipo de dolor— no invalida los registros ya guardados: los antiguos simplemente no tienen esa clave y el código la lee como `null`.',
      },
      {
        title: 'Cálculo de la píldora',
        body: 'El blíster no se modela como una lista de días marcados, sino como una función pura del calendario: dada una fecha de inicio y la configuración de días activos y de descanso (21/7 por defecto, pero parametrizable), `getDayType` deriva por aritmética modular si un día concreto es de toma o de descanso, y `getPillNumber` qué pastilla del blíster corresponde. Nada que sincronizar y nada que se desalinee si la usuaria no abre la app durante una semana.',
      },
      {
        title: 'Motor de predicción',
        body: 'El panel de estadísticas no se limita a promediar duraciones. Localiza en el historial los ciclos anteriores, calcula en qué día del ciclo se encuentra hoy, y busca registros históricos que estuvieran en ese mismo día del ciclo para extraer el estado físico dominante y los dolores más frecuentes. Es predicción por analogía sobre el historial propio de la usuaria, no un modelo estadístico genérico.',
      },
      {
        title: 'Tema sin variantes de Tailwind',
        body: 'Aunque el proyecto usa Tailwind con `darkMode: "class"`, los componentes no emplean el prefijo `dark:`. El tema se propaga como prop `dark` y se resuelve con estilos en línea. Es una elección poco ortodoxa que responde a un requisito concreto: muchos colores del calendario son dinámicos (dependen del estado del día, no solo del tema), y mezclar variantes de clase con colores calculados producía reglas duplicadas y difíciles de seguir. Ese mismo desacoplamiento es lo que permite que la app se ejecute embebida en este portfolio sin teñir la página que la contiene.',
      },
      {
        title: 'Instalación y offline',
        body: 'La PWA se genera con `vite-plugin-pwa` en modo `generateSW`, que produce un service worker de Workbox con precaché de todos los recursos de la build. Como el estado vive en el dispositivo y no hay peticiones de red que interceptar, el modo offline no es una degradación: es el modo normal de funcionamiento.',
      },
    ],
    demo: 'sangria',
    demoNote: 'Esta es la aplicación real, no una recreación. Los datos se guardan en tu navegador.',
    repo: 'https://github.com/AngelSerranoD/sangria',
  },
  {
    slug: 'weighttracker',
    name: 'WeightTracker',
    tagline: 'Seguimiento de peso y evolución física con comparador de fotos',
    year: '2026',
    category: 'Fitness',
    platform: 'Android nativo',
    description:
      'Aplicación de seguimiento corporal construida íntegramente en Jetpack Compose. Registra el peso diario y lo representa en una gráfica dibujada a mano con Canvas, sin librerías externas. Incluye un módulo de estado físico donde se suben tres fotos periódicas y un comparador que enfrenta dos fechas para visualizar el progreso real.',
    features: [
      'Registro diario de peso con historial persistente',
      'Gráfica de evolución dibujada con Canvas nativo de Compose',
      'Subida de 3 fotos de estado físico por sesión',
      'Comparador lado a lado entre dos fechas cualesquiera',
      'Temporizador de cuenta atrás hasta la próxima subida',
      'Navegación inferior de 4 secciones con animaciones de entrada',
    ],
    stack: ['Kotlin', 'Jetpack Compose', 'Material 3', 'Navigation Compose', 'Coil', 'SharedPreferences'],
    highlights: [
      { label: 'Pantallas', value: '5' },
      { label: 'Líneas Kotlin', value: '662' },
      { label: 'Librerías gráficas', value: '0' },
    ],
    technical: [
      {
        title: 'Gráfica dibujada a mano',
        body: 'La curva de evolución no usa MPAndroidChart ni ninguna librería equivalente: se dibuja sobre un `Canvas` de Compose. El código normaliza los pesos al alto disponible calculando el rango con `coerceAtLeast(1f)` —una guarda contra la división por cero cuando todos los registros tienen el mismo valor—, construye un `Path` punto a punto y lo traza con `Stroke`. Los vértices se pintan como dos círculos concéntricos para lograr el efecto de punto hueco sin recurrir a máscaras.',
      },
      {
        title: 'Animación del trazado',
        body: 'La entrada de la gráfica se anima con un `Animatable` que va de 0 a 1 en 1.500 ms con interpolación `FastOutSlowInEasing`, lanzado desde un `LaunchedEffect` con la lista de datos como clave: si el historial cambia, la animación se reinicia sola. El valor animado multiplica la coordenada X de cada segmento, de modo que la línea parece dibujarse de izquierda a derecha, y los vértices se revelan solo cuando el progreso los alcanza.',
      },
      {
        title: 'Persistencia con claves compuestas',
        body: 'El repositorio usa SharedPreferences con un esquema de claves derivadas en lugar de una base de datos: `w_2026-09-07` para el peso, `photos_2026-09-07` para las rutas de las imágenes. Recuperar el historial completo consiste en filtrar `prefs.all.keys` por prefijo, reconstruir el `LocalDate` con `LocalDate.parse` y ordenar. El nombre del fichero (`weight_data_v2`) está versionado, lo que permite cambiar el esquema en el futuro sin corromper instalaciones existentes. Es una decisión proporcionada: para unos cientos de pares fecha-valor, Room sería infraestructura sin retorno.',
      },
      {
        title: 'Navegación con estado preservado',
        body: 'Las cuatro secciones se declaran en un `NavHost` con la pantalla de registro aceptando la fecha como argumento opcional en la ruta (`input_screen?date={date}`). La barra inferior navega con `popUpTo(STATS) { saveState = true }`, `launchSingleTop` y `restoreState`, la combinación que evita que la pila crezca sin control al alternar pestañas y que hace que cada sección recupere su posición de scroll al volver a ella.',
      },
      {
        title: 'Fotografías sin copia propia',
        body: 'El selector de imágenes se abre con `rememberLauncherForActivityResult` sobre `ActivityResultContracts`, y la app guarda las URI de contenido en lugar de duplicar los archivos en su almacenamiento interno. Coil se encarga de la carga y el caché mediante `AsyncImage`. La consecuencia de diseño es explícita: las fotos siguen siendo del usuario y de su galería, y la app no acumula copias.',
      },
    ],
    demo: 'weighttracker',
    demoNote: 'Réplica web de la interfaz Compose original, incluida la gráfica dibujada a mano.',
    repo: 'https://github.com/AngelSerranoD/WeightTracker',
  },
  {
    slug: 'salud-diaria',
    name: 'SaludDiaria',
    tagline: 'Rutina terapéutica diaria para escoliosis y desrealización',
    year: '2026',
    category: 'Salud y bienestar',
    platform: 'Android nativo',
    description:
      'Rutina de ejercicios terapéuticos dividida en dos programas independientes: uno de siete ejercicios de fisioterapia para escoliosis y otro de seis técnicas de regulación del sistema nervioso frente a la desrealización. Cada ejercicio incluye una explicación de su propósito clínico y el progreso se reinicia solo cada día.',
    features: [
      'Dos programas: Escoliosis (7 ejercicios) y Desrealización (6 técnicas)',
      'Descripción del propósito terapéutico de cada ejercicio',
      'Barra de progreso por sección que se actualiza al marcar',
      'Reinicio automático del progreso al cambiar de día',
      'Arquitectura MVVM con flujos reactivos',
      'Diseño oscuro de alto contraste y tipografía de gran escala',
    ],
    stack: ['Kotlin', 'Jetpack Compose', 'MVVM', 'DataStore Preferences', 'Coroutines Flow', 'Navigation Compose'],
    highlights: [
      { label: 'Ejercicios', value: '13' },
      { label: 'Programas', value: '2' },
      { label: 'Arquitectura', value: 'MVVM' },
    ],
    technical: [
      {
        title: 'MVVM con flujos, no con callbacks',
        body: 'El `SeccionViewModel` no expone métodos que devuelvan listas, sino un `StateFlow` derivado. El repositorio publica un `Flow<Map<String, Boolean>>` con el estado de completado de todos los ejercicios, y el ViewModel lo transforma con `map` para producir la lista de la sección activa, aplicando `copy(completado = …)` sobre los datos base. La interfaz no consulta: observa. Marcar un ejercicio escribe en DataStore, DataStore emite, el flujo se recalcula y Compose recompone solo lo afectado.',
      },
      {
        title: 'Suscripciones con caducidad',
        body: 'Los flujos se convierten en estado con `stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), …)`. Esos cinco segundos son el detalle relevante: mantienen viva la suscripción durante los cambios de configuración —una rotación de pantalla destruye y recrea la actividad en milisegundos— pero la cancelan si el usuario abandona la pantalla de verdad. Evita a la vez el parpadeo al rotar y la fuga de colectores en segundo plano.',
      },
      {
        title: 'DataStore sobre SharedPreferences',
        body: 'La persistencia usa DataStore Preferences en lugar de SharedPreferences: la API es asíncrona por diseño (funciones `suspend` y `Flow`), lo que elimina la escritura en el hilo principal que `apply()` disimula pero no evita. Las claves se generan por función (`booleanPreferencesKey("completado_$id")`), de modo que añadir un ejercicio nuevo al catálogo no requiere tocar la capa de datos.',
      },
      {
        title: 'El reinicio diario',
        body: 'Una rutina diaria debe empezar vacía cada mañana, pero Android no garantiza ejecutar nada a medianoche. La solución evita depender de WorkManager o de alarmas: junto al progreso se guarda la fecha de la última sesión y, al iniciarse el ViewModel, `resetSiNuevoDia()` compara esa fecha con `LocalDate.now()` dentro de una única transacción `edit`. Si no coinciden, borra las marcas y actualiza la fecha. Es idempotente, atómico y funciona igual si la app ha estado cerrada tres semanas.',
      },
      {
        title: 'Catálogo como código',
        body: 'Los trece ejercicios y sus descripciones clínicas viven en un `object EjerciciosData` como listas inmutables de `data class Ejercicio`. No hay base de datos de contenido porque el contenido no cambia en tiempo de ejecución: es una rutina cerrada, prescrita. Modelarlo como constantes en lugar de como filas evita una capa entera de persistencia, migraciones incluidas, y convierte cualquier error de contenido en un error de compilación en vez de en un dato malformado.',
      },
    ],
    demo: 'salud-diaria',
    demoNote: 'Réplica web de la interfaz Compose original con el contenido real de los ejercicios.',
    repo: 'https://github.com/AngelSerranoD/SaludDiaria',
  },
];

export const getProject = (slug) => projects.find((p) => p.slug === slug);
