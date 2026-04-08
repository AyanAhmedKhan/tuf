'use client';

import { motion } from 'framer-motion';

const HOLE_COUNT = 13;

export default function SpiralBinding() {
  return (
    <div className="relative w-full py-3 flex items-center justify-center z-10">
      {/* Wire line */}
      <div className="absolute top-1/2 left-[6%] right-[6%] h-[1.5px] bg-gradient-to-r from-transparent via-[#b0b8c8]/40 to-transparent -translate-y-1/2 dark:via-[#4a5568]/40" />
      
      <div className="flex items-center justify-between px-[6%] w-full">
        {Array.from({ length: HOLE_COUNT }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: i * 0.03, type: 'spring', stiffness: 300, damping: 15 }}
            className="spiral-hole shrink-0"
          />
        ))}
      </div>
    </div>
  );
}
