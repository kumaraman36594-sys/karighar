import React, { useState, useEffect } from 'react';
import { ArrowLeft, Gift, CheckCircle2, XCircle, Sparkles, ArrowRight } from 'lucide-react';
import { Language } from '../../types';
import { TokenService } from '../../utils/tokenService';
import { speak } from '../../utils/speech';
import { AudioSpeakerButton } from '../common/AudioSpeakerButton';
import { VoiceInputButton } from '../common/VoiceInputButton';

interface ReferralEntryScreenProps {
  language: Language;
  isAudioMuted: boolean;
  onBack: () => void;
  onApplyCode: (code: string) => void;
  onSkip: () => void;
}

export const ReferralEntryScreen: React.FC<ReferralEntryScreenProps> = ({
  language,
  isAudioMuted,
  onBack,
  onApplyCode,
  onSkip,
}) => {
  const [codeSuffix, setCodeSuffix] = useState<string>('RAMESH-123');
  const [validationState, setValidationState] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');

  useEffect(() => {
    if (!isAudioMuted) {
      speak('यदि किसी ने आपको कारीगर पर आमंत्रित किया है, तो उनका रेफरल कोड दर्ज करें और 25 टोकन प्राप्त करें।', language);
    }
  }, [language, isAudioMuted]);

  const fullCode = `KARIGHAR-${codeSuffix.trim().toUpperCase()}`;

  const handleApply = () => {
    if (!codeSuffix.trim()) {
      setValidationState('invalid');
      setStatusMessage('कृपया रेफरल कोड दर्ज करें');
      if (!isAudioMuted) speak('कृपया रेफरल कोड दर्ज करें', language);
      return;
    }

    const isValid = TokenService.validateReferralCode(fullCode);
    if (isValid) {
      setValidationState('valid');
      setStatusMessage('कोड लागू! +25 टोकन जोड़े गए');
      if (!isAudioMuted) {
        speak('कोड सफलतापूर्वक लागू हुआ! आपको 25 टोकन मिले।', language);
      }
      setTimeout(() => {
        onApplyCode(fullCode);
      }, 900);
    } else {
      setValidationState('invalid');
      setStatusMessage('गलत कोड (उदाहरण: KARIGHAR-RAMESH-123)');
      if (!isAudioMuted) {
        speak('गलत रेफरल कोड। कृपया पुनः जाँचें।', language);
      }
    }
  };

  const handleSuffixChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.toUpperCase();
    if (val.startsWith('KARIGHAR-')) {
      val = val.replace('KARIGHAR-', '');
    }
    setCodeSuffix(val);
    setValidationState('idle');
    setStatusMessage('');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between p-4 sm:p-6 max-w-lg mx-auto">
      {/* Top Header & Back */}
      <div className="space-y-6 pt-2">
        <button
          onClick={onBack}
          id="referral-back-btn"
          className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-700 shadow-xs hover:bg-stone-50 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Gift Icon & Heading */}
        <div className="text-center space-y-3 px-2">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-[#B4431E] border border-amber-300 flex items-center justify-center mx-auto shadow-sm">
            <Gift className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              रेफरल कोड है?
            </h1>
            <p className="text-sm text-stone-600 max-w-sm mx-auto leading-relaxed">
              अगर किसी कारीगर साथी ने आपको आमंत्रित किया है, तो उनका कोड दर्ज कर बोनस टोकन पाएं।
            </p>
          </div>
        </div>

        {/* Card Input Container */}
        <div className="bg-white rounded-xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
          <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider">
            रेफरल कोड दर्ज करें (Enter Code)
          </label>

          <div className="flex items-center rounded-xl border-2 border-stone-200 bg-stone-50 focus-within:border-[#B4431E] focus-within:bg-white overflow-hidden transition-all">
            <span className="px-3.5 py-3.5 bg-stone-100 text-stone-800 font-bold text-xs sm:text-sm select-none border-r border-stone-200 shrink-0">
              KARIGHAR-
            </span>
            <input
              type="text"
              value={codeSuffix}
              onChange={handleSuffixChange}
              placeholder="RAMESH-123"
              autoCapitalize="characters"
              id="referral-code-input"
              className="flex-1 px-3 py-3.5 text-base sm:text-lg font-bold tracking-wider text-stone-900 focus:outline-hidden uppercase placeholder:text-stone-400"
            />
          </div>

          {/* Validation Feedback */}
          {statusMessage && (
            <div
              className={`p-3 rounded-lg flex items-center gap-2 text-xs sm:text-sm font-bold animate-fade-in ${
                validationState === 'valid'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {validationState === 'valid' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Preset Suggestions for quick testing */}
          <div className="pt-2 border-t border-stone-100 space-y-2">
            <span className="text-[11px] text-stone-500 font-medium block">
              परीक्षण के लिए उपलब्ध रेफरल कोड (Tap to test):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {['RAMESH-123', 'PRIYA-456', 'AJAY-789'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setCodeSuffix(preset);
                    setValidationState('idle');
                    setStatusMessage('');
                  }}
                  className="px-2.5 py-1 rounded-md bg-stone-100 hover:bg-[#B4431E]/10 text-stone-700 hover:text-[#B4431E] font-semibold text-xs border border-stone-200 transition-colors"
                >
                  +{preset}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Incentive Highlight */}
        <div className="bg-amber-50/80 rounded-xl p-3.5 border border-amber-200/80 text-center flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
          <p className="text-xs sm:text-sm font-semibold text-amber-900">
            सफल रेफरल पर आपको <span className="text-[#B4431E] font-bold">+25 टोकन</span> मिलेंगे
          </p>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="space-y-3 pt-6">
        <button
          onClick={handleApply}
          id="apply-referral-btn"
          className="w-full h-12 rounded-xl bg-[#B4431E] hover:bg-[#9C3818] text-white font-bold text-sm sm:text-base shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
        >
          <span>कोड लागू करें (Apply Code)</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onSkip}
          id="skip-referral-btn"
          className="w-full h-11 rounded-xl bg-white hover:bg-stone-50 text-stone-600 font-semibold text-xs sm:text-sm border border-stone-200 transition-colors cursor-pointer flex items-center justify-center"
        >
          छोड़ें (Skip)
        </button>
      </div>
    </div>
  );
};
