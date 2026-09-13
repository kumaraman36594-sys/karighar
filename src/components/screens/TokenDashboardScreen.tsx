import React, { useState } from 'react';
import { 
  Award, 
  Sparkles, 
  TrendingUp, 
  Gift, 
  CheckCircle2, 
  Users, 
  Coins, 
  History, 
  Wallet, 
  Trophy, 
  ArrowRight,
  ArrowDownRight,
  ArrowUpRight
} from 'lucide-react';
import { TokenTransaction, Language } from '../../types';
import { TRANSLATIONS } from '../../utils/translations';
import { TokenService, TOKEN_SPEND_OPTIONS, SpendOption } from '../../utils/tokenService';
import { TokenSpendModal } from '../common/TokenSpendModal';
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
    setToastMessage(`सफलतापूर्वक भुनाया गया: ${option.titleHi}!`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 space-y-4 sm:space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 inset-x-0 z-50 flex justify-center pointer-events-none px-4 animate-fade-in">
          <div className="bg-emerald-700 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs sm:text-sm font-bold flex items-center gap-2 border border-white/20">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Screen Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 flex items-center gap-2">
            <Coins className="w-6 h-6 text-[#B4431E]" />
            <span>आपके टोकन (Your Tokens)</span>
          </h1>
          <p className="text-xs text-stone-500 font-medium mt-0.5">
            कारीगर प्रोत्साहन एवं विकास रिवॉर्ड प्रोग्राम
          </p>
        </div>

        <div className="flex items-center gap-2">
          <AudioSpeakerButton
            text={`आपके पास कुल ${tokenBalance} टोकन हैं, जिनका नकद मूल्य ₹${tokenBalance} है।`}
            language={language}
            isMuted={isAudioMuted}
            size="sm"
          />
          {onOpenReferrals && (
            <button
              type="button"
              onClick={onOpenReferrals}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-[#B4431E] border border-orange-200 text-xs font-bold transition-colors cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              <span>रेफरल देखें</span>
            </button>
          )}
        </div>
      </div>

      {/* Responsive Two-Column Grid on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* Left Column (5 cols): Main Token Card + Spend Options */}
        <div className="lg:col-span-5 space-y-4 sm:space-y-6">
          {/* Main Big Token Card */}
          <div className="bg-gradient-to-br from-[#963717] via-[#B4431E] to-[#782c0f] rounded-xl p-4 sm:p-7 text-white shadow-md relative overflow-hidden space-y-4 sm:space-y-5">
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 text-xs font-bold text-amber-200 backdrop-blur-xs mb-1 sm:mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>कारीगर प्रोत्साहन टोकन (Karighar Tokens)</span>
              </div>

              <div className="text-4xl sm:text-6xl font-black text-amber-300 drop-shadow-xs tracking-tight">
                {tokenBalance}
              </div>
              <div className="text-[11px] sm:text-xs font-bold text-amber-100 uppercase tracking-widest">
                कुल टोकन (Total Tokens)
              </div>
            </div>

            {/* 3 Stats Row */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-3 border-t border-white/20 text-center">
              <div className="bg-black/20 backdrop-blur-xs rounded-lg p-1.5 sm:p-2.5 border border-white/10">
                <span className="text-[10px] text-amber-100 font-semibold flex items-center justify-center gap-1">
                  <Trophy className="w-3 h-3" /> टियर
                </span>
                <span className="text-xs font-bold text-white flex items-center justify-center gap-1 mt-0.5 truncate">
                  {tierInfo.name}
                </span>
              </div>

              <div className="bg-black/20 backdrop-blur-xs rounded-lg p-1.5 sm:p-2.5 border border-white/10">
                <span className="text-[10px] text-amber-100 font-semibold flex items-center justify-center gap-1">
                  <Users className="w-3 h-3" /> रेफरल
                </span>
                <span className="text-xs font-bold text-white block mt-0.5">
                  {referralCount}
                </span>
              </div>

              <div className="bg-black/20 backdrop-blur-xs rounded-lg p-1.5 sm:p-2.5 border border-white/10">
                <span className="text-[10px] text-amber-100 font-semibold flex items-center justify-center gap-1">
                  <Wallet className="w-3 h-3" /> मूल्य
                </span>
                <span className="text-xs font-bold text-amber-300 block mt-0.5">
                  ₹{tokenBalance}
                </span>
              </div>
            </div>

            <p className="text-center text-[10px] sm:text-[11px] text-amber-100/90 font-medium">
              ₹1 = 1 टोकन नकद मूल्य • सीधे UPI / बैंक में ट्रांसफर या छूट प्राप्त करें
            </p>
          </div>

          {/* टोकन कैसे इस्तेमाल करें */}
          <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs space-y-4">
            <div>
              <h3 className="font-extrabold text-base text-stone-900 flex items-center gap-2">
                <Gift className="w-4 h-4 text-[#B4431E]" />
                <span>टोकन कैसे इस्तेमाल करें (Spend Options)</span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                टोकन से लिस्टिंग दृश्यता बढ़ाएं, फोटो सुधारें या नकद निकालें
              </p>
            </div>

            <div className="space-y-2.5">
              {TOKEN_SPEND_OPTIONS.map((item) => {
                const canAfford = tokenBalance >= item.cost;

                return (
                  <div
                    key={item.id}
                    className="p-3 rounded-lg border border-stone-200 hover:border-amber-300 transition-colors flex items-center justify-between gap-3 bg-stone-50/40"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#B4431E] flex items-center justify-center text-base shrink-0 border border-orange-100">
                        {item.icon}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs text-stone-900 truncate">
                          {item.titleHi}
                        </h4>
                        <p className="text-[11px] text-stone-500 truncate">
                          {item.descHi}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-bold text-amber-950 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        {item.cost} टोकन
                      </span>
                      <button
                        type="button"
                        onClick={() => handleSpend(item)}
                        disabled={!canAfford}
                        className="px-2.5 py-1 rounded-md bg-[#B4431E] hover:bg-[#963717] disabled:opacity-40 text-white font-bold text-xs transition-colors cursor-pointer"
                      >
                        भुनाएं
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Big Action: [टोकन भुनाएं] */}
            <button
              type="button"
              onClick={() => setIsSpendModalOpen(true)}
              id="open-redeem-modal-btn"
              className="w-full min-h-[48px] h-12 rounded-xl bg-[#B4431E] hover:bg-[#963717] text-white font-extrabold text-sm shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>टोकन भुनाएं (Redeem Tokens)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column (7 cols): हाल की गतिविधि */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-extrabold text-base sm:text-lg text-stone-900 flex items-center gap-2">
                <History className="w-5 h-5 text-[#B4431E]" />
                <span>हाल की गतिविधि (Recent Activity)</span>
              </h3>
              <span className="text-xs text-stone-500 font-semibold">इतिहास</span>
            </div>

            <div className="space-y-2.5">
              {transactions.slice(0, 10).map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-stone-50 border border-stone-150 hover:border-amber-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                      tx.type === 'debit' 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {tx.type === 'debit' ? (
                        <ArrowDownRight className="w-4 h-4 text-amber-700" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 text-emerald-700" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-xs sm:text-sm text-stone-900">
                        {tx.description}
                      </p>
                      <p className="text-[11px] text-stone-400">
                        {new Date(tx.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <span className={`text-xs sm:text-sm font-extrabold px-2.5 py-0.5 rounded-md ${
                    tx.type === 'debit' 
                      ? 'text-amber-800 bg-amber-50 border border-amber-200' 
                      : 'text-emerald-800 bg-emerald-50 border border-emerald-200'
                  }`}>
                    {tx.type === 'debit' ? `-${tx.amount}` : `+${tx.amount}`} टोकन
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
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
