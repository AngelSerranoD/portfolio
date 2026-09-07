import React from 'react';
import { format, isToday, parseISO } from 'date-fns';
import { getDayType } from '../services/pillService';

export function DayCell({ dateStr, record, onClick, expanded, dark }) {
  const date = parseISO(dateStr);
  const dayNum = format(date, 'd');
  const todayFlag = isToday(date);
  const dayType = getDayType(dateStr);
  // Use prop instead of DOM class (consistent across renders)
  const isDark = dark ?? document.body.classList.contains('dark');

  const hasMenstruation = record?.hasMenstruation;
  const pillTaken = record?.pillTaken;
  const hasRelation = !!record?.relationshipDetail;
  const flow = record?.menstruationDetail?.flow;
  const isActive = dayType === 'active';
  const isRest = dayType === 'rest';

  let cellBg, cellBorder;

  if (hasMenstruation) {
    cellBg = isDark ? '#5E1E1E' : '#FFCDD2';
    cellBorder = isDark ? 'rgba(255,127,127,0.75)' : '#D33A3A';
  } else if (isActive && pillTaken) {
    cellBg = isDark ? '#2C313A' : '#E4E7ED';
    cellBorder = 'rgba(139,147,163,0.5)';
  } else if (isActive && !pillTaken) {
    cellBg = isDark ? '#3A404A' : '#CDD2DB';
    cellBorder = isDark ? 'rgba(176,183,195,0.75)' : '#68707F';
  } else if (isRest) {
    cellBg = isDark ? '#1B2A40' : '#DCE9FF';
    cellBorder = isDark ? 'rgba(141,185,255,0.75)' : 'rgba(45,108,223,0.8)';
  } else {
    cellBg = isDark ? '#1C1C1E' : '#F9F9F9';
    cellBorder = 'transparent';
  }

  const cellWidth = expanded ? 44 : 40;
  const cellHeight = expanded ? 56 : 50;
  const drops = flow === 'poca' ? 1 : flow === 'normal' ? 2 : flow === 'mucha' ? 3 : 0;

  return (
    <button
      onClick={onClick}
      className="relative flex items-center justify-center rounded-[10px] select-none transition-opacity active:opacity-70"
      style={{ width: cellWidth, height: cellHeight, margin: 'auto' }}
      aria-label={`Día ${dayNum}`}
    >
      {/* Cell background */}
      <span
        className="absolute inset-0 rounded-[10px]"
        style={{ backgroundColor: cellBg, border: `1.4px solid ${cellBorder}` }}
      />
      {/* Today ring */}
      {todayFlag && (
        <span
          className="absolute inset-0 rounded-[10px]"
          style={{ border: `2px solid ${isDark ? '#FFFFFF' : '#000000'}` }}
        />
      )}

      {/* Day number */}
      <span
        className="relative z-10 font-medium leading-none pb-[4px]"
        style={{ fontSize: expanded ? 14 : 13 }}
      >
        {dayNum}
      </span>

      {/* Top-left pill indicator */}
      {isActive && (
        <span className="absolute top-[4px] left-[5px] z-10">
          {pillTaken ? (
            <img src="/pastilla_rosa.svg" width={12} height={12} alt="" />
          ) : (
            <span
              className="block rounded-full"
              style={{ width: 8, height: 8, backgroundColor: isDark ? '#6F7787' : '#D3D8E0' }}
            />
          )}
        </span>
      )}

      {/* Top-right relationship star */}
      {hasRelation && (
        <span
          className="absolute top-[5px] right-[6px] z-10 leading-none"
          style={{ fontSize: 12, color: '#FFC107' }}
        >
          ★
        </span>
      )}

      {/* Bottom-center menstruation drops */}
      {drops > 0 && (
        <span className="absolute bottom-[4px] left-0 right-0 flex justify-center gap-[3px] z-10">
          {Array.from({ length: drops }).map((_, i) => (
            <span
              key={i}
              style={{
                width: drops === 1 ? 11 : 9,
                height: drops === 1 ? 11 : 9,
                borderRadius: '0 50% 50% 50%',
                transform: 'rotate(45deg)',
                backgroundColor: '#EF5350',
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
          ))}
        </span>
      )}
    </button>
  );
}
