'use client';

import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Linkedin, Github, Globe, Share2 } from 'lucide-react';

const PLATFORMS = {
  linkedin: {
    label: 'LinkedIn',
    icon: (size: number) => <Linkedin size={size} strokeWidth={2.5} />,
    color: '#0A66C2',
    getUrl: () => 'https://www.linkedin.com/in/ayan-ahmed-khan-95978620a/'
  },
  github: {
    label: 'GitHub',
    icon: (size: number) => <Github size={size} strokeWidth={2.5} />,
    color: '#181717',
    getUrl: () => 'https://github.com/AyanAhmedKhan'
  },
  portfolio: {
    label: 'Portfolio',
    icon: (size: number) => <Globe size={size} strokeWidth={2.5} />,
    color: '#3B82F6',
    getUrl: () => 'https://ayanahmedkhan.vercel.app/'
  }
};

type PlatformKey = keyof typeof PLATFORMS;

function NavItem({
  platformKey,
  index,
  total,
  isOpen,
  spread = 100,
  itemSize = 44,
  iconSize = 20,
  startAngle = -180,
  depth,
  parallaxStrength = 1,
  springX,
  springY,
  shareUrl,
  shareText,
  copied,
  onCopy,
  isOtherHovered,
  onHover,
  onHoverEnd
}: {
  platformKey: PlatformKey;
  index: number;
  total: number;
  isOpen: boolean;
  spread?: number;
  itemSize?: number;
  iconSize?: number;
  startAngle?: number;
  depth: number;
  parallaxStrength?: number;
  springX: any;
  springY: any;
  shareUrl: string;
  shareText: string;
  copied: boolean;
  onCopy: () => void;
  isOtherHovered: boolean;
  onHover: () => void;
  onHoverEnd: () => void;
}) {
  const platform = PLATFORMS[platformKey];
  const color = platform.color;

  const angleStep = total > 1 ? 90 / (total - 1) : 0;
  const angle = startAngle + angleStep * index;
  const rad = (angle * Math.PI) / 180;
  const targetX = Math.cos(rad) * spread;
  const targetY = Math.sin(rad) * spread;

  const parallaxX = useTransform(springX, (mx: number) => (mx - targetX) * depth * parallaxStrength * 0.12);
  const parallaxY = useTransform(springY, (my: number) => (my - targetY) * depth * parallaxStrength * 0.12);
  
  const perspectiveScale = 0.88 + depth * 0.12;
  const shadowBlur = 8 + depth * 20;
  const shadowOpacity = 0.15 + depth * 0.25;
  const shadow = `0 ${Math.round(depth * 12)}px ${shadowBlur}px rgba(0,0,0,${shadowOpacity})`;

  const handleClick = () => {
    const url = platform.getUrl();
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            marginLeft: -(itemSize / 2),
            marginTop: -(itemSize / 2),
            zIndex: Math.round(depth * 10) + 1,
            pointerEvents: 'auto'
          }}
          initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
          animate={{ x: targetX, y: targetY, scale: perspectiveScale, opacity: 1 }}
          exit={{ x: 0, y: 0, scale: 0, opacity: 0, transition: { type: 'spring', stiffness: 350, damping: 24, delay: (total - 1 - index) * 0.04 } }}
          transition={{ type: 'spring', stiffness: 350, damping: 24, delay: index * 0.07 }}
        >
          <motion.div
            style={{ x: parallaxX, y: parallaxY }}
            animate={{
              filter: isOtherHovered ? 'blur(1.5px) brightness(0.6)' : 'blur(0px) brightness(1)',
              opacity: isOtherHovered ? 0.65 : 1
            }}
            transition={{ duration: 0.18, ease: 'easeInOut' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              whileHover={{ opacity: 1, y: 0 }}
              style={{
                position: 'absolute',
                bottom: 'calc(100% + 8px)',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(0,0,0,0.8)',
                color: '#fff',
                padding: '4px 10px',
                borderRadius: 6,
                fontSize: 12,
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                userSelect: 'none',
                fontWeight: 600
              }}
            >
              {platform.label}
            </motion.div>
            
            <motion.button
              onClick={handleClick}
              onMouseEnter={onHover}
              onMouseLeave={onHoverEnd}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              style={{
                width: itemSize,
                height: itemSize,
                borderRadius: '50%',
                background: color,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: shadow,
                transition: 'background 0.3s ease'
              }}
            >
              {platform.icon(iconSize)}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function SocialSharing() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hoveredKey, setHoveredKey] = useState<PlatformKey | null>(null);

  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);

  const springConfig = { stiffness: 100, damping: 20 };
  const springX = useSpring(rawMouseX, springConfig);
  const springY = useSpring(rawMouseY, springConfig);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    
    rawMouseX.set(e.clientX - cx);
    rawMouseY.set(e.clientY - cy);

    // Custom distance calculation to gracefully auto-close the menu
    if (isOpen) {
      const distance = Math.sqrt(Math.pow(e.clientX - cx, 2) + Math.pow(e.clientY - cy, 2));
      if (distance > 160) {
        setIsOpen(false);
        setHoveredKey(null);
        rawMouseX.set(0);
        rawMouseY.set(0);
      }
    }
  }, [rawMouseX, rawMouseY, isOpen]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setHoveredKey(null);
        rawMouseX.set(0);
        rawMouseY.set(0);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, rawMouseX, rawMouseY]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      // Fallback
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const platforms: { key: PlatformKey; depth: number }[] = [
    { key: 'github', depth: 1 },
    { key: 'linkedin', depth: 0.75 },
    { key: 'portfolio', depth: 0.8 }
  ];

  const fabSize = 56;

  return (
    <div
      ref={containerRef}
      className="fixed bottom-6 left-6 z-50 rounded-full"
      style={{ width: fabSize, height: fabSize }}
    >
      {platforms.map(({ key, depth }, i) => (
        <NavItem
          key={key}
          platformKey={key}
          index={i}
          total={platforms.length}
          isOpen={isOpen}
          spread={90}
          startAngle={-90}
          depth={depth}
          springX={springX}
          springY={springY}
          shareUrl={typeof window !== 'undefined' ? window.location.href : ''}
          shareText="Check out this interactive wall calendar component!"
          copied={copied}
          onCopy={handleCopy}
          isOtherHovered={hoveredKey !== null && hoveredKey !== key}
          onHover={() => setHoveredKey(key)}
          onHoverEnd={() => setHoveredKey(null)}
        />
      ))}

      <motion.button
        onClick={() => setIsOpen((v) => !v)}
        animate={{ rotate: isOpen ? 45 : 0 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        className="absolute inset-0 rounded-full bg-[var(--accent)] text-white shadow-lg flex items-center justify-center z-20 outline-none"
        style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}
      >
        <Share2 size={24} />
      </motion.button>
    </div>
  );
}
