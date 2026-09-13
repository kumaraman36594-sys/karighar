import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Star, 
  Rotate3d, 
  ShieldCheck, 
  Truck, 
  Check, 
  ShoppingCart, 
  Zap, 
  Maximize2, 
  Share2, 
  Heart,
  Volume2,
  Calendar,
  Layers,
  Clock,
  MapPin,
  Sparkles
} from 'lucide-react';
import { Product, Artist } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { speak } from '../../utils/speech';
import { AudioSpeakerButton } from '../common/AudioSpeakerButton';

interface ProductDetailScreenProps {
  product: Product;
  artist?: Artist;
  onBack: () => void;
  onAddToCart?: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
  onViewArtist?: (artist: Artist) => void;
  onSelectSimilarProduct?: (product: Product) => void;
  similarProducts?: Product[];
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  product,
  artist,
  onBack,
  onAddToCart,
  onBuyNow,
  onViewArtist,
  onSelectSimilarProduct,
  similarProducts = [],
}) => {
  const { language, t } = useLanguage();

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [is3dMode, setIs3dMode] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  const photos = (product.imagePaths && product.imagePaths.length > 0)
    ? product.imagePaths
    : [product.image || '/assets/crafts/blue_pottery_vase.jpg'];

  const originalPrice = Math.round(product.price * 1.35);
  const discountPercent = Math.round(((originalPrice - product.price) / originalPrice) * 100);
  const deliveryDate = new Date(Date.now() + 4 * 86400000).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product, quantity);
      setAddedToast(true);
      setTimeout(() => setAddedToast(false), 2200);
    }
  };

  const readDetailsAloud = () => {
    const textToSpeak = `${product.title}। कीमत ₹${product.price}। ${product.description || ''}। कारीगर ${artist?.name || product.artistName || 'शिल्पकार'} द्वारा हस्तनिर्मित।`;
    speak(textToSpeak, language);
  };

  return (
    <div className="min-h-screen bg-white text-[#111111] pb-28 select-none">
      {/* Toast */}
      {addedToast && (
        <div className="fixed top-16 inset-x-0 z-50 flex justify-center pointer-events-none px-4 animate-fade-in">
          <div className="bg-[#007600] text-white px-4 py-2 rounded-md shadow-lg text-xs sm:text-sm font-bold flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Added {quantity} item(s) to your Cart!</span>
          </div>
        </div>
      )}

      {/* Top Bar with Back & Share */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#DDDDDD] px-3 sm:px-6 py-2.5 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-[#111111] hover:text-[#FF9900] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to marketplace</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Read Aloud Button */}
          <button
            type="button"
            onClick={readDetailsAloud}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-amber-50 hover:bg-amber-100 text-[#FF9900] border border-amber-200 text-xs font-bold transition-colors cursor-pointer"
            title="Read description aloud"
          >
            <Volume2 className="w-4 h-4" />
            <span className="hidden sm:inline">{t('readAloud')}</span>
          </button>

          {/* Wishlist */}
          <button
            type="button"
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="p-2 rounded-md hover:bg-[#F5F5F5] text-[#565959] cursor-pointer"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
          </button>

          {/* Share */}
          <button
            type="button"
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: product.title, url: window.location.href });
              } else {
                navigator.clipboard?.writeText(window.location.href);
                alert('Product link copied to clipboard!');
              }
            }}
            className="p-2 rounded-md hover:bg-[#F5F5F5] text-[#565959] cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Gallery & 3D Viewer (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-square sm:aspect-4/3 rounded-lg overflow-hidden border border-[#DDDDDD] bg-[#F5F5F5] group">
            <img
              src={photos[activePhotoIdx]}
              alt={product.title}
              onClick={() => setIsZoomed(!isZoomed)}
              style={{
                transform: is3dMode
                  ? `rotate(${rotationAngle}deg) scale(1.05)`
                  : isZoomed
                  ? 'scale(1.4)'
                  : 'scale(1.0)',
                transition: is3dMode ? 'transform 0.15s ease-out' : 'transform 0.3s ease',
              }}
              className="w-full h-full object-contain cursor-zoom-in"
              referrerPolicy="no-referrer"
            />

            {/* 3D Mode Toggle Button */}
            <button
              type="button"
              onClick={() => setIs3dMode(!is3dMode)}
              className={`absolute bottom-3 left-3 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-colors ${
                is3dMode
                  ? 'bg-[#FF9900] text-[#111111]'
                  : 'bg-black/75 text-white hover:bg-black'
              }`}
            >
              <Rotate3d className="w-3.5 h-3.5" />
              <span>{is3dMode ? '3D Active (Drag)' : 'View in 3D'}</span>
            </button>

            {/* Zoom hint */}
            <button
              type="button"
              onClick={() => setIsZoomed(!isZoomed)}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-[#111111] shadow-xs cursor-pointer hover:bg-white"
              title="Toggle Zoom"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive 3D Slider if in 3D Mode */}
          {is3dMode && (
            <div className="bg-[#F5F5F5] p-3 rounded-md border border-[#DDDDDD] flex items-center gap-3">
              <Rotate3d className="w-4 h-4 text-[#FF9900] shrink-0" />
              <input
                type="range"
                min={-180}
                max={180}
                value={rotationAngle}
                onChange={(e) => setRotationAngle(Number(e.target.value))}
                className="w-full accent-[#FF9900] cursor-pointer"
              />
              <span className="text-xs font-mono w-10 text-right">{rotationAngle}°</span>
            </div>
          )}

          {/* Thumbnails Row */}
          {photos.length > 1 && (
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
              {photos.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setActivePhotoIdx(idx);
                    setIs3dMode(false);
                  }}
                  className={`w-16 h-16 rounded-md overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                    activePhotoIdx === idx
                      ? 'border-[#FF9900] shadow-xs scale-105'
                      : 'border-[#DDDDDD] hover:border-gray-400'
                  }`}
                >
                  <img src={p} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Buy Box & Product Info (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Title & Artisan Header */}
          <div className="space-y-1.5 border-b border-[#DDDDDD] pb-4">
            <div className="flex items-center gap-1.5 text-xs text-[#565959]">
              <ShieldCheck className="w-4 h-4 text-[#007600]" />
              <span className="font-semibold text-[#111111]">
                {product.artistName || artist?.name || 'Master Artisan'}
              </span>
              <span>·</span>
              <span>{product.artistLocation || product.region || artist?.district || 'India'}</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-[#111111] leading-snug">
              {product.title}
            </h1>

            {/* Ratings */}
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center text-[#FFA41C]">
                <Star className="w-4 h-4 fill-[#FFA41C]" />
                <span className="font-extrabold ml-1 text-[#111111]">
                  {product.rating || 4.8}
                </span>
              </div>
              <span className="text-[#565959]">
                {product.reviewCount || 28} ratings · 100% Verified Buyer Reviews
              </span>
            </div>
          </div>

          {/* Price Section */}
          <div className="space-y-1 border-b border-[#DDDDDD] pb-4">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#007600]">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span className="text-sm text-[#565959] line-through">
                ₹{originalPrice.toLocaleString('en-IN')}
              </span>
              <span className="bg-[#CC0C39] text-white text-xs font-bold px-2 py-0.5 rounded-xs">
                {discountPercent}% OFF
              </span>
            </div>
            <div className="text-xs text-[#565959]">
              Inclusive of all taxes. Free artisan packaging included.
            </div>
          </div>

          {/* Delivery & Stock Info */}
          <div className="space-y-2 border-b border-[#DDDDDD] pb-4 text-xs">
            <div className="flex items-center gap-2 text-emerald-800 font-bold">
              <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t('freeDelivery')} by {deliveryDate}</span>
            </div>
            <div className="text-xs font-bold text-[#007600]">
              {t('inStock')} ({product.stock || 8} pieces available directly from artisan workshop)
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[#111111]">{t('quantity')}:</span>
            <select
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="bg-[#F5F5F5] border border-[#DDDDDD] rounded-md px-3 py-1.5 text-xs font-bold text-[#111111] focus:outline-none cursor-pointer"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          {/* Primary Action Buttons (Amazon Style: Yellow Add to Cart, Orange Buy Now) */}
          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full py-3 rounded-md bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-[#111111] font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{t('addToCart')}</span>
            </button>

            <button
              type="button"
              onClick={() => onBuyNow(product, quantity)}
              className="w-full py-3 rounded-md bg-[#FFA41C] hover:bg-[#e69113] text-[#111111] font-extrabold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Zap className="w-4 h-4 fill-[#111111]" />
              <span>{t('buyNow')}</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-[#565959] pt-2">
            <div className="flex items-center gap-1.5 bg-[#F5F5F5] p-2 rounded-md">
              <ShieldCheck className="w-4 h-4 text-[#007600] shrink-0" />
              <span>GI Verified Authentic</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#F5F5F5] p-2 rounded-md">
              <Truck className="w-4 h-4 text-[#FF9900] shrink-0" />
              <span>India Post SpeedPost</span>
            </div>
          </div>
        </div>
      </div>

      {/* Deep Dive Sections (Specifications, Artisan Story, Reviews, Similar Products) */}
      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-8 border-t border-[#DDDDDD] mt-6">
        {/* Specifications Table */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-[#111111]">
            {t('specifications')}
          </h2>

          <div className="border border-[#DDDDDD] rounded-md divide-y divide-[#DDDDDD] text-xs">
            <div className="grid grid-cols-2 p-3 bg-[#F5F5F5]">
              <span className="font-bold text-[#565959]">Craft Category</span>
              <span className="font-medium text-[#111111]">{product.category || 'Handmade Craft'}</span>
            </div>
            <div className="grid grid-cols-2 p-3 bg-white">
              <span className="font-bold text-[#565959]">Raw Material</span>
              <span className="font-medium text-[#111111]">{product.material || 'Organic Clay & Natural Dyes'}</span>
            </div>
            <div className="grid grid-cols-2 p-3 bg-[#F5F5F5]">
              <span className="font-bold text-[#565959]">Dimensions / Size</span>
              <span className="font-medium text-[#111111]">{product.dimensions || '10 x 5 inches'}</span>
            </div>
            <div className="grid grid-cols-2 p-3 bg-white">
              <span className="font-bold text-[#565959]">Production Time</span>
              <span className="font-medium text-[#111111]">{product.makingTime || '4 days of handcrafting'}</span>
            </div>
            <div className="grid grid-cols-2 p-3 bg-[#F5F5F5]">
              <span className="font-bold text-[#565959]">Artisan Origin</span>
              <span className="font-medium text-[#111111]">{product.artistLocation || product.region || 'Rajasthan, India'}</span>
            </div>
          </div>
        </div>

        {/* Artisan Story */}
        <div className="bg-amber-50/50 border border-amber-200 rounded-lg p-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#FF9900] text-white flex items-center justify-center text-xl font-bold shrink-0">
              👤
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#111111]">
                {t('artisanStory')}: {product.artistName || artist?.name || 'Ramesh Kumar'}
              </h3>
              <p className="text-xs text-[#565959]">
                Generational craftsman keeping 400-year-old Indian traditions alive
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#111111] leading-relaxed">
            {artist?.bio ||
              `${product.title} is handcrafted directly in village workshops without factory machinery. Every piece bears slight organic variations that signify true artisan authenticity. Your purchase directly supports the livelihood of rural artisan families.`}
          </p>

          {artist && onViewArtist && (
            <button
              type="button"
              onClick={() => onViewArtist(artist)}
              className="text-xs font-bold text-[#FF9900] hover:underline cursor-pointer"
            >
              View Full Artisan Profile & Other Works →
            </button>
          )}
        </div>

        {/* Customer Reviews Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[#111111]">
            {t('customerReviews')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                id: 'r1',
                name: 'Kavita Iyer',
                rating: 5,
                date: 'Reviewed in India on 2 September 2026',
                comment: 'The glaze and colors on this handmade piece are breathtaking! Packed with so much care. Worth every rupee to support village artists.',
              },
              {
                id: 'r2',
                name: 'Vikram Joshi',
                rating: 5,
                date: 'Reviewed in India on 15 August 2026',
                comment: 'Authentic GI quality. Very fast delivery and the details are even better in person than in the photo.',
              },
            ].map((rev) => (
              <div key={rev.id} className="border border-[#DDDDDD] rounded-md p-4 bg-white space-y-1.5">
                <div className="flex items-center gap-1 text-[#FFA41C]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#FFA41C]" />
                  ))}
                  <span className="text-xs font-bold text-[#111111] ml-1">Verified Purchase</span>
                </div>
                <div className="text-xs font-bold text-[#111111]">{rev.name}</div>
                <div className="text-[10px] text-[#565959]">{rev.date}</div>
                <p className="text-xs text-[#111111] leading-relaxed pt-1">{rev.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Similar Products Row */}
        {similarProducts.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-[#DDDDDD]">
            <h2 className="text-lg font-bold text-[#111111]">
              {t('similarProducts')}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {similarProducts.slice(0, 4).map((sim) => (
                <div
                  key={sim.id}
                  onClick={() => onSelectSimilarProduct && onSelectSimilarProduct(sim)}
                  className="border border-[#DDDDDD] rounded-[4px] p-2 hover:border-[#FF9900] transition-colors cursor-pointer bg-white group flex flex-col justify-between"
                >
                  <div className="aspect-square rounded-[2px] overflow-hidden bg-[#F5F5F5] mb-2">
                    <img
                      src={sim.image || sim.imagePaths?.[0] || ''}
                      alt={sim.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h4 className="font-bold text-xs text-[#111111] line-clamp-1 group-hover:text-[#FF9900]">
                    {sim.title}
                  </h4>
                  <div className="font-bold text-[#007600] text-sm mt-1">
                    ₹{sim.price}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
