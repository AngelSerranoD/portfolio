/**
 * DailyWeigh — pantalla principal.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Aviso from './components/Aviso.jsx';
import Cabecera from './components/Cabecera.jsx';
import CopiaSeguridad from './components/CopiaSeguridad.jsx';
import HistorialSemanas from './components/HistorialSemanas.jsx';
import HojaPeso from './components/HojaPeso.jsx';
import PanelDia from './components/PanelDia.jsx';
import TiraDias from './components/TiraDias.jsx';
import { useAhora } from './hooks/useAhora.js';
import { crearAlmacenLocal } from './lib/almacen.js';
import { fusionar } from './lib/copia.js';
import { cx } from './lib/cx.js';
import { claveDia, diasDeSemana, inicioSemana, saludo, sumarDias } from './lib/fechas.js';
import { mediaDe, resumenSemanas } from './lib/pesos.js';

export const NOMBRE = 'Han';

const almacenLocal = crearAlmacenLocal();

/** Sube al principio del contenedor que hace scroll: la ventana en la PWA, el marco en la demo. */
function subirAlPrincipio(elemento) {
  for (let nodo = elemento?.parentElement; nodo; nodo = nodo.parentElement) {
    if (/(auto|scroll)/.test(getComputedStyle(nodo).overflowY) && nodo.scrollHeight > nodo.clientHeight) {
      nodo.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * `enMarco`: la app vive dentro de un contenedor (la demo del portfolio) y no
 * ocupa la ventana entera. Ajusta la altura y deja de seguir al teclado.
 */
export default function App({ almacen = almacenLocal, nombre = NOMBRE, enMarco = false }) {
  const ahora = useAhora();
  const hoy = claveDia(ahora);
  const lunesHoy = inicioSemana(hoy);

  const [datos, setDatos] = useState(() => almacen.leer());
  const [lunes, setLunes] = useState(lunesHoy);
  const [seleccion, setSeleccion] = useState(hoy);
  const [hoja, setHoja] = useState(null); // día que se está editando, o null
  const [aviso, setAviso] = useState(null);
  const hoyVisto = useRef(hoy);
  const raiz = useRef(null);

  useEffect(() => {
    if (!almacen.guardar(datos)) setAviso('No se ha podido guardar en este dispositivo');
  }, [datos, almacen]);

  useEffect(() => {
    almacen.persistir?.();
  }, [almacen]);

  // La app puede seguir abierta al cambiar de día: si se miraba «hoy», se pasa al nuevo hoy.
  useEffect(() => {
    const anterior = hoyVisto.current;
    if (anterior === hoy) return;
    hoyVisto.current = hoy;
    setSeleccion((s) => (s === anterior ? hoy : s));
    setLunes((l) => (l === inicioSemana(anterior) ? inicioSemana(hoy) : l));
  }, [hoy]);

  // Primera vez que se abre la app en el día: se ofrece apuntar el peso, una sola vez.
  useEffect(() => {
    if (datos.pesos[hoy] != null || datos.ultimoAviso === hoy) return;
    setLunes(inicioSemana(hoy));
    setSeleccion(hoy);
    setHoja(hoy);
    setDatos((d) => ({ ...d, ultimoAviso: hoy }));
  }, [hoy]); // eslint-disable-line react-hooks/exhaustive-deps

  const dias = useMemo(() => diasDeSemana(lunes), [lunes]);
  const semanas = useMemo(() => resumenSemanas(datos.pesos), [datos.pesos]);
  const anteriores = useMemo(() => semanas.filter((s) => s.lunes < lunesHoy), [semanas, lunesHoy]);
  const semana = mediaDe(dias, datos.pesos);
  const semanaPrevia = mediaDe(diasDeSemana(sumarDias(lunes, -7)), datos.pesos);

  const irASemana = (nuevoLunes) => {
    if (nuevoLunes > lunesHoy) return;
    setLunes(nuevoLunes);
    if (nuevoLunes === lunesHoy) {
      setSeleccion(hoy);
    } else {
      const conPeso = diasDeSemana(nuevoLunes).filter((c) => datos.pesos[c] != null);
      setSeleccion(conPeso.at(-1) ?? sumarDias(nuevoLunes, 6));
    }
  };

  const abrirSemanaDelHistorial = (nuevoLunes) => {
    irASemana(nuevoLunes);
    subirAlPrincipio(raiz.current);
  };

  const tocarDia = (clave) => {
    if (clave > hoy) return;
    if (clave === seleccion) setHoja(clave);
    else setSeleccion(clave);
  };

  const guardarPeso = (clave, kilos) => {
    setDatos((d) => ({ ...d, pesos: { ...d.pesos, [clave]: kilos } }));
    setSeleccion(clave);
    setLunes(inicioSemana(clave));
    setHoja(null);
  };

  const borrarPeso = (clave) => {
    setDatos((d) => {
      const pesos = { ...d.pesos };
      delete pesos[clave];
      return { ...d, pesos };
    });
    setHoja(null);
    setAviso('Registro borrado');
  };

  const importar = (importados) => {
    const { pesos, nuevos, distintos } = fusionar(datos.pesos, importados);
    if (nuevos + distintos === 0) {
      setAviso('La copia no trae nada nuevo');
      return;
    }
    if (
      distintos > 0 &&
      !window.confirm(
        `La copia cambia el peso de ${distintos} ${distintos === 1 ? 'día' : 'días'} que ya tenías apuntados. ¿Importarla igualmente?`
      )
    ) {
      return;
    }
    setDatos((d) => ({ ...d, pesos }));
    const total = nuevos + distintos;
    setAviso(`${total} ${total === 1 ? 'registro importado' : 'registros importados'}`);
  };

  const cerrarHoja = useCallback(() => setHoja(null), []);
  const cerrarAviso = useCallback(() => setAviso(null), []);

  return (
    <div ref={raiz} className={cx('flex flex-col bg-cacao', enMarco ? 'min-h-full' : 'min-h-[100dvh]')}>
      {/* Fondo fijo bajo la barra de estado: con black-translucent el texto es blanco. */}
      <div aria-hidden="true" className="fixed inset-x-0 top-0 z-40 h-[env(safe-area-inset-top)] bg-cacao" />

      <Cabecera
        saludo={`${saludo(ahora)} ${nombre}`}
        hoy={hoy}
        lunes={lunes}
        lunesHoy={lunesHoy}
        dias={dias}
        pesos={datos.pesos}
        semana={semana}
        semanaPrevia={semanaPrevia}
        seleccion={seleccion}
        onSemana={irASemana}
      />

      <main className="relative -mt-6 flex-1 rounded-t-[28px] bg-crema pb-[calc(env(safe-area-inset-bottom)+2rem)] pt-5">
        <div className="mx-auto max-w-md px-5">
          <TiraDias dias={dias} pesos={datos.pesos} hoy={hoy} seleccion={seleccion} onDia={tocarDia} />
          <PanelDia clave={seleccion} hoy={hoy} pesos={datos.pesos} onEditar={() => setHoja(seleccion)} />
          <HistorialSemanas
            semanas={anteriores}
            todas={semanas}
            lunesVisible={lunes}
            hoy={hoy}
            onSemana={abrirSemanaDelHistorial}
          />
          <CopiaSeguridad pesos={datos.pesos} hoy={hoy} onImportar={importar} onAviso={setAviso} />
          <p className="mt-10 text-center text-xs text-oxido">
            DailyWeigh · © 2026 Ángel Serrano Domínguez
          </p>
        </div>
      </main>

      {hoja && (
        <HojaPeso
          key={hoja}
          diaInicial={hoja}
          hoy={hoy}
          pesos={datos.pesos}
          onGuardar={guardarPeso}
          onBorrar={borrarPeso}
          onCerrar={cerrarHoja}
          seguirTeclado={!enMarco}
        />
      )}

      <Aviso mensaje={aviso} onFin={cerrarAviso} />
    </div>
  );
}
