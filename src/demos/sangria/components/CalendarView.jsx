import React, { useState, useCallback } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  addDays,
  isSameMonth,
  addMonths,
  subMonths,
} from 'date-fns';
import { useSwipeable } from 'react-swipeable';
import { DayCell } from './DayCell';

const WEEKDAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

const MONTHS_ES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
];

function MonthGrid({ date, records, onDayPress, expanded, dark }) {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });

  const days = [];
  let cursor = gridStart;
  while (cursor <= monthEnd || days.length % 7 !== 0) {
    days.push(new Date(cursor));
    cursor = addDays(cursor, 1);
    if (days.length > 42) break;
  }

  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className="w-full">
      {weeks.map((week, wi) => (
        <div key={wi} className="grid grid-cols-7 gap-y-1">
          {week.map((d, di) => {
            const inMonth = isSameMonth(d, date);
            const dateStr = format(d, 'yyyy-MM-dd');
            const record = records[dateStr] || null;
            return (
              <div
                key={di}
                className="flex items-center justify-center"
                style={{
                  height: expanded ? 60 : 54,
                  opacity: inMonth ? 1 : 0,
                  pointerEvents: inMonth ? 'auto' : 'none',
                }}
              >
                {inMonth && (
                  <DayCell
                    dateStr={dateStr}
                    record={record}
                    expanded={expanded}
                    dark={dark}
                    onClick={() => onDayPress(dateStr)}
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export function CalendarView({ records, onDayPress, dark }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [expanded, setExpanded] = useState(false);
  const [sliding, setSliding] = useState(null);

  const goNext = useCallback(() => {
    if (expanded) return;
    setSliding('up');
    setTimeout(() => {
      setCurrentDate(d => addMonths(d, 1));
      setSliding(null);
    }, 200);
  }, [expanded]);

  const goPrev = useCallback(() => {
    if (expanded) return;
    setSliding('down');
    setTimeout(() => {
      setCurrentDate(d => subMonths(d, 1));
      setSliding(null);
    }, 200);
  }, [expanded]);

  const handlers = useSwipeable({
    onSwipedUp: goNext,
    onSwipedDown: goPrev,
    preventScrollOnSwipe: !expanded,
    trackMouse: false,
  });

  const handleCellTap = (dateStr) => {
    if (!expanded) {
      setExpanded(true);
    } else {
      onDayPress(dateStr);
    }
  };

  const handleCollapse = () => setExpanded(false);

  const cardStyle = {
    backgroundColor: dark ? '#1C1C1E' : '#FFFFFF',
    border: expanded ? 'none' : `1px solid ${dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'}`,
    borderRadius: expanded ? 0 : 18,
    boxShadow: expanded ? 'none' : dark ? 'none' : '0 1px 8px rgba(0,0,0,0.07)',
    transition: 'border-radius 0.4s ease, border 0.4s ease, box-shadow 0.4s ease',
  };

  const monthLabel = `${MONTHS_ES[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  return (
    <div
      className={expanded ? 'fixed inset-0 z-30 flex flex-col overflow-auto' : 'mx-4'}
      style={expanded ? { backgroundColor: dark ? '#0A0A0A' : '#F2F2F7' } : {}}
    >
      <div
        className={expanded ? 'flex-1' : ''}
        style={cardStyle}
        {...handlers}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="w-8 h-8" /> {/* Placeholder para equilibrar el header */}

          <button
            onClick={() => setExpanded(!expanded)}
            className="text-base font-bold tracking-tight outline-none active:opacity-60 transition-opacity"
            aria-label={expanded ? "Contraer calendario" : "Expandir calendario"}
          >
            {monthLabel}
          </button>

          {expanded ? (
            <button
              onClick={handleCollapse}
              className="w-8 h-8 flex items-center justify-center rounded-full transition-opacity active:opacity-50"
              style={{ opacity: 0.7 }}
              aria-label="Cerrar calendario"
            >
              ✕
            </button>
          ) : (
            <div className="w-8 h-8" />
          )}
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 px-3 pb-1">
          {WEEKDAYS.map(d => (
            <div
              key={d}
              className="text-center text-xs font-semibold"
              style={{ color: dark ? 'rgba(255,255,255,0.38)' : 'rgba(0,0,0,0.38)' }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Grid with slide transition */}
        <div
          className="px-3 pb-4"
          style={{
            opacity: sliding ? 0 : 1,
            transform: sliding === 'up' ? 'translateY(-10px)' : sliding === 'down' ? 'translateY(10px)' : 'none',
            transition: sliding ? 'opacity 0.2s, transform 0.2s' : 'none',
          }}
        >
          <MonthGrid
            date={currentDate}
            records={records}
            onDayPress={handleCellTap}
            expanded={expanded}
            dark={dark}
          />
        </div>

        {/* Tap to expand hint */}
        {!expanded && (
          <button
            className="w-full py-2 text-center text-xs opacity-30 active:opacity-60"
            onClick={() => setExpanded(true)}
          >
            Toca para expandir
          </button>
        )}
      </div>
    </div>
  );
}
