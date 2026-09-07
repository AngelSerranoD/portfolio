import React, { useState, useCallback, useEffect } from 'react';
import { Sun, Moon, Settings } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { CalendarView } from '../components/CalendarView';
import { InsightsPanel } from '../components/InsightsPanel';
import { DayMenu } from '../components/DayMenu';
import { DayDetailsModal } from '../components/DayDetailsModal';
import { MenstruationForm } from '../components/MenstruationForm';
import { RelationshipForm } from '../components/RelationshipForm';
import { PillPrompt } from '../components/PillPrompt';
import { Snackbar } from '../components/Snackbar';
import {
  getRecord,
  togglePill as dbTogglePill,
  saveMenstruation,
  saveRelationship,
  removeMenstruation as dbRemoveMenstruation,
  removeRelationship as dbRemoveRelationship,
  getPillConfig,
} from '../services/databaseService';
import { getDayType } from '../services/pillService';

function getGreeting() {
  const h = new Date().getHours();
  if (h >= 6 && h < 14) return 'Buenos días';   // 6–13h
  if (h >= 14 && h < 21) return 'Buenas tardes'; // 14–20h
  return 'Buenas noches';                         // resto
}

function loadAllRecords() {
  try {
    const data = localStorage.getItem('sangria_records');
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function MainScreen({ dark, onToggleTheme, onOpenSettings }) {
  const [records, setRecords] = useState(loadAllRecords);
  const [refreshKey, setRefreshKey] = useState(0);

  const [selectedDate, setSelectedDate] = useState(null);
  const [dayMenuOpen, setDayMenuOpen] = useState(false);
  const [menstruationOpen, setMenstruationOpen] = useState(false);
  const [relationshipOpen, setRelationshipOpen] = useState(false);
  const [pillPromptOpen, setPillPromptOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: '' });

  const refresh = () => {
    setRecords(loadAllRecords());
    setRefreshKey(k => k + 1);
  };

  const showSnack = (message) => setSnack({ open: true, message });

  // Show pill prompt on load if applicable
  useEffect(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const config = getPillConfig();
    if (!config.blisterStartDate) return;
    const dayType = getDayType(today);
    if (dayType !== 'active') return;
    const todayRecord = getRecord(today);
    if (!todayRecord?.pillTaken) {
      const timer = setTimeout(() => setPillPromptOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDayPress = (dateStr) => {
    setSelectedDate(dateStr);
    setDayMenuOpen(true);
  };

  const handleTogglePill = () => {
    if (!selectedDate) return;
    dbTogglePill(selectedDate);
    refresh();
  };

  const handleTodayPill = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    dbTogglePill(today);
    refresh();
  };

  const handleSaveMenstruation = (detail) => {
    if (!selectedDate) return;
    const isNew = !getRecord(selectedDate)?.hasMenstruation;
    saveMenstruation(selectedDate, detail);

    if (isNew) {
      for (let i = 1; i <= 3; i++) {
        const nextDate = format(addDays(new Date(selectedDate + 'T12:00:00'), i), 'yyyy-MM-dd');
        const nextRecord = getRecord(nextDate);
        if (!nextRecord?.hasMenstruation) {
          saveMenstruation(nextDate, null);
        }
      }
      showSnack('Regla marcada los próximos 4 días. Toca cada día para editar.');
    }
    refresh();
  };

  const handleRemoveMenstruation = () => {
    if (!selectedDate) return;
    dbRemoveMenstruation(selectedDate);
    refresh();
  };

  const handleSaveRelationship = (detail) => {
    if (!selectedDate) return;
    saveRelationship(selectedDate, detail);
    refresh();
  };

  const handleRemoveRelationship = () => {
    if (!selectedDate) return;
    dbRemoveRelationship(selectedDate);
    refresh();
  };

  const selectedRecord = selectedDate ? (records[selectedDate] || null) : null;

  return (
    <div
      className="h-full flex flex-col overflow-hidden"
      style={{ backgroundColor: dark ? '#0A0A0A' : '#F2F2F7' }}
    >
      {/* AppBar */}
      <div
        className="flex items-center justify-between px-4"
        style={{ paddingTop: `max(env(safe-area-inset-top, 0px), 12px)`, paddingBottom: 8 }}
      >
        <button
          onClick={onToggleTheme}
          className="w-10 h-10 flex items-center justify-center rounded-full transition-opacity active:opacity-60"
          aria-label="Cambiar tema"
        >
          {dark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="text-center">
          {/* La app original saluda por el nombre de su usuaria. En la demo
              pública del portfolio se omite para no exponer un dato personal. */}
          <p className="text-base font-medium">{getGreeting()}</p>
        </div>

        <button
          onClick={onOpenSettings}
          className="w-10 h-10 flex items-center justify-center rounded-full transition-opacity active:opacity-60"
          aria-label="Configuración"
        >
          <Settings size={20} />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto overscroll-contain no-scrollbar pb-6">
        <div className="space-y-4 pt-2">
          <CalendarView
            records={records}
            onDayPress={handleDayPress}
            dark={dark}
          />
          <InsightsPanel records={records} dark={dark} refreshKey={refreshKey} />
        </div>
      </div>

      {/* Day Menu */}
      <DayMenu
        open={dayMenuOpen}
        onClose={() => setDayMenuOpen(false)}
        dateStr={selectedDate}
        record={selectedRecord}
        dark={dark}
        onTogglePill={handleTogglePill}
        onOpenMenstruation={() => { setDayMenuOpen(false); setMenstruationOpen(true); }}
        onRemoveMenstruation={() => { handleRemoveMenstruation(); setDayMenuOpen(false); }}
        onOpenRelationship={() => { setDayMenuOpen(false); setRelationshipOpen(true); }}
        onRemoveRelationship={() => { handleRemoveRelationship(); setDayMenuOpen(false); }}
        onOpenDetails={() => { setDayMenuOpen(false); setDetailsOpen(true); }}
      />

      <DayDetailsModal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        dateStr={selectedDate}
        record={selectedRecord}
        dark={dark}
      />

      <MenstruationForm
        open={menstruationOpen}
        onClose={() => setMenstruationOpen(false)}
        initialDetail={selectedRecord?.menstruationDetail}
        onSave={handleSaveMenstruation}
        dark={dark}
      />

      <RelationshipForm
        open={relationshipOpen}
        onClose={() => setRelationshipOpen(false)}
        initialDetail={selectedRecord?.relationshipDetail}
        onSave={handleSaveRelationship}
        dark={dark}
      />

      <PillPrompt
        open={pillPromptOpen}
        onClose={() => setPillPromptOpen(false)}
        onConfirm={handleTodayPill}
        dark={dark}
      />

      <Snackbar
        message={snack.message}
        open={snack.open}
        onClose={() => setSnack(s => ({ ...s, open: false }))}
      />
    </div>
  );
}
