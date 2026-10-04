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
- `SITE_URL` lleva `www` porque es el dominio principal en Vercel; no cambiarlo sin
  cambiar también la redirección de `vercel.json`.
- Ficha completa: `C:\dev\Vault_IA\Fichas_Apps\Portfolio.md`.
