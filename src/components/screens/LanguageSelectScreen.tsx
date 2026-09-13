import React, { useState, useEffect } from 'react';
import { CheckCircle2, ArrowRight, Sparkles, Globe, Palette } from 'lucide-react';
import { Language } from '../../types';
import { speak, stopSpeech } from '../../utils/speech';
import { LANGUAGE_AUDIO_FEEDBACK } from '../../utils/translations';
import { AudioSpeakerButton } from '../common/AudioSpeakerButton';
import { useLanguage } from '../../context/LanguageContext';

interface LanguageSelectScreenProps {
  onSelectLanguage: (lang: Language) => void;
  currentLanguage?: Language;
  isAudioMuted?: boolean;
}

interface LanguageCardOption {
  code: Language;
  nameNative: string;
  nameEnglish: string;
  scriptBadge: string;
  hearPrompt: string;
}

const LANGUAGES: LanguageCardOption[] = [
  { code: 'hi', nameNative: 'हिन्दी', nameEnglish: 'Hindi', scriptBadge: 'देवनागरी', hearPrompt: 'हिन्दी भाषा' },
  { code: 'en', nameNative: 'English', nameEnglish: 'English', scriptBadge: 'Latin', hearPrompt: 'English language' },
  { code: 'ta', nameNative: 'தமிழ்', nameEnglish: 'Tamil', scriptBadge: 'தமிழ்', hearPrompt: 'தமிழ் மொழி' },
  { code: 'te', nameNative: 'తెలుగు', nameEnglish: 'Telugu', scriptBadge: 'తెలుగు', hearPrompt: 'తెలుగు భాష' },
  { code: 'bn', nameNative: 'বাংলা', nameEnglish: 'Bengali', scriptBadge: 'বাংলা', hearPrompt: 'বাংলা ভাষা' },
  { code: 'mr', nameNative: 'मराठी', nameEnglish: 'Marathi', scriptBadge: 'देवनागरी', hearPrompt: 'मराठी भाषा' },
  { code: 'gu', nameNative: 'ગુજરાતી', nameEnglish: 'Gujarati', scriptBadge: 'ગુજરાતી', hearPrompt: 'ગુજરાતી ભાષા' },
  { code: 'kn', nameNative: 'ಕನ್ನಡ', nameEnglish: 'Kannada', scriptBadge: 'ಕನ್ನಡ', hearPrompt: 'ಕನ್ನಡ ಭಾಷೆ' },
];

export const LanguageSelectScreen: React.FC<LanguageSelectScreenProps> = ({
  onSelectLanguage,
  currentLanguage,
  isAudioMuted = false,
}) => {
  const { language: ctxLanguage, setLanguage, t } = useLanguage();
  const [selectedLang, setSelectedLang] = useState<Language>(currentLanguage || ctxLanguage || 'hi');

  // Auto-play voice prompt on screen open
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
    setLanguage(lang.code);
    if (!isAudioMuted) {
      const audioInfo = LANGUAGE_AUDIO_FEEDBACK[lang.code];
      speak(audioInfo?.chosen || `${lang.nameNative} चुनी गई`, lang.code);
    }
  };

  const handleProceed = () => {
    if (!selectedLang) return;
    setLanguage(selectedLang);
    onSelectLanguage(selectedLang);
  };

  const proceedButtonText = selectedLang
    ? LANGUAGE_AUDIO_FEEDBACK[selectedLang]?.proceed || 'आगे बढ़ें'
    : 'आगे बढ़ें';

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-2.5 sm:p-6 md:p-8 select-none">
      <div className="w-full max-w-4xl bg-white rounded-xl p-3.5 sm:p-8 md:p-10 shadow-sm border border-stone-200 flex flex-col space-y-4 sm:space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-1.5 sm:space-y-2">
          <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-xl bg-[#B4431E] text-white flex items-center justify-center shadow-xs">
            <Palette className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              कारीगर <span className="text-xs sm:text-sm font-semibold text-stone-500">(Karighar)</span>
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-[#B4431E] mt-0.5">
              "हुनर से बाज़ार तक" · From Skill to Marketplace
            </p>
          </div>
        </div>

        {/* Question with Audio Speaker Button */}
        <div className="flex items-center justify-between gap-2.5 sm:gap-3 bg-stone-50 p-3 sm:p-4 rounded-lg border border-stone-200">
          <div>
            <h2 className="text-base sm:text-xl font-extrabold text-stone-900">
              अपनी भाषा चुनें
            </h2>
            <p className="text-[11px] sm:text-xs text-stone-600 font-medium">
              Choose your regional language / உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்
            </p>
          </div>
          <AudioSpeakerButton
            text="अपनी भाषा चुनें। Choose your language"
            language="hi"
            size="lg"
            variant="primary"
            title="अपनी भाषा चुनें सुनें"
            id="speak-choose-language-btn"
            className="shrink-0"
          />
        </div>

        {/* Responsive Grid of Language Cards (2 on phone, 3 on tablet, 4 on desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
          {LANGUAGES.map((lang) => {
            const isSelected = selectedLang === lang.code;
            return (
              <div
                key={lang.code}
                id={`lang-card-${lang.code}`}
                onClick={() => handleCardClick(lang)}
                className={`relative min-h-[84px] sm:min-h-[90px] p-2.5 sm:p-4 rounded-lg border-2 transition-all cursor-pointer flex flex-col justify-between group select-none ${
                  isSelected
                    ? 'border-[#B4431E] bg-amber-50/50 shadow-xs scale-[1.02]'
                    : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                }`}
              >
                {/* Header inside card: Script Badge & Audio button */}
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] uppercase font-bold px-1.5 sm:px-2 py-0.5 rounded-sm bg-stone-100 text-stone-700 truncate">
                    {lang.scriptBadge}
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
                      <CheckCircle2 className="w-5 h-5 text-[#B4431E] fill-amber-100 shrink-0" />
                    )}
                  </div>
                </div>

                {/* Language Name in Native Script & English */}
                <div>
                  <div
                    className={`font-bold text-lg sm:text-xl leading-tight transition-colors ${
                      isSelected ? 'text-[#B4431E]' : 'text-stone-900 group-hover:text-[#B4431E]'
                    }`}
                  >
                    {lang.nameNative}
                  </div>
                  <div className="text-xs text-stone-500 font-medium">
                    {lang.nameEnglish}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Proceed Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleProceed}
            disabled={!selectedLang}
            id="proceed-language-btn"
            className={`w-full min-h-[48px] h-12 rounded-lg font-bold text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${
              selectedLang
                ? 'bg-[#B4431E] hover:bg-[#9E3514] text-white shadow-xs active:scale-[0.99]'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
            }`}
          >
            <span>{proceedButtonText}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
