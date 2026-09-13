import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Star, 
  Phone, 
  MessageCircle, 
  Sparkles, 
  ShoppingBag,
  Volume2
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
    <div className="max-w-2xl mx-auto space-y-5 pb-24 select-none">
      {/* Hero Banner with Overlapping Avatar */}
      <div className="relative">
        {/* Banner Image */}
        <div className="h-48 sm:h-60 w-full overflow-hidden bg-gray-900 relative">
          <img
            src={heroBanner}
            alt="Artisan Workshop"
            className="w-full h-full object-cover opacity-85"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30" />

          {/* Top navigation buttons */}
          <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
            <button
              onClick={onBack}
              id="artisan-back-btn"
              className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md hover:bg-black/70 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={readProfileAloud}
              className="px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md hover:bg-black/70 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>सुनें (Listen)</span>
            </button>
          </div>
        </div>

        {/* Circular Avatar overlapping banner */}
        <div className="px-5 -mt-14 relative z-20 flex items-end justify-between">
          <div className="relative">
            <img
              src={avatarUrl}
              alt={artist.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-xl object-cover bg-gray-200"
              referrerPolicy="no-referrer"
            />
            <span className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-xs shadow-xs" title="Verified">
              ✓
            </span>
          </div>

          {/* Quick Contact Button */}
          <button
            onClick={() => onContactArtisan(artist)}
            id="artisan-contact-btn"
            className="mb-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Phone className="w-4 h-4" />
            <span>📞 संपर्क करें</span>
          </button>
        </div>
      </div>

      {/* Artisan Details & Verification */}
      <div className="px-4 sm:px-5 space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
              {artist.name}
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>✅ सत्यापित कारीगर</span>
            </span>
          </div>

          <p className="text-sm font-semibold text-gray-700 mt-1">
            {artist.craft} · {artist.village}, {artist.district}
          </p>

          <p className="text-xs text-amber-800 font-medium mt-0.5 flex items-center gap-1">
            <span>🏺</span>
            <span>{generationNote}</span>
          </p>

          <div className="flex items-center gap-2 mt-2">
            <div className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-lg">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>⭐ {artist.rating || 4.8} · {artist.reviewsCount || 23} समीक्षाएं</span>
            </div>
          </div>
        </div>

        {/* Stats Row: Products, Sales, Total Earned */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 p-4 bg-white rounded-2xl border border-gray-200 shadow-xs text-center">
          <div className="p-2">
            <span className="text-xl sm:text-2xl font-extrabold text-indigo-600 block">
              {artisanProducts.length || 12}
            </span>
            <span className="text-xs font-bold text-gray-500">उत्पाद (Products)</span>
          </div>
          <div className="p-2 border-x border-gray-100">
            <span className="text-xl sm:text-2xl font-extrabold text-gray-900 block">
              {salesCount}
            </span>
            <span className="text-xs font-bold text-gray-500">बिक्री (Sales)</span>
          </div>
          <div className="p-2">
            <span className="text-xl sm:text-2xl font-extrabold text-emerald-600 block">
              {totalEarned}
            </span>
            <span className="text-xs font-bold text-gray-500">कमाई (Earned)</span>
          </div>
        </div>

        {/* Bio / Story */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-xs space-y-2">
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            कारीगर की कहानी (Artisan Story)
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            "{bioStory}"
          </p>
        </div>

        {/* Products Grid by this artisan (2-column) */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-gray-900">
              {artist.name} के उत्पाद ({artisanProducts.length})
            </h3>
            <span className="text-xs text-gray-500">100% हस्तनिर्मित</span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {artisanProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => onSelectProduct(prod)}
                className="bg-white rounded-2xl border border-gray-200 hover:border-indigo-400 hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="aspect-square bg-gray-100 overflow-hidden relative">
                    <img
                      src={prod.imagePaths[0]}
                      alt={prod.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-2 left-2 text-[10px] font-bold text-indigo-900 bg-white/90 px-2 py-0.5 rounded shadow-xs">
                      {prod.category}
                    </span>
                  </div>
                  <div className="p-3">
                    <h4 className="font-bold text-xs sm:text-sm text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {prod.title}
                    </h4>
                    <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                      {prod.material}
                    </p>
                  </div>
                </div>

                <div className="p-3 pt-0 flex items-center justify-between border-t border-gray-100 mt-1">
                  <span className="text-sm sm:text-base font-extrabold text-emerald-600">
                    ₹{prod.price}
                  </span>
                  <span className="text-[11px] font-bold text-indigo-600 group-hover:underline">
                    देखें →
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
