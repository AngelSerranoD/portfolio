/**
 * Hannah's Wallet
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
export default {
  order: 50,
  slug: 'hannahs-wallet',
  name: "Hannah's Wallet",
  tagline: 'Control de gastos cifrado en el dispositivo, con mascota reactiva',
  year: '2026',
  category: 'Finanzas personales',
  platform: 'Android · iOS · Web · Flutter',
  description:
    'Aplicación de control de gastos, ingresos y presupuestos construida sobre arquitectura limpia. No tiene servidor, cuenta ni telemetría: los movimientos se guardan cifrados con SQLCipher en el propio dispositivo y solo salen de él si el usuario exporta una copia. Incluye bloqueo biométrico, presupuestos por categoría, movimientos recurrentes, estadísticas y un gato animado que reacciona a cómo va el mes.',
  features: [
    'Gastos, ingresos, monederos y presupuestos por categoría',
    'Reparto del total del mes: cada límite por categoría descuenta de lo libre',
    'Base de datos cifrada con SQLCipher y clave en el Keystore del sistema',
    'Bloqueo por huella, cara o PIN antes de mostrar ningún dato',
    'Movimientos recurrentes con reglas de repetición propias',
    'Estadísticas y gráficas de evolución mensual',
    'Mascota animada que refleja el estado del presupuesto',
    'Importación y exportación de copias en JSON',
    'Corre en móvil, escritorio y navegador desde el mismo código',
  ],
  stack: [
    'Flutter',
    'Riverpod',
    'SQLCipher',
    'flutter_secure_storage',
    'local_auth',
    'Lottie',
    'fl_chart',
    'IndexedDB',
  ],
  highlights: [
    { label: 'Archivos Dart', value: '76' },
    { label: 'Líneas', value: '16k' },
    { label: 'Suites de test', value: '13' },
  ],
  technical: [
    {
      title: 'Dos backends, un solo código',
      body: 'La app corre en móvil y en navegador, pero el cifrado no se resuelve igual en los dos sitios. La selección se hace con imports condicionales de Dart: `import "stub.dart" if (dart.library.io) "io.dart" if (dart.library.js_interop) "web.dart"`. La clave es que el compilador **ni siquiera ve** el archivo de la otra plataforma. Sin eso, la build web arrastraría `sqflite_sqlcipher`, que no tiene implementación para navegador, y no compilaría; y la de iOS cargaría código de IndexedDB que allí no pinta nada. El resto de la aplicación programa contra la interfaz `AppBackend` y no sabe cuál le ha tocado.',
    },
    {
      title: 'Por qué se deriva la clave teniendo ya 32 bytes aleatorios',
      body: 'En el primer arranque se genera un secreto maestro de 32 bytes con `Random.secure` y un salt de 16, y ambos se guardan en el almacén seguro del sistema. La passphrase real de SQLCipher no es ese secreto: se **deriva** de él con PBKDF2-HMAC-SHA256 y 120.000 iteraciones. Parece redundante, y lo sería si el Keystore fuese infalible. No lo es: en dispositivos sin StrongBox el material puede acabar en almacenamiento por software. El KDF añade un coste fijo por intento, así que quien extraiga el blob todavía tiene que pagar 120.000 iteraciones por cada prueba. El modelo de amenaza es explícito: alguien con acceso al sistema de ficheros —copia por ADB, móvil rooteado, tarjeta extraída— no debe poder leer los movimientos.',
    },
    {
      title: 'La mascota calentaba el móvil',
      body: 'La app subía de temperatura con solo estar abierta. La causa no era el cifrado ni las consultas: era el gato. Su animación de reposo se repetía indefinidamente, sesenta repintados por segundo para siempre, y el `IndexedStack` de las pestañas la mantenía viva aunque estuvieras en Ajustes. Las correcciones: el gato se detiene tras 12 segundos sin interacción, `TickerMode` apaga las animaciones de las pestañas no visibles, las pestañas se construyen al visitarlas en lugar de las cuatro al arrancar, un limitador reduce el detector de actividad de cientos de eventos por segundo a uno, y los formateadores de `intl` —que se reconstruían por cada importe y cada fecha, en cada fotograma— pasan a reutilizarse.',
    },
    {
      title: 'Una prueba para un fallo invisible',
      body: 'Que la mascota vuelva a animarse sin parar no rompería nada visible: la app se vería exactamente igual y el problema solo aparecería en la batería del usuario, semanas después. Por eso hay un `performance_test.dart` que mide `transientCallbackCount`, el número de animaciones vivas del framework. Cero significa que nada está pidiendo fotogramas. Es el tipo de regresión que ninguna revisión de código detecta a ojo, y por eso conviene tenerla cubierta por un test.',
    },
    {
      title: 'Arquitectura limpia de verdad',
      body: 'El código se separa en `domain` (entidades, repositorios como interfaces y casos de uso), `data` (DAOs, implementaciones y backends) y `presentation` (pantallas, providers y widgets). El dominio no importa nada de Flutter ni de la base de datos, lo que permite probarlo sin emulador. Riverpod se usa como inyector de dependencias además de como gestor de estado, de modo que sustituir el backend real por uno falso en los tests es cambiar un provider. En un proyecto de 16.000 líneas esa separación deja de ser ceremonia y pasa a ser lo que hace que se pueda tocar sin miedo.',
    },
    {
      title: 'Trece suites, incluidas las incómodas',
      body: 'Además de las pruebas de lógica —dinero, rangos de fechas, recurrencias— hay suites para las cosas que normalmente no se prueban: `security_test` sobre el cifrado, `face_id_flow_test` sobre el flujo de desbloqueo, `web_vault_test` sobre el backend de navegador, `chinese_input_test` y `fonts_test` sobre la entrada y el renderizado CJK, `backup_format_test` sobre el formato de exportación y pruebas *golden* de pantallas completas. El dinero y las fechas son precisamente donde un error silencioso hace más daño.',
    },
  ],
  demoNote:
    'Réplica web de la app Flutter con su paleta y su estructura reales. El cifrado, la biometría y la base de datos solo existen en el dispositivo.',
  repo: 'https://github.com/AngelSerranoD/hannahswalletapp',
};
