import React from 'react';
import { motion } from 'motion/react';

interface BridgeConnectorProps {
  className?: string;
  direction?: 'horizontal' | 'vertical';
}

/**
 * Visual graphic connector inspired by the SkillBridge motif.
 * Draws an animated stroke representing connection between steps / nodes.
 */
export const BridgeConnector: React.FC<BridgeConnectorProps> = ({
  className = '',
  direction = 'horizontal',
}) => {
  if (direction === 'vertical') {
    return (
      <div className={`relative flex flex-col items-center justify-center ${className}`}>
        <div className="w-0.5 h-full bg-gradient-to-b from-[#06234B] via-[#6BC23F] to-[#06234B] opacity-30" />
      </div>
    );
  }

  return (
    <div className={`relative flex items-center justify-center w-full ${className}`}>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const }}
        className="w-full h-0.5 bg-gradient-to-r from-[#06234B] via-[#6BC23F] to-[#06234B] origin-left opacity-40"
      />
    </div>
  );
};
