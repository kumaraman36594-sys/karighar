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
  Coins,
  User,
  Gift
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
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 pb-24 space-y-6">
      {/* Toast feedback */}
      {toast && (
        <div className="fixed top-4 inset-x-0 z-50 flex justify-center pointer-events-none px-4 animate-fade-in">
          <div className="bg-stone-900 text-white px-4 py-2 rounded-xl shadow-lg text-xs font-bold flex items-center gap-2 border border-white/20">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{toast}</span>
          </div>
        </div>
      )}

      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-700 shadow-xs hover:bg-stone-50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-[#B4431E]" />
              <span>मेरे रेफरल (My Referrals)</span>
            </h1>
            <p className="text-xs text-stone-500 font-medium">
              मित्रों को जोड़ें, कारीगरों को सशक्त बनाएं और टोकन कमाएं
            </p>
          </div>
        </div>

        <TierBadge tierLevel={currentTier} size="md" />
      </div>

      {/* Responsive Two-Column Grid on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 cols): Hero Code Card + Tier Progress + Tiers Guide */}
        <div className="lg:col-span-5 space-y-6">
          {/* Hero Referral Code Card */}
          <div className="bg-gradient-to-br from-[#963717] via-[#B4431E] to-[#782c0f] rounded-xl p-6 text-white shadow-md space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-300" />
                <span className="text-xs sm:text-sm font-bold text-amber-100 uppercase tracking-wider">
                  आपका अनूठा रेफरल कोड
                </span>
              </div>
              <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-extrabold text-amber-200 backdrop-blur-xs">
                +50 टोकन प्रति रेफरल
              </span>
            </div>

            {/* Big Code Display */}
            <div className="bg-black/20 backdrop-blur-xs rounded-xl p-4 sm:p-5 border border-white/15 text-center space-y-1">
              <span className="text-2xl sm:text-3xl font-black tracking-widest text-amber-300 font-mono block select-all">
                {referralCode}
              </span>
              <p className="text-xs text-amber-100/90">
                नए उपयोगकर्ता को <strong className="text-white">+25 टोकन</strong> और आपको <strong className="text-white">+50 टोकन</strong>
              </p>
            </div>

            {/* Share & Copy Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleShare}
                id="share-referral-btn"
                className="h-11 rounded-lg bg-amber-400 hover:bg-amber-300 text-amber-950 font-extrabold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>शेयर करें</span>
              </button>

              <button
                type="button"
                onClick={handleCopy}
                id="copy-referral-btn"
                className="h-11 rounded-lg bg-white/20 hover:bg-white/30 text-white font-extrabold text-xs sm:text-sm border border-white/20 backdrop-blur-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'कॉपी हुआ!' : 'कॉपी करें'}</span>
              </button>
            </div>
          </div>

          {/* Tier Progress Bar */}
          <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{tierInfo.emoji}</span>
                <div>
                  <span className="text-xs font-bold text-stone-500 uppercase">वर्तमान टियर</span>
                  <h4 className="text-sm font-extrabold text-stone-900">{tierInfo.name} ({referralCount} रेफरल)</h4>
                </div>
              </div>

              {nextTier && (
                <div className="text-right">
                  <span className="text-xs text-[#B4431E] font-bold">
                    अगला टियर: {nextTier.emoji} {nextTier.name}
                  </span>
                  <p className="text-[11px] text-stone-500">{needed} और रेफरल चाहिए</p>
                </div>
              )}
            </div>

            {/* Visual Progress Track */}
            <div className="w-full h-2.5 rounded-full bg-stone-100 overflow-hidden relative">
              <div
                className="h-full bg-[#B4431E] transition-all duration-500 rounded-full"
                style={{
                  width: `${Math.min(100, Math.max(10, (referralCount / (nextTier ? nextTier.minReferrals : 50)) * 100))}%`,
                }}
              />
            </div>

            <p className="text-xs text-stone-600 font-medium">
              टियर लाभ: <strong className="text-[#B4431E]">{tierInfo.benefitHi}</strong>
            </p>
          </div>

          {/* Referral Tiers Guide Table */}
          <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
              <Award className="w-4 h-4 text-[#B4431E]" />
              <span>रेफरल टियर और लाभ (Referral Tiers)</span>
            </h3>

            <div className="divide-y divide-stone-100 text-xs">
              {REFERRAL_TIERS.map((tier) => (
                <div key={tier.tier} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{tier.emoji}</span>
                    <div>
                      <strong className="text-stone-900 block">{tier.name}</strong>
                      <span className="text-[11px] text-stone-500">{tier.minReferrals}+ रेफरल</span>
                    </div>
                  </div>
                  <span className="text-right text-[11px] font-bold text-[#B4431E]">
                    {tier.benefitHi}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Referrals List + Total Earnings */}
        <div className="lg:col-span-7 space-y-6">
          {/* Referrals List */}
          <div className="bg-white rounded-xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-extrabold text-base sm:text-lg text-stone-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#B4431E]" />
                <span>आपके रेफरल ({referrals.length})</span>
              </h3>
              <span className="text-xs text-stone-500 font-semibold">स्थिति एवं रिवॉर्ड</span>
            </div>

            <div className="space-y-3">
              {referrals.map((ref) => (
                <div
                  key={ref.id}
                  className="p-4 rounded-xl bg-stone-50/80 border border-stone-200 space-y-2.5 hover:border-amber-300 transition-colors"
                >
                  {/* Person Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#B4431E] border border-orange-100 font-bold flex items-center justify-center text-sm">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-stone-900">{ref.referredName}</h4>
                        <span className="text-[10px] text-stone-500">
                          शामिल हुए: {new Date(ref.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <span className="text-xs font-extrabold text-amber-950 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                      +{ref.totalEarned} टोकन
                    </span>
                  </div>

                  {/* Milestones list */}
                  <div className="space-y-1.5 pt-1 text-xs">
                    <div className="flex items-center justify-between text-emerald-800 font-semibold bg-white p-2 rounded-lg border border-stone-200/60">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>पहला कारीगर जोड़ा</span>
                      </span>
                      <span className="font-bold">+25 टोकन</span>
                    </div>

                    {ref.milestones.firstSaleCompleted ? (
                      <div className="flex items-center justify-between text-emerald-800 font-semibold bg-white p-2 rounded-lg border border-stone-200/60">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>पहली बिक्री पूरी हुई</span>
                        </span>
                        <span className="font-bold">+50 टोकन</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-amber-800 font-semibold bg-amber-50/70 p-2 rounded-lg border border-amber-200">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>पहली बिक्री का इंतज़ार...</span>
                        </span>
                        <span className="text-[11px] text-amber-900 font-bold">+50 टोकन मिलेंगे</span>
                      </div>
                    )}

                    {ref.milestones.fiveArtistsRegistered && (
                      <div className="flex items-center justify-between text-emerald-800 font-semibold bg-white p-2 rounded-lg border border-stone-200/60">
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

          {/* Total Earnings Breakdown */}
          <div className="bg-white rounded-xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base sm:text-lg text-stone-900 flex items-center gap-2">
              <Coins className="w-5 h-5 text-[#B4431E]" />
              <span>कुल कमाई (Earnings Breakdown)</span>
            </h3>

            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex items-center justify-between p-3 rounded-lg bg-stone-50">
                <span className="text-stone-700 font-medium">रेफरल से कमाई (From Referrals):</span>
                <span className="font-extrabold text-[#B4431E]">{earningsFromReferrals} टोकन</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-stone-50">
                <span className="text-stone-700 font-medium">बिक्री से कमाई (From Craft Sales):</span>
                <span className="font-extrabold text-emerald-700">{earningsFromSales} टोकन</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-lg bg-amber-50/70 border border-amber-200 font-bold text-sm sm:text-base text-stone-900">
                <span>कुल टोकन बैलेंस (Total Tokens):</span>
                <span className="text-[#B4431E] font-extrabold">{totalEarnings} टोकन (₹{totalEarnings})</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenTokens}
              className="w-full h-11 rounded-lg bg-[#B4431E] hover:bg-[#963717] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>टोकन डैशबोर्ड देखें और भुनाएं</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
