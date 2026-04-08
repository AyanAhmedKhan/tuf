'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { format } from 'date-fns';
import { useCalendarStore } from '@/store/calendarStore';

export default function CalendarHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { currentDate } = useCalendarStore();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Scroll Parallax
  const scrollY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.6], [0.1, 0.55]);
  const scrollCloudBase1 = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const scrollCloudBase2 = useTransform(scrollYProgress, [0, 1], [0, -60]);

  // Mouse Parallax (Spring animated)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { stiffness: 50, damping: 20 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    // Normalize from -1 to 1
    const nX = (e.clientX - centerX) / (width / 2);
    const nY = (e.clientY - centerY) / (height / 2);
    mouseX.set(nX);
    mouseY.set(nY);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  // Combine scroll and mouse parallax
  const bgX = useTransform(smoothMouseX, [-1, 1], [15, -15]);
  const bgY = useTransform(smoothMouseY, [-1, 1], [15, -15]);
  
  const cloud1X = useTransform(smoothMouseX, v => v * -30);
  const cloud1Y = useTransform(smoothMouseY, v => v * -30);
  
  const cloud2X = useTransform(smoothMouseX, v => v * -45);
  const cloud2Y = useTransform(smoothMouseY, v => v * -45);

  const monthName = format(currentDate, 'MMMM');
  const year = format(currentDate, 'yyyy');

  return (
    <div
      ref={ref}
      onMouseLeave={handleMouseLeave}
      className="hero-image-container relative w-full overflow-hidden group"
      style={{ height: 'clamp(260px, 42vw, 440px)' }}
    >
      {/* Background Image with combined parallax */}
      <motion.div
        style={{ 
          y: scrollY, 
          scale: imageScale,
          x: bgX,
          translateY: bgY,
        }}
        className="absolute inset-[-20px]" // Negative inset prevents edges showing during parallax
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
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent" />
      </motion.div>

      {/* Floating clouds with parallax (scroll + mouse tracking) */}
      <motion.div
        style={{ 
          x: useTransform(() => scrollCloudBase1.get() + cloud1X.get()), 
          y: cloud1Y
        }}
        className="cloud-float absolute top-[5%] md:top-[12%] -left-[15%] md:left-[3%] w-[150px] md:w-[200px] opacity-50 pointer-events-none drop-shadow-2xl gsap-hero-cloud"
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
        style={{ 
          x: useTransform(() => scrollCloudBase2.get() + cloud2X.get()),
          y: cloud2Y 
        }}
        className="cloud-float-delayed absolute top-[20%] md:top-[25%] -right-[15%] md:right-[6%] w-[120px] md:w-[160px] opacity-35 pointer-events-none drop-shadow-2xl gsap-hero-cloud"
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

      {/* Month / Year overlay — editorial typography with slight text parallax */}
      <motion.div
        style={{
          x: useTransform(smoothMouseX, [-1, 1], [-10, 10]),
          y: useTransform(smoothMouseY, [-1, 1], [-10, 10])
        }}
        className="absolute bottom-0 left-0 right-0 p-6 md:p-10 pb-10 md:pb-14 pointer-events-none gsap-hero-text"
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
            className="text-white text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none drop-shadow-2xl"
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
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none pointer-events-none">
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
