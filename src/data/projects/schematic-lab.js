/**
 * Schematic Lab
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
export default {
  order: 10,
  slug: 'schematic-lab',
  name: 'Schematic Lab',
  tagline: 'Un visor y editor de schematics de Minecraft: los abres, los miras en 3D y sabes qué materiales hacen falta',
  year: '2026',
  category: 'Herramientas',
  platform: 'Windows · Tauri 2 (Rust + React)',
  description:
    'Una aplicación de escritorio para quien colecciona construcciones de Minecraft. Importa schematics de cuatro formatos (.litematic, .schem, .schematic y .nbt), los guarda en una biblioteca local y los enseña en un visor 3D. Calcula los materiales necesarios en tres modos —exacto, en stacks y en shulkers— y permite hacer cambios puntuales o reemplazar familias enteras de bloques, con un historial para deshacer. Funciona sin conexión: el núcleo, escrito en Rust, lee los archivos, genera la malla y lleva la biblioteca; React solo pinta.',
  features: [
    'Importar schematics de cuatro formatos, detectados por su contenido y no por la extensión',
    'Biblioteca local con miniaturas; eliminar manda los archivos a la Papelera de Windows',
    'Visor 3D con giro, inspección de bloques y corte por capas',
    'Materiales en tres modos: recuento exacto, en stacks y en shulkers',
    'Lista de materiales con casillas de lo ya reunido y exportación a CSV',
    'Modo Modificar: cambios puntuales y reemplazo de un bloque por otro parecido, o de su familia entera',
    'Historial de 20 versiones por schematic, con restauración y exportación',
    'Texturas reales si hay Minecraft instalado; si no, colores medios por bloque',
  ],
  stack: ['Tauri 2', 'Rust', 'React 19', 'TypeScript', 'Vite', 'Three.js', 'react-three-fiber', 'Zustand', 'Motion', 'SQLite', 'fastnbt', 'Vitest', 'NSIS'],
  highlights: [
    { label: 'Pruebas', value: '211' },
    { label: 'Formatos', value: '4' },
    { label: 'Instalador', value: '3,24 MiB' },
  ],
  technical: [
    {
      title: 'Parsers propios que miran el contenido',
      body: 'Un `.nbt` puede ser una estructura de Minecraft o un schematic antiguo con otro nombre, y la extensión no dice cuál es. Los lectores de los cuatro formatos están escritos a mano sobre `fastnbt`, y el formato se decide **por las etiquetas del NBT**, no por el nombre del archivo. Antes de interpretar nada se comprueba que el NBT no anide más de 128 niveles, así que un archivo hecho para desbordar la pila da un error legible en vez de cerrar la app. Y un archivo pequeño no puede declarar cientos de millones de posiciones para que el lector reserve memoria antes de validar: el volumen sin datos detrás tiene tope.',
    },
    {
      title: 'Un visor que no dibuja lo que no se ve',
      body: 'El mallado se hace en Rust, no en el navegador, por **chunks de 16³ bloques** y en paralelo con rayon. Cada bloque declara qué parte de sus seis caras tapa por completo, y una cara no se emite si el vecino la cubre; dos cristales juntos tampoco dibujan la cara que comparten. Con las caras que quedan se hace **greedy meshing**: los rectángulos del mismo material se fusionan en uno. Un macizo de un millón de bloques queda en 588 triángulos. La malla viaja al frontend en un **binario** con cabecera propia y no en JSON, y el visor solo vuelve a dibujar cuando algo cambia.',
    },
    {
      title: 'Editar sin poder romper la copia',
      body: 'Cada edición se guarda siempre como `.litematic` sobre la copia de la biblioteca, con un **historial de 20 versiones** por schematic; las más antiguas van a la Papelera. La sustitución es atómica: lo nuevo se escribe en un temporal con `sync_all`, la copia anterior pasa al historial sin dejar de existir ni un instante, y las filas del índice SQLite se confirman en una transacción solo cuando los archivos ya están en su sitio. Si algo falla antes, se deshace lo hecho y todo queda como estaba. En Windows el renombrado se reintenta, porque el visor puede tener el archivo abierto un momento.',
    },
    {
      title: 'Materiales: contar bien y de tres maneras',
      body: 'La lista parte de un **recuento exacto** por ítem y lo reparte en stacks de 64, de 16 o de 1 según lo que sea, y en shulkers de 27 stacks. El total de shulkers sale de los huecos de inventario (`ceil(stacks / 27)`), no de sumar cajas por ítem, que daría de más. Los ID antiguos sin traducción se agrupan aparte, para que se vean y no se cuelen como bloques. Se puede restringir a una región o a un rango de capas, y lo ya reunido queda marcado en la biblioteca.',
    },
    {
      title: 'Constantes en dos lenguajes, vigiladas por tests',
      body: 'Hay valores que el núcleo de Rust y la interfaz repiten y que no se pueden importar de un lado a otro: el tamaño de la cabecera de un chunk, la versión del formato de malla, los topes de longitud de un nombre. En vez de confiar en acordarse, `espejos.rs` **lee los archivos de TypeScript** y comprueba que cada constante coincide con la de Rust: si cambias una y olvidas su espejo, fallan las pruebas. Es la misma idea que los vectores de prueba compartidos, aplicada a números sueltos.',
    },
    {
      title: 'Lo que destapó probar el programa compilado',
      body: 'Conducir la app ya compilada, como la usaría otra persona, sacó detalles que los tests no veían. La confirmación de Aplicar decía 662 bloques y el historial 661, porque un ladrillo se contaba dos veces. Pulsar Esc con cambios pendientes abría el aviso y lo cerraba en el acto, porque la misma pulsación llegaba al diálogo recién abierto. Y el giro automático se paraba solo en 3 de 14 arranques: con el dibujo bajo demanda dependía de que cada movimiento de cámara pidiera el siguiente fotograma, y ahora lo pide cada fotograma desde dentro.',
    },
  ],
  demoFrame: 'escritorio',
  demoNote:
    'Es el frontend real de la app de escritorio; lo que haría su núcleo de Rust lo responde aquí una copia simulada en memoria. No hay texturas de Minecraft: cada bloque va con su color medio, como la app recién instalada sin el juego. Se puede girar el modelo, inspeccionar bloques y ver los materiales. En Modificar los cambios se quedan en pendientes, pero «Aplicar» no guarda nada: tampoco se importa ni se exporta ningún archivo.',
  downloads: [
    {
      label: 'Microsoft Store',
      href: 'https://apps.microsoft.com/detail/9P3WWV65DTR6',
    },
    {
      label: 'Descargar para Windows',
      href: 'https://github.com/AngelSerranoD/schematic-lab/releases/download/v0.1.0/SchematicLab_0.1.0_x64-setup.exe',
    },
  ],
  repo: 'https://github.com/AngelSerranoD/schematic-lab',
};
