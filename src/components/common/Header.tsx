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
  ShoppingBag,
  Layers
} from 'lucide-react';
import { Language, UserRole, Artist } from '../../types';
import { LANGUAGE_NAMES, stopSpeech } from '../../utils/speech';
import { TokenBadge } from './TokenBadge';
import { KarigharWordmark } from './KarigharWordmark';

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
    <header className="bg-white/95 backdrop-blur-md border-b border-stone-200 sticky top-0 z-40 px-3 sm:px-6 py-2.5 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2.5 min-w-0">
          <KarigharWordmark size="sm" align="left" />
          <span className="hidden sm:inline-block text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200 text-stone-700 tracking-wider">
            Heritage Crafts
          </span>
        </div>

        {/* Center: Active Artist (for Seller) or Quick Switch */}
        {currentRole === 'seller' && activeArtist && (
          <button
            onClick={onOpenArtistSwitcher}
            id="header-artist-switch-btn"
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 transition-colors text-left"
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
                <span className="text-[10px] text-stone-600 bg-white border border-stone-200 px-1 rounded">Active</span>
              </div>
              <div className="text-stone-500 text-[11px] truncate max-w-[120px]">
                {activeArtist.craft} · {activeArtist.village}
              </div>
            </div>
          </button>
        )}

        {/* Controls: Device preview switch, Audio, Language, Role */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Device viewport simulator pills */}
          <div className="hidden lg:flex items-center p-0.5 rounded-lg bg-stone-100 border border-stone-200 text-stone-600 text-xs">
            <button
              type="button"
              onClick={() => {
                console.log('Button clicked:', 'device-mode-phone');
                onDeviceModeChange('phone');
              }}
              className={`p-1.5 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                deviceMode === 'phone' ? 'bg-white shadow-xs text-stone-900 font-bold' : 'hover:text-stone-900'
              }`}
              title="Phone layout (<600px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="text-[11px]">Phone</span>
            </button>
            <button
              type="button"
              onClick={() => {
                console.log('Button clicked:', 'device-mode-tablet');
                onDeviceModeChange('tablet');
              }}
              className={`p-1.5 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                deviceMode === 'tablet' ? 'bg-white shadow-xs text-stone-900 font-bold' : 'hover:text-stone-900'
              }`}
              title="Tablet layout (600-900px)"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="text-[11px]">Tablet</span>
            </button>
            <button
              type="button"
              onClick={() => {
                console.log('Button clicked:', 'device-mode-laptop');
                onDeviceModeChange('laptop');
              }}
              className={`p-1.5 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                deviceMode === 'laptop' ? 'bg-white shadow-xs text-stone-900 font-bold' : 'hover:text-stone-900'
              }`}
              title="Laptop layout (>900px)"
            >
              <Laptop className="w-3.5 h-3.5" />
              <span className="text-[11px]">Laptop</span>
            </button>
            <button
              type="button"
              onClick={() => {
                console.log('Button clicked:', 'device-mode-auto');
                onDeviceModeChange('auto');
              }}
              className={`p-1.5 rounded-md transition-all text-[11px] cursor-pointer ${
                deviceMode === 'auto' ? 'bg-white shadow-xs text-stone-900 font-bold' : 'hover:text-stone-900'
              }`}
              title="Fluid responsive to browser width"
            >
              Auto
            </button>
          </div>

          {/* Audio TTS toggle */}
          <button
            type="button"
            onClick={() => {
              console.log('Button clicked:', 'audio-mute-toggle');
              if (!isAudioMuted) stopSpeech();
              onToggleAudioMute();
            }}
            id="audio-mute-toggle"
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              isAudioMuted 
                ? 'bg-stone-100 border-stone-200 text-stone-500 hover:bg-stone-200' 
                : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
            }`}
            title={isAudioMuted ? 'Voice assistance muted' : 'Voice assistance active (TTS)'}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Language Selector */}
          <div className="relative inline-block">
            <select
              value={currentLanguage}
              onChange={(e) => {
                console.log('Language changed to:', e.target.value);
                onLanguageChange(e.target.value as Language);
              }}
              id="language-selector"
              className="bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs font-semibold py-1.5 pl-2.5 pr-7 border border-stone-200 rounded-lg appearance-none cursor-pointer focus:outline-hidden focus:border-stone-400 transition-colors"
            >
              <option value="hi">🇮🇳 हिन्दी (Hindi)</option>
              <option value="en">🇮🇳 English</option>
              <option value="ta">🇮🇳 தமிழ் (Tamil)</option>
              <option value="te">🇮🇳 తెలుగు (Telugu)</option>
              <option value="bn">🇮🇳 বাংলা (Bengali)</option>
              <option value="mr">🇮🇳 मराठी (Marathi)</option>
              <option value="gu">🇮🇳 ગુજરાતી (Gujarati)</option>
              <option value="kn">🇮🇳 ಕನ್ನಡ (Kannada)</option>
              <option value="mai">🇮🇳 मैथिली (Maithili)</option>
              <option value="bho">🇮🇳 भोजपुरी (Bhojpuri)</option>
              <option value="or">🇮🇳 ଓଡ଼ିଆ (Odia)</option>
              <option value="pa">🇮🇳 ਪੰਜਾਬੀ (Punjabi)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-stone-500">
              <Languages className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Token Badge */}
          <TokenBadge 
            tokens={tokenBalance} 
            onClick={() => {
              console.log('Button clicked:', 'header-tokens-badge');
              if (onOpenTokens) onOpenTokens();
            }} 
            size="md"
          />

          {/* Quick Role Toggle (Seller ⇄ Buyer) */}
          <button
            type="button"
            onClick={() => {
              console.log('Button clicked:', 'header-role-toggle');
              onRoleChange(currentRole === 'seller' ? 'buyer' : 'seller');
            }}
            id="role-toggle-btn"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all shadow-xs cursor-pointer ${
              currentRole === 'seller'
                ? 'bg-stone-900 hover:bg-black text-white border-stone-900'
                : 'bg-emerald-700 hover:bg-emerald-800 text-white border-emerald-700'
            }`}
          >
            {currentRole === 'seller' ? (
              <>
                <Store className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Seller Mode</span>
                <span className="sm:hidden">Seller</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-white" />
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
