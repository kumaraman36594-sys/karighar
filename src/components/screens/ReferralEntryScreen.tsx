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
      setStatusMessage('❌ कृपया रेफरल कोड दर्ज करें');
      if (!isAudioMuted) speak('कृपया रेफरल कोड दर्ज करें', language);
      return;
    }

    const isValid = TokenService.validateReferralCode(fullCode);
    if (isValid) {
      setValidationState('valid');
      setStatusMessage('✅ कोड लागू! +25 टोकन');
      if (!isAudioMuted) {
        speak('कोड सफलतापूर्वक लागू हुआ! आपको 25 टोकन मिले।', language);
      }
      setTimeout(() => {
        onApplyCode(fullCode);
      }, 900);
    } else {
      setValidationState('invalid');
      setStatusMessage('❌ गलत कोड (उदाहरण: KARIGHAR-RAMESH-123)');
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
    <div className="min-h-screen bg-gradient-to-b from-[#f8f9fe] to-[#eef1fa] flex flex-col justify-between p-4 sm:p-6 max-w-lg mx-auto">
      {/* Top Header & Back */}
      <div className="space-y-6 pt-2">
        <button
          onClick={onBack}
          id="referral-back-btn"
          className="w-11 h-11 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-gray-700 shadow-xs hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Gift Icon & Heading */}
        <div className="text-center space-y-3 px-2">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-500 text-white flex items-center justify-center mx-auto text-4xl shadow-xl shadow-amber-200/60 animate-bounce">
            🎁
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              रेफरल कोड है?
            </h1>
            <p className="text-sm sm:text-base text-gray-600 max-w-sm mx-auto leading-relaxed">
              अगर किसी ने आपको बुलाया है, उनका कोड डालें और टोकन पाएं
            </p>
          </div>
        </div>

        {/* Card Input Container */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-md space-y-4">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
            रेफरल कोड दर्ज करें (Enter Code)
          </label>

          <div className="flex items-center rounded-2xl border-2 border-indigo-200 bg-gray-50/80 focus-within:border-indigo-600 focus-within:bg-white overflow-hidden transition-all shadow-inner">
            <span className="px-3.5 py-4 bg-indigo-100 text-indigo-900 font-black text-sm sm:text-base select-none border-r border-indigo-200 shrink-0">
              KARIGHAR-
            </span>
            <input
              type="text"
              value={codeSuffix}
              onChange={handleSuffixChange}
              placeholder="RAMESH-123"
              autoCapitalize="characters"
              id="referral-code-input"
              className="flex-1 px-3 py-4 text-base sm:text-lg font-black tracking-wider text-gray-900 focus:outline-hidden uppercase placeholder:text-gray-400"
            />
          </div>

          {/* Validation Feedback */}
          {statusMessage && (
            <div
              className={`p-3 rounded-xl flex items-center gap-2 text-xs sm:text-sm font-bold animate-fade-in ${
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
          <div className="pt-2 border-t border-gray-100 space-y-2">
            <span className="text-[11px] text-gray-500 font-semibold block">
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
                  className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition-colors"
                >
                  +{preset}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Incentive Highlight */}
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-center flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <p className="text-xs sm:text-sm font-bold text-amber-900">
            सफल रेफरल पर आपको <span className="text-amber-700 underline font-black">+25 टोकन</span> मिलेंगे
          </p>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="space-y-3 pt-6">
        <button
          onClick={handleApply}
          id="apply-referral-btn"
          className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-base shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
        >
          <span>कोड लागू करें (Apply Code)</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <button
          onClick={onSkip}
          id="skip-referral-btn"
          className="w-full h-12 rounded-2xl bg-white hover:bg-gray-100 text-gray-600 font-bold text-sm border border-gray-200 transition-colors cursor-pointer flex items-center justify-center"
        >
          छोड़ें (Skip)
        </button>
      </div>
    </div>
  );
};
