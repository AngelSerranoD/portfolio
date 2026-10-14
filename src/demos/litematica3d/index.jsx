/**
 * Demo de Litematica3D — esta es la aplicación real, no una recreación.
 * App.tsx, App.css, index.css, api/, assets/, componentes/, estado/, estilos/,
 * logica/ y vistas/ son una copia de `src/` del repositorio de la app, y
 * datos/ lo volcó su núcleo de Rust; las dos cosas las hace
 * scripts/sincronizar-demo-litematica3d.sh. Solo cambia lo que no puede salir
 * de la ventana: el núcleo de Rust es uno falso en memoria y Tauri tiene
 * sustitutos (demo/), y el CSS de la app queda encerrado en este div
 * (demo/aislamiento.js).
 *
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
import { useLayoutEffect, useState } from 'react';
import App from './App';
import './index.css';
import funciones from './estilos/funcionesMotion';
import { aplicarTemaRecordado, useAjustes } from './estado/ajustes';
import { useBiblioteca } from './estado/biblioteca';
import { useEdicion } from './estado/edicion';
import { useFoco } from './estado/foco';
import { useMateriales } from './estado/materiales';
import { useNavegacion } from './estado/navegacion';
import { useTexturas } from './estado/texturas';
import { useVisor } from './estado/visor';
import { avisarDemo } from './demo/aviso.js';
import { reiniciarNucleo } from './demo/nucleo.js';
import { fijarRaizDemo } from './demo/raiz.js';

/** Los almacenes de la app viven en módulos: al volver a montar, desde cero. */
const ALMACENES = [
  useAjustes,
  useBiblioteca,
  useEdicion,
  useFoco,
  useMateriales,
  useNavegacion,
  useTexturas,
  useVisor,
];

const llevaArchivos = (e) => Array.from(e.dataTransfer?.types ?? []).includes('Files');

export default function Litematica3DDemo() {
  const [raiz, setRaiz] = useState(null);
  const [lista, setLista] = useState(false);

  // La app lee sus tokens de la raíz al pintar: se monta cuando ya existe.
  useLayoutEffect(() => {
    if (!raiz) return undefined;
    fijarRaizDemo(raiz);
    reiniciarNucleo();
    ALMACENES.forEach((almacen) => almacen.setState(almacen.getInitialState(), true));
    aplicarTemaRecordado();
    setLista(true);
    return () => {
      setLista(false);
      fijarRaizDemo(null);
    };
  }, [raiz]);

  return (
    <div
      ref={setRaiz}
      className="l3d-raiz"
      style={{ width: '100%', height: '100%' }}
      // Soltar un archivo en la página haría que el navegador lo abriera.
      onDragOver={(e) => llevaArchivos(e) && e.preventDefault()}
      onDrop={(e) => {
        if (!llevaArchivos(e)) return;
        e.preventDefault();
        avisarDemo('En la demo no se importan archivos: prueba con los tres de ejemplo.');
      }}
    >
      {lista && <App funciones={funciones} />}
    </div>
  );
}
