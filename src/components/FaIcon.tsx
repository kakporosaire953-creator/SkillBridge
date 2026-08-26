import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface FaIconProps {
  icon: IconDefinition;
  className?: string;
  size?: '2xs' | 'xs' | 'sm' | 'lg' | 'xl' | '2xl' | '1x' | '2x' | '3x';
  style?: React.CSSProperties;
  spin?: boolean;
}

export const FaIcon: React.FC<FaIconProps> = ({
  icon,
  className = '',
  size,
  style,
  spin = false
}) => {
  return (
    <FontAwesomeIcon
      icon={icon}
      className={className}
      size={size}
      style={style as any}
      spin={spin}
      aria-hidden="true"
    />
  );
};
