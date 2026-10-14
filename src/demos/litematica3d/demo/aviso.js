/**
 * Demo de Litematica3D — avisos de lo que la web no puede hacer.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 *
 * Usa la franja de avisos de la propia app (la de «3 importados…»).
 */
import { useBiblioteca } from '../estado/biblioteca';

export const NO_SE_GUARDA = 'En la demo no se guardan archivos.';

export function avisarDemo(mensaje = NO_SE_GUARDA) {
  useBiblioteca.getState().avisar(mensaje);
}
