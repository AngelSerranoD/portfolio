/**
 * Versión aislada del hook de tema de Sangría para la demo del portfolio.
 *
 * La app original alterna la clase `dark` sobre <body> y <html>. Dentro del
 * portfolio eso teñiría también la página que la contiene, así que aquí el
 * estado vive en React y la clase la aplica el propio contenedor de la demo.
 *
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
import { useEffect, useState } from 'react';

const KEY = 'sangria_demo_dark_mode';

export function useTheme() {
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem(KEY) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(KEY, dark ? 'true' : 'false');
    } catch {
      /* almacenamiento no disponible: el tema simplemente no se recuerda */
    }
  }, [dark]);

  const toggle = () => setDark((d) => !d);

  return { dark, toggle };
}
