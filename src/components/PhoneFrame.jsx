/**
 * Marco de dispositivo que contiene las demos.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
export default function PhoneFrame({ children, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      {/* Carcasa */}
      <div className="relative rounded-[44px] bg-ink-800 p-[10px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] ring-1 ring-white/10">
        {/* Botones laterales */}
        <span className="absolute -left-[3px] top-[120px] h-14 w-[3px] rounded-l bg-ink-600" />
        <span className="absolute -left-[3px] top-[190px] h-14 w-[3px] rounded-l bg-ink-600" />
        <span className="absolute -right-[3px] top-[150px] h-20 w-[3px] rounded-r bg-ink-600" />

        {/* Pantalla. Se encoge en pantallas bajas para no salirse del viewport. */}
        <div
          className="relative w-[344px] overflow-hidden rounded-[36px] bg-black"
          style={{ height: 'clamp(460px, calc(100dvh - 210px), 720px)' }}
        >
          {/* Isla dinámica */}
          <div className="pointer-events-none absolute left-1/2 top-2 z-30 h-[26px] w-[92px] -translate-x-1/2 rounded-full bg-black" />
          <div className="h-full w-full overflow-hidden">{children}</div>
        </div>
      </div>
    </div>
  );
}

/** Barra de estado falsa que usan las demos para parecer una app real. */
export function StatusBar({ dark = false }) {
  const color = dark ? 'text-white' : 'text-black';
  return (
    <div className={`flex h-11 shrink-0 items-center justify-between px-7 pt-1 text-[13px] font-semibold ${color}`}>
      <span>9:41</span>
      <div className="flex items-center gap-1.5">
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor" aria-hidden="true">
          <rect x="0" y="7" width="3" height="4" rx="1" />
          <rect x="4.5" y="5" width="3" height="6" rx="1" />
          <rect x="9" y="2.5" width="3" height="8.5" rx="1" />
          <rect x="13.5" y="0" width="3" height="11" rx="1" />
        </svg>
        <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor" aria-hidden="true">
          <path d="M8 9.5 5.2 6.7a4 4 0 0 1 5.6 0L8 9.5ZM2.4 3.9a8 8 0 0 1 11.2 0l-1.4 1.4a6 6 0 0 0-8.4 0L2.4 3.9Z" />
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none" aria-hidden="true">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="currentColor" opacity="0.4" />
          <rect x="2" y="2" width="16" height="8" rx="2" fill="currentColor" />
          <path d="M23 4v4a2 2 0 0 0 0-4Z" fill="currentColor" opacity="0.4" />
        </svg>
      </div>
    </div>
  );
}
