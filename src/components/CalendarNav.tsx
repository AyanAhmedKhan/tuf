'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  X,
} from 'lucide-react';
import { format } from 'date-fns';
import { useCalendarStore } from '@/store/calendarStore';

export default function CalendarNav() {
  const {
    currentDate,
    selectedStart,
    selectedEnd,
    goNextMonth,
    goPrevMonth,
    goToToday,
    clearSelection,
  } = useCalendarStore();

  const hasSelection = selectedStart !== null;

  return (
    <div className="flex items-center justify-between mb-5">
      {/* Left: Navigation */}
      <div className="flex items-center gap-1.5">
        <motion.button
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.88 }}
          onClick={goPrevMonth}
          className="p-2.5 rounded-xl hover:bg-[var(--surface-hover)] transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft size={18} className="text-[var(--text-muted)]" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={goToToday}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold
            bg-[var(--accent)] text-white shadow-md shadow-[var(--accent-glow)]
            hover:shadow-lg hover:shadow-[var(--accent-glow)] transition-all"
          aria-label="Jump to today"
        >
          <CalendarDays size={13} />
          Today
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.88 }}
          onClick={goNextMonth}
          className="p-2.5 rounded-xl hover:bg-[var(--surface-hover)] transition-colors"
          aria-label="Next month"
        >
          <ChevronRight size={18} className="text-[var(--text-muted)]" />
        </motion.button>
      </div>

      {/* Right: Selection indicator */}
      <AnimatePresence>
        {hasSelection && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--range-bg)] border border-[var(--range-border)]"
          >
            <div className="flex items-center gap-1.5 text-xs text-[var(--accent-dark)] font-semibold">
              <span className="inline-block w-2 h-2 rounded-full bg-[var(--accent)] shadow-sm shadow-[var(--accent-glow)]" />
              <span>
                {format(selectedStart!, 'MMM d')}
                {selectedEnd && ` — ${format(selectedEnd, 'MMM d')}`}
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.2, rotate: 90 }}
              whileTap={{ scale: 0.85 }}
              onClick={clearSelection}
              className="p-0.5 rounded-md hover:bg-red-500/10 text-red-400 transition-colors"
              aria-label="Clear selection"
            >
              <X size={13} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
