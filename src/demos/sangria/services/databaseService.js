import { createDayRecord } from '../models/dayRecord';

export const getRecord = (dateStr) => {
  try {
    const data = localStorage.getItem('sangria_records');
    const records = data ? JSON.parse(data) : {};
    return records[dateStr] || null;
  } catch (e) {
    return null;
  }
};

export const saveRecord = (record) => {
  try {
    const data = localStorage.getItem('sangria_records');
    const records = data ? JSON.parse(data) : {};
    records[record.date] = record;
    localStorage.setItem('sangria_records', JSON.stringify(records));
  } catch (e) {
    console.error(e);
  }
};

export const togglePill = (dateStr) => {
  let record = getRecord(dateStr) || createDayRecord(dateStr);
  record.pillTaken = !record.pillTaken;
  saveRecord(record);
  return record;
};

export const saveMenstruation = (dateStr, detail) => {
  let record = getRecord(dateStr) || createDayRecord(dateStr);
  record.hasMenstruation = true;
  record.menstruationDetail = detail;
  saveRecord(record);
  return record;
};

export const saveRelationship = (dateStr, detail) => {
  let record = getRecord(dateStr) || createDayRecord(dateStr);
  record.relationshipDetail = detail;
  saveRecord(record);
  return record;
};

export const removeMenstruation = (dateStr) => {
  let record = getRecord(dateStr);
  if (record) {
    record.hasMenstruation = false;
    record.menstruationDetail = null;
    saveRecord(record);
  }
};

export const removeRelationship = (dateStr) => {
  let record = getRecord(dateStr);
  if (record) {
    record.relationshipDetail = null;
    saveRecord(record);
  }
};

/**
 * Returns all records from the last N calendar days (not limited to N records).
 * This is what the weekly historical insight needs.
 */
export const getRecentRecords = (days) => {
  try {
    const data = localStorage.getItem('sangria_records');
    const records = data ? JSON.parse(data) : {};
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    cutoff.setHours(0, 0, 0, 0);

    return Object.values(records)
      .filter(r => new Date(r.date) >= cutoff)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch {
    return [];
  }
};

export const getPillConfig = () => {
  return {
    blisterStartDate: localStorage.getItem('sangria_pill_start') || null,
    activeDays: parseInt(localStorage.getItem('sangria_pill_active') || '21', 10),
    restDays: parseInt(localStorage.getItem('sangria_pill_rest') || '7', 10),
  };
};

export const savePillConfig = (config) => {
  if (config.blisterStartDate) localStorage.setItem('sangria_pill_start', config.blisterStartDate);
  localStorage.setItem('sangria_pill_active', config.activeDays.toString());
  localStorage.setItem('sangria_pill_rest', config.restDays.toString());
};
