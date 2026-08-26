import React from 'react';
import { motion } from 'motion/react';

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  /** Delay between each child (seconds) */
  staggerDelay?: number;
  /** Initial delay before stagger starts */
  initialDelay?: number;
  /** Y offset for each child */
  yOffset?: number;
}

/**
 * Wraps children and staggers their fade-in + slide-up appearance.
 * Each direct child gets an incremental delay.
 * Triggered when the container enters the viewport.
 */
export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  className,
  staggerDelay = 0.08,
  initialDelay = 0,
  yOffset = 20,
}) => {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: initialDelay,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: yOffset },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
    >
      {React.Children.map(children, (child) =>
        child ? (
          <motion.div variants={itemVariants}>{child}</motion.div>
        ) : null
      )}
    </motion.div>
  );
};
