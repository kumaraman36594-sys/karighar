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
  User
} from 'lucide-react';
import { Language, Referral } from '../../types';
import { TokenService, ReferralService, REFERRAL_TIERS } from '../../utils/tokenService';
import { TierBadge } from '../common/TierBadge';
import { speak } from '../../utils/speech';

interface ReferralDashboardScreenProps {
  referralCode: string;
  referrals: Referral[];
  referralCount: number;
  tokenBalance?: number;
  tokensEarned?: number;
  referralTier?: number;
  language: Language;
  onBack: () => void;
  onOpenTokens: () => void;
  isAudioMuted: boolean;
}

export const ReferralDashboardScreen: React.FC<ReferralDashboardScreenProps> = ({
  referralCode,
  referrals,
  referralCount,
  tokenBalance = 245,
  tokensEarned,
  referralTier,
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
      setToast('Referral code copied');
      if (!isAudioMuted) speak('रेफरल कोड कॉपी किया गया।', language);
      setTimeout(() => {
        setCopied(false);
        setToast('');
      }, 2500);
    } catch {
      setToast('Unable to copy');
    }
  };

  const handleShare = async () => {
    const success = await ReferralService.shareReferralCode(referralCode);
    if (success) {
      setToast('Referral invitation ready');
      if (!isAudioMuted) speak('रेफरल आमंत्रण तैयार किया गया।', language);
      setTimeout(() => setToast(''), 2500);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-20 p-3 sm:p-5 select-none">
      {/* Toast feedback */}
      {toast && (
        <div className="fixed top-4 inset-x-0 z-50 flex justify-center pointer-events-none px-4 animate-fade-in">
          <div className="bg-stone-900 text-white px-3.5 py-2 rounded-lg shadow-md text-xs font-semibold flex items-center gap-1.5 border border-stone-700">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>{toast}</span>
          </div>
        </div>
      )}

      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-stone-700 shadow-xs hover:bg-stone-50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-stone-700" />
              <span>My Referrals (रेफरल डैशबोर्ड)</span>
            </h1>
            <p className="text-xs text-stone-500">
              Empower rural artisans and earn platform tokens
            </p>
          </div>
        </div>

        <TierBadge tierLevel={currentTier} size="md" />
      </div>

      {/* Hero Referral Code Card */}
      <div className="bg-stone-900 rounded-xl p-4 sm:p-5 text-white border border-stone-800 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-stone-300 uppercase tracking-wider">
            Your Unique Referral Code
          </span>
          <span className="px-2 py-0.5 rounded bg-stone-800 border border-stone-700 text-[11px] font-medium text-amber-400">
            +50 tokens per artisan
          </span>
        </div>

        {/* Code Display */}
        <div className="bg-stone-950 rounded-lg p-3 sm:p-4 border border-stone-800 text-center space-y-1">
          <span className="text-2xl font-bold tracking-widest text-amber-400 font-mono block select-all">
            {referralCode}
          </span>
          <p className="text-[11px] text-stone-400">
            New signup receives <strong className="text-stone-200">+25 tokens</strong> · You receive <strong className="text-stone-200">+50 tokens</strong>
          </p>
        </div>

        {/* Share & Copy Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleShare}
            id="share-referral-btn"
            className="h-10 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Invite</span>
          </button>

          <button
            onClick={handleCopy}
            id="copy-referral-btn"
            className="h-10 rounded-lg bg-stone-800 hover:bg-stone-700 text-white font-semibold text-xs border border-stone-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>
        </div>
      </div>

      {/* Tier Progress Bar */}
      <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">Current Tier</span>
            <h4 className="text-xs sm:text-sm font-bold text-stone-900">{tierInfo.name} ({referralCount} referrals)</h4>
          </div>

          {nextTier && (
            <div className="text-right">
              <span className="text-xs text-stone-700 font-semibold">
                Next: {nextTier.name}
              </span>
              <p className="text-[10px] text-stone-500">{needed} more referrals needed</p>
            </div>
          )}
        </div>

        {/* Visual Progress Track */}
        <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden relative">
          <div
            className="h-full bg-stone-900 transition-all duration-500 rounded-full"
            style={{
              width: `${Math.min(100, Math.max(10, (referralCount / (nextTier ? nextTier.minReferrals : 50)) * 100))}%`,
            }}
          />
        </div>

        <p className="text-[11px] text-stone-600 font-medium">
          Tier Benefit: <span className="font-semibold text-stone-900">{tierInfo.benefitHi}</span>
        </p>
      </div>

      {/* Referrals List */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm sm:text-base text-stone-900">
            Referral Network ({referrals.length})
          </h3>
          <span className="text-xs text-stone-500 font-medium">Status & Milestones</span>
        </div>

        <div className="space-y-2">
          {referrals.map((ref) => (
            <div
              key={ref.id}
              className="p-3 rounded-lg bg-stone-50 border border-stone-200 space-y-2 hover:border-stone-300 transition-colors"
            >
              {/* Person Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-stone-200 text-stone-700 font-semibold flex items-center justify-center text-xs">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-stone-900">{ref.referredName}</h4>
                    <span className="text-[10px] text-stone-500">
                      Joined: {new Date(ref.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-bold text-stone-800 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                  +{ref.totalEarned} tokens
                </span>
              </div>

              {/* Milestones list */}
              <div className="space-y-1 pt-0.5 text-xs">
                <div className="flex items-center justify-between text-stone-700 font-medium bg-white p-2 rounded border border-stone-200">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>First artisan registered</span>
                  </span>
                  <span className="font-bold text-stone-900">+25 tokens</span>
                </div>

                {ref.milestones.firstSaleCompleted ? (
                  <div className="flex items-center justify-between text-stone-700 font-medium bg-white p-2 rounded border border-stone-200">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>First craft sale completed</span>
                    </span>
                    <span className="font-bold text-stone-900">+50 tokens</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-stone-600 font-medium bg-stone-100 p-2 rounded border border-stone-200">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Awaiting first sale...</span>
                    </span>
                    <span className="text-[11px] text-stone-500 font-semibold">+50 pending</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total Earnings Breakdown */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-3">
        <h3 className="font-bold text-sm sm:text-base text-stone-900">
          Earnings Breakdown (कुल कमाई)
        </h3>

        <div className="space-y-1.5 text-xs sm:text-sm">
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-stone-50">
            <span className="text-stone-700 font-medium">From Referrals:</span>
            <span className="font-bold text-stone-900">{earningsFromReferrals} tokens</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-stone-50">
            <span className="text-stone-700 font-medium">From Craft Sales:</span>
            <span className="font-bold text-stone-900">{earningsFromSales} tokens</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-stone-100 border border-stone-200 font-bold text-xs sm:text-sm text-stone-900">
            <span>Total Token Balance:</span>
            <span>{totalEarnings} tokens (₹{totalEarnings})</span>
          </div>
        </div>

        <button
          onClick={onOpenTokens}
          className="w-full h-11 rounded-lg bg-stone-900 hover:bg-black text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>Open Token Dashboard & Redeem</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

