import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShieldCheck, Loader2, ArrowRight, Smartphone } from 'lucide-react';
import { Language } from '../../types';
import { getTranslation } from '../../utils/translations';
import { speak, stopSpeech } from '../../services/voiceService';
import { AudioSpeakerButton } from '../common/AudioSpeakerButton';

interface SellerLoginScreenProps {
  language: Language;
  onBack: () => void;
  onSendOtp: (mobile: string) => void;
  isAudioMuted?: boolean;
}

export const SellerLoginScreen: React.FC<SellerLoginScreenProps> = ({
  language,
  onBack,
  onSendOtp,
  isAudioMuted = false,
}) => {
  const t = getTranslation(language);
  const [mobileNumber, setMobileNumber] = useState('9876543210');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAudioMuted) {
      const timer = setTimeout(() => {
        speak('अपना मोबाइल नंबर डालें। Enter your mobile number.', language);
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
    console.log('Button clicked:', `keypad-${digit}`);
    playClickFeedback();
    if (mobileNumber.length < 10) {
      setMobileNumber((prev) => prev + digit);
      setError('');
    }
  };

  const handleBackspace = () => {
    console.log('Button clicked:', 'keypad-backspace');
    playClickFeedback();
    setMobileNumber((prev) => prev.slice(0, -1));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    console.log('Button clicked:', 'send-otp-btn');
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
    <div className="min-h-screen bg-white flex flex-col justify-between p-4 sm:p-6 max-w-md mx-auto font-sans">
      {/* Top Header with Back Button */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-4">
          <button
            type="button"
            onClick={() => {
              console.log('Button clicked:', 'seller-login-back');
              onBack();
            }}
            id="seller-login-back-btn"
            className="min-h-[44px] min-w-[44px] rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center text-[#111827] hover:bg-stone-100 transition-colors shadow-xs cursor-pointer"
            title="Back / पीछे जाएं"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="px-3 py-1 rounded-full bg-[#F3F4F6] text-xs font-semibold text-[#4B5563]">
            कदम 1 / 2 (Step 1 of 2)
          </div>
        </div>

        {/* Title with Audio Speaker */}
        <div className="mb-4 flex items-start justify-between gap-3 bg-[#F9FAFB] p-4 rounded-lg border border-[#E5E7EB]">
          <div>
            <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-[#FF6B35] mb-2">
              <Smartphone className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#111827] leading-tight">
              {t.loginTitle || 'मोबाइल नंबर दर्ज करें'}
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
              {t.loginSubtitle || 'सत्यापन के लिए OTP भेजा जाएगा'}
            </p>
          </div>
          <AudioSpeakerButton
            text="अपना 10 अंकों का मोबाइल नंबर डालें। हम आपको OTP भेजेंगे।"
            language={language}
            size="md"
            variant="primary"
            title="शीर्षक सुनें"
            id="login-hear-title-btn"
            className="min-h-[44px] min-w-[44px] bg-[#FF6B35] text-white hover:bg-[#E05A2B] rounded-lg cursor-pointer shrink-0"
          />
        </div>

        {/* Large Input Field */}
        <div className="bg-white rounded-lg p-4 border border-[#E5E7EB] shadow-xs mb-3">
          <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">
            मोबाइल नंबर (Mobile Number)
          </label>
          <div className="flex items-center gap-2.5 border border-[#D1D5DB] focus-within:border-[#FF6B35] rounded-lg px-3 py-2 bg-[#F9FAFB] min-h-[52px] transition-colors">
            <span className="text-base font-bold text-[#111827] shrink-0">
              +91
            </span>
            <span className="text-[#D1D5DB] font-light text-xl">|</span>
            <input
              type="tel"
              maxLength={10}
              value={mobileNumber}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                if (val.length <= 10) setMobileNumber(val);
              }}
              placeholder="00000 00000"
              className="w-full text-xl font-bold tracking-wider text-[#111827] focus:outline-hidden bg-transparent placeholder:text-[#9CA3AF]"
            />
          </div>
          {error && <p className="text-xs text-red-600 mt-2 font-medium">{error}</p>}

          {/* Quick autofill demo button */}
          <button
            type="button"
            onClick={() => {
              console.log('Button clicked:', 'autofill-demo-mobile');
              setMobileNumber('9876543210');
            }}
            id="btn-autofill-mobile"
            className="mt-2.5 w-full min-h-[44px] p-2.5 rounded-lg bg-[#F9FAFB] hover:bg-orange-50/50 border border-[#E5E7EB] hover:border-[#FF6B35] flex items-center justify-between text-xs text-[#374151] transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#FF6B35] shrink-0" />
              <span>{t.demoHint || 'डेमो के लिए OTP 123456 इस्तेमाल करें'}</span>
            </div>
            <span className="font-semibold text-xs shrink-0 text-[#FF6B35]">ऑटो-भरें</span>
          </button>
        </div>

        {/* Tactile Keypad */}
        <div className="grid grid-cols-3 gap-2 my-3">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleKeypadPress(digit)}
              id={`keypad-digit-${digit}`}
              className="min-h-[50px] rounded-lg bg-white hover:bg-orange-50/40 active:bg-orange-100 border border-[#E5E7EB] hover:border-[#FF6B35] text-xl font-bold text-[#111827] shadow-xs flex items-center justify-center transition-colors cursor-pointer select-none"
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              console.log('Button clicked:', 'keypad-clear');
              playClickFeedback();
              setMobileNumber('');
            }}
            id="keypad-clear-btn"
            className="min-h-[50px] rounded-lg bg-[#F9FAFB] hover:bg-stone-200 border border-[#E5E7EB] text-xs font-semibold text-[#4B5563] shadow-xs flex items-center justify-center transition-colors cursor-pointer select-none"
          >
            हटाएं (Clear)
          </button>
          <button
            type="button"
            onClick={() => handleKeypadPress('0')}
            id="keypad-digit-0"
            className="min-h-[50px] rounded-lg bg-white hover:bg-orange-50/40 active:bg-orange-100 border border-[#E5E7EB] hover:border-[#FF6B35] text-xl font-bold text-[#111827] shadow-xs flex items-center justify-center transition-colors cursor-pointer select-none"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleBackspace}
            id="keypad-del-btn"
            className="min-h-[50px] rounded-lg bg-[#F9FAFB] hover:bg-stone-200 border border-[#E5E7EB] text-xs font-semibold text-[#4B5563] shadow-xs flex items-center justify-center transition-colors cursor-pointer select-none"
          >
            मिटाएं (Del)
          </button>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-3 pb-2">
        <button
          type="button"
          onClick={() => handleSubmit()}
          disabled={isLoading || mobileNumber.length !== 10}
          id="send-otp-btn"
          className="w-full min-h-[50px] rounded-lg bg-[#FF6B35] hover:bg-[#E05A2B] disabled:opacity-40 text-white font-bold text-sm sm:text-base shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>OTP भेजा जा रहा है...</span>
            </>
          ) : (
            <>
              <span>{t.sendOtp || 'OTP भेजें'}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
