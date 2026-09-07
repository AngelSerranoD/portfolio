import React from 'react';
import { parseISO } from 'date-fns';
import { BottomSheet } from './BottomSheet';
import { getDayType } from '../services/pillService';

const MONTHS_ES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

const Section = ({ title, dark, children }) => (
  <div className="mb-6">
    <h3 className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: dark ? 'rgba(255,255,255,0.38)' : 'rgba(0,0,0,0.38)' }}>
      {title}
    </h3>
    <div className="rounded-[18px] p-4" style={{ backgroundColor: dark ? '#2C2C2E' : '#FFFFFF' }}>
      {children}
    </div>
  </div>
);

const InfoRow = ({ label, value, dark }) => {
  if (!value) return null;
  return (
    <div className="flex justify-between py-2 border-b last:border-0" style={{ borderColor: dark ? '#3A3A3C' : '#F2F2F7' }}>
      <span className="text-sm" style={{ color: dark ? '#EBEBF5' : '#1C1C1E' }}>{label}</span>
      <span className="text-sm font-medium" style={{ color: dark ? '#FFFFFF' : '#000000', textAlign: 'right', maxWidth: '65%', wordBreak: 'break-word' }}>
        {value}
      </span>
    </div>
  );
};

export function DayDetailsModal({ open, onClose, dateStr, record, dark }) {
  if (!dateStr) return null;

  const date = parseISO(dateStr);
  const day = date.getDate();
  const month = MONTHS_ES[date.getMonth()];
  const dayType = getDayType(dateStr);
  
  const hasMenstruation = record?.hasMenstruation;
  const pillTaken = record?.pillTaken;
  const hasRelation = !!record?.relationshipDetail;
  const menstruationDetail = record?.menstruationDetail;
  const relationshipDetail = record?.relationshipDetail;

  const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

  return (
    <BottomSheet open={open} onClose={onClose} title={`Detalles: ${day} de ${month}`} dark={dark}>
      <div className="px-5 pb-8">
        
        {/* Pastilla Section */}
        <Section title="Pastilla Anticonceptiva" dark={dark}>
          {dayType === 'active' ? (
             <InfoRow label="Estado" value={pillTaken ? '✅ Tomada' : '❌ No tomada'} dark={dark} />
          ) : dayType === 'rest' ? (
             <InfoRow label="Estado" value="💤 Día de descanso" dark={dark} />
          ) : (
             <InfoRow label="Estado" value="Sin configurar" dark={dark} />
          )}
        </Section>

        {/* Menstruación Section */}
        {hasMenstruation ? (
          <Section title="Menstruación" dark={dark}>
            <InfoRow label="Flujo" value={capitalize(menstruationDetail?.flow) || 'Normal'} dark={dark} />
            <InfoRow label="Textura" value={capitalize(menstruationDetail?.texture)} dark={dark} />
            <InfoRow label="Síntomas" value={menstruationDetail?.pains?.length ? menstruationDetail.pains.map(capitalize).join(', ') : 'Ninguno'} dark={dark} />
            <InfoRow label="Estado físico" value={capitalize(menstruationDetail?.physicalState)} dark={dark} />
            <InfoRow label="Notas" value={menstruationDetail?.notes} dark={dark} />
          </Section>
        ) : (
          <Section title="Menstruación" dark={dark}>
            <InfoRow label="Estado" value="No registrada" dark={dark} />
          </Section>
        )}

        {/* Relaciones Section */}
        {hasRelation ? (
          <Section title="Relaciones" dark={dark}>
            <InfoRow label="Protección" value={relationshipDetail?.withProtection ? 'Sí' : 'No'} dark={dark} />
            <InfoRow label="Sexo oral" value={relationshipDetail?.oralSex ? 'Sí' : 'No'} dark={dark} />
            <InfoRow label="Eyaculación interna" value={relationshipDetail?.internalEjaculation ? 'Sí' : 'No'} dark={dark} />
            <InfoRow label="Pastilla día después" value={relationshipDetail?.morningAfterPill ? 'Sí' : 'No'} dark={dark} />
            <InfoRow label="Notas" value={relationshipDetail?.notes} dark={dark} />
          </Section>
        ) : (
          <Section title="Relaciones" dark={dark}>
            <InfoRow label="Estado" value="No registradas" dark={dark} />
          </Section>
        )}
      </div>
    </BottomSheet>
  );
}
