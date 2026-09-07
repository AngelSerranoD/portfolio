# Portfolio · Ángel Serrano Domínguez

Portfolio web de proyectos de aplicaciones. Cada proyecto tiene su ficha con
descripción, características y **notas técnicas** sobre las decisiones de
arquitectura, además de una **demo interactiva** que se ejecuta dentro de un
marco de móvil.

El diseño es deliberadamente monocromo y sin iconografía: solo tipografía,
espacio y reglas horizontales.

🔗 **En producción:** _(pendiente de desplegar en Vercel)_

---

## Proyectos publicados

| Proyecto | Plataforma | Demo |
|---|---|---|
| **Nervio Vago** | Android · Flutter | Réplica web de la app |
| **Sangría** | Web · PWA | Aplicación real |
| **WeightTracker** | Android nativo | Réplica web de la app |
| **SaludDiaria** | Android nativo | Réplica web de la app |

Las apps Android nativas no pueden ejecutarse en un navegador, así que su demo
es una réplica en React de la interfaz original, construida a partir del código
Kotlin real (mismos textos, misma paleta, mismas pantallas). Sangría es la
aplicación auténtica: el código de `src/demos/sangria/` es el mismo que el de
la app publicada.

---

## Stack

- **React 19** + **Vite 8**
- **Tailwind CSS 3** con paleta propia
- **React Router 7** para las rutas de ficha y demo
- **lucide-react** para la iconografía

## Desarrollo

```bash
npm install
npm run dev
```

```bash
npm run build
```

## Despliegue en Vercel

El repositorio ya está preparado. En Vercel:

- **Framework preset:** Vite
- **Build command:** `npm run build`
- **Output directory:** `dist`

El archivo `vercel.json` reescribe todas las rutas a `index.html`, necesario
para que `/proyecto/:slug` y `/demo/:slug` funcionen al recargar la página.

---

## Estructura

```
src/
├── data/
│   ├── projects.js      ← catálogo de proyectos (aquí se añaden los nuevos)
│   └── profile.js       ← datos personales y usuario de GitHub
├── components/          ← Nav, Footer, ProjectCard, PhoneFrame
├── pages/               ← Home, ProjectDetail, DemoPage
└── demos/
    ├── index.js         ← registro de demos (slug → componente)
    ├── NervioVagoDemo.jsx
    ├── WeightTrackerDemo.jsx
    ├── SaludDiariaDemo.jsx
    └── sangria/         ← copia de la app real
```

### Añadir un proyecto nuevo

1. Añadir su entrada a `src/data/projects.js`, incluido el array `technical`
   con las notas de arquitectura.
2. Crear la demo en `src/demos/` y registrarla en `src/demos/index.js` con el
   mismo `slug`.
3. `npm run build` para comprobar que compila.
4. Commit y push: Vercel redespliega automáticamente.

---

## Licencia

© 2026 Ángel Serrano Domínguez. Todos los derechos reservados.

Este código se publica únicamente para su consulta y valoración profesional.
No se permite su copia, modificación, distribución ni reutilización sin
autorización expresa y por escrito del autor. Véase [LICENSE](LICENSE).
