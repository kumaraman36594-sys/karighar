import React from 'react';
import { Camera, Image as ImageIcon, Users, Sparkles, ChevronRight, PlusCircle } from 'lucide-react';
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
    <div className="space-y-6 pb-16">
      {/* Top Section / Artist Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 rounded-3xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-semibold text-white mb-2">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Voice & Guided AI Ready</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold leading-tight">
              📷 {t.newProduct} <span className="underline decoration-amber-400 underline-offset-4">{artistName}</span>
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100 mt-1">
              {activeArtist?.craft} · {activeArtist?.village}, {activeArtist?.district}
            </p>
          </div>

          <button
            onClick={onSwitchArtist}
            id="camera-screen-switch-artist-btn"
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-semibold text-white transition-all shadow-xs cursor-pointer shrink-0"
            title="Switch or add artists"
          >
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Switch</span>
            <span>👥</span>
          </button>
        </div>

        {/* Mini Quote / Philosophy */}
        <div className="mt-4 pt-3 border-t border-white/15 text-[11px] text-indigo-200 italic flex items-center gap-1.5">
          <span>💡</span>
          <span>"The platform does the hard work, not the artisan."</span>
        </div>
      </div>

      {/* Two Large Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Take Photo (Primary Action) */}
        <button
          onClick={handleTakePhotoClick}
          id="camera-take-photo-btn"
          className="p-6 rounded-3xl bg-white hover:bg-indigo-50/50 border-2 border-indigo-600 shadow-lg shadow-indigo-100/50 text-left transition-all transform hover:-translate-y-0.5 group cursor-pointer relative overflow-hidden"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center text-2xl shadow-md mb-4 group-hover:scale-105 transition-transform">
            📷
          </div>
          <span className="inline-block text-[11px] font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded-md mb-1.5">
            Recommended
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
            {t.takePhoto}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
            {t.takePhotoDesc} (Front, 45° Angle, Top View).
          </p>

          <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-indigo-600">
            <span>Start Guided Capture</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Upload from Gallery (Secondary Action) */}
        <button
          onClick={handleUploadClick}
          id="camera-upload-gallery-btn"
          className="p-6 rounded-3xl bg-white hover:bg-gray-50 border border-gray-200 shadow-md text-left transition-all transform hover:-translate-y-0.5 group cursor-pointer"
        >
          <div className="w-14 h-14 rounded-2xl bg-gray-100 text-gray-800 flex items-center justify-center text-2xl shadow-xs mb-4 group-hover:scale-105 transition-transform">
            📁
          </div>
          <span className="inline-block text-[11px] font-bold text-gray-500 uppercase tracking-wider bg-gray-100 px-2 py-0.5 rounded-md mb-1.5">
            Quick Upload
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
            {t.uploadGallery}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
            {t.uploadGalleryDesc} or test with verified sample artisan photos.
          </p>

          <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-gray-700">
            <span>Select Existing Photos</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>

      {/* Recent Listings Section */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
              <span>📋 {t.recentListings}</span>
              <span className="text-xs font-normal text-gray-500">
                ({recentProducts.length} published)
              </span>
            </h3>
            <p className="text-xs text-gray-500">
              Live products actively visible to buyers across India
            </p>
          </div>
          <button
            onClick={onViewAllListings}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            View All →
          </button>
        </div>

        {recentProducts.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-sm text-gray-500">No products published yet.</p>
            <p className="text-xs text-indigo-600 mt-1 font-semibold">
              Take your first photo above to start!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {recentProducts.slice(0, 3).map((product) => (
              <div
                key={product.id}
                onClick={() => onViewProduct(product)}
                id={`recent-prod-${product.id}`}
                className="rounded-2xl border border-gray-200 p-2.5 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer bg-white group flex sm:flex-col items-center sm:items-start gap-3"
              >
                <div className="w-20 h-20 sm:w-full sm:h-36 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  <img
                    src={product.imagePaths[0]}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-semibold uppercase text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                    {product.category}
                  </span>
                  <h4 className="font-bold text-sm text-gray-900 truncate mt-1 group-hover:text-indigo-600 transition-colors">
                    {product.title}
                  </h4>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-base font-bold text-emerald-600">
                      ₹{product.price}
                    </span>
                    <span className="text-[11px] text-gray-500">
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
