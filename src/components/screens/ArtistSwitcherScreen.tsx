import React from 'react';
import { 
  ArrowLeft, 
  UserPlus, 
  Check, 
  MapPin, 
  Sparkles, 
  ChevronRight,
  Award,
  Trash2
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
    <div className="max-w-xl mx-auto space-y-5 pb-20 p-3 sm:p-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          id="artist-switcher-back-btn"
          className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors shadow-xs"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex-1 text-center">
          <h1 className="text-xl font-extrabold text-gray-900">
            कारीगर चुनें (Choose Artisan)
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            किस कारीगर के लिए काम कर रहे हैं?
          </p>
        </div>

        <button
          onClick={onAddNewArtist}
          id="add-new-artist-btn"
          className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>➕ नया कारीगर जोड़ें</span>
        </button>
      </div>

      <div className="p-3.5 bg-indigo-50/60 rounded-2xl border border-indigo-100 text-xs text-indigo-900 flex items-center gap-2.5">
        <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
        <span>
          A single phone can act as a digital hub for all artisans in your village or cooperative.
        </span>
      </div>

      {/* Artists List */}
      <div className="space-y-3">
        {artists.map((artist) => {
          const isActive = artist.id === activeArtistId;
          return (
            <div
              key={artist.id}
              onClick={() => handleSelect(artist)}
              id={`artist-card-${artist.id}`}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative bg-white ${
                isActive
                  ? 'border-indigo-600 shadow-md bg-indigo-50/10'
                  : 'border-gray-200 hover:border-indigo-300 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={artist.avatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100'}
                      alt={artist.name}
                      className="w-13 h-13 rounded-2xl object-cover border border-gray-200"
                      referrerPolicy="no-referrer"
                    />
                    {isActive && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] shadow-xs ring-2 ring-white">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-gray-900 truncate">
                        {artist.name}
                      </h3>
                      {isActive && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          ACTIVE
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-600 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span>{artist.craft} · {artist.village}, {artist.district}</span>
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-gray-500 mt-1 font-medium">
                      <span>📦 {artist.productIds.length} उत्पाद</span>
                      <span>💰 ₹{artist.totalEarned || 12400} कमाई</span>
                      <span>⭐ {artist.rating || 4.9}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                    }`}
                  >
                    {isActive ? '✓ चुना गया' : 'चुनें'}
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
