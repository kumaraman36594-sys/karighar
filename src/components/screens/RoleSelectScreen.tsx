import React, { useEffect } from 'react';
import { ArrowRight, Globe, Store, ShoppingBag, Sparkles, Camera, Mic, Coins, ShieldCheck, HeartHandshake } from 'lucide-react';
import { UserRole, Language } from '../../types';
import { getTranslation, LANGUAGE_AUDIO_FEEDBACK } from '../../utils/translations';
import { speak, stopSpeech } from '../../services/voiceService';
import { LANGUAGE_NAMES } from '../../utils/speech';
import { KarigharWordmark } from '../common/KarigharWordmark';
import { AudioSpeakerButton } from '../common/AudioSpeakerButton';

interface RoleSelectScreenProps {
  language: Language;
  onSelectRole: (role: UserRole) => void;
  onChangeLanguage?: () => void;
  isAudioMuted?: boolean;
}

const ROLE_SPEECHES: Record<string, { hi: string; en: string }> = {
  seller: {
    hi: 'मैं कारीगर हूँ। अपने हस्तनिर्मित सामान की फोटो खींचें, बोलकर विवरण दें और ऑनलाइन बेचें।',
    en: 'I am an Artisan. Take photos of your handmade crafts, speak in your language, and sell online.',
  },
  buyer: {
    hi: 'मैं खरीदार हूँ। भारत के स्थानीय कारीगरों से सीधे प्रामाणिक हस्तशिल्प खरीदें।',
    en: 'I am a Buyer. Discover authentic handcrafted goods directly from Indian rural artisans.',
  },
};

