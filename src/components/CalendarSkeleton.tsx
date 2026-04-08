'use client';

import { motion } from 'framer-motion';

export default function CalendarSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-[900px] mx-auto p-4"
    >
      {/* Hero skeleton */}
      <div className="shimmer rounded-2xl h-[300px] md:h-[400px] mb-4" />

      {/* Spiral */}
      <div className="flex justify-between px-8 mb-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="shimmer w-3 h-3 rounded-full" />
        ))}
      </div>

      {/* Nav skeleton */}
      <div className="flex justify-between mb-4 px-4">
        <div className="shimmer w-24 h-8 rounded-xl" />
        <div className="shimmer w-16 h-8 rounded-xl" />
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-2 mb-2 px-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="shimmer h-4 rounded" />
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-2 px-4">
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="shimmer aspect-square rounded-xl" />
        ))}
      </div>

      {/* Notes skeleton */}
      <div className="mt-4 px-4 space-y-2">
        <div className="shimmer h-4 w-20 rounded" />
        <div className="shimmer h-24 rounded-xl" />
      </div>
    </motion.div>
  );
}
