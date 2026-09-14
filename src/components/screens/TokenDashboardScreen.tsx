import React, { useState } from 'react';
import { 
  Award, 
  Sparkles, 
  TrendingUp, 
  Gift, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Package, 
  Truck, 
  Layers,
  CheckCircle2,
  Users,
  Coins,
  ChevronRight,
  ArrowRight,
  Receipt,
  CreditCard
} from 'lucide-react';
import { TokenTransaction, Language } from '../../types';
import { TRANSLATIONS } from '../../utils/translations';
import { TokenService, TOKEN_SPEND_OPTIONS, SpendOption } from '../../utils/tokenService';
import { TierBadge } from '../common/TierBadge';
import { TokenSpendModal } from '../common/TokenSpendModal';
import { speak } from '../../utils/speech';
import { AudioSpeakerButton } from '../common/AudioSpeakerButton';

interface TokenDashboardScreenProps {
  tokenBalance: number;
  transactions: TokenTransaction[];
  language: Language;
  referralCount?: number;
  referralTier?: number;
  onRedeemTokens: (cost: number, perkTitle: string) => void;
  onOpenReferrals?: () => void;
  isAudioMuted: boolean;
}

export const TokenDashboardScreen: React.FC<TokenDashboardScreenProps> = ({
  tokenBalance,
  transactions,
  language,
  referralCount = 7,
  referralTier = 1,
  onRedeemTokens,
  onOpenReferrals,
  isAudioMuted,
}) => {
  const t = TRANSLATIONS[language];
  const [isSpendModalOpen, setIsSpendModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const currentTier = TokenService.calculateTier(referralCount);
  const tierInfo = TokenService.getTierInfo(currentTier);

  const handleSpend = (option: SpendOption) => {
    onRedeemTokens(option.cost, option.titleHi);
    setToastMessage(`Redeemed: ${option.titleHi}!`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-20 p-3 sm:p-5 select-none">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 inset-x-0 z-50 flex justify-center pointer-events-none px-4 animate-fade-in">
          <div className="bg-stone-900 text-white px-3.5 py-2 rounded-lg shadow-md text-xs font-semibold flex items-center gap-2 border border-stone-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Screen Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
            <Coins className="w-4 h-4 text-stone-700" />
            <span>Your Tokens (टोकन डैशबोर्ड)</span>
          </h1>
          <p className="text-xs text-stone-500">
            Artisan incentives and village growth rewards
          </p>
        </div>

        <div className="flex items-center gap-2">
          <AudioSpeakerButton
            text={`आपके पास कुल ${tokenBalance} टोकन हैं, जिनका नकद मूल्य ₹${tokenBalance} है।`}
            language={language}
            size="sm"
          />
          {onOpenReferrals && (
            <button
              onClick={onOpenReferrals}
              className="flex items-center gap-1.5 px-3 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Referrals</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Token Card */}
      <div className="bg-stone-900 rounded-xl p-5 text-white border border-stone-800 relative space-y-4 shadow-xs">
        <div className="text-center space-y-1">
          <span className="inline-block px-2.5 py-0.5 rounded bg-stone-800 text-[11px] font-medium text-amber-400 border border-stone-700">
            Karighar Artisan Token
          </span>

          <div className="text-4xl sm:text-5xl font-bold text-amber-400 tracking-tight">
            {tokenBalance}
          </div>
          <div className="text-xs text-stone-400 uppercase tracking-wider font-semibold">
            Total Available Balance
          </div>
        </div>

        {/* 3 Stats Row: Tier | Referrals | Value */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-800 text-center">
          <div className="bg-stone-950 rounded-lg p-2.5 border border-stone-800">
            <span className="text-[10px] text-stone-400 font-semibold block uppercase">Tier</span>
            <span className="text-xs sm:text-sm font-bold text-stone-200 block mt-0.5 truncate">
              {tierInfo.name}
            </span>
          </div>

          <div className="bg-stone-950 rounded-lg p-2.5 border border-stone-800">
            <span className="text-[10px] text-stone-400 font-semibold block uppercase">Referrals</span>
            <span className="text-xs sm:text-sm font-bold text-stone-200 block mt-0.5">
              {referralCount}
            </span>
          </div>

          <div className="bg-stone-950 rounded-lg p-2.5 border border-stone-800">
            <span className="text-[10px] text-stone-400 font-semibold block uppercase">Cash Value</span>
            <span className="text-xs sm:text-sm font-bold text-amber-400 block mt-0.5">
              ₹{tokenBalance}
            </span>
          </div>
        </div>

        <p className="text-center text-[11px] text-stone-400 font-medium">
          1 Token = ₹1 Cash Equivalent • Direct transfer or listing discounts
        </p>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm sm:text-base text-stone-900 flex items-center gap-1.5">
            <Receipt className="w-4 h-4 text-stone-600" />
            <span>Recent Activity (हाल की गतिविधि)</span>
          </h3>
          <span className="text-xs text-stone-500 font-medium">History</span>
        </div>

        <div className="space-y-1.5">
          {transactions.slice(0, 7).map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-2.5 rounded-lg bg-stone-50 border border-stone-200"
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold shrink-0 ${
                  tx.type === 'debit' 
                    ? 'bg-stone-200 text-stone-700' 
                    : 'bg-stone-200 text-stone-900'
                }`}>
                  {tx.type === 'debit' ? (
                    <ArrowDownLeft className="w-3.5 h-3.5 text-stone-600" />
                  ) : (
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-xs text-stone-900">
                    {tx.description}
                  </p>
                  <p className="text-[10px] text-stone-400">
                    {new Date(tx.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                tx.type === 'debit' 
                  ? 'text-stone-700 bg-stone-200' 
                  : 'text-stone-900 bg-stone-100 border border-stone-200'
              }`}>
                {tx.type === 'debit' ? `-${tx.amount}` : `+${tx.amount}`} tokens
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Spend Options */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-stone-900">
              Redemption Options (टोकन इस्तेमाल करें)
            </h3>
            <p className="text-xs text-stone-500">
              Boost listing visibility, improve photos, or request payouts
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {TOKEN_SPEND_OPTIONS.map((item) => {
            const canAfford = tokenBalance >= item.cost;

            return (
              <div
                key={item.id}
                className="p-3 rounded-lg border border-stone-200 hover:border-stone-300 transition-colors flex items-center justify-between gap-3 bg-white"
              >
                <div className="min-w-0">
                  <h4 className="font-bold text-xs sm:text-sm text-stone-900 truncate">
                    {item.titleHi}
                  </h4>
                  <p className="text-[11px] text-stone-500 truncate">
                    {item.descHi}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold text-stone-800 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                    {item.cost} tokens
                  </span>
                  <button
                    onClick={() => handleSpend(item)}
                    disabled={!canAfford}
                    className="h-7 px-3 rounded bg-stone-900 hover:bg-black disabled:opacity-40 text-white font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Redeem
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Big Action */}
        <button
          onClick={() => setIsSpendModalOpen(true)}
          id="open-redeem-modal-btn"
          className="w-full h-11 rounded-lg bg-stone-900 hover:bg-black text-white font-semibold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>Redeem Tokens (टोकन भुनाएं)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Spend Modal */}
      <TokenSpendModal
        isOpen={isSpendModalOpen}
        onClose={() => setIsSpendModalOpen(false)}
        tokenBalance={tokenBalance}
        language={language}
        onSpend={handleSpend}
        isAudioMuted={isAudioMuted}
      />
    </div>
  );
};

