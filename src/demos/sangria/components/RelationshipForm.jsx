import React, { useState, useEffect } from 'react';
import { BottomSheet } from './BottomSheet';

function Toggle({ label, checked, onChange, dark }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-base">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="relative inline-flex items-center rounded-full shrink-0"
        style={{
          width: 51, height: 31,
          backgroundColor: checked ? '#E91E63' : dark ? '#3A3A3C' : '#E5E5EA',
          transition: 'background-color 0.2s ease',
        }}
      >
        <span
          className="inline-block bg-white rounded-full shadow-md"
          style={{
            width: 27, height: 27,
            transform: checked ? 'translateX(22px)' : 'translateX(2px)',
            transition: 'transform 0.2s ease',
          }}
        />
      </button>
    </div>
  );
}

export function RelationshipForm({ open, onClose, initialDetail, onSave, dark }) {
  const [oralSex, setOralSex] = useState(false);
  const [withProtection, setWithProtection] = useState(true);
  const [internalEjaculation, setInternalEjaculation] = useState(false);
  const [morningAfterPill, setMorningAfterPill] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (open) {
      setOralSex(initialDetail?.oralSex || false);
      setWithProtection(initialDetail?.withProtection ?? true);
      setInternalEjaculation(initialDetail?.internalEjaculation || false);
      setMorningAfterPill(initialDetail?.morningAfterPill || false);
      setNotes(initialDetail?.notes || '');
    }
  }, [open, initialDetail]);

  const handleProtection = (val) => {
    setWithProtection(val);
    if (val) setInternalEjaculation(false);
  };

  const handleInternalEjac = (val) => {
    setInternalEjaculation(val);
    if (val) setWithProtection(false);
  };

  const handleSave = () => {
    onSave({ oralSex, withProtection, internalEjaculation, morningAfterPill, notes: notes.trim() || null });
    onClose();
  };

  const divider = <div className="h-px" style={{ backgroundColor: dark ? '#3A3A3C' : '#E5E5EA' }} />;

  return (
    <BottomSheet open={open} onClose={onClose} title="Relaciones" dark={dark}>
      <div className="px-5 pb-8 space-y-4">
        {/* Toggles card */}
        <div
          className="rounded-[18px] px-4"
          style={{ backgroundColor: dark ? '#2C2C2E' : '#F9F9F9' }}
        >
          <Toggle label="Sexo oral" checked={oralSex} onChange={setOralSex} dark={dark} />
          {divider}
          <Toggle label="Con protección" checked={withProtection} onChange={handleProtection} dark={dark} />
          {divider}
          <Toggle label="Eyaculación interna" checked={internalEjaculation} onChange={handleInternalEjac} dark={dark} />
          {divider}
          <Toggle label="Pastilla del día después" checked={morningAfterPill} onChange={setMorningAfterPill} dark={dark} />
        </div>

        {/* Notas */}
        <div className="space-y-2">
          <span
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: dark ? 'rgba(255,255,255,0.38)' : 'rgba(0,0,0,0.38)' }}
          >
            Notas
          </span>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
            placeholder="Opcional..."
            className="w-full rounded-[16px] px-4 py-3 text-sm resize-none outline-none block"
            style={{
              backgroundColor: dark ? '#2C2C2E' : '#F2F2F7',
              color: dark ? '#FFFFFF' : '#000000',
              border: 'none',
            }}
          />
        </div>

        {/* Guardar */}
        <button
          type="button"
          onClick={handleSave}
          className="w-full py-4 rounded-[22px] font-semibold text-base transition-opacity active:opacity-80"
          style={{
            backgroundColor: dark ? '#FFFFFF' : '#000000',
            color: dark ? '#000000' : '#FFFFFF',
          }}
        >
          Guardar
        </button>
      </div>
    </BottomSheet>
  );
}
