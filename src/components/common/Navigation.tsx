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
import { TRANSLATIONS } from '../../utils/translations';

interface NavItem {
  id: ScreenName;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
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
  isGuest?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentScreen,
  activeTab,
  role = 'seller',
  currentRole,
  language = 'hi',
  currentLanguage,
  onNavigate,
  onTabChange,
  tokenCount,
  isTabletOrDesktop = false,
  isGuest = false,
}) => {
  const activeRole = currentRole || role;
  const activeLang = currentLanguage || language;
  const t = TRANSLATIONS[activeLang];

  const handleNav = (screenId: ScreenName, label: string) => {
    console.log('Button clicked:', `tab-${screenId}`);
    console.log(`Tab clicked: [${label}]`);
    if (onNavigate) onNavigate(screenId);
    if (onTabChange) onTabChange(screenId);
  };

  const currentActive = currentScreen || (activeTab as ScreenName) || 'camera_main';

  const guestSellerItems: NavItem[] = [
    { id: 'camera_main', label: 'Home', icon: Camera, isPrimary: true },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const sellerItems: NavItem[] = [
    { id: 'camera_main', label: 'Home', icon: Camera, isPrimary: true },
    { id: 'my_listings', label: 'Products', icon: ListOrdered },
    { id: 'tokens', label: 'Tokens', icon: Coins },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const buyerItems: NavItem[] = [
    { id: 'buyer_home', label: 'बाज़ार', icon: ShoppingBag },
    { id: 'profile', label: t?.profile || 'प्रोफ़ाइल', icon: User },
  ];

  const items = activeRole === 'seller' ? (isGuest ? guestSellerItems : sellerItems) : buyerItems;

  // Render Side Navigation Rail for Tablet / Laptop
  return (
    <>
      {/* Desktop/Tablet Side Rail */}
      <aside className="hidden md:flex w-20 lg:w-60 bg-white border-r border-stone-200 flex-col justify-between py-5 px-3 shrink-0 min-h-[calc(100vh-57px)]">
        <div className="space-y-5">
          {/* Section title */}
          <div className="hidden lg:block px-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
              {activeRole === 'seller' ? 'Artisan Workspace' : 'Craft Buyer'}
            </span>
          </div>

          <nav className="space-y-1.5">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = 
                currentActive === item.id || 
                (item.id === 'camera_main' && ['camera_capture', 'ai_processing', 'voice_qa', 'review_listing', 'publish_success', 'success', 'camera'].includes(currentActive)) ||
                (item.id === 'buyer_home' && ['marketplace', 'buyer_home'].includes(currentActive)) ||
                (item.id === 'my_listings' && ['listings', 'my_listings'].includes(currentActive)) ||
                (item.id === 'token_dashboard' && ['tokens', 'token_dashboard'].includes(currentActive)) ||
                (item.id === 'artist_switcher' && ['my-artists', 'artist_switcher'].includes(currentActive));

              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => handleNav(item.id, item.label)}
                  id={`side-nav-${item.id}`}
                  className={`w-full min-h-[48px] flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors text-sm cursor-pointer ${
                    isActive
                      ? 'bg-stone-900 text-white font-semibold shadow-xs'
                      : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-amber-400' : 'text-stone-500'}`} />
                  <span className="hidden lg:inline truncate">{item.label}</span>
                  {item.isPrimary && (
                    <span className="hidden lg:inline-block ml-auto text-[10px] bg-stone-800 text-stone-300 px-1.5 py-0.5 rounded font-medium">
                      Camera
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Notice in Rail */}
        <div className="hidden lg:block p-3 rounded-lg bg-stone-50 border border-stone-200">
          <div className="flex items-center gap-1.5 text-stone-800 font-semibold text-xs mb-0.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Voice First Interface</span>
          </div>
          <p className="text-[11px] text-stone-500 leading-relaxed">
            All forms support spoken input and regional audio feedback.
          </p>
        </div>
      </aside>

      {/* Mobile Phone (<768px) Bottom Navigation Bar (56px min height) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-2 py-1 shadow-xs safe-area-bottom">
        <div className="max-w-md mx-auto flex items-center justify-around h-[58px]">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = 
              currentActive === item.id || 
              (item.id === 'camera_main' && ['camera_capture', 'ai_processing', 'voice_qa', 'review_listing', 'publish_success', 'success', 'camera'].includes(currentActive)) ||
              (item.id === 'buyer_home' && ['marketplace', 'buyer_home'].includes(currentActive)) ||
              (item.id === 'my_listings' && ['listings', 'my_listings'].includes(currentActive)) ||
              (item.id === 'token_dashboard' && ['tokens', 'token_dashboard'].includes(currentActive)) ||
              (item.id === 'artist_switcher' && ['my-artists', 'artist_switcher'].includes(currentActive));

            return (
              <button
                type="button"
                key={item.id}
                onClick={() => handleNav(item.id, item.label)}
                id={`bottom-nav-${item.id}`}
                className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-lg transition-colors relative h-[54px] min-w-[56px] cursor-pointer ${
                  isActive 
                    ? 'text-stone-900 font-bold' 
                    : 'text-stone-500 hover:text-stone-900 font-medium'
                }`}
              >
                {item.isPrimary ? (
                  <div className={`-mt-5 w-12 h-12 rounded-full flex items-center justify-center shadow-md border-2 border-white ${
                    isActive ? 'bg-stone-900 text-amber-400' : 'bg-[#FF6B35] text-white'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                ) : (
                  <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-stone-900' : 'text-stone-400'}`} />
                )}
                <span className={`text-[11px] leading-tight truncate max-w-[62px] text-center ${isActive ? 'font-bold' : ''}`}>
                  {item.label}
                </span>
                {isActive && !item.isPrimary && (
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-900 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
