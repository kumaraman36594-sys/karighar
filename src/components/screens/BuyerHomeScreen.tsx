import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Sparkles, 
  Filter, 
  Star, 
  ChevronRight, 
  ShoppingBag, 
  Users,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { Product, Artist, Language } from '../../types';
import { TRANSLATIONS } from '../../utils/translations';
import { VoiceInputButton } from '../common/VoiceInputButton';

interface BuyerHomeScreenProps {
  products: Product[];
  artists: Artist[];
  language: Language;
  onSelectProduct: (product: Product) => void;
  onSelectArtist: (artist: Artist) => void;
}

const CATEGORIES = [
  { id: 'all', label: 'All Crafts (सभी)', emoji: '✨' },
  { id: 'pottery', label: 'Blue Pottery (पॉटरी)', emoji: '🏺' },
  { id: 'silk', label: 'Silk Sarees (सिल्क)', emoji: '🥻' },
  { id: 'bandhani', label: 'Bandhani (बांधनी)', emoji: '🧣' },
  { id: 'metal', label: 'Dhokra Metal (धातु शिल्प)', emoji: '🪙' },
  { id: 'painting', label: 'Folk Paintings (चित्रकारी)', emoji: '🎨' },
  { id: 'toys', label: 'Channapatna Toys (खिलौने)', emoji: '🪵' },
  { id: 'terracotta', label: 'Terracotta (टेराकोटा)', emoji: '📿' },
];

