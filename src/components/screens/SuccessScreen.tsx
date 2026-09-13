import React, { useEffect } from 'react';
import { Sparkles, ArrowRight, Camera, ShoppingBag, Award, CheckCircle2 } from 'lucide-react';
import { Language, Product } from '../../types';
import { TRANSLATIONS } from '../../utils/translations';
import { speak } from '../../utils/speech';
import { AudioSpeakerButton } from '../common/AudioSpeakerButton';

interface SuccessScreenProps {
  product: Product;
  language: Language;
  onViewInMarketplace: () => void;
  onCreateAnother: () => void;
  isAudioMuted: boolean;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({
  product,
  language,
  onViewInMarketplace,
  onCreateAnother,
  isAudioMuted,
}) => {
  const t = TRANSLATIONS[language];

  useEffect(() => {
    if (!isAudioMuted) {
      speak('बधाई हो! आपकी लिस्टिंग सफलतापूर्वक प्रकाशित हुई!', language);
    }
  }, [isAudioMuted, language]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4 sm:p-6 select-none">
      <div className="w-full max-w-md bg-white rounded-xl p-6 sm:p-8 shadow-lg border border-stone-200 text-center relative overflow-hidden">
        {/* Celebration badge */}
        <div className="w-16 h-16 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>Product Live on National Catalog</span>
          </div>
          <AudioSpeakerButton
            text="बधाई हो! आपका उत्पाद प्रकाशित हो गया है।"
            language={language}
            isMuted={isAudioMuted}
            size="sm"
          />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mb-2">
          {t.successTitle}
        </h1>
        <p className="text-sm text-stone-600 mb-6">
          {t.successSubtitle}
        </p>

        {/* Product mini card */}
        <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center gap-3.5 text-left mb-6">
          <img
            src={product.imagePaths[0]}
            alt={product.title}
            className="w-16 h-16 rounded-lg object-cover shadow-xs shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="min-w-0 flex-1">
            <span className="text-[10px] uppercase font-bold text-stone-800 bg-stone-200/80 px-1.5 py-0.5 rounded">
              {product.category}
            </span>
            <h3 className="font-bold text-sm text-stone-900 truncate mt-0.5">
              {product.title}
            </h3>
            <p className="text-base font-extrabold text-emerald-700">
              ₹{product.price}
            </p>
          </div>
          <AudioSpeakerButton
            text={`${product.title}, कीमत ${product.price} रुपये`}
            language={language}
            isMuted={isAudioMuted}
            size="sm"
          />
        </div>

        {/* Reward notice */}
        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 flex items-center gap-2 mb-6">
          <Award className="w-4 h-4 text-[#B4431E] shrink-0" />
          <span>Listing verified! You earn 5 tokens on every sale.</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={onViewInMarketplace}
            id="success-view-marketplace-btn"
            className="w-full min-h-[52px] h-13 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-base shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>{t.viewMarketplace}</span>
          </button>

          <button
            type="button"
            onClick={onCreateAnother}
            id="success-create-another-btn"
            className="w-full min-h-[52px] h-13 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-base border border-stone-300 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Camera className="w-5 h-5 text-[#B4431E]" />
            <span>{t.createAnother}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
