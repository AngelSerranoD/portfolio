/**
 * Sangría
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
export default {
  "order": 20,
  "slug": "sangria",
  "name": "Sangría",
  "tagline": "Calendario menstrual con recordatorio de píldora y estadísticas",
  "year": "2026",
  "category": "Salud y bienestar",
  "platform": "Web · PWA instalable",
  "description": "Calendario de seguimiento menstrual diseñado con lenguaje visual iOS. Permite registrar el ciclo día a día, controlar la toma de la píldora anticonceptiva y consultar un panel de estadísticas que cruza el historial para anticipar cómo será el día siguiente. Es una PWA instalable que guarda todo en el propio dispositivo.",
  "features": [
    "Calendario mensual con celdas de estado por día",
    "Registro de menstruación con flujo, textura, dolores y estado físico",
    "Control de píldora configurable: días activos y días de descanso",
    "Panel de estadísticas con predicción basada en el historial",
    "Registro de relaciones con detalle por día",
    "Tema claro y oscuro con cambio instantáneo",
    "Instalable como PWA y funcional sin conexión"
  ],
  "stack": [
    "React 19",
    "Vite",
    "Tailwind CSS",
    "Framer Motion",
    "date-fns",
    "vite-plugin-pwa",
    "Workbox"
  ],
  "highlights": [
    {
      "label": "Componentes",
      "value": "12"
    },
    {
      "label": "Líneas",
      "value": "1.8k"
    },
    {
      "label": "Offline",
      "value": "100%"
    }
  ],
  "technical": [
    {
      "title": "localStorage como base de datos",
      "body": "No hay servidor ni IndexedDB: todo el historial es un único objeto JSON en `localStorage[\"sangria_records\"]`, indexado por fecha en formato `YYYY-MM-DD`. La decisión es deliberada y responde al dominio: son datos íntimos de salud, y la garantía más fuerte de privacidad que puede dar una aplicación es no tener adónde enviarlos. Cada acceso está envuelto en `try/catch` porque en navegación privada el almacenamiento puede lanzar excepción en lugar de devolver vacío."
    },
    {
      "title": "Modelo de día extensible",
      "body": "Un `DayRecord` es un objeto plano con cuatro dimensiones independientes: toma de píldora, menstruación, relación y notas. Los detalles se anidan como subobjetos opcionales (`menstruationDetail`, `relationshipDetail`) en lugar de aplanarse en el registro. Así, añadir un campo nuevo —una textura, un tipo de dolor— no invalida los registros ya guardados: los antiguos simplemente no tienen esa clave y el código la lee como `null`."
    },
    {
      "title": "Cálculo de la píldora",
      "body": "El blíster no se modela como una lista de días marcados, sino como una función pura del calendario: dada una fecha de inicio y la configuración de días activos y de descanso (21/7 por defecto, pero parametrizable), `getDayType` deriva por aritmética modular si un día concreto es de toma o de descanso, y `getPillNumber` qué pastilla del blíster corresponde. Nada que sincronizar y nada que se desalinee si la usuaria no abre la app durante una semana."
    },
    {
      "title": "Motor de predicción",
      "body": "El panel de estadísticas no se limita a promediar duraciones. Localiza en el historial los ciclos anteriores, calcula en qué día del ciclo se encuentra hoy, y busca registros históricos que estuvieran en ese mismo día del ciclo para extraer el estado físico dominante y los dolores más frecuentes. Es predicción por analogía sobre el historial propio de la usuaria, no un modelo estadístico genérico."
    },
    {
      "title": "Tema sin variantes de Tailwind",
      "body": "Aunque el proyecto usa Tailwind con `darkMode: \"class\"`, los componentes no emplean el prefijo `dark:`. El tema se propaga como prop `dark` y se resuelve con estilos en línea. Es una elección poco ortodoxa que responde a un requisito concreto: muchos colores del calendario son dinámicos (dependen del estado del día, no solo del tema), y mezclar variantes de clase con colores calculados producía reglas duplicadas y difíciles de seguir. Ese mismo desacoplamiento es lo que permite que la app se ejecute embebida en este portfolio sin teñir la página que la contiene."
    },
    {
      "title": "Instalación y offline",
      "body": "La PWA se genera con `vite-plugin-pwa` en modo `generateSW`, que produce un service worker de Workbox con precaché de todos los recursos de la build. Como el estado vive en el dispositivo y no hay peticiones de red que interceptar, el modo offline no es una degradación: es el modo normal de funcionamiento."
    }
  ],
  "demoNote": "Esta es la aplicación real, no una recreación. Los datos se guardan en tu navegador.",
  "repo": "https://github.com/AngelSerranoD/sangria"
};
