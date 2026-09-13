import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Coins, Sparkles, ArrowRight } from 'lucide-react';
import { TOKEN_SPEND_OPTIONS, SpendOption } from '../../utils/tokenService';
import { Language } from '../../types';
import { speak } from '../../utils/speech';

interface TokenSpendModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokenBalance: number;
  language: Language;
  onSpend: (option: SpendOption) => void;
  isAudioMuted: boolean;
}

export const TokenSpendModal: React.FC<TokenSpendModalProps> = ({
  isOpen,
  onClose,
  tokenBalance,
  language,
  onSpend,
  isAudioMuted,
}) => {
  const [selectedOption, setSelectedOption] = useState<SpendOption | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');

  if (!isOpen) return null;

  const handleSelect = (option: SpendOption) => {
    if (tokenBalance < option.cost) {
      if (!isAudioMuted) {
        speak('पर्याप्त टोकन उपलब्ध नहीं हैं।', language);
      }
      return;
    }
    setSelectedOption(option);
  };

  const handleConfirmRedeem = () => {
    if (!selectedOption) return;
    if (tokenBalance < selectedOption.cost) return;

    onSpend(selectedOption);
    setSuccessMessage(`सफलतापूर्वक भुनाया गया: ${selectedOption.titleHi}`);
    if (!isAudioMuted) {
      speak(`${selectedOption.titleHi} सफलतापूर्वक भुनाया गया।`, language);
    }

    setTimeout(() => {
      setSuccessMessage('');
      setSelectedOption(null);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl">
              🎁
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">टोकन भुनाएं (Redeem Tokens)</h3>
              <p className="text-xs text-indigo-200">
                उपलब्ध बैलेंस: <strong className="text-amber-300 font-bold">{tokenBalance} टोकन</strong> (₹{tokenBalance})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success Alert */}
        {successMessage ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-gray-900">{successMessage}</h4>
            <p className="text-sm text-gray-600">
              आपके खाते से टोकन काट लिए गए हैं और सेवा तुरंत लागू कर दी गई है।
            </p>
          </div>
        ) : (
          <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1">
            <p className="text-xs text-gray-500 font-medium">
              अपनी पसंद का लाभ चुनें। टोकन आपके बैलेंस से स्वचालित रूप से कट जाएंगे।
            </p>

            <div className="space-y-2.5">
              {TOKEN_SPEND_OPTIONS.map((opt) => {
                const canAfford = tokenBalance >= opt.cost;
                const isSelected = selectedOption?.id === opt.id;

                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelect(opt)}
                    className={`p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/60 shadow-sm'
                        : canAfford
                        ? 'border-gray-200 hover:border-indigo-300 bg-white cursor-pointer'
                        : 'border-gray-100 bg-gray-50/60 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-900 flex items-center justify-center text-xl shrink-0">
                        {opt.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-sm text-gray-900 truncate">
                            {opt.titleHi}
                          </h4>
                          {opt.category === 'financial' && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                              नकद / छूट
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate">{opt.descHi}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-xs sm:text-sm font-black px-2.5 py-1 rounded-xl block ${
                        canAfford 
                          ? 'bg-amber-100 text-amber-950 border border-amber-300' 
                          : 'bg-gray-200 text-gray-500'
                      }`}>
                        🪙 {opt.cost} टोकन
                      </span>
                      {!canAfford && (
                        <span className="text-[10px] text-red-500 font-bold block mt-0.5">
                          कम टोकन
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Confirmation Area if selected */}
            {selectedOption && (
              <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-indigo-50 border border-indigo-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-700 font-semibold">चुना गया लाभ:</span>
                  <span className="text-xs font-bold text-indigo-900">{selectedOption.titleHi}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>कटने वाले टोकन:</span>
                  <span className="text-red-600 font-black">- {selectedOption.cost} टोकन</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold border-t border-indigo-200/60 pt-2">
                  <span>बचा हुआ बैलेंस:</span>
                  <span className="text-emerald-700 font-black">{tokenBalance - selectedOption.cost} टोकन</span>
                </div>

                <button
                  onClick={handleConfirmRedeem}
                  className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>पुष्टि करें और भुनाएं</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        {!successMessage && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">1 टोकन = ₹1 नकद मूल्य</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              रद्द करें
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
