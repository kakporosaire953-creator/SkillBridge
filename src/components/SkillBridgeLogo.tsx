import React from 'react';
import officialLogo from '../assets/official-logo.jpg';

interface SkillBridgeLogoProps {
  className?: string;
  isDark?: boolean;
  withTagline?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeMap = {
  sm: 'h-10',
  md: 'h-16',
  lg: 'h-24',
  xl: 'h-32',
};

export const SkillBridgeLogo: React.FC<SkillBridgeLogoProps> = ({
  className = '',
  isDark = false,
  size = 'md',
}) => {
  return (
    <div className={`flex items-center select-none ${className}`}>
      <img
        src={officialLogo}
        alt="SkillBridge — Le pont entre les compétences et les opportunités"
        className={`${sizeMap[size]} w-auto object-contain ${isDark ? 'brightness-0 invert opacity-90' : ''}`}
        draggable={false}
      />
    </div>
  );
};
