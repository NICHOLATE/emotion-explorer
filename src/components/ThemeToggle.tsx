import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Stars, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false); // Default to light
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('opinionme-theme');
    if (stored) {
      setIsDark(stored === 'dark');
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark-theme', isDark);
    localStorage.setItem('opinionme-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const handleToggle = () => {
    setIsAnimating(true);
    setIsDark(!isDark);
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <div className="relative">
      {/* Burst particles on toggle */}
      <AnimatePresence>
        {isAnimating && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2 pointer-events-none"
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1, 0],
                  x: Math.cos((i * 60 * Math.PI) / 180) * 30,
                  y: Math.sin((i * 60 * Math.PI) / 180) * 30,
                  opacity: [1, 1, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                {isDark ? (
                  <Stars className="w-3 h-3 text-primary" />
                ) : (
                  <Sparkles className="w-3 h-3 text-amber-400" />
                )}
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggle}
        className="relative w-10 h-10 rounded-full overflow-hidden"
      >
        {/* Background glow */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            background: isDark
              ? 'radial-gradient(circle, hsl(217 91% 60% / 0.2) 0%, transparent 70%)'
              : 'radial-gradient(circle, hsl(45 93% 47% / 0.3) 0%, transparent 70%)',
          }}
          transition={{ duration: 0.4 }}
        />

        {/* Moon icon */}
        <motion.div
          initial={false}
          animate={{
            rotate: isDark ? 0 : -90,
            scale: isDark ? 1 : 0,
            y: isDark ? 0 : -20,
          }}
          transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
          className="absolute"
        >
          <Moon className="w-5 h-5 text-primary" />
        </motion.div>

        {/* Sun icon */}
        <motion.div
          initial={false}
          animate={{
            rotate: isDark ? 90 : 0,
            scale: isDark ? 0 : 1,
            y: isDark ? 20 : 0,
          }}
          transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
          className="absolute"
        >
          <Sun className="w-5 h-5 text-amber-400" />
        </motion.div>

        {/* Rotating rays for sun */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ rotate: isDark ? 0 : 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          style={{ opacity: isDark ? 0 : 0.3 }}
        >
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-6 bg-amber-400/50"
              style={{
                transformOrigin: 'center center',
                rotate: `${i * 45}deg`,
              }}
            />
          ))}
        </motion.div>
      </Button>
    </div>
  );
};
