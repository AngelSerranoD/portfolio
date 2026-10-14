/**
 * Política de privacidad de Schematic Lab (la URL que pide la Microsoft Store).
 * No está en la navegación: solo se llega por su enlace.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { AUTHOR, EMAIL } from '../data/profile';

const TEXTOS = {
  es: {
    titulo: 'Política de privacidad de Schematic Lab',
    fecha: 'Última actualización: 14 de octubre de 2026',
    intro:
      'Schematic Lab es una aplicación de escritorio para Windows, de Ángel Serrano Domínguez, que muestra en 3D schematics de Minecraft y calcula sus materiales.',
    secciones: [
      {
        h: 'Qué datos recoge',
        p: [
          'Ninguno. La aplicación no envía datos a ningún servidor, no tiene cuentas, no incluye telemetría, analítica ni publicidad y funciona sin conexión. No hay ningún servidor mío detrás de ella.',
        ],
      },
      {
        h: 'Qué lee y qué guarda en tu equipo',
        l: [
          'Los archivos de schematics (.litematic, .schem, .schematic, .nbt) que eliges importar. Se copian a la biblioteca de la app; el original no se modifica.',
          'La carpeta .minecraft (por defecto %APPDATA%\\.minecraft, o la que elijas en Ajustes) para localizar las versiones de Minecraft instaladas, y el jar de la versión elegida para leer sus texturas y los nombres de los ítems. Las texturas no salen de tu equipo ni se redistribuyen.',
          'Su biblioteca y sus ajustes: copias de los schematics, el historial de versiones, las miniaturas, un índice SQLite y las preferencias (tema, carpeta de Minecraft, versión de texturas, lo ya reunido en las listas de materiales). En la versión de la Microsoft Store se guardan en la carpeta privada que Windows reserva para la app (%LOCALAPPDATA%\\Packages\\…\\LocalState, y la caché de texturas en …\\LocalCache). En la versión del instalador de GitHub, en %APPDATA%\\com.aserrano.schematiclab\\, y la caché de texturas en %LOCALAPPDATA%\\com.aserrano.schematiclab\\.',
          'Los archivos que exportas (CSV de materiales, schematics), en el sitio que eliges.',
        ],
        p: [
          'Todo queda en tu equipo. Eliminar un schematic desde la app lo manda a la Papelera de Windows. Para borrar todo lo que guarda la app: en la versión de la Microsoft Store basta desinstalarla, porque Windows borra su carpeta; en la del instalador de GitHub, desinstálala y borra las carpetas %APPDATA%\\com.aserrano.schematiclab\\ y %LOCALAPPDATA%\\com.aserrano.schematiclab\\.',
        ],
      },
      {
        h: 'Terceros',
        p: [
          'La aplicación no comparte datos con terceros. Usa el componente WebView2 de Microsoft, que forma parte de Windows y se rige por las condiciones de Microsoft; la app no le envía ni le pide nada de red. Minecraft es una marca de Mojang AB / Microsoft; esta aplicación no es un producto oficial ni está aprobada por ellos.',
        ],
      },
      { h: 'Menores', p: ['La aplicación no recoge datos de nadie, tampoco de menores.'] },
      {
        h: 'Cambios y contacto',
        p: ['Si esta política cambia, se actualizará esta página con su fecha. Para cualquier duda:'],
        correo: true,
      },
    ],
    aviso: 'No es un producto oficial de Minecraft. No está aprobado por Mojang ni Microsoft ni asociado con ellos. Tampoco está afiliado a Litematica ni a su autor.',
    volver: 'Ver la ficha del proyecto',
  },
  en: {
    titulo: 'Schematic Lab privacy policy',
    fecha: 'Last updated: 14 October 2026',
    intro:
      'Schematic Lab is a Windows desktop app by Ángel Serrano Domínguez that shows Minecraft schematics in 3D and works out their materials.',
    secciones: [
      {
        h: 'What data it collects',
        p: [
          'None. The app sends no data to any server, has no accounts, includes no telemetry, analytics or advertising, and works offline. There is no server of mine behind it.',
        ],
      },
      {
        h: 'What it reads and stores on your computer',
        l: [
          'The schematic files (.litematic, .schem, .schematic, .nbt) you choose to import. They are copied into the app library; the original is not modified.',
          'The .minecraft folder (by default %APPDATA%\\.minecraft, or the one you pick in Settings) to find the installed Minecraft versions, and the jar of the chosen version to read its textures and item names. Textures never leave your computer and are not redistributed.',
          'Its library and settings: copies of the schematics, the version history, thumbnails, a SQLite index and the preferences (theme, Minecraft folder, texture version, what you have ticked off in materials lists). In the Microsoft Store version they are kept in the private folder Windows reserves for the app (%LOCALAPPDATA%\\Packages\\…\\LocalState, with the texture cache in …\\LocalCache). In the GitHub installer version, in %APPDATA%\\com.aserrano.schematiclab\\, with the texture cache in %LOCALAPPDATA%\\com.aserrano.schematiclab\\.',
          'The files you export (materials CSV, schematics), wherever you choose.',
        ],
        p: [
          'Everything stays on your computer. Deleting a schematic from the app sends it to the Windows Recycle Bin. To remove everything the app stores: in the Microsoft Store version, just uninstall it, because Windows deletes its folder; in the GitHub installer version, uninstall it and delete the folders %APPDATA%\\com.aserrano.schematiclab\\ and %LOCALAPPDATA%\\com.aserrano.schematiclab\\.',
        ],
      },
      {
        h: 'Third parties',
        p: [
          'The app shares no data with third parties. It uses the Microsoft WebView2 component, which is part of Windows and is governed by Microsoft terms; the app sends it nothing over the network and asks nothing of it. Minecraft is a trademark of Mojang AB / Microsoft; this app is not an official product and is not approved by them.',
        ],
      },
      { h: 'Children', p: ['The app collects no data from anyone, children included.'] },
      {
        h: 'Changes and contact',
        p: ['If this policy changes, this page will be updated with its date. For any question:'],
        correo: true,
      },
    ],
    aviso: 'Not an official Minecraft product. Not approved by or associated with Mojang or Microsoft. Not affiliated with Litematica or its author.',
    volver: 'See the project page',
  },
};

const IDIOMAS = [
  ['es', 'Español'],
  ['en', 'English'],
];

export default function PrivacidadSchematicLab() {
  const [idioma, setIdioma] = useState('es');
  const t = TEXTOS[idioma];

  useEffect(() => {
    document.title = `${t.titulo} · ${AUTHOR}`;
  }, [t.titulo]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <Nav />

      <article className="container-page max-w-2xl pt-12" lang={idioma}>
        <div className="flex gap-4 text-sm" role="group" aria-label="Idioma / Language">
          {IDIOMAS.map(([id, nombre]) => (
            <button
              key={id}
              type="button"
              onClick={() => setIdioma(id)}
              aria-pressed={idioma === id}
              className={idioma === id ? 'font-bold text-ink' : 'link-quiet'}
            >
              {nombre}
            </button>
          ))}
        </div>

        <h1 className="mt-10 font-display text-4xl font-bold tracking-tightest sm:text-5xl">
          {t.titulo}
        </h1>
        <p className="label mt-4">{t.fecha}</p>
        <p className="mt-8 leading-relaxed text-slate">{t.intro}</p>

        {t.secciones.map((s) => (
          <section key={s.h} className="mt-10">
            <h2 className="font-display text-xl font-bold tracking-tight">{s.h}</h2>
            {s.l && (
              <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-slate">
                {s.l.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            )}
            {s.p?.map((x) => (
              <p key={x} className="mt-3 leading-relaxed text-slate">
                {x}
                {s.correo && (
                  <>
                    {' '}
                    <a href={`mailto:${EMAIL}`} className="link-quiet">
                      {EMAIL}
                    </a>
                    .
                  </>
                )}
              </p>
            ))}
          </section>
        ))}

        <p className="mt-12 text-xs text-clay">{t.aviso}</p>
        <p className="mt-6">
          <Link to="/proyecto/schematic-lab" className="link-quiet text-sm">
            {t.volver}
          </Link>
        </p>
      </article>

      <Footer />
    </div>
  );
}
