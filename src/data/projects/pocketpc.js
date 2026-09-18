/**
 * PocketPC
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
const RELEASE = 'https://github.com/AngelSerranoD/pocketpc/releases/download/v1.0.2';

export default {
  order: 120,
  slug: 'pocketpc',
  name: 'PocketPC',
  tagline: 'Las pantallas del PC en el móvil, desde cualquier sitio, y manejarlas con el dedo',
  year: '2026',
  category: 'Productividad',
  platform: 'Android · Kotlin + Windows · Electron',
  description:
    'Un escritorio remoto propio: dos aplicaciones que se hablan. La del PC vive en la bandeja del sistema, comparte el monitor que se elija y ejecuta el ratón y el teclado que llegan del móvil; la del móvil muestra «Mis PCs» con quién está encendido en ese momento, deja escoger pantalla (con miniaturas de cada monitor) y la maneja como el panel táctil de un portátil o tocando directamente donde se quiere hacer clic. Funciona desde cualquier red sin abrir puertos del router, y nadie —ni siquiera el servidor que pone en contacto a los dos— puede ver la imagen ni mover el ratón.',
  features: [
    '«Mis PCs» con el estado de cada uno en vivo: encendido, bloqueado o en uso',
    'Elegir monitor con miniaturas reales; cambiar de uno a otro sin cortar',
    'Modo ratón (panel táctil) y modo táctil (tocar donde se hace clic)',
    'Zoom con los dedos sobre la imagen a resolución completa del PC',
    'Teclado del móvil directo al PC, con Ctrl, Alt, Mayús y Win fijables',
    'Atajos a un toque: copiar, pegar, Alt+Tab, escritorio, administrador de tareas',
    'Tres calidades de imagen: alta a 60 fps, media y ahorro de datos',
    'Emparejar una sola vez escaneando un QR que aparece en el PC',
    'La app del PC arranca con Windows, avisa al conectarse alguien y corta con un clic',
    'Relé opcional para las redes móviles que no dejan conexión directa',
  ],
  stack: ['Kotlin', 'Jetpack Compose', 'WebRTC', 'Electron', 'Node.js', 'Supabase Realtime', 'ECDSA P-256', 'Android Keystore', 'SendInput', 'H.264'],
  highlights: [
    { label: 'Pruebas', value: '32' },
    { label: 'Puertos abiertos', value: '0' },
    { label: 'Coste', value: '0 €' },
  ],
  technical: [
    {
      title: 'Por qué WebRTC y no Escritorio remoto',
      body: 'Se compararon RDP, VNC, Moonlight con Sunshine y los productos de terceros. RDP abre otra sesión y bloquea la pantalla física, justo lo contrario de «ver qué está pasando»; VNC no tiene códec de vídeo moderno; Moonlight obliga a abrir puertos o montar una VPN. **WebRTC** es lo que usa Chrome Remote Desktop: cifrado de extremo a extremo, atraviesa los routers sin tocarlos (ICE con STUN y, si hace falta, TURN), control de congestión y códecs por hardware. En el PC va el WebRTC de Chromium dentro de Electron, que captura cada monitor con DXGI y codifica en H.264 por hardware; en el Galaxy, la libwebrtc de Google, que lo decodifica también por hardware.',
    },
    {
      title: 'El servidor solo presenta; la seguridad va en las firmas',
      body: 'Supabase Realtime pone en contacto al móvil con el PC, pero **no decide quién entra**. El PC tiene su par de claves ECDSA P-256 (la privada cifrada con DPAPI de Windows) y el móvil genera el suyo dentro del Android Keystore, del que no sale nunca. Al emparejar, el QR lleva la clave pública del PC y un código de un solo uso con el que el móvil autentica la suya. Después cada paso va firmado: el saludo del móvil (con hora y nonce), la oferta del PC y la respuesta del móvil. Las dos últimas firman el SDP, que incluye la huella DTLS del cifrado: si alguien se metiera en medio, la firma dejaría de cuadrar.',
    },
    {
      title: 'El mismo protocolo, al carácter, en dos lenguajes',
      body: 'Lo que se firma son textos canónicos como `pocketpc1|oferta|…`, y tienen que salir idénticos en JavaScript y en Kotlin o ninguna firma valdría. Así que el PC genera **vectores de prueba con firmas reales de Node** y las pruebas de Android comprueban que Kotlin produce los mismos textos, el mismo HMAC y que acepta esas firmas y rechaza las alteradas (basta cambiar un carácter de la huella DTLS). Además, una prueba de extremo a extremo levanta la app del PC y un móvil simulado contra el servidor real: empareja, conecta, recibe vídeo, cambia de monitor y manda el ratón.',
    },
    {
      title: 'Zoom sin perder nitidez',
      body: 'Si el vídeo se pinta al tamaño de la pantalla del móvil, ampliar con los dedos solo agranda una imagen ya reducida. Por eso el visor pinta los fotogramas en un `TextureView` **del mismo tamaño que el vídeo** (1920×1080, por ejemplo) y lo encaja con escala y traslación: el zoom amplía píxeles reales del PC. Sobre esa geometría se montan los gestos: un dedo mueve el puntero con aceleración, dos dedos se reparten entre rueda y pellizco según qué cambie antes (la separación o el centro), y con zoom la vista sigue al puntero cuando se acerca al borde.',
    },
    {
      title: 'Ratón y teclado de Windows sin compilar nada',
      body: 'El PC mueve el ratón con `SendInput` de user32.dll llamado desde Node con **koffi**, una FFI que no necesita compilar. La parte fina son las coordenadas: el móvil manda posiciones de 0 a 1 dentro del monitor que ve, y el PC las convierte a píxeles físicos del escritorio virtual, que con dos monitores a distinta escala no coinciden con los de Electron. El texto va como Unicode (los emojis, como pares sustitutos) y todo lo que se pulsa queda apuntado para **soltarlo al cortar**: un Ctrl que se queda pegado deja el PC inservible hasta que alguien lo toque.',
    },
    {
      title: 'Los fallos que solo salen en el APK final',
      body: 'Dos veces la versión de pruebas funcionaba y el APK firmado no. R8, que encoge el código, quitó primero las clases del registro JNI de WebRTC (`org.jni_zero`: la app moría al conectar) y después unos campos que el escáner de QR de Google lee por reflexión (se cerraba al pulsar «Escanear»). Ninguna de las dos librerías trae sus reglas. Desde entonces el APK de release se prueba entero en un emulador, **botón a botón**, y una auditoría posterior cazó otro fallo que dependía del contenido de la pantalla: las miniaturas de los monitores en PNG podían pasar de los 256 KB que admite un mensaje del canal de datos; ahora van en JPEG.',
    },
  ],
  demoNote:
    'Es una recreación de la app de Android con un PC simulado de dos monitores. Toca el PC, elige pantalla y arrastra sobre la imagen para mover el puntero, como en el panel táctil de un portátil: un toque hace clic y dos seguidos abren (prueba con «Notas.txt» y luego con el teclado de la barra de arriba). El zoom se hace pellizcando o, en el ordenador, con la rueda del ratón.',
  repo: 'https://github.com/AngelSerranoD/pocketpc',
  downloads: [
    { label: 'Descargar APK', href: `${RELEASE}/PocketPC-1.0.2.apk` },
    { label: 'Descargar para Windows', href: `${RELEASE}/PocketPC-PC-Setup-1.0.1.exe` },
  ],
};
