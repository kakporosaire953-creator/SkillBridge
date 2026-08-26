import React from 'react';
import logoImg from '../assets/logo.png';

interface SkillBridgeLogoProps {
  className?: string;
  isDark?: boolean;
  withTagline?: boolean;
  /** Controls the height of the logo image (default: h-10) */
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeMap = {
  sm: 'h-7',
  md: 'h-10',
  lg: 'h-14',
  xl: 'h-20',
};

export const SkillBridgeLogo: React.FC<SkillBridgeLogoProps> = ({
  className = '',
  isDark = false,
  withTagline = false,
  size = 'md',
}) => {
  return (
    <div className={`flex items-center select-none ${className}`}>
      <img
        src={logoImg}
        alt="SkillBridge — Le pont entre les compétences et les opportunités"
        className={`${sizeMap[size]} w-auto object-contain ${isDark ? 'brightness-0 invert' : ''}`}
        draggable={false}
      />
      {/* withTagline is kept for backward compat but tagline is already in the logo image */}
    </div>
  );
};
