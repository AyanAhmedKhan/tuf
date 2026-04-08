'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  StickyNote,
  Plus,
  Trash2,
  Calendar,
  FileText,
  ChevronDown,
  Check,
  Pen,
} from 'lucide-react';
import { format } from 'date-fns';
import { useCalendarStore } from '@/store/calendarStore';

type Tab = 'range' | 'date' | 'month';

export default function NotesPanel() {
  const {
    selectedStart,
    selectedEnd,
    notes,
    rangeNotes,
    monthNote,
    currentDate,
    addNoteToDate,
    removeNoteFromDate,
    addRangeNote,
    removeRangeNote,
    setMonthNote,
  } = useCalendarStore();

  const [tab, setTab] = useState<Tab>('range');
  const [newNote, setNewNote] = useState('');
  const [savedFlash, setSavedFlash] = useState(false);

  // Load month note when month changes
  useEffect(() => {
    const key = format(currentDate, 'yyyy-MM');
    try {
      const raw = localStorage.getItem(`cal-month-${key}`);
      if (raw) {
        setMonthNote(JSON.parse(raw));
      } else {
        setMonthNote('');
      }
    } catch {
      setMonthNote('');
    }
  }, [currentDate, setMonthNote]);

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    if (tab === 'range' && selectedStart) {
      addRangeNote(newNote.trim());
    } else if (tab === 'date' && selectedStart) {
      addNoteToDate(selectedStart, newNote.trim());
    }
    setNewNote('');
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleAddNote();
    }
  };

  const dateKey = selectedStart ? format(selectedStart, 'yyyy-MM-dd') : '';
  const dateNotes = dateKey ? notes[dateKey] || [] : [];

  const matchingRangeNotes = rangeNotes.filter((n) => {
    if (!selectedStart) return false;
    const startMatch = n.startDate === format(selectedStart, 'yyyy-MM-dd');
    const endMatch = selectedEnd
      ? n.endDate === format(selectedEnd, 'yyyy-MM-dd')
      : n.startDate === n.endDate;
    return startMatch && endMatch;
  });

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'range', label: 'Range', icon: <Calendar size={12} /> },
    { key: 'date', label: 'Day', icon: <StickyNote size={12} /> },
    { key: 'month', label: 'Month', icon: <FileText size={12} /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, type: 'spring', stiffness: 80 }}
      className="w-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[var(--accent)] flex items-center justify-center">
            <Pen size={13} className="text-white" />
          </div>
          <h3 className="text-sm font-bold tracking-tight text-[var(--foreground)]">
            Notes
          </h3>
        </div>

        {/* Save indicator */}
        <AnimatePresence>
          {savedFlash && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              className="flex items-center gap-1 text-emerald-500 text-[11px] font-semibold bg-emerald-500/10 px-2 py-1 rounded-md"
            >
              <Check size={11} />
              Saved
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 mb-4 p-1 rounded-2xl bg-[var(--border-color)]/30">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-bold tracking-wide transition-all duration-250 ${
              tab === t.key
                ? 'tab-active'
                : 'text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)]'
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {tab === 'month' ? (
          /* Month notes */
          <motion.div
            key="month-tab"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <p className="text-[10px] text-[var(--text-subtle)] mb-2 uppercase tracking-[0.12em] font-bold">
              {format(currentDate, 'MMMM yyyy')} memo
            </p>
            <textarea
              value={monthNote}
              onChange={(e) => setMonthNote(e.target.value)}
              placeholder="Write notes for this month..."
              className="notes-area"
              rows={4}
            />
          </motion.div>
        ) : (
          /* Range/Date notes */
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            {selectedStart ? (
              <div className="mb-3">
                <p className="text-[10px] text-[var(--text-subtle)] uppercase tracking-[0.12em] font-bold mb-1">
                  {tab === 'range' ? 'Selected range' : 'Selected date'}
                </p>
                <p className="text-xs font-semibold text-[var(--foreground)]">
                  {format(selectedStart, 'MMM d, yyyy')}
                  {selectedEnd && tab === 'range' && (
                    <span className="text-[var(--accent)]"> — {format(selectedEnd, 'MMM d, yyyy')}</span>
                  )}
                </p>
              </div>
            ) : (
              /* Empty state */
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-12 h-12 rounded-2xl bg-[var(--surface-hover)] flex items-center justify-center mb-3">
                  <Calendar size={20} className="text-[var(--text-subtle)]" />
                </div>
                <p className="text-xs font-medium text-[var(--text-subtle)] mb-1">
                  {tab === 'range' ? 'No range selected' : 'No date selected'}
                </p>
                <p className="text-[10px] text-[var(--text-subtle)]/60">
                  Click dates on the calendar to begin
                </p>
              </div>
            )}

            {/* Add note input */}
            {selectedStart && (
              <div className="relative mb-3">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Add a ${tab === 'range' ? 'range' : 'day'} note...`}
                  className="notes-area text-sm"
                  rows={2}
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[9px] text-[var(--text-subtle)]">
                    ⌘ + Enter to save
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--accent)] text-white text-[11px] font-bold
                      disabled:opacity-30 disabled:cursor-not-allowed
                      shadow-md shadow-[var(--accent-glow)] transition-opacity"
                  >
                    <Plus size={12} />
                    Add
                  </motion.button>
                </div>
              </div>
            )}

            {/* Notes list */}
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
              <AnimatePresence>
                {(tab === 'range' ? matchingRangeNotes : dateNotes).map(
                  (note) => (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, x: -15, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: 'auto' }}
                      exit={{ opacity: 0, x: 20, height: 0 }}
                      className="note-item flex items-start gap-2.5 group"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-2 shrink-0" />
                      <p className="flex-1 text-xs leading-relaxed text-[var(--foreground)]">
                        {note.text}
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.2 }}
                        onClick={() =>
                          tab === 'range'
                            ? removeRangeNote(note.id)
                            : selectedStart &&
                              removeNoteFromDate(selectedStart, note.id)
                        }
                        className="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity
                          text-[var(--text-subtle)] hover:text-red-400"
                      >
                        <Trash2 size={11} />
                      </motion.button>
                    </motion.div>
                  )
                )}
              </AnimatePresence>

              {selectedStart &&
                (tab === 'range'
                  ? matchingRangeNotes
                  : dateNotes
                ).length === 0 && (
                  <p className="text-center text-[10px] text-[var(--text-subtle)] py-4 font-medium">
                    No notes yet — add one above
                  </p>
                )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
