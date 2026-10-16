# Portfolio (aserrano.dev)

React 19 + Vite 8 + Tailwind 3 + react-router-dom, en Vercel: cada push a `main`
despliega en `www.aserrano.dev`.

- Comandos: `npm run dev`, `npm run build`.
- Subir una app nueva: usar la skill `/portfolio`.
- Fichas en `src/data/projects/<slug>.js` y demos en `src/demos/<slug>.jsx`; se
  descubren solas con `import.meta.glob` (no hay listas que editar).
- `TechnicalNote` solo entiende `código` y `**negrita**`: nada más de Markdown.
- Demos sincronizadas desde la app real: `bash scripts/sincronizar-demo-<slug>.sh`
  (che-boluda, jib-m3ak) tras cada cambio de la app.
- CV: `python scripts/generar-cv.py` genera el PDF en español y en inglés en `public/`.
- Contacto: el chat de la portada (`src/components/ChatContacto.jsx`) llama a la función
  `api/contacto.js`, que manda el correo con Resend. Necesita `RESEND_API_KEY` en Vercel
  (Production y Preview); `npm run dev` no sirve `/api`, así que en local el envío falla.
- `SITE_URL` lleva `www` porque es el dominio principal en Vercel; no cambiarlo sin
  cambiar también la redirección de `vercel.json`.
- Ficha completa: `C:\dev\Vault_IA\Fichas_Apps\Portfolio.md`.
