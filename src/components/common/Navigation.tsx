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
  icon: any;
  emoji: string;
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
  language = 'hi',
  currentLanguage,
  onNavigate,
  onTabChange,
  tokenCount,
  isTabletOrDesktop = false,
}) => {
  const activeRole = currentRole || role;
  const activeLang = currentLanguage || language;
  const t = TRANSLATIONS[activeLang];

  const handleNav = (screenId: ScreenName) => {
    if (onNavigate) onNavigate(screenId);
    if (onTabChange) onTabChange(screenId);
  };

  const currentActive = currentScreen || (activeTab as ScreenName) || 'camera_main';

  const sellerItems: NavItem[] = [
    { id: 'artist_switcher', label: t.myArtists, icon: Users, emoji: '👥' },
    { id: 'camera_main', label: t.camera, icon: Camera, emoji: '📷', isPrimary: true },
    { id: 'my_listings', label: t.listings, icon: ListOrdered, emoji: '📋' },
    { id: 'token_dashboard', label: t.tokens, icon: Coins, emoji: '💰' },
    { id: 'profile', label: t.profile, icon: User, emoji: '👤' },
  ];

  const buyerItems: NavItem[] = [
    { id: 'buyer_home', label: 'Marketplace', icon: ShoppingBag, emoji: '🛍️' },
    { id: 'profile', label: t.profile, icon: User, emoji: '👤' },
  ];

  const items = activeRole === 'seller' ? sellerItems : buyerItems;

  // Render Side Navigation Rail for Tablet / Laptop
  return (
    <>
      {/* Desktop/Tablet Side Rail */}
      <aside className="hidden md:flex w-20 lg:w-64 bg-white border-r border-gray-200 flex-col justify-between py-6 px-3 shrink-0 min-h-[calc(100vh-61px)]">
        <div className="space-y-6">
          {/* Section title */}
          <div className="hidden lg:block px-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              {activeRole === 'seller' ? 'Artisan Workspace' : 'Craft Buyer'}
            </span>
          </div>

          <nav className="space-y-1.5">
            {items.map((item) => {
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
                  onClick={() => handleNav(item.id)}
                  id={`side-nav-${item.id}`}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl font-medium transition-all text-sm cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-100 font-semibold'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <span className="text-xl shrink-0 flex items-center justify-center w-6">{item.emoji}</span>
                  <span className="hidden lg:inline truncate">{item.label}</span>
                  {item.isPrimary && (
                    <span className="hidden lg:inline-block ml-auto text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-bold">
                      Main
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Banner in Rail */}
        <div className="hidden lg:block p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100">
          <div className="flex items-center gap-2 text-indigo-700 font-semibold text-xs mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Voice First · Zero Friction</span>
          </div>
          <p className="text-[11px] text-gray-600 leading-relaxed">
            "The platform does the hard work, not the artisan."
          </p>
        </div>
      </aside>

      {/* Mobile Phone (<768px) Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-2 py-1.5 shadow-lg safe-area-bottom">
        <div className="max-w-md mx-auto flex items-center justify-around">
          {items.map((item) => {
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
                onClick={() => handleNav(item.id)}
                id={`bottom-nav-${item.id}`}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative min-h-[48px] min-w-[54px] cursor-pointer ${
                  isActive 
                    ? 'text-indigo-600 font-bold scale-105' 
                    : 'text-gray-500 hover:text-gray-900 font-medium'
                }`}
              >
                {item.isPrimary ? (
                  <div className={`-mt-5 w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-lg border-2 border-white ${
                    isActive ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white' : 'bg-indigo-500 text-white'
                  }`}>
                    {item.emoji}
                  </div>
                ) : (
                  <span className="text-xl mb-0.5">{item.emoji}</span>
                )}
                <span className={`text-[11px] leading-none truncate max-w-[65px] ${isActive ? 'font-bold' : ''}`}>
                  {item.label}
                </span>
                {isActive && !item.isPrimary && (
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
