import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface CategoryItem {
  id: string;
  nameKey: string;
  fallback: string;
  image: string;
  iconFallback?: string;
}

const CATEGORY_ITEMS: CategoryItem[] = [
  {
    id: 'pottery',
    nameKey: 'craft_blue_pottery',
    fallback: 'Blue Pottery',
    image: '/assets/crafts/blue_pottery_vase.jpg',
  },
  {
    id: 'silk',
    nameKey: 'craft_silk_sarees',
    fallback: 'Silk Sarees',
    image: '/assets/crafts/kanjivaram_saree.jpg',
  },
  {
    id: 'jewelry',
    nameKey: 'craft_jewelry',
    fallback: 'Jewelry',
    image: '/assets/crafts/terracotta_jewelry.jpg',
  },
  {
    id: 'painting',
    nameKey: 'craft_paintings',
    fallback: 'Paintings',
    image: '/assets/crafts/madhubani_painting.jpg',
  },
  {
    id: 'woodwork',
    nameKey: 'craft_woodwork',
    fallback: 'Woodwork',
    image: '/assets/crafts/channapatna_toys.jpg',
  },
  {
    id: 'metal',
    nameKey: 'craft_metal',
    fallback: 'Metal Craft',
    image: '/assets/crafts/dhokra_figurine.jpg',
  },
  {
    id: 'toys',
    nameKey: 'craft_toys',
    fallback: 'Toys',
    image: '/assets/crafts/channapatna_toys.jpg',
  },
  {
    id: 'decor',
    nameKey: 'craft_home_decor',
    fallback: 'Home Decor',
    image: '/assets/crafts/pattachitra_painting.jpg',
  },
  {
    id: 'all',
    nameKey: 'allCrafts',
    fallback: 'More Crafts',
    image: '/assets/crafts/bandhani_dupatta.jpg',
  },
];

interface CategoryStripProps {
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
}

export const CategoryStrip: React.FC<CategoryStripProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const { t } = useLanguage();

  return (
    <div className="bg-[#FFFFFF] border-b border-[#DDDDDD] py-3 px-2 sm:px-4 select-none">
      <div className="max-w-7xl mx-auto flex items-center gap-3 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth">
        {CATEGORY_ITEMS.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const label = t(cat.nameKey, cat.fallback);

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer"
            >
              {/* Circular Avatar */}
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden p-0.5 border-2 transition-all ${
                  isSelected
                    ? 'border-[#FF9900] ring-2 ring-[#FF9900]/30 scale-105 shadow-sm'
                    : 'border-[#DDDDDD] group-hover:border-[#FF9900]'
                }`}
              >
                <img
                  src={cat.image}
                  alt={label}
                  className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Category Label */}
              <span
                className={`text-[11px] sm:text-xs font-semibold text-center leading-tight max-w-[92px] truncate px-0.5 transition-colors ${
                  isSelected
                    ? 'text-[#FF9900] font-bold'
                    : 'text-[#111111] group-hover:text-[#FF9900]'
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
