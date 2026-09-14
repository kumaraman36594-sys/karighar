import React, { useState } from 'react';
import { 
  User, 
  Globe, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  LogOut, 
  HelpCircle, 
  ChevronRight, 
  Info,
  Gift,
  Coins,
  Bell,
  Users,
  Package,
  Store,
  ShoppingBag,
  TrendingUp,
  Award,
  Settings,
  Phone,
  Calendar
} from 'lucide-react';
import { UserRole, Language, Artist } from '../../types';
import { TRANSLATIONS } from '../../utils/translations';
import { TokenService } from '../../utils/tokenService';
import { TierBadge } from '../common/TierBadge';
import { speak } from '../../utils/speech';

interface ProfileScreenProps {
  role: UserRole;
  language: Language;
  activeArtist?: Artist;
  mobileNumber?: string;
  totalArtists?: number;
  totalProducts?: number;
  tokenBalance?: number;
  referralCount?: number;
  isAudioMuted: boolean;
  onSwitchRole: (newRole: UserRole) => void;
  onChangeLanguage: (lang: Language) => void;
  onToggleAudio: () => void;
  onResetDemoData: () => void;
  onLogout: () => void;
  onNavigateToReferrals?: () => void;
  onNavigateToTokens?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  role,
  language,
  activeArtist,
  mobileNumber = '+91 98765 43210',
  totalArtists = 3,
  totalProducts = 12,
  tokenBalance = 245,
  referralCount = 7,
  isAudioMuted,
  onSwitchRole,
  onChangeLanguage,
  onToggleAudio,
  onResetDemoData,
  onLogout,
  onNavigateToReferrals,
  onNavigateToTokens,
}) => {
  const t = TRANSLATIONS[language];
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [infoModal, setInfoModal] = useState<string | null>(null);

  const currentTier = TokenService.calculateTier(referralCount);
  const tierInfo = TokenService.getTierInfo(currentTier);

  return (
    <div className="max-w-xl mx-auto space-y-4 pb-24 p-3 sm:p-5">
      {/* Profile Header Card */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center text-xl shadow-xs">
              {role === 'seller' ? <Store className="w-6 h-6" /> : <ShoppingBag className="w-6 h-6" />}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900">
                {role === 'seller' ? (activeArtist?.name || 'कारीगर साथी') : 'शिल्प प्रेमी'}
              </h2>
              <div className="flex items-center gap-2 text-xs text-stone-500 font-medium mt-0.5">
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-stone-400" />
                  {mobileNumber}
                </span>
                <span>•</span>
                <span className="capitalize">{role === 'seller' ? 'Seller' : 'Buyer'}</span>
              </div>
              <p className="text-[11px] text-stone-400 mt-0.5 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                सदस्य: जनवरी 2026
              </p>
            </div>
          </div>

          <button
            onClick={() => onSwitchRole(role === 'seller' ? 'buyer' : 'seller')}
            id="profile-switch-mode-btn"
            className="px-3 py-1.5 rounded-md border border-stone-300 hover:bg-stone-50 text-xs font-semibold text-stone-700 transition-colors cursor-pointer"
          >
            {role === 'seller' ? 'Buyer मोड' : 'Seller मोड'}
          </button>
        </div>
      </div>

      {/* Your Progress */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-stone-700" />
            <span>आपकी प्रगति (Your Progress)</span>
          </h3>
          <span className="text-[11px] text-stone-500 font-medium">लाइव आँकड़े</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {/* Artisans */}
          <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
            <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-semibold">
              <Users className="w-3.5 h-3.5 text-stone-600" />
              <span>कारीगर</span>
            </div>
            <span className="text-lg font-bold text-stone-900 mt-1 block">{totalArtists}</span>
          </div>

          {/* Products */}
          <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
            <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-semibold">
              <Package className="w-3.5 h-3.5 text-stone-600" />
              <span>उत्पाद</span>
            </div>
            <span className="text-lg font-bold text-stone-900 mt-1 block">{totalProducts}</span>
          </div>

          {/* Tokens */}
          <div 
            onClick={onNavigateToTokens}
            className="p-3 rounded-lg bg-amber-50/50 border border-amber-200 cursor-pointer hover:bg-amber-100/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-[11px] text-amber-900 font-bold">
                <Coins className="w-3.5 h-3.5 text-amber-600" />
                <span>टोकन</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-amber-700" />
            </div>
            <span className="text-lg font-bold text-amber-800 mt-1 block">{tokenBalance}</span>
          </div>

          {/* Tier */}
          <div 
            onClick={onNavigateToReferrals}
            className="p-3 rounded-lg bg-stone-50 border border-stone-200 cursor-pointer hover:bg-stone-100 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-[11px] text-stone-600 font-bold">
                <Award className="w-3.5 h-3.5 text-stone-500" />
                <span>टियर</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            </div>
            <span className="text-xs font-bold text-stone-900 mt-1 block truncate">
              {tierInfo.name}
            </span>
          </div>

          {/* Referrals */}
          <div 
            onClick={onNavigateToReferrals}
            className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-200 cursor-pointer hover:bg-emerald-100/50 transition-colors col-span-2 sm:col-span-1"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-[11px] text-emerald-900 font-bold">
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                <span>रेफरल</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-emerald-700" />
            </div>
            <span className="text-lg font-bold text-emerald-800 mt-1 block">{referralCount} मित्र</span>
          </div>
        </div>
      </div>

      {/* Settings & Options */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-1 divide-y divide-stone-100">
        <h3 className="font-bold text-sm text-stone-900 pb-2 flex items-center gap-2">
          <Settings className="w-4 h-4 text-stone-700" />
          <span>सेटिंग्स (Settings)</span>
        </h3>

        {/* Referral System */}
        <button
          onClick={onNavigateToReferrals}
          id="profile-referral-btn"
          className="w-full py-3 flex items-center justify-between hover:bg-stone-50 px-2 rounded-lg transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-semibold text-stone-900 block">रेफरल कोड (Referral System)</span>
              <span className="text-[11px] text-stone-500">मित्रों को आमंत्रित करें और +50 टोकन पाएं</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              {referralCount} रेफरल
            </span>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </div>
        </button>

        {/* Tokens & Perks */}
        <button
          onClick={onNavigateToTokens}
          id="profile-tokens-btn"
          className="w-full py-3 flex items-center justify-between hover:bg-stone-50 px-2 rounded-lg transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-semibold text-stone-900 block">टोकन और पुरस्कार (Tokens & Perks)</span>
              <span className="text-[11px] text-stone-500">बैलेंस: {tokenBalance} टोकन (₹{tokenBalance} मूल्य)</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
              भुनाएं
            </span>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </div>
        </button>

        {/* Language */}
        <div className="py-3 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-semibold text-stone-900 block">भाषा बदलें (Language)</span>
              <span className="text-[11px] text-stone-500">8 भारतीय भाषाओं में उपलब्ध</span>
            </div>
          </div>

          <select
            value={language}
            onChange={(e) => onChangeLanguage(e.target.value as Language)}
            className="px-2.5 py-1.5 rounded-md border border-stone-300 text-xs font-medium bg-white cursor-pointer"
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
        </div>

        {/* Notifications toggle */}
        <div className="py-3 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-semibold text-stone-900 block">सूचनाएं (Notifications)</span>
              <span className="text-[11px] text-stone-500">बिक्री और टोकन अलर्ट</span>
            </div>
          </div>

          <button
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer border ${
              notificationsEnabled 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                : 'bg-stone-100 text-stone-500 border-stone-200'
            }`}
          >
            {notificationsEnabled ? 'सक्रिय (ON)' : 'बंद (OFF)'}
          </button>
        </div>

        {/* Voice guidance toggle */}
        <div className="py-3 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
              {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </div>
            <div>
              <span className="text-sm font-semibold text-stone-900 block">बोलकर निर्देश (Voice Audio)</span>
              <span className="text-[11px] text-stone-500">स्थानीय भाषा में आवाज़ मार्गदर्शन</span>
            </div>
          </div>

          <button
            onClick={onToggleAudio}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer border ${
              !isAudioMuted 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                : 'bg-stone-100 text-stone-500 border-stone-200'
            }`}
          >
            {!isAudioMuted ? 'चालू' : 'बंद'}
          </button>
        </div>

        {/* Help */}
        <button
          onClick={() => setInfoModal('help')}
          className="w-full py-3 flex items-center justify-between hover:bg-stone-50 px-2 rounded-lg transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-semibold text-stone-900 block">मदद एवं सहायता (Help)</span>
              <span className="text-[11px] text-stone-500">टोकन, कैमरा और लिस्टिंग में सहायता</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </button>

        {/* About App */}
        <button
          onClick={() => setInfoModal('about')}
          className="w-full py-3 flex items-center justify-between hover:bg-stone-50 px-2 rounded-lg transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-semibold text-stone-900 block">ऐप के बारे में (About Karighar)</span>
              <span className="text-[11px] text-stone-500">Rural Craft Commerce Platform</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </button>

        {/* Logout */}
        <button
          onClick={onLogout}
          id="logout-btn"
          className="w-full py-3 flex items-center justify-between hover:bg-red-50 px-2 rounded-lg transition-colors cursor-pointer text-left text-red-700 font-semibold"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-700 border border-red-200 flex items-center justify-center">
              <LogOut className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold block">लॉगआउट (Log Out)</span>
              <span className="text-[11px] text-stone-500">सत्र समाप्त करें या नया उपयोगकर्ता चुनें</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-red-400" />
        </button>
      </div>

      {/* Demo Reset Button */}
      <button
        onClick={onResetDemoData}
        id="reset-demo-data-btn"
        className="w-full h-10 rounded-lg bg-white hover:bg-stone-50 text-stone-600 font-medium text-xs flex items-center justify-center gap-2 border border-stone-200 transition-colors cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>डेमो डेटा रीसेट करें (Reset to Initial State)</span>
      </button>

      {/* Info/Help Modal */}
      {infoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white max-w-md w-full rounded-xl p-5 shadow-xl space-y-4 border border-stone-200">
            <h3 className="text-base font-bold text-stone-900">
              {infoModal === 'help' ? 'मदद एवं सहायता' : 'कारीगर (Karighar) के बारे में'}
            </h3>

            {infoModal === 'help' ? (
              <div className="text-xs text-stone-600 space-y-2 leading-relaxed">
                <p>• <strong>टोकन कैसे कमाएं:</strong> कारीगर पंजीकृत करें (+10), उत्पाद बेचें (+5), या दोस्तों को आमंत्रित करें (+50)।</p>
                <p>• <strong>टोकन का उपयोग:</strong> 1 टोकन = ₹1। प्राथमिकता लिस्टिंग, फोटो सुधार या सीधे बैंक ट्रांसफर में इस्तेमाल करें।</p>
                <p>• <strong>सहयोग केंद्र:</strong> टोल-फ्री सहायता 1800-KARIGHAR पर 24x7 उपलब्ध।</p>
              </div>
            ) : (
              <div className="text-xs text-stone-600 space-y-2 leading-relaxed">
                <p><strong>कारीगर — "हुनर से बाज़ार तक"</strong></p>
                <p>ग्रामीण एवं हाशिए पर मौजूद भारतीय कारीगरों को बिना किसी डिजिटल साक्षरता बाधा के वैश्विक खरीदारों से सीधे जोड़ने का नवाचार मंच।</p>
              </div>
            )}

            <button
              onClick={() => setInfoModal(null)}
              className="w-full h-10 rounded-lg bg-stone-900 text-white font-bold text-xs hover:bg-black cursor-pointer"
            >
              बंद करें (Close)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

