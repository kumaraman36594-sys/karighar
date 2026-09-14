import React from 'react';
import { 
  ArrowLeft, 
  UserPlus, 
  Check, 
  MapPin, 
  Sparkles, 
  ChevronRight,
  Award,
  Trash2,
  Package,
  Star
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
    <div className="max-w-xl mx-auto space-y-4 pb-20 p-3 sm:p-5 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          id="artist-switcher-back-btn"
          className="w-9 h-9 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-stone-700 hover:bg-stone-50 transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex-1 text-center">
          <h1 className="text-base sm:text-lg font-bold text-stone-900">
            Choose Artisan (कारीगर चुनें)
          </h1>
          <p className="text-xs text-stone-500 font-medium">
            Switch the active artisan profile
          </p>
        </div>

        <button
          onClick={onAddNewArtist}
          id="add-new-artist-btn"
          className="flex items-center gap-1.5 px-3 h-9 rounded-lg bg-stone-900 hover:bg-black text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Add Artisan</span>
        </button>
      </div>

      <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-700 flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-stone-600 shrink-0" />
        <span>
          Use this device as a digital bridge for multiple local artisans in your community.
        </span>
      </div>

      {/* Artists List */}
      <div className="space-y-2.5">
        {artists.map((artist) => {
          const isActive = artist.id === activeArtistId;
          return (
            <div
              key={artist.id}
              onClick={() => handleSelect(artist)}
              id={`artist-card-${artist.id}`}
              className={`p-3.5 rounded-xl border transition-colors cursor-pointer relative bg-white ${
                isActive
                  ? 'border-stone-900 shadow-xs ring-1 ring-stone-900'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={artist.avatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100'}
                      alt={artist.name}
                      className="w-12 h-12 rounded-lg object-cover border border-stone-200"
                      referrerPolicy="no-referrer"
                    />
                    {isActive && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-md bg-stone-900 text-emerald-400 flex items-center justify-center text-[10px] ring-1 ring-white">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-stone-900 truncate">
                        {artist.name}
                      </h3>
                      {isActive && (
                        <span className="text-[10px] font-semibold text-stone-800 bg-stone-100 border border-stone-200 px-1.5 py-0.2 rounded">
                          Active
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-stone-600 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-stone-400" />
                      <span>{artist.craft} · {artist.village}, {artist.district}</span>
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-stone-500 mt-1 font-medium">
                      <span>{artist.productIds.length} Products</span>
                      <span>₹{artist.totalEarned || 12400} Earned</span>
                      <span className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>{artist.rating || 4.9}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    className={`h-8 px-3 rounded-lg text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-stone-100 text-stone-800 border border-stone-200'
                        : 'bg-stone-900 hover:bg-black text-white'
                    }`}
                  >
                    {isActive ? 'Selected' : 'Select'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

