import { create } from 'zustand';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  format,
  addMonths,
  subMonths,
  isToday,
  isSameDay,
  isBefore,
  isAfter,
  isWithinInterval,
  isSameMonth,
} from 'date-fns';

/* ── Types ────────────────────────────────────────── */

export interface Note {
  id: string;
  text: string;
  date: string; // ISO string of the date
  createdAt: string;
}

export interface RangeNote {
  id: string;
  text: string;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface CalendarState {
  currentDate: Date;
  selectedStart: Date | null;
  selectedEnd: Date | null;
  hoverDate: Date | null;
  notes: Record<string, Note[]>; // key = "YYYY-MM-DD"
  rangeNotes: RangeNote[];
  monthNote: string;
  isDark: boolean;
  isFlipping: boolean;
  flipDirection: 'next' | 'prev';
}

export interface CalendarActions {
  goNextMonth: () => void;
  goPrevMonth: () => void;
  goToToday: () => void;
  selectDate: (date: Date) => void;
  setHoverDate: (date: Date | null) => void;
  clearSelection: () => void;
  addNoteToDate: (date: Date, text: string) => void;
  removeNoteFromDate: (date: Date, noteId: string) => void;
  addRangeNote: (text: string) => void;
  removeRangeNote: (noteId: string) => void;
  setMonthNote: (text: string) => void;
  toggleTheme: () => void;
  getDaysInMonth: () => DayInfo[];
  isInRange: (date: Date) => boolean;
  isHoverRange: (date: Date) => boolean;
}

export interface DayInfo {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  isHoliday: boolean;
  holidayName?: string;
}

/* ── Indian Public Holidays 2026 ─────────────────── */

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

/* ── localStorage helpers ─────────────────────────── */

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key: string, value: unknown) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full – silently fail
  }
}

/* ── Store ────────────────────────────────────────── */

