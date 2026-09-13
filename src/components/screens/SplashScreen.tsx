import React, { useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Language } from '../../types';
import { TRANSLATIONS } from '../../utils/translations';
import { speak } from '../../utils/speech';

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
      className="min-h-screen bg-gradient-to-br from-[#667eea] via-[#5a67d8] to-[#764ba2] flex flex-col items-center justify-center p-6 text-white text-center cursor-pointer select-none relative overflow-hidden"
    >
      {/* Background Decorative Rings */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-purple-400/20 blur-2xl pointer-events-none" />

      <div className="relative z-10 max-w-sm flex flex-col items-center animate-fade-in">
        {/* App Logo */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white shadow-2xl flex items-center justify-center text-5xl sm:text-6xl mb-6 transform hover:scale-105 transition-transform">
          🎨
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-2 text-white drop-shadow-md">
          {t.appName}
        </h1>
        <p className="text-indigo-100 font-medium text-lg sm:text-xl mb-4">
          "{t.tagline}"
        </p>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold text-white mb-8">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>SIH 2026 · Problem Statement 26090</span>
        </div>

        {/* Quick tap indicator */}
        <div className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors">
          <span>Tap anywhere to continue</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
