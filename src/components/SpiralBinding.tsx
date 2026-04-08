'use client';

import { motion } from 'framer-motion';
import { useCalendarStore } from '@/store/calendarStore';

const HOLE_COUNT = 12;

export default function SpiralBinding() {
  const { currentDate } = useCalendarStore();
  const currentMonthIndex = currentDate.getMonth();

  return (
    <div className="relative w-full py-4 flex items-center justify-center z-20 pointer-events-none">
      {/* Subtle modern spine line */}
      <div className="absolute top-1/2 left-[4%] right-[4%] h-[2px] bg-[var(--border-color)] dark:bg-white/10 -translate-y-1/2 rounded-full" />
      
      <div className="flex items-center justify-between px-[5%] w-full">
        {Array.from({ length: HOLE_COUNT }).map((_, i) => {
          const isActive = i === currentMonthIndex;
          
          return (
            <div key={i} className="relative flex flex-col items-center shrink-0 w-[14px]">
              {/* Minimalist punch hole */}
              <motion.div 
                animate={{
                  borderColor: isActive ? 'transparent' : 'var(--border-color)',
                  backgroundColor: isActive ? 'rgba(0,0,0,0.1)' : 'var(--background)'
                }}
                className="w-[14px] h-[14px] rounded-full border-[1.5px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)] dark:shadow-[inset_0_2px_5px_rgba(0,0,0,0.4)] z-10" 
              />
              
              {/* Modern elegant wire loop */}
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  y: isActive ? 2 : -4,
                  height: isActive ? 22 : 16,
                  backgroundColor: isActive ? 'var(--accent)' : 'var(--text-muted)'
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`absolute top-[-10px] w-[5px] rounded-full shadow-sm z-20 ${
                  isActive ? 'shadow-[var(--accent-glow)]' : ''
                }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
