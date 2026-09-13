import React, { useEffect } from 'react';
import { Sparkles, ArrowRight, Palette } from 'lucide-react';
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
      className="min-h-screen bg-gradient-to-br from-[#B4431E] via-[#9C3818] to-[#78280E] flex flex-col items-center justify-center p-6 text-white text-center cursor-pointer select-none relative overflow-hidden"
    >
      {/* Background Decorative Rings */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-stone-900/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-sm flex flex-col items-center animate-fade-in">
        {/* App Logo Emblem */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#FDFBF7] text-[#B4431E] shadow-2xl border-2 border-amber-300/40 flex items-center justify-center mb-6 transform hover:scale-105 transition-transform">
          <Palette className="w-12 h-12 sm:w-14 sm:h-14 text-[#B4431E]" />
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-2 text-white drop-shadow-sm font-serif">
          {t.appName}
        </h1>
        <p className="text-amber-100/90 font-medium text-lg sm:text-xl mb-6">
          "{t.tagline}"
        </p>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/20 backdrop-blur-md border border-white/20 text-xs font-semibold text-white/90 mb-8">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>हाथ का हुनर · सीधा बाज़ार</span>
        </div>

        {/* Quick tap indicator */}
        <div className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors">
          <span>आगे बढ़ने के लिए कहीं भी टैप करें</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
