import React, { useState } from 'react';
import { 
  User, 
  Globe, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  LogOut, 
  Sparkles, 
  ShieldCheck, 
  HelpCircle, 
  ExternalLink, 
  ChevronRight, 
  Info,
  Gift,
  Coins,
  Bell,
  Users,
  Package
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
    <div className="max-w-xl mx-auto space-y-5 pb-24 p-3 sm:p-6">
      {/* 👤 प्रोफ़ाइल Header Card */}
      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-800 text-white flex items-center justify-center text-2xl shadow-md">
              {role === 'seller' ? '🎨' : '🛍️'}
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900">
                {role === 'seller' ? (activeArtist?.name || 'कारीगर साथी') : 'शिल्प प्रेमी'}
              </h2>
              <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold mt-0.5">
                <span>📱 {mobileNumber}</span>
                <span>•</span>
                <span className="capitalize">{role === 'seller' ? 'Seller (विक्रेता)' : 'Buyer (खरीदार)'}</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">
                📅 सदस्य: जनवरी 2026
              </p>
            </div>
          </div>

          <button
            onClick={() => onSwitchRole(role === 'seller' ? 'buyer' : 'seller')}
            id="profile-switch-mode-btn"
            className="px-3 py-1.5 rounded-xl border border-gray-200 hover:border-indigo-400 bg-gray-50 text-xs font-bold text-gray-700 transition-colors cursor-pointer"
          >
            {role === 'seller' ? 'Buyer में बदलें' : 'Seller में बदलें'}
          </button>
        </div>
      </div>

      {/* ─── आपकी प्रगति (Your Progress) ─── */}
      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm sm:text-base text-gray-900 flex items-center gap-2">
            <span>📈 आपकी प्रगति (Your Progress)</span>
          </h3>
          <span className="text-[11px] text-indigo-600 font-bold">लाइव आँकड़े</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {/* 👥 कारीगर */}
          <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100">
            <span className="text-[11px] text-gray-500 font-bold block">👥 कारीगर</span>
            <span className="text-lg font-black text-indigo-950 mt-0.5 block">{totalArtists}</span>
          </div>

          {/* 📋 उत्पाद */}
          <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-100">
            <span className="text-[11px] text-gray-500 font-bold block">📋 उत्पाद</span>
            <span className="text-lg font-black text-purple-950 mt-0.5 block">{totalProducts}</span>
          </div>

          {/* 💰 टोकन */}
          <div 
            onClick={onNavigateToTokens}
            className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 cursor-pointer hover:bg-amber-100/70 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-amber-900 font-bold block">💰 टोकन</span>
              <ChevronRight className="w-3.5 h-3.5 text-amber-700" />
            </div>
            <span className="text-lg font-black text-amber-700 mt-0.5 block">🪙 {tokenBalance}</span>
          </div>

          {/* 🏆 टियर */}
          <div 
            onClick={onNavigateToReferrals}
            className="p-3 rounded-2xl bg-slate-100 border border-slate-200 cursor-pointer hover:bg-slate-200/70 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-gray-600 font-bold block">🏆 टियर</span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
            </div>
            <span className="text-sm font-black text-gray-900 mt-1 flex items-center gap-1">
              <span>{tierInfo.emoji}</span>
              <span>{tierInfo.name}</span>
            </span>
          </div>

          {/* 👥 रेफरल */}
          <div 
            onClick={onNavigateToReferrals}
            className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 cursor-pointer hover:bg-emerald-100/70 transition-all col-span-2 sm:col-span-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-emerald-900 font-bold block">👥 रेफरल</span>
              <ChevronRight className="w-3.5 h-3.5 text-emerald-700" />
            </div>
            <span className="text-lg font-black text-emerald-800 mt-0.5 block">{referralCount} मित्र</span>
          </div>
        </div>
      </div>

      {/* ─── सेटिंग्स (Settings & Options) ─── */}
      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-1 divide-y divide-gray-100">
        <h3 className="font-extrabold text-sm sm:text-base text-gray-900 pb-2">
          ⚙️ सेटिंग्स (Settings)
        </h3>

        {/* 🎁 रेफरल कोड (Referral Code Dashboard) */}
        <button
          onClick={onNavigateToReferrals}
          id="profile-referral-btn"
          className="w-full py-3.5 flex items-center justify-between hover:bg-gray-50 px-2 rounded-xl transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-base">
              🎁
            </div>
            <div>
              <span className="text-sm font-bold text-gray-900 block">रेफरल कोड (Referral System)</span>
              <span className="text-[11px] text-gray-500">मित्रों को आमंत्रित करें और +50 टोकन पाएं</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              {referralCount} रेफरल
            </span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </button>

        {/* 💰 टोकन और पुरस्कार (Token Dashboard) */}
        <button
          onClick={onNavigateToTokens}
          id="profile-tokens-btn"
          className="w-full py-3.5 flex items-center justify-between hover:bg-gray-50 px-2 rounded-xl transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center text-base">
              💰
            </div>
            <div>
              <span className="text-sm font-bold text-gray-900 block">टोकन और पुरस्कार (Tokens & Perks)</span>
              <span className="text-[11px] text-gray-500">बैलेंस: {tokenBalance} टोकन (₹{tokenBalance} मूल्य)</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
              भुनाएं
            </span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </button>

        {/* 🌐 भाषा बदलें (Language) */}
        <div className="py-3.5 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center text-base">
              🌐
            </div>
            <div>
              <span className="text-sm font-bold text-gray-900 block">भाषा बदलें (Language)</span>
              <span className="text-[11px] text-gray-500">8 भारतीय भाषाओं में उपलब्ध</span>
            </div>
          </div>

          <select
            value={language}
            onChange={(e) => onChangeLanguage(e.target.value as Language)}
            className="px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-bold bg-white cursor-pointer"
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

        {/* 🔔 सूचनाएं (Notifications toggle) */}
        <div className="py-3.5 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center text-base">
              🔔
            </div>
            <div>
              <span className="text-sm font-bold text-gray-900 block">सूचनाएं (Notifications)</span>
              <span className="text-[11px] text-gray-500">बिक्री और टोकन अलर्ट</span>
            </div>
          </div>

          <button
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              notificationsEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {notificationsEnabled ? 'सक्रिय (ON)' : 'बंद (OFF)'}
          </button>
        </div>

        {/* Voice guidance toggle */}
        <div className="py-3.5 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-base">
              🔊
            </div>
            <div>
              <span className="text-sm font-bold text-gray-900 block">बोलकर निर्देश (Voice Audio)</span>
              <span className="text-[11px] text-gray-500">स्थानीय भाषा में आवाज़ मार्गदर्शन</span>
            </div>
          </div>

          <button
            onClick={onToggleAudio}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              !isAudioMuted ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {!isAudioMuted ? 'चालू 🔊' : 'बंद 🔇'}
          </button>
        </div>

        {/* ❓ मदद (Help) */}
        <button
          onClick={() => setInfoModal('help')}
          className="w-full py-3.5 flex items-center justify-between hover:bg-gray-50 px-2 rounded-xl transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-base">
              ❓
            </div>
            <div>
              <span className="text-sm font-bold text-gray-900 block">मदद एवं सहायता (Help)</span>
              <span className="text-[11px] text-gray-500">टोकन, कैमरा और लिस्टिंग में सहायता</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>

        {/* ℹ️ ऐप के बारे में (About App) */}
        <button
          onClick={() => setInfoModal('about')}
          className="w-full py-3.5 flex items-center justify-between hover:bg-gray-50 px-2 rounded-xl transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gray-100 text-gray-800 flex items-center justify-center text-base">
              ℹ️
            </div>
            <div>
              <span className="text-sm font-bold text-gray-900 block">ऐप के बारे में (About Karighar)</span>
              <span className="text-[11px] text-gray-500">SIH 2026 Problem Statement 26090</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>

        {/* 🚪 लॉगआउट (Logout) */}
        <button
          onClick={onLogout}
          id="logout-btn"
          className="w-full py-3.5 flex items-center justify-between hover:bg-red-50 px-2 rounded-xl transition-colors cursor-pointer text-left text-red-600 font-bold"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center text-base">
              🚪
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
        onClick={onResetDemoData}
        id="reset-demo-data-btn"
        className="w-full h-11 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>डेमो डेटा रीसेट करें (Reset to Initial State)</span>
      </button>

      {/* Info/Help Modal */}
      {infoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl space-y-4 border border-gray-200">
            <h3 className="text-lg font-black text-gray-900">
              {infoModal === 'help' ? '❓ मदद एवं सहायता' : 'ℹ️ कारीगर (Karighar) के बारे में'}
            </h3>

            {infoModal === 'help' ? (
              <div className="text-xs text-gray-600 space-y-2 leading-relaxed">
                <p>• <strong>टोकन कैसे कमाएं:</strong> कारीगर पंजीकृत करें (+10), उत्पाद बेचें (+5), या दोस्तों को आमंत्रित करें (+50)।</p>
                <p>• <strong>टोकन का उपयोग:</strong> 1 टोकन = ₹1। प्राथमिकता लिस्टिंग, फोटो सुधार या सीधे बैंक ट्रांसफर में इस्तेमाल करें।</p>
                <p>• <strong>सहयोग केंद्र:</strong> टोल-फ्री सहायता 1800-KARIGHAR पर 24x7 उपलब्ध।</p>
              </div>
            ) : (
              <div className="text-xs text-gray-600 space-y-2 leading-relaxed">
                <p><strong>कारीगर — "हुनर से बाज़ार तक"</strong></p>
                <p>Smart India Hackathon (SIH 2026) · Problem Statement #26090</p>
                <p>ग्रामीण एवं हाशिए पर मौजूद भारतीय कारीगरों को बिना किसी डिजिटल साक्षरता बाधा के वैश्विक खरीदारों से सीधे जोड़ने का नवाचार मंच।</p>
              </div>
            )}

            <button
              onClick={() => setInfoModal(null)}
              className="w-full h-11 rounded-xl bg-indigo-600 text-white font-bold text-xs"
            >
              बंद करें (Close)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
