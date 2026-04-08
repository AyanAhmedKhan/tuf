'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { format } from 'date-fns';
import { useCalendarStore } from '@/store/calendarStore';

export default function CalendarHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { currentDate } = useCalendarStore();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.6], [0.1, 0.55]);
  const cloudX1 = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const cloudX2 = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const monthName = format(currentDate, 'MMMM');
  const year = format(currentDate, 'yyyy');

  return (
    <div
      ref={ref}
      className="hero-image-container relative w-full overflow-hidden"
      style={{ height: 'clamp(260px, 42vw, 440px)' }}
    >
      {/* Parallax Mountain Image */}
      <motion.div
        style={{ y: imageY, scale: imageScale }}
        className="absolute inset-0"
      >
        <Image
          src="/hero image.png"
          alt="Mountain landscape with misty peaks"
          fill
          priority
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 900px"
        />
      </motion.div>

      {/* Cinematic gradient overlay */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent" />
      </motion.div>

      {/* Floating clouds with parallax */}
      <motion.div
        style={{ x: cloudX1 }}
        className="cloud-float absolute top-[12%] left-[3%] w-[200px] opacity-50 pointer-events-none"
      >
        <Image
          src="/cloud.png"
          alt=""
          width={200}
          height={100}
          className="w-full"
          style={{ height: 'auto' }}
        />
      </motion.div>

      <motion.div
        style={{ x: cloudX2 }}
        className="cloud-float-delayed absolute top-[25%] right-[6%] w-[160px] opacity-35 pointer-events-none"
      >
        <Image
          src="/cloud.png"
          alt=""
          width={160}
          height={80}
          className="w-full"
          style={{ height: 'auto' }}
        />
      </motion.div>

      {/* Month / Year overlay — editorial typography */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 60 }}
        className="absolute bottom-0 left-0 right-0 p-6 md:p-10 pb-10 md:pb-14"
      >
        <div className="relative z-10">
          <motion.p
            key={`year-${year}`}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="text-white/60 text-xs md:text-sm font-semibold tracking-[0.35em] uppercase mb-2"
          >
            {year}
          </motion.p>
          <motion.h1
            key={`month-${monthName}`}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 50, delay: 0.15 }}
            className="text-white text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none"
            style={{
              fontFamily: 'var(--font-display)',
              textShadow: '0 4px 40px rgba(0,0,0,0.35), 0 1px 3px rgba(0,0,0,0.2)',
              fontStyle: 'italic',
            }}
          >
            {monthName}
          </motion.h1>
        </div>
      </motion.div>

      {/* Elegant wave divider */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          className="w-full h-[36px] md:h-[52px]"
        >
          <path
            d="M0,40 C240,90 480,10 720,50 C960,90 1200,20 1440,50 L1440,100 L0,100 Z"
            className="fill-[var(--card-bg)]"
          />
          <path
            d="M0,55 C300,80 600,30 900,60 C1100,80 1300,45 1440,55 L1440,100 L0,100 Z"
            className="fill-[var(--card-bg)]"
            opacity="0.6"
          />
        </svg>
      </div>
    </div>
  );
}
