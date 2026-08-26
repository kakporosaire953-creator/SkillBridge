import React from 'react';
import { motion } from 'motion/react';

interface ScaleOnHoverProps {
  children: React.ReactNode;
  className?: string;
  /** Vertical lift on hover in px (default -4) */
  liftY?: number;
  /** Scale on hover (default 1.01) */
  hoverScale?: number;
}

/**
 * Wraps a card or interactive element.
 * On hover: lifts slightly and scales very subtly.
 * On press: slight scale-down for tactile feel.
 * GPU-friendly (transform only).
 */
export const ScaleOnHover: React.FC<ScaleOnHoverProps> = ({
  children,
  className,
  liftY = -4,
  hoverScale = 1.01,
}) => {
  return (
    <motion.div
      className={className}
      whileHover={{
        y: liftY,
        scale: hoverScale,
        boxShadow: '0 16px 40px -12px rgba(18, 59, 93, 0.14)',
        transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] as const },
      }}
      whileTap={{
        scale: 0.98,
        transition: { duration: 0.1 },
      }}
    >
      {children}
    </motion.div>
  );
};
