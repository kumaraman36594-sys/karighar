import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Globe, 
  ShoppingCart, 
  User, 
  Mic, 
  MicOff,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Palette
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Language, BuyerTab } from '../../types';
import { LANGUAGE_NAMES, VoiceRecognizer } from '../../utils/speech';

interface BuyerHeaderProps {
  cartCount: number;
  activeTab: BuyerTab;
  onNavigateTab: (tab: BuyerTab) => void;
  onOpenSearch: () => void;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  onSearchSubmit?: (query: string) => void;
  onSwitchToSeller?: () => void;
}

const LOCATIONS = [
  { pin: '110001', city: 'Connaught Place, New Delhi' },
  { pin: '400001', city: 'Fort, Mumbai' },
  { pin: '560001', city: 'MG Road, Bengaluru' },
  { pin: '600001', city: 'George Town, Chennai' },
  { pin: '700001', city: 'Dalhousie Square, Kolkata' },
  { pin: '302001', city: 'MI Road, Jaipur' },
  { pin: '500001', city: 'Afzal Gunj, Hyderabad' },
];

export const BuyerHeader: React.FC<BuyerHeaderProps> = ({
  cartCount = 0,
  activeTab,
  onNavigateTab,
  onOpenSearch,
  searchQuery = '',
  onSearchChange,
  onSearchSubmit,
  onSwitchToSeller,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [selectedLoc, setSelectedLoc] = useState(LOCATIONS[0]);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const startVoiceSearch = () => {
    const recognizer = new VoiceRecognizer();
    setIsListening(true);
    recognizer.start(
      (text, isFinal) => {
        if (onSearchChange) onSearchChange(text);
        if (isFinal) {
          setIsListening(false);
          if (onSearchSubmit) onSearchSubmit(text);
          onOpenSearch();
        }
      },
      language,
      () => setIsListening(false),
      () => setIsListening(false)
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearchSubmit) {
      onSearchSubmit(searchQuery);
      onOpenSearch();
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FFFFFF] border-b border-[#DDDDDD] shadow-xs">
      {/* Top Brand & Utility Bar */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-4 md:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-1.5 sm:gap-3">
        {/* Logo & Location */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <button 
            onClick={() => onNavigateTab('home')}
            className="flex items-center gap-1.5 sm:gap-2 group text-left cursor-pointer min-w-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#B4431E] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-[#111111] text-base sm:text-lg md:text-xl tracking-tight leading-none truncate">
                  कारीगर
                </span>
                <span className="text-[9px] sm:text-[10px] bg-[#FF9900]/15 text-[#b36b00] font-bold px-1.5 py-0.2 rounded-sm uppercase shrink-0">
                  Bazaar
                </span>
              </div>
              <span className="text-[10px] text-[#565959] font-medium hidden sm:block truncate">
                हुनर से बाज़ार तक
              </span>
            </div>
          </button>

          {/* Location Picker */}
          <div className="relative hidden md:block">
            <button
              type="button"
              onClick={() => setIsLocationOpen(!isLocationOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:border-[#FF9900] border border-transparent transition-all text-xs text-[#111111] text-left cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-[#FF9900] shrink-0" />
              <div>
                <div className="text-[10px] text-[#565959] font-medium leading-none">
                  {t('deliverTo')}
                </div>
                <div className="font-bold text-xs leading-tight truncate max-w-[130px]">
                  {selectedLoc.city.split(',')[0]} {selectedLoc.pin}
                </div>
              </div>
              <ChevronDown className="w-3 h-3 text-[#565959]" />
            </button>

            {isLocationOpen && (
              <div className="absolute top-11 left-0 w-64 bg-white border border-[#DDDDDD] rounded-lg shadow-xl p-2 z-50 animate-fade-in">
                <div className="text-xs font-bold text-[#111111] px-2 py-1 border-b border-[#DDDDDD] mb-1">
                  Choose delivery pin code
                </div>
                <div className="max-h-56 overflow-y-auto space-y-1">
                  {LOCATIONS.map((loc) => (
                    <button
                      key={loc.pin}
                      onClick={() => {
                        setSelectedLoc(loc);
                        setIsLocationOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between ${
                        selectedLoc.pin === loc.pin
                          ? 'bg-amber-50 text-[#FF9900] font-bold'
                          : 'hover:bg-[#F5F5F5] text-[#111111]'
                      }`}
                    >
                      <span className="truncate">{loc.city}</span>
                      <span className="text-[10px] font-mono text-[#565959]">{loc.pin}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Actions: Language, Seller Mode Switch, Cart, Profile */}
        <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
          {/* Language Switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-1.5 rounded-md hover:bg-[#F5F5F5] border border-transparent hover:border-[#DDDDDD] text-xs font-semibold text-[#111111] cursor-pointer"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#565959]" />
              <span className="uppercase text-[11px] sm:text-xs font-bold">{language}</span>
              <ChevronDown className="w-3 h-3 text-[#565959]" />
            </button>

            {isLangMenuOpen && (
              <div className="absolute right-0 top-10 w-44 bg-white border border-[#DDDDDD] rounded-lg shadow-xl p-1.5 z-50 animate-fade-in">
                <div className="text-[11px] font-bold text-[#565959] px-2 py-1 uppercase tracking-wider">
                  Select Language
                </div>
                {(['hi', 'en', 'ta', 'te', 'bn', 'mr', 'gu', 'kn'] as Language[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setLanguage(l);
                      setIsLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center justify-between ${
                      language === l
                        ? 'bg-[#FF9900]/15 text-[#111111] font-bold'
                        : 'hover:bg-[#F5F5F5] text-[#111111]'
                    }`}
                  >
                    <span>{LANGUAGE_NAMES[l]}</span>
                    {language === l && <span className="text-[#FF9900]">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Switch to Seller button */}
          {onSwitchToSeller && (
            <button
              type="button"
              onClick={onSwitchToSeller}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-all border border-stone-300 cursor-pointer"
            >
              <Palette className="w-3.5 h-3.5 text-[#B4431E]" />
              <span>{t('sellerRole')}</span>
            </button>
          )}

          {/* Cart Icon with Live Badge */}
          <button
            type="button"
            onClick={() => onNavigateTab('cart')}
            className={`relative flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-md hover:bg-[#F5F5F5] transition-all cursor-pointer ${
              activeTab === 'cart' ? 'bg-[#F5F5F5] font-bold' : ''
            }`}
            title="Cart"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 text-[#111111]" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2.5 bg-[#FF9900] text-white font-extrabold text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 shadow-xs border-2 border-white">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline text-xs font-bold text-[#111111]">
              {t('cart')}
            </span>
          </button>

          {/* Profile Icon */}
          <button
            type="button"
            onClick={() => onNavigateTab('profile')}
            className={`p-1.5 rounded-md hover:bg-[#F5F5F5] transition-all cursor-pointer ${
              activeTab === 'profile' ? 'bg-[#F5F5F5] text-[#FF9900]' : 'text-[#111111]'
            }`}
            title="Profile"
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Prominent Search Bar (Amazon Style) */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-4 md:px-6 pb-2 sm:pb-2.5">
        <div className="relative flex items-center">
          {/* Left search icon / button */}
          <div className="absolute left-3 text-[#565959] pointer-events-none">
            <Search className="w-4 h-4" />
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              if (onSearchChange) onSearchChange(e.target.value);
            }}
            onFocus={() => {
              // Open search view on tap/focus
              onOpenSearch();
            }}
            onKeyDown={handleKeyDown}
            placeholder={t('searchPlaceholder')}
            className="w-full h-10 sm:h-11 pl-9 sm:pl-10 pr-20 sm:pr-24 rounded-lg bg-[#FFFFFF] border-2 border-[#DDDDDD] focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900] focus:outline-none text-xs sm:text-sm text-[#111111] placeholder:text-[#565959] transition-all"
          />

          {/* Right Action Icons: Mic & Submit */}
          <div className="absolute right-1 flex items-center gap-1">
            <button
              type="button"
              onClick={startVoiceSearch}
              className={`p-1.5 sm:p-2 rounded-md transition-colors cursor-pointer ${
                isListening 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'text-[#565959] hover:text-[#111111] hover:bg-[#F5F5F5]'
              }`}
              title={isListening ? t('listening') : t('tapToSpeak')}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => {
                if (onSearchSubmit) onSearchSubmit(searchQuery);
                onOpenSearch();
              }}
              className="h-8 px-2.5 sm:px-3 rounded-md bg-[#FF9900] hover:bg-[#e68a00] text-[#111111] font-bold text-xs transition-colors flex items-center justify-center cursor-pointer shadow-xs"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
