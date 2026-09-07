import React from 'react';
import { parseISO } from 'date-fns';
import { BottomSheet } from './BottomSheet';
import { getDayType } from '../services/pillService';

const MONTHS_ES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

function MenuItem({ icon, label, sublabel, color, onClick, dark }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-4 py-4 text-left transition-opacity active:opacity-60"
    >
      <span style={{ fontSize: 22, width: 28, textAlign: 'center', flexShrink: 0 }}>{icon}</span>
      <div className="flex-1">
        <div className="text-base font-medium" style={{ color: color || 'inherit' }}>
          {label}
        </div>
        {sublabel && (
          <div className="text-sm" style={{ color: dark ? 'rgba(255,255,255,0.38)' : 'rgba(0,0,0,0.38)' }}>
            {sublabel}
          </div>
        )}
      </div>
    </button>
  );
}

export function DayMenu({
  open, onClose, dateStr, record, dark,
  onTogglePill, onOpenMenstruation, onRemoveMenstruation,
  onOpenRelationship, onRemoveRelationship, onOpenDetails
}) {
  if (!dateStr) return null;

  const date = parseISO(dateStr);
  const day = date.getDate();
  const month = MONTHS_ES[date.getMonth()];
  const dayType = getDayType(dateStr);
  const isActive = dayType === 'active';
  const isRest = dayType === 'rest';

  const hasMenstruation = record?.hasMenstruation;
  const pillTaken = record?.pillTaken;
  const hasRelation = !!record?.relationshipDetail;

  const divider = (
    <div className="h-px" style={{ backgroundColor: dark ? '#3A3A3C' : '#F2F2F7' }} />
  );

  return (
    <BottomSheet open={open} onClose={onClose} dark={dark}>
      <div className="px-5 pb-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-xl font-bold">{day} de {month}</h2>
          {isRest && (
            <span
              className="px-3 py-1 rounded-[22px] text-sm font-semibold text-white"
              style={{ backgroundColor: '#EF5350' }}
            >
              Descanso
            </span>
          )}
        </div>

        <div className="mt-2">
          {/* Detalles */}
          <MenuItem
            icon="📋"
            label="Ver detalles"
            color={dark ? '#64D2FF' : '#007AFF'}
            dark={dark}
            onClick={() => { onOpenDetails(); }}
          />
          {divider}

          {/* Pastilla */}
          {isActive && (
            <>
              <MenuItem
                icon={pillTaken ? '💊' : '⬜'}
                label={pillTaken ? 'Pastilla tomada' : 'Marcar pastilla como tomada'}
                color="#E91E63"
                dark={dark}
                onClick={() => { onTogglePill(); onClose(); }}
              />
              {divider}
            </>
          )}

          {/* Menstruación */}
          <MenuItem
            icon="🩸"
            label={hasMenstruation ? 'Editar menstruación' : 'Registrar menstruación'}
            color="#EF5350"
            dark={dark}
            onClick={() => { onOpenMenstruation(); }}
          />

          {hasMenstruation && (
            <>
              {divider}
              <MenuItem
                icon="✕"
                label="Quitar menstruación"
                color={dark ? 'rgba(255,255,255,0.38)' : 'rgba(0,0,0,0.38)'}
                dark={dark}
                onClick={() => { onRemoveMenstruation(); }}
              />
            </>
          )}

          {divider}

          {/* Relaciones */}
          <MenuItem
            icon="⭐"
            label={hasRelation ? 'Editar relaciones' : 'Registrar relaciones'}
            dark={dark}
            onClick={() => { onOpenRelationship(); }}
          />

          {hasRelation && (
            <>
              {divider}
              <MenuItem
                icon="✕"
                label="Quitar relaciones"
                color={dark ? 'rgba(255,255,255,0.38)' : 'rgba(0,0,0,0.38)'}
                dark={dark}
                onClick={() => { onRemoveRelationship(); }}
              />
            </>
          )}
        </div>
      </div>
    </BottomSheet>
  );
}
