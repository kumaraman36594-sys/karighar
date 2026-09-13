import React from 'react';
import { 
  Languages, 
  Volume2, 
  VolumeX, 
  Smartphone, 
  Tablet, 
  Laptop, 
  Sparkles,
  Users,
  Store,
  ShoppingBag
} from 'lucide-react';
import { Language, UserRole, Artist } from '../../types';
import { LANGUAGE_NAMES, stopSpeech } from '../../utils/speech';
import { TokenBadge } from './TokenBadge';

interface HeaderProps {
  currentRole?: UserRole;
  role?: UserRole;
  currentLanguage?: Language;
  language?: Language;
  activeArtist?: Artist;
  tokenBalance?: number;
  deviceMode: 'auto' | 'phone' | 'tablet' | 'laptop';
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
  const currentRole = props.currentRole || props.role || 'seller';
  const currentLanguage = props.currentLanguage || props.language || 'hi';
  const activeArtist = props.activeArtist;
  const tokenBalance = props.tokenBalance ?? 245;
  const deviceMode = props.deviceMode;
  const isAudioMuted = props.isAudioMuted;

  const onLanguageChange = (lang: Language) => {
    if (props.onLanguageChange) props.onLanguageChange(lang);
    if (props.onChangeLanguage) props.onChangeLanguage(lang);
  };

  const onRoleChange = (role: UserRole) => {
    if (props.onRoleChange) props.onRoleChange(role);
    if (props.onSwitchRole) props.onSwitchRole(role);
  };

  const onDeviceModeChange = (mode: 'auto' | 'phone' | 'laptop' | 'tablet') => {
    if (props.onDeviceModeChange) props.onDeviceModeChange(mode);
    if (props.onChangeDeviceMode) props.onChangeDeviceMode(mode);
  };

  const onToggleAudioMute = () => {
    if (!isAudioMuted) stopSpeech();
    if (props.onToggleAudioMute) props.onToggleAudioMute();
    if (props.onToggleAudio) props.onToggleAudio();
  };

  const onOpenArtistSwitcher = () => {
    if (props.onOpenArtistSwitcher) props.onOpenArtistSwitcher();
    if (props.onSwitchArtist) props.onSwitchArtist();
  };

  const onOpenTokens = props.onOpenTokens;
  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-indigo-100 sticky top-0 z-40 px-3 sm:px-6 py-2.5 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand & SIH Badge */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md text-xl shrink-0">
            🎨
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-extrabold text-gray-900 text-base sm:text-lg leading-tight tracking-tight truncate">
                कारीगर <span className="text-xs font-bold text-indigo-600">(Karighar)</span>
              </span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 tracking-wider">
                SIH 2026 · #26090
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium truncate hidden xs:block">
              "हुनर से बाज़ार तक" — From skill to market
            </p>
          </div>
        </div>

        {/* Center: Active Artist (for Seller) or Quick Switch */}
        {currentRole === 'seller' && activeArtist && (
          <button
            onClick={onOpenArtistSwitcher}
            id="header-artist-switch-btn"
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors text-left"
            title="Switch or register artists"
          >
            <div className="w-7 h-7 rounded-full overflow-hidden border border-indigo-300 shrink-0">
              <img 
                src={activeArtist.avatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100'} 
                alt={activeArtist.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-xs">
              <div className="font-semibold text-indigo-950 flex items-center gap-1">
                <span>{activeArtist.name}</span>
                <span className="text-[10px] text-indigo-600 bg-white px-1 rounded">Active</span>
              </div>
              <div className="text-indigo-600/80 text-[11px] truncate max-w-[120px]">
                {activeArtist.craft} · {activeArtist.village}
              </div>
            </div>
          </button>
        )}

        {/* Controls: Device preview switch, Audio, Language, Role */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Device viewport simulator pills */}
          <div className="hidden lg:flex items-center p-0.5 rounded-lg bg-gray-100 border border-gray-200 text-gray-600 text-xs">
            <button
              onClick={() => onDeviceModeChange('phone')}
              className={`p-1.5 rounded-md transition-all flex items-center gap-1 ${
                deviceMode === 'phone' ? 'bg-white shadow-xs text-indigo-600 font-medium' : 'hover:text-gray-900'
              }`}
              title="Phone layout (<600px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="text-[11px]">Phone</span>
            </button>
            <button
              onClick={() => onDeviceModeChange('tablet')}
              className={`p-1.5 rounded-md transition-all flex items-center gap-1 ${
                deviceMode === 'tablet' ? 'bg-white shadow-xs text-indigo-600 font-medium' : 'hover:text-gray-900'
              }`}
              title="Tablet layout (600-900px)"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="text-[11px]">Tablet</span>
            </button>
            <button
              onClick={() => onDeviceModeChange('laptop')}
              className={`p-1.5 rounded-md transition-all flex items-center gap-1 ${
                deviceMode === 'laptop' ? 'bg-white shadow-xs text-indigo-600 font-medium' : 'hover:text-gray-900'
              }`}
              title="Laptop layout (>900px)"
            >
              <Laptop className="w-3.5 h-3.5" />
              <span className="text-[11px]">Laptop</span>
            </button>
            <button
              onClick={() => onDeviceModeChange('auto')}
              className={`p-1.5 rounded-md transition-all text-[11px] ${
                deviceMode === 'auto' ? 'bg-white shadow-xs text-indigo-600 font-medium' : 'hover:text-gray-900'
              }`}
              title="Fluid responsive to browser width"
            >
              Auto
            </button>
          </div>

          {/* Audio TTS toggle */}
          <button
            onClick={() => {
              if (!isAudioMuted) stopSpeech();
              onToggleAudioMute();
            }}
            id="audio-mute-toggle"
            className={`p-2 rounded-xl border transition-colors ${
              isAudioMuted 
                ? 'bg-amber-50 border-amber-200 text-amber-700' 
                : 'bg-indigo-50 border-indigo-200 text-indigo-700'
            }`}
            title={isAudioMuted ? 'Voice assistance muted' : 'Voice assistance active (TTS)'}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse" />}
          </button>

          {/* Language Selector */}
          <div className="relative inline-block">
            <select
              value={currentLanguage}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              id="language-selector"
              className="bg-gray-50 hover:bg-gray-100 text-gray-800 text-xs font-semibold py-1.5 pl-2.5 pr-7 border border-gray-200 rounded-xl appearance-none cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="en">English</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="bn">বাংলা (Bengali)</option>
              <option value="mr">मराठी (Marathi)</option>
              <option value="gu">ગુજરાતી (Gujarati)</option>
              <option value="kn">ಕನ್ನಡ (Kannada)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <Languages className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Token Badge (Tap to open Token Dashboard) */}
          <TokenBadge 
            tokens={tokenBalance} 
            onClick={onOpenTokens} 
            size="md"
          />

          {/* Quick Role Toggle (Seller ⇄ Buyer) */}
          <button
            onClick={() => onRoleChange(currentRole === 'seller' ? 'buyer' : 'seller')}
            id="role-toggle-btn"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all shadow-xs ${
              currentRole === 'seller'
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-700'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700'
            }`}
          >
            {currentRole === 'seller' ? (
              <>
                <Store className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Seller Mode</span>
                <span className="sm:hidden">Seller</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Buyer Mode</span>
                <span className="sm:hidden">Buyer</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
