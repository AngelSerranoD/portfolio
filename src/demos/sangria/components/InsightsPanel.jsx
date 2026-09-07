import React from 'react';
import { format } from 'date-fns';
import { getInsights } from '../services/insightsService';

export function InsightsPanel({ records, dark, refreshKey }) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const insights = getInsights(today);

  if (!insights || insights.length === 0) return null;

  return (
    <div
      className="mx-4 rounded-[18px] overflow-hidden"
      style={{
        border: `1px solid ${dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'}`,
        backgroundColor: dark ? '#1C1C1E' : '#FFFFFF',
        boxShadow: dark ? 'none' : '0 1px 8px rgba(0,0,0,0.07)',
      }}
    >
      <div className="px-4 pt-4 pb-1">
        <span
          className="text-xs font-semibold tracking-widest uppercase"
          style={{ color: dark ? 'rgba(255,255,255,0.38)' : 'rgba(0,0,0,0.38)' }}
        >
          Hoy
        </span>
      </div>
      <div className="px-4 pb-4 space-y-3 mt-2">
        {insights.map((insight, i) => (
          <div key={i} className="flex items-start">
            <p
              className="text-sm leading-relaxed flex-1"
              style={{ whiteSpace: 'pre-line' }}
            >
              {insight.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
