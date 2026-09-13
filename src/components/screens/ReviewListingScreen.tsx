import React, { useState } from 'react';
import { 
  Volume2, 
  Mic, 
  Check, 
  AlertTriangle, 
  Sparkles, 
  Tag, 
  Plus, 
  X, 
  HelpCircle,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { Product, Language, MarketPriceInfo } from '../../types';
import { TRANSLATIONS } from '../../utils/translations';
import { speak, stopSpeech } from '../../utils/speech';
import { MARKET_PRICING_DATA } from '../../data/mockData';
import { MockAIService } from '../../data/realCraftsData';
import { AudioSpeakerButton } from '../common/AudioSpeakerButton';
import { VoiceInputButton } from '../common/VoiceInputButton';

interface ReviewListingScreenProps {
  initialProduct: Product;
  language: Language;
  onPublish: (updatedProduct: Product) => void;
  isAudioMuted: boolean;
}

export const ReviewListingScreen: React.FC<ReviewListingScreenProps> = ({
  initialProduct,
  language,
  onPublish,
  isAudioMuted,
}) => {
  const t = TRANSLATIONS[language];

  const [product, setProduct] = useState<Product>(initialProduct);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const [newTagInput, setNewTagInput] = useState<string>('');

  const guidance = MockAIService.getPricingGuidance(`${product.title} ${product.category} ${(product.imagePaths || []).join(' ')}`);
  const catKey = product.category.toLowerCase().trim();
  const fallbackMarket = MARKET_PRICING_DATA[catKey] || MARKET_PRICING_DATA.pottery;
  
  const recommendedPrice = guidance.recommended || fallbackMarket.recommended;
  const regionName = guidance.region || fallbackMarket.region;
  const priceRange = guidance.range || fallbackMarket.range;
  const explanation = language === 'hi' ? guidance.explanationHi : guidance.explanationEn;

  const handleFieldChange = <K extends keyof Product>(key: K, value: Product[K]) => {
    setProduct(prev => ({ ...prev, [key]: value }));
  };

  const handleAddTag = () => {
    if (newTagInput.trim() && !product.tags.includes(newTagInput.trim().toLowerCase())) {
      setProduct(prev => ({
        ...prev,
        tags: [...prev.tags, newTagInput.trim().toLowerCase()]
      }));
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setProduct(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const readFieldAloud = (fieldLabel: string, value: string | number) => {
    speak(`${fieldLabel}: ${value}`, language);
  };

  const readEntireListingAloud = () => {
    const fullText = `शीर्षक: ${product.title}। शिल्प: ${product.category}। सामग्री: ${product.material}। कीमत: ${product.price} रुपये। विवरण: ${product.description}। जयपुर बाज़ार के अनुसार सुझाई गई कीमत 550 रुपये है।`;
    speak(fullText, language);
  };

  const handlePublishClick = () => {
    if (!isAudioMuted) {
      speak('बधाई हो! आपका उत्पाद प्रकाशित हो गया है।', language);
    }
    onPublish(product);
  };

  // Render Confidence Pill as defined in Section 10 & 11
  const renderConfidenceBadge = (score: number) => {
    const percent = Math.round(score * 100);
    const isHigh = score >= 0.7;

    return (
      <div className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full mt-1.5 ${
        isHigh 
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300' 
          : 'bg-amber-50 text-amber-800 border border-amber-300'
      }`}>
        {!isHigh && <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
        <span>
          AI भरोसा: {percent}% {!isHigh && '⚠️ कृपया जांचें'}
        </span>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 p-3 sm:p-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Approve Before Publish · पूर्ण नियंत्रण आपका है</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
          📝 {t.reviewTitle}
        </h1>
        <p className="text-sm text-gray-600">
          {t.reviewSubtitle}
        </p>
      </div>

      {/* Photo Preview Strip */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200 shadow-sm space-y-3">
        <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden bg-gray-900">
          <img
            src={product.imagePaths[selectedPhotoIndex] || product.imagePaths[0]}
            alt={product.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white flex items-center gap-1">
            <span>Photo {selectedPhotoIndex + 1} of {product.imagePaths.length}</span>
            <span>·</span>
            <span>{selectedPhotoIndex === 0 ? 'Front' : selectedPhotoIndex === 1 ? '45° Angle' : 'Top View'}</span>
          </div>
          <div className="absolute bottom-3 right-3 bg-indigo-600/90 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-md">
            ✨ Enhanced & Cleaned
          </div>
        </div>

        {/* Thumbnail Selector */}
        <div className="flex gap-2">
          {product.imagePaths.map((url, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedPhotoIndex(idx)}
              className={`flex-1 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                selectedPhotoIndex === idx 
                  ? 'border-indigo-600 scale-102 shadow-md' 
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={url}
                alt={`Angle ${idx + 1}`}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Editable Fields */}
      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-5">
        {/* Title Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Product Title (उत्पाद का शीर्षक)
            </label>
            <AudioSpeakerButton
              text={`शीर्षक: ${product.title}`}
              language={language}
              isMuted={isAudioMuted}
              size="sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={product.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className="flex-1 min-h-[56px] h-14 px-4 rounded-2xl border border-gray-300 font-semibold text-gray-900 text-base focus:border-indigo-600 focus:outline-hidden"
            />
            <VoiceInputButton
              language={language}
              onResult={(val) => handleFieldChange('title', val)}
              className="min-h-[56px] w-14 h-14 shrink-0 rounded-2xl"
            />
          </div>
          {renderConfidenceBadge(product.confidence?.title || 0.92)}
        </div>

        {/* Description Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Description (उत्पाद का विस्तृत विवरण)
            </label>
            <AudioSpeakerButton
              text={`विवरण: ${product.description}`}
              language={language}
              isMuted={isAudioMuted}
              size="sm"
            />
          </div>
          <div className="flex items-start gap-2">
            <textarea
              rows={3}
              value={product.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              className="flex-1 p-3.5 rounded-2xl border border-gray-300 text-sm font-medium text-gray-800 focus:border-indigo-600 focus:outline-hidden leading-relaxed"
            />
            <VoiceInputButton
              language={language}
              onResult={(val) => handleFieldChange('description', val)}
              className="min-h-[56px] w-14 h-14 shrink-0 rounded-2xl mt-1"
            />
          </div>
          {renderConfidenceBadge(product.confidence?.description || 0.78)}
        </div>

        {/* Category & Material */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
              Category (श्रेणी)
            </label>
            <select
              value={product.category}
              onChange={(e) => handleFieldChange('category', e.target.value)}
              className="w-full h-12 px-3 rounded-xl border border-gray-300 text-sm font-semibold bg-white cursor-pointer"
            >
              <option value="Pottery">Pottery (मिट्टी / पॉटरी)</option>
              <option value="Textile">Textile (वस्त्र / हथकरघा)</option>
              <option value="Jewelry">Jewelry (गहने)</option>
              <option value="Woodwork">Woodwork (काष्ठ कला)</option>
              <option value="Painting">Painting (चित्रकारी)</option>
              <option value="Food">Food (पारंपरिक खाद्य)</option>
              <option value="Handicraft">Handicraft (हस्तशिल्प)</option>
            </select>
            {renderConfidenceBadge(product.confidence?.category || 0.95)}
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
              Material (सामग्री)
            </label>
            <input
              type="text"
              value={product.material}
              onChange={(e) => handleFieldChange('material', e.target.value)}
              className="w-full h-12 px-3.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-900"
            />
            {renderConfidenceBadge(product.confidence?.material || 0.88)}
          </div>
        </div>

        {/* PRICE SUGGESTION SECTION (CRITICAL SECTION 10 SPEC) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-sky-50 border-2 border-sky-200 space-y-3">
          <div className="flex items-center gap-2 text-sky-900 font-bold text-sm">
            <TrendingUp className="w-4 h-4 text-sky-600" />
            <span>📍 Based on local market data in {regionName}:</span>
          </div>

          <div className="text-xs text-sky-950 space-y-1">
            <p className="font-semibold text-sm text-sky-900">
              {explanation}
            </p>
            <p className="text-sky-800 font-bold text-sm">
              AI Recommended Price: ₹{recommendedPrice} (Range: ₹{priceRange[0]} - ₹{priceRange[1]})
            </p>
            <p className="text-[11px] text-sky-700 italic">
              "You can set any price. This is just a suggestion based on actual regional sales to prevent underpricing."
            </p>
          </div>

          {/* Price Input field */}
          <div className="pt-2 border-t border-sky-200 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs font-bold text-gray-800 block mb-1">
                Your Selling Price (विक्रय मूल्य ₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 font-bold text-gray-600 text-lg">
                  ₹
                </span>
                <input
                  type="number"
                  value={product.price}
                  onChange={(e) => handleFieldChange('price', Number(e.target.value))}
                  className="w-full h-12 pl-8 pr-3 rounded-xl border-2 border-sky-400 bg-white text-xl font-bold text-gray-900 focus:border-indigo-600 focus:outline-hidden"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleFieldChange('price', recommendedPrice)}
              className="px-3.5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs cursor-pointer"
            >
              Use Recommended ₹{recommendedPrice}
            </button>
          </div>

          {renderConfidenceBadge(product.confidence?.price || 0.65)}
        </div>

        {/* Tags */}
        <div>
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
            Search Tags (टैग्स)
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-semibold text-indigo-800"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="w-3.5 h-3.5 rounded-full hover:bg-indigo-200 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              placeholder="Add new tag (e.g., traditional, jaipur)..."
              className="flex-1 h-10 px-3 rounded-xl border border-gray-300 text-xs font-medium"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs"
            >
              + Add
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="space-y-3 pt-2">
        {/* Full Listing TTS Button */}
        <button
          onClick={readEntireListingAloud}
          id="review-read-all-tts-btn"
          className="w-full min-h-[56px] h-14 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-base border border-indigo-200 flex items-center justify-center gap-2.5 transition-colors cursor-pointer active:scale-98"
        >
          <Volume2 className="w-5 h-5 animate-pulse" />
          <span>{t.readEntireListing}</span>
        </button>

        {/* Primary Approve & Publish Button */}
        <button
          onClick={handlePublishClick}
          id="review-approve-publish-btn"
          className="w-full min-h-[56px] h-16 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-base sm:text-lg shadow-xl shadow-emerald-200 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 cursor-pointer active:scale-98"
        >
          <Check className="w-6 h-6" />
          <span>{t.approvePublish}</span>
        </button>
      </div>
    </div>
  );
};
