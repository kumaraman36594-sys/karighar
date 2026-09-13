import React, { useEffect } from 'react';
import { Volume2, ArrowRight, Globe, Sparkles } from 'lucide-react';
import { UserRole, Language } from '../../types';
import { getTranslation, LANGUAGE_AUDIO_FEEDBACK } from '../../utils/translations';
import { speak, stopSpeech, LANGUAGE_NAMES } from '../../utils/speech';
import { AudioSpeakerButton } from '../common/AudioSpeakerButton';

interface RoleSelectScreenProps {
  language: Language;
  onSelectRole: (role: UserRole) => void;
  onChangeLanguage?: () => void;
  isAudioMuted: boolean;
}

export const RoleSelectScreen: React.FC<RoleSelectScreenProps> = ({
  language,
  onSelectRole,
  onChangeLanguage,
  isAudioMuted,
}) => {
  const t = getTranslation(language);

  // Auto-play voice prompt on mount
  useEffect(() => {
    if (!isAudioMuted) {
      const audioPrompt = LANGUAGE_AUDIO_FEEDBACK[language]?.rolePrompt || t.whoAreYou;
      const timer = setTimeout(() => {
        speak(audioPrompt, language);
      }, 350);
      return () => {
        clearTimeout(timer);
        stopSpeech();
      };
    }
  }, [language, isAudioMuted]);

  const handleHearQuestion = () => {
    if (!isAudioMuted) {
      const audioPrompt = LANGUAGE_AUDIO_FEEDBACK[language]?.rolePrompt || t.whoAreYou;
      speak(audioPrompt, language);
    }
  };

  const handleHearRole = (e: React.MouseEvent, role: UserRole) => {
    e.stopPropagation();
    if (!isAudioMuted) {
      if (role === 'seller') {
        speak(`${t.sellerRole}. ${t.sellerDesc}`, language);
      } else {
        speak(`${t.buyerRole}. ${t.buyerDesc}`, language);
      }
    }
  };

  const handleSelect = (role: UserRole) => {
    if (!isAudioMuted) {
      if (role === 'seller') {
        speak(`${t.sellerRole}. अपना मोबाइल नंबर डालें।`, language);
      } else {
        speak(`${t.buyerRole}. बाज़ार में आपका स्वागत है।`, language);
      }
    }
    onSelectRole(role);
  };

  const currentLangName = LANGUAGE_NAMES[language] || language;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/70 flex items-center justify-center p-4 sm:p-6 py-8">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 relative space-y-6">
        {/* Top-Right: Language Selector Chip */}
        {onChangeLanguage && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onChangeLanguage}
              id="role-change-language-btn"
              className="px-3 py-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer shadow-xs"
              title="Change language / भाषा बदलें"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-600" />
              <span>{currentLangName}</span>
              <span className="text-[11px] text-indigo-500 underline font-normal">(बदलें)</span>
            </button>
          </div>
        )}

        {/* Top: App Logo & Tagline */}
        <div className="text-center space-y-2">
          <div className="w-18 h-18 mx-auto rounded-3xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white flex items-center justify-center text-4xl shadow-xl shadow-indigo-100">
            🎨
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {t.appName}
            </h1>
            <p className="text-sm font-semibold text-indigo-600">
              "{t.tagline}"
            </p>
          </div>
        </div>

        {/* Question: "आप कौन हैं?" with 🔊 Audio Button */}
        <div className="flex items-center justify-between gap-3 bg-indigo-50/70 p-4 rounded-2xl border border-indigo-100">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              {t.whoAreYou}
            </h2>
            <p className="text-sm text-gray-600 font-medium">
              Choose your role
            </p>
          </div>
          <AudioSpeakerButton
            text="आप कारीगर हैं या खरीदार? क्या आप सामान बेचना चाहते हैं या खरीदना?"
            language={language}
            size="lg"
            variant="primary"
            title="सवाल सुनें"
            id="role-hear-question-btn"
          />
        </div>

        {/* Two Large Cards Stacked Vertically */}
        <div className="space-y-4">
          {/* Card 1: 🎨 "मैं कारीगर हूँ" (Artisan) */}
          <div
            id="role-seller-card"
            onClick={() => handleSelect('seller')}
            className="relative min-h-[110px] p-5 rounded-3xl border-2 border-indigo-200 hover:border-indigo-600 bg-white hover:bg-indigo-50/40 shadow-md hover:shadow-xl shadow-indigo-100/50 transition-all transform hover:-translate-y-1 active:translate-y-0 cursor-pointer group overflow-hidden select-none"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Visual Image of Artisan making craft */}
                <div className="w-18 h-18 rounded-2xl overflow-hidden shadow-sm shrink-0 border border-indigo-100 relative">
                  <img
                    src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&auto=format&fit=crop&q=80"
                    alt="Artisan making craft"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-0 inset-x-0 bg-indigo-950/80 text-[10px] text-white text-center font-bold py-0.5">
                    🎨 कारीगर
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-extrabold text-2xl text-gray-900 group-hover:text-indigo-600 transition-colors leading-tight">
                    {t.sellerRole}
                  </h3>
                  <p className="text-gray-600 text-base mt-1 font-medium leading-snug">
                    {t.sellerDesc}
                  </p>
                </div>
              </div>

              {/* Hear button and Arrow */}
              <div className="flex items-center gap-2 shrink-0">
                <AudioSpeakerButton
                  text={`${t.sellerRole}। ${t.sellerDesc}। अपना उत्पाद बेचें।`}
                  language={language}
                  size="md"
                  variant="card"
                  title="विवरण सुनें"
                  id="hear-role-seller-btn"
                />
                <div className="w-11 h-11 rounded-2xl bg-[#667eea] text-white flex items-center justify-center group-hover:translate-x-1 transition-transform shadow-md">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-indigo-100/70 flex items-center justify-between text-xs text-indigo-700 font-bold">
              <span>📸 Guided 3-Photo Camera</span>
              <span>🎙️ Voice AI Assistant</span>
            </div>
          </div>

          {/* Card 2: 🛍️ "मैं खरीदार हूँ" (Buyer) */}
          <div
            id="role-buyer-card"
            onClick={() => handleSelect('buyer')}
            className="relative min-h-[110px] p-5 rounded-3xl border-2 border-emerald-200 hover:border-emerald-600 bg-white hover:bg-emerald-50/40 shadow-md hover:shadow-xl shadow-emerald-100/50 transition-all transform hover:-translate-y-1 active:translate-y-0 cursor-pointer group overflow-hidden select-none"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Visual Image of Person shopping handmade crafts */}
                <div className="w-18 h-18 rounded-2xl overflow-hidden shadow-sm shrink-0 border border-emerald-100 relative">
                  <img
                    src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&auto=format&fit=crop&q=80"
                    alt="Buyer shopping crafts"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-0 inset-x-0 bg-emerald-950/80 text-[10px] text-white text-center font-bold py-0.5">
                    🛍️ खरीदार
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-extrabold text-2xl text-gray-900 group-hover:text-emerald-700 transition-colors leading-tight">
                    {t.buyerRole}
                  </h3>
                  <p className="text-gray-600 text-base mt-1 font-medium leading-snug">
                    {t.buyerDesc}
                  </p>
                </div>
              </div>

              {/* Hear button and Arrow */}
              <div className="flex items-center gap-2 shrink-0">
                <AudioSpeakerButton
                  text={`${t.buyerRole}। ${t.buyerDesc}। खरीदें हस्तनिर्मित उत्पाद।`}
                  language={language}
                  size="md"
                  variant="card"
                  title="विवरण सुनें"
                  id="hear-role-buyer-btn"
                />
                <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center group-hover:translate-x-1 transition-transform shadow-md">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-emerald-100/70 flex items-center justify-between text-xs text-emerald-700 font-bold">
              <span>🏺 100% Authentic Handmade</span>
              <span>🤝 Direct from Artisans</span>
            </div>
          </div>
        </div>

        {/* Footer Hint */}
        <p className="text-center text-xs text-gray-500 font-medium">
          💡 आप बाद में कभी भी ऊपर दिए बटन से विक्रेता या खरीदार मोड बदल सकते हैं।
        </p>
      </div>
    </div>
  );
};
