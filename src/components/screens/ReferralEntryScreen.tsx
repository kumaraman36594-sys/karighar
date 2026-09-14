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
      setStatusMessage('Please enter a referral code');
      if (!isAudioMuted) speak('कृपया रेफरल कोड दर्ज करें', language);
      return;
    }

    const isValid = TokenService.validateReferralCode(fullCode);
    if (isValid) {
      setValidationState('valid');
      setStatusMessage('Code applied! +25 bonus tokens added');
      if (!isAudioMuted) {
        speak('कोड सफलतापूर्वक लागू हुआ! आपको 25 टोकन मिले।', language);
      }
      setTimeout(() => {
        onApplyCode(fullCode);
      }, 900);
    } else {
      setValidationState('invalid');
      setStatusMessage('Invalid code (Format: KARIGHAR-RAMESH-123)');
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
    <div className="min-h-screen bg-stone-100 flex flex-col justify-between p-4 sm:p-5 max-w-lg mx-auto select-none py-5">
      {/* Top Header & Back */}
      <div className="space-y-4">
        <button
          onClick={onBack}
          id="referral-back-btn"
          className="w-9 h-9 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-stone-700 shadow-xs hover:bg-stone-50 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* Gift Icon & Heading */}
        <div className="text-center space-y-2 px-2">
          <div className="w-12 h-12 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center mx-auto shadow-xs">
            <Gift className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                Have a Referral Code?
              </h1>
              <AudioSpeakerButton
                text="क्या आपके पास रेफरल कोड है? अगर किसी कारीगर ने आपको बुलाया है, उनका कोड यहाँ डालें और पच्चीस टोकन पाएं।"
                language={language}
                size="sm"
              />
            </div>
            <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto">
              If an artisan or Mitra invited you, enter their code to receive welcome tokens
            </p>
          </div>
        </div>

        {/* Card Input Container */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-stone-700">
              Referral Code (रेफरल कोड)
            </label>
            <AudioSpeakerButton
              text="रेफरल कोड दर्ज करें या बोलकर बताएं"
              language={language}
              size="sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center rounded-lg border border-stone-300 bg-stone-50 focus-within:border-stone-900 focus-within:bg-white overflow-hidden transition-colors">
              <span className="px-3 py-2.5 bg-stone-100 text-stone-700 font-bold text-xs select-none border-r border-stone-200 shrink-0">
                KARIGHAR-
              </span>
              <input
                type="text"
                value={codeSuffix}
                onChange={handleSuffixChange}
                placeholder="RAMESH-123"
                autoCapitalize="characters"
                id="referral-code-input"
                className="flex-1 px-3 py-2.5 text-xs sm:text-sm font-bold tracking-wider text-stone-900 focus:outline-hidden uppercase placeholder:text-stone-400 bg-transparent"
              />
            </div>
            <VoiceInputButton
              language={language}
              onTranscript={(val) => {
                const cleaned = val.toUpperCase().replace(/\s+/g, '').replace(/^KARIGHAR-?/, '');
                setCodeSuffix(cleaned);
              }}
              size="md"
            />
          </div>

          {/* Validation Feedback */}
          {statusMessage && (
            <div
              className={`p-2.5 rounded-lg flex items-center gap-2 text-xs font-medium ${
                validationState === 'valid'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {validationState === 'valid' ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
              )}
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Preset Suggestions for quick testing */}
          <div className="pt-2 border-t border-stone-100 space-y-1.5">
            <span className="text-[11px] text-stone-500 font-medium block">
              Quick Test Codes:
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
                  className="px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-[11px] border border-stone-200 transition-colors cursor-pointer"
                >
                  +{preset}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Incentive Highlight */}
        <div className="bg-stone-50 rounded-lg p-3 border border-stone-200 text-center flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-stone-600 shrink-0" />
          <p className="text-xs text-stone-700">
            Applying an active referral code grants <strong className="font-semibold text-stone-900">+25 initial tokens</strong>
          </p>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="space-y-2 pt-4">
        <button
          onClick={handleApply}
          id="apply-referral-btn"
          className="w-full h-11 rounded-lg bg-stone-900 hover:bg-black text-white font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
        >
          <span>Apply Code (कोड लागू करें)</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onSkip}
          id="skip-referral-btn"
          className="w-full h-10 rounded-lg bg-white hover:bg-stone-50 text-stone-600 font-medium text-xs border border-stone-200 transition-colors cursor-pointer flex items-center justify-center"
        >
          Skip for now (छोड़ें)
        </button>
      </div>
    </div>
  );
};

