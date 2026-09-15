import React from 'react';
import { Camera, ChevronRight, FolderOpen, Image as ImageIcon, Package, UserRound, Users } from 'lucide-react';
import { Artist, Language, Product } from '../../types';
import { speak } from '../../utils/speech';

interface CameraMainScreenProps {
  activeArtist?: Artist;
  recentProducts: Product[];
  allProducts?: Product[];
  artists?: Artist[];
  language: Language;
  onTakePhoto: () => void;
  onUploadFromGallery: () => void;
  onSwitchArtist: () => void;
  onOpenProfile?: () => void;
  onViewProduct: (product: Product) => void;
  onViewAllListings: () => void;
  isAudioMuted: boolean;
  isGuest?: boolean;
}

const FALLBACK_EARNINGS = [12400, 8500, 6200];

export const CameraMainScreen: React.FC<CameraMainScreenProps> = ({
  activeArtist,
  recentProducts,
  allProducts = [],
  artists = [],
  language,
  onTakePhoto,
  onUploadFromGallery,
  onSwitchArtist,
  onOpenProfile,
  onViewProduct,
  onViewAllListings,
  isAudioMuted,
  isGuest = false,
}) => {
  const listings = Array.isArray(allProducts) ? allProducts : [];
  const recent = Array.isArray(recentProducts) ? recentProducts : [];
  const topArtisans = [...artists]
    .sort((a, b) => (b.totalEarned || 0) - (a.totalEarned || 0))
    .slice(0, 3);

  const handleTakePhotoClick = () => {
    console.log('Button clicked:', 'guest-camera-open');
    if (!isAudioMuted) speak('अपना उत्पाद दिखाएं। उत्पाद को बीच में रखें।', language);
    onTakePhoto();
  };

  const handleUploadClick = () => {
    console.log('Button clicked:', 'guest-gallery-open');
    if (!isAudioMuted) speak('गैलरी से अपने उत्पाद की फोटो चुनें।', language);
    onUploadFromGallery();
  };

  return (
    <section className="mx-auto w-full max-w-6xl space-y-8 pb-24">
      <header className="flex items-center justify-between gap-4 border-b border-[#E5E7EB] pb-5">
        <div className="min-w-0">
          <p className="text-xl font-semibold text-[#111827]">कारीगर</p>
          <h1 className="mt-1 break-words text-2xl font-semibold text-[#111827]">
            {isGuest ? 'अपना नया उत्पाद जोड़ें' : `${activeArtist?.name || 'कारीगर'} का नया उत्पाद`}
          </h1>
          <p className="mt-1 text-base text-[#6B7280]">
            {isGuest ? 'Guest mode · बिना login के शुरू करें' : `${activeArtist?.craft || 'हस्तनिर्मित कला'} · ${activeArtist?.village || 'भारत'}`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            console.log('Button clicked:', 'seller-header-profile');
            if (onOpenProfile) onOpenProfile();
            else onSwitchArtist();
          }}
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-[#E5E7EB] text-[#111827] hover:border-[#FF6B35] hover:text-[#FF6B35]"
          aria-label="प्रोफ़ाइल खोलें"
        >
          <UserRound className="h-6 w-6" aria-hidden="true" />
        </button>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <button
          type="button"
          onClick={handleTakePhotoClick}
          className="flex min-h-56 flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#FF6B35] bg-[#FFF7F2] p-6 text-center hover:bg-[#FFF1EA]"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-[#FF6B35] text-white">
            <Camera className="h-7 w-7" aria-hidden="true" />
          </span>
          <span className="mt-4 text-xl font-semibold text-[#111827]">कैमरा खोलें</span>
          <span className="mt-1 text-base text-[#6B7280]">Tap to take photo</span>
          <span className="mt-3 flex items-center gap-2 text-base font-semibold text-[#FF6B35]">
            Guided 3-photo listing <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </span>
        </button>

        <button
          type="button"
          onClick={handleUploadClick}
          className="flex min-h-56 flex-col items-center justify-center rounded-lg border border-[#E5E7EB] bg-white p-6 text-center hover:border-[#FF6B35]"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-[#F9FAFB] text-[#111827]">
            <FolderOpen className="h-7 w-7" aria-hidden="true" />
          </span>
          <span className="mt-4 text-xl font-semibold text-[#111827]">गैलरी से चुनें</span>
          <span className="mt-1 text-base text-[#6B7280]">Upload from gallery</span>
          <span className="mt-3 flex items-center gap-2 text-base font-semibold text-[#111827]">
            Use existing photos <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </span>
        </button>
      </section>

      <section>
        <SectionHeading icon={<Package className="h-5 w-5" aria-hidden="true" />} title="आपकी हाल की listings" subtitle="Guest listings इसी device पर सुरक्षित रहती हैं" />
        {recent.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#D1D5DB] bg-[#F9FAFB] p-8 text-center">
            <ImageIcon className="mx-auto h-8 w-8 text-[#9CA3AF]" aria-hidden="true" />
            <p className="mt-3 text-base font-semibold text-[#111827]">अभी कोई listing नहीं है</p>
            <p className="mt-1 text-base text-[#6B7280]">पहला उत्पाद जोड़ने के लिए ऊपर कैमरा खोलें।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {recent.slice(0, 3).map((product) => (
              <ProductTile key={product.id} product={product} onClick={onViewProduct} />
            ))}
          </div>
        )}
      </section>

      <section>
        <SectionHeading icon={<Users className="h-5 w-5" aria-hidden="true" />} title="इस सप्ताह के top artisans" subtitle="कारीगर समुदाय की कमाई" />
        <div className="divide-y divide-[#E5E7EB] rounded-lg border border-[#E5E7EB] bg-white">
          {topArtisans.map((artist, index) => (
            <div key={artist.id} className="flex min-w-0 items-center gap-3 px-4 py-4">
              <span className="w-8 shrink-0 text-center text-lg font-semibold text-[#FF6B35]">{index + 1}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-semibold text-[#111827]">{artist.name}</p>
                <p className="truncate text-sm text-[#6B7280]">{artist.craft} · {artist.village}</p>
              </div>
              <span className="shrink-0 text-base font-semibold text-[#111827]">₹{(artist.totalEarned || FALLBACK_EARNINGS[index] || 0).toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <SectionHeading icon={<ImageIcon className="h-5 w-5" aria-hidden="true" />} title="सभी listings" subtitle="भारत के कारीगरों के handmade products" />
          {!isGuest && (
            <button
              type="button"
              onClick={() => {
                console.log('Button clicked:', 'seller-view-all-listings');
                onViewAllListings();
              }}
              className="flex min-h-12 items-center gap-1 rounded-lg border border-[#E5E7EB] px-3 text-sm font-semibold text-[#111827] hover:border-[#FF6B35] hover:text-[#FF6B35]"
            >
              सभी देखें <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {listings.slice(0, 8).map((product) => (
            <ProductTile key={product.id} product={product} onClick={onViewProduct} compact />
          ))}
        </div>
      </section>
    </section>
  );
};

const SectionHeading: React.FC<{ icon: React.ReactNode; title: string; subtitle: string }> = ({ icon, title, subtitle }) => (
  <div className="mb-4 flex min-w-0 items-start gap-3">
    <span className="mt-0.5 shrink-0 text-[#FF6B35]">{icon}</span>
    <div className="min-w-0">
      <h2 className="break-words text-xl font-semibold text-[#111827]">{title}</h2>
      <p className="mt-1 break-words text-base text-[#6B7280]">{subtitle}</p>
    </div>
  </div>
);

const ProductTile: React.FC<{ product: Product; onClick: (product: Product) => void; compact?: boolean }> = ({ product, onClick, compact = false }) => {
  const image = product.imagePaths?.[0] || product.image || '/assets/crafts/blue_pottery_vase.jpg';
  return (
    <button
      type="button"
      onClick={() => {
        console.log('Button clicked:', `product-${product.id}`);
        onClick(product);
      }}
      className="group min-w-0 overflow-hidden rounded-lg border border-[#E5E7EB] bg-white text-left hover:border-[#FF6B35]"
    >
      <div className={`${compact ? 'aspect-square' : 'aspect-[4/3]'} overflow-hidden bg-[#F9FAFB]`}>
        <img src={image} alt={product.title} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
      </div>
      <div className="min-w-0 p-3">
        <p className="line-clamp-2 break-words text-base font-semibold text-[#111827]">{product.title}</p>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <span className="text-base font-semibold text-[#111827]">₹{product.price.toLocaleString('en-IN')}</span>
          <span className="text-sm text-[#6B7280]">{product.category}</span>
        </div>
      </div>
    </button>
  );
};
