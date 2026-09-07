import React from 'react';
import { BottomSheet } from './BottomSheet';
import { getPillNumber, getDayType } from '../services/pillService';
import { getPillConfig } from '../services/databaseService';
import { format } from 'date-fns';

export function PillPrompt({ open, onClose, onConfirm, dark }) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const pillNum = getPillNumber(today);
  const config = getPillConfig();

  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="px-6 pb-10 flex flex-col items-center gap-5 pt-2">
        <img src="/pastilla_rosa.svg" width={56} height={56} alt="Pastilla" />
        <div className="text-center">
          <p className="text-xl font-bold">¿Has tomado la pastilla hoy?</p>
          {pillNum && (
            <p
              className="text-sm mt-1"
              style={{ color: dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}
            >
              Día {pillNum} de {config.activeDays}
            </p>
          )}
        </div>
        <div className="flex gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-4 rounded-[22px] font-semibold border-2 transition-opacity active:opacity-70"
            style={{
              borderColor: '#E91E63',
              color: '#E91E63',
              backgroundColor: 'transparent',
            }}
          >
            Aún no
          </button>
          <button
            type="button"
            onClick={() => { onConfirm(); onClose(); }}
            className="flex-1 py-4 rounded-[22px] font-semibold text-white transition-opacity active:opacity-70"
            style={{ backgroundColor: '#E91E63' }}
          >
            Sí, tomada
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}
