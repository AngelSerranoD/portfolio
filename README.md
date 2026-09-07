# Portfolio · Ángel Serrano Domínguez

Portfolio web de proyectos de aplicaciones. Cada proyecto tiene su ficha con
descripción, características y **notas técnicas** sobre las decisiones de
arquitectura, además de una **demo interactiva** que se ejecuta dentro de un
marco de móvil.

El diseño es deliberadamente monocromo y sin iconografía: solo tipografía,
espacio y reglas horizontales.

🔗 **En producción:** _(pendiente de fijar la URL definitiva)_

> **Al desplegar con el dominio final**, sustituye la URL en dos sitios:
> `index.html` (etiquetas `og:url`, `og:image`, `twitter:image` y `canonical`)
> y `SITE_URL` en `src/data/profile.js`. Los rastreadores de LinkedIn y
> WhatsApp no resuelven rutas relativas, así que sin eso la tarjeta de
> previsualización sale vacía.

---

## Proyectos publicados

El catálogo vive en `src/data/projects/`: un archivo por proyecto. Esta lista
no se mantiene aquí a mano precisamente para que no se quede obsoleta.

Cada ficha lleva descripción, características, tecnologías y unas **notas
técnicas** que explican las decisiones de arquitectura del proyecto y por qué
se tomaron.

Sobre las demos: **Sangría es la aplicación auténtica** —el código de
`src/demos/sangria/` es el mismo que el de la app publicada—. Las demás son
réplicas en React construidas a partir del código real de cada app (mismos
textos, misma paleta, mismas pantallas), porque una app Android o Flutter no
puede ejecutarse dentro de un navegador.

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
│   ├── profile.js       ← datos personales y usuario de GitHub
│   ├── projects.js      ← agregador: no se toca
│   └── projects/        ← UN ARCHIVO POR PROYECTO
│       ├── nervio-vago.js
│       ├── sangria.js
│       ├── weighttracker.js
│       └── salud-diaria.js
├── components/          ← Nav, Footer, ProjectRow, TechnicalNote, PhoneFrame
├── pages/               ← Home, ProjectDetail, DemoPage, NotFound
└── demos/
    ├── index.js         ← registro automático: no se toca
    ├── nervio-vago.jsx  ← el nombre del archivo ES el slug
    ├── weighttracker.jsx
    ├── salud-diaria.jsx
    └── sangria/index.jsx  ← si la demo necesita archivos propios
```

Tanto los proyectos como las demos se descubren solos con `import.meta.glob`
de Vite. No hay ninguna lista que mantener sincronizada a mano.

### Añadir un proyecto nuevo

1. **Crear `src/data/projects/<slug>.js`** exportando por defecto el objeto del
   proyecto. El campo `order` decide su posición en la portada.
2. **Opcional: crear la demo** en `src/demos/<slug>.jsx` (o
   `src/demos/<slug>/index.jsx` si necesita varios archivos). Si no existe, la
   ficha simplemente no muestra el botón de demo.
3. `npm run build` y push. Vercel redespliega solo.

Campos del objeto de proyecto: `order`, `slug`, `name`, `tagline`, `year`,
`category`, `platform`, `description`, `features[]`, `stack[]`,
`highlights[{label,value}]`, `technical[{title,body}]`, `demoNote` y `repo`.
Solo `slug` y `name` son imprescindibles: las secciones cuyo campo falte
no se renderizan. En `technical`, los fragmentos entre acentos graves se
muestran como código en línea.

---

## Licencia

© 2026 Ángel Serrano Domínguez. Todos los derechos reservados.

Este código se publica únicamente para su consulta y valoración profesional.
No se permite su copia, modificación, distribución ni reutilización sin
autorización expresa y por escrito del autor. Véase [LICENSE](LICENSE).
