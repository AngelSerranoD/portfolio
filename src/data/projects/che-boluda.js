/**
 * Ché boluda
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
export default {
  order: 100,
  slug: 'che-boluda',
  name: 'Ché boluda',
  tagline: 'Un walkie-talkie en el iPhone: mantienes pulsado, hablas y tus amigas te oyen al momento',
  year: '2026',
  category: 'Comunicación',
  platform: 'Web · PWA para iOS',
  description:
    'Hecha para mi hermana y sus amigas, que querían hablar como con un walkie-talkie. Cada persona tiene su perfil y agrega a las demás con un enlace de WhatsApp. En las salas, lo que dices mientras mantienes el botón suena en directo en los móviles de quien tiene la app abierta; quien no la tiene recibe un aviso y lo escucha después, porque cada transmisión se guarda. También hay chats individuales con cada amiga. La voz viaja por Supabase Realtime con un códec escrito a mano, y las reglas de acceso viven en la propia base de datos.',
  features: [
    'Perfil con usuario, avatar de emoji o foto recortada en el móvil',
    'Amigos por enlace de invitación, pensado para WhatsApp',
    'Salas de grupo con voz en directo mientras se mantiene pulsado',
    'Chats individuales con el mismo botón de walkie',
    'Presencia: quién tiene la app abierta en cada sala',
    'Aviso flotante cuando alguien habla en otra sala',
    'Historial de voz con forma de onda y «Escuchar nuevos» en cola',
    'Avisos push a quien no estaba escuchando y número de pendientes en el icono',
    'Salas silenciables y sonidos de walkie sintetizados',
  ],
  stack: ['React', 'Vite', 'Tailwind CSS', 'Supabase', 'PostgreSQL', 'Realtime', 'Web Audio', 'AudioWorklet', 'Web Push', 'Vercel Functions', 'PWA'],
  highlights: [
    { label: 'Pruebas', value: '44' },
    { label: 'Voz', value: '8 kB/s' },
    { label: 'Coste', value: '0 €' },
  ],
  technical: [
    {
      title: 'Voz en directo sin WebRTC',
      body: 'Un AudioWorklet recoge el micro y el hilo principal lo baja a 16 kHz y lo comprime con **IMA ADPCM**, escrito a mano: 4 bits por muestra, unos 8 kB por segundo. Se emite en bloques de 300 ms por un canal privado de Supabase Realtime, y cada bloque lleva en su cabecera el estado del predictor, así que se decodifica suelto. Al soltar el botón, el archivo guardado es la concatenación de esos mismos bloques: no hay que volver a codificar. Los bloques solo se mandan si la presencia dice que hay alguien escuchando, para no gastar cupo hablando al vacío.',
    },
    {
      title: 'Safari en iPhone y el audio',
      body: 'El `AudioContext` nace parado y se vuelve a parar al bloquear la pantalla, así que se reanuda en cada toque y la interfaz avisa si llega voz que no puede sonar. Con el interruptor de silencio puesto, Web Audio calla salvo que `navigator.audioSession.type` sea `playback`. Y mientras el micro está abierto el sonido sale bajito por el auricular: por eso el micro solo se abre al pulsar y se cierra al soltar, con un doble pitido que marca cuándo ya se puede hablar.',
    },
    {
      title: 'La seguridad está en la base de datos',
      body: 'Nadie puede ver una sala, un perfil o un audio que no le corresponde, ni escuchar un canal de voz ajeno: lo impiden políticas **RLS** en las tablas, en Storage y en `realtime.messages`. Todo lo que crea filas en nombre de otros va por funciones que comprueban la amistad. La migración se prueba entera sobre PostgreSQL en WASM (**PGlite**) actuando como cada usuaria, y cada prueba se valida inyectando el agujero que debe cazar. Así apareció uno sutil: con `RETURNING`, un fallo en la política de inserción quedaba tapado por la de lectura.',
    },
    {
      title: 'El linter de Supabase y una fecha falsificable',
      body: 'Las funciones auxiliares de las políticas estaban en `public`, y la API las publicaba: con `son_amigos(a, b)` cualquiera con sesión podía consultar amistades ajenas. Pasaron a un esquema privado; las políticas las siguen por OID, pero las funciones que las llamaban por nombre hubo que recrearlas. Revisando eso salió otro fallo: el permiso de inserción sobre la tabla entera dejaba mandar un `creado_en` de 2099, que fijaba la sala arriba y pendiente para siempre. Ahora solo se pueden insertar las columnas que envía la app.',
    },
    {
      title: 'Lo que no se ve sin el servicio real',
      body: 'Para desarrollar sin backend hay un servicio local en el que cada pestaña del navegador es una persona. Todo funcionaba, pero con Supabase real entrar en una sala dejaba la pantalla en blanco: `supabase-js` devuelve el canal existente si se pide el mismo tema y no deja añadirle escuchas tras suscribirse. Ahora hay un único canal por tema repartido entre pantallas, que no se reabre hasta que el cierre anterior termina. Está probado contra un `supabase-js` falso que imita esas manías, y la lección quedó apuntada: el doble de un servicio tiene que copiar también sus restricciones.',
    },
    {
      title: 'El enlace de WhatsApp abre Safari, no la app',
      body: 'En iPhone una web instalada guarda sus datos aparte de Safari, y un enlace nunca abre la app instalada. Por eso la página de invitación ofrece tres caminos: aceptar si ya hay sesión, crear la cuenta allí mismo, o copiar la invitación y pegarla dentro de la app, que la reconoce aunque venga dentro del mensaje entero de WhatsApp.',
    },
  ],
  demoNote:
    'Es la app real sin Supabase: el servicio local de la propia app con amigas simuladas. Marta y Sofi tienen la app abierta, contestan cuando les hablas y de vez en cuando hablan solas. Las voces y el micrófono son sintéticos, así que no se pide permiso de micrófono. Toca la pantalla una vez para activar el sonido.',
  repo: 'https://github.com/AngelSerranoD/che-boluda',
  url: 'https://che-boluda.vercel.app',
};
