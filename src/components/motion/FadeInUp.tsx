import React from 'react';
import { motion } from 'motion/react';

interface FadeInUpProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  /** If true, only animates once when entering viewport */
  once?: boolean;
  /** Y offset to start from (default 24px) */
  yOffset?: number;
}

/**
 * Wraps children in a fade-in + slide-up reveal.
 * Use `delay` to stagger multiple elements.
 * Triggered by entering the viewport (IntersectionObserver via motion's whileInView).
 */
export const FadeInUp: React.FC<FadeInUpProps> = ({
  children,
  delay = 0,
  duration = 0.5,
  className,
  once = true,
  yOffset = 24,
}) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-40px' }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1] as const,
      }}
    >
      {children}
    </motion.div>
  );
};
