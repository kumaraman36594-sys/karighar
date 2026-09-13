import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Rotate3d, 
  Star, 
  Send, 
  ShoppingBag, 
  ShieldCheck, 
  Clock, 
  Maximize2, 
  CheckCircle,
  Share2
} from 'lucide-react';
import { Product, Artist, Language } from '../../types';
import { TRANSLATIONS } from '../../utils/translations';
import { speak } from '../../utils/speech';
import { AudioSpeakerButton } from '../common/AudioSpeakerButton';

interface ProductDetailScreenProps {
  product: Product;
  artist: Artist;
  language: Language;
  onBack: () => void;
  onSendInquiry: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onViewArtist: (artist: Artist) => void;
  isAudioMuted: boolean;
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  product,
  artist,
  language,
  onBack,
  onSendInquiry,
  onBuyNow,
  onViewArtist,
  isAudioMuted,
}) => {
  const t = TRANSLATIONS[language];
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);
  const [is3dMode, setIs3dMode] = useState<boolean>(false);
  const [rotationAngle, setRotationAngle] = useState<number>(0);

  const photos = product.imagePaths.length > 0 
    ? product.imagePaths 
    : ['https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=800'];

  const handleNextPhoto = () => {
    setActivePhotoIdx((prev) => (prev + 1) % photos.length);
  };

  const handlePrevPhoto = () => {
    setActivePhotoIdx((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const readDescriptionAloud = () => {
    speak(`${product.title}। कारीगर ${artist.name} द्वारा हस्तनिर्मित। कीमत ₹${product.price}। ${product.description}`, language);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-24 p-3 sm:p-6">
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          id="product-detail-back-btn"
          className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-gray-900 bg-white px-3.5 py-2.5 rounded-xl border border-gray-200 shadow-xs cursor-pointer active:scale-98"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </button>

        <div className="flex items-center gap-2">
          <AudioSpeakerButton
            text={`${product.title}। कारीगर ${artist.name} द्वारा हस्तनिर्मित। कीमत ₹${product.price}। ${product.description}`}
            language={language}
            isMuted={isAudioMuted}
            label="विवरण सुनें"
            className="bg-indigo-50 border-indigo-200 text-indigo-700"
          />
        </div>
      </div>

      {/* Large Product Image & 3D Interactive Carousel */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200 shadow-sm space-y-4">
        <div className="relative aspect-4/3 sm:aspect-16/10 rounded-2xl overflow-hidden bg-gray-950 flex items-center justify-center select-none">
          {/* Main Image with optional interactive 3D rotation angle transform */}
          <img
            src={photos[activePhotoIdx]}
            alt={product.title}
            style={{
              transform: is3dMode ? `rotate(${rotationAngle}deg) scale(1.04)` : undefined,
              transition: is3dMode ? 'transform 0.15s ease-out' : 'all 0.3s ease',
            }}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />

          {/* "🔄 3D VIEW" Badge */}
          <button
            onClick={() => {
              setIs3dMode(!is3dMode);
              if (!is3dMode) {
                setRotationAngle(0);
              }
            }}
            className={`absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5 backdrop-blur-md transition-all cursor-pointer ${
              is3dMode 
                ? 'bg-amber-400 text-gray-900 ring-2 ring-white' 
                : 'bg-black/70 text-white hover:bg-black/90'
            }`}
          >
            <Rotate3d className={`w-4 h-4 ${is3dMode ? 'animate-spin' : ''}`} />
            <span>{is3dMode ? '3D Active (Drag Angle)' : '🔄 3D VIEW'}</span>
          </button>

          {/* Dots indicator ● ○ ○ */}
          <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-2">
            {photos.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActivePhotoIdx(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  activePhotoIdx === idx 
                    ? 'w-6 bg-white shadow-md' 
                    : 'bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>

          {/* Click left/right overlay buttons */}
          <button
            onClick={handlePrevPhoto}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center text-sm backdrop-blur-sm cursor-pointer"
          >
            ‹
          </button>
          <button
            onClick={handleNextPhoto}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center text-sm backdrop-blur-sm cursor-pointer"
          >
            ›
          </button>
        </div>

        {/* 3D Rotation Slider if in 3D mode */}
        {is3dMode ? (
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
            <div className="flex justify-between text-xs font-bold text-amber-900">
              <span>Interactive Rotation: {rotationAngle}°</span>
              <span className="text-[11px] text-amber-700">Slide to inspect all angles</span>
            </div>
            <input
              type="range"
              min={-45}
              max={45}
              value={rotationAngle}
              onChange={(e) => {
                const angle = Number(e.target.value);
                setRotationAngle(angle);
                if (angle < -15) setActivePhotoIdx(1);
                else if (angle > 15) setActivePhotoIdx(2);
                else setActivePhotoIdx(0);
              }}
              className="w-full cursor-pointer accent-amber-500"
            />
          </div>
        ) : (
          <div className="flex items-center justify-between text-xs text-gray-500 px-1">
            <span>Angle {activePhotoIdx + 1}: {activePhotoIdx === 0 ? 'Front' : activePhotoIdx === 1 ? '45° Angle' : 'Top View'}</span>
            <span className="text-indigo-600 font-semibold cursor-pointer" onClick={() => setIs3dMode(true)}>
              🔄 घुमाकर देखें (Swipe to rotate)
            </span>
          </div>
        )}
      </div>

      {/* Product Title & Price Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-sm space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
              {product.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1 leading-tight">
              {product.title}
            </h1>
          </div>
          <div className="text-right shrink-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
              ₹{product.price}
            </div>
            <span className="text-[11px] font-bold text-gray-400">Fair Price Guaranteed</span>
          </div>
        </div>

        {/* Artisan Card */}
        <div
          onClick={() => onViewArtist(artist)}
          className="p-3.5 bg-indigo-50/60 hover:bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <img
              src={artist.avatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100'}
              alt={artist.name}
              className="w-12 h-12 rounded-xl object-cover border border-indigo-200"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-sm text-gray-900">
                  {artist.name}
                </h4>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <p className="text-xs text-gray-600">
                {artist.craft} · {artist.village}, {artist.district}
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>{artist.rating || 4.8}</span>
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5">({artist.reviewsCount || 12} समीक्षाएं)</p>
          </div>
        </div>

        {/* Regional Craft & Fair Price Info */}
        <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-950 font-medium">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Authentic GI Craft:</strong> {product.region || product.artistLocation || artist.district || 'Rajasthan'} · Direct from artisan
            </span>
          </div>
          <span className="font-bold text-amber-800 shrink-0 bg-amber-100 px-2 py-0.5 rounded-md">
            Verified Artisan
          </span>
        </div>

        {/* Description Section */}
        <div className="pt-2">
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            About This Craft (शिल्प का विवरण)
          </h3>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Details Grid: Material, Size, Making Time */}
        <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-gray-100 text-center">
          <div className="p-3 bg-gray-50 rounded-2xl">
            <span className="text-lg block mb-0.5">🏺</span>
            <span className="text-[10px] font-bold text-gray-500 uppercase block">सामग्री (Material)</span>
            <span className="text-xs font-bold text-gray-800 line-clamp-1">{product.material || 'प्राकृतिक मिट्टी'}</span>
          </div>
          <div className="p-3 bg-gray-50 rounded-2xl">
            <span className="text-lg block mb-0.5">📐</span>
            <span className="text-[10px] font-bold text-gray-500 uppercase block">आकार (Size)</span>
            <span className="text-xs font-bold text-gray-800 line-clamp-1">{product.dimensions || '20cm × 15cm'}</span>
          </div>
          <div className="p-3 bg-gray-50 rounded-2xl">
            <span className="text-lg block mb-0.5">⏱️</span>
            <span className="text-[10px] font-bold text-gray-500 uppercase block">बनाने में (Time)</span>
            <span className="text-xs font-bold text-gray-800 line-clamp-1">{product.makingTime || '3 दिन'}</span>
          </div>
        </div>
      </div>

      {/* Floating Bottom Action Buttons: Send Inquiry + Buy Now */}
      <div className="fixed bottom-0 left-0 right-0 p-3 sm:p-4 bg-white/95 backdrop-blur-md border-t border-gray-200 z-40 shadow-xl">
        <div className="max-w-3xl mx-auto grid grid-cols-2 gap-3">
          {/* Send Inquiry */}
          <button
            onClick={() => onSendInquiry(product)}
            id="product-send-inquiry-btn"
            className="min-h-[56px] h-14 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-sm sm:text-base border border-indigo-200 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
          >
            <Send className="w-4 h-4" />
            <span>{t.sendInquiry}</span>
          </button>

          {/* Buy Now */}
          <button
            onClick={() => onBuyNow(product)}
            id="product-buy-now-btn"
            className="min-h-[56px] h-14 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>{t.buyNow} (₹{product.price})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
