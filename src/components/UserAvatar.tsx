import React from 'react';
import { Profile } from '../types';

interface UserAvatarProps {
  profile?: Profile | null;
  name?: string | null;
  avatarUrl?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showBorder?: boolean;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
  '2xl': 'w-24 h-24 text-3xl'
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  profile,
  name,
  avatarUrl,
  size = 'md',
  className = '',
  showBorder = false,
}) => {
  const [imageError, setImageError] = React.useState(false);

  const effectiveAvatar = avatarUrl !== undefined ? avatarUrl : profile?.avatar_url;
  
  const effectiveName = name || (
    profile?.first_name || profile?.last_name
      ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
      : profile?.username || 'Talent'
  );

  const getInitials = (str: string): string => {
    if (!str || !str.trim()) return 'SB';
    const parts = str.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return str.slice(0, 2).toUpperCase();
  };

  const initials = getInitials(effectiveName);

  const borderClass = showBorder ? 'ring-2 ring-[#59B83E]/40 border border-white' : '';

  if (effectiveAvatar && !imageError) {
    return (
      <img
        src={effectiveAvatar}
        alt={effectiveName}
        onError={() => setImageError(true)}
        className={`${sizeClasses[size]} rounded-2xl object-cover shrink-0 ${borderClass} ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-2xl bg-gradient-to-br from-[#123B5D] to-[#0A2338] text-white font-mono font-bold shrink-0 flex items-center justify-center tracking-wider select-none shadow-xs ${borderClass} ${className}`}
      title={effectiveName}
      aria-label={effectiveName}
    >
      <span className="leading-none">{initials}</span>
    </div>
  );
};
