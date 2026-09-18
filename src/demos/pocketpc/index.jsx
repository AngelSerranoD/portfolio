/**
 * Demo de PocketPC — réplica en React de la app de Android.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 *
 * La app de verdad es Kotlin + Compose y habla con un PC por WebRTC, así que
 * aquí se recrea su interfaz con un PC simulado de dos monitores: «Mis PCs» →
 * conectando → elegir pantalla → visor (Visor.jsx) sobre un escritorio de
 * Windows pintado a su tamaño real (Escritorio.jsx).
 */
import { useEffect, useRef, useState } from 'react';
import { StatusBar } from '../../components/PhoneFrame';
import { C, FUENTE, Icono } from './tema';
import { Escritorio, MONITORES, estadoInicial } from './Escritorio';
import Visor from './Visor';
import logo from './logo.png';

const PC = 'Sobremesa';

export default function PocketPcDemo() {
  const [pantalla, setPantalla] = useState('lista');   // lista · conectando · selector · visor
  const [paso, setPaso] = useState('');
  const [monitor, setMonitor] = useState('principal');
  const [escritorio, setEscritorio] = useState(estadoInicial);
  const [ultimoUso, setUltimoUso] = useState('hace 2 horas');
  const [aviso, setAviso] = useState(null);
  const temporizadores = useRef([]);

  useEffect(() => () => temporizadores.current.forEach(clearTimeout), []);
  const luego = (ms, fn) => temporizadores.current.push(setTimeout(fn, ms));

  const avisar = (texto) => {
    setAviso(texto);
    luego(2600, () => setAviso(null));
  };

  const conectar = () => {
    setPaso(`Llamando a ${PC}…`);
    setPantalla('conectando');
    luego(900, () => setPaso('Abriendo el vídeo…'));
    luego(1700, () => { setUltimoUso('ahora mismo'); setPantalla('selector'); });
  };

  const cancelar = () => {
    temporizadores.current.forEach(clearTimeout);
    setPantalla('lista');
  };

  return (
    <div className="relative flex h-full w-full flex-col antialiased" style={{ fontFamily: FUENTE, background: pantalla === 'visor' ? C.noche : C.cielo, color: C.tinta }}>
      {pantalla !== 'visor' && <StatusBar />}
      <div className="relative min-h-0 flex-1">
        {pantalla === 'lista' && <MisPcs ultimoUso={ultimoUso} alConectar={conectar} alAvisar={avisar} />}
        {pantalla === 'conectando' && <Conectando paso={paso} alCancelar={cancelar} />}
        {pantalla === 'selector' && (
          <Selector
            actual={monitor}
            escritorio={escritorio}
            alElegir={(id) => { setMonitor(id); setPantalla('visor'); }}
          />
        )}
        {pantalla === 'visor' && (
          <Visor
            pcNombre={PC}
            monitor={monitor}
            escritorio={escritorio}
            setEscritorio={setEscritorio}
            alPantallas={() => setPantalla('selector')}
            alSalir={() => setPantalla('lista')}
          />
        )}
        {aviso && (
          <div className="absolute bottom-24 left-4 right-4 z-30 rounded-lg px-4 py-3 text-[13px] text-white shadow-lg" style={{ background: '#2F3033' }}>
            {aviso}
          </div>
        )}
      </div>
    </div>
  );
}

