import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface FeaturedCategory {
  id: string;
  nameKey: string;
  fallback: string;
  count: number;
  image: string;
  region: string;
}

const FEATURED_CATS: FeaturedCategory[] = [
  {
    id: 'pottery',
    nameKey: 'craft_blue_pottery',
    fallback: 'Blue Pottery',
    count: 24,
    image: '/assets/crafts/blue_pottery_vase.jpg',
    region: 'Jaipur, Rajasthan',
  },
  {
    id: 'silk',
    nameKey: 'craft_silk_sarees',
    fallback: 'Silk Sarees',
    count: 48,
    image: '/assets/crafts/kanjivaram_saree.jpg',
    region: 'Kanchipuram & Varanasi',
  },
  {
    id: 'jewelry',
    nameKey: 'craft_jewelry',
    fallback: 'Terracotta Jewelry',
    count: 36,
    image: '/assets/crafts/terracotta_jewelry.jpg',
    region: 'Bankura, West Bengal',
  },
  {
    id: 'painting',
    nameKey: 'craft_paintings',
    fallback: 'Folk Paintings',
    count: 42,
    image: '/assets/crafts/madhubani_painting.jpg',
    region: 'Mithila & Maharashtra',
  },
  {
    id: 'woodwork',
    nameKey: 'craft_woodwork',
    fallback: 'Channapatna Woodwork',
    count: 19,
    image: '/assets/crafts/channapatna_toys.jpg',
    region: 'Karnataka',
  },
  {
    id: 'metal',
    nameKey: 'craft_metal',
    fallback: 'Dhokra Metal Craft',
    count: 15,
    image: '/assets/crafts/dhokra_figurine.jpg',
    region: 'Bastar, Chhattisgarh',
  },
];

interface FeaturedCategoriesGridProps {
  onSelectCategory: (catId: string) => void;
}

export const FeaturedCategoriesGrid: React.FC<FeaturedCategoriesGridProps> = ({
  onSelectCategory,
}) => {
  const { t } = useLanguage();

  return (
    <div className="bg-[#FFFFFF] border border-[#DDDDDD] rounded-lg p-3 sm:p-4 space-y-3 sm:space-y-3.5 shadow-xs select-none">
      <div className="flex items-center justify-between border-b border-[#DDDDDD] pb-2.5">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-[#111111]">
            {t('featuredCategories')}
          </h2>
          <p className="text-[11px] text-[#565959]">
            Geographical Indication (GI) tagged Indian artisanal legacies
          </p>
        </div>
      </div>

      {/* 2x3 Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
        {FEATURED_CATS.map((cat) => {
          const label = t(cat.nameKey, cat.fallback);

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="group border border-[#DDDDDD] rounded-[4px] p-1.5 sm:p-2 hover:border-[#FF9900] hover:shadow-sm transition-all cursor-pointer bg-[#FFFFFF] flex flex-col justify-between"
            >
              <div className="aspect-4/3 rounded-[2px] overflow-hidden bg-[#F5F5F5] mb-2 relative">
                <img
                  src={cat.image}
                  alt={label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-xs">
                  {cat.count} items
                </span>
              </div>

              <div>
                <h3 className="font-bold text-xs sm:text-sm text-[#111111] group-hover:text-[#FF9900] truncate">
                  {label}
                </h3>
                <p className="text-[10px] text-[#565959] truncate font-medium">
                  {cat.region}
                </p>
              </div>

              <div className="mt-2 text-[11px] font-bold text-[#FF9900] flex items-center gap-1">
                <span>Explore</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
