import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Filter, 
  Star, 
  ChevronRight, 
  ShoppingBag, 
  Users,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Tag,
  Boxes,
  Sparkles,
  Box,
  Palette,
  Eye
} from 'lucide-react';
import { Product, Artist, Language } from '../../types';
import { TRANSLATIONS } from '../../utils/translations';
import { VoiceInputButton } from '../common/VoiceInputButton';
import { KarigharWordmark } from '../common/KarigharWordmark';

interface BuyerHomeScreenProps {
  products: Product[];
  artists: Artist[];
  language: Language;
  onSelectProduct: (product: Product) => void;
  onSelectArtist: (artist: Artist) => void;
}

const CATEGORIES = [
  { id: 'all', label: 'All Crafts (सभी)' },
  { id: 'pottery', label: 'Blue Pottery (पॉटरी)' },
  { id: 'silk', label: 'Silk Sarees (सिल्क)' },
  { id: 'bandhani', label: 'Bandhani (बांधनी)' },
  { id: 'metal', label: 'Dhokra Metal (धातु शिल्प)' },
  { id: 'painting', label: 'Folk Paintings (चित्रकारी)' },
  { id: 'toys', label: 'Channapatna Toys (खिलौने)' },
  { id: 'terracotta', label: 'Terracotta (टेराकोटा)' },
];

const LOCATIONS = [
  'All India (सम्पूर्ण भारत)',
  'Jaipur, Rajasthan',
  'Kanchipuram, Tamil Nadu',
  'Kutch, Gujarat',
  'Varanasi, UP',
  'Bastar, Chhattisgarh',
  'Mithila, Bihar',
  'Puri, Odisha',
  'Paithan, Maharashtra',
  'Channapatna, Karnataka',
];

