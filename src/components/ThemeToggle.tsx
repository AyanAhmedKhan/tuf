'use client';

import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useCalendarStore } from '@/store/calendarStore';

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useCalendarStore();

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.88, rotate: 180 }}
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-2xl glass transition-all duration-300 shadow-lg"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0, scale: isDark ? 0 : 1, opacity: isDark ? 0 : 1 }}
        transition={{ type: 'spring', stiffness: 250, damping: 18 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Sun size={17} className="text-amber-500 drop-shadow-sm" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 0 : -180, scale: isDark ? 1 : 0, opacity: isDark ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 250, damping: 18 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Moon size={17} className="text-blue-300 drop-shadow-sm" />
      </motion.div>
    </motion.button>
  );
}
