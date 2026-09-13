import React from 'react';
import { ArrowRight, Sparkles, MapPin } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { REAL_CRAFT_CATEGORIES } from '../../data/realCraftsData';

interface BuyerCategoriesScreenProps {
  onSelectCategory: (categoryId: string) => void;
}

export const BuyerCategoriesScreen: React.FC<BuyerCategoriesScreenProps> = ({
  onSelectCategory,
}) => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#111111] pb-24 p-3 sm:p-4 md:p-6 max-w-6xl mx-auto space-y-4 sm:space-y-6 select-none">
      <div className="border-b border-[#DDDDDD] pb-3">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-[#FF9900] text-xs font-bold mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>GI Certified Master Heritage Directory</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#111111]">
          {t('categories')}
        </h1>
        <p className="text-xs sm:text-sm text-[#565959]">
          Explore authentic crafts categorized by age-old regional traditions
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {REAL_CRAFT_CATEGORIES.map((craft) => {
          return (
            <div
              key={craft.id}
              onClick={() => onSelectCategory(craft.id)}
              className="group border border-[#DDDDDD] rounded-lg overflow-hidden bg-white hover:border-[#FF9900] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="relative aspect-16/10 bg-[#F5F5F5] overflow-hidden">
                <img
                  src={craft.image}
                  alt={craft.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                
                <div className="absolute bottom-2.5 left-3 right-3 text-white">
                  <div className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{craft.region}</span>
                  </div>
                  <h3 className="font-extrabold text-base sm:text-lg leading-tight drop-shadow-xs">
                    {craft.name}
                  </h3>
                </div>
              </div>

              <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                <div className="space-y-1 text-xs text-[#565959]">
                  <div>
                    <span className="font-bold text-[#111111]">Materials: </span>
                    <span>{craft.materials}</span>
                  </div>
                  <div>
                    <span className="font-bold text-[#111111]">Making Time: </span>
                    <span>{craft.makingTime}</span>
                  </div>
                  <div>
                    <span className="font-bold text-[#111111]">Price Range: </span>
                    <span className="text-[#007600] font-bold">
                      ₹{craft.priceRange[0]} - ₹{craft.priceRange[1]}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#F5F5F5] flex items-center justify-between text-xs font-bold text-[#FF9900]">
                  <span>Browse Products</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
