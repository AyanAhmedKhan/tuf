'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useCalendarStore } from '@/store/calendarStore';

import CalendarHero from './CalendarHero';
import SpiralBinding from './SpiralBinding';
import CalendarNav from './CalendarNav';
import CalendarGrid from './CalendarGrid';
import NotesPanel from './NotesPanel';
import ThemeToggle from './ThemeToggle';
import HolidayLegend from './HolidayLegend';
import TiltCard from './TiltCard';
import CalendarSkeleton from './CalendarSkeleton';
import SocialSharing from './SocialSharing';

export default function WallCalendar() {
  const [loaded, setLoaded] = useState(false);
  const { isDark, goNextMonth, goPrevMonth } = useCalendarStore();
  const containerRef = useRef<HTMLDivElement>(null);

  // Touch swipe detection
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const deltaX = e.changedTouches[0].clientX - touchStartX.current;
      const deltaY = e.changedTouches[0].clientY - touchStartY.current;
      if (Math.abs(deltaX) > 60 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
        if (deltaX < 0) goNextMonth();
        else goPrevMonth();
      }
    },
    [goNextMonth, goPrevMonth]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return;
      if (e.key === 'ArrowLeft') goPrevMonth();
      if (e.key === 'ArrowRight') goNextMonth();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNextMonth, goPrevMonth]);

  // Init theme
  useEffect(() => {
    const stored = localStorage.getItem('cal-dark');
    if (stored) {
      const dark = JSON.parse(stored);
      document.documentElement.classList.toggle('dark', dark);
    }
    const t = setTimeout(() => setLoaded(true), 500);
    return () => clearTimeout(t);
  }, []);

  // Scroll-based card scale
  const { scrollYProgress } = useScroll();
  const cardScale = useTransform(scrollYProgress, [0, 0.15], [0.98, 1]);

  return (
    <>
      <AnimatePresence>
        {!loaded && <CalendarSkeleton />}
      </AnimatePresence>

      {loaded && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen relative bg-[var(--background)] transition-colors duration-500"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Ambient background gradients */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <div
              className="absolute -top-[200px] left-1/2 -translate-x-1/2 w-[900px] h-[700px] rounded-full opacity-[0.18] blur-[140px]"
              style={{
                background: isDark
                  ? 'radial-gradient(circle, #1e3a8a 0%, transparent 65%)'
                  : 'radial-gradient(circle, #93b4fd 0%, transparent 65%)',
              }}
            />
            <div
              className="absolute -bottom-[100px] -right-[100px] w-[600px] h-[600px] rounded-full opacity-[0.12] blur-[120px]"
              style={{
                background: isDark
                  ? 'radial-gradient(circle, #5b21b6 0%, transparent 65%)'
                  : 'radial-gradient(circle, #c4b5fd 0%, transparent 65%)',
              }}
            />
            <div
              className="absolute top-1/2 -left-[100px] w-[400px] h-[400px] rounded-full opacity-[0.08] blur-[100px]"
              style={{
                background: isDark
                  ? 'radial-gradient(circle, #0e7490 0%, transparent 65%)'
                  : 'radial-gradient(circle, #a5f3fc 0%, transparent 65%)',
              }}
            />
          </div>

          {/* Theme toggle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, type: 'spring' }}
            className="fixed top-5 right-5 z-50"
          >
            <ThemeToggle />
          </motion.div>

          {/* Main calendar card */}
          <div className="relative z-10 flex justify-center px-4 md:px-6 py-8 md:py-14">
            <motion.div style={{ scale: cardScale }}>
              <TiltCard
                className="w-full max-w-[920px] rounded-[28px] overflow-hidden glass-strong relative"
                intensity={3}
              >
                {/* Hero Image */}
                <CalendarHero />

                {/* Spiral binding */}
                <SpiralBinding />

                {/* Calendar body */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 80 }}
                  className="px-5 md:px-10 pb-8 md:pb-12"
                >
                  {/* Desktop: side-by-side with divider / Mobile: stacked */}
                  <div className="flex flex-col lg:flex-row gap-6 lg:gap-0">
                    {/* Calendar section */}
                    <div className="flex-1 min-w-0 lg:pr-8">
                      <CalendarNav />
                      <CalendarGrid />
                      <HolidayLegend />
                    </div>

                    {/* Vertical separator - desktop only */}
                    <div className="hidden lg:block content-separator mx-2 self-stretch" />

                    {/* Notes section */}
                    <div className="lg:w-[260px] lg:shrink-0 lg:pl-6">
                      <div className="lg:sticky lg:top-8">
                        <NotesPanel />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Bottom accent line */}
                <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-[var(--accent)]/40 to-transparent" />
              </TiltCard>
            </motion.div>
          </div>

          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center py-8 relative z-10"
          >
            <p className="text-[11px] text-[var(--text-subtle)] font-medium">
              Built with{' '}
              <span className="text-[var(--accent)] font-semibold">Next.js</span>{' · '}
              <span className="text-[var(--accent)] font-semibold">Framer Motion</span>{' · '}
              <span className="text-[var(--accent)] font-semibold">Tailwind CSS</span>
            </p>
            <p className="mt-2 text-[9px] text-[var(--text-subtle)]/50 tracking-wide">
              ← → NAVIGATE MONTHS · SWIPE ON MOBILE · CLICK TO SELECT RANGE
            </p>
          </motion.footer>

          {/* Social Sharing Parallax FAB */}
          <SocialSharing />
        </motion.div>
      )}
    </>
  );
}
