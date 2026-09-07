import { getRecord, getRecentRecords } from './databaseService';
import { getDayType, getPillNumber } from './pillService';
import { format, subDays, parseISO, differenceInDays } from 'date-fns';

function getForecastMessage(detail) {
  if (!detail) return null;
  const { pains = [], physicalState } = detail;
  const isCansada = physicalState === 'cansada';
  const isHinchada = physicalState === 'hinchada';
  const hasAbdominal = pains.includes('abdominal');
  const hasEspalda = pains.includes('espalda');
  const hasCabeza = pains.includes('cabeza');
  const hasPechos = pains.includes('pechos');
  const hasDiarrea = pains.includes('diarrea');
  const hasEstrenimiento = pains.includes('estreñimiento');

  if (pains.length >= 3 && (isCansada || isHinchada)) {
    return 'Hoy te sientes muy cargada y con inflamación general. Podrías darte tregua: baño caliente, manta y descanso.';
  }
  if (pains.length >= 3) {
    return 'Hoy hay bastante inflamación, aunque aguantas mejor. Hidratación y calor local pueden ayudar.';
  }
  if ((hasAbdominal || hasEspalda) && isCansada) {
    return 'Hoy te notas con cólicos y cansancio. El calor en la zona lumbar y descansar son tu mejor aliado.';
  }
  if ((hasAbdominal || hasEspalda) && isHinchada) {
    return 'Hoy hay calambres con hinchazón. Evita sal y bebidas con gas, e hidratate bien.';
  }
  if (hasAbdominal || hasEspalda) {
    return 'Hoy hay calambres, pero mantienes buena energía. ¡Sigue así!';
  }
  if ((hasCabeza || hasPechos) && isCansada) {
    return 'Hoy te notas con tensión y fatiga. Descansa lo que puedas y evita pantallas si tienes jaqueca.';
  }
  if ((hasCabeza || hasPechos) && isHinchada) {
    return 'Hoy hay tensión con retención de líquidos. Infusiones de hinojo o jengibre pueden ayudar.';
  }
  if (hasCabeza || hasPechos) {
    return 'Hoy hay tensión hormonal leve. Bebe agua y tómatelo con calma.';
  }
  if (hasDiarrea && isCansada) {
    return 'Hoy el cuerpo trabaja mucho internamente y estás cansada. Dieta blanda y descanso.';
  }
  if (hasDiarrea || hasEstrenimiento) {
    return 'El sistema digestivo está algo revuelto hoy. Comidas ligeras y fáciles de digerir.';
  }
  if (isCansada || isHinchada) {
    return 'Hoy no hay dolor claro, pero te sientes más baja o hinchada. Escucha a tu cuerpo.';
  }
  return 'Hoy te sientes bastante equilibrada para ser día de regla. ¡Bien!';
}

/**
 * Find the start date of a menstruation episode that includes the given date.
 * Walks backwards until we find a day without menstruation.
 */
function findCycleStartForDate(dateStr) {
  let d = parseISO(dateStr);
  for (let i = 0; i < 14; i++) {
    const prev = format(subDays(d, 1), 'yyyy-MM-dd');
    const prevRec = getRecord(prev);
    if (!prevRec?.hasMenstruation) break;
    d = subDays(d, 1);
  }
  return format(d, 'yyyy-MM-dd');
}

