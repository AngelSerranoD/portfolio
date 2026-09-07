import React, { useState, useEffect } from 'react';
import { BottomSheet } from './BottomSheet';

const FLOW_OPTIONS = [
  { value: 'poca', label: 'Poca' },
  { value: 'normal', label: 'Normal' },
  { value: 'mucha', label: 'Mucha' },
];
const TEXTURE_OPTIONS = [
  { value: 'acuosa', label: 'Acuosa' },
  { value: 'claraDeHuevo', label: 'Clara' },
  { value: 'yema', label: 'Coágulos' },
  { value: 'espesa', label: 'Espesa' },
];
const PAIN_OPTIONS = [
  { value: 'abdominal', label: 'Abdominal' },
  { value: 'cabeza', label: 'Cabeza' },
  { value: 'espalda', label: 'Espalda' },
  { value: 'pechos', label: 'Pechos' },
  { value: 'diarrea', label: 'Diarrea' },
  { value: 'estreñimiento', label: 'Estreñimiento' },
];
const STATE_OPTIONS = [
  { value: 'hinchada', label: 'Hinchada' },
  { value: 'normal', label: 'Normal' },
  { value: 'delgada', label: 'Ligera' },
  { value: 'cansada', label: 'Cansada' },
  { value: 'energica', label: 'Enérgica' },
];

function Chip({ label, selected, onClick, color, dark }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '9px 16px',
        borderRadius: 22,
        fontSize: 14,
        fontWeight: 500,
        border: selected ? `1.5px solid ${color || '#EF5350'}99` : '1.5px solid transparent',
        backgroundColor: selected ? `${color || '#EF5350'}22` : dark ? '#2C2C2E' : '#F2F2F7',
        color: selected ? (color || '#EF5350') : 'inherit',
        flexShrink: 0,
        transition: 'all 0.15s ease',
      }}
    >
      {label}
    </button>
  );
}

export function MenstruationForm({ open, onClose, initialDetail, onSave, dark }) {
  const [flow, setFlow] = useState('normal');
  const [texture, setTexture] = useState(null);
  const [pains, setPains] = useState([]);
  const [physicalState, setPhysicalState] = useState(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (open) {
      setFlow(initialDetail?.flow || 'normal');
      setTexture(initialDetail?.texture || null);
      setPains(initialDetail?.pains || []);
      setPhysicalState(initialDetail?.physicalState || null);
      setNotes(initialDetail?.notes || '');
    }
  }, [open, initialDetail]);

  const togglePain = (val) =>
    setPains(prev => prev.includes(val) ? prev.filter(p => p !== val) : [...prev, val]);

  const handleSave = () => {
    onSave({ flow, texture, pains, physicalState, notes: notes.trim() || null });
    onClose();
  };

  const sectionLabel = (text) => (
    <span
      className="text-xs font-semibold tracking-widest uppercase"
      style={{ color: dark ? 'rgba(255,255,255,0.38)' : 'rgba(0,0,0,0.38)' }}
    >
      {text}
    </span>
  );

  return (
    <BottomSheet open={open} onClose={onClose} title="Menstruación" dark={dark}>
      <div className="px-5 pb-8 space-y-6">
        {/* FLUJO */}
        <div className="space-y-3">
          {sectionLabel('Flujo')}
          <div className="flex gap-2">
            {FLOW_OPTIONS.map(o => (
              <Chip key={o.value} label={o.label} selected={flow === o.value}
                onClick={() => setFlow(o.value)} color="#EF5350" dark={dark} />
            ))}
          </div>
        </div>

        {/* TEXTURA */}
        <div className="space-y-3">
          {sectionLabel('Textura')}
          <div className="flex flex-wrap gap-2">
            {TEXTURE_OPTIONS.map(o => (
              <Chip key={o.value} label={o.label} selected={texture === o.value}
                onClick={() => setTexture(texture === o.value ? null : o.value)} color="#EF5350" dark={dark} />
            ))}
          </div>
        </div>

        {/* SÍNTOMAS */}
        <div className="space-y-3">
          {sectionLabel('Síntomas')}
          <div className="flex flex-wrap gap-2">
            {PAIN_OPTIONS.map(o => (
              <Chip key={o.value} label={o.label} selected={pains.includes(o.value)}
                onClick={() => togglePain(o.value)} color="#E91E63" dark={dark} />
            ))}
          </div>
        </div>

        {/* ESTADO */}
        <div className="space-y-3">
          {sectionLabel('¿Cómo te sientes?')}
          <div className="flex flex-wrap gap-2">
            {STATE_OPTIONS.map(o => (
              <Chip key={o.value} label={o.label} selected={physicalState === o.value}
                onClick={() => setPhysicalState(physicalState === o.value ? null : o.value)} color="#9C27B0" dark={dark} />
            ))}
          </div>
        </div>

        {/* NOTAS */}
        <div className="space-y-3">
          {sectionLabel('Notas')}
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
            placeholder="Opcional..."
            className="w-full rounded-[16px] px-4 py-3 text-sm resize-none outline-none"
            style={{
              backgroundColor: dark ? '#2C2C2E' : '#F2F2F7',
              color: dark ? '#FFFFFF' : '#000000',
              border: 'none',
            }}
          />
        </div>

        {/* GUARDAR */}
        <button
          type="button"
          onClick={handleSave}
          className="w-full py-4 rounded-[22px] font-semibold text-white text-base transition-opacity active:opacity-80"
          style={{ backgroundColor: '#EF5350' }}
        >
          Guardar
        </button>
      </div>
    </BottomSheet>
  );
}
