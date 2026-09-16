/**
 * DailyWeigh — exportar e importar la copia de seguridad.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 *
 * En iPhone se exporta con la hoja de compartir (Guardar en Archivos, AirDrop…);
 * donde no la hay, se descarga el archivo.
 */
import { useRef } from 'react';
import { crearCopia, leerCopia } from '../lib/copia.js';

export default function CopiaSeguridad({ pesos, hoy, onImportar, onAviso }) {
  const selector = useRef(null);
  const total = Object.keys(pesos).length;

  const exportar = async () => {
    const nombre = `dailyweigh-${hoy}.json`;
    const archivo = new File([JSON.stringify(crearCopia(pesos), null, 2)], nombre, { type: 'application/json' });
    try {
      if (navigator.canShare?.({ files: [archivo] })) {
        await navigator.share({ files: [archivo], title: 'Copia de DailyWeigh' });
        return;
      }
    } catch (error) {
      if (error?.name === 'AbortError') return; // cerró la hoja de compartir
    }
    const url = URL.createObjectURL(archivo);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = nombre;
    enlace.click();
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
    onAviso('Copia descargada');
  };

  const importar = async (evento) => {
    const archivo = evento.target.files?.[0];
    evento.target.value = ''; // permite volver a elegir el mismo archivo
    if (!archivo) return;
    try {
      onImportar(leerCopia(await archivo.text()));
    } catch (error) {
      onAviso(error.message);
    }
  };

  const boton =
    'rounded-2xl bg-nata py-3.5 font-semibold text-oxido transition active:scale-[0.98] active:bg-miel/25 disabled:opacity-45';

  return (
    <section aria-labelledby="titulo-copia" className="mt-9">
      <h2 id="titulo-copia" className="px-1 text-xl font-bold">Copia de seguridad</h2>
      <p className="mt-1.5 px-1 text-[0.95rem] leading-relaxed text-oxido">
        Tus pesos solo se guardan en este dispositivo. Si borras la app se pierden, así que exporta una copia de vez
        en cuando.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button type="button" className={boton} disabled={total === 0} onClick={exportar}>
          Exportar
        </button>
        <button type="button" className={boton} onClick={() => selector.current?.click()}>
          Importar
        </button>
      </div>
      <input
        ref={selector}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={importar}
        tabIndex={-1}
        aria-hidden="true"
      />
    </section>
  );
}
