import React, { useEffect } from 'react';
import { ArrowRight, Globe, Palette, ShoppingBag, Volume2 } from 'lucide-react';
import { Language, UserRole } from '../../types';
import { LANGUAGE_NAMES } from '../../utils/speech';
import { speak, stopSpeech } from '../../services/voiceService';

interface RoleSelectScreenProps {
  language: Language;
  onSelectRole: (role: UserRole) => void;
  onChangeLanguage?: () => void;
  isAudioMuted?: boolean;
}

const ROLE_COPY: Record<UserRole, { title: string; subtitle: string; speech: string }> = {
  seller: {
    title: 'मैं कारीगर हूँ',
    subtitle: 'अपना उत्पाद बेचें',
    speech: 'मैं कारीगर हूँ। अपना उत्पाद दिखाकर बेचें।',
  },
  buyer: {
    title: 'मैं खरीदार हूँ',
    subtitle: 'खरीदें हस्तनिर्मित उत्पाद',
    speech: 'मैं खरीदार हूँ। भारत के कारीगरों से हस्तनिर्मित उत्पाद खरीदें।',
  },
};

export const RoleSelectScreen: React.FC<RoleSelectScreenProps> = ({
  language,
  onSelectRole,
  onChangeLanguage,
  isAudioMuted = false,
}) => {
  useEffect(() => {
    if (isAudioMuted) return;
    const timer = window.setTimeout(() => speak('आप कारीगर हैं या खरीदार? अपनी भूमिका चुनें।', language), 350);
    return () => {
      window.clearTimeout(timer);
      stopSpeech();
    };
  }, [isAudioMuted, language]);

  const handleSelect = (role: UserRole) => {
    console.log('Button clicked:', `role-select-${role}`);
    if (!isAudioMuted) speak(ROLE_COPY[role].speech, language);
    onSelectRole(role);
  };

  const handleSpeakRole = (role: UserRole, event: React.MouseEvent) => {
    event.stopPropagation();
    console.log('Button clicked:', `role-description-${role}`);
    speak(ROLE_COPY[role].speech, language);
  };

  const currentLanguage = LANGUAGE_NAMES[language] || language;

  return (
    <main className="min-h-screen bg-white px-4 py-8 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-xl flex-col">
        <header className="mb-8 flex items-start justify-between gap-4 border-b border-[#E5E7EB] pb-5">
          <div>
            <p className="text-3xl font-bold tracking-tight text-[#111827]">कारीगर</p>
            <p className="mt-1 text-base text-[#6B7280]">हुनर से बाज़ार तक</p>
          </div>
          {onChangeLanguage && (
            <button
              type="button"
              onClick={() => {
                console.log('Button clicked:', 'role-change-language');
                onChangeLanguage();
              }}
              className="flex min-h-14 shrink-0 items-center gap-2 rounded-lg border border-[#E5E7EB] px-3 text-sm font-semibold text-[#111827] hover:border-[#FF6B35] hover:text-[#FF6B35]"
            >
              <Globe className="h-5 w-5 text-[#FF6B35]" aria-hidden="true" />
              <span className="hidden sm:inline">{currentLanguage}</span>
              <span className="sm:hidden">भाषा</span>
            </button>
          )}
        </header>

        <section className="mb-6 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="break-words text-2xl font-semibold text-[#111827]">आप कौन हैं?</h1>
            <p className="mt-1 text-base text-[#6B7280]">अपनी भूमिका चुनें</p>
          </div>
          <button
            type="button"
            onClick={() => {
              console.log('Button clicked:', 'role-question-voice');
              speak('आप कारीगर हैं या खरीदार? अपनी भूमिका चुनें।', language);
            }}
            className="flex min-h-14 shrink-0 items-center gap-2 rounded-lg border border-[#E5E7EB] px-4 text-base font-semibold text-[#111827] hover:border-[#FF6B35] hover:text-[#FF6B35]"
          >
            <Volume2 className="h-5 w-5 text-[#FF6B35]" aria-hidden="true" />
            <span className="hidden sm:inline">सवाल सुनें</span>
            <span className="sr-only">भूमिका का सवाल सुनें</span>
          </button>
        </section>

        <div className="space-y-4">
          <RoleCard
            role="seller"
            icon={<Palette className="h-8 w-8" aria-hidden="true" />}
            onSelect={handleSelect}
            onSpeak={handleSpeakRole}
          />
          <RoleCard
            role="buyer"
            icon={<ShoppingBag className="h-8 w-8" aria-hidden="true" />}
            onSelect={handleSelect}
            onSpeak={handleSpeakRole}
          />
        </div>

        <p className="mt-auto pt-8 text-center text-sm text-[#6B7280]">बाद में कभी भी अपनी भाषा बदल सकते हैं</p>
      </div>
    </main>
  );
};

interface RoleCardProps {
  role: UserRole;
  icon: React.ReactNode;
  onSelect: (role: UserRole) => void;
  onSpeak: (role: UserRole, event: React.MouseEvent) => void;
}

const RoleCard: React.FC<RoleCardProps> = ({ role, icon, onSelect, onSpeak }) => {
  const copy = ROLE_COPY[role];
  return (
    <div className="flex min-w-0 items-center gap-4 rounded-lg border border-[#E5E7EB] p-5 transition-colors hover:border-[#FF6B35]">
      <button
        type="button"
        onClick={() => onSelect(role)}
        className="flex min-w-0 flex-1 items-center gap-4 text-left"
      >
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-[#FFF1EA] text-[#FF6B35]">{icon}</span>
        <span className="min-w-0">
          <span className="block break-words text-xl font-semibold text-[#111827]">{copy.title}</span>
          <span className="mt-1 block break-words text-base text-[#6B7280]">{copy.subtitle}</span>
        </span>
        <ArrowRight className="h-6 w-6 shrink-0 text-[#FF6B35]" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={(event) => onSpeak(role, event)}
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-[#E5E7EB] text-[#FF6B35] hover:border-[#FF6B35]"
        aria-label={`${copy.title} का विवरण सुनें`}
      >
        <Volume2 className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );
};
