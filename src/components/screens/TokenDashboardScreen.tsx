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
  ArrowRight
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
    setToastMessage(`सफलतापूर्वक भुनाया गया: ${option.titleHi}!`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24 p-3 sm:p-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 inset-x-0 z-50 flex justify-center pointer-events-none px-4 animate-fade-in">
          <div className="bg-emerald-600 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs sm:text-sm font-bold flex items-center gap-2 border border-white/20">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Screen Header: 💰 आपके टोकन */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
            <span>💰 आपके टोकन (Your Tokens)</span>
          </h1>
          <p className="text-xs text-gray-500">
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
              onClick={onOpenReferrals}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold transition-colors cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              <span>रेफरल देखें</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Big Token Card */}
      <div className="bg-gradient-to-br from-indigo-700 via-purple-700 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden space-y-5">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 text-xs font-extrabold text-amber-300 backdrop-blur-md mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>कारीगर प्रोत्साहन टोकन (Karighar Tokens)</span>
          </div>

          <div className="text-5xl sm:text-6xl font-black text-amber-300 drop-shadow-md tracking-tight">
            {tokenBalance}
          </div>
          <div className="text-sm font-bold text-indigo-200 uppercase tracking-widest">
            कुल टोकन (Total Tokens)
          </div>
        </div>

        {/* 3 Stats Row: 🏆 टियर | 👥 रेफरल | 💵 मूल्य */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/20 text-center">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-white/15">
            <span className="text-[10px] sm:text-xs text-indigo-200 font-semibold block">🏆 टियर</span>
            <span className="text-xs sm:text-sm font-black text-white flex items-center justify-center gap-1 mt-0.5">
              <span>{tierInfo.emoji}</span>
              <span className="truncate">{tierInfo.name}</span>
            </span>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-white/15">
            <span className="text-[10px] sm:text-xs text-indigo-200 font-semibold block">👥 रेफरल</span>
            <span className="text-xs sm:text-sm font-black text-white block mt-0.5">
              {referralCount}
            </span>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-white/15">
            <span className="text-[10px] sm:text-xs text-indigo-200 font-semibold block">💵 मूल्य</span>
            <span className="text-xs sm:text-sm font-black text-amber-300 block mt-0.5">
              ₹{tokenBalance}
            </span>
          </div>
        </div>

        <p className="text-center text-[11px] text-indigo-200 font-medium">
          ₹1 = 1 टोकन नकद मूल्य • सीधे UPI / बैंक में ट्रांसफर या छूट प्राप्त करें
        </p>
      </div>

      {/* ─── हाल की गतिविधि ─── */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base sm:text-lg text-gray-900 flex items-center gap-2">
            <span>📜 हाल की गतिविधि (Recent Activity)</span>
          </h3>
          <span className="text-xs text-gray-500 font-semibold">इतिहास</span>
        </div>

        <div className="space-y-2">
          {transactions.slice(0, 7).map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/90 border border-gray-100 hover:border-indigo-200 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                  tx.type === 'debit' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {tx.type === 'debit' ? '🎁' : tx.source === 'referral' ? '🤝' : '✅'}
                </div>
                <div>
                  <p className="font-bold text-xs sm:text-sm text-gray-900">
                    {tx.description}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {new Date(tx.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <span className={`text-xs sm:text-sm font-black px-2 py-0.5 rounded-lg ${
                tx.type === 'debit' 
                  ? 'text-purple-700 bg-purple-50' 
                  : 'text-emerald-700 bg-emerald-50'
              }`}>
                {tx.type === 'debit' ? `-${tx.amount}` : `+${tx.amount}`} 🪙
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── टोकन कैसे इस्तेमाल करें ─── */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-gray-900 flex items-center gap-2">
              <span>🎁 टोकन कैसे इस्तेमाल करें (Spend Options)</span>
            </h3>
            <p className="text-xs text-gray-500">
              टोकन से लिस्टिंग दृश्यता बढ़ाएं, फोटो सुधारें या नकद निकालें
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          {TOKEN_SPEND_OPTIONS.map((item) => {
            const canAfford = tokenBalance >= item.cost;

            return (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl border border-gray-200 hover:border-indigo-400 transition-all flex items-center justify-between gap-3 bg-white"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center text-xl shrink-0">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs sm:text-sm text-gray-900 truncate">
                      {item.titleHi}
                    </h4>
                    <p className="text-[11px] text-gray-500 truncate">
                      {item.descHi}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs sm:text-sm font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-xl">
                    {item.cost} टोकन
                  </span>
                  <button
                    onClick={() => handleSpend(item)}
                    disabled={!canAfford}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs transition-colors cursor-pointer"
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
          onClick={() => setIsSpendModalOpen(true)}
          id="open-redeem-modal-btn"
          className="w-full h-14 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:opacity-95 text-white font-extrabold text-base shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
        >
          <span>टोकन भुनाएं (Redeem Tokens)</span>
          <ArrowRight className="w-5 h-5" />
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
