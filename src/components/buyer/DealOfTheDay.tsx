import React, { useState, useEffect } from 'react';
import { Clock, Flame, ChevronRight, Star } from 'lucide-react';
import { Product } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface DealOfTheDayProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

export const DealOfTheDay: React.FC<DealOfTheDayProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
}) => {
  const { t } = useLanguage();

  // Simulated countdown timer: 4h 35m 20s
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 35, seconds: 20 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 5, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  // Grab 4 deal products
  const dealProducts = products.slice(0, 4);

  return (
    <div className="bg-[#FFFFFF] border border-[#DDDDDD] rounded-lg p-4 space-y-3.5 shadow-xs select-none">
      {/* Header with Title & Timer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DDDDDD] pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-red-100 text-red-600">
            <Flame className="w-5 h-5 fill-red-600" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-[#111111] leading-none">
              {t('dealOfTheDay')}
            </h2>
            <span className="text-[11px] text-[#565959] font-medium">
              Limited time artisan direct discounts
            </span>
          </div>
        </div>

        {/* Live Countdown Box */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-[#F5F5F5] px-3 py-1.5 rounded-md border border-[#DDDDDD]">
          <Clock className="w-3.5 h-3.5 text-red-600" />
          <span className="text-xs text-[#565959] font-semibold">{t('endsIn')}:</span>
          <span className="font-mono text-xs font-extrabold text-red-600">
            {formatNumber(timeLeft.hours)}:{formatNumber(timeLeft.minutes)}:{formatNumber(timeLeft.seconds)}
          </span>
        </div>
      </div>

      {/* Horizontal Scroll of Deal Cards */}
      <div className="flex items-stretch gap-3 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
        {dealProducts.map((prod) => {
          const originalPrice = Math.round(prod.price * 1.4);
          const discountPercent = Math.round(((originalPrice - prod.price) / originalPrice) * 100);
          const displayImage = prod.image || (prod.imagePaths && prod.imagePaths[0]) || '/assets/crafts/blue_pottery_vase.jpg';

          return (
            <div
              key={prod.id}
              onClick={() => onSelectProduct(prod)}
              className="w-48 sm:w-56 shrink-0 bg-[#FFFFFF] border border-[#DDDDDD] rounded-[4px] p-2.5 flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div>
                {/* Image + Deal Badge */}
                <div className="relative aspect-square w-full bg-[#F5F5F5] rounded-[2px] overflow-hidden mb-2">
                  <img
                    src={displayImage}
                    alt={prod.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-1.5 left-1.5 bg-[#CC0C39] text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-[2px]">
                    {discountPercent}% OFF
                  </span>
                </div>

                {/* Title */}
                <h4 className="font-bold text-xs sm:text-sm text-[#111111] line-clamp-2 leading-snug group-hover:text-[#FF9900]">
                  {prod.title}
                </h4>

                {/* Ratings */}
                <div className="flex items-center gap-1 text-[11px] text-[#565959] mt-1">
                  <div className="flex items-center text-[#FFA41C]">
                    <Star className="w-3 h-3 fill-[#FFA41C]" />
                    <span className="font-bold ml-0.5 text-[#111111]">
                      {prod.rating || 4.8}
                    </span>
                  </div>
                  <span>({prod.reviewCount || 34})</span>
                </div>
              </div>

              {/* Price & Add to Cart */}
              <div className="mt-2 pt-2 border-t border-[#F5F5F5] flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-[#007600] text-base leading-none">
                    ₹{prod.price}
                  </div>
                  <div className="text-[10px] text-[#565959] line-through">
                    ₹{originalPrice}
                  </div>
                </div>

                {onAddToCart && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(prod);
                    }}
                    className="px-2.5 py-1.5 rounded-[3px] bg-[#FFD814] hover:bg-[#F7CA00] text-[#111111] text-[11px] font-bold cursor-pointer transition-colors shadow-xs"
                  >
                    + {t('addToCart')}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
