import React from 'react';
import { Profile } from '../types';
import defaultAvatarImg from '../assets/default-avatar.jpg';

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

  const effectiveAvatar = avatarUrl !== undefined && avatarUrl !== null && avatarUrl.trim() !== ''
    ? avatarUrl
    : (profile?.avatar_url && profile.avatar_url.trim() !== '' ? profile.avatar_url : defaultAvatarImg);
  
  const effectiveName = name || (
    profile?.first_name || profile?.last_name
      ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
      : profile?.username || 'Talent SkillBridge'
  );

  const borderClass = showBorder ? 'ring-2 ring-[#59B83E]/40 border border-white' : '';

  return (
    <img
      src={effectiveAvatar && !imageError ? effectiveAvatar : defaultAvatarImg}
      alt={effectiveName}
      onError={() => setImageError(true)}
      className={`${sizeClasses[size]} rounded-2xl object-cover shrink-0 ${borderClass} ${className} bg-[#101820]`}
      loading="lazy"
    />
  );
};
