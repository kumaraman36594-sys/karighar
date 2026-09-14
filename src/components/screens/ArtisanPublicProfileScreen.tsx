import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Star, 
  Phone, 
  MessageCircle, 
  Sparkles, 
  ShoppingBag,
  Volume2,
  Award
} from 'lucide-react';
import { Artist, Product, Language } from '../../types';
import { speak } from '../../utils/speech';

interface ArtisanPublicProfileScreenProps {
  artist: Artist;
  products: Product[];
  language: Language;
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onContactArtisan: (artist: Artist) => void;
  isAudioMuted: boolean;
}

export const ArtisanPublicProfileScreen: React.FC<ArtisanPublicProfileScreenProps> = ({
  artist,
  products = [],
  language,
  onBack,
  onSelectProduct,
  onContactArtisan,
  isAudioMuted,
}) => {
  const [showContactDialog, setShowContactDialog] = useState(false);

  const artisanProducts = products.filter(
    (p) => p.artistId === artist.id || (!p.artistId && artist.id === 'artist-1')
  );

  const heroBanner = artist.banner || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=1200';
  const avatarUrl = artist.avatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200';
  const generationNote = artist.generation || '3 पीढ़ियों से पॉटरी बना रहे हैं';
  const bioStory = artist.bio || 'बगरू गाँव में हमारा परिवार पीढ़ियों से पारंपरिक हस्तशिल्प और मिट्टी के बर्तन बनाता आ रहा है। प्रत्येक उत्पाद में प्राकृतिक सामग्री और हमारी समृद्ध संस्कृति की छाप है।';
  const salesCount = artist.salesCount || 47;
  const totalEarned = artist.totalEarned ? `₹${artist.totalEarned.toLocaleString()}` : '₹28,500';

  const readProfileAloud = () => {
    speak(`${artist.name}। सत्यापित कारीगर। ${artist.craft}। ${artist.village}, ${artist.district}। ${generationNote}। ${bioStory}`, language);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-20 select-none">
      {/* Hero Banner with Overlapping Avatar */}
      <div className="relative">
        {/* Banner Image */}
        <div className="h-44 sm:h-52 w-full overflow-hidden bg-stone-900 relative">
          <img
            src={heroBanner}
            alt="Artisan Workshop"
            className="w-full h-full object-cover opacity-80"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-stone-950/40" />

          {/* Top navigation buttons */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
            <button
              onClick={onBack}
              id="artisan-back-btn"
              className="w-9 h-9 rounded-lg bg-stone-900/80 hover:bg-stone-900 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={readProfileAloud}
              className="px-2.5 py-1 rounded-lg bg-stone-900/80 hover:bg-stone-900 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Listen</span>
            </button>
          </div>
        </div>

        {/* Circular Avatar overlapping banner */}
        <div className="px-4 -mt-10 relative z-20 flex items-end justify-between">
          <div className="relative">
            <img
              src={avatarUrl}
              alt={artist.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg border-2 border-white shadow-xs object-cover bg-stone-200"
              referrerPolicy="no-referrer"
            />
            <span className="absolute bottom-1 right-1 w-5 h-5 rounded-md bg-stone-900 text-emerald-400 border border-white flex items-center justify-center text-[10px]" title="Verified">
              ✓
            </span>
          </div>

          {/* Quick Contact Button */}
          <button
            onClick={() => onContactArtisan(artist)}
            id="artisan-contact-btn"
            className="mb-1 h-9 px-3 rounded-lg bg-stone-900 hover:bg-black text-white font-medium text-xs shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Contact Artisan</span>
          </button>
        </div>
      </div>

      {/* Artisan Details & Verification */}
      <div className="px-3 sm:px-4 space-y-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900 leading-tight">
              {artist.name}
            </h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-stone-100 border border-stone-200 text-stone-800 text-[11px] font-medium">
              <CheckCircle2 className="w-3 h-3 text-stone-700" />
              <span>Verified Artisan</span>
            </span>
          </div>

          <p className="text-xs sm:text-sm font-medium text-stone-600 mt-0.5">
            {artist.craft} · {artist.village}, {artist.district}
          </p>

          <p className="text-xs text-stone-600 font-medium mt-1 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-stone-500" />
            <span>{generationNote}</span>
          </p>

          <div className="flex items-center gap-2 mt-2">
            <div className="inline-flex items-center gap-1 text-xs font-semibold text-stone-800 bg-stone-50 border border-stone-200 px-2 py-0.5 rounded">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>{artist.rating || 4.8} · {artist.reviewsCount || 23} reviews</span>
            </div>
          </div>
        </div>

        {/* Stats Row: Products, Sales, Total Earned */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-white rounded-xl border border-stone-200 shadow-xs text-center">
          <div className="p-1.5">
            <span className="text-lg sm:text-xl font-bold text-stone-900 block">
              {artisanProducts.length || 12}
            </span>
            <span className="text-[11px] font-medium text-stone-500">Products</span>
          </div>
          <div className="p-1.5 border-x border-stone-100">
            <span className="text-lg sm:text-xl font-bold text-stone-900 block">
              {salesCount}
            </span>
            <span className="text-[11px] font-medium text-stone-500">Sales</span>
          </div>
          <div className="p-1.5">
            <span className="text-lg sm:text-xl font-bold text-stone-900 block">
              {totalEarned}
            </span>
            <span className="text-[11px] font-medium text-stone-500">Earned</span>
          </div>
        </div>

        {/* Bio / Story */}
        <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-stone-200 shadow-xs space-y-1">
          <h3 className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
            Artisan Story (कारीगर की कहानी)
          </h3>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            "{bioStory}"
          </p>
        </div>

        {/* Products Grid by this artisan */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm sm:text-base text-stone-900">
              Products by {artist.name} ({artisanProducts.length})
            </h3>
            <span className="text-xs text-stone-500 font-medium">100% Authentic Handcraft</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            {artisanProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => onSelectProduct(prod)}
                className="bg-white rounded-lg border border-stone-200 hover:border-stone-400 hover:shadow-xs transition-colors overflow-hidden flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="aspect-square bg-stone-100 overflow-hidden relative border-b border-stone-200">
                    <img
                      src={prod.imagePaths[0]}
                      alt={prod.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-2 left-2 text-[10px] font-semibold text-stone-800 bg-white/95 px-1.5 py-0.5 rounded border border-stone-200 shadow-xs">
                      {prod.category}
                    </span>
                  </div>
                  <div className="p-2.5">
                    <h4 className="font-bold text-xs sm:text-sm text-stone-900 line-clamp-1">
                      {prod.title}
                    </h4>
                    <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                      {prod.material}
                    </p>
                  </div>
                </div>

                <div className="p-2.5 pt-0 flex items-center justify-between border-t border-stone-100 mt-1">
                  <span className="text-xs sm:text-sm font-bold text-stone-900">
                    ₹{prod.price}
                  </span>
                  <span className="text-xs font-semibold text-stone-700 group-hover:text-black">
                    View →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

