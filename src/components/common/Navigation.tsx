import React from 'react';
import { 
  Users, 
  Camera, 
  ListOrdered, 
  Coins, 
  User, 
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import { ScreenName, UserRole, Language } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface NavItem {
  id: ScreenName;
  labelKey: string;
  defaultLabel: string;
  icon: React.FC<{ className?: string }>;
  isPrimary?: boolean;
}

interface NavigationProps {
  currentScreen?: ScreenName;
  activeTab?: string;
  role?: UserRole;
  currentRole?: UserRole;
  language?: Language;
  currentLanguage?: Language;
  onNavigate?: (screen: ScreenName) => void;
  onTabChange?: (tab: string) => void;
  tokenCount?: number;
  isTabletOrDesktop?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentScreen,
  activeTab,
  role = 'seller',
  currentRole,
  onNavigate,
  onTabChange,
  tokenCount,
}) => {
  const activeRole = currentRole || role;
  const { t } = useLanguage();

  const handleNav = (screenId: ScreenName) => {
    if (onNavigate) onNavigate(screenId);
    if (onTabChange) onTabChange(screenId);
  };

  const currentActive = currentScreen || (activeTab as ScreenName) || 'camera_main';

  const sellerItems: NavItem[] = [
    { id: 'artist_switcher', labelKey: 'myArtists', defaultLabel: 'Artisans', icon: Users },
    { id: 'camera_main', labelKey: 'camera', defaultLabel: 'New Craft', icon: Camera, isPrimary: true },
    { id: 'my_listings', labelKey: 'listings', defaultLabel: 'Listings', icon: ListOrdered },
    { id: 'token_dashboard', labelKey: 'tokens', defaultLabel: 'Tokens', icon: Coins },
    { id: 'profile', labelKey: 'profile', defaultLabel: 'Profile', icon: User },
  ];

  const buyerItems: NavItem[] = [
    { id: 'buyer_home', labelKey: 'home', defaultLabel: 'Marketplace', icon: ShoppingBag },
    { id: 'profile', labelKey: 'profile', defaultLabel: 'Profile', icon: User },
  ];

  const items = activeRole === 'seller' ? sellerItems : buyerItems;

  return (
    <>
      {/* Desktop/Tablet Side Rail */}
      <aside className="hidden md:flex w-20 lg:w-60 bg-white border-r border-stone-200 flex-col justify-between py-6 px-3 shrink-0 min-h-[calc(100vh-61px)] select-none">
        <div className="space-y-6">
          <div className="hidden lg:block px-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
              {activeRole === 'seller' ? 'Artisan Studio' : 'Craft Buyer'}
            </span>
          </div>

          <nav className="space-y-1.5">
            {items.map((item) => {
              const Icon = item.icon;
              const label = t(item.labelKey, item.defaultLabel);
              const isActive = 
                currentActive === item.id || 
                (item.id === 'camera_main' && ['camera_capture', 'ai_processing', 'voice_qa', 'review_listing', 'publish_success', 'success', 'camera'].includes(currentActive)) ||
                (item.id === 'buyer_home' && ['marketplace', 'buyer_home'].includes(currentActive)) ||
                (item.id === 'my_listings' && ['listings', 'my_listings'].includes(currentActive)) ||
                (item.id === 'token_dashboard' && ['tokens', 'token_dashboard'].includes(currentActive)) ||
                (item.id === 'artist_switcher' && ['my-artists', 'artist_switcher'].includes(currentActive));

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNav(item.id)}
                  id={`side-nav-${item.id}`}
                  className={`w-full min-h-[44px] flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all text-sm cursor-pointer ${
                    isActive
                      ? 'bg-[#B4431E] text-white font-semibold shadow-xs'
                      : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="hidden lg:inline truncate">{label}</span>
                  {item.isPrimary && (
                    <span className="hidden lg:inline-block ml-auto text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-md font-bold">
                      Add
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar (Seller mode) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-stone-200 z-40 px-1 sm:px-2 py-1 flex justify-around items-center h-14 sm:h-15 shadow-md select-none">
        {items.map((item) => {
          const Icon = item.icon;
          const label = t(item.labelKey, item.defaultLabel);
          const isActive = 
            currentActive === item.id || 
            (item.id === 'camera_main' && ['camera_capture', 'ai_processing', 'voice_qa', 'review_listing', 'publish_success', 'success', 'camera'].includes(currentActive)) ||
            (item.id === 'buyer_home' && ['marketplace', 'buyer_home'].includes(currentActive)) ||
            (item.id === 'my_listings' && ['listings', 'my_listings'].includes(currentActive)) ||
            (item.id === 'token_dashboard' && ['tokens', 'token_dashboard'].includes(currentActive)) ||
            (item.id === 'artist_switcher' && ['my-artists', 'artist_switcher'].includes(currentActive));

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNav(item.id)}
              id={`mobile-nav-${item.id}`}
              className={`min-h-[44px] flex flex-col items-center justify-center flex-1 transition-all cursor-pointer ${
                isActive ? 'text-[#B4431E] font-bold' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5 shrink-0" />
              <span className="text-[9px] sm:text-[10px] truncate max-w-[54px] sm:max-w-[68px]">{label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
