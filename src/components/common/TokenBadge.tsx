import React from 'react';
import { Coins, Sparkles } from 'lucide-react';

interface TokenBadgeProps {
  tokens: number;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const TokenBadge: React.FC<TokenBadgeProps> = ({
  tokens,
  onClick,
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs sm:text-sm gap-1.5',
    lg: 'px-3.5 py-1.5 text-sm sm:text-base gap-2',
  };

  return (
    <button
      onClick={onClick}
      type="button"
      id="header-token-badge-btn"
      title="आपके टोकन (Tap to view tokens & rewards)"
      className={`inline-flex items-center font-black rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-amber-950 shadow-sm border border-amber-300 hover:shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer ${sizeClasses[size]} ${className}`}
    >
      <Coins className="w-3.5 h-3.5 text-amber-900 shrink-0" />
      <span className="tabular-nums tracking-tight font-extrabold">{tokens}</span>
      <span className="text-[10px] uppercase font-bold opacity-80 hidden xs:inline">टोकन</span>
      <Sparkles className="w-3 h-3 text-amber-900/70 shrink-0" />
    </button>
  );
};
