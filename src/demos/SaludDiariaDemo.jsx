/**
 * Demo web de "SaludDiaria" — réplica de la app Android (Jetpack Compose).
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
import { useState } from 'react';
import { StatusBar } from '../components/PhoneFrame';

const C = {
  background: '#F2F3F5',
  surface: '#FFFFFF',
  darkSurface: '#192126',
  accentLime: '#BBF246',
  textPrimary: '#192126',
  textSecondary: '#5E6468',
  textMuted: '#8B8F92',
  border: '#E5E7EB',
  track: '#E5E7EB',
};

const SECTIONS = {
  escoliosis: {
    titulo: 'Escoliosis',
    subtitulo: 'Columna vertebral',
    dark: true,
    ejercicios: [
      {
        id: 'e1',
        nombre: 'Cat-Camel',
        descripcion:
          'A gatas, alterna entre arquear la espalda hacia el techo y hundir la zona lumbar, manteniendo cada postura 5 segundos. Quita rigidez a las vértebras y mejora la movilidad segmentaria de toda la columna.',
      },
      {
        id: 'e2',
        nombre: 'Báscula Pélvica',
        descripcion:
          'Tumbado boca arriba con las rodillas flexionadas, contrae el abdomen para pegar completamente la zona lumbar al suelo. Te enseña a estabilizar la pelvis y es la base de todos los demás ejercicios.',
      },
      {
        id: 'e3',
        nombre: 'Elongación del Dorsal Ancho',
        descripcion:
          'De pie con los brazos arriba, agarra tu muñeca derecha y flexiona el tronco hacia la izquierda. Estira y abre la zona derecha, el lado que suele estar más contraído en la curva.',
      },
      {
        id: 'e4',
        nombre: 'Autocorrección Activa (SEAS)',
        descripcion:
          'De pie, alárgate hacia el techo como si te tiraran de un hilo y desplaza voluntariamente la pelvis hacia la izquierda para alinearla. Entrena al cuerpo a buscar su postura corregida de forma activa.',
      },
      {
        id: 'e5',
        nombre: 'El Cilindro Muscular',
        descripcion:
          'Tumbado sobre tu lado izquierdo con un cojín bajo la cintura, eleva la pierna derecha estirada. Mantén la tensión y respira profundamente intentando expandir tu lado derecho con cada inhalación.',
      },
      {
        id: 'e6',
        nombre: 'Bird-Dog Asimétrico',
        descripcion:
          'A gatas, levanta y estira a la vez el brazo izquierdo y la pierna derecha. Mantén el tronco completamente recto sin girar. Fortalece la musculatura del lado derecho y la estabilidad del core.',
      },
      {
        id: 'e7',
        nombre: 'Plancha Lateral Asimétrica',
        descripcion:
          'Haz una plancha lateral apoyándote exclusivamente sobre el antebrazo y el pie izquierdos. Fortalece el lado convexo y usa la gravedad para forzar la realineación de la curva.',
      },
    ],
  },
  desrealizacion: {
    titulo: 'Desrealización',
    subtitulo: 'Sistema nervioso',
    dark: false,
    ejercicios: [
      {
        id: 'd1',
        nombre: 'Activación Vagal (Al despertar)',
        descripcion:
          'Antes de salir de casa, mientras te lavas los dientes o la cara, haz gargarismos vigorosos con agua o tararea una canción con los labios cerrados. Activa de inmediato las ramas superiores del nervio vago.',
      },
      {
        id: 'd2',
        nombre: 'Entrenamiento de 1h',
        descripcion:
          'Usa la hora de entrenamiento como tu terapia principal de realidad. Enfoca la atención en la propiocepción: el impacto de tus pies, la gravedad al levantar peso, la tensión de cada músculo.',
      },
      {
        id: 'd3',
        nombre: 'Técnica 5-4-3-2-1',
        descripcion:
          'Nombra en voz alta 5 objetos detallando sus colores, toca 4 texturas prestando atención a su temperatura, aísla 3 sonidos, huele 2 cosas y concéntrate en 1 sabor. Saca al cerebro del letargo perceptivo.',
      },
      {
        id: 'd4',
        nombre: 'Choque Térmico · Rescate SOS',
        descripcion:
          'Si la desconexión se vuelve muy profunda, ve al baño y lávate la cara con agua muy fría. Estimula el reflejo de inmersión y reinicia rápidamente el sistema nervioso autónomo.',
      },
      {
        id: 'd5',
        nombre: 'Resonancia «Voo»',
        descripcion:
          'Siéntate cómodamente, toma aire y exhala emitiendo un sonido grave y gutural de «Voooooo» hasta quedarte sin aire. Repítelo 5 veces. Masajea el nervio vago internamente.',
      },
      {
        id: 'd6',
        nombre: 'Freno Vagal (Antes de dormir)',
        descripcion:
          'Ya en la cama, inhala contando hasta 4 y exhala muy lentamente por la boca, como soplando por una pajita, contando hasta 6 u 8. Indica al cuerpo que el entorno es seguro para el descanso profundo.',
      },
    ],
  },
};

function SectionCard({ seccion, hechos, onClick }) {
  const total = seccion.ejercicios.length;
  const dark = seccion.dark;

  return (
    <button
      onClick={onClick}
      className="w-full rounded-[24px] p-5 text-left transition active:scale-[0.98]"
      style={{
        backgroundColor: dark ? C.darkSurface : C.surface,
        border: dark ? 'none' : `1px solid ${C.border}`,
      }}
    >
      <div className="flex items-start justify-end">
        <span
          className="rounded-full px-2.5 py-1 text-[11px] font-bold"
          style={{
            backgroundColor: dark ? 'rgba(187,242,70,0.15)' : C.background,
            color: dark ? C.accentLime : C.textSecondary,
          }}
        >
          {hechos}/{total}
        </span>
      </div>

      <h2 className="mt-4 text-[22px] font-extrabold leading-tight" style={{ color: dark ? '#FFFFFF' : C.textPrimary }}>
        {seccion.titulo}
      </h2>
      <p className="mt-0.5 text-[12px] font-semibold" style={{ color: dark ? C.accentLime : C.textMuted }}>
        {total} ejercicios · {seccion.subtitulo}
      </p>

      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full" style={{ backgroundColor: dark ? 'rgba(255,255,255,0.12)' : C.track }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${(hechos / total) * 100}%`, backgroundColor: C.accentLime }}
        />
      </div>
    </button>
  );
}

function EjercicioCard({ ejercicio, hecho, onToggle }) {
  const [abierto, setAbierto] = useState(false);

  return (
    <div
      className="rounded-[20px] p-4 transition"
      style={{
        backgroundColor: C.surface,
        border: `1.5px solid ${hecho ? C.accentLime : C.border}`,
      }}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={onToggle}
          className="mt-0.5 flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-lg border-2 transition active:scale-90"
          style={{
            borderColor: hecho ? C.accentLime : C.border,
            backgroundColor: hecho ? C.accentLime : 'transparent',
          }}
          aria-label={hecho ? 'Marcar como pendiente' : 'Marcar como hecho'}
        >
          {hecho && <span className="h-[9px] w-[9px] rounded-sm" style={{ backgroundColor: C.darkSurface }} />}
        </button>

        <button onClick={() => setAbierto((v) => !v)} className="min-w-0 flex-1 text-left">
          <p
            className="text-[14px] font-bold leading-snug"
            style={{ color: C.textPrimary, opacity: hecho ? 0.45 : 1, textDecoration: hecho ? 'line-through' : 'none' }}
          >
            {ejercicio.nombre}
          </p>
          <p
            className="mt-1 text-[11.5px] leading-relaxed"
            style={{ color: C.textSecondary, opacity: hecho ? 0.45 : 1 }}
          >
            {abierto ? ejercicio.descripcion : `${ejercicio.descripcion.slice(0, 62)}…`}
          </p>
          <span className="mt-1.5 inline-block text-[10.5px] font-bold" style={{ color: C.textMuted }}>
            {abierto ? 'Ver menos' : 'Ver más'}
          </span>
        </button>
      </div>
    </div>
  );
}

export default function SaludDiariaDemo() {
  const [pantalla, setPantalla] = useState('home');
  const [hechos, setHechos] = useState(() => new Set(['e1', 'e2']));

  const toggle = (id) =>
    setHechos((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const contar = (key) => SECTIONS[key].ejercicios.filter((e) => hechos.has(e.id)).length;

  return (
    <div className="flex h-full flex-col" style={{ backgroundColor: C.background }}>
      <StatusBar />

      {pantalla === 'home' ? (
        <div className="no-scrollbar flex-1 overflow-y-auto px-6 pb-8">
          <p className="pt-6 text-[12px] font-medium" style={{ color: C.textSecondary }}>
            Lunes 7 de septiembre
          </p>
          <h1 className="mt-1 text-[34px] font-extrabold leading-[1.1]" style={{ color: C.textPrimary }}>
            Tu rutina
            <br />
            de hoy
          </h1>

          <div className="mt-8 space-y-4">
            {Object.entries(SECTIONS).map(([key, seccion]) => (
              <SectionCard
                key={key}
                seccion={seccion}
                hechos={contar(key)}
                onClick={() => setPantalla(key)}
              />
            ))}
          </div>

          <div className="mt-8 rounded-[20px] p-5" style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}>
            <p className="text-[13px] font-extrabold" style={{ color: C.textPrimary }}>
              Progreso del día
            </p>
            <p className="mt-1 text-[11.5px]" style={{ color: C.textSecondary }}>
              {hechos.size} de 13 ejercicios completados
            </p>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full" style={{ backgroundColor: C.track }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${(hechos.size / 13) * 100}%`, backgroundColor: C.accentLime }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="shrink-0 px-6 pt-4">
            <button
              onClick={() => setPantalla('home')}
              className="text-[13px] font-bold"
              style={{ color: C.textSecondary }}
            >
              Volver
            </button>

            <h1 className="mt-4 text-[28px] font-extrabold leading-tight" style={{ color: C.textPrimary }}>
              {SECTIONS[pantalla].titulo}
            </h1>
            <div className="mt-3 flex items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full" style={{ backgroundColor: C.track }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(contar(pantalla) / SECTIONS[pantalla].ejercicios.length) * 100}%`,
                    backgroundColor: C.accentLime,
                  }}
                />
              </div>
              <span className="text-[12px] font-bold" style={{ color: C.textSecondary }}>
                {contar(pantalla)}/{SECTIONS[pantalla].ejercicios.length}
              </span>
            </div>
          </div>

          <div className="no-scrollbar mt-5 flex-1 space-y-3 overflow-y-auto px-6 pb-8">
            {SECTIONS[pantalla].ejercicios.map((ej) => (
              <EjercicioCard
                key={ej.id}
                ejercicio={ej}
                hecho={hechos.has(ej.id)}
                onToggle={() => toggle(ej.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