export const RoleSelectScreen: React.FC<RoleSelectScreenProps> = ({
  language,
  onSelectRole,
  onChangeLanguage,
  isAudioMuted = false,
}) => {
  const t = getTranslation(language);

  // Auto-play voice prompt on mount
  useEffect(() => {
    if (!isAudioMuted) {
      const audioPrompt =
        LANGUAGE_AUDIO_FEEDBACK[language]?.rolePrompt ||
        t.whoAreYou ||
        'आप कारीगर हैं या खरीदार?';
      const timer = setTimeout(() => {
        speak(audioPrompt, language);
      }, 350);
      return () => {
        clearTimeout(timer);
        stopSpeech();
      };
    }
  }, [language, isAudioMuted, t.whoAreYou]);

  const handleSelect = (role: UserRole) => {
    console.log('Button clicked:', `role-select-${role}`);
    if (!isAudioMuted) {
      if (role === 'seller') {
        speak(`${t.sellerRole}। अपना मोबाइल नंबर डालें।`, language);
      } else {
        speak(`${t.buyerRole}। बाज़ार में आपका स्वागत है।`, language);
      }
    }
    onSelectRole(role);
  };

  const currentLangName = LANGUAGE_NAMES[language] || language;

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between p-4 sm:p-6 max-w-xl mx-auto font-sans">
      <div className="space-y-6 pt-2">
        {/* Top Header: Wordmark and Language Switcher */}
        <div className="flex items-center justify-between gap-3 border-b border-[#E5E7EB] pb-3">
          <KarigharWordmark size="md" align="left" />

          {onChangeLanguage && (
            <button
              type="button"
              onClick={() => {
                console.log('Button clicked:', 'role-change-language');
                onChangeLanguage();
              }}
              id="role-change-language-btn"
              className="min-h-[44px] px-3 py-1.5 rounded-lg bg-[#F9FAFB] hover:bg-stone-100 text-[#111827] border border-[#E5E7EB] transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer shadow-xs shrink-0"
              title="Change language / भाषा बदलें"
            >
              <Globe className="w-3.5 h-3.5 text-[#FF6B35]" />
              <span>{currentLangName}</span>
              <span className="text-[11px] text-[#6B7280] font-normal underline ml-0.5">(बदलें)</span>
            </button>
          )}
        </div>

        {/* Question Banner & Audio Speaker */}
        <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">
              {t.whoAreYou || 'आप कौन हैं?'}
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
              अपनी भूमिका चुनें / Choose your role to continue
            </p>
          </div>

          <AudioSpeakerButton
            text={
              LANGUAGE_AUDIO_FEEDBACK[language]?.rolePrompt ||
              'आप कारीगर हैं या खरीदार? क्या आप सामान बेचना चाहते हैं या खरीदना?'
            }
            language={language}
            size="md"
            variant="primary"
            label="सवाल सुनें"
            id="role-hear-question-btn"
            title="सवाल सुनें / Listen to question"
            className="w-full sm:w-auto min-h-[48px] px-4 py-2 bg-[#FF6B35] text-white hover:bg-[#E05A2B] rounded-lg cursor-pointer"
          />
        </div>

        {/* Two Stacked Role Cards */}
        <div className="space-y-4">
          {/* Card 1: Artisan / Seller */}
          <div
            id="role-seller-card"
            role="button"
            tabIndex={0}
            onClick={() => handleSelect('seller')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSelect('seller');
              }
            }}
            className="w-full p-4 sm:p-5 rounded-lg border border-[#E5E7EB] hover:border-[#FF6B35] active:border-[#FF6B35] bg-white hover:bg-orange-50/20 transition-all text-left shadow-xs cursor-pointer group select-none relative"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Photo & Main Details */}
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-lg overflow-hidden shrink-0 border border-[#E5E7EB] relative bg-stone-100">
                  <img
                    src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&auto=format&fit=crop&q=80"
                    alt="Indian artisan crafting pottery"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-1 left-1 bg-[#111827]/80 backdrop-blur-xs text-white p-1 rounded">
                    <Store className="w-3 h-3 text-[#FF6B35]" />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-bold text-lg sm:text-xl text-[#111827] leading-tight group-hover:text-[#FF6B35] transition-colors">
                      {t.sellerRole || 'मैं कारीगर हूँ'}
                    </h2>
                    <span className="text-[11px] font-semibold bg-orange-100 text-[#FF6B35] px-2 py-0.5 rounded">
                      Artisan / Seller
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#4B5563] mt-1 leading-snug line-clamp-2">
                    {t.sellerDesc || 'उत्पाद सूचीबद्ध करें और बेचें'} — Photo kheecho, aasaani se becho
                  </p>
                </div>
              </div>

              {/* Speaker & Action Button */}
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E5E7EB] shrink-0">
                <AudioSpeakerButton
                  text={ROLE_SPEECHES.seller[language === 'en' ? 'en' : 'hi']}
                  language={language}
                  size="sm"
                  variant="subtle"
                  id="hear-role-seller-btn"
                  title="कारीगर विवरण सुनें"
                  className="min-h-[44px] min-w-[44px] rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800"
                />

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect('seller');
                  }}
                  id="btn-start-seller"
                  className="min-h-[44px] px-4 py-2 rounded-lg bg-[#111827] text-white hover:bg-black font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs ml-auto sm:ml-0"
                >
                  <span>शुरू करें</span>
                  <ArrowRight className="w-4 h-4 text-[#FF6B35]" />
                </button>
              </div>
            </div>

            {/* Feature Pills */}
            <div className="mt-3.5 pt-3 border-t border-[#F3F4F6] flex flex-wrap items-center gap-2 text-[11px] text-[#4B5563] font-medium">
              <span className="inline-flex items-center gap-1 bg-[#F9FAFB] px-2.5 py-1 rounded border border-[#E5E7EB]">
                <Camera className="w-3.5 h-3.5 text-[#FF6B35]" />
                Guided 3-Photo Camera
              </span>
              <span className="inline-flex items-center gap-1 bg-[#F9FAFB] px-2.5 py-1 rounded border border-[#E5E7EB]">
                <Mic className="w-3.5 h-3.5 text-blue-600" />
                Voice AI Assistant
              </span>
              <span className="inline-flex items-center gap-1 bg-[#F9FAFB] px-2.5 py-1 rounded border border-[#E5E7EB]">
                <Coins className="w-3.5 h-3.5 text-amber-500" />
                Earn Token Rewards
              </span>
            </div>
          </div>

          {/* Card 2: Buyer / Collector */}
          <div
            id="role-buyer-card"
            role="button"
            tabIndex={0}
            onClick={() => handleSelect('buyer')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSelect('buyer');
              }
            }}
            className="w-full p-4 sm:p-5 rounded-lg border border-[#E5E7EB] hover:border-emerald-600 active:border-emerald-600 bg-white hover:bg-emerald-50/20 transition-all text-left shadow-xs cursor-pointer group select-none relative"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Photo & Main Details */}
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-lg overflow-hidden shrink-0 border border-[#E5E7EB] relative bg-stone-100">
                  <img
                    src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&auto=format&fit=crop&q=80"
                    alt="Authentic handcrafted craft collection"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-1 left-1 bg-[#111827]/80 backdrop-blur-xs text-white p-1 rounded">
                    <ShoppingBag className="w-3 h-3 text-emerald-400" />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-bold text-lg sm:text-xl text-[#111827] leading-tight group-hover:text-emerald-700 transition-colors">
                      {t.buyerRole || 'मैं खरीदार हूँ'}
                    </h2>
                    <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      Buyer / Explorer
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#4B5563] mt-1 leading-snug line-clamp-2">
                    {t.buyerDesc || 'सत्यापित हस्तशिल्प खरीदें'} — Direct from rural Indian artisans
                  </p>
                </div>
              </div>

              {/* Speaker & Action Button */}
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E5E7EB] shrink-0">
                <AudioSpeakerButton
                  text={ROLE_SPEECHES.buyer[language === 'en' ? 'en' : 'hi']}
                  language={language}
                  size="sm"
                  variant="subtle"
                  id="hear-role-buyer-btn"
                  title="खरीदार विवरण सुनें"
                  className="min-h-[44px] min-w-[44px] rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800"
                />

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect('buyer');
                  }}
                  id="btn-start-buyer"
                  className="min-h-[44px] px-4 py-2 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs ml-auto sm:ml-0"
                >
                  <span>बाज़ार देखें</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Feature Pills */}
            <div className="mt-3.5 pt-3 border-t border-[#F3F4F6] flex flex-wrap items-center gap-2 text-[11px] text-[#4B5563] font-medium">
              <span className="inline-flex items-center gap-1 bg-[#F9FAFB] px-2.5 py-1 rounded border border-[#E5E7EB]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                100% Authentic Indian Crafts
              </span>
              <span className="inline-flex items-center gap-1 bg-[#F9FAFB] px-2.5 py-1 rounded border border-[#E5E7EB]">
                <HeartHandshake className="w-3.5 h-3.5 text-purple-600" />
                Direct from Artisans
              </span>
              <span className="inline-flex items-center gap-1 bg-[#F9FAFB] px-2.5 py-1 rounded border border-[#E5E7EB]">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Fair Trade Value
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info Notice */}
      <div className="pt-6 pb-2 text-center text-xs text-[#6B7280]">
        💡 आप बाद में कभी भी ऊपर दिए टॉगल से विक्रेता या खरीदार मोड बदल सकते हैं।
      </div>
    </div>
  );
};
