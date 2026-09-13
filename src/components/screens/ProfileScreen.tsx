import React, { useState } from 'react';
import { 
  User, 
  Globe, 
  Volume2, 
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
  TrendingUp,
  Settings,
  Calendar,
  Smartphone,
  Palette,
  ShoppingBag,
  Trophy
} from 'lucide-react';
import { UserRole, Language, Artist } from '../../types';
import { TRANSLATIONS } from '../../utils/translations';
import { TokenService } from '../../utils/tokenService';

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
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-xl bg-[#B4431E] text-white flex items-center justify-center text-xl shadow-xs shrink-0">
              {role === 'seller' ? <Palette className="w-6 h-6" /> : <ShoppingBag className="w-6 h-6" />}
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-stone-900">
                {role === 'seller' ? (activeArtist?.name || 'कारीगर साथी') : 'शिल्प प्रेमी'}
              </h2>
              <div className="flex items-center gap-2 text-xs text-stone-500 font-semibold mt-0.5">
                <span className="flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-stone-400" />
                  {mobileNumber}
                </span>
                <span>•</span>
                <span className="capitalize">{role === 'seller' ? 'Seller (विक्रेता)' : 'Buyer (खरीदार)'}</span>
              </div>
              <p className="text-[11px] text-stone-400 mt-0.5 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                सदस्य: जनवरी 2026
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSwitchRole(role === 'seller' ? 'buyer' : 'seller')}
            id="profile-switch-mode-btn"
            className="px-3.5 py-2 rounded-lg border border-stone-200 hover:border-[#B4431E] bg-stone-50 hover:bg-white text-xs font-bold text-stone-700 transition-colors cursor-pointer self-start sm:self-auto"
          >
            {role === 'seller' ? 'Buyer में बदलें' : 'Seller में बदलें'}
          </button>
        </div>
      </div>

      {/* आपकी प्रगति (Your Progress) */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <h3 className="font-extrabold text-base text-stone-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#B4431E]" />
            <span>आपकी प्रगति (Your Progress)</span>
          </h3>
          <span className="text-xs text-[#B4431E] font-bold">लाइव आँकड़े</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {/* कारीगर */}
          <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
            <span className="text-xs text-stone-500 font-bold flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#B4431E]" /> कारीगर
            </span>
            <span className="text-lg font-extrabold text-stone-900 mt-1 block">{totalArtists}</span>
          </div>

          {/* उत्पाद */}
          <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
            <span className="text-xs text-stone-500 font-bold flex items-center gap-1">
              <Package className="w-3.5 h-3.5 text-[#B4431E]" /> उत्पाद
            </span>
            <span className="text-lg font-extrabold text-stone-900 mt-1 block">{totalProducts}</span>
          </div>

          {/* टोकन */}
          <div 
            onClick={onNavigateToTokens}
            className="p-3 rounded-lg bg-amber-50/70 border border-amber-200 cursor-pointer hover:bg-amber-100/70 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-amber-900 font-bold flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-[#B4431E]" /> टोकन
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-amber-700" />
            </div>
            <span className="text-lg font-extrabold text-[#B4431E] mt-1 block">{tokenBalance}</span>
          </div>

          {/* टियर */}
          <div 
            onClick={onNavigateToReferrals}
            className="p-3 rounded-lg bg-stone-50 border border-stone-200 cursor-pointer hover:bg-stone-100 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-600 font-bold flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-amber-600" /> टियर
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
            </div>
            <span className="text-sm font-extrabold text-stone-900 mt-1 block truncate">
              {tierInfo.name}
            </span>
          </div>

          {/* रेफरल */}
          <div 
            onClick={onNavigateToReferrals}
            className="p-3 rounded-lg bg-stone-50 border border-stone-200 cursor-pointer hover:bg-stone-100 transition-colors col-span-2 sm:col-span-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-600 font-bold flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-emerald-700" /> रेफरल
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
            </div>
            <span className="text-lg font-extrabold text-emerald-800 mt-1 block">{referralCount} मित्र</span>
          </div>
        </div>
      </div>

      {/* सेटिंग्स (Settings & Options) */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-1 divide-y divide-stone-100">
        <h3 className="font-extrabold text-base text-stone-900 pb-3 flex items-center gap-2">
          <Settings className="w-4 h-4 text-[#B4431E]" />
          <span>सेटिंग्स (Settings)</span>
        </h3>

        {/* रेफरल कोड */}
        <button
          type="button"
          onClick={onNavigateToReferrals}
          id="profile-referral-btn"
          className="w-full py-3 flex items-center justify-between hover:bg-stone-50 px-2 rounded-lg transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#B4431E] border border-orange-100 flex items-center justify-center text-sm">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-stone-900 block">रेफरल कोड (Referral System)</span>
              <span className="text-[11px] text-stone-500">मित्रों को आमंत्रित करें और +50 टोकन पाएं</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-amber-950 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              {referralCount} रेफरल
            </span>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </div>
        </button>

        {/* टोकन और पुरस्कार */}
        <button
          type="button"
          onClick={onNavigateToTokens}
          id="profile-tokens-btn"
          className="w-full py-3 flex items-center justify-between hover:bg-stone-50 px-2 rounded-lg transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-[#B4431E] border border-amber-200 flex items-center justify-center text-sm">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-stone-900 block">टोकन और पुरस्कार (Tokens & Perks)</span>
              <span className="text-[11px] text-stone-500">बैलेंस: {tokenBalance} टोकन (₹{tokenBalance} मूल्य)</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-[#B4431E] bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
              भुनाएं
            </span>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </div>
        </button>

        {/* भाषा बदलें */}
        <div className="py-3 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center text-sm border border-stone-200">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-stone-900 block">भाषा बदलें (Language)</span>
              <span className="text-[11px] text-stone-500">8 भारतीय भाषाओं में उपलब्ध</span>
            </div>
          </div>

          <select
            value={language}
            onChange={(e) => onChangeLanguage(e.target.value as Language)}
            className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-bold bg-white cursor-pointer focus:border-[#B4431E] focus:outline-hidden"
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

        {/* सूचनाएं */}
        <div className="py-3 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center text-sm border border-stone-200">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-stone-900 block">सूचनाएं (Notifications)</span>
              <span className="text-[11px] text-stone-500">बिक्री और टोकन अलर्ट</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-colors cursor-pointer ${
              notificationsEnabled ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-stone-100 text-stone-500'
            }`}
          >
            {notificationsEnabled ? 'सक्रिय (ON)' : 'बंद (OFF)'}
          </button>
        </div>

        {/* Voice guidance toggle */}
        <div className="py-3 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#B4431E] flex items-center justify-center text-sm border border-orange-100">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-stone-900 block">बोलकर निर्देश (Voice Audio)</span>
              <span className="text-[11px] text-stone-500">स्थानीय भाषा में आवाज़ मार्गदर्शन</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onToggleAudio}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-colors cursor-pointer ${
              !isAudioMuted ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-stone-100 text-stone-500'
            }`}
          >
            {!isAudioMuted ? 'चालू' : 'बंद'}
          </button>
        </div>

        {/* मदद */}
        <button
          type="button"
          onClick={() => setInfoModal('help')}
          className="w-full py-3 flex items-center justify-between hover:bg-stone-50 px-2 rounded-lg transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center text-sm border border-stone-200">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-stone-900 block">मदद एवं सहायता (Help)</span>
              <span className="text-[11px] text-stone-500">टोकन, कैमरा और लिस्टिंग में सहायता</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </button>

        {/* ऐप के बारे में */}
        <button
          type="button"
          onClick={() => setInfoModal('about')}
          className="w-full py-3 flex items-center justify-between hover:bg-stone-50 px-2 rounded-lg transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center text-sm border border-stone-200">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-stone-900 block">ऐप के बारे में (About Karighar)</span>
              <span className="text-[11px] text-stone-500">SIH 2026 Problem Statement 26090</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </button>

        {/* लॉगआउट */}
        <button
          type="button"
          onClick={onLogout}
          id="logout-btn"
          className="w-full py-3 flex items-center justify-between hover:bg-red-50 px-2 rounded-lg transition-colors cursor-pointer text-left text-red-600 font-bold"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-50 text-red-700 border border-red-200 flex items-center justify-center text-sm">
              <LogOut className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold block">लॉगआउट (Log Out)</span>
              <span className="text-[11px] text-red-400">सत्र समाप्त करें या नया उपयोगकर्ता चुनें</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-red-400" />
        </button>
      </div>

      {/* Demo Reset Button */}
      <button
        type="button"
        onClick={onResetDemoData}
        id="reset-demo-data-btn"
        className="w-full h-10 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer border border-stone-200"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>डेमो डेटा रीसेट करें (Reset to Initial State)</span>
      </button>

      {/* Info/Help Modal */}
      {infoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white max-w-md w-full rounded-xl p-6 shadow-2xl space-y-4 border border-stone-200">
            <h3 className="text-lg font-extrabold text-stone-900 flex items-center gap-2">
              {infoModal === 'help' ? <HelpCircle className="w-5 h-5 text-[#B4431E]" /> : <Info className="w-5 h-5 text-[#B4431E]" />}
              <span>{infoModal === 'help' ? 'मदद एवं सहायता' : 'कारीगर (Karighar) के बारे में'}</span>
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
                <p>Smart India Hackathon (SIH 2026) · Problem Statement #26090</p>
                <p>ग्रामीण एवं हाशिए पर मौजूद भारतीय कारीगरों को बिना किसी डिजिटल साक्षरता बाधा के वैश्विक खरीदारों से सीधे जोड़ने का नवाचार मंच।</p>
              </div>
            )}

            <button
              type="button"
              onClick={() => setInfoModal(null)}
              className="w-full h-10 rounded-lg bg-[#B4431E] hover:bg-[#963717] text-white font-bold text-xs cursor-pointer transition-colors"
            >
              बंद करें (Close)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
