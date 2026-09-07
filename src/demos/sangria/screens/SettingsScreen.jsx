import React, { useState, useEffect } from 'react';
import { getPillConfig, savePillConfig } from '../services/databaseService';
import { Snackbar } from '../components/Snackbar';

const PRESETS = [
  { label: '21+7', active: 21, rest: 7 },
  { label: '24+4', active: 24, rest: 4 },
  { label: '24+3', active: 24, rest: 3 },
  { label: '28+0', active: 28, rest: 0 },
];

function Stepper({ value, min, max, onChange, label, dark }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-base">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-lg transition-opacity active:opacity-60"
          style={{ backgroundColor: dark ? '#3A3A3C' : '#E5E5EA' }}
          disabled={value <= min}
        >
          −
        </button>
        <span className="w-8 text-center font-semibold text-lg">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-lg transition-opacity active:opacity-60"
          style={{ backgroundColor: dark ? '#3A3A3C' : '#E5E5EA' }}
          disabled={value >= max}
        >
          +
        </button>
      </div>
    </div>
  );
}

function PresetChip({ label, selected, onClick, dark }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '9px 18px',
        borderRadius: 22,
        fontSize: 14,
        fontWeight: 500,
        border: selected ? '1.5px solid #E91E63' : '1.5px solid transparent',
        backgroundColor: selected ? 'rgba(233,30,99,0.12)' : dark ? '#2C2C2E' : '#F2F2F7',
        color: selected ? '#E91E63' : 'inherit',
        transition: 'all 0.15s ease',
      }}
    >
      {label}
    </button>
  );
}

export function SettingsScreen({ dark, onBack, onSaved }) {
  const [startDate, setStartDate] = useState('');
  const [activeDays, setActiveDays] = useState(21);
  const [restDays, setRestDays] = useState(7);
  const [snack, setSnack] = useState({ open: false, message: '' });

  useEffect(() => {
    const config = getPillConfig();
    if (config.blisterStartDate) setStartDate(config.blisterStartDate);
    setActiveDays(config.activeDays);
    setRestDays(config.restDays);
  }, []);

  const handlePreset = (preset) => {
    setActiveDays(preset.active);
    setRestDays(preset.rest);
  };

  const handleSave = () => {
    savePillConfig({ blisterStartDate: startDate, activeDays, restDays });
    setSnack({ open: true, message: 'Configuración guardada' });
    setTimeout(() => onSaved(), 1200);
  };

  const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const sectionLabel = (text) => (
    <span
      className="text-xs font-semibold tracking-widest uppercase"
      style={{ color: dark ? 'rgba(255,255,255,0.38)' : 'rgba(0,0,0,0.38)' }}
    >
      {text}
    </span>
  );

  const cardBg = dark ? '#1C1C1E' : '#FFFFFF';
  const divider = <div className="h-px" style={{ backgroundColor: dark ? '#3A3A3C' : '#F2F2F7' }} />;

  return (
    <div
      className="h-full flex flex-col overflow-hidden"
      style={{ backgroundColor: dark ? '#0A0A0A' : '#F2F2F7' }}
    >
      {/* AppBar */}
      <div
        className="flex items-center gap-3 px-4"
        style={{ paddingTop: `max(env(safe-area-inset-top, 0px), 16px)`, paddingBottom: 12 }}
      >
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full transition-opacity active:opacity-60 text-2xl"
          aria-label="Volver"
        >
          ‹
        </button>
        <h1 className="text-xl font-bold flex-1">Configuración</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto overscroll-contain no-scrollbar px-4 pb-8 space-y-5">

        {/* Inicio del blíster */}
        <div className="space-y-2">
          {sectionLabel('Inicio del blíster')}
          <div className="rounded-[18px] px-4 py-1" style={{ backgroundColor: cardBg }}>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <span style={{ fontSize: 20 }}>💊</span>
                <div>
                  <p className="text-base font-medium">Fecha de inicio</p>
                  <p className="text-xs" style={{ color: dark ? 'rgba(255,255,255,0.38)' : 'rgba(0,0,0,0.38)' }}>
                    Día 1 de tu blíster actual.
                  </p>
                </div>
              </div>
              <input
                type="date"
                value={startDate}
                min="2020-01-01"
                max={maxDate}
                onChange={e => setStartDate(e.target.value)}
                className="rounded-lg px-2 py-1 text-sm font-medium outline-none"
                style={{
                  backgroundColor: dark ? '#3A3A3C' : '#F2F2F7',
                  color: startDate ? 'inherit' : '#E91E63',
                  border: 'none',
                  colorScheme: dark ? 'dark' : 'light',
                }}
              />
            </div>
          </div>
        </div>

        {/* Ciclo de pastillas */}
        <div className="space-y-2">
          {sectionLabel('Ciclo de pastillas')}
          <div className="rounded-[18px] px-4 py-2" style={{ backgroundColor: cardBg }}>
            <Stepper label="Días activos" value={activeDays} min={1} max={28} onChange={setActiveDays} dark={dark} />
            {divider}
            <Stepper label="Días de descanso" value={restDays} min={0} max={14} onChange={setRestDays} dark={dark} />
            <p
              className="text-sm py-3"
              style={{ color: dark ? 'rgba(255,255,255,0.38)' : 'rgba(0,0,0,0.38)' }}
            >
              Ciclo total: {activeDays + restDays} días ({activeDays} + {restDays})
            </p>
          </div>
        </div>

        {/* Presets */}
        <div className="space-y-2">
          {sectionLabel('Presets comunes')}
          <div className="flex flex-wrap gap-2">
            {PRESETS.map(p => (
              <PresetChip
                key={p.label}
                label={p.label}
                selected={activeDays === p.active && restDays === p.rest}
                onClick={() => handlePreset(p)}
                dark={dark}
              />
            ))}
          </div>
        </div>

        {/* Save button */}
        <button
          type="button"
          onClick={handleSave}
          disabled={!startDate}
          className="w-full py-4 rounded-[22px] font-semibold text-white text-base transition-opacity"
          style={{ backgroundColor: '#E91E63', opacity: startDate ? 1 : 0.4 }}
        >
          Guardar
        </button>
      </div>

      <Snackbar
        message={snack.message}
        open={snack.open}
        onClose={() => setSnack(s => ({ ...s, open: false }))}
      />
    </div>
  );
}