export const BuyerHomeScreen: React.FC<BuyerHomeScreenProps> = ({
  products = [],
  artists = [],
  language = 'hi',
  onSelectProduct,
  onSelectArtist,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.hi;
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>(LOCATIONS[0]);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState<boolean>(false);

  // Filter products by search and category safely
  const productList = Array.isArray(products) ? products : [];
  const artistList = Array.isArray(artists) ? artists : [];

  const filteredProducts = productList.filter((p) => {
    if (!p) return false;
    const searchTarget = `${p.title || ''} ${p.description || ''} ${p.category || ''} ${p.material || ''} ${p.region || ''} ${p.artistLocation || ''} ${(p.tags || []).join(' ')}`.toLowerCase();
    const matchesSearch = searchTarget.includes(searchQuery.toLowerCase());

    let matchesCategory = true;
    if (selectedCategory !== 'all') {
      const catLower = (p.category || '').toLowerCase();
      const tagsStr = (p.tags || []).join(' ').toLowerCase();
      if (selectedCategory === 'pottery') {
        matchesCategory = catLower.includes('pottery') || tagsStr.includes('pottery');
      } else if (selectedCategory === 'silk') {
        matchesCategory = catLower.includes('silk') || catLower.includes('kanjivaram') || catLower.includes('banarasi') || catLower.includes('paithani');
      } else if (selectedCategory === 'bandhani') {
        matchesCategory = catLower.includes('bandhani') || tagsStr.includes('bandhani');
      } else if (selectedCategory === 'metal') {
        matchesCategory = catLower.includes('dhokra') || catLower.includes('metal') || catLower.includes('brass');
      } else if (selectedCategory === 'painting') {
        matchesCategory = catLower.includes('painting') || catLower.includes('madhubani') || catLower.includes('pattachitra') || catLower.includes('warli') || catLower.includes('kalamkari');
      } else if (selectedCategory === 'toys') {
        matchesCategory = catLower.includes('toy') || catLower.includes('wood') || catLower.includes('channapatna');
      } else if (selectedCategory === 'terracotta') {
        matchesCategory = catLower.includes('terracotta') || catLower.includes('jewelry') || tagsStr.includes('terracotta');
      }
    }

    let matchesLocation = true;
    if (selectedLocation !== LOCATIONS[0]) {
      const cleanLoc = selectedLocation.toLowerCase();
      const prodLoc = `${p.region || ''} ${p.artistLocation || ''}`.toLowerCase();
      matchesLocation = prodLoc.includes(cleanLoc.split(',')[0].trim());
    }

    return matchesSearch && matchesCategory && matchesLocation;
  });

  const getArtistForProduct = (artistId: string) => {
    return (artistList.find(a => a?.id === artistId)) || artistList[0];
  };

  return (
    <div className="space-y-4 pb-20">
      {/* ─── 1. Top of the App: Karighar Wordmark ─── */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-stone-200 shadow-xs flex flex-col items-center justify-center text-center space-y-1.5">
        <KarigharWordmark size="lg" showTagline align="center" />
        <p className="text-xs text-stone-500 max-w-md pt-0.5">
          Direct from rural Indian artisans · Authentic handloom, pottery & folk heritage
        </p>
      </div>

      {/* ─── 2. Directly Below Wordmark: Search Bar ─── */}
      <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-stone-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Search Input */}
          <div className="flex items-center gap-2 flex-1">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search crafts (e.g. Blue Pottery, Kanjivaram, Bandhani)..."
                id="buyer-search-input"
                className="w-full h-10 pl-9 pr-3.5 rounded-lg border border-stone-200 text-xs sm:text-sm font-medium focus:border-stone-900 focus:outline-hidden bg-stone-50"
              />
            </div>
            <VoiceInputButton
              language={language}
              onResult={(val) => setSearchQuery(val)}
              className="h-10 w-10 shrink-0 rounded-lg"
            />
          </div>

          {/* Location Selector */}
          <div className="relative">
            <button
              onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
              id="location-picker-btn"
              className="w-full sm:w-auto h-10 px-3 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 text-xs font-semibold text-stone-800 flex items-center justify-between gap-2 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                <span className="truncate">{selectedLocation}</span>
              </div>
              <span className="text-stone-400 text-xs">▾</span>
            </button>

            {isLocationDropdownOpen && (
              <div className="absolute top-11 left-0 sm:right-0 sm:left-auto w-56 bg-white rounded-xl shadow-lg border border-stone-200 p-1 z-30 space-y-0.5 max-h-72 overflow-y-auto">
                {LOCATIONS.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      setSelectedLocation(loc);
                      setIsLocationDropdownOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-colors"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Category Horizontal Scroll Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                  isSelected
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Products Grid */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-1">
          <div>
            <h2 className="font-bold text-base sm:text-lg text-stone-900 flex items-center gap-2">
              <Boxes className="w-4 h-4 text-stone-700" />
              <span>{t.featuredProducts}</span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 border border-stone-200">
                {filteredProducts.length} items
              </span>
            </h2>
            <p className="text-xs text-stone-500">
              Authentic handcrafted items with verified regions and fair artisan pricing
            </p>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl border border-stone-200 p-6">
            <p className="text-stone-500 text-sm">No handmade items found matching your filter.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedLocation(LOCATIONS[0]);
              }}
              className="mt-2 text-xs text-stone-900 font-bold underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filteredProducts.map((product) => {
              const artist = getArtistForProduct(product.artistId);
              const displayRegion = product.artistLocation || product.region || artist.district || 'Rajasthan';
              const displayImage = product.image || (product.imagePaths && product.imagePaths[0]) || '/assets/crafts/blue_pottery_vase.jpg';

              return (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  id={`buyer-prod-${product.id}`}
                  className="bg-white rounded-xl border border-stone-200 hover:border-stone-400 hover:shadow-sm transition-all overflow-hidden flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden bg-stone-100">
                      <img
                        src={displayImage}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                      <span className="absolute top-2 left-2 text-[10px] uppercase font-bold text-stone-800 bg-white/95 px-1.5 py-0.5 rounded border border-stone-200 shadow-xs">
                        {product.category}
                      </span>
                      <span className="absolute bottom-2 right-2 text-[10px] font-semibold text-stone-900 bg-white/90 px-1.5 py-0.5 rounded border border-stone-200 flex items-center gap-1">
                        <Box className="w-3 h-3" />
                        3D
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-3">
                      {/* Title */}
                      <h3 className="font-bold text-xs sm:text-sm text-stone-900 line-clamp-1 group-hover:text-amber-800 transition-colors">
                        {product.title}
                      </h3>

                      {/* Region */}
                      <div className="flex items-center gap-1 text-[11px] text-stone-600 font-medium mt-1 truncate">
                        <MapPin className="w-3 h-3 shrink-0 text-stone-400" />
                        <span className="truncate">{displayRegion}</span>
                      </div>

                      {/* Artisan */}
                      <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                        by {product.artistName || artist.name}
                      </p>

                      <div className="flex items-center gap-1 text-[11px] text-amber-700 font-medium mt-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                        <span>{artist.rating || 4.8} ({artist.reviewsCount || 12})</span>
                      </div>
                    </div>
                  </div>

                  {/* Price Bar */}
                  <div className="p-3 pt-0 flex items-center justify-between border-t border-stone-100 mt-2">
                    <span className="text-sm sm:text-base font-bold text-stone-900">
                      ₹{product.price}
                    </span>
                    <span className="text-xs font-semibold text-stone-700 group-hover:underline flex items-center">
                      View →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Nearby Artisans Section */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-stone-200 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-stone-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-stone-700" />
              <span>Verified Heritage Artisans</span>
            </h3>
            <p className="text-xs text-stone-500">
              Masters of Blue Pottery, Kanjivaram Silk, Bandhani, Madhubani & more
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {artists.slice(0, 6).map((artist) => (
            <div
              key={artist.id}
              onClick={() => onSelectArtist(artist)}
              className="flex items-center gap-3 p-2.5 rounded-lg border border-stone-200 hover:border-stone-400 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <img
                src={artist.avatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100'}
                alt={artist.name}
                className="w-11 h-11 rounded-lg object-cover border border-stone-200 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs sm:text-sm text-stone-900 truncate">
                    {artist.name}
                  </h4>
                  <span className="text-[11px] font-semibold text-amber-700 flex items-center gap-0.5">
                    ★ {artist.rating || 4.8}
                  </span>
                </div>
                <p className="text-xs text-stone-500 truncate">
                  {artist.craft} · {artist.village}, {artist.district}
                </p>
                <p className="text-[10px] text-stone-600 font-medium mt-0.5">
                  {artist.productIds.length} crafts listed
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