function MisPcs({ ultimoUso, alConectar, alAvisar }) {
  const [hoja, setHoja] = useState(false);
  const [menu, setMenu] = useState(false);
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-4 pb-3 pt-2">
        <img src={logo} alt="" className="h-9 w-7 object-contain" />
        <div className="leading-tight">
          <div className="text-[20px] font-bold" style={{ color: C.marino }}>Mis PCs</div>
          <div className="text-[12px]" style={{ color: C.tintaSuave }}>PocketPC</div>
        </div>
      </div>

      <div className="px-4 pt-1">
        <div
          role="button"
          tabIndex={0}
          onClick={alConectar}
          onKeyDown={(e) => e.key === 'Enter' && alConectar()}
          className="flex cursor-pointer items-center gap-3 rounded-[20px] bg-white p-4"
          style={{ border: `1px solid ${C.bruma}`, boxShadow: '0 1px 2px rgba(18,56,95,.08)' }}
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px]" style={{ background: `linear-gradient(${C.celeste}, ${C.azul})` }}>
            <Icono nombre="pc" color="#fff" tam={26} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[16px] font-bold">{PC}</div>
            <div className="flex items-center gap-1.5 text-[12px]" style={{ color: C.tintaSuave }}>
              <span className="h-2 w-2 rounded-full" style={{ background: C.verde }} />
              En línea · 2 pantallas
            </div>
            <div className="text-[12px]" style={{ color: C.tintaSuave, opacity: 0.8 }}>Último uso: {ultimoUso}</div>
          </div>
          <div className="relative">
            <button type="button" aria-label="Opciones" onClick={(e) => { e.stopPropagation(); setMenu(!menu); }} className="flex h-9 w-9 items-center justify-center">
              <Icono nombre="mas" color={C.tintaSuave} tam={22} />
            </button>
            {menu && (
              <div className="absolute right-0 top-9 z-10 w-44 rounded-md bg-white py-1 text-[13px] shadow-xl" onClick={(e) => e.stopPropagation()}>
                <button type="button" className="block w-full px-4 py-2.5 text-left" onClick={() => { setMenu(false); alConectar(); }}>Conectar</button>
                <button type="button" className="block w-full px-4 py-2.5 text-left" style={{ color: '#C23B3B' }} onClick={() => { setMenu(false); alAvisar('En la demo el PC no se puede olvidar.'); }}>Olvidar este PC</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setHoja(true)}
        className="absolute bottom-6 right-4 flex items-center gap-2 rounded-2xl py-3.5 pl-4 pr-5 text-[14px] font-medium text-white shadow-lg"
        style={{ background: C.marino }}
      >
        <Icono nombre="anadir" color="#fff" tam={22} />
        Añadir PC
      </button>

      {hoja && (
        <div className="absolute inset-0 z-20 flex items-end" style={{ background: 'rgba(0,0,0,.32)' }} onClick={() => setHoja(false)}>
          <div className="w-full rounded-t-[28px] bg-white px-6 pb-8 pt-3" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-4 h-1 w-8 rounded-full" style={{ background: C.tintaSuave, opacity: 0.5 }} />
            <div className="text-[19px] font-bold" style={{ color: C.marino }}>Añadir un PC</div>
            <p className="mt-1 text-[13px]" style={{ color: C.tintaSuave }}>En el PC, abre PocketPC y pulsa «Emparejar un móvil». Aparecerá un código QR.</p>
            {[
              ['qr', 'Escanear el código QR', 'Con la cámara, sin dar permisos a la app'],
              ['pegar', 'Pegar el código', 'Si lo copiaste como texto desde el PC'],
            ].map(([icono, titulo, detalle]) => (
              <button
                type="button"
                key={icono}
                onClick={() => { setHoja(false); alAvisar(`En la demo no hay PC que emparejar: «${PC}» ya está en Mis PCs.`); }}
                className="mt-3 flex w-full items-center gap-4 rounded-xl py-2 text-left"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full" style={{ background: C.cielo }}>
                  <Icono nombre={icono} color={C.marino} tam={22} />
                </span>
                <span>
                  <span className="block text-[14px] font-semibold">{titulo}</span>
                  <span className="block text-[12px]" style={{ color: C.tintaSuave }}>{detalle}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Conectando({ paso, alCancelar }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-8 text-center">
      <img src={logo} alt="" className="h-[127px] w-24 object-contain" />
      <span className="mt-7 h-10 w-10 animate-spin rounded-full border-[3px]" style={{ borderColor: C.bruma, borderTopColor: C.azul }} />
      <div className="mt-5 text-[20px] font-bold" style={{ color: C.marino }}>{PC}</div>
      <div className="mt-1 text-[14px]" style={{ color: C.tintaSuave }}>{paso}</div>
      <button type="button" onClick={alCancelar} className="mt-7 rounded-full px-4 py-2 text-[14px] font-medium" style={{ color: C.marino }}>Cancelar</button>
    </div>
  );
}

function Selector({ actual, escritorio, alElegir }) {
  return (
    <div className="no-scrollbar h-full overflow-y-auto px-5 pb-6">
      <div className="pt-2 text-[20px] font-bold leading-tight" style={{ color: C.marino }}>¿Qué pantalla quieres ver?</div>
      <div className="text-[13px]" style={{ color: C.tintaSuave }}>{PC}</div>
      <div className="mt-4 space-y-3.5">
        {MONITORES.map((m) => {
          const elegido = m.id === actual;
          const escala = Math.min(230 / m.ancho, 150 / m.alto);   // cabe también en un móvil estrecho
          return (
            <button
              type="button"
              key={m.id}
              onClick={() => alElegir(m.id)}
              className="block w-full rounded-[18px] bg-white p-3 text-left"
              style={{ border: `${elegido ? 2 : 1}px solid ${elegido ? C.azul : C.bruma}` }}
            >
              <div className="relative flex h-[150px] items-center justify-center overflow-hidden rounded-[10px]" style={{ background: C.noche }}>
                <div className="pointer-events-none" style={{ width: m.ancho * escala, height: m.alto * escala }}>
                  <div style={{ transform: `scale(${escala})`, transformOrigin: '0 0' }}>
                    <Escritorio monitor={m.id} estado={escritorio} />
                  </div>
                </div>
              </div>
              <div className="mt-2.5 truncate text-[14px] font-semibold">{m.nombre}</div>
              <div className="text-[12px]" style={{ color: C.tintaSuave }}>
                {m.real}{m.principal ? ' · principal' : ''}{elegido ? ' · viendo ahora' : ''}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