export const useCalendarStore = create<CalendarState & CalendarActions>(
  (set, get) => ({
    currentDate: new Date(),
    selectedStart: null,
    selectedEnd: null,
    hoverDate: null,
    notes: loadFromStorage('cal-notes', {}),
    rangeNotes: loadFromStorage('cal-range-notes', []),
    monthNote: '',
    isDark: loadFromStorage('cal-dark', false),
    isFlipping: false,
    flipDirection: 'next',

    goNextMonth: () => {
      set({ isFlipping: true, flipDirection: 'next' });
      setTimeout(() => {
        set((s) => ({
          currentDate: addMonths(s.currentDate, 1),
          isFlipping: false,
        }));
        // Load month note for new month
        const newDate = addMonths(get().currentDate, 0);
        const key = format(newDate, 'yyyy-MM');
        set({ monthNote: loadFromStorage(`cal-month-${key}`, '') });
      }, 400);
    },

    goPrevMonth: () => {
      set({ isFlipping: true, flipDirection: 'prev' });
      setTimeout(() => {
        set((s) => ({
          currentDate: subMonths(s.currentDate, 1),
          isFlipping: false,
        }));
        const newDate = subMonths(get().currentDate, 0);
        const key = format(newDate, 'yyyy-MM');
        set({ monthNote: loadFromStorage(`cal-month-${key}`, '') });
      }, 400);
    },

    goToToday: () => {
      set({ currentDate: new Date() });
    },

    selectDate: (date: Date) => {
      const { selectedStart, selectedEnd } = get();

      if (!selectedStart || (selectedStart && selectedEnd)) {
        // First click or reset: set start
        set({ selectedStart: date, selectedEnd: null });
      } else {
        // Second click: set range
        if (isBefore(date, selectedStart)) {
          set({ selectedStart: date, selectedEnd: selectedStart });
        } else if (isSameDay(date, selectedStart)) {
          // Toggle off
          set({ selectedStart: null, selectedEnd: null });
        } else {
          set({ selectedEnd: date });
        }
      }
    },

    setHoverDate: (date: Date | null) => {
      set({ hoverDate: date });
    },

    clearSelection: () => {
      set({ selectedStart: null, selectedEnd: null });
    },

    addNoteToDate: (date: Date, text: string) => {
      const key = format(date, 'yyyy-MM-dd');
      const note: Note = {
        id: crypto.randomUUID(),
        text,
        date: key,
        createdAt: new Date().toISOString(),
      };
      set((s) => {
        const updated = { ...s.notes, [key]: [...(s.notes[key] || []), note] };
        saveToStorage('cal-notes', updated);
        return { notes: updated };
      });
    },

    removeNoteFromDate: (date: Date, noteId: string) => {
      const key = format(date, 'yyyy-MM-dd');
      set((s) => {
        const updated = {
          ...s.notes,
          [key]: (s.notes[key] || []).filter((n) => n.id !== noteId),
        };
        saveToStorage('cal-notes', updated);
        return { notes: updated };
      });
    },

    addRangeNote: (text: string) => {
      const { selectedStart, selectedEnd } = get();
      if (!selectedStart) return;
      const note: RangeNote = {
        id: crypto.randomUUID(),
        text,
        startDate: format(selectedStart, 'yyyy-MM-dd'),
        endDate: selectedEnd
          ? format(selectedEnd, 'yyyy-MM-dd')
          : format(selectedStart, 'yyyy-MM-dd'),
        createdAt: new Date().toISOString(),
      };
      set((s) => {
        const updated = [...s.rangeNotes, note];
        saveToStorage('cal-range-notes', updated);
        return { rangeNotes: updated };
      });
    },

    removeRangeNote: (noteId: string) => {
      set((s) => {
        const updated = s.rangeNotes.filter((n) => n.id !== noteId);
        saveToStorage('cal-range-notes', updated);
        return { rangeNotes: updated };
      });
    },

    setMonthNote: (text: string) => {
      const key = format(get().currentDate, 'yyyy-MM');
      saveToStorage(`cal-month-${key}`, text);
      set({ monthNote: text });
    },

    toggleTheme: () => {
      set((s) => {
        const next = !s.isDark;
        saveToStorage('cal-dark', next);
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', next);
        }
        return { isDark: next };
      });
    },

    getDaysInMonth: () => {
      const { currentDate } = get();
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      const allDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

      // Pad beginning: Monday = 0 ... Sunday = 6
      const startDayOfWeek = (getDay(monthStart) + 6) % 7; // convert Sun=0 to Mon=0
      const prevMonthEnd = endOfMonth(subMonths(currentDate, 1));
      const prevPadDays: DayInfo[] = [];
      for (let i = startDayOfWeek - 1; i >= 0; i--) {
        const d = new Date(prevMonthEnd);
        d.setDate(prevMonthEnd.getDate() - i);
        prevPadDays.push({
          date: d,
          day: d.getDate(),
          isCurrentMonth: false,
          isToday: isToday(d),
          isWeekend: getDay(d) === 0 || getDay(d) === 6,
          isHoliday: !!HOLIDAYS_2026[format(d, 'yyyy-MM-dd')],
          holidayName: HOLIDAYS_2026[format(d, 'yyyy-MM-dd')],
        });
      }

      const currentDays: DayInfo[] = allDays.map((d) => ({
        date: d,
        day: d.getDate(),
        isCurrentMonth: true,
        isToday: isToday(d),
        isWeekend: getDay(d) === 0 || getDay(d) === 6,
        isHoliday: !!HOLIDAYS_2026[format(d, 'yyyy-MM-dd')],
        holidayName: HOLIDAYS_2026[format(d, 'yyyy-MM-dd')],
      }));

      // Pad end to fill 6 rows (42 cells) or at least fill current row
      const total = prevPadDays.length + currentDays.length;
      const needed = Math.ceil(total / 7) * 7 - total;
      const nextPadDays: DayInfo[] = [];
      for (let i = 1; i <= needed; i++) {
        const d = new Date(monthEnd);
        d.setDate(monthEnd.getDate() + i);
        nextPadDays.push({
          date: d,
          day: d.getDate(),
          isCurrentMonth: false,
          isToday: isToday(d),
          isWeekend: getDay(d) === 0 || getDay(d) === 6,
          isHoliday: !!HOLIDAYS_2026[format(d, 'yyyy-MM-dd')],
          holidayName: HOLIDAYS_2026[format(d, 'yyyy-MM-dd')],
        });
      }

      return [...prevPadDays, ...currentDays, ...nextPadDays];
    },

    isInRange: (date: Date) => {
      const { selectedStart, selectedEnd } = get();
      if (!selectedStart || !selectedEnd) return false;
      return isWithinInterval(date, { start: selectedStart, end: selectedEnd });
    },

    isHoverRange: (date: Date) => {
      const { selectedStart, selectedEnd, hoverDate } = get();
      if (!selectedStart || selectedEnd || !hoverDate) return false;
      const rangeEnd = hoverDate;
      if (isSameDay(date, selectedStart)) return false;
      if (isBefore(rangeEnd, selectedStart)) {
        return isWithinInterval(date, { start: rangeEnd, end: selectedStart });
      }
      return isWithinInterval(date, { start: selectedStart, end: rangeEnd });
    },
  })
);
