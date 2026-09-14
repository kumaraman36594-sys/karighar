import React, { useState } from 'react';
import { X, CheckCircle2, Coins, ArrowRight, Gift } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] border border-stone-200">
        {/* Header */}
        <div className="px-5 py-3.5 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-stone-800 text-amber-400 flex items-center justify-center">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">टोकन भुनाएं (Redeem Tokens)</h3>
              <p className="text-xs text-stone-300">
                उपलब्ध बैलेंस: <strong className="text-amber-400 font-bold">{tokenBalance} टोकन</strong> (₹{tokenBalance})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success Alert */}
        {successMessage ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-stone-900">{successMessage}</h4>
            <p className="text-xs text-stone-600">
              आपके खाते से टोकन काट लिए गए हैं और सेवा तुरंत लागू कर दी गई है।
            </p>
          </div>
        ) : (
          <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
            <p className="text-xs text-stone-500 font-medium">
              अपनी पसंद का लाभ चुनें। टोकन आपके बैलेंस से स्वचालित रूप से कट जाएंगे।
            </p>

            <div className="space-y-2">
              {TOKEN_SPEND_OPTIONS.map((opt) => {
                const canAfford = tokenBalance >= opt.cost;
                const isSelected = selectedOption?.id === opt.id;

                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelect(opt)}
                    className={`p-3 rounded-lg border transition-colors flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-stone-900 bg-stone-50'
                        : canAfford
                        ? 'border-stone-200 hover:border-stone-400 bg-white cursor-pointer'
                        : 'border-stone-100 bg-stone-50/60 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-md bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 border border-stone-200">
                        <Coins className="w-4 h-4 text-amber-600" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs sm:text-sm text-stone-900 truncate">
                            {opt.titleHi}
                          </h4>
                          {opt.category === 'financial' && (
                            <span className="text-[10px] bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                              नकद / छूट
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500 truncate">{opt.descHi}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-xs font-bold px-2 py-1 rounded-md block ${
                        canAfford 
                          ? 'bg-amber-50 text-amber-900 border border-amber-300' 
                          : 'bg-stone-100 text-stone-400'
                      }`}>
                        {opt.cost} टोकन
                      </span>
                      {!canAfford && (
                        <span className="text-[10px] text-red-600 font-semibold block mt-0.5">
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
              <div className="mt-3 p-3.5 rounded-lg bg-stone-50 border border-stone-200 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-600">चुना गया लाभ:</span>
                  <span className="font-bold text-stone-900">{selectedOption.titleHi}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-600">कटने वाले टोकन:</span>
                  <span className="text-red-600 font-bold">- {selectedOption.cost} टोकन</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold border-t border-stone-200 pt-2">
                  <span className="text-stone-700">बचा हुआ बैलेंस:</span>
                  <span className="text-emerald-700">{tokenBalance - selectedOption.cost} टोकन</span>
                </div>

                <button
                  onClick={handleConfirmRedeem}
                  className="w-full h-10 rounded-md bg-stone-900 hover:bg-black text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>पुष्टि करें और भुनाएं</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        {!successMessage && (
          <div className="px-5 py-2.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs">
            <span className="text-stone-500 font-medium">1 टोकन = ₹1 नकद मूल्य</span>
            <button
              onClick={onClose}
              className="px-3 py-1 rounded-md border border-stone-300 text-stone-700 hover:bg-stone-100 cursor-pointer"
            >
              रद्द करें
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

