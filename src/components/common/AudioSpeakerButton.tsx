import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Language } from '../../types';
import { speak, stopSpeech } from '../../utils/speech';

interface AudioSpeakerButtonProps {
  text: string;
  language?: Language;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'subtle' | 'primary' | 'card' | 'outline' | 'pill';
  label?: string;
  className?: string;
  id?: string;
  title?: string;
}

export const AudioSpeakerButton: React.FC<AudioSpeakerButtonProps> = ({
  text,
  language = 'hi',
  size = 'md',
  variant = 'subtle',
  label,
  className = '',
  id,
  title = 'Listen to voice instruction',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Reset playing state after estimated speech duration
    if (isPlaying) {
      const estimatedDuration = Math.max(1500, text.length * 75);
      const timer = setTimeout(() => {
        setIsPlaying(false);
      }, estimatedDuration);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, text]);

  const handleToggleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      stopSpeech();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      speak(text, language as Language);
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-14 h-14 text-lg',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7',
  };

  const variantClasses = {
    subtle: isPlaying
      ? 'bg-amber-100 text-amber-900 border-2 border-amber-500 shadow-md ring-2 ring-amber-300 animate-pulse'
      : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-300 shadow-xs hover:scale-105 active:scale-95',
    primary: isPlaying
      ? 'bg-amber-500 text-white shadow-lg ring-4 ring-amber-300'
      : 'bg-[#B4431E] text-white hover:bg-[#9C3818] shadow-md hover:scale-105 active:scale-95',
    card: isPlaying
      ? 'bg-amber-100 text-amber-900 border-2 border-amber-400'
      : 'bg-white/95 text-stone-800 hover:bg-white border border-stone-200 shadow-sm hover:scale-105',
    outline: isPlaying
      ? 'bg-amber-50 border-2 border-amber-500 text-amber-700'
      : 'bg-transparent border-2 border-[#B4431E]/40 text-[#B4431E] hover:bg-[#B4431E]/10',
    pill: isPlaying
      ? 'bg-amber-500 text-white shadow-md'
      : 'bg-stone-200 text-stone-800 hover:bg-stone-300 border border-stone-300',
  };

  return (
    <button
      type="button"
      id={id}
      onClick={handleToggleSpeak}
      title={title}
      aria-label={title}
      className={`inline-flex items-center justify-center gap-1.5 rounded-xl font-bold transition-all duration-200 cursor-pointer select-none shrink-0 ${
        label ? 'px-3 py-2 min-h-[44px]' : sizeClasses[size]
      } ${variantClasses[variant]} ${className}`}
    >
      <Volume2 className={`${iconSizes[size]} ${isPlaying ? 'text-amber-700 animate-pulse' : 'text-current'}`} />

      {label && (
        <span className="text-xs sm:text-sm font-bold whitespace-nowrap">
          {isPlaying ? 'सुन रहे हैं...' : label}
        </span>
      )}
    </button>
  );
};
