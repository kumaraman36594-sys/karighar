import React from 'react';
import { Camera, FolderOpen, Users, Sparkles, ChevronRight, ArrowRight, ClipboardList, ShieldCheck } from 'lucide-react';
import { Artist, Product, Language } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { speak } from '../../utils/speech';

interface CameraMainScreenProps {
  activeArtist?: Artist;
  recentProducts: Product[];
  language: Language;
  onTakePhoto: () => void;
  onUploadFromGallery: () => void;
  onSwitchArtist: () => void;
  onViewProduct: (product: Product) => void;
  onViewAllListings: () => void;
  isAudioMuted: boolean;
}

export const CameraMainScreen: React.FC<CameraMainScreenProps> = ({
  activeArtist,
  recentProducts,
  language,
  onTakePhoto,
  onUploadFromGallery,
  onSwitchArtist,
  onViewProduct,
  onViewAllListings,
  isAudioMuted,
}) => {
  const { t } = useLanguage();
  const artistName = activeArtist?.name || 'Ramesh Kumar';

  const handleTakePhotoClick = () => {
    if (!isAudioMuted) {
      speak('कैमरा शुरू हो रहा है। उत्पाद को ठीक बीच में रखें।', language);
    }
    onTakePhoto();
  };

  const handleUploadClick = () => {
    if (!isAudioMuted) {
      speak('कृपया अपने फोन से 3 फोटो चुनें।', language);
    }
    onUploadFromGallery();
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-20 select-none">
      {/* Top Banner: Warm Artisanal Clay Aesthetic */}
      <div className="bg-[#B4431E] rounded-xl p-5 sm:p-6 lg:p-8 text-white shadow-xs relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>Voice & Guided AI Ready</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
              {t('newProduct')}: <span className="underline decoration-amber-300 underline-offset-4">{artistName}</span>
            </h1>
            <p className="text-xs sm:text-sm text-amber-100 mt-1">
              {activeArtist?.craft} · {activeArtist?.village}, {activeArtist?.district}
            </p>
          </div>

          <button
            type="button"
            onClick={onSwitchArtist}
            id="camera-screen-switch-artist-btn"
            className="min-h-[44px] flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-bold text-white transition-colors cursor-pointer self-start sm:self-center shrink-0"
            title="Switch or add artists"
          >
            <Users className="w-4 h-4" />
            <span>Switch Artist</span>
          </button>
        </div>
      </div>

      {/* Two Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Take Photo Card (Primary) */}
        <button
          type="button"
          onClick={handleTakePhotoClick}
          id="camera-take-photo-btn"
          className="p-6 sm:p-8 rounded-xl bg-white hover:bg-amber-50/20 border-2 border-[#B4431E] shadow-xs text-left transition-all group cursor-pointer relative flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-lg bg-[#B4431E]/10 text-[#B4431E] flex items-center justify-center mb-4 group-hover:bg-[#B4431E] group-hover:text-white transition-colors">
              <Camera className="w-6 h-6" />
            </div>
            <span className="inline-block text-[10px] font-extrabold text-[#B4431E] uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded-sm mb-2 border border-amber-200">
              Recommended
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 group-hover:text-[#B4431E] transition-colors">
              {t('takePhoto')}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1.5 leading-relaxed">
              {t('takePhotoDesc')} (Front, 45° Angle, Top View).
            </p>
          </div>

          <div className="mt-6 flex items-center gap-2 text-xs font-bold text-[#B4431E]">
            <span>Start Guided Camera</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Upload Gallery Card (Secondary) */}
        <button
          type="button"
          onClick={handleUploadClick}
          id="camera-upload-gallery-btn"
          className="p-6 sm:p-8 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 shadow-xs text-left transition-all group cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center mb-4 group-hover:bg-stone-200 transition-colors">
              <FolderOpen className="w-6 h-6" />
            </div>
            <span className="inline-block text-[10px] font-extrabold text-stone-500 uppercase tracking-wider bg-stone-100 px-2 py-0.5 rounded-sm mb-2 border border-stone-200">
              Quick Upload
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 group-hover:text-stone-700 transition-colors">
              {t('uploadGallery')}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1.5 leading-relaxed">
              {t('uploadGalleryDesc')} or select existing craft photos from device.
            </p>
          </div>

          <div className="mt-6 flex items-center gap-2 text-xs font-bold text-stone-700">
            <span>Select Existing Photos</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>

      {/* Recent Listings Section */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-stone-700" />
            <div>
              <h3 className="font-bold text-base sm:text-lg text-stone-900 leading-none">
                {t('recentListings')} ({recentProducts.length})
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Live crafts currently listed for sale on the buyer marketplace
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onViewAllListings}
            className="text-xs font-bold text-[#B4431E] hover:underline cursor-pointer"
          >
            View All →
          </button>
        </div>

        {recentProducts.length === 0 ? (
          <div className="text-center py-10 bg-stone-50 rounded-lg border border-dashed border-stone-200">
            <p className="text-xs text-stone-500 font-medium">No crafts listed yet.</p>
            <p className="text-xs text-[#B4431E] font-bold mt-1">
              Take your first photo above to publish directly to buyers!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentProducts.slice(0, 3).map((product) => (
              <div
                key={product.id}
                onClick={() => onViewProduct(product)}
                id={`recent-prod-${product.id}`}
                className="rounded-lg border border-stone-200 p-3 hover:border-[#B4431E] transition-all cursor-pointer bg-white group flex sm:flex-col items-center sm:items-start gap-3 shadow-2xs hover:shadow-xs"
              >
                <div className="w-20 h-20 sm:w-full sm:h-36 rounded-md overflow-hidden bg-stone-100 shrink-0">
                  <img
                    src={product.image || product.imagePaths?.[0]}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="min-w-0 flex-1 w-full">
                  <span className="text-[10px] font-bold uppercase text-[#B4431E] bg-amber-50 px-2 py-0.5 rounded-xs border border-amber-100">
                    {product.category}
                  </span>
                  <h4 className="font-bold text-sm text-stone-900 truncate mt-1 group-hover:text-[#B4431E] transition-colors">
                    {product.title}
                  </h4>
                  <div className="flex items-center justify-between mt-1 pt-1 border-t border-stone-100">
                    <span className="text-sm font-extrabold text-[#007600]">
                      ₹{product.price}
                    </span>
                    <span className="text-[11px] text-stone-500 font-medium">
                      Stock: {product.stock || 5}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
