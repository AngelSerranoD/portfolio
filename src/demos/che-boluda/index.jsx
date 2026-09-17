/**
 * Demo de Ché boluda — esta es la aplicación real, no una recreación.
 * App.jsx, contexto.js, componentes/, hooks/, lib/ y pantallas/ son una copia
 * de `src/` del repositorio AngelSerranoD/che-boluda, hecha con
 * scripts/sincronizar-demo-che-boluda.sh. Solo cambia lo que no puede salir
 * del marco del móvil: rutas en memoria, alturas del marco y un servicio sin
 * Supabase con amigas simuladas (demo/).
 *
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
import { useEffect, useState } from 'react';
import { StatusBar } from '../../components/PhoneFrame';
import App from './App.jsx';
import { escucharGestos } from './lib/audio/motor.js';
import { reiniciarRuta } from './lib/ruta.js';
import { crearServicioDemo } from './demo/servicioDemo.js';

export default function CheBoludaDemo() {
  const [servicio, setServicio] = useState(null);

  useEffect(() => {
    reiniciarRuta();
    const nuevo = crearServicioDemo();
    setServicio(nuevo);
    const quitarGestos = escucharGestos();
    return () => {
      quitarGestos();
      nuevo.destruir();
    };
  }, []);

  return (
    <div
      className="flex h-full w-full flex-col bg-hueso text-tinta antialiased"
      style={{
        fontFamily: 'ui-rounded, "SF Pro Rounded", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        // Con transform, los `fixed` de la app (hojas, pestañas, avisos) se
        // colocan respecto a la pantalla del marco y no respecto a la ventana.
        transform: 'translateZ(0)',
      }}
    >
      <StatusBar />
      <div className="no-scrollbar relative min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {servicio && <App key={servicio.id} servicio={servicio} />}
      </div>
    </div>
  );
}
