import React, { useState } from 'react';
import { Globe, HelpCircle, Info, LogIn, MessageCircle, UserRound } from 'lucide-react';
import { Language } from '../../types';
import { speak } from '../../utils/speech';

interface SellerGuestProfileScreenProps {
  language: Language;
  isAudioMuted: boolean;
  onLogin: () => void;
  onChangeLanguage: () => void;
}

export const SellerGuestProfileScreen: React.FC<SellerGuestProfileScreenProps> = ({
  language,
  isAudioMuted,
  onLogin,
  onChangeLanguage,
}) => {
  const [notice, setNotice] = useState<string>('');

  const showNotice = (message: string) => {
    console.log('Button clicked:', message);
    setNotice(message);
    if (!isAudioMuted) speak(message, language);
  };

  return (
    <section className="mx-auto w-full max-w-2xl space-y-5 pb-24">
      <header className="border-b border-[#E5E7EB] pb-5">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#FFF1EA] text-[#FF6B35]">
            <UserRound className="h-6 w-6" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h1 className="break-words text-2xl font-semibold text-[#111827]">प्रोफ़ाइल</h1>
            <p className="mt-1 text-base text-[#6B7280]">आप Guest के रूप में देख रहे हैं</p>
          </div>
        </div>
      </header>

      <section className="rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-5">
        <h2 className="text-lg font-semibold text-[#111827]">Account बनाएं</h2>
        <ul className="mt-3 space-y-2 text-base text-[#6B7280]">
          <li className="break-words">• अपनी listings सुरक्षित रखें</li>
          <li className="break-words">• tokens कमाएं</li>
          <li className="break-words">• कई कारीगरों को manage करें</li>
        </ul>
        <button
          type="button"
          onClick={() => {
            console.log('Button clicked:', 'guest-login');
            onLogin();
          }}
          className="mt-5 flex min-h-14 w-full items-center justify-center gap-2 rounded-lg bg-[#FF6B35] px-4 text-base font-semibold text-white hover:bg-[#E85D2A]"
        >
          <LogIn className="h-5 w-5" aria-hidden="true" />
          Login with Mobile Number
        </button>
      </section>

      <section className="divide-y divide-[#E5E7EB] rounded-lg border border-[#E5E7EB] bg-white">
        <button
          type="button"
          onClick={() => {
            console.log('Button clicked:', 'guest-change-language');
            onChangeLanguage();
          }}
          className="flex min-h-16 w-full items-center gap-3 px-4 text-left hover:bg-[#F9FAFB]"
        >
          <Globe className="h-5 w-5 shrink-0 text-[#FF6B35]" aria-hidden="true" />
          <span className="min-w-0 flex-1 break-words text-base font-semibold text-[#111827]">भाषा बदलें</span>
          <span className="text-sm text-[#6B7280]">{language.toUpperCase()}</span>
        </button>
        <button
          type="button"
          onClick={() => showNotice('कारीगर इस्तेमाल करने के लिए Home पर कैमरा खोलें और तीन फोटो लें।')}
          className="flex min-h-16 w-full items-center gap-3 px-4 text-left hover:bg-[#F9FAFB]"
        >
          <HelpCircle className="h-5 w-5 shrink-0 text-[#FF6B35]" aria-hidden="true" />
          <span className="min-w-0 break-words text-base font-semibold text-[#111827]">कारीगर कैसे इस्तेमाल करें</span>
        </button>
        <button
          type="button"
          onClick={() => showNotice('सहायता के लिए support@karighar.app पर संपर्क करें।')}
          className="flex min-h-16 w-full items-center gap-3 px-4 text-left hover:bg-[#F9FAFB]"
        >
          <MessageCircle className="h-5 w-5 shrink-0 text-[#FF6B35]" aria-hidden="true" />
          <span className="min-w-0 break-words text-base font-semibold text-[#111827]">Contact Support</span>
        </button>
        <button
          type="button"
          onClick={() => showNotice('कारीगर भारत के handmade products को बाज़ार तक पहुंचाने में मदद करता है।')}
          className="flex min-h-16 w-full items-center gap-3 px-4 text-left hover:bg-[#F9FAFB]"
        >
          <Info className="h-5 w-5 shrink-0 text-[#FF6B35]" aria-hidden="true" />
          <span className="min-w-0 break-words text-base font-semibold text-[#111827]">कारीगर के बारे में</span>
        </button>
      </section>

      {notice && (
        <p className="rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-4 text-base leading-6 text-[#6B7280]" role="status">
          {notice}
        </p>
      )}
    </section>
  );
};
