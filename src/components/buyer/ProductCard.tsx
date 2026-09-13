import React, { useState } from 'react';
import { Heart, Star, Check, ShoppingCart, ShieldCheck } from 'lucide-react';
import { Product } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddToCart,
  isWishlisted = false,
  onToggleWishlist,
}) => {
  const { t } = useLanguage();
  const [justAdded, setJustAdded] = useState(false);

  // Original price simulation if not provided (approx 25-35% higher)
  const originalPrice = Math.round(product.price * 1.35);
  const discountPercent = Math.round(((originalPrice - product.price) / originalPrice) * 100);
  const rating = product.rating || 4.8;
  const reviewCount = product.reviewCount || 28;
  const displayImage = product.image || (product.imagePaths && product.imagePaths[0]) || '/assets/crafts/blue_pottery_vase.jpg';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1800);
    }
  };

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleWishlist) {
      onToggleWishlist(product.id);
    }
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="bg-[#FFFFFF] border border-[#DDDDDD] rounded-[4px] overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer group select-none relative"
    >
      <div>
        {/* Square Image container (1:1 ratio) */}
        <div className="relative aspect-square w-full bg-[#F5F5F5] overflow-hidden">
          <img
            src={displayImage}
            alt={product.title}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
            referrerPolicy="no-referrer"
          />

          {/* Discount Badge */}
          {discountPercent > 0 && (
            <div className="absolute top-2 left-2 bg-[#CC0C39] text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-[2px] shadow-xs">
              {discountPercent}% OFF
            </div>
          )}

          {/* Wishlist Heart */}
          <button
            type="button"
            onClick={handleHeartClick}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white text-[#565959] hover:text-red-500 shadow-xs transition-colors cursor-pointer"
            title="Add to Wishlist"
          >
            <Heart
              className={`w-4 h-4 ${
                isWishlisted ? 'fill-red-500 text-red-500' : 'text-[#565959]'
              }`}
            />
          </button>
        </div>

        {/* Card Content (Dense, fluid padding) */}
        <div className="p-2 sm:p-3 space-y-1 sm:space-y-1.5">
          {/* Artisan & Region info tag */}
          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-[#565959] truncate font-medium">
            <ShieldCheck className="w-3 h-3 text-[#007600] shrink-0" />
            <span className="truncate">
              {product.artistName || 'Heritage Artisan'} · {product.artistLocation || product.region || 'India'}
            </span>
          </div>

          {/* Product Title (2 lines max, fluid bold) */}
          <h3 className="font-bold text-xs sm:text-sm md:text-base text-[#111111] line-clamp-2 leading-snug group-hover:text-[#FF9900] transition-colors">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 text-[11px] sm:text-xs text-[#565959]">
            <div className="flex items-center text-[#FFA41C]">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#FFA41C]" />
              <span className="font-bold ml-1 text-[#111111]">{rating}</span>
            </div>
            <span>({reviewCount})</span>
          </div>

          {/* Price Block: Green bold price + strikethrough MRP */}
          <div className="pt-0.5 sm:pt-1 flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
            <span className="text-base sm:text-lg md:text-xl font-extrabold text-[#007600]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] sm:text-xs text-[#565959] line-through">
              ₹{originalPrice.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Delivery perk */}
          <div className="text-[10px] sm:text-[11px] font-semibold text-[#007600] truncate">
            {t('freeDelivery')}
          </div>
        </div>
      </div>

      {/* Add to Cart Button (Bottom of Card) */}
      <div className="p-2 sm:p-3 pt-0">
        <button
          type="button"
          onClick={handleAddToCart}
          className={`w-full h-8 sm:h-8.5 rounded-[4px] text-xs font-bold transition-all flex items-center justify-center gap-1 sm:gap-1.5 shadow-xs cursor-pointer active:scale-[0.97] ${
            justAdded
              ? 'bg-[#007600] text-white'
              : 'bg-[#FFD814] hover:bg-[#F7CA00] text-[#111111] border border-[#FCD200]'
          }`}
        >
          {justAdded ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>{t('addedToCart')}</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-3.5 h-3.5 text-[#111111]" />
              <span>{t('addToCart')}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
