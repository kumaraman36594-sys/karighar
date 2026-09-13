import React from 'react';
import { 
  Languages, 
  Volume2, 
  VolumeX, 
  Store, 
  ShoppingBag,
  Palette,
  Users
} from 'lucide-react';
import { Language, UserRole, Artist } from '../../types';
import { LANGUAGE_NAMES, stopSpeech } from '../../utils/speech';
import { TokenBadge } from './TokenBadge';
import { useLanguage } from '../../context/LanguageContext';

interface HeaderProps {
  currentRole?: UserRole;
  role?: UserRole;
  currentLanguage?: Language;
  language?: Language;
  activeArtist?: Artist;
  tokenBalance?: number;
  deviceMode?: 'auto' | 'phone' | 'tablet' | 'laptop';
  isAudioMuted: boolean;
  onLanguageChange?: (lang: Language) => void;
  onChangeLanguage?: (lang: Language) => void;
  onRoleChange?: (role: UserRole) => void;
  onSwitchRole?: (role: UserRole) => void;
  onDeviceModeChange?: (mode: 'auto' | 'phone' | 'laptop' | 'tablet') => void;
  onChangeDeviceMode?: (mode: 'auto' | 'phone' | 'laptop' | 'tablet') => void;
  onToggleAudioMute?: () => void;
  onToggleAudio?: () => void;
  onOpenArtistSwitcher?: () => void;
  onSwitchArtist?: () => void;
  onOpenTokens?: () => void;
}

export const Header: React.FC<HeaderProps> = (props) => {
  const { language: ctxLang, setLanguage } = useLanguage();
  const currentRole = props.currentRole || props.role || 'seller';
  const currentLanguage = props.currentLanguage || props.language || ctxLang || 'hi';
  const activeArtist = props.activeArtist;
  const tokenBalance = props.tokenBalance ?? 245;
  const isAudioMuted = props.isAudioMuted;

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    if (props.onLanguageChange) props.onLanguageChange(lang);
    if (props.onChangeLanguage) props.onChangeLanguage(lang);
  };

  const handleRoleChange = (role: UserRole) => {
    if (props.onRoleChange) props.onRoleChange(role);
    if (props.onSwitchRole) props.onSwitchRole(role);
  };

  const handleToggleAudio = () => {
    if (!isAudioMuted) stopSpeech();
    if (props.onToggleAudioMute) props.onToggleAudioMute();
    if (props.onToggleAudio) props.onToggleAudio();
  };

  const handleOpenArtistSwitcher = () => {
    if (props.onOpenArtistSwitcher) props.onOpenArtistSwitcher();
    if (props.onSwitchArtist) props.onSwitchArtist();
  };

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-40 px-2.5 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-2.5 shadow-xs">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#B4431E] flex items-center justify-center text-white shadow-xs shrink-0">
            <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-stone-900 text-sm sm:text-base md:text-lg leading-tight tracking-tight truncate">
                कारीगर
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold px-1.5 sm:px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200 tracking-wide hidden xs:inline-block">
                Artisan
              </span>
            </div>
            <p className="text-[11px] text-stone-500 font-medium truncate hidden md:block">
              "हुनर से बाज़ार तक" — From skill to marketplace
            </p>
          </div>
        </div>

        {/* Center: Active Artist (for Seller) */}
        {currentRole === 'seller' && activeArtist && (
          <button
            type="button"
            onClick={handleOpenArtistSwitcher}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 transition-colors text-left cursor-pointer min-h-[44px]"
            title="Switch or register artists"
          >
            <div className="w-7 h-7 rounded-full overflow-hidden border border-stone-300 shrink-0">
              <img 
                src={activeArtist.avatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100'} 
                alt={activeArtist.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-xs">
              <div className="font-semibold text-stone-900 flex items-center gap-1">
                <span>{activeArtist.name}</span>
                <span className="text-[10px] text-[#B4431E] bg-amber-50 border border-amber-200 px-1 rounded">Active</span>
              </div>
              <div className="text-stone-500 text-[11px] truncate max-w-[120px]">
                {activeArtist.craft} · {activeArtist.village}
              </div>
            </div>
          </button>
        )}

        {/* Controls: Audio, Language, Tokens, Role Switch */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Audio TTS toggle */}
          <button
            type="button"
            onClick={handleToggleAudio}
            id="audio-mute-toggle"
            className={`min-w-[38px] sm:min-w-[44px] min-h-[38px] sm:min-h-[44px] p-2 sm:p-2.5 rounded-lg border transition-colors flex items-center justify-center cursor-pointer ${
              isAudioMuted 
                ? 'bg-amber-50 border-amber-200 text-amber-800' 
                : 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100'
            }`}
            title={isAudioMuted ? 'Voice assistance muted' : 'Voice assistance active (TTS)'}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#B4431E]" />}
          </button>

          {/* Language Selector */}
          <div className="relative inline-block">
            <select
              value={currentLanguage}
              onChange={(e) => handleLanguageChange(e.target.value as Language)}
              id="language-selector"
              className="bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs font-semibold min-h-[38px] sm:min-h-[44px] py-1.5 sm:py-2 pl-2 sm:pl-3 pr-6 sm:pr-8 border border-stone-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#B4431E] transition-colors max-w-[66px] sm:max-w-none truncate"
            >
              <option value="hi">हिन्दी</option>
              <option value="en">English</option>
              <option value="ta">தமிழ்</option>
              <option value="te">తెలుగు</option>
              <option value="bn">বাংলা</option>
              <option value="mr">मराठी</option>
              <option value="gu">ગુજરાતી</option>
              <option value="kn">ಕನ್ನಡ</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 sm:px-2 text-stone-500">
              <Languages className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>

          {/* Token Badge */}
          <TokenBadge 
            tokens={tokenBalance} 
            onClick={props.onOpenTokens} 
            size="sm"
            className="sm:hidden"
          />
          <TokenBadge 
            tokens={tokenBalance} 
            onClick={props.onOpenTokens} 
            size="md"
            className="hidden sm:inline-flex"
          />

          {/* Quick Role Toggle (Seller ⇄ Buyer) */}
          <button
            type="button"
            onClick={() => handleRoleChange(currentRole === 'seller' ? 'buyer' : 'seller')}
            id="role-toggle-btn"
            className="min-h-[38px] sm:min-h-[44px] flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer bg-[#B4431E] hover:bg-[#9E3514] text-white shrink-0"
          >
            {currentRole === 'seller' ? (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden md:inline">Buyer Store</span>
              </>
            ) : (
              <>
                <Store className="w-4 h-4" />
                <span className="hidden md:inline">Seller Mode</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
