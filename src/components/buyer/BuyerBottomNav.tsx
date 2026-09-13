import React from 'react';
import { Home, Grid, ShoppingCart, Package, User } from 'lucide-react';
import { BuyerTab } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface BuyerBottomNavProps {
  activeTab: BuyerTab;
  onTabChange: (tab: BuyerTab) => void;
  cartCount: number;
}

export const BuyerBottomNav: React.FC<BuyerBottomNavProps> = ({
  activeTab,
  onTabChange,
  cartCount = 0,
}) => {
  const { t } = useLanguage();

  const navItems: { id: BuyerTab; labelKey: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', labelKey: 'home', icon: Home },
    { id: 'categories', labelKey: 'categories', icon: Grid },
    { id: 'cart', labelKey: 'cart', icon: ShoppingCart },
    { id: 'orders', labelKey: 'orders', icon: Package },
    { id: 'profile', labelKey: 'profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-[#FFFFFF] border-t border-[#DDDDDD] shadow-lg flex items-center justify-around h-14 sm:h-15 px-1 sm:px-2 safe-area-bottom select-none">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        const isCart = item.id === 'cart';

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onTabChange(item.id)}
            className={`min-h-[44px] flex flex-col items-center justify-center flex-1 py-1 transition-all relative cursor-pointer active:scale-95 ${
              isActive ? 'text-[#FF9900]' : 'text-[#565959] hover:text-[#111111]'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-[#FF9900]' : ''}`} />
              {isCart && cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#FF9900] text-white font-extrabold text-[9px] min-w-[15px] h-[15px] rounded-full flex items-center justify-center px-0.5 border border-white">
                  {cartCount}
                </span>
              )}
            </div>
            <span className={`text-[9px] sm:text-[10px] mt-0.5 font-medium tracking-tight truncate max-w-[52px] sm:max-w-none ${isActive ? 'font-bold text-[#111111]' : ''}`}>
              {t(item.labelKey)}
            </span>
            {isActive && (
              <span className="absolute bottom-0.5 w-6 sm:w-8 h-0.5 bg-[#FF9900] rounded-full" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
