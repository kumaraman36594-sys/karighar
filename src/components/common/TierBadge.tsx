import React from 'react';
import { TokenService } from '../../utils/tokenService';

interface TierBadgeProps {
  tierLevel: number;
  showEmoji?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export const TierBadge: React.FC<TierBadgeProps> = ({
  tierLevel,
  showEmoji = true,
  size = 'md',
  className = '',
  onClick,
}) => {
  const info = TokenService.getTierInfo(tierLevel);

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px] gap-1 font-bold',
    md: 'px-3 py-1 text-xs gap-1.5 font-extrabold',
    lg: 'px-4 py-1.5 text-sm gap-2 font-black',
  };

  const badgeStyles: Record<number, string> = {
    0: 'bg-amber-100/90 text-amber-950 border-amber-400 shadow-amber-200/50',
    1: 'bg-slate-200/90 text-slate-900 border-slate-400 shadow-slate-200/50',
    2: 'bg-yellow-100 text-yellow-950 border-yellow-400 shadow-yellow-200/60',
    3: 'bg-cyan-100 text-cyan-950 border-cyan-400 shadow-cyan-200/60',
    4: 'bg-gradient-to-r from-sky-200 via-indigo-200 to-sky-100 text-indigo-950 border-sky-400 shadow-sky-200/70',
  };

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center rounded-full border shadow-xs transition-transform ${
        badgeStyles[info.tier] || badgeStyles[0]
      } ${sizeClasses[size]} ${onClick ? 'cursor-pointer hover:scale-105' : ''} ${className}`}
    >
      {showEmoji && <span>{info.emoji}</span>}
      <span>{info.name}</span>
    </span>
  );
};
