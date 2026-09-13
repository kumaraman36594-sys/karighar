import React, { useState } from 'react';
import { 
  User, 
  Package, 
  Heart, 
  MapPin, 
  CreditCard, 
  Globe, 
  Bell, 
  HelpCircle, 
  LogOut, 
  ChevronRight, 
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Language, UserSession } from '../../types';
import { LANGUAGE_NAMES } from '../../utils/speech';

interface BuyerProfileScreenProps {
  session: UserSession;
  onNavigateOrders: () => void;
  onSwitchToSeller: () => void;
  onLogout: () => void;
}

export const BuyerProfileScreen: React.FC<BuyerProfileScreenProps> = ({
  session,
  onNavigateOrders,
  onSwitchToSeller,
  onLogout,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 pb-28 space-y-6 select-none bg-white text-[#111111]">
      {/* Profile Card Top */}
      <div className="border border-[#DDDDDD] rounded-xl p-5 bg-gradient-to-r from-amber-50/60 via-orange-50/30 to-white flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#FF9900] to-rose-500 text-white flex items-center justify-center text-3xl font-extrabold shadow-sm border-2 border-white">
          👤
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl font-extrabold text-[#111111]">
              Ananya Gupta
            </h2>
            <span className="text-[10px] bg-emerald-100 text-[#007600] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Verified Patron</span>
            </span>
          </div>
          <p className="text-xs text-[#565959] font-medium">
            {session.mobileNumber || '+91 98111 22334'} · New Delhi, India
          </p>
          <div className="text-xs text-[#FF9900] font-semibold pt-1">
            Supporting 4 rural artisan cooperatives in Rajasthan, Bihar & Karnataka
          </div>
        </div>
      </div>

      {/* Switch to Seller Banner */}
      <div className="border border-indigo-200 rounded-xl p-4 bg-indigo-50/70 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xl shrink-0 shadow-sm">
            🎨
          </div>
          <div>
            <h3 className="font-bold text-sm text-indigo-950">
              Are you a Craftsman or Volunteer?
            </h3>
            <p className="text-xs text-indigo-700">
              Switch to Artisan Seller Mode to list crafts with voice guidance and earn tokens.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onSwitchToSeller}
          className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          {t('switchRole')}
        </button>
      </div>

      {/* Account Settings Menu Items */}
      <div className="border border-[#DDDDDD] rounded-xl divide-y divide-[#DDDDDD] bg-white overflow-hidden shadow-xs">
        {/* Orders */}
        <button
          type="button"
          onClick={onNavigateOrders}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#F5F5F5] transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-[#FF9900]" />
            <div>
              <div className="text-sm font-bold text-[#111111]">{t('orders')}</div>
              <div className="text-xs text-[#565959]">Track, return, or buy items again</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#565959]" />
        </button>

        {/* Addresses */}
        <button
          type="button"
          onClick={() => setShowAddressModal(true)}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#F5F5F5] transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-red-500" />
            <div>
              <div className="text-sm font-bold text-[#111111]">{t('addresses')}</div>
              <div className="text-xs text-[#565959]">Flat 402, Lotus Heights, Saket, New Delhi 110017</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#565959]" />
        </button>

        {/* Payment Methods */}
        <div className="px-4 py-3.5 flex items-center justify-between hover:bg-[#F5F5F5] transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-indigo-500" />
            <div>
              <div className="text-sm font-bold text-[#111111]">{t('payments')}</div>
              <div className="text-xs text-[#565959]">UPI (PhonePe, GPay) and saved cards</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#565959]" />
        </div>

        {/* Language Changer */}
        <button
          type="button"
          onClick={() => setIsLangModalOpen(true)}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#F5F5F5] transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-blue-500" />
            <div>
              <div className="text-sm font-bold text-[#111111]">{t('language')}</div>
              <div className="text-xs text-[#565959]">Current: {LANGUAGE_NAMES[language]}</div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-[#FF9900]">
            <span>Change</span>
            <ChevronRight className="w-4 h-4 text-[#565959]" />
          </div>
        </button>

        {/* Notifications */}
        <div className="px-4 py-3.5 flex items-center justify-between hover:bg-[#F5F5F5] transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-amber-500" />
            <div>
              <div className="text-sm font-bold text-[#111111]">{t('notifications')}</div>
              <div className="text-xs text-[#565959]">Order alerts, craft stories, discounts</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#565959]" />
        </div>

        {/* Help & Support */}
        <div className="px-4 py-3.5 flex items-center justify-between hover:bg-[#F5F5F5] transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-emerald-600" />
            <div>
              <div className="text-sm font-bold text-[#111111]">{t('help')}</div>
              <div className="text-xs text-[#565959]">Frequently asked questions and artisan helpline</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#565959]" />
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={onLogout}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-red-50 transition-colors cursor-pointer text-left text-red-600"
        >
          <div className="flex items-center gap-3">
            <LogOut className="w-5 h-5 text-red-600" />
            <span className="text-sm font-bold">{t('logout')}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-red-400" />
        </button>
      </div>

      {/* Language Switcher Modal */}
      {isLangModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-lg max-w-sm w-full p-5 space-y-4 border border-[#DDDDDD] shadow-xl">
            <div className="flex items-center justify-between border-b border-[#DDDDDD] pb-3">
              <h3 className="font-bold text-base text-[#111111]">
                {t('chooseLanguage')}
              </h3>
              <button
                type="button"
                onClick={() => setIsLangModalOpen(false)}
                className="p-1 rounded-md hover:bg-[#F5F5F5] cursor-pointer text-[#565959]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1 max-h-72 overflow-y-auto">
              {(['hi', 'en', 'ta', 'te', 'bn', 'mr', 'gu', 'kn'] as Language[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => {
                    setLanguage(l);
                    setIsLangModalOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-md text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                    language === l
                      ? 'bg-[#FF9900]/15 text-[#111111] font-bold'
                      : 'hover:bg-[#F5F5F5] text-[#111111]'
                  }`}
                >
                  <span>{LANGUAGE_NAMES[l]}</span>
                  {language === l && <Check className="w-4 h-4 text-[#FF9900]" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Address Details Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-lg max-w-sm w-full p-5 space-y-4 border border-[#DDDDDD] shadow-xl">
            <div className="flex items-center justify-between border-b border-[#DDDDDD] pb-3">
              <h3 className="font-bold text-base text-[#111111]">
                Delivery Address
              </h3>
              <button
                type="button"
                onClick={() => setShowAddressModal(false)}
                className="p-1 rounded-md hover:bg-[#F5F5F5] cursor-pointer text-[#565959]"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-[#F5F5F5] rounded-md text-xs text-[#111111] space-y-1">
              <div className="font-bold">Ananya Gupta</div>
              <div>Flat 402, Lotus Heights, Saket</div>
              <div>New Delhi, Delhi - 110017</div>
              <div>Mobile: +91 98111 22334</div>
            </div>

            <button
              type="button"
              onClick={() => setShowAddressModal(false)}
              className="w-full py-2.5 rounded-md bg-[#FF9900] text-[#111111] font-bold text-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
