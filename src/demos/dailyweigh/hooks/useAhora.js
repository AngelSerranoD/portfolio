/**
 * DailyWeigh — la hora actual, al día.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 *
 * Una PWA en iPhone puede pasar días abierta en segundo plano. Al volver a
 * primer plano hay que recalcular el saludo y, si ha cambiado, el día.
 */
import { useEffect, useState } from 'react';

export function useAhora(intervalo = 30_000) {
  const [ahora, setAhora] = useState(() => new Date());

  useEffect(() => {
    const actualizar = () => setAhora(new Date());
    const alVolver = () => {
      if (document.visibilityState === 'visible') actualizar();
    };
    const id = setInterval(actualizar, intervalo);
    document.addEventListener('visibilitychange', alVolver);
    window.addEventListener('pageshow', actualizar);
    window.addEventListener('focus', actualizar);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', alVolver);
      window.removeEventListener('pageshow', actualizar);
      window.removeEventListener('focus', actualizar);
    };
  }, [intervalo]);

  return ahora;
}
