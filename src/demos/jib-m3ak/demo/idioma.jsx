/**
 * Demo de Jib M3ak — el idioma, sin tocar la página del portfolio.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 *
 * Misma interfaz que `src/i18n/idioma.jsx` de la app (la demo sustituye ese
 * archivo por este). La única diferencia: la app de verdad pone `lang` y `dir`
 * en el `<html>`, y aquí eso voltearía el portfolio entero, así que van en el
 * envoltorio de la demo. La demo siempre arranca en español.
 */
import { createContext, useContext, useMemo, useState } from 'react';
import { DIRECCION, textos } from './textos.js';

const Contexto = createContext(null);

export function ProveedorIdioma({ children }) {
  const [idioma, setIdioma] = useState('es');

  const valor = useMemo(() => ({
    idioma,
    rtl: idioma === 'dar',
    t: textos(idioma),
    cambiar: () => setIdioma((actual) => (actual === 'es' ? 'dar' : 'es')),
  }), [idioma]);

  return (
    <Contexto.Provider value={valor}>
      <div
        dir={DIRECCION[idioma]}
        lang={idioma === 'dar' ? 'ar' : 'es'}
        data-jm-idioma={idioma}
        className="flex min-h-full flex-col"
      >
        {children}
      </div>
    </Contexto.Provider>
  );
}

export const usarIdioma = () => useContext(Contexto);
