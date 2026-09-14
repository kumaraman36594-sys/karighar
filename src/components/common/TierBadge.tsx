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
  size = 'md',
  className = '',
  onClick,
}) => {
  const info = TokenService.getTierInfo(tierLevel);

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px] gap-1 font-semibold',
    md: 'px-2.5 py-1 text-xs gap-1.5 font-bold',
    lg: 'px-3 py-1.5 text-sm gap-2 font-bold',
  };

  const badgeStyles: Record<number, string> = {
    0: 'bg-stone-100 text-stone-800 border-stone-300',
    1: 'bg-amber-50 text-amber-900 border-amber-300',
    2: 'bg-emerald-50 text-emerald-900 border-emerald-300',
    3: 'bg-sky-50 text-sky-900 border-sky-300',
    4: 'bg-stone-900 text-amber-300 border-stone-900',
  };

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center rounded-md border text-xs transition-colors ${
        badgeStyles[info.tier] || badgeStyles[0]
      } ${sizeClasses[size]} ${onClick ? 'cursor-pointer hover:opacity-85' : ''} ${className}`}
    >
      <Award className="w-3.5 h-3.5 shrink-0 text-amber-600" />
      <span>{info.name}</span>
    </span>
  );
};

