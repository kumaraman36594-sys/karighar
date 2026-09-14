import React, { useState, useEffect } from 'react';
import { Volume2, Check } from 'lucide-react';
import { Language } from '../../types';
import { speak, stopSpeech } from '../../services/voiceService';
import { setStoredLanguage } from '../../utils/storage';
import { KarigharWordmark } from '../common/KarigharWordmark';

interface LanguageSelectScreenProps {
  onSelectLanguage: (lang: Language) => void;
  currentLanguage?: Language;
  isAudioMuted?: boolean;
}

interface LanguageOption {
  code: Language;
  native: string;
  english: string;
  flag: string;
  ttsFeedback: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: 'hi', native: 'हिन्दी', english: 'Hindi', flag: '🇮🇳', ttsFeedback: 'हिन्दी चुनी गई' },
  { code: 'en', native: 'English', english: 'English', flag: '🇮🇳', ttsFeedback: 'English selected' },
  { code: 'ta', native: 'தமிழ்', english: 'Tamil', flag: '🇮🇳', ttsFeedback: 'தமிழ் தேர்ந்தெடுக்கப்பட்டது' },
  { code: 'te', native: 'తెలుగు', english: 'Telugu', flag: '🇮🇳', ttsFeedback: 'తెలుగు ఎంచుకోಬడింది' },
  { code: 'bn', native: 'বাংলা', english: 'Bengali', flag: '🇮🇳', ttsFeedback: 'বাংলা নির্বাচিত হয়েছে' },
  { code: 'mr', native: 'मराठी', english: 'Marathi', flag: '🇮🇳', ttsFeedback: 'मराठी निवडली गेली' },
  { code: 'gu', native: 'ગુજરાતી', english: 'Gujarati', flag: '🇮🇳', ttsFeedback: 'ગુજરાતી પસંદ કરવામાં આવી' },
  { code: 'kn', native: 'ಕನ್ನಡ', english: 'Kannada', flag: '🇮🇳', ttsFeedback: 'ಕನ್ನಡ ಆಯ್ಕೆ ಮಾಡಲಾಗಿದೆ' },
  { code: 'mai', native: 'मैथिली', english: 'Maithili', flag: '🇮🇳', ttsFeedback: 'मैथिली चुनल गेल' },
  { code: 'bho', native: 'भोजपुरी', english: 'Bhojpuri', flag: '🇮🇳', ttsFeedback: 'भोजपुरी चुनल गइल' },
  { code: 'or', native: 'ଓଡ଼ିଆ', english: 'Odia', flag: '🇮🇳', ttsFeedback: 'ଓଡ଼ିଆ ବଛାଗଲା' },
  { code: 'pa', native: 'ਪੰਜਾਬੀ', english: 'Punjabi', flag: '🇮🇳', ttsFeedback: 'ਪੰਜਾਬੀ ਚੁਣੀ ਗਈ' },
];

export const LanguageSelectScreen: React.FC<LanguageSelectScreenProps> = ({
  onSelectLanguage,
  currentLanguage = 'hi',
  isAudioMuted = false,
}) => {
  const [selectedLang, setSelectedLang] = useState<Language>(currentLanguage);

  // Sync selectedLang if prop changes
  useEffect(() => {
    if (currentLanguage) {
      setSelectedLang(currentLanguage);
    }
  }, [currentLanguage]);

  // Voice announcement on initial render
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

  const handleSpeakTitle = () => {
    console.log('Button clicked:', 'hear-describe-languages');
    speak('अपनी भाषा चुनें। नीचे दिए गए किसी भी विकल्प पर टैप करें। Choose your language to continue.', 'hi');
  };

  const handleLanguageTap = (lang: LanguageOption) => {
    console.log('Button clicked:', `select-language-${lang.code}`);
    setSelectedLang(lang.code);

    // 1. Save language to localStorage
    setStoredLanguage(lang.code);

    // 2. Play TTS feedback
    if (!isAudioMuted) {
      speak(lang.ttsFeedback, lang.code);
    }

    // 3. Auto-navigate to Role Selection
    onSelectLanguage(lang.code);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between p-4 sm:p-6 max-w-xl mx-auto font-sans">
      <div className="space-y-6 pt-2">
        {/* Top: App Wordmark & Tagline */}
        <div className="flex flex-col items-center justify-center text-center space-y-1">
          <KarigharWordmark size="md" align="center" />
          <p className="text-sm font-semibold text-[#4B5563]">
            हुनर से बाज़ार तक
          </p>
        </div>

        {/* Title & Voice Button */}
        <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">
              अपनी भाषा चुनें
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
              Choose your language
            </p>
          </div>

          <button
            type="button"
            onClick={handleSpeakTitle}
            id="btn-hear-describe-languages"
            className="w-full sm:w-auto min-h-[48px] px-4 py-2.5 rounded-lg bg-white border border-[#E5E7EB] hover:border-[#FF6B35] hover:text-[#FF6B35] text-[#111827] text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0"
          >
            <Volume2 className="w-4 h-4 text-[#FF6B35]" />
            <span>🔊 Hear me describe these</span>
          </button>
        </div>

        {/* 2-Column Grid of 12 Language Cards */}
        <div id="language-grid" className="grid grid-cols-2 gap-3 sm:gap-3.5">
          {LANGUAGES.map((lang) => {
            const isActive = selectedLang === lang.code;
            return (
              <button
                type="button"
                key={lang.code}
                id={`btn-lang-${lang.code}`}
                onClick={() => handleLanguageTap(lang)}
                className={`w-full min-h-[68px] p-3.5 rounded-lg border-2 transition-all text-left flex items-center justify-between gap-2.5 cursor-pointer group ${
                  isActive
                    ? 'border-[#FF6B35] bg-[#FFF8F5]'
                    : 'border-[#E5E7EB] bg-white hover:border-[#D1D5DB] hover:bg-[#F9FAFB]'
                }`}
              >
                <div className="min-w-0 flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-base sm:text-lg">{lang.flag}</span>
                    <span
                      className={`font-bold text-lg leading-tight transition-colors break-words ${
                        isActive
                          ? 'text-[#FF6B35]'
                          : 'text-[#111827] group-hover:text-[#FF6B35]'
                      }`}
                    >
                      {lang.native}
                    </span>
                  </div>
                  <span
                    className={`text-xs sm:text-sm font-medium pl-6 ${
                      isActive ? 'text-[#FF6B35]/80' : 'text-[#6B7280]'
                    }`}
                  >
                    {lang.english}
                  </span>
                </div>

                {/* Active checkmark indicator */}
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isActive
                      ? 'bg-[#FF6B35] text-white'
                      : 'border-2 border-[#E5E7EB] group-hover:border-[#D1D5DB]'
                  }`}
                >
                  {isActive && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Clean footer notice */}
      <div className="pt-6 pb-2 text-center text-xs text-[#6B7280]">
        Voice input and audio assistance available in all languages
      </div>
    </div>
  );
};
