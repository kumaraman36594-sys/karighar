import React from 'react';
import { Camera, FolderOpen, Users, Sparkles, ChevronRight, PlusCircle, Package } from 'lucide-react';
import { Artist, Product, Language } from '../../types';
import { TRANSLATIONS } from '../../utils/translations';
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
  const t = TRANSLATIONS[language];
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
    <div className="space-y-4 pb-16">
      {/* Artist Studio Bar */}
      <div className="bg-stone-900 rounded-xl p-4 sm:p-5 text-stone-100 border border-stone-800 shadow-xs relative overflow-hidden">
        <div className="relative z-10 flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-stone-800 border border-stone-700 text-[11px] font-medium text-amber-300 mb-2">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Voice-Guided AI Studio</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold leading-tight">
              {t.newProduct} — <span>{artistName}</span>
            </h1>
            <p className="text-xs text-stone-400 mt-0.5">
              {activeArtist?.craft} · {activeArtist?.village}, {activeArtist?.district}
            </p>
          </div>

          <button
            onClick={onSwitchArtist}
            id="camera-screen-switch-artist-btn"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-700 text-xs font-medium text-stone-200 transition-colors shadow-xs cursor-pointer shrink-0"
            title="Switch or add artists"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Switch Profile</span>
          </button>
        </div>
      </div>

      {/* Two Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Take Photo (Primary Action) */}
        <button
          onClick={handleTakePhotoClick}
          id="camera-take-photo-btn"
          className="p-5 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 hover:border-stone-900 shadow-xs text-left transition-colors group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-lg bg-stone-900 text-white flex items-center justify-center mb-3">
            <Camera className="w-5 h-5" />
          </div>
          <span className="inline-block text-[10px] font-semibold text-stone-700 uppercase tracking-wider bg-stone-100 px-2 py-0.5 rounded border border-stone-200 mb-1.5">
            Recommended
          </span>
          <h2 className="text-base sm:text-lg font-bold text-stone-900">
            {t.takePhoto}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
            {t.takePhotoDesc} (Front, 45° Angle, Top View).
          </p>

          <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-stone-900">
            <span>Start Guided Capture</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>

        {/* Upload from Gallery (Secondary Action) */}
        <button
          onClick={handleUploadClick}
          id="camera-upload-gallery-btn"
          className="p-5 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 hover:border-stone-400 shadow-xs text-left transition-colors group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-lg bg-stone-100 text-stone-800 flex items-center justify-center mb-3 border border-stone-200">
            <FolderOpen className="w-5 h-5 text-stone-700" />
          </div>
          <span className="inline-block text-[10px] font-semibold text-stone-600 uppercase tracking-wider bg-stone-100 px-2 py-0.5 rounded border border-stone-200 mb-1.5">
            Quick Upload
          </span>
          <h2 className="text-base sm:text-lg font-bold text-stone-900">
            {t.uploadGallery}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
            {t.uploadGalleryDesc} or test with verified sample artisan photos.
          </p>

          <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-stone-700">
            <span>Select Existing Photos</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>
      </div>

      {/* Recent Listings Section */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-stone-200 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-stone-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-stone-700" />
              <span>{t.recentListings}</span>
              <span className="text-xs font-normal text-stone-500">
                ({recentProducts.length} published)
              </span>
            </h3>
            <p className="text-xs text-stone-500">
              Live products actively visible to buyers across India
            </p>
          </div>
          <button
            onClick={onViewAllListings}
            className="text-xs font-semibold text-stone-700 hover:text-stone-900 transition-colors"
          >
            View All →
          </button>
        </div>

        {recentProducts.length === 0 ? (
          <div className="text-center py-6 bg-stone-50 rounded-lg border border-dashed border-stone-200">
            <p className="text-xs text-stone-500">No products published yet.</p>
            <p className="text-xs text-stone-700 mt-0.5 font-medium">
              Take your first photo above to start!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {recentProducts.slice(0, 3).map((product) => (
              <div
                key={product.id}
                onClick={() => onViewProduct(product)}
                id={`recent-prod-${product.id}`}
                className="rounded-lg border border-stone-200 p-2.5 hover:border-stone-400 hover:shadow-xs transition-colors cursor-pointer bg-white group flex sm:flex-col items-center sm:items-start gap-2.5"
              >
                <div className="w-16 h-16 sm:w-full sm:h-32 rounded-md overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                  <img
                    src={product.imagePaths[0]}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-medium uppercase text-stone-600 bg-stone-100 px-1.5 py-0.2 rounded border border-stone-200">
                    {product.category}
                  </span>
                  <h4 className="font-bold text-xs sm:text-sm text-stone-900 truncate mt-1">
                    {product.title}
                  </h4>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-bold text-stone-900">
                      ₹{product.price}
                    </span>
                    <span className="text-[10px] text-stone-500">
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

