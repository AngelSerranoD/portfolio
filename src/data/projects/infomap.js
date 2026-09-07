/**
 * InfoMap
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
export default {
  order: 60,
  slug: 'infomap',
  name: 'InfoMap',
  tagline: 'Mapa con GPS que explica los sitios que tienes alrededor',
  year: '2026',
  category: 'Mapas y viajes',
  platform: 'Web · PWA instalable',
  description:
    'Mapa con posición en tiempo real que muestra los lugares de interés del entorno. Al tocar uno aparece su ficha con el resumen de Wikipedia y los datos de OpenStreetMap: horario, teléfono y dirección. Incluye brújula, búsqueda, favoritos, indicaciones hacia la app de mapas del sistema y lectura en voz alta. Funciona sin conexión con lo ya visitado y no usa ninguna clave de API ni servicio de pago.',
  features: [
    'GPS en directo con margen de error y seguimiento continuo',
    'Brújula: el mapa gira hacia donde mira el usuario',
    'Lugares de OpenStreetMap por categoría según la zona visible',
    'Ficha con resumen de Wikipedia en español, con respaldo en inglés',
    'Buscador de sitios y direcciones, y favoritos guardados',
    'Indicaciones hacia Apple Maps o Google Maps',
    'Lectura en voz alta de las fichas',
    'Funciona sin conexión con las teselas y fichas ya vistas',
  ],
  stack: ['React 19', 'TypeScript', 'Vite', 'Leaflet', 'IndexedDB', 'Overpass API', 'Nominatim', 'Wikipedia API'],
  highlights: [
    { label: 'Líneas', value: '5k' },
    { label: 'Dependencias', value: '3' },
    { label: 'Claves de API', value: '0' },
  ],
  technical: [
    {
      title: 'Tres dependencias y ninguna clave',
      body: 'Todo el proyecto se sostiene sobre `react`, `react-dom` y `leaflet`. No hay `react-leaflet`: el mapa se controla con la API imperativa de Leaflet desde dentro de un efecto, porque envolver una librería que ya gestiona su propio ciclo de vida en un componente declarativo añade una capa que hay que sincronizar a mano. Los datos vienen de servicios abiertos —Overpass para los lugares, Nominatim para las direcciones, Wikipedia para los resúmenes—, así que la app no tiene ninguna clave que rotar ni ninguna cuota que pagar.',
    },
    {
      title: 'Cascada de servidores para Overpass',
      body: 'Overpass reparte las peticiones entre varios servidores y muchas veces responde con «demasiadas peticiones». En lugar de fallar, la consulta recorre una lista de intentos con espera creciente: primero el servidor rápido (`lz4`) y después el principal. Cada consulta lleva su propio límite de tiempo de 25 segundos, y hay topes de resultados —1.200 lugares, 900 en zonas densas— porque el problema real de esta API no es que devuelva poco, sino que en el centro de una ciudad devuelva tanto que el mapa se ahogue.',
    },
    {
      title: 'El mapa como cuadrícula cacheable',
      body: 'Los lugares no se piden por «lo que se ve ahora», sino por teselas de una cuadrícula fija, y cada tesela se guarda en IndexedDB con su clave. Mover el mapa un poco reutiliza lo que ya se pidió en lugar de lanzar una consulta nueva, y volver a un barrio visitado ayer no gasta red. Una función de poda recorre el almacén con un cursor —que va de la tesela más antigua a la más nueva— y va borrando las primeras, que son justo las que sobran.',
    },
    {
      title: 'Filtros compilados en tiempo de carga',
      body: 'Las siete categorías se definen de forma declarativa como pares clave-valor de OpenStreetMap, pero Overpass necesita una consulta con selectores. En vez de construirla en cada petición, se fusionan todas las categorías en dos juegos de selectores —normal y denso— una única vez al cargar el módulo. Añadir una categoría es tocar una lista, no una cadena de consulta.',
    },
    {
      title: 'TypeScript donde importa',
      body: 'El proyecto está escrito en TypeScript con la comprobación de tipos como parte de la build (`tsc -b && vite build`), de modo que un error de tipos rompe el despliegue en lugar de llegar al usuario. La lógica vive en `src/lib` como módulos sin React —geometría, teselas, horarios, favoritos, voz, Wikipedia—, y los hooks (`useGeolocation`, `useHeading`, `usePlaces`) son la única frontera con la interfaz. Eso permite razonar sobre la parte difícil sin montar un componente.',
    },
  ],
  demoNote:
    'Réplica web de la interfaz con datos de ejemplo. La versión real usa el GPS del dispositivo y consulta OpenStreetMap y Wikipedia en vivo.',
  repo: 'https://github.com/AngelSerranoD/infomapapp',
};
