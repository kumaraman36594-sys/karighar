import React, { useState, useEffect } from 'react';
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { Language } from '../../types';
import { speak, stopSpeech } from '../../utils/speech';
import { LANGUAGE_AUDIO_FEEDBACK } from '../../utils/translations';
import { AudioSpeakerButton } from '../common/AudioSpeakerButton';

interface LanguageSelectScreenProps {
  onSelectLanguage: (lang: Language) => void;
  currentLanguage?: Language;
  isAudioMuted?: boolean;
}

interface LanguageCardOption {
  code: Language;
  nameNative: string;
  nameEnglish: string;
  flag: string;
  hearPrompt: string;
}

const LANGUAGES: LanguageCardOption[] = [
  { code: 'hi', nameNative: 'हिन्दी', nameEnglish: 'Hindi', flag: '🇮🇳', hearPrompt: 'हिन्दी भाषा' },
  { code: 'en', nameNative: 'English', nameEnglish: 'English', flag: '🌐', hearPrompt: 'English language' },
  { code: 'ta', nameNative: 'தமிழ்', nameEnglish: 'Tamil', flag: '🇮🇳', hearPrompt: 'தமிழ் மொழி' },
  { code: 'te', nameNative: 'తెలుగు', nameEnglish: 'Telugu', flag: '🇮🇳', hearPrompt: 'తెలుగు భాష' },
  { code: 'bn', nameNative: 'বাংলা', nameEnglish: 'Bengali', flag: '🇮🇳', hearPrompt: 'বাংলা ভাষা' },
  { code: 'mr', nameNative: 'मराठी', nameEnglish: 'Marathi', flag: '🇮🇳', hearPrompt: 'मराठी भाषा' },
  { code: 'gu', nameNative: 'ગુજરાતી', nameEnglish: 'Gujarati', flag: '🇮🇳', hearPrompt: 'ગુજરાતી ભાષા' },
  { code: 'kn', nameNative: 'ಕನ್ನಡ', nameEnglish: 'Kannada', flag: '🇮🇳', hearPrompt: 'ಕನ್ನಡ ಭಾಷೆ' },
];

export const LanguageSelectScreen: React.FC<LanguageSelectScreenProps> = ({
  onSelectLanguage,
  currentLanguage,
  isAudioMuted = false,
}) => {
  const [selectedLang, setSelectedLang] = useState<Language | null>(currentLanguage || 'hi');

  // Auto-play voice prompt on screen open as requested in design spec
  useEffect(() => {
    if (!isAudioMuted) {
      const timer = setTimeout(() => {
        speak('अपनी भाषा चुनें। Choose your language', 'hi');
      }, 350);
      return () => {
        clearTimeout(timer);
        stopSpeech();
      };
    }
  }, [isAudioMuted]);

  const handleCardClick = (lang: LanguageCardOption) => {
    setSelectedLang(lang.code);
    if (!isAudioMuted) {
      const audioInfo = LANGUAGE_AUDIO_FEEDBACK[lang.code];
      speak(audioInfo?.chosen || `${lang.nameNative} चुनी गई`, lang.code);
    }
  };

  const handleProceed = () => {
    if (!selectedLang) return;
    onSelectLanguage(selectedLang);
  };

  const proceedButtonText = selectedLang
    ? LANGUAGE_AUDIO_FEEDBACK[selectedLang]?.proceed || 'आगे बढ़ें'
    : 'आगे बढ़ें';

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/40 via-white to-indigo-50/50 flex flex-col items-center justify-center p-4 sm:p-6 py-8">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 flex flex-col space-y-6">
        {/* Top: App Logo & Tagline */}
        <div className="text-center space-y-2">
          <div className="inline-flex relative">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-[#667eea] to-[#764ba2] text-white flex items-center justify-center text-4xl shadow-xl shadow-indigo-100 hover:scale-105 transition-transform">
              🎨
            </div>
            <span className="absolute -top-1 -right-2 bg-amber-400 text-amber-950 font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow-xs">
              SIH #26090
            </span>
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              कारीगर
            </h1>
            <p className="text-base sm:text-lg font-semibold text-indigo-700 mt-0.5">
              "हुनर से बाज़ार तक"
            </p>
          </div>
        </div>

        {/* Middle: Large Question (24px bold) with Audio Speaker Button */}
        <div className="flex items-center justify-between gap-3 bg-indigo-50/70 p-4 rounded-2xl border border-indigo-100">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              अपनी भाषा चुनें
            </h2>
            <p className="text-sm text-gray-600 font-medium">
              Choose your language
            </p>
          </div>
          <AudioSpeakerButton
            text="अपनी भाषा चुनें। Choose your language"
            language="hi"
            size="lg"
            variant="primary"
            title="अपनी भाषा चुनें सुनें"
            id="speak-choose-language-btn"
          />
        </div>

        {/* 2-Column Grid of Language Cards */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {LANGUAGES.map((lang) => {
            const isSelected = selectedLang === lang.code;
            return (
              <div
                key={lang.code}
                id={`lang-card-${lang.code}`}
                onClick={() => handleCardClick(lang)}
                className={`relative min-h-[86px] p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between group select-none ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/80 shadow-md shadow-indigo-100/50 scale-[1.02]'
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50/60 shadow-xs'
                }`}
              >
                {/* Header inside card: Flag and Audio button */}
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-3xl" role="img" aria-label={lang.nameEnglish}>
                    {lang.flag}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <AudioSpeakerButton
                      text={lang.hearPrompt}
                      language={lang.code}
                      size="sm"
                      variant="card"
                      title={`${lang.nameNative} सुनें`}
                      id={`hear-lang-${lang.code}`}
                    />
                    {isSelected && (
                      <CheckCircle2 className="w-6 h-6 text-indigo-600 fill-indigo-100 shrink-0" />
                    )}
                  </div>
                </div>

                {/* Language Name in Native Script (20px) & English (14px) */}
                <div>
                  <div
                    className={`font-bold text-xl leading-tight transition-colors ${
                      isSelected ? 'text-indigo-950' : 'text-gray-900 group-hover:text-indigo-600'
                    }`}
                  >
                    {lang.nameNative}
                  </div>
                  <div className="text-sm text-gray-500 font-medium">
                    {lang.nameEnglish}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom: "आगे बढ़ें" (Proceed) Button (56px height, primary) */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleProceed}
            disabled={!selectedLang}
            id="proceed-language-btn"
            className={`w-full min-h-[56px] h-14 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
              selectedLang
                ? 'bg-[#667eea] hover:bg-[#5a67d8] text-white shadow-indigo-200 active:scale-[0.98]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
            }`}
          >
            <span>{proceedButtonText}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Footer Hint */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Three-Layer Design: Visual · Voice · Text</span>
        </div>
      </div>
    </div>
  );
};
