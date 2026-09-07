/**
 * Marco de dispositivo que contiene las demos.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
export default function PhoneFrame({ children }) {
  return (
    <div className="relative">
      {/* Carcasa */}
      <div className="relative rounded-[44px] bg-mono-800 p-[10px] shadow-[0_40px_90px_-25px_rgba(0,0,0,0.9)] ring-1 ring-mono-700">
        {/* Botones laterales */}
        <span className="absolute -left-[3px] top-[120px] h-14 w-[3px] rounded-l bg-mono-600" />
        <span className="absolute -left-[3px] top-[190px] h-14 w-[3px] rounded-l bg-mono-600" />
        <span className="absolute -right-[3px] top-[150px] h-20 w-[3px] rounded-r bg-mono-600" />

        {/* Pantalla. Se encoge en viewports pequeños para no desbordarlos. */}
        <div
          className="relative overflow-hidden rounded-[36px] bg-black"
          style={{
            width: 'min(344px, calc(100vw - 76px))',
            height: 'clamp(460px, calc(100dvh - 210px), 720px)',
          }}
        >
          {/* Isla dinámica */}
          <div className="pointer-events-none absolute left-1/2 top-2 z-30 h-[26px] w-[92px] -translate-x-1/2 rounded-full bg-black" />
          <div className="h-full w-full overflow-hidden">{children}</div>
        </div>
      </div>
    </div>
  );
}

/**
 * Barra de estado del sistema. Solo la hora: los indicadores de cobertura,
 * wifi y batería serían iconos, y el portfolio no usa ninguno.
 */
export function StatusBar({ dark = false }) {
  return (
    <div
      className={`flex h-11 shrink-0 items-center px-7 pt-1 text-[13px] font-semibold ${
        dark ? 'text-white' : 'text-black'
      }`}
    >
      <span>9:41</span>
    </div>
  );
}
