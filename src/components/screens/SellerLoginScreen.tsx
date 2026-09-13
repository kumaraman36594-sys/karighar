import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShieldCheck, Loader2, ArrowRight, Smartphone } from 'lucide-react';
import { Language } from '../../types';
import { getTranslation } from '../../utils/translations';
import { speak, stopSpeech } from '../../utils/speech';
import { AudioSpeakerButton } from '../common/AudioSpeakerButton';

interface SellerLoginScreenProps {
  language: Language;
  onBack: () => void;
  onSendOtp: (mobile: string) => void;
  isAudioMuted: boolean;
}

export const SellerLoginScreen: React.FC<SellerLoginScreenProps> = ({
  language,
  onBack,
  onSendOtp,
  isAudioMuted,
}) => {
  const t = getTranslation(language);
  const [mobileNumber, setMobileNumber] = useState('9876543210');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAudioMuted) {
      const timer = setTimeout(() => {
        speak('अपना मोबाइल नंबर डालें।', language);
      }, 350);
      return () => {
        clearTimeout(timer);
        stopSpeech();
      };
    }
  }, [language, isAudioMuted]);

  const playClickFeedback = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch {
      // Audio context may not be allowed until user gesture
    }
  };

  const handleKeypadPress = (digit: string) => {
    playClickFeedback();
    if (mobileNumber.length < 10) {
      setMobileNumber(prev => prev + digit);
      setError('');
    }
  };

  const handleBackspace = () => {
    playClickFeedback();
    setMobileNumber(prev => prev.slice(0, -1));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (mobileNumber.length !== 10) {
      setError('कृपया 10 अंकों का मोबाइल नंबर डालें (Please enter 10 digits)');
      if (!isAudioMuted) {
        speak('कृपया 10 अंकों का सही मोबाइल नंबर दर्ज करें', language);
      }
      return;
    }

    setIsLoading(true);
    if (!isAudioMuted) {
      speak('OTP भेजा गया। डेमो कोड 123456 है।', language);
    }

    setTimeout(() => {
      setIsLoading(false);
      onSendOtp(`+91 ${mobileNumber}`);
    }, 600);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#FDFBF7] flex flex-col justify-between p-3 sm:p-6 max-w-md w-full mx-auto">
      {/* Top Header with Back */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-4 sm:mb-5">
          <button
            type="button"
            onClick={onBack}
            id="seller-login-back-btn"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-700 hover:bg-stone-50 transition-colors shadow-xs cursor-pointer"
            title="Back / पीछे जाएं"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900">
            कदम 1 / 2 (Step 1 of 2)
          </div>
        </div>

        {/* Title with Audio Speaker */}
        <div className="mb-4 sm:mb-5 flex items-start justify-between gap-2.5 sm:gap-3 bg-white p-3.5 sm:p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#B4431E] shrink-0 mt-0.5">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-extrabold text-stone-900 leading-tight">
                {t.loginTitle}
              </h1>
              <p className="text-[11px] sm:text-xs text-stone-600 mt-0.5 sm:mt-1">
                {t.loginSubtitle}
              </p>
            </div>
          </div>
          <AudioSpeakerButton
            text="अपना 10 अंकों का मोबाइल नंबर डालें। हम आपको OTP भेजेंगे।"
            language={language}
            size="md"
            variant="primary"
            title="शीर्षक सुनें"
            id="login-hear-title-btn"
            className="shrink-0"
          />
        </div>

        {/* Input Field */}
        <div className="bg-white rounded-xl p-3.5 sm:p-5 border border-stone-200 shadow-xs mb-3 sm:mb-4">
          <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">
            मोबाइल नंबर (Mobile Number)
          </label>
          <div className="flex items-center gap-2 sm:gap-3 border-2 border-stone-300 focus-within:border-[#B4431E] rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 bg-stone-50/50 h-13 sm:h-14 transition-colors">
            <span className="text-base sm:text-lg font-extrabold text-stone-900 flex items-center gap-1 shrink-0">
              🇮🇳 +91
            </span>
            <span className="text-stone-300 font-light text-lg sm:text-xl">|</span>
            <input
              type="tel"
              maxLength={10}
              value={mobileNumber}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                if (val.length <= 10) setMobileNumber(val);
              }}
              placeholder="00000 00000"
              className="w-full text-lg sm:text-xl font-extrabold tracking-wider text-stone-900 focus:outline-hidden bg-transparent placeholder:text-stone-300 min-w-0"
            />
          </div>
          {error && <p className="text-xs text-red-600 mt-2 font-medium">{error}</p>}

          {/* Quick autofill demo button */}
          <button
            type="button"
            onClick={() => setMobileNumber('9876543210')}
            className="mt-3 w-full min-h-[40px] p-2.5 rounded-lg bg-amber-50 hover:bg-amber-100/80 border border-amber-200 flex items-center justify-between text-xs text-amber-900 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#B4431E] shrink-0" />
              <span className="font-semibold">{t.demoHint}</span>
            </div>
            <span className="font-bold text-xs text-[#B4431E] hover:underline shrink-0">ऑटो-भरें</span>
          </button>
        </div>

        {/* Tactile Big Numeric Keypad */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 my-2 sm:my-3">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleKeypadPress(digit)}
              className="min-h-[48px] h-12 rounded-xl bg-white hover:bg-amber-50/50 active:bg-amber-100/60 border border-stone-200 text-lg sm:text-xl font-bold text-stone-800 shadow-xs flex items-center justify-center transition-all cursor-pointer select-none active:scale-95"
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              playClickFeedback();
              setMobileNumber('');
            }}
            className="min-h-[48px] h-12 rounded-xl bg-stone-100 hover:bg-stone-200 active:bg-stone-300 border border-stone-200 text-[11px] sm:text-xs font-bold text-stone-600 shadow-xs flex items-center justify-center transition-all cursor-pointer select-none"
          >
            हटाएं
          </button>
          <button
            type="button"
            onClick={() => handleKeypadPress('0')}
            className="min-h-[48px] h-12 rounded-xl bg-white hover:bg-amber-50/50 active:bg-amber-100/60 border border-stone-200 text-lg sm:text-xl font-bold text-stone-800 shadow-xs flex items-center justify-center transition-all cursor-pointer select-none active:scale-95"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleBackspace}
            className="min-h-[48px] h-12 rounded-xl bg-stone-100 hover:bg-stone-200 active:bg-stone-300 border border-stone-200 text-xs sm:text-sm font-bold text-stone-700 shadow-xs flex items-center justify-center transition-all cursor-pointer select-none"
          >
            ⌫ मिटाएं
          </button>
        </div>
      </div>

      {/* Full-width Action Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => handleSubmit()}
          disabled={isLoading || mobileNumber.length !== 10}
          id="send-otp-btn"
          className="w-full min-h-[52px] h-13 rounded-xl bg-[#B4431E] hover:bg-[#963717] disabled:opacity-50 text-white font-extrabold text-base shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>OTP भेजा जा रहा है...</span>
            </>
          ) : (
            <>
              <span>{t.sendOtp}</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
