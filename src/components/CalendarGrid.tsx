'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { format, isSameDay } from 'date-fns';
import { useCalendarStore } from '@/store/calendarStore';
import type { DayInfo } from '@/store/calendarStore';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];



export default function CalendarGrid() {
  const {
    currentDate,
    selectedStart,
    selectedEnd,
    getDaysInMonth,
    selectDate,
    setHoverDate,
    isInRange,
    isHoverRange,
    isFlipping,
    flipDirection,
    notes,
  } = useCalendarStore();

  const days = getDaysInMonth();
  const monthKey = format(currentDate, 'yyyy-MM');

  function getCellClass(day: DayInfo): string {
    const classes = ['day-cell', 'gsap-day-cell'];

    if (!day.isCurrentMonth) {
      classes.push('day-disabled');
      return classes.join(' ');
    }

    if (day.isToday) classes.push('day-today');
    if (day.isWeekend) classes.push('day-weekend');
    if (day.isHoliday) classes.push('day-holiday');

    if (selectedStart && isSameDay(day.date, selectedStart)) {
      classes.push('day-start');
    } else if (selectedEnd && isSameDay(day.date, selectedEnd)) {
      classes.push('day-end');
    } else if (isInRange(day.date)) {
      classes.push('day-in-range');
    } else if (isHoverRange(day.date)) {
      classes.push('day-in-range');
    }

    return classes.join(' ');
  }

  function hasNotes(day: DayInfo): boolean {
    const key = format(day.date, 'yyyy-MM-dd');
    return !!(notes[key] && notes[key].length > 0);
  }

  return (
    <div className="w-full">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1.5 mb-3">
        {WEEKDAYS.map((wd, i) => (
          <div
            key={wd}
            className={`text-center text-[10px] font-bold tracking-[0.15em] uppercase py-2 ${
              i >= 5 ? 'text-[var(--weekend-color)]' : 'text-[var(--text-subtle)]'
            }`}
          >
            {wd}
          </div>
        ))}
      </div>

      {/* Calendar grid with flip animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={monthKey}
          initial={
            isFlipping
              ? {
                  rotateY: flipDirection === 'next' ? 90 : -90,
                  opacity: 0,
                  transformPerspective: 1200,
                }
              : { opacity: 0, y: 15 }
          }
          animate={{
            rotateY: 0,
            opacity: 1,
            y: 0,
            transformPerspective: 1200,
          }}
          exit={
            isFlipping
              ? {
                  rotateY: flipDirection === 'next' ? -90 : 90,
                  opacity: 0,
                  transformPerspective: 1200,
                }
              : { opacity: 0, y: -15 }
          }
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="grid grid-cols-7 gap-1.5"
        >
          <div className="contents">
            {days.map((day, i) => (
              <motion.button
                key={`${monthKey}-${i}`}
                whileTap={day.isCurrentMonth ? { scale: 0.82 } : undefined}
                whileHover={day.isCurrentMonth ? { scale: 1.14, zIndex: 5 } : undefined}
                className={getCellClass(day)}
                onClick={() => day.isCurrentMonth && selectDate(day.date)}
                onMouseEnter={() =>
                  day.isCurrentMonth && setHoverDate(day.date)
                }
                onMouseLeave={() => setHoverDate(null)}
                title={day.holidayName || undefined}
                aria-label={`${format(day.date, 'MMMM d, yyyy')}${day.isToday ? ' (Today)' : ''}${day.holidayName ? ` - ${day.holidayName}` : ''}`}
              >
                <span className="relative z-10">{day.day}</span>

                {/* Note indicator */}
                {hasNotes(day) && day.isCurrentMonth && (
                  <span className="absolute top-1 right-1 w-[5px] h-[5px] rounded-full bg-[var(--accent)] shadow-sm shadow-[var(--accent-glow)]" />
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
