/**
 * Demo de DailyWeigh — esta es la aplicación real, no una recreación.
 * App.jsx, components/, hooks/ y lib/ son una copia de `src/` del repositorio
 * AngelSerranoD/dailyweigh. Lo único que cambia es el almacén: en memoria y con
 * semanas de ejemplo, para no escribir en el localStorage del visitante.
 *
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
import { useState } from 'react';
import { StatusBar } from '../../components/PhoneFrame';
import App from './App.jsx';
import { datosDeEjemplo } from './datosDeEjemplo.js';
import { crearAlmacenMemoria } from './lib/almacen.js';

export default function DailyWeighDemo() {
  const [almacen] = useState(() => crearAlmacenMemoria(datosDeEjemplo()));

  return (
    <div
      className="flex h-full w-full flex-col bg-cacao text-cacao antialiased"
      style={{
        fontFamily: 'ui-rounded, "SF Pro Rounded", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        // Con transform, los `fixed` de la app (hoja de peso, avisos) se
        // colocan respecto a la pantalla del marco y no respecto a la ventana.
        transform: 'translateZ(0)',
      }}
    >
      <StatusBar dark />
      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <App almacen={almacen} enMarco />
      </div>
    </div>
  );
}
