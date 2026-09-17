/**
 * Demo de Jib M3ak — esta es la aplicación real, no una recreación.
 * App.jsx, componentes/, i18n/ y lib/ son una copia de `src/` del repositorio
 * AngelSerranoD/jib-m3ak, hecha con scripts/sincronizar-demo-jib-m3ak.sh. Solo
 * cambia lo que no puede salir del marco del móvil: el servidor (en memoria,
 * con «familia» simulada), la cámara (un lienzo, para no pedir permisos) y el
 * idioma (que aquí no toca el <html> del portfolio).
 *
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
import { useEffect, useState } from 'react';
import { StatusBar } from '../../components/PhoneFrame';
import App from './App.jsx';
import { ProveedorIdioma } from './i18n/idioma.jsx';
import { reiniciarDemo } from './demo/servidor.js';

export default function JibM3akDemo() {
  const [arranque, setArranque] = useState(0);

  useEffect(() => {
    reiniciarDemo();
    setArranque((n) => n + 1);
  }, []);

  return (
    <div
      className="flex h-full w-full flex-col bg-jmcrema text-cafe antialiased"
      style={{
        fontFamily: 'ui-rounded, "SF Pro Rounded", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        // Con transform, los `fixed` de la app (pestañas, botón de cámara,
        // avisos) se colocan respecto al marco y no respecto a la ventana.
        transform: 'translateZ(0)',
      }}
    >
      <StatusBar />
      <div className="no-scrollbar relative min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {arranque > 0 && (
          <ProveedorIdioma key={arranque}>
            <App />
          </ProveedorIdioma>
        )}
      </div>
    </div>
  );
}
