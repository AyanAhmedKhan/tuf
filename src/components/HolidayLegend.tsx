'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { useCalendarStore } from '@/store/calendarStore';

const HOLIDAYS_2026: Record<string, string> = {
  '2026-01-26': 'Republic Day',
  '2026-03-10': 'Maha Shivaratri',
  '2026-03-17': 'Holi',
  '2026-03-31': 'Id-ul-Fitr',
  '2026-04-02': 'Ram Navami',
  '2026-04-14': 'Dr. Ambedkar Jayanti',
  '2026-04-18': 'Good Friday',
  '2026-05-01': 'May Day',
  '2026-05-12': 'Buddha Purnima',
  '2026-06-07': 'Id-ul-Zuha',
  '2026-07-06': 'Muharram',
  '2026-08-15': 'Independence Day',
  '2026-08-22': 'Janmashtami',
  '2026-09-04': 'Milad-un-Nabi',
  '2026-10-02': 'Gandhi Jayanti',
  '2026-10-12': 'Dussehra',
  '2026-10-31': 'Diwali',
  '2026-11-01': 'Diwali Holiday',
  '2026-11-04': 'Guru Nanak Jayanti',
  '2026-12-25': 'Christmas',
};

export default function HolidayLegend() {
  const { currentDate } = useCalendarStore();
  const [isOpen, setIsOpen] = useState(false);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const monthHolidays = monthDays
    .map((d) => {
      const key = format(d, 'yyyy-MM-dd');
      return HOLIDAYS_2026[key] ? { date: d, name: HOLIDAYS_2026[key] } : null;
    })
    .filter(Boolean) as { date: Date; name: string }[];

  if (monthHolidays.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="mt-4 pt-4 border-t border-[var(--separator)]"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-xs text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors w-full group"
      >
        <div className="w-5 h-5 rounded-md bg-[var(--holiday-bg)] flex items-center justify-center">
          <Sparkles size={11} className="text-[var(--holiday-color)]" />
        </div>
        <span className="font-bold tracking-tight">
          {monthHolidays.length} Holiday{monthHolidays.length > 1 ? 's' : ''} this month
        </span>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} className="ml-auto text-[var(--text-subtle)]">
          <ChevronDown size={13} />
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-3 space-y-2">
              {monthHolidays.map((h, i) => (
                <motion.div
                  key={h.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-3 text-xs px-2 py-1.5 rounded-lg hover:bg-[var(--holiday-bg)] transition-colors"
                >
                  <span className="w-6 h-6 rounded-lg bg-[var(--holiday-bg)] flex items-center justify-center text-[10px] font-bold text-[var(--holiday-color)]">
                    {format(h.date, 'd')}
                  </span>
                  <span className="text-[var(--foreground)] font-medium">{h.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
