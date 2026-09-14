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
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-md bg-white rounded-xl p-6 sm:p-7 shadow-xs border border-stone-200 text-center relative">
        {/* Verification badge */}
        <div className="w-14 h-14 rounded-xl bg-stone-900 text-white flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-7 h-7 text-emerald-400" />
        </div>

        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-stone-100 border border-stone-200 text-stone-800 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Product Live on Catalog</span>
          </div>
          <AudioSpeakerButton
            text="बधाई हो! आपका उत्पाद प्रकाशित हो गया है।"
            language={language}
            isMuted={isAudioMuted}
            size="sm"
          />
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-stone-900 mb-1">
          {t.successTitle}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mb-5">
          {t.successSubtitle}
        </p>

        {/* Product mini card */}
        <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex items-center gap-3 text-left mb-5">
          <img
            src={product.imagePaths[0]}
            alt={product.title}
            className="w-14 h-14 rounded-md object-cover border border-stone-200 shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="min-w-0 flex-1">
            <span className="text-[10px] uppercase font-semibold text-stone-600 bg-white px-1.5 py-0.5 rounded border border-stone-200">
              {product.category}
            </span>
            <h3 className="font-bold text-xs sm:text-sm text-stone-900 truncate mt-0.5">
              {product.title}
            </h3>
            <p className="text-sm font-bold text-stone-900">
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
        <div className="p-2.5 bg-amber-50/70 rounded-lg border border-amber-200 text-xs text-amber-900 flex items-center gap-2 mb-5">
          <Award className="w-4 h-4 text-amber-700 shrink-0" />
          <span className="font-medium">Listing verified! You earn 5 tokens on every sale.</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={onViewInMarketplace}
            id="success-view-marketplace-btn"
            className="w-full h-11 rounded-lg bg-stone-900 hover:bg-black text-white font-bold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{t.viewMarketplace}</span>
          </button>

          <button
            onClick={onCreateAnother}
            id="success-create-another-btn"
            className="w-full h-11 rounded-lg bg-white hover:bg-stone-50 text-stone-800 font-semibold text-xs sm:text-sm border border-stone-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>{t.createAnother}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

