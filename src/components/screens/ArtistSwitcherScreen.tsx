import React from 'react';
import { 
  ArrowLeft, 
  UserPlus, 
  Check, 
  MapPin, 
  Sparkles, 
  Package,
  IndianRupee,
  Star,
  Plus
} from 'lucide-react';
import { Artist, Language } from '../../types';
import { TRANSLATIONS } from '../../utils/translations';
import { speak } from '../../utils/speech';

interface ArtistSwitcherScreenProps {
  artists: Artist[];
  activeArtistId: string;
  language: Language;
  onSelectArtist: (artist: Artist) => void;
  onAddNewArtist: () => void;
  onDeleteArtist?: (artistId: string) => void;
  onBack: () => void;
  isAudioMuted: boolean;
}

export const ArtistSwitcherScreen: React.FC<ArtistSwitcherScreenProps> = ({
  artists,
  activeArtistId,
  language,
  onSelectArtist,
  onAddNewArtist,
  onDeleteArtist,
  onBack,
  isAudioMuted,
}) => {
  const t = TRANSLATIONS[language];

  const handleSelect = (artist: Artist) => {
    if (!isAudioMuted) {
      speak(`सक्रिय कारीगर: ${artist.name}`, language);
    }
    onSelectArtist(artist);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-5 pb-20 p-4 sm:p-6">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onBack}
          id="artist-switcher-back-btn"
          className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-700 hover:bg-stone-50 transition-colors shadow-xs"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex-1 text-center">
          <h1 className="text-xl font-bold text-stone-900">
            कारीगर चुनें (Choose Artisan)
          </h1>
          <p className="text-xs text-stone-500 font-medium">
            किस कारीगर के लिए उत्पाद लिस्ट कर रहे हैं?
          </p>
        </div>

        <button
          onClick={onAddNewArtist}
          id="add-new-artist-btn"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#B4431E] hover:bg-[#9C3818] text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">नया कारीगर जोड़ें</span>
          <span className="sm:hidden">जोड़ें</span>
        </button>
      </div>

      <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200/60 text-xs text-stone-700 flex items-center gap-2.5">
        <Sparkles className="w-4 h-4 text-[#B4431E] shrink-0" />
        <span>
          एक ही फ़ोन से आपके गांव या सहकारी समिति के सभी कारीगरों के उत्पाद प्रबंधित करें।
        </span>
      </div>

      {/* Artists List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {artists.map((artist) => {
          const isActive = artist.id === activeArtistId;
          return (
            <div
              key={artist.id}
              onClick={() => handleSelect(artist)}
              id={`artist-card-${artist.id}`}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative bg-white flex flex-col justify-between ${
                isActive
                  ? 'border-[#B4431E] shadow-sm bg-orange-50/10'
                  : 'border-stone-200 hover:border-stone-300 shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative shrink-0">
                  <img
                    src={artist.avatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100'}
                    alt={artist.name}
                    className="w-12 h-12 rounded-xl object-cover border border-stone-200"
                    referrerPolicy="no-referrer"
                  />
                  {isActive && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] shadow-xs ring-2 ring-white">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-stone-900 truncate">
                      {artist.name}
                    </h3>
                    {isActive && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-md">
                        सक्रिय
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-stone-600 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                    <span className="truncate">{artist.craft} · {artist.village}, {artist.district}</span>
                  </p>

                  <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-stone-500 mt-2 font-medium">
                    <span className="flex items-center gap-1">
                      <Package className="w-3 h-3 text-stone-400" />
                      {artist.productIds.length} उत्पाद
                    </span>
                    <span className="flex items-center gap-1">
                      <IndianRupee className="w-3 h-3 text-stone-400" />
                      ₹{artist.totalEarned || 12400}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      {artist.rating || 4.9}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-end">
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-[#B4431E] hover:underline'
                  }`}
                >
                  {isActive ? '✓ चयनित (Selected)' : 'चुनें →'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
