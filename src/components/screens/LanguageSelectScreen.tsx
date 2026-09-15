import React, { useEffect, useState } from 'react';
import { Check, Volume2 } from 'lucide-react';
import { Language } from '../../types';
import { speak, stopSpeech } from '../../services/voiceService';

interface LanguageSelectScreenProps {
  onSelectLanguage: (lang: Language) => void;
  currentLanguage?: Language;
  isAudioMuted?: boolean;
}

interface LanguageOption {
  code: Language;
  native: string;
  english: string;
  ttsFeedback: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: 'hi', native: 'हिन्दी', english: 'Hindi', ttsFeedback: 'हिन्दी चुनी गई' },
  { code: 'en', native: 'English', english: 'English', ttsFeedback: 'English selected' },
  { code: 'ta', native: 'தமிழ்', english: 'Tamil', ttsFeedback: 'தமிழ் தேர்ந்தெடுக்கப்பட்டது' },
  { code: 'te', native: 'తెలుగు', english: 'Telugu', ttsFeedback: 'తెలుగు ఎంచుకోబడింది' },
  { code: 'bn', native: 'বাংলা', english: 'Bengali', ttsFeedback: 'বাংলা নির্বাচিত হয়েছে' },
  { code: 'mr', native: 'मराठी', english: 'Marathi', ttsFeedback: 'मराठी निवडली गेली' },
  { code: 'gu', native: 'ગુજરાતી', english: 'Gujarati', ttsFeedback: 'ગુજરાતી પસંદ કરવામાં આવી' },
  { code: 'kn', native: 'ಕನ್ನಡ', english: 'Kannada', ttsFeedback: 'ಕನ್ನಡ ಆಯ್ಕೆ ಮಾಡಲಾಗಿದೆ' },
  { code: 'mai', native: 'मैथिली', english: 'Maithili', ttsFeedback: 'मैथिली चुनल गेल' },
  { code: 'bho', native: 'भोजपुरी', english: 'Bhojpuri', ttsFeedback: 'भोजपुरी चुनल गइल' },
  { code: 'or', native: 'ଓଡ଼ିଆ', english: 'Odia', ttsFeedback: 'ଓଡ଼ିଆ ବଛାଗଲା' },
  { code: 'pa', native: 'ਪੰਜਾਬੀ', english: 'Punjabi', ttsFeedback: 'ਪੰਜਾਬੀ ਚੁਣੀ ਗਈ' },
];

export const LanguageSelectScreen: React.FC<LanguageSelectScreenProps> = ({
  onSelectLanguage,
  currentLanguage = 'hi',
  isAudioMuted = false,
}) => {
  const [selectedLang, setSelectedLang] = useState<Language>(currentLanguage);

  useEffect(() => {
    setSelectedLang(currentLanguage);
  }, [currentLanguage]);

  useEffect(() => {
    if (isAudioMuted) return;
    const timer = window.setTimeout(() => speak('अपनी भाषा चुनें। Choose your language.', 'hi'), 350);
    return () => {
      window.clearTimeout(timer);
      stopSpeech();
    };
  }, [isAudioMuted]);

  const handleSpeakTitle = () => {
    console.log('Button clicked:', 'language-title-voice');
    speak('अपनी भाषा चुनें। नीचे दिए गए विकल्प में से एक चुनें। Choose your language.', currentLanguage);
  };

  const handleLanguageTap = (language: LanguageOption) => {
    console.log('Button clicked:', `select-language-${language.code}`);
    setSelectedLang(language.code);
    if (!isAudioMuted) speak(language.ttsFeedback, language.code);
    onSelectLanguage(language.code);
  };

  return (
    <main className="min-h-screen bg-white px-4 py-8 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-xl flex-col">
        <header className="mb-8 text-center">
          <p className="text-3xl font-bold tracking-tight text-[#111827]">कारीगर</p>
          <p className="mt-1 text-base text-[#6B7280]">हुनर से बाज़ार तक</p>
        </header>

        <section className="mb-6 flex items-center justify-between gap-4 border-b border-[#E5E7EB] pb-5">
          <div className="min-w-0">
            <h1 className="break-words text-2xl font-semibold text-[#111827]">अपनी भाषा चुनें</h1>
            <p className="mt-1 text-base text-[#6B7280]">Choose your language</p>
          </div>
          <button
            type="button"
            onClick={handleSpeakTitle}
            className="flex min-h-14 shrink-0 items-center gap-2 rounded-lg border border-[#E5E7EB] px-4 text-base font-semibold text-[#111827] transition-colors hover:border-[#FF6B35] hover:text-[#FF6B35]"
          >
            <Volume2 className="h-5 w-5 text-[#FF6B35]" aria-hidden="true" />
            <span className="hidden sm:inline">सुनें</span>
            <span className="sr-only">आवाज़ में सुनें</span>
          </button>
        </section>

        <div className="grid grid-cols-2 gap-3 sm:gap-4" aria-label="भाषा विकल्प">
          {LANGUAGES.map((language) => {
            const isActive = selectedLang === language.code;
            return (
              <button
                type="button"
                key={language.code}
                onClick={() => handleLanguageTap(language)}
                className={`flex min-h-20 min-w-0 items-center justify-between gap-3 rounded-lg border-2 px-4 py-3 text-left transition-colors ${
                  isActive
                    ? 'border-[#FF6B35] bg-[#FFF7F2]'
                    : 'border-[#E5E7EB] bg-white hover:border-[#FF6B35]'
                }`}
                aria-pressed={isActive}
              >
                <span className="min-w-0">
                  <span className={`block break-words text-lg font-semibold ${isActive ? 'text-[#FF6B35]' : 'text-[#111827]'}`}>
                    {language.native}
                  </span>
                  <span className="mt-1 block text-sm text-[#6B7280]">{language.english}</span>
                </span>
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${isActive ? 'border-[#FF6B35] bg-[#FF6B35] text-white' : 'border-[#D1D5DB] text-transparent'}`}>
                  <Check className="h-4 w-4" aria-hidden="true" />
                </span>
              </button>
            );
          })}
        </div>

        <p className="mt-auto pt-8 text-center text-sm text-[#6B7280]">हर स्क्रीन पर आवाज़ की सहायता उपलब्ध है</p>
      </div>
    </main>
  );
};
