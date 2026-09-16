/**
 * DailyWeigh
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
export default {
  order: 90,
  slug: 'dailyweigh',
  name: 'DailyWeigh',
  tagline: 'El peso de cada día y la media de cada semana, en la pantalla de inicio del iPhone',
  year: '2026',
  category: 'Salud y bienestar',
  platform: 'Web · PWA para iOS',
  description:
    'Registro diario de peso pensado para abrirse un segundo cada mañana. La primera vez que se entra cada día aparece la hoja para apuntar el peso; la app calcula la media de la semana solo con los días que tienen dato y la compara con la anterior. Las semanas pasadas quedan en un historial que se abre con su gráfica y el peso de cada día. No hay cuenta ni servidor: los datos viven en el propio iPhone, funciona sin conexión y se puede exportar una copia.',
  features: [
    'Saludo según la hora del día',
    'Hoja de peso que se abre sola la primera vez que se entra cada día',
    'Guardado en el día elegido, con acceso a días anteriores',
    'Media semanal de lunes a domingo sobre los días con peso',
    'Diferencia con la semana anterior y con el último registro',
    'Historial de semanas con gráfica y peso diario de cada una',
    'Copia de seguridad en JSON para exportar e importar',
    'Instalable desde Safari y funcional sin conexión',
  ],
  stack: ['React', 'Vite', 'Tailwind CSS', 'Service Worker', 'localStorage', 'Web Share API', 'PWA'],
  highlights: [
    { label: 'Pruebas', value: '15' },
    { label: 'Dependencias', value: '2' },
    { label: 'Servidor', value: 'Ninguno' },
  ],
  technical: [
    {
      title: 'Un día no es una fecha UTC',
      body: 'Cada peso se guarda con una clave local `AAAA-MM-DD`. Nunca con `toISOString()`: convierte a UTC, y a las 00:30 en Madrid devolvería el día anterior, justo a la hora en que alguien se pesa antes de dormir. Para sumar días se trabaja siempre a mediodía, así que un cambio de hora nunca hace saltar la fecha. Las pruebas se ejecutan con la zona `Europe/Madrid` fijada y cruzan a propósito los dos cambios de hora y el cambio de año.',
    },
    {
      title: 'La gráfica y los días comparten rejilla',
      body: 'Debajo de la gráfica está la tira con los siete días, y cada punto cae exactamente encima de su día. Para eso los dos usan columnas de un séptimo del ancho, y la tira no tiene `gap`: el hueco va dentro de cada celda, o los centros dejarían de coincidir. La línea es un SVG estirado con `vector-effect: non-scaling-stroke`; los puntos, en cambio, son HTML posicionado en porcentaje, porque estirar el SVG convertiría los círculos en óvalos.',
    },
    {
      title: 'El teclado decimal de iOS no tiene Intro',
      body: 'Safari no encoge la ventana al sacar el teclado, solo el `visualViewport`, así que una hoja pegada abajo queda tapada. Y el teclado numérico no tiene tecla para enviar, de modo que el botón Guardar tiene que verse sí o sí. La hoja se desplaza la altura del teclado medida en cada cambio del viewport. Los botones de sumar y restar 100 g cancelan el `mousedown` para no quitar el foco al campo, porque perderlo escondería el teclado a cada toque. Y lo tecleado se recorta en vez de rechazarse: pegar «72.46» deja «72,4», no un campo vacío.',
    },
    {
      title: 'Sin conexión desde la primera visita, sin plugin',
      body: 'Vite pone un hash en el nombre de cada archivo, y un service worker escrito a mano no puede saberlos de antemano. Al instalarse, el service worker descarga el `index.html`, lee de él las rutas de `/assets/` y las guarda, así que la app queda completa en la primera visita. Su versión es la huella del HTML compilado, que la build escribe dentro del archivo: cada despliegue que cambia algo estrena caché y borra la anterior. La CSP exige Trusted Types, y `serviceWorker.register()` es uno de los destinos protegidos, así que la URL pasa por una política que solo admite `/sw.js`.',
    },
    {
      title: 'Medias que cuadran con lo que se lee',
      body: 'Si una semana muestra 75,7 kg y la anterior 75,1, la diferencia tiene que decir 0,6 aunque con las medias sin redondear salga 0,54. Por eso la comparación se hace sobre las medias ya redondeadas a un decimal. Y solo se compara con la semana justo anterior: si hubo una semana sin pesarse, «respecto a la anterior» estaría comparando con algo de hace quince días, y esa semana simplemente no muestra diferencia.',
    },
  ],
  demoNote:
    'Es la app real con siete semanas de ejemplo guardadas en memoria. Como hoy no tiene peso, la hoja se abre sola, igual que en la primera apertura del día.',
  repo: 'https://github.com/AngelSerranoD/dailyweigh',
  url: 'https://dailyweigh.vercel.app',
};
