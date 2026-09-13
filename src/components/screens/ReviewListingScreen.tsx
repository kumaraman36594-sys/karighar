import React, { useState } from 'react';
import { 
  Volume2, 
  Check, 
  AlertTriangle, 
  Sparkles, 
  Plus, 
  X, 
  TrendingUp,
  MapPin,
  FileCheck
} from 'lucide-react';
import { Product, Language } from '../../types';
import { TRANSLATIONS } from '../../utils/translations';
import { speak } from '../../utils/speech';
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

  const readEntireListingAloud = () => {
    const fullText = `शीर्षक: ${product.title}। शिल्प: ${product.category}। सामग्री: ${product.material}। कीमत: ${product.price} रुपये। विवरण: ${product.description}। ${regionName} बाज़ार के अनुसार सुझाई गई कीमत ${recommendedPrice} रुपये है।`;
    speak(fullText, language);
  };

  const handlePublishClick = () => {
    if (!isAudioMuted) {
      speak('बधाई हो! आपका उत्पाद प्रकाशित हो गया है।', language);
    }
    onPublish(product);
  };

  // Render Confidence Pill
  const renderConfidenceBadge = (score: number) => {
    const percent = Math.round(score * 100);
    const isHigh = score >= 0.7;

    return (
      <div className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full mt-1.5 ${
        isHigh 
          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
          : 'bg-amber-50 text-amber-800 border border-amber-300'
      }`}>
        {!isHigh && <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
        <span>
          AI भरोसा: {percent}% {!isHigh && ' (जांचें)'}
        </span>
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 pb-24">
      {/* Top Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#B4431E]" />
          <span>Approve Before Publish · पूर्ण नियंत्रण आपका है</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-[#B4431E] shrink-0">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 leading-tight">
              {t.reviewTitle}
            </h1>
            <p className="text-sm text-stone-600">
              {t.reviewSubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Responsive Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Photos + Pricing Insight (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Photo Preview Strip */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-3">
            <div className="relative aspect-4/3 rounded-lg overflow-hidden bg-stone-900">
              <img
                src={product.imagePaths[selectedPhotoIndex] || product.imagePaths[0]}
                alt={product.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-xs px-3 py-1 rounded-md text-xs font-semibold text-white flex items-center gap-1.5">
                <span>Photo {selectedPhotoIndex + 1} of {product.imagePaths.length}</span>
                <span>·</span>
                <span>{selectedPhotoIndex === 0 ? 'Front' : selectedPhotoIndex === 1 ? '45° Angle' : 'Top View'}</span>
              </div>
              <div className="absolute bottom-3 right-3 bg-[#B4431E] text-white px-2.5 py-1 rounded-md text-xs font-bold shadow-xs flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Enhanced</span>
              </div>
            </div>

            {/* Thumbnail Selector */}
            <div className="flex gap-2.5">
              {product.imagePaths.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedPhotoIndex(idx)}
                  className={`flex-1 h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedPhotoIndex === idx 
                      ? 'border-[#B4431E] ring-2 ring-[#B4431E]/20 shadow-xs' 
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

          {/* Regional Pricing Card */}
          <div className="p-5 rounded-xl bg-amber-50/60 border border-amber-200 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <TrendingUp className="w-4 h-4 text-[#B4431E] shrink-0" />
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#B4431E]" />
                Based on local market data in {regionName}:
              </span>
            </div>

            <div className="text-xs text-stone-800 space-y-1.5">
              <p className="font-semibold text-sm text-stone-900 leading-snug">
                {explanation}
              </p>
              <p className="text-amber-950 font-bold text-sm">
                AI Recommended Price: ₹{recommendedPrice} <span className="font-normal text-stone-600">(Range: ₹{priceRange[0]} - ₹{priceRange[1]})</span>
              </p>
              <p className="text-[11px] text-stone-500 italic">
                "You can set any price. This is just a suggestion based on actual regional craft sales."
              </p>
            </div>

            <div className="pt-3 border-t border-amber-200/80 flex flex-col xs:flex-row items-stretch xs:items-end justify-between gap-3">
              <div className="flex-1 min-w-0">
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Your Selling Price (विक्रय मूल्य)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-bold text-stone-600 text-base">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={product.price}
                    onChange={(e) => handleFieldChange('price', Number(e.target.value))}
                    className="w-full h-11 pl-7 pr-3 rounded-lg border border-amber-300 bg-white text-lg font-bold text-stone-900 focus:border-[#B4431E] focus:outline-hidden"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleFieldChange('price', recommendedPrice)}
                className="px-3.5 h-11 rounded-lg bg-[#B4431E] hover:bg-[#963717] text-white font-bold text-xs shadow-xs cursor-pointer transition-colors shrink-0"
              >
                Use ₹{recommendedPrice}
              </button>
            </div>

            {renderConfidenceBadge(product.confidence?.price || 0.65)}
          </div>

          {/* Full Listing TTS Button */}
          <button
            type="button"
            onClick={readEntireListingAloud}
            id="review-read-all-tts-btn"
            className="w-full min-h-[50px] h-12 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-sm border border-stone-300 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-[#B4431E]" />
            <span>{t.readEntireListing}</span>
          </button>
        </div>

        {/* Right Column: Editable Fields (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-5">
            {/* Title Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
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
                  className="flex-1 min-h-[50px] h-12 px-3.5 rounded-lg border border-stone-300 font-semibold text-stone-900 text-base focus:border-[#B4431E] focus:outline-hidden"
                />
                <VoiceInputButton
                  language={language}
                  onResult={(val) => handleFieldChange('title', val)}
                  className="min-h-[50px] w-12 h-12 shrink-0 rounded-lg"
                />
              </div>
              {renderConfidenceBadge(product.confidence?.title || 0.92)}
            </div>

            {/* Description Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Description (उत्पाद का विवरण)
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
                  rows={4}
                  value={product.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  className="flex-1 p-3 rounded-lg border border-stone-300 text-sm font-medium text-stone-800 focus:border-[#B4431E] focus:outline-hidden leading-relaxed"
                />
                <VoiceInputButton
                  language={language}
                  onResult={(val) => handleFieldChange('description', val)}
                  className="min-h-[50px] w-12 h-12 shrink-0 rounded-lg mt-1"
                />
              </div>
              {renderConfidenceBadge(product.confidence?.description || 0.78)}
            </div>

            {/* Category & Material */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
                  Category (श्रेणी)
                </label>
                <select
                  value={product.category}
                  onChange={(e) => handleFieldChange('category', e.target.value)}
                  className="w-full h-11 px-3 rounded-lg border border-stone-300 text-sm font-semibold bg-white cursor-pointer focus:border-[#B4431E] focus:outline-hidden"
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
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
                  Material (सामग्री)
                </label>
                <input
                  type="text"
                  value={product.material}
                  onChange={(e) => handleFieldChange('material', e.target.value)}
                  className="w-full h-11 px-3 rounded-lg border border-stone-300 text-sm font-semibold text-stone-900 focus:border-[#B4431E] focus:outline-hidden"
                />
                {renderConfidenceBadge(product.confidence?.material || 0.88)}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-2">
                Search Tags (खोज टैग)
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-stone-100 border border-stone-200 text-xs font-semibold text-stone-800"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="w-4 h-4 rounded-full hover:bg-stone-200 flex items-center justify-center cursor-pointer text-stone-500 hover:text-stone-800"
                    >
                      <X className="w-3 h-3" />
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
                  placeholder="Add new tag (e.g. terracotta, blue-pottery)..."
                  className="flex-1 h-10 px-3 rounded-lg border border-stone-300 text-xs font-medium focus:border-[#B4431E] focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 h-10 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs border border-stone-300 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 inline mr-1" />
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Primary Approve & Publish Button */}
          <button
            type="button"
            onClick={handlePublishClick}
            id="review-approve-publish-btn"
            className="w-full min-h-[56px] h-14 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-base sm:text-lg shadow-md flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
          >
            <Check className="w-5 h-5" />
            <span>{t.approvePublish}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
