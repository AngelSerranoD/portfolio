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
    emoji: '🌿',
    year: '2026',
    status: 'Publicado',
    category: 'Salud y bienestar',
    platform: 'Android · Flutter',
    accent: '#C67C4E',
    surface: '#F9F2ED',
    featured: true,
    description:
      'Checklist diaria de ejercicios de estimulación del nervio vago, extraídos de la guía «Estimula tu nervio vago». Quince ejercicios repartidos en tres bloques —mañana, día y noche— más una secuencia de anclaje rápido de cuatro pasos para momentos de crisis. Funciona completamente offline: sin cuentas, sin backend y sin analítica.',
    features: [
      '15 ejercicios organizados en bloques de mañana, día y noche',
      'Secuencia de anclaje rápido de 4 pasos para episodios agudos',
      'Seguimiento de rachas y anillo de progreso diario',
      'Notificaciones locales programables por bloque',
      'Persistencia local: los datos nunca salen del dispositivo',
      'Tema propio en terracota con tipografía Sora',
    ],
    stack: ['Flutter', 'Dart 3.11', 'Material 3', 'flutter_local_notifications', 'SharedPreferences'],
    highlights: [
      { label: 'Ejercicios', value: '15' },
      { label: 'Bloques', value: '3' },
      { label: 'Backend', value: 'Ninguno' },
    ],
    demo: 'nervio-vago',
    demoNote: 'Réplica web fiel de la app Flutter. Las notificaciones del sistema solo funcionan en el dispositivo.',
    repo: null,
  },
  {
    slug: 'sangria',
    name: 'Sangría',
    tagline: 'Calendario menstrual con recordatorio de píldora y estadísticas',
    emoji: '🩸',
    year: '2026',
    status: 'Publicado',
    category: 'Salud y bienestar',
    platform: 'Web · PWA instalable',
    accent: '#EF5350',
    surface: '#F2F2F7',
    featured: true,
    description:
      'Calendario de seguimiento menstrual diseñado con lenguaje visual iOS. Permite registrar el ciclo día a día, controlar la toma de la píldora anticonceptiva y consultar un panel de estadísticas que calcula duración media del ciclo, regularidad y predicción del siguiente periodo. Es una PWA instalable que guarda todo en el propio dispositivo.',
    features: [
      'Calendario mensual con celdas de estado por día',
      'Registro de menstruación con intensidad y notas',
      'Control de píldora: tomada, olvidada y días de descanso',
      'Panel de estadísticas: ciclo medio, regularidad y predicción',
      'Registro de relaciones con detalle por día',
      'Tema claro y oscuro con cambio instantáneo',
      'Instalable como PWA y funcional sin conexión',
    ],
    stack: ['React 19', 'Vite', 'Tailwind CSS', 'Framer Motion', 'date-fns', 'vite-plugin-pwa'],
    highlights: [
      { label: 'Componentes', value: '12' },
      { label: 'Líneas', value: '1.8k' },
      { label: 'Offline', value: '100%' },
    ],
    demo: 'sangria',
    demoNote: 'Esta es la aplicación real, no una recreación. Los datos se guardan en tu navegador.',
    repo: null,
  },
  {
    slug: 'weighttracker',
    name: 'WeightTracker',
    tagline: 'Seguimiento de peso y evolución física con comparador de fotos',
    emoji: '⚖️',
    year: '2026',
    status: 'Publicado',
    category: 'Fitness',
    platform: 'Android nativo',
    accent: '#E7F19A',
    surface: '#F1F3F4',
    featured: true,
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
    demo: 'weighttracker',
    demoNote: 'Réplica web de la interfaz Compose original, incluida la gráfica dibujada a mano.',
    repo: null,
  },
  {
    slug: 'salud-diaria',
    name: 'SaludDiaria',
    tagline: 'Rutina terapéutica diaria para escoliosis y desrealización',
    emoji: '🦴',
    year: '2026',
    status: 'Publicado',
    category: 'Salud y bienestar',
    platform: 'Android nativo',
    accent: '#BBF246',
    surface: '#F2F3F5',
    featured: false,
    description:
      'Rutina de ejercicios terapéuticos dividida en dos programas independientes: uno de siete ejercicios de fisioterapia para escoliosis y otro de seis técnicas de regulación del sistema nervioso frente a la desrealización. Cada ejercicio incluye una explicación de su propósito clínico y el progreso se guarda por día.',
    features: [
      'Dos programas: Escoliosis (7 ejercicios) y Desrealización (6 técnicas)',
      'Descripción del propósito terapéutico de cada ejercicio',
      'Barra de progreso por sección que se actualiza al marcar',
      'Progreso persistente entre sesiones',
      'Arquitectura MVVM con Navigation Compose',
      'Diseño oscuro con acento lima y tipografía de gran escala',
    ],
    stack: ['Kotlin', 'Jetpack Compose', 'MVVM', 'Navigation Compose', 'DataStore Preferences'],
    highlights: [
      { label: 'Ejercicios', value: '13' },
      { label: 'Programas', value: '2' },
      { label: 'Arquitectura', value: 'MVVM' },
    ],
    demo: 'salud-diaria',
    demoNote: 'Réplica web de la interfaz Compose original con el contenido real de los ejercicios.',
    repo: null,
  },
];

export const getProject = (slug) => projects.find((p) => p.slug === slug);
