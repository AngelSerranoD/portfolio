/**
 * Párrafo de las notas técnicas. Resuelve los fragmentos entre acentos
 * graves como código en línea y los que van entre dobles asteriscos como
 * negrita, igual que en Markdown.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */

// Solo casa parejas completas: un `**` suelto se queda como texto.
const BOLD = /\*\*(.+?)\*\*/;

function withBold(text, key) {
  // Con el grupo de captura, split deja en las posiciones impares lo que iba
  // entre los asteriscos.
  return text.split(BOLD).map((part, i) =>
    i % 2 === 1 ? (
      <strong key={`${key}-${i}`} className="font-bold">
        {part}
      </strong>
    ) : (
      part
    )
  );
}

function withInlineCode(text) {
  // Primero se separa el código: lo que va dentro de los acentos graves no
  // se interpreta, así que unos asteriscos ahí se muestran tal cual.
  return text.split('`').map((part, i) =>
    i % 2 === 1 ? (
      <code
        key={i}
        className="bg-black/50 px-1.5 py-0.5 font-mono text-[0.85em] text-mc-hover"
      >
        {part}
      </code>
    ) : (
      withBold(part, i)
    )
  );
}

export default function TechnicalNote({ note, index }) {
  return (
    <div className="border-t border-white/15 py-8 first:border-t-0 first:pt-0">
      <div className="flex gap-5 sm:gap-8">
        <span className="w-6 shrink-0 pt-1 font-mc text-xs text-mc-suave">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="min-w-0">
          <h3 className="font-mc text-base font-bold text-mc-texto mc-sombra">
            {note.title}
          </h3>
          <p className="mt-3 text-[15px] leading-[1.75] text-mc-texto">
            {withInlineCode(note.body)}
          </p>
        </div>
      </div>
    </div>
  );
}
