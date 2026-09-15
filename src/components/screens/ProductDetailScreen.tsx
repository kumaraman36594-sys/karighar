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
  Share2,
  Package,
  Ruler
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

  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-24 p-3 sm:p-5">
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          id="product-detail-back-btn"
          className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-white px-3 py-2 rounded-lg border border-stone-200 shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Crafts</span>
        </button>

        <div className="flex items-center gap-2">
          <AudioSpeakerButton
            text={`${product.title}। कारीगर ${artist.name} द्वारा हस्तनिर्मित। कीमत ₹${product.price}। ${product.description}`}
            language={language}
            isMuted={isAudioMuted}
            label="विवरण सुनें"
            className="bg-stone-50 border-stone-200 text-stone-700"
          />
        </div>
      </div>

      {/* Product Image & 3D Interactive Carousel */}
      <div className="bg-white rounded-xl p-3 sm:p-4 border border-stone-200 shadow-xs space-y-3">
        <div className="relative aspect-4/3 sm:aspect-16/10 rounded-lg overflow-hidden bg-stone-900 flex items-center justify-center select-none">
          {/* Main Image */}
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

          {/* 3D View Toggle */}
          <button
            onClick={() => {
              setIs3dMode(!is3dMode);
              if (!is3dMode) {
                setRotationAngle(0);
              }
            }}
            className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-xs font-semibold shadow-sm flex items-center gap-1.5 backdrop-blur-md transition-all cursor-pointer ${
              is3dMode 
                ? 'bg-amber-400 text-stone-950 ring-1 ring-white' 
                : 'bg-stone-900/80 text-white hover:bg-stone-900'
            }`}
          >
            <Rotate3d className={`w-3.5 h-3.5 ${is3dMode ? 'animate-spin' : ''}`} />
            <span>3D Active</span>
          </button>

          {/* Dots indicator */}
          <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-1.5">
            {photos.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActivePhotoIdx(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  activePhotoIdx === idx 
                    ? 'w-5 bg-white' 
                    : 'w-1.5 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>

          {/* Nav arrows */}
          <button
            onClick={handlePrevPhoto}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-stone-900/50 hover:bg-stone-900/80 text-white flex items-center justify-center text-sm backdrop-blur-xs cursor-pointer"
          >
            ‹
          </button>
          <button
            onClick={handleNextPhoto}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-stone-900/50 hover:bg-stone-900/80 text-white flex items-center justify-center text-sm backdrop-blur-xs cursor-pointer"
          >
            ›
          </button>
        </div>

        {/* 3D Rotation Slider if in 3D mode */}
        {is3dMode ? (
          <div className="p-3 bg-amber-50/70 rounded-lg border border-amber-200 space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-amber-900">
              <span>Interactive Rotation: {rotationAngle}°</span>
              <span className="text-[11px] text-amber-700">Slide to inspect craft angles</span>
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
              className="w-full cursor-pointer accent-stone-900"
            />
          </div>
        ) : (
          <div className="flex items-center justify-between text-xs text-stone-500 px-1">
            <span>Angle {activePhotoIdx + 1}: {activePhotoIdx === 0 ? 'Front' : activePhotoIdx === 1 ? '45° Angle' : 'Top View'}</span>
            <span className="text-stone-800 font-medium cursor-pointer hover:underline" onClick={() => setIs3dMode(true)}>
              Swipe or tap for 3D view
            </span>
          </div>
        )}
      </div>

      {/* Product Title & Price Header */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-700 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
              {product.category}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900 mt-1 leading-tight">
              {product.title}
            </h1>
          </div>
          <div className="text-right shrink-0">
            <div className="text-xl sm:text-2xl font-bold text-stone-900">
              ₹{product.price}
            </div>
            <span className="text-[11px] font-medium text-stone-500">Fair Price Guaranteed</span>
          </div>
        </div>

        {/* Artisan Card */}
        <div
          onClick={() => onViewArtist(artist)}
          className="p-3 bg-stone-50 hover:bg-stone-100/70 border border-stone-200 rounded-lg flex items-center justify-between gap-3 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <img
              src={artist.avatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100'}
              alt={artist.name}
              className="w-10 h-10 rounded-lg object-cover border border-stone-200"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-xs sm:text-sm text-stone-900">
                  {artist.name}
                </h4>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <p className="text-xs text-stone-500">
                {artist.craft} · {artist.village}, {artist.district}
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
              <span>{artist.rating || 4.8}</span>
            </div>
            <p className="text-[10px] text-stone-500 mt-0.5">({artist.reviewsCount || 12} reviews)</p>
          </div>
        </div>

        {/* Regional Craft & Fair Price Info */}
        <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-stone-800 font-medium">
            <ShieldCheck className="w-4 h-4 text-stone-700 shrink-0" />
            <span>
              <strong>Authentic GI Craft:</strong> {product.region || product.artistLocation || artist.district || 'Rajasthan'} · Direct from artisan
            </span>
          </div>
          <span className="font-semibold text-stone-700 shrink-0 bg-white px-2 py-0.5 rounded border border-stone-200">
            Verified Artisan
          </span>
        </div>

        {/* Description Section */}
        <div className="pt-1">
          <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
            About This Craft (शिल्प का विवरण)
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-100 text-center">
          <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200/60">
            <Package className="w-4 h-4 text-stone-600 mx-auto mb-1" />
            <span className="text-[10px] font-semibold text-stone-500 uppercase block">सामग्री (Material)</span>
            <span className="text-xs font-bold text-stone-800 line-clamp-1">{product.material || 'प्राकृतिक मिट्टी'}</span>
          </div>
          <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200/60">
            <Ruler className="w-4 h-4 text-stone-600 mx-auto mb-1" />
            <span className="text-[10px] font-semibold text-stone-500 uppercase block">आकार (Size)</span>
            <span className="text-xs font-bold text-stone-800 line-clamp-1">{product.dimensions || '20cm × 15cm'}</span>
          </div>
          <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200/60">
            <Clock className="w-4 h-4 text-stone-600 mx-auto mb-1" />
            <span className="text-[10px] font-semibold text-stone-500 uppercase block">बनाने में (Time)</span>
            <span className="text-xs font-bold text-stone-800 line-clamp-1">{product.makingTime || '3 दिन'}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons: Send Inquiry + Buy Now */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-stone-200 z-40 shadow-xs">
        <div className="max-w-3xl mx-auto grid grid-cols-2 gap-2.5">
          {/* Send Inquiry */}
          <button
            onClick={() => onSendInquiry(product)}
            id="product-send-inquiry-btn"
            className="h-11 rounded-lg bg-white hover:bg-stone-50 text-stone-800 font-semibold text-xs sm:text-sm border border-stone-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{t.sendInquiry}</span>
          </button>

          {/* Buy Now */}
          <button
            onClick={() => onBuyNow(product)}
            id="product-buy-now-btn"
            className="h-11 rounded-lg bg-stone-900 hover:bg-black text-white font-bold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{t.buyNow} (₹{product.price})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
