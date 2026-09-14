import React, { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Language } from '../../types';
import { TRANSLATIONS } from '../../utils/translations';
import { speak } from '../../utils/speech';
import { KarigharEmblem } from '../common/KarigharEmblem';
import { KarigharWordmark } from '../common/KarigharWordmark';

interface SplashScreenProps {
  language: Language;
  onFinish: () => void;
  isAudioMuted: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  language,
  onFinish,
  isAudioMuted,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.hi;

  useEffect(() => {
    if (!isAudioMuted) {
      speak(`${t.appName}। ${t.tagline}।`, language);
    }
    const timer = setTimeout(() => {
      onFinish();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onFinish, isAudioMuted, language, t.appName, t.tagline]);

  return (
    <div 
      onClick={onFinish}
      className="min-h-screen bg-stone-900 flex flex-col items-center justify-center p-6 text-white text-center cursor-pointer select-none relative"
    >
      <div className="relative z-10 max-w-sm flex flex-col items-center animate-fade-in">
        {/* App Logo / Artisan Emblem */}
        <div className="mb-6 p-2 rounded-full bg-stone-800/80 border border-stone-700 shadow-lg">
          <KarigharEmblem size={130} />
        </div>

        {/* Wordmark */}
        <div className="p-3 rounded-xl bg-white/95 shadow-md mb-3">
          <KarigharWordmark size="md" align="center" />
        </div>

        <p className="text-amber-200 font-medium text-sm mb-4">
          "हुनर से बाज़ार तक" — A Home for Artisans
        </p>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-stone-800 border border-stone-700 text-xs font-semibold text-stone-300 mb-8">
          <span>Rural Indian Artisan Commerce</span>
        </div>

        {/* Quick tap indicator */}
        <div className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-200 transition-colors">
          <span>आगे बढ़ने के लिए टैप करें</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};

