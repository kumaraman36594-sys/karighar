import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Share2, 
  Copy, 
  Check, 
  Users, 
  Sparkles, 
  Award, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  Coins 
} from 'lucide-react';
import { Language, Referral } from '../../types';
import { TokenService, ReferralService, REFERRAL_TIERS } from '../../utils/tokenService';
import { TierBadge } from '../common/TierBadge';
import { speak } from '../../utils/speech';

interface ReferralDashboardScreenProps {
  referralCode: string;
  referrals: Referral[];
  referralCount: number;
  tokenBalance: number;
  language: Language;
  onBack: () => void;
  onOpenTokens: () => void;
  isAudioMuted: boolean;
}

export const ReferralDashboardScreen: React.FC<ReferralDashboardScreenProps> = ({
  referralCode,
  referrals,
  referralCount,
  tokenBalance,
  language,
  onBack,
  onOpenTokens,
  isAudioMuted,
}) => {
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState('');

  const currentTier = TokenService.calculateTier(referralCount);
  const tierInfo = TokenService.getTierInfo(currentTier);
  const { nextTier, needed } = TokenService.getNextTierInfo(referralCount);

  // Earnings calculations
  const earningsFromReferrals = referrals.reduce((sum, r) => sum + r.totalEarned, 0) || 200;
  const earningsFromSales = Math.max(0, tokenBalance - earningsFromReferrals) || 45;
  const totalEarnings = tokenBalance;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(referralCode);
      }
      setCopied(true);
      setToast('रेफरल कोड कॉपी किया गया! (Copied)');
      if (!isAudioMuted) speak('रेफरल कोड कॉपी किया गया।', language);
      setTimeout(() => {
        setCopied(false);
        setToast('');
      }, 2500);
    } catch {
      setToast('कॉपी करने में असमर्थ');
    }
  };

  const handleShare = async () => {
    const success = await ReferralService.shareReferralCode(referralCode);
    if (success) {
      setToast('शेयर संदेश तैयार किया गया! (Share prepared)');
      if (!isAudioMuted) speak('रेफरल आमंत्रण तैयार किया गया।', language);
      setTimeout(() => setToast(''), 2500);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24 p-3 sm:p-6">
      {/* Toast feedback */}
      {toast && (
        <div className="fixed top-4 inset-x-0 z-50 flex justify-center pointer-events-none px-4 animate-fade-in">
          <div className="bg-gray-900 text-white px-4 py-2 rounded-2xl shadow-lg text-xs font-bold flex items-center gap-2 border border-white/20">
            <span>✨</span>
            <span>{toast}</span>
          </div>
        </div>
      )}

      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-gray-700 shadow-xs hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-indigo-600" />
              <span>मेरे रेफरल (My Referrals)</span>
            </h1>
            <p className="text-xs text-gray-500">
              मित्रों को जोड़ें, कारीगरों को सशक्त बनाएं और टोकन कमाएं
            </p>
          </div>
        </div>

        <TierBadge tierLevel={currentTier} size="md" />
      </div>

      {/* Hero Referral Code Card */}
      <div className="bg-gradient-to-br from-indigo-700 via-purple-700 to-indigo-900 rounded-3xl p-6 text-white shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎁</span>
            <span className="text-xs sm:text-sm font-bold text-indigo-200 uppercase tracking-wider">
              आपका अनूठा रेफरल कोड
            </span>
          </div>
          <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-black text-amber-300 backdrop-blur-md">
            +50 टोकन प्रति रेफरल
          </span>
        </div>

        {/* Big Code Display */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/20 text-center space-y-1">
          <span className="text-2xl sm:text-3xl font-black tracking-wider text-amber-300 font-mono block select-all">
            {referralCode}
          </span>
          <p className="text-xs text-indigo-200">
            नए उपयोगकर्ता को <strong className="text-white">+25 टोकन</strong> और आपको <strong className="text-white">+50 टोकन</strong>
          </p>
        </div>

        {/* Share & Copy Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleShare}
            id="share-referral-btn"
            className="h-12 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>📤 शेयर करें</span>
          </button>

          <button
            onClick={handleCopy}
            id="copy-referral-btn"
            className="h-12 rounded-xl bg-white/20 hover:bg-white/30 text-white font-extrabold text-xs sm:text-sm border border-white/20 backdrop-blur-md flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'कॉपी हुआ!' : '📋 कॉपी करें'}</span>
          </button>
        </div>
      </div>

      {/* Tier Progress Bar */}
      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{tierInfo.emoji}</span>
            <div>
              <span className="text-xs font-bold text-gray-500 uppercase">वर्तमान टियर</span>
              <h4 className="text-sm font-extrabold text-gray-900">{tierInfo.name} ({referralCount} रेफरल)</h4>
            </div>
          </div>

          {nextTier && (
            <div className="text-right">
              <span className="text-xs text-indigo-600 font-bold">
                अगला टियर: {nextTier.emoji} {nextTier.name}
              </span>
              <p className="text-[11px] text-gray-500">{needed} और रेफरल चाहिए</p>
            </div>
          )}
        </div>

        {/* Visual Progress Track */}
        <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500 rounded-full"
            style={{
              width: `${Math.min(100, Math.max(10, (referralCount / (nextTier ? nextTier.minReferrals : 50)) * 100))}%`,
            }}
          />
        </div>

        <p className="text-[11px] text-gray-600 font-medium">
          टियर लाभ: <strong className="text-indigo-700">{tierInfo.benefitHi}</strong>
        </p>
      </div>

      {/* Referrals List: ─── आपके रेफरल ─── */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base sm:text-lg text-gray-900 flex items-center gap-2">
            <span>👥 आपके रेफरल ({referrals.length})</span>
          </h3>
          <span className="text-xs text-gray-500 font-semibold">स्थिति एवं रिवॉर्ड</span>
        </div>

        <div className="space-y-3">
          {referrals.map((ref) => (
            <div
              key={ref.id}
              className="p-4 rounded-2xl bg-gray-50/90 border border-gray-200 space-y-2.5 hover:border-indigo-300 transition-colors"
            >
              {/* Person Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm">
                    👤
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">{ref.referredName}</h4>
                    <span className="text-[10px] text-gray-500">
                      शामिल हुए: {new Date(ref.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                  +{ref.totalEarned} टोकन
                </span>
              </div>

              {/* Milestones list */}
              <div className="space-y-1.5 pt-1 text-xs">
                <div className="flex items-center justify-between text-emerald-700 font-semibold bg-white p-2 rounded-xl border border-gray-100">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>पहला कारीगर जोड़ा</span>
                  </span>
                  <span className="font-bold">+25 टोकन</span>
                </div>

                {ref.milestones.firstSaleCompleted ? (
                  <div className="flex items-center justify-between text-emerald-700 font-semibold bg-white p-2 rounded-xl border border-gray-100">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>पहली बिक्री पूरी हुई</span>
                    </span>
                    <span className="font-bold">+50 टोकन</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-amber-700 font-semibold bg-amber-50/70 p-2 rounded-xl border border-amber-100">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>पहली बिक्री का इंतज़ार...</span>
                    </span>
                    <span className="text-[11px] text-amber-800 font-bold">+50 टोकन मिलेंगे</span>
                  </div>
                )}

                {ref.milestones.fiveArtistsRegistered && (
                  <div className="flex items-center justify-between text-emerald-700 font-semibold bg-white p-2 rounded-xl border border-gray-100">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>5 कारीगर जोड़े (विशेष बोनस)</span>
                    </span>
                    <span className="font-bold">+25 टोकन</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total Earnings Breakdown: ─── कुल कमाई ─── */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-sm space-y-4">
        <h3 className="font-extrabold text-base sm:text-lg text-gray-900 flex items-center gap-2">
          <span>📊 कुल कमाई (Earnings Breakdown)</span>
        </h3>

        <div className="space-y-2 text-xs sm:text-sm">
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
            <span className="text-gray-700 font-medium">रेफरल से कमाई (From Referrals):</span>
            <span className="font-extrabold text-indigo-700">{earningsFromReferrals} टोकन</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
            <span className="text-gray-700 font-medium">बिक्री से कमाई (From Craft Sales):</span>
            <span className="font-extrabold text-emerald-700">{earningsFromSales} टोकन</span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 font-black text-sm sm:text-base text-indigo-950">
            <span>कुल टोकन बैलेंस (Total Tokens):</span>
            <span className="text-amber-600">🪙 {totalEarnings} टोकन (₹{totalEarnings})</span>
          </div>
        </div>

        <button
          onClick={onOpenTokens}
          className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>टोकन डैशबोर्ड देखें और भुनाएं</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Referral Tiers Guide Table */}
      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-3">
        <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" />
          <span>रेफरल टियर और लाभ (Referral Tiers)</span>
        </h3>

        <div className="divide-y divide-gray-100 text-xs">
          {REFERRAL_TIERS.map((tier) => (
            <div key={tier.tier} className="py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">{tier.emoji}</span>
                <div>
                  <strong className="text-gray-900 block">{tier.name}</strong>
                  <span className="text-[11px] text-gray-500">{tier.minReferrals}+ रेफरल</span>
                </div>
              </div>
              <span className="text-right text-[11px] font-bold text-indigo-700">
                {tier.benefitHi}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
