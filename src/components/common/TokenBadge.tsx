import React from 'react';
import { Coins } from 'lucide-react';

interface TokenBadgeProps {
  tokens?: number;
  balance?: number;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const TokenBadge: React.FC<TokenBadgeProps> = ({
  tokens,
  balance,
  onClick,
  className = '',
  size = 'md',
}) => {
  const currentTokens = tokens ?? balance ?? 0;
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs sm:text-sm gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2',
  };

  return (
    <button
      onClick={onClick}
      type="button"
      id="header-token-badge-btn"
      title="टोकन विवरण (View Tokens)"
      className={`inline-flex items-center font-bold rounded-lg bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition-colors cursor-pointer ${sizeClasses[size]} ${className}`}
    >
      <Coins className="w-3.5 h-3.5 text-amber-700 shrink-0" />
      <span className="tabular-nums tracking-tight font-extrabold">{currentTokens}</span>
      <span className="text-[10px] uppercase font-semibold text-amber-800 hidden xs:inline">टोकन</span>
    </button>
  );
};

