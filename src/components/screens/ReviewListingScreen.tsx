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
  MapPin,
  CheckCircle2,
  FileCheck
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

  const renderConfidenceBadge = (score: number) => {
    const percent = Math.round(score * 100);
    const isHigh = score >= 0.7;

    return (
      <div className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded mt-1 border ${
        isHigh 
          ? 'bg-stone-100 text-stone-700 border-stone-200' 
          : 'bg-amber-50 text-amber-900 border-amber-200'
      }`}>
        {!isHigh && <AlertTriangle className="w-3 h-3 text-amber-700 shrink-0" />}
        <span>
          AI Confidence: {percent}% {!isHigh && '(Please verify)'}
        </span>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-20 p-3 sm:p-5">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-stone-100 border border-stone-200 text-stone-800 text-xs font-medium mb-1.5">
          <FileCheck className="w-3.5 h-3.5 text-stone-700" />
          <span>Review & Verify Listing</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-stone-900 leading-tight">
          {t.reviewTitle}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          {t.reviewSubtitle}
        </p>
      </div>

      {/* Photo Preview Strip */}
      <div className="bg-white rounded-xl p-3 sm:p-4 border border-stone-200 shadow-xs space-y-2.5">
        <div className="relative h-60 sm:h-72 rounded-lg overflow-hidden bg-stone-900">
          <img
            src={product.imagePaths[selectedPhotoIndex] || product.imagePaths[0]}
            alt={product.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-2.5 left-2.5 bg-stone-900/80 backdrop-blur-xs px-2.5 py-1 rounded text-xs font-medium text-white flex items-center gap-1">
            <span>Photo {selectedPhotoIndex + 1} of {product.imagePaths.length}</span>
            <span>·</span>
            <span>{selectedPhotoIndex === 0 ? 'Front' : selectedPhotoIndex === 1 ? '45° Angle' : 'Top View'}</span>
          </div>
          <div className="absolute bottom-2.5 right-2.5 bg-stone-900/80 text-white px-2 py-0.5 rounded text-xs font-medium">
            Enhanced
          </div>
        </div>

        {/* Thumbnail Selector */}
        <div className="flex gap-2">
          {product.imagePaths.map((url, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedPhotoIndex(idx)}
              className={`flex-1 h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                selectedPhotoIndex === idx 
                  ? 'border-stone-900' 
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
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-4">
        {/* Title Field */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
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
              className="flex-1 h-11 px-3 rounded-lg border border-stone-300 font-semibold text-stone-900 text-sm focus:border-stone-900 focus:outline-hidden bg-stone-50"
            />
            <VoiceInputButton
              language={language}
              onResult={(val) => handleFieldChange('title', val)}
              className="h-11 w-11 shrink-0 rounded-lg"
            />
          </div>
          {renderConfidenceBadge(product.confidence?.title || 0.92)}
        </div>

        {/* Description Field */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
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
              className="flex-1 p-3 rounded-lg border border-stone-300 text-xs sm:text-sm font-medium text-stone-800 focus:border-stone-900 focus:outline-hidden leading-relaxed bg-stone-50"
            />
            <VoiceInputButton
              language={language}
              onResult={(val) => handleFieldChange('description', val)}
              className="h-11 w-11 shrink-0 rounded-lg mt-0.5"
            />
          </div>
          {renderConfidenceBadge(product.confidence?.description || 0.78)}
        </div>

        {/* Category & Material */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block mb-1">
              Category (श्रेणी)
            </label>
            <select
              value={product.category}
              onChange={(e) => handleFieldChange('category', e.target.value)}
              className="w-full h-11 px-3 rounded-lg border border-stone-300 text-xs sm:text-sm font-semibold bg-stone-50 cursor-pointer"
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
            <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block mb-1">
              Material (सामग्री)
            </label>
            <input
              type="text"
              value={product.material}
              onChange={(e) => handleFieldChange('material', e.target.value)}
              className="w-full h-11 px-3 rounded-lg border border-stone-300 text-xs sm:text-sm font-semibold text-stone-900 bg-stone-50"
            />
            {renderConfidenceBadge(product.confidence?.material || 0.88)}
          </div>
        </div>

        {/* Price Suggestion Section */}
        <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200 space-y-2.5">
          <div className="flex items-center gap-1.5 text-stone-900 font-semibold text-xs sm:text-sm">
            <TrendingUp className="w-4 h-4 text-stone-700" />
            <span>Market Benchmark in {regionName}</span>
          </div>

          <div className="text-xs text-stone-700 space-y-0.5">
            <p className="font-medium text-stone-900">
              {explanation}
            </p>
            <p className="text-stone-700 font-semibold">
              AI Recommended Price: ₹{recommendedPrice} (Range: ₹{priceRange[0]} - ₹{priceRange[1]})
            </p>
            <p className="text-[11px] text-stone-500">
              You can set any price. This suggestion references current regional craft sales.
            </p>
          </div>

          {/* Price Input field */}
          <div className="pt-2 border-t border-stone-200 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex-1 min-w-[180px]">
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Your Selling Price (विक्रय मूल्य ₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 font-bold text-stone-600 text-base">
                  ₹
                </span>
                <input
                  type="number"
                  value={product.price}
                  onChange={(e) => handleFieldChange('price', Number(e.target.value))}
                  className="w-full h-10 pl-7 pr-3 rounded-lg border border-stone-300 bg-white text-base font-bold text-stone-900 focus:border-stone-900 focus:outline-hidden"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleFieldChange('price', recommendedPrice)}
              className="px-3 py-2 rounded-lg bg-stone-900 hover:bg-black text-white font-medium text-xs cursor-pointer"
            >
              Use Recommended ₹{recommendedPrice}
            </button>
          </div>

          {renderConfidenceBadge(product.confidence?.price || 0.65)}
        </div>

        {/* Tags */}
        <div>
          <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block mb-1.5">
            Search Tags (टैग्स)
          </label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-stone-100 border border-stone-200 text-xs font-medium text-stone-800"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="w-3.5 h-3.5 rounded hover:bg-stone-200 flex items-center justify-center cursor-pointer"
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
              placeholder="Add tag (e.g. jaipur, glazed, blue)..."
              className="flex-1 h-10 px-3 rounded-lg border border-stone-300 text-xs font-medium bg-stone-50"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-3.5 h-10 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs border border-stone-200"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="space-y-2 pt-1">
        {/* Full Listing TTS Button */}
        <button
          onClick={readEntireListingAloud}
          id="review-read-all-tts-btn"
          className="w-full h-11 rounded-lg bg-white hover:bg-stone-50 text-stone-800 font-semibold text-xs sm:text-sm border border-stone-300 flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Volume2 className="w-4 h-4 text-stone-600" />
          <span>{t.readEntireListing}</span>
        </button>

        {/* Primary Approve & Publish Button */}
        <button
          onClick={handlePublishClick}
          id="review-approve-publish-btn"
          className="w-full h-11 rounded-lg bg-stone-900 hover:bg-black text-white font-bold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Check className="w-4 h-4" />
          <span>{t.approvePublish}</span>
        </button>
      </div>
    </div>
  );
};

