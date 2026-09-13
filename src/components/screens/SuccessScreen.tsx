import React, { useEffect } from 'react';
import { Sparkles, ArrowRight, Camera, ShoppingBag, Award } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-amber-50 to-emerald-50 flex items-center justify-center p-4 sm:p-6 select-none">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-indigo-100 text-center relative overflow-hidden">
        {/* Confetti badge */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-white flex items-center justify-center text-4xl shadow-lg mx-auto mb-4 animate-bounce">
          🎉
        </div>

        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Product Live on National Catalog</span>
          </div>
          <AudioSpeakerButton
            text="बधाई हो! आपका उत्पाद प्रकाशित हो गया है।"
            language={language}
            isMuted={isAudioMuted}
            size="sm"
          />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
          {t.successTitle}
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          {t.successSubtitle}
        </p>

        {/* Product mini card */}
        <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 flex items-center gap-3.5 text-left mb-6">
          <img
            src={product.imagePaths[0]}
            alt={product.title}
            className="w-16 h-16 rounded-xl object-cover shadow-xs shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="min-w-0 flex-1">
            <span className="text-[10px] uppercase font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
              {product.category}
            </span>
            <h3 className="font-bold text-sm text-gray-900 truncate mt-0.5">
              {product.title}
            </h3>
            <p className="text-base font-extrabold text-emerald-600">
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
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2 mb-6">
          <Award className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Listing verified! You earn 5 tokens on every sale.</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onViewInMarketplace}
            id="success-view-marketplace-btn"
            className="w-full min-h-[56px] h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>{t.viewMarketplace}</span>
          </button>

          <button
            onClick={onCreateAnother}
            id="success-create-another-btn"
            className="w-full min-h-[56px] h-14 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-base border border-indigo-200 flex items-center justify-center gap-2 transition-colors cursor-pointer active:scale-98"
          >
            <Camera className="w-5 h-5" />
            <span>{t.createAnother}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
