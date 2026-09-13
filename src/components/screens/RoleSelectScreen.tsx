import React, { useEffect } from 'react';
import { Palette, ShoppingBag, Globe, ArrowRight, Volume2, Sparkles, CheckCircle2 } from 'lucide-react';
import { UserRole, Language } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { LANGUAGE_AUDIO_FEEDBACK } from '../../utils/translations';
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
  const { t } = useLanguage();

  // Auto-play voice prompt on mount
  useEffect(() => {
    if (!isAudioMuted) {
      const audioPrompt = LANGUAGE_AUDIO_FEEDBACK[language]?.rolePrompt || 'आप कौन हैं? चुनें: कारीगर या खरीदार';
      const timer = setTimeout(() => {
        speak(audioPrompt, language);
      }, 350);
      return () => {
        clearTimeout(timer);
        stopSpeech();
      };
    }
  }, [language, isAudioMuted]);

  const handleHearRole = (e: React.MouseEvent, role: UserRole) => {
    e.stopPropagation();
    if (!isAudioMuted) {
      if (role === 'seller') {
        speak(`${t('sellerRole')}. ${t('sellerDesc')}`, language);
      } else {
        speak(`${t('buyerRole')}. ${t('buyerDesc')}`, language);
      }
    }
  };

  const handleSelect = (role: UserRole) => {
    if (!isAudioMuted) {
      if (role === 'seller') {
        speak(`${t('sellerRole')}. अपना मोबाइल नंबर डालें।`, language);
      } else {
        speak(`${t('buyerRole')}. बाज़ार में आपका स्वागत है।`, language);
      }
    }
    onSelectRole(role);
  };

  const currentLangName = LANGUAGE_NAMES[language] || language;

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4 sm:p-6 md:p-8 select-none">
      <div className="w-full max-w-3xl bg-white rounded-xl p-6 sm:p-8 md:p-10 shadow-sm border border-stone-200 space-y-6">
        {/* Top Header: Logo & Language Switcher */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-[#B4431E] flex items-center justify-center text-white shadow-xs">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 leading-none">
                {t('appName')}
              </h1>
              <span className="text-xs text-stone-500 font-medium">
                "{t('tagline')}"
              </span>
            </div>
          </div>

          {onChangeLanguage && (
            <button
              type="button"
              onClick={onChangeLanguage}
              className="min-h-[44px] px-3 py-2 rounded-lg bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
              title="Change language / भाषा बदलें"
            >
              <Globe className="w-4 h-4 text-[#B4431E]" />
              <span>{currentLangName}</span>
              <span className="text-[11px] text-[#B4431E] underline">(बदलें)</span>
            </button>
          )}
        </div>

        {/* Question Title & Audio Speaker */}
        <div className="flex items-center justify-between gap-3 bg-stone-50 p-4 rounded-lg border border-stone-200">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-stone-900">
              {t('whoAreYou')}
            </h2>
            <p className="text-xs text-stone-600">
              Select your path to continue to the marketplace
            </p>
          </div>
          <AudioSpeakerButton
            text={`${t('whoAreYou')}. ${t('sellerRole')}, अथवा ${t('buyerRole')}`}
            language={language}
            isMuted={isAudioMuted}
            label="सुनें"
            className="bg-white border-stone-300 text-stone-800"
          />
        </div>

        {/* 2-Column Responsive Card Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. Artisan / Seller Card */}
          <div
            onClick={() => handleSelect('seller')}
            id="role-select-seller-card"
            className="border-2 border-stone-200 hover:border-[#B4431E] bg-stone-50/50 hover:bg-amber-50/20 rounded-xl p-5 sm:p-6 transition-all cursor-pointer flex flex-col justify-between group shadow-xs hover:shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-lg bg-[#B4431E]/10 text-[#B4431E] flex items-center justify-center group-hover:bg-[#B4431E] group-hover:text-white transition-colors">
                  <Palette className="w-6 h-6" />
                </div>
                <button
                  type="button"
                  onClick={(e) => handleHearRole(e, 'seller')}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-md hover:bg-stone-200 text-stone-500 cursor-pointer"
                  title="Listen to option"
                >
                  <Volume2 className="w-4 h-4 text-[#B4431E]" />
                </button>
              </div>

              <div>
                <h3 className="text-lg font-bold text-stone-900 group-hover:text-[#B4431E] transition-colors">
                  {t('sellerRole')}
                </h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  {t('sellerDesc')}
                </p>
              </div>

              <div className="space-y-1 text-xs text-stone-500 pt-1">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>AI voice-guided photo cataloging</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Direct customer sales & token rewards</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-stone-200 flex items-center justify-between text-xs font-bold text-[#B4431E]">
              <span>Enter Artisan Studio</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 2. Craft Buyer Card */}
          <div
            onClick={() => handleSelect('buyer')}
            id="role-select-buyer-card"
            className="border-2 border-stone-200 hover:border-[#D97706] bg-stone-50/50 hover:bg-yellow-50/20 rounded-xl p-5 sm:p-6 transition-all cursor-pointer flex flex-col justify-between group shadow-xs hover:shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-lg bg-[#D97706]/10 text-[#D97706] flex items-center justify-center group-hover:bg-[#D97706] group-hover:text-white transition-colors">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <button
                  type="button"
                  onClick={(e) => handleHearRole(e, 'buyer')}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-md hover:bg-stone-200 text-stone-500 cursor-pointer"
                  title="Listen to option"
                >
                  <Volume2 className="w-4 h-4 text-[#D97706]" />
                </button>
              </div>

              <div>
                <h3 className="text-lg font-bold text-stone-900 group-hover:text-[#D97706] transition-colors">
                  {t('buyerRole')}
                </h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  {t('buyerDesc')}
                </p>
              </div>

              <div className="space-y-1 text-xs text-stone-500 pt-1">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>100% authentic GI certified Indian crafts</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Fair pricing direct from rural makers</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-stone-200 flex items-center justify-between text-xs font-bold text-[#D97706]">
              <span>Explore Marketplace</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Footer Hint */}
        <div className="flex items-center justify-center gap-2 text-xs text-stone-400 font-medium pt-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Support Rural Artisans · No Commission Middlemen</span>
        </div>
      </div>
    </div>
  );
};
