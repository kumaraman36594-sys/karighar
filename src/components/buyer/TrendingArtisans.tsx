import React, { useState } from 'react';
import { ShieldCheck, UserCheck, UserPlus, MapPin, Award } from 'lucide-react';
import { Artist } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface TrendingArtisansProps {
  artists: Artist[];
  onSelectArtist: (artist: Artist) => void;
}

export const TrendingArtisans: React.FC<TrendingArtisansProps> = ({
  artists,
  onSelectArtist,
}) => {
  const { t } = useLanguage();
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});

  const toggleFollow = (e: React.MouseEvent, artistId: string) => {
    e.stopPropagation();
    setFollowingMap((prev) => ({
      ...prev,
      [artistId]: !prev[artistId],
    }));
  };

  const defaultAvatar = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&fit=crop&q=80';

  return (
    <div className="bg-[#FFFFFF] border border-[#DDDDDD] rounded-lg p-4 space-y-3.5 shadow-xs select-none">
      <div className="flex items-center justify-between border-b border-[#DDDDDD] pb-2.5">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-[#111111]">
            {t('trendingArtisans')}
          </h2>
          <p className="text-[11px] text-[#565959]">
            Directly support master generational craftsmen and state award winners
          </p>
        </div>
      </div>

      <div className="flex items-stretch gap-3 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
        {artists.slice(0, 6).map((art) => {
          const isFollowing = Boolean(followingMap[art.id]);
          const avatar = art.avatar || defaultAvatar;

          return (
            <div
              key={art.id}
              onClick={() => onSelectArtist(art)}
              className="w-48 sm:w-52 shrink-0 bg-[#FFFFFF] border border-[#DDDDDD] rounded-[4px] p-3 flex flex-col items-center text-center justify-between hover:border-[#FF9900] hover:shadow-sm transition-all cursor-pointer group"
            >
              <div className="flex flex-col items-center">
                {/* Circular Photo */}
                <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden border-2 border-[#FF9900] p-0.5 mb-2 shadow-xs">
                  <img
                    src={avatar}
                    alt={art.name}
                    className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-0 right-0 bg-[#007600] text-white p-0.5 rounded-full ring-2 ring-white">
                    <ShieldCheck className="w-3 h-3" />
                  </div>
                </div>

                {/* Name & Badge */}
                <h4 className="font-bold text-sm text-[#111111] group-hover:text-[#FF9900] truncate max-w-[160px]">
                  {art.name}
                </h4>

                {/* Craft Speciality */}
                <span className="text-[11px] font-semibold text-[#FF9900] bg-amber-50 px-2 py-0.5 rounded-full mt-1 max-w-[150px] truncate">
                  {art.craft}
                </span>

                {/* Region */}
                <div className="flex items-center gap-1 text-[11px] text-[#565959] mt-1.5 truncate max-w-[150px]">
                  <MapPin className="w-3 h-3 shrink-0 text-red-500" />
                  <span className="truncate">{art.village}, {art.district}</span>
                </div>

                {/* Generation / Experience */}
                <div className="text-[10px] text-[#565959] mt-0.5">
                  {art.generation || '3rd Gen Artisan'} · {art.salesCount || 120}+ sales
                </div>
              </div>

              {/* Follow Button */}
              <div className="w-full mt-3 pt-2 border-t border-[#F5F5F5]">
                <button
                  type="button"
                  onClick={(e) => toggleFollow(e, art.id)}
                  className={`w-full py-1 rounded-[3px] text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    isFollowing
                      ? 'bg-[#F5F5F5] text-[#565959] border border-[#DDDDDD]'
                      : 'bg-[#FF9900] hover:bg-[#e68a00] text-[#111111] shadow-xs'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="w-3 h-3" />
                      <span>{t('following')}</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3 h-3" />
                      <span>{t('followArtisan')}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