export function getInsights(dateStr) {
  const insights = [];
  const dayType = getDayType(dateStr);
  const record = getRecord(dateStr);

  // ── Pill insight ──────────────────────────────────────────────────────────
  if (dayType === 'active') {
    const pillNum = getPillNumber(dateStr);
    if (record?.pillTaken) {
      insights.push({ emoji: '✅', message: `Pastilla tomada. ¡Bien hecho!${pillNum ? ` (día ${pillNum})` : ''}`, type: 'pill' });
    } else {
      insights.push({ emoji: '💊', message: `No olvides tomar la pastilla hoy.${pillNum ? ` (día ${pillNum})` : ''}`, type: 'pill' });
    }
  } else if (dayType === 'rest') {
    insights.push({ emoji: '🔴', message: 'Día de descanso. Puede que tengas el período.', type: 'menstruation' });
  }

  // ── Forecast from today's menstruation detail ─────────────────────────────
  if (record?.hasMenstruation && record?.menstruationDetail) {
    const msg = getForecastMessage(record.menstruationDetail);
    if (msg) {
      insights.push({ emoji: '🩸', message: msg, type: 'forecast' });
    }
  }

  // ── Forecast from yesterday (if no menstruation today) ────────────────────
  if (!record?.hasMenstruation) {
    const yesterday = format(subDays(parseISO(dateStr), 1), 'yyyy-MM-dd');
    const yesterdayRecord = getRecord(yesterday);
    if (yesterdayRecord?.hasMenstruation && yesterdayRecord?.menstruationDetail) {
      const msg = getForecastMessage(yesterdayRecord.menstruationDetail);
      const flowLabel = yesterdayRecord.menstruationDetail.flow || '';
      if (msg) {
        insights.push({
          emoji: '🔮',
          message: `Ayer marcaste flujo ${flowLabel}. Hoy podrías sentir algo parecido.\n${msg}`,
          type: 'forecast'
        });
      }
    }
  }

  // ── Prediction by cycle day (historical) ─────────────────────────────────
  if (record?.hasMenstruation) {
    const cycleStart = findCycleStartForDate(dateStr);
    const cycleDay = differenceInDays(parseISO(dateStr), parseISO(cycleStart));

    const recentRecords = getRecentRecords(365);
    // Find historic records that also had menstruation at the same cycle day
    const historicSameDayRecords = recentRecords.filter(r => {
      if (!r.hasMenstruation || r.date === dateStr) return false;
      const rCycleStart = findCycleStartForDate(r.date);
      const rCycleDay = differenceInDays(parseISO(r.date), parseISO(rCycleStart));
      return rCycleDay === cycleDay;
    });

    if (historicSameDayRecords.length >= 2) {
      // Find dominant physical state
      const states = historicSameDayRecords
        .map(r => r.menstruationDetail?.physicalState)
        .filter(Boolean);
      const stateCount = states.reduce((acc, s) => { acc[s] = (acc[s] || 0) + 1; return acc; }, {});
      const dominantState = Object.entries(stateCount).sort((a, b) => b[1] - a[1])[0]?.[0];

      // Find most common pains
      const allPains = historicSameDayRecords.flatMap(r => r.menstruationDetail?.pains || []);
      const painCount = allPains.reduce((acc, p) => { acc[p] = (acc[p] || 0) + 1; return acc; }, {});
      const commonPains = Object.entries(painCount)
        .filter(([, c]) => c >= Math.ceil(historicSameDayRecords.length / 2))
        .map(([p]) => p);

      const stateMap = { hinchada: 'hinchada', normal: 'bien', delgada: 'ligera', cansada: 'cansada', energica: 'con energía' };
      const stateLabel = dominantState ? stateMap[dominantState] || dominantState : 'similar';
      const painLabel = commonPains.length > 0 ? ` con molestias de ${commonPains.join(', ')}` : '';
      insights.push({
        emoji: '📈',
        message: `Histórico: en el día ${cycleDay + 1} de tu ciclo sueles sentirte ${stateLabel}${painLabel}.`,
        type: 'prediction'
      });
    }
  }

  // ── Weekly historical signal ──────────────────────────────────────────────
  const todayDate = parseISO(dateStr);
  const todayWeekday = todayDate.getDay();
  const recentRecords = getRecentRecords(90);
  const sameWeekdayWithPain = recentRecords.filter(r => {
    if (!r.hasMenstruation || !r.menstruationDetail?.pains?.length) return false;
    if (r.date === dateStr) return false;
    const d = parseISO(r.date);
    if (d.getDay() !== todayWeekday) return false;
    return r.menstruationDetail.pains.includes('abdominal') || r.menstruationDetail.pains.includes('cabeza');
  });

  if (sameWeekdayWithPain.length >= 2) {
    insights.push({ emoji: '🌡️', message: 'Sueles tener molestias este día de la semana.', type: 'history' });
  }

  return insights;
}
