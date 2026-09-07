/**
 * SaludDiaria
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
export default {
  "order": 40,
  "slug": "salud-diaria",
  "name": "SaludDiaria",
  "tagline": "Rutina terapéutica diaria para escoliosis y desrealización",
  "year": "2026",
  "category": "Salud y bienestar",
  "platform": "Android nativo",
  "description": "Rutina de ejercicios terapéuticos dividida en dos programas independientes: uno de siete ejercicios de fisioterapia para escoliosis y otro de seis técnicas de regulación del sistema nervioso frente a la desrealización. Cada ejercicio incluye una explicación de su propósito clínico y el progreso se reinicia solo cada día.",
  "features": [
    "Dos programas: Escoliosis (7 ejercicios) y Desrealización (6 técnicas)",
    "Descripción del propósito terapéutico de cada ejercicio",
    "Barra de progreso por sección que se actualiza al marcar",
    "Reinicio automático del progreso al cambiar de día",
    "Arquitectura MVVM con flujos reactivos",
    "Diseño oscuro de alto contraste y tipografía de gran escala"
  ],
  "stack": [
    "Kotlin",
    "Jetpack Compose",
    "MVVM",
    "DataStore Preferences",
    "Coroutines Flow",
    "Navigation Compose"
  ],
  "highlights": [
    {
      "label": "Ejercicios",
      "value": "13"
    },
    {
      "label": "Programas",
      "value": "2"
    },
    {
      "label": "Arquitectura",
      "value": "MVVM"
    }
  ],
  "technical": [
    {
      "title": "MVVM con flujos, no con callbacks",
      "body": "El `SeccionViewModel` no expone métodos que devuelvan listas, sino un `StateFlow` derivado. El repositorio publica un `Flow<Map<String, Boolean>>` con el estado de completado de todos los ejercicios, y el ViewModel lo transforma con `map` para producir la lista de la sección activa, aplicando `copy(completado = …)` sobre los datos base. La interfaz no consulta: observa. Marcar un ejercicio escribe en DataStore, DataStore emite, el flujo se recalcula y Compose recompone solo lo afectado."
    },
    {
      "title": "Suscripciones con caducidad",
      "body": "Los flujos se convierten en estado con `stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), …)`. Esos cinco segundos son el detalle relevante: mantienen viva la suscripción durante los cambios de configuración —una rotación de pantalla destruye y recrea la actividad en milisegundos— pero la cancelan si el usuario abandona la pantalla de verdad. Evita a la vez el parpadeo al rotar y la fuga de colectores en segundo plano."
    },
    {
      "title": "DataStore sobre SharedPreferences",
      "body": "La persistencia usa DataStore Preferences en lugar de SharedPreferences: la API es asíncrona por diseño (funciones `suspend` y `Flow`), lo que elimina la escritura en el hilo principal que `apply()` disimula pero no evita. Las claves se generan por función (`booleanPreferencesKey(\"completado_$id\")`), de modo que añadir un ejercicio nuevo al catálogo no requiere tocar la capa de datos."
    },
    {
      "title": "El reinicio diario",
      "body": "Una rutina diaria debe empezar vacía cada mañana, pero Android no garantiza ejecutar nada a medianoche. La solución evita depender de WorkManager o de alarmas: junto al progreso se guarda la fecha de la última sesión y, al iniciarse el ViewModel, `resetSiNuevoDia()` compara esa fecha con `LocalDate.now()` dentro de una única transacción `edit`. Si no coinciden, borra las marcas y actualiza la fecha. Es idempotente, atómico y funciona igual si la app ha estado cerrada tres semanas."
    },
    {
      "title": "Catálogo como código",
      "body": "Los trece ejercicios y sus descripciones clínicas viven en un `object EjerciciosData` como listas inmutables de `data class Ejercicio`. No hay base de datos de contenido porque el contenido no cambia en tiempo de ejecución: es una rutina cerrada, prescrita. Modelarlo como constantes en lugar de como filas evita una capa entera de persistencia, migraciones incluidas, y convierte cualquier error de contenido en un error de compilación en vez de en un dato malformado."
    }
  ],
  "demoNote": "Réplica web de la interfaz Compose original con el contenido real de los ejercicios.",
  "repo": "https://github.com/AngelSerranoD/SaludDiaria"
};