const LOCATIONS = [
  '📍 All India (सम्पूर्ण भारत)',
  '📍 Jaipur, Rajasthan',
  '📍 Kanchipuram, Tamil Nadu',
  '📍 Kutch, Gujarat',
  '📍 Varanasi, UP',
  '📍 Bastar, Chhattisgarh',
  '📍 Mithila, Bihar',
  '📍 Puri, Odisha',
  '📍 Paithan, Maharashtra',
  '📍 Channapatna, Karnataka',
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
      const cleanLoc = selectedLocation.replace('📍 ', '').toLowerCase();
      const prodLoc = `${p.region || ''} ${p.artistLocation || ''}`.toLowerCase();
      matchesLocation = prodLoc.includes(cleanLoc.split(',')[0].trim());
    }

    return matchesSearch && matchesCategory && matchesLocation;
  });

  const getArtistForProduct = (artistId: string) => {
    return (artistList.find(a => a?.id === artistId)) || artistList[0];
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Pan-India Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 rounded-3xl p-5 sm:p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>12 Real Indian Heritage Crafts · सीधे ग्रामीण कारीगरों से</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
            कारीगर — India's Real Local Crafts
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 max-w-xl mt-1 leading-relaxed">
            Directly from Bagru, Kanchipuram, Kutch, Bastar, Mithila & more. Fair prices, authentic GI crafts, no middlemen.
          </p>
        </div>
      </div>

      {/* Search & Location Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Search Input */}
          <div className="flex items-center gap-2 flex-1">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search crafts (e.g. Blue Pottery, Kanjivaram, Bandhani)..."
                id="buyer-search-input"
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 text-sm font-medium focus:border-indigo-600 focus:outline-hidden bg-gray-50/50"
              />
            </div>
            <VoiceInputButton
              language={language}
              onResult={(val) => setSearchQuery(val)}
              className="h-11 w-11 shrink-0 rounded-xl"
            />
          </div>

          {/* Location Selector Chip */}
          <div className="relative">
            <button
              onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
              id="location-picker-btn"
              className="w-full sm:w-auto h-11 px-3.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-xs font-bold text-indigo-900 flex items-center justify-between gap-2 cursor-pointer transition-colors"
            >
              <span>{selectedLocation} ▾</span>
            </button>

            {isLocationDropdownOpen && (
              <div className="absolute top-12 left-0 sm:right-0 sm:left-auto w-56 bg-white rounded-2xl shadow-xl border border-gray-200 p-1.5 z-30 space-y-0.5 max-h-72 overflow-y-auto">
                {LOCATIONS.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      setSelectedLocation(loc);
                      setIsLocationDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Category Horizontal Scroll Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Products Grid (2 cols on phone, 3 on tablet, 4 on laptop) */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <h2 className="font-extrabold text-lg sm:text-xl text-gray-900 flex items-center gap-2">
              <span>🏺 {t.featuredProducts}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                {filteredProducts.length} items
              </span>
            </h2>
            <p className="text-xs text-gray-500">
              100% authentic crafts with verified regions and fair artisan pricing
            </p>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-gray-200 p-6">
            <p className="text-gray-500 text-sm">No handmade items found matching your filter.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedLocation(LOCATIONS[0]);
              }}
              className="mt-3 text-xs text-indigo-600 font-bold underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Responsive Grid as specified: 2 col phone, 3 col tablet, 4 col laptop */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
            {filteredProducts.map((product) => {
              const artist = getArtistForProduct(product.artistId);
              const displayRegion = product.artistLocation || product.region || artist.district || 'Rajasthan';
              const displayImage = product.image || (product.imagePaths && product.imagePaths[0]) || '/assets/crafts/blue_pottery_vase.jpg';

              return (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  id={`buyer-prod-${product.id}`}
                  className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 hover:border-indigo-400 hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <img
                        src={displayImage}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                      <span className="absolute top-2 left-2 text-[10px] uppercase font-bold text-indigo-900 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-md shadow-xs">
                        {product.category}
                      </span>
                      <span className="absolute bottom-2 right-2 text-[10px] font-bold text-white bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded">
                        🔄 3D View
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-3 sm:p-3.5">
                      {/* Title */}
                      <h3 className="font-bold text-sm sm:text-base text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        {product.title}
                      </h3>

                      {/* Region (Part 2 & Part 5 requirement: image, title, price, region) */}
                      <div className="flex items-center gap-1 text-[11px] text-indigo-700 font-medium mt-1 truncate">
                        <MapPin className="w-3 h-3 shrink-0 text-indigo-500" />
                        <span className="truncate">{displayRegion}</span>
                      </div>

                      {/* Artisan */}
                      <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                        by {product.artistName || artist.name}
                      </p>

                      <div className="flex items-center gap-1 text-[11px] text-amber-600 font-semibold mt-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{artist.rating || 4.8} ({artist.reviewsCount || 12})</span>
                      </div>
                    </div>
                  </div>

                  {/* Price Bar */}
                  <div className="p-3 sm:p-3.5 pt-0 flex items-center justify-between border-t border-gray-100 mt-2">
                    <div>
                      <span className="text-base sm:text-lg font-extrabold text-emerald-600">
                        ₹{product.price}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-indigo-600 group-hover:underline flex items-center">
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
      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
              <span>👥 Verified Heritage Artisans</span>
            </h3>
            <p className="text-xs text-gray-500">
              Masters of Blue Pottery, Kanjivaram Silk, Bandhani, Madhubani & more
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {artists.slice(0, 6).map((artist) => (
            <div
              key={artist.id}
              onClick={() => onSelectArtist(artist)}
              className="flex items-center gap-3 p-3 rounded-2xl border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/20 transition-all cursor-pointer"
            >
              <img
                src={artist.avatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100'}
                alt={artist.name}
                className="w-12 h-12 rounded-xl object-cover border border-gray-200 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-gray-900 truncate">
                    {artist.name}
                  </h4>
                  <span className="text-[11px] font-bold text-amber-600 flex items-center gap-0.5">
                    ★ {artist.rating || 4.8}
                  </span>
                </div>
                <p className="text-xs text-gray-500 truncate">
                  {artist.craft} · {artist.village}, {artist.district}
                </p>
                <p className="text-[10px] text-indigo-600 font-semibold mt-0.5">
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
