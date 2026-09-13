import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowLeft, 
  SlidersHorizontal, 
  Star, 
  X, 
  Clock, 
  TrendingUp, 
  Check,
  Mic
} from 'lucide-react';
import { Product } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { ProductCard } from '../buyer/ProductCard';
import { VoiceInputButton } from '../common/VoiceInputButton';

interface BuyerSearchScreenProps {
  products: Product[];
  initialQuery?: string;
  onSelectProduct: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onBack: () => void;
}

const RECENT_SEARCHES = [
  'Blue Pottery Vase',
  'Kanjivaram Silk',
  'Dhokra Figurine',
  'Madhubani',
  'Channapatna Wooden Toys',
];

const TRENDING_SEARCHES = [
  'Jaipur Blue Pottery',
  'Pure Mulberry Silk',
  'Handmade Terracotta',
  'Warli Tribal Art',
  'Brass Castings',
  'Bagru Block Print',
];

export const BuyerSearchScreen: React.FC<BuyerSearchScreenProps> = ({
  products,
  initialQuery = '',
  onSelectProduct,
  onAddToCart,
  onBack,
}) => {
  const { language, t } = useLanguage();
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'rating'>('featured');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Available unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  // Filtering & sorting logic
  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => {
      const q = query.toLowerCase().trim();
      const matchText = `${p.title} ${p.description} ${p.category} ${p.material} ${p.region || ''} ${(p.tags || []).join(' ')}`.toLowerCase();
      const matchesQuery = !q || matchText.includes(q);
      const matchesCat = selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesPrice = p.price <= maxPrice;
      const matchesRating = (p.rating || 4.5) >= minRating;

      return matchesQuery && matchesCat && matchesPrice && matchesRating;
    });

    if (sortBy === 'price_asc') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list = [...list].sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));
    }

    return list;
  }, [products, query, selectedCategory, maxPrice, minRating, sortBy]);

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#111111] pb-20 select-none">
      {/* Sticky Top Bar with Search */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#DDDDDD] p-3 shadow-xs">
        <div className="max-w-5xl mx-auto flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-md hover:bg-[#F5F5F5] text-[#111111] cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#565959] absolute left-3 top-3.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              autoFocus
              className="w-full h-11 pl-9 pr-10 rounded-md border border-[#DDDDDD] focus:border-[#FF9900] focus:outline-none text-sm text-[#111111] bg-white shadow-inner"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3 top-3 text-[#565959] hover:text-[#111111] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <VoiceInputButton
            language={language}
            onResult={(val) => setQuery(val)}
            className="h-11 w-11 shrink-0 rounded-md border border-[#DDDDDD] bg-white"
          />

          <button
            type="button"
            onClick={() => setIsFilterOpen(true)}
            className={`h-11 px-3 rounded-md border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
              selectedCategory !== 'all' || maxPrice < 10000 || minRating > 0
                ? 'bg-amber-50 border-[#FF9900] text-[#FF9900]'
                : 'border-[#DDDDDD] hover:bg-[#F5F5F5] text-[#111111]'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">{t('filter')}</span>
          </button>
        </div>

        {/* Sort Bar */}
        <div className="max-w-5xl mx-auto flex items-center justify-between mt-2 pt-2 border-t border-[#F5F5F5] text-xs text-[#565959]">
          <span>
            {filteredProducts.length} {t('items')}
          </span>

          <div className="flex items-center gap-1.5">
            <span>{t('sortBy')}:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#F5F5F5] border border-[#DDDDDD] rounded px-2 py-1 text-xs font-semibold text-[#111111] focus:outline-none"
            >
              <option value="featured">{t('recommendedForYou')}</option>
              <option value="price_asc">{t('priceLowHigh')}</option>
              <option value="price_desc">{t('priceHighLow')}</option>
              <option value="rating">{t('ratingHighLow')}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 space-y-6">
        {/* Quick Search Chips if query is empty */}
        {!query && (
          <div className="space-y-4">
            {/* Recent Searches */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#565959]">
                <Clock className="w-3.5 h-3.5" />
                <span>{t('recentSearches')}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {RECENT_SEARCHES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setQuery(item)}
                    className="px-3 py-1.5 rounded-full bg-[#F5F5F5] hover:bg-gray-200 border border-[#DDDDDD] text-xs font-medium text-[#111111] transition-colors cursor-pointer"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Trending Searches */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-red-600">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{t('trendingSearches')}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {TRENDING_SEARCHES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setQuery(item)}
                    className="px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200 text-xs font-semibold text-[#FF9900] transition-colors cursor-pointer"
                  >
                    🔥 {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-[#F5F5F5] rounded-lg p-6 border border-[#DDDDDD]">
            <p className="text-gray-500 font-medium text-sm">{t('noProductsFound')}</p>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSelectedCategory('all');
                setMaxPrice(10000);
                setMinRating(0);
              }}
              className="mt-3 text-xs font-bold text-[#FF9900] underline cursor-pointer"
            >
              {t('resetFilters')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onSelect={onSelectProduct}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}
      </div>

      {/* Filter Modal / Drawer */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end animate-fade-in">
          <div className="w-full max-w-sm bg-white h-full p-5 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-[#DDDDDD] pb-3">
                <h3 className="font-extrabold text-base text-[#111111]">
                  {t('filter')}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(false)}
                  className="p-1.5 rounded-md hover:bg-[#F5F5F5] cursor-pointer"
                >
                  <X className="w-5 h-5 text-[#565959]" />
                </button>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#565959] uppercase tracking-wider">
                  {t('filterByCategory')}
                </label>
                <div className="space-y-1 max-h-44 overflow-y-auto">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left px-3 py-2 rounded-md text-xs font-medium flex items-center justify-between cursor-pointer ${
                      selectedCategory === 'all'
                        ? 'bg-[#FF9900]/15 text-[#111111] font-bold'
                        : 'hover:bg-[#F5F5F5]'
                    }`}
                  >
                    <span>{t('allCrafts')}</span>
                    {selectedCategory === 'all' && <Check className="w-4 h-4 text-[#FF9900]" />}
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-3 py-2 rounded-md text-xs font-medium flex items-center justify-between cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-[#FF9900]/15 text-[#111111] font-bold'
                          : 'hover:bg-[#F5F5F5]'
                      }`}
                    >
                      <span>{cat}</span>
                      {selectedCategory === cat && <Check className="w-4 h-4 text-[#FF9900]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Price Range Filter */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#565959]">{t('filterByPrice')}</span>
                  <span className="text-[#007600]">Up to ₹{maxPrice.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min={300}
                  max={10000}
                  step={200}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#FF9900] cursor-pointer"
                />
              </div>

              {/* Min Rating Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#565959] uppercase tracking-wider">
                  {t('filterByRating')}
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[4, 3, 2, 0].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setMinRating(star)}
                      className={`py-1.5 px-2 rounded-md border text-xs font-bold text-center cursor-pointer transition-colors ${
                        minRating === star
                          ? 'border-[#FF9900] bg-amber-50 text-[#FF9900]'
                          : 'border-[#DDDDDD] hover:bg-[#F5F5F5] text-[#111111]'
                      }`}
                    >
                      {star > 0 ? `${star}★+` : 'All'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-[#DDDDDD] flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setMaxPrice(10000);
                  setMinRating(0);
                }}
                className="flex-1 py-2.5 rounded-md border border-[#DDDDDD] text-xs font-bold text-[#111111] hover:bg-[#F5F5F5] cursor-pointer"
              >
                {t('resetFilters')}
              </button>
              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="flex-1 py-2.5 rounded-md bg-[#FF9900] hover:bg-[#e68a00] text-[#111111] text-xs font-bold cursor-pointer"
              >
                {t('applyFilters')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
