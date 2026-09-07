/**
 * Párrafo de las notas técnicas. Resuelve los fragmentos entre acentos
 * graves como código en línea, igual que en Markdown.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
function withInlineCode(text) {
  return text.split('`').map((part, i) =>
    i % 2 === 1 ? (
      <code
        key={i}
        className="rounded bg-mono-800 px-1.5 py-0.5 font-mono text-[0.85em] text-mono-100"
      >
        {part}
      </code>
    ) : (
      part
    )
  );
}

export default function TechnicalNote({ note, index }) {
  return (
    <div className="border-t border-mono-800 py-8 first:border-t-0 first:pt-0">
      <div className="flex gap-5 sm:gap-8">
        <span className="w-6 shrink-0 pt-1 font-display text-xs text-mono-500">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="min-w-0">
          <h3 className="font-display text-base font-bold tracking-tight text-mono-50">
            {note.title}
          </h3>
          <p className="mt-3 text-[15px] leading-[1.75] text-mono-300">
            {withInlineCode(note.body)}
          </p>
        </div>
      </div>
    </div>
  );
}
