import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Filter } from 'lucide-react';
import { Product, Artist } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { CategoryStrip } from '../buyer/CategoryStrip';
import { HeroCarousel } from '../buyer/HeroCarousel';
import { DealOfTheDay } from '../buyer/DealOfTheDay';
import { FeaturedCategoriesGrid } from '../buyer/FeaturedCategoriesGrid';
import { TrendingArtisans } from '../buyer/TrendingArtisans';
import { ProductCard } from '../buyer/ProductCard';

interface BuyerHomeScreenProps {
  products: Product[];
  artists: Artist[];
  onSelectProduct: (product: Product) => void;
  onSelectArtist: (artist: Artist) => void;
  onAddToCart?: (product: Product) => void;
  onOpenSearch: () => void;
}

export const BuyerHomeScreen: React.FC<BuyerHomeScreenProps> = ({
  products = [],
  artists = [],
  onSelectProduct,
  onSelectArtist,
  onAddToCart,
  onOpenSearch,
}) => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

  const handleToggleWishlist = (id: string) => {
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter products by selected category
  const filteredProducts = products.filter((p) => {
    if (selectedCategory === 'all') return true;
    const catLower = (p.category || '').toLowerCase();
    const tagsStr = (p.tags || []).join(' ').toLowerCase();

    if (selectedCategory === 'pottery') {
      return catLower.includes('pottery') || tagsStr.includes('pottery');
    }
    if (selectedCategory === 'silk') {
      return catLower.includes('silk') || catLower.includes('saree') || tagsStr.includes('silk');
    }
    if (selectedCategory === 'jewelry') {
      return catLower.includes('jewelry') || tagsStr.includes('jewelry') || catLower.includes('terracotta');
    }
    if (selectedCategory === 'painting') {
      return catLower.includes('painting') || tagsStr.includes('painting') || catLower.includes('madhubani');
    }
    if (selectedCategory === 'woodwork') {
      return catLower.includes('wood') || tagsStr.includes('wood') || catLower.includes('toy');
    }
    if (selectedCategory === 'metal') {
      return catLower.includes('metal') || tagsStr.includes('metal') || catLower.includes('dhokra');
    }
    if (selectedCategory === 'toys') {
      return catLower.includes('toy') || tagsStr.includes('toy');
    }
    if (selectedCategory === 'decor') {
      return catLower.includes('decor') || tagsStr.includes('decor');
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#111111] pb-24 space-y-6">
      {/* 1. Category Strip (Horizontal circular icons) */}
      <CategoryStrip
        selectedCategory={selectedCategory}
        onSelectCategory={(catId) => setSelectedCategory(catId)}
      />

      {/* 2. Hero Banner Carousel */}
      <div className="max-w-7xl mx-auto px-0 sm:px-4">
        <HeroCarousel
          onBannerClick={(tag) => {
            setSelectedCategory(tag);
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-2.5 sm:px-4 md:px-6 space-y-6 sm:space-y-8">
        {/* 3. Deal of the Day Section */}
        <DealOfTheDay
          products={products}
          onSelectProduct={onSelectProduct}
          onAddToCart={onAddToCart}
        />

        {/* 4. Featured Categories (2x3 visual craft grid) */}
        <FeaturedCategoriesGrid
          onSelectCategory={(catId) => {
            setSelectedCategory(catId);
            window.scrollTo({ top: 800, behavior: 'smooth' });
          }}
        />

        {/* 5. Trending Artisans Section */}
        <TrendingArtisans
          artists={artists}
          onSelectArtist={onSelectArtist}
        />

        {/* 6. Recommended Products Section */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between border-b border-[#DDDDDD] pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-[#111111]">
                  {t('recommendedForYou')}
                </h2>
                <span className="text-xs font-bold text-[#007600] bg-emerald-50 px-2 py-0.5 rounded-full">
                  {filteredProducts.length} items
                </span>
              </div>
              <p className="text-xs text-[#565959] mt-0.5">
                Authentic handcrafted Indian heritage pieces with fair artisan price transparency
              </p>
            </div>

            {selectedCategory !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className="text-xs font-bold text-[#FF9900] hover:underline cursor-pointer"
              >
                Clear filter
              </button>
            )}
          </div>

          {/* Product Grid: 2 columns on phone, 3 on tablet, 4 on laptop */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-[#F5F5F5] rounded-lg p-6 border border-[#DDDDDD]">
              <p className="text-[#565959] text-sm font-medium">
                {t('noProductsFound')}
              </p>
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className="mt-3 text-xs font-bold text-[#FF9900] underline cursor-pointer"
              >
                {t('allCrafts')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
              {filteredProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onSelect={onSelectProduct}
                  onAddToCart={onAddToCart}
                  isWishlisted={Boolean(wishlist[prod.id])}
                  onToggleWishlist={handleToggleWishlist}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
