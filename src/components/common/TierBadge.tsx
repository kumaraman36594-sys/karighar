import React from 'react';
import { Award } from 'lucide-react';
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
    1: 'bg-stone-200/90 text-stone-900 border-stone-400 shadow-stone-200/50',
    2: 'bg-amber-200 text-amber-950 border-amber-500 shadow-amber-300/60',
    3: 'bg-teal-100 text-teal-950 border-teal-400 shadow-teal-200/60',
    4: 'bg-gradient-to-r from-amber-200 via-stone-100 to-amber-200 text-stone-900 border-amber-400 shadow-amber-200/70',
  };

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center rounded-full border shadow-xs transition-transform ${
        badgeStyles[info.tier] || badgeStyles[0]
      } ${sizeClasses[size]} ${onClick ? 'cursor-pointer hover:scale-105' : ''} ${className}`}
    >
      <Award className="w-3.5 h-3.5 shrink-0 opacity-80" />
      <span>{info.name}</span>
    </span>
  );
};
