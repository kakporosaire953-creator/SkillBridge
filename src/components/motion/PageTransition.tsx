import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PageTransitionProps {
  children: React.ReactNode;
  /** Unique key — change this to trigger the transition (e.g. currentView) */
  pageKey: string;
}

/**
 * Wraps page content in a smooth fade + slide-up transition.
 * Pass `pageKey` as the current view name to trigger on navigation.
 * Duration: 250ms — feels near-instant but clearly transitions.
 */
export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  pageKey,
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{
          duration: 0.25,
          ease: [0.25, 0.1, 0.25, 1] as const,
        }}
        style={{ width: '100%' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
