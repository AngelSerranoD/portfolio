/**
 * Jib M3ak
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
export default {
  order: 110,
  slug: 'jib-m3ak',
  name: 'Jib M3ak',
  tagline: 'La compra de una familia, con fotos y en dos idiomas: español y darija marroquí',
  year: '2026',
  category: 'Productividad',
  platform: 'Web · PWA para Android e iPhone',
  description:
    'Una lista de la compra para una familia en la que no todos leen lo mismo: unos escriben en español y otra persona solo lee árabe. Cada artículo se fotografía una vez —«Añadir artículo» abre la cámara directamente— y se queda guardado para siempre; cuando falta, una flecha lo manda a la lista de la compra, que aparece a la vez en todos los móviles de la casa. Un botón cambia la app entera al darija, escrito en árabe y con tashkil, y los nombres de los artículos se traducen en los dos sentidos sin conexión ni servicios de pago.',
  features: [
    'Añadir artículo abre la cámara; la foto encoge hasta el diálogo del nombre',
    'Catálogo permanente: lo fotografiado una vez ya no se vuelve a explicar',
    'Lista de la compra compartida, que se mueve sola en los demás móviles',
    'Se tacha uno a uno mientras se compra, o «Todo comprado» de una vez',
    'Español ⇄ darija con un botón, en árabe con tashkil y de derecha a izquierda',
    'Traducción de los nombres en los dos sentidos, dentro de la app',
    'Lo que no se puede traducir se transcribe al otro alfabeto, para poder leerlo',
    'Funciona sin cobertura: se guarda en el móvil y se envía al volver la red',
    'Sin cuentas ni contraseñas: quien instala la app ya está en la lista',
    'Instalable en Android y en iPhone, con las fotos guardadas para verlas sin red',
  ],
  stack: ['React', 'Vite', 'Tailwind CSS', 'Supabase', 'PostgreSQL', 'Realtime', 'Storage', 'getUserMedia', 'Canvas', 'PWA'],
  highlights: [
    { label: 'Pruebas', value: '59' },
    { label: 'Diccionario', value: '228' },
    { label: 'Coste', value: '0 €' },
  ],
  technical: [
    {
      title: 'Un traductor de darija dentro de la app',
      body: 'No existe un «paquete de idioma» de darija: ningún traductor offline (Bergamot, Argos) la soporta, y los modelos que sí la traducen piden servidor. Así que el traductor va dentro: **228 productos y 46 modificadores** con su género en los dos idiomas, y un compositor que arma frases palabra a palabra, igual que hace la darija («zumo de naranja» → «عْصِيرْ دْ لِيمُونْ»). Los adjetivos concuerdan en cada idioma por su cuenta: «tomate rojo» es masculino en español y femenino en darija. El vocabulario está escrito a mano y contrastado con las fuentes abiertas que existen (Darija Open Dataset y las etiquetas `ary` de Wikidata), que de paso corrigieron un error: el calabacín es كُورْجِيطْ, no قَرْعَة, que es la calabaza.',
    },
    {
      title: 'Cuando no hay traducción, se transcribe',
      body: 'En esta familia hay quien **solo lee árabe**, así que dejar «Nocilla» en letras latinas no es una limitación: es una palabra que no puede ni deletrear. Lo que no está en el diccionario se pasa al otro alfabeto y vocalizado —«Nocilla» → «نُوسِيَا», «Puleva» → «پُولِيبَا»—, que es lo que se hace en Marruecos con las palabras francesas. El español se presta porque se lee como se escribe; las reglas (ch, ll, ñ, la c y la g según la vocal, la h muda) están en un archivo de 180 líneas. La regla de la app: en darija **nunca** queda una palabra en letras latinas, y hay una prueba que falla si alguna vez se cuela.',
    },
    {
      title: 'La cámara y el recorte que se ve',
      body: 'El visor enseña un marco cuadrado, y lo que se guarda es exactamente lo que hay dentro: para eso hay que deshacer el `object-fit: cover` del vídeo, o la foto sale descuadrada. La imagen se baja a 480 px en JPEG (unos 45 kB en vez de 3 MB), así sube con mala cobertura y cabe en el tope de 1 MB del servidor. Al disparar, la foto **encoge** desde el marco hasta su hueco en el diálogo del nombre: la animación mide los dos rectángulos y no adivina escalas, así que sale bien en cualquier pantalla. Si el navegador no da la cámara, queda la del móvil por `input capture`.',
    },
    {
      title: 'La compra se hace donde no hay cobertura',
      body: 'Dentro del supermercado la red va y viene, así que nada espera al servidor: cada cambio se pinta al momento, se apunta en una cola que sobrevive a cerrar la app y se envía cuando se puede. Los identificadores los pone el móvil, de modo que reenviar una operación no duplica nada. Un fallo de red reintenta; uno de la base de datos se descarta, para no atascar la cola detrás. Y «Todo comprado» borra **los artículos que se veían**, no «todo»: si alguien apuntó algo desde otro móvil mientras no había red, no se lo lleva por delante.',
    },
    {
      title: 'Una base de datos sin cuentas, pero cerrada',
      body: 'Se pidió sin registro: quien instala la app comparte lista con el resto de la familia. Eso no significa barra libre: la migración retira el permiso que Supabase da de serie y deja lo justo, **nada de UPDATE**, inserción solo de las columnas que manda la app (las fechas las pone el servidor), nombres validados en la propia base y fotos obligadas a llamarse como el artículo al que pertenecen, solo JPEG y menos de 1 MB. Todo eso se prueba sobre PostgreSQL de verdad, en WASM, y cada prueba se valida abriendo a propósito el agujero que debe cazar.',
    },
    {
      title: 'Una PWA que abre en blanco y por qué',
      body: 'La app guarda su interfaz y las fotos para funcionar sin red. Con el servidor parado, sin embargo, arrancaba **en blanco**: dos 503 en consola y nada más. El servidor manda `Vary: Origin` en los archivos, y `cache.match()` respeta esa cabecera, así que la copia guardada por el service worker no casaba con la petición que hace el navegador para el `<script>`. Un `ignoreVary: true` en todas las lecturas de la caché lo arregló. Solo aparece si se prueba de verdad: parar el servidor y recargar.',
    },
  ],
  demoNote:
    'Es la app real sin Supabase: las dos listas viven en memoria y «la familia» apunta cosas cada pocos segundos, como haría el tiempo real. La cámara está simulada con un lienzo (no se pide permiso), así que al pulsar «Añadir artículo» verás el producto que toca. Prueba el botón de idioma de arriba a la derecha: la app entera pasa al darija, de derecha a izquierda, y los nombres se traducen o se transcriben.',
  repo: 'https://github.com/AngelSerranoD/jib-m3ak',
  url: 'https://jib-m3ak.vercel.app',
};
