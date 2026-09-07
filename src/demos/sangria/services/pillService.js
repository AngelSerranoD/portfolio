import { differenceInDays, parseISO } from 'date-fns';
import { getPillConfig } from './databaseService';

export const getDayType = (dateStr) => {
  const config = getPillConfig();
  if (!config.blisterStartDate) return 'beforeStart';
  
  const start = parseISO(config.blisterStartDate);
  const current = parseISO(dateStr);
  const diff = differenceInDays(current, start);
  
  if (diff < 0) return 'beforeStart';
  
  const cycleDays = config.activeDays + config.restDays;
  const pos = diff % cycleDays;
  
  if (pos < config.activeDays) return 'active';
  return 'rest';
};

export const getPillNumber = (dateStr) => {
  const config = getPillConfig();
  if (!config.blisterStartDate) return null;
  
  const start = parseISO(config.blisterStartDate);
  const current = parseISO(dateStr);
  const diff = differenceInDays(current, start);
  
  if (diff < 0) return null;
  
  const cycleDays = config.activeDays + config.restDays;
  const pos = diff % cycleDays;
  
  if (pos < config.activeDays) return pos + 1;
  return null;
};

export const daysUntilNextRest = () => {
  const config = getPillConfig();
  if (!config.blisterStartDate) return null;

  const start = parseISO(config.blisterStartDate);
  const current = new Date();
  current.setHours(0,0,0,0);
  
  const diff = differenceInDays(current, start);
  if (diff < 0) return null;
  
  const cycleDays = config.activeDays + config.restDays;
  const pos = diff % cycleDays;
  
  if (pos < config.activeDays) {
    return config.activeDays - pos;
  }
  return 0; // Already in rest
};
