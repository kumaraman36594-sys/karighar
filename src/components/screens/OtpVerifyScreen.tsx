import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, AlertCircle, RefreshCw, CheckCircle2, ShieldCheck, KeyRound } from 'lucide-react';
import { Language } from '../../types';
import { getTranslation } from '../../utils/translations';
import { speak, stopSpeech } from '../../utils/speech';
import { AudioSpeakerButton } from '../common/AudioSpeakerButton';

interface OtpVerifyScreenProps {
  mobileNumber: string;
  language: Language;
  onBack: () => void;
  onVerified: () => void;
  isAudioMuted: boolean;
}

export const OtpVerifyScreen: React.FC<OtpVerifyScreenProps> = ({
  mobileNumber,
  language,
  onBack,
  onVerified,
  isAudioMuted,
}) => {
  const t = getTranslation(language);
  const [otp, setOtp] = useState<string[]>(['1', '2', '3', '4', '5', '6']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
    if (!isAudioMuted) {
      const timer = setTimeout(() => {
        speak('6 अंकों का OTP डालें', language);
      }, 350);
      return () => {
        clearTimeout(timer);
        stopSpeech();
      };
    }
  }, [language, isAudioMuted]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const verifyCode = (codeToTest: string) => {
    if (codeToTest === '123456') {
      setSuccess(true);
      setError('');
      if (!isAudioMuted) {
        speak('सत्यापित हो गया!', language);
      }
      setTimeout(() => {
        onVerified();
      }, 700);
    } else {
      setError('गलत OTP, फिर कोशिश करें (123456 इस्तेमाल करें)');
      if (!isAudioMuted) {
        speak('गलत OTP, फिर कोशिश करें', language);
      }
    }
  };

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every(d => d !== '') && newOtp.length === 6) {
      verifyCode(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleManualVerify = () => {
    verifyCode(otp.join(''));
  };

  const handleResend = () => {
    setOtp(['1', '2', '3', '4', '5', '6']);
    setError('');
    setCountdown(30);
    if (!isAudioMuted) {
      speak('OTP दोबारा भेजा गया। 123456 इस्तेमाल करें।', language);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#FDFBF7] flex flex-col justify-between p-3 sm:p-6 max-w-md w-full mx-auto">
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <button
            type="button"
            onClick={onBack}
            id="otp-back-btn"
            className="w-11 h-11 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-700 hover:bg-stone-50 transition-colors shadow-xs cursor-pointer"
            title="Back / पीछे जाएं"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900">
            कदम 2 / 2 (Step 2 of 2)
          </div>
        </div>

        {/* Title with Audio Speaker */}
        <div className="mb-5 flex items-start justify-between gap-3 bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#B4431E] shrink-0 mt-0.5">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 leading-tight">
                {t.enterOtp}
              </h1>
              <p className="text-xs text-stone-600 mt-1">
                कोड भेजा गया: <span className="font-bold text-stone-900">{mobileNumber}</span>
              </p>
            </div>
          </div>
          <AudioSpeakerButton
            text="6 अंकों का OTP कोड डालें जो आपके मोबाइल पर आया है।"
            language={language}
            size="md"
            variant="primary"
            title="शीर्षक सुनें"
            id="otp-hear-title-btn"
          />
        </div>

        {/* 6 OTP Boxes */}
        <div className="bg-white rounded-xl p-3 sm:p-5 border border-stone-200 shadow-xs mb-5">
          <div className="flex justify-between items-center gap-1 xs:gap-1.5 sm:gap-2.5 mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value.replace(/\D/g, ''))}
                onKeyDown={(e) => handleKeyDown(index, e)}
                id={`otp-box-${index}`}
                className={`flex-1 max-w-[48px] h-12 xs:h-13 sm:h-14 md:h-15 text-center text-lg sm:text-2xl font-extrabold rounded-lg border-2 transition-all cursor-pointer ${
                  success
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950'
                    : error
                    ? 'border-red-500 bg-red-50 text-red-900'
                    : digit
                    ? 'border-[#B4431E] bg-orange-50/50 text-stone-900'
                    : 'border-stone-200 bg-stone-50/50 focus:border-[#B4431E] focus:bg-white focus:outline-hidden'
                }`}
              />
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-1.5 text-xs text-red-700 font-bold mb-3 p-2.5 rounded-lg bg-red-50 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold mb-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-700" />
              <span>सत्यापित हो गया! (OTP Verified successfully)</span>
            </div>
          )}

          {/* Quick 1-click Demo Fill Hint */}
          <button
            type="button"
            onClick={() => {
              setOtp(['1', '2', '3', '4', '5', '6']);
              setError('');
            }}
            className="w-full min-h-[40px] p-2.5 rounded-lg bg-amber-50 hover:bg-amber-100/70 border border-amber-200 flex items-center justify-between text-xs text-amber-950 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#B4431E] shrink-0" />
              <span>डेमो कोड: <strong className="font-extrabold tracking-wider text-amber-950 text-sm">123456</strong></span>
            </div>
            <span className="font-bold text-[#B4431E] hover:underline text-xs">123456 भरें</span>
          </button>
        </div>

        {/* Resend Link with Countdown Timer */}
        <div className="text-center">
          {countdown > 0 ? (
            <p className="text-xs text-stone-500 font-medium">
              फिर से OTP भेजें ({countdown} सेकंड बाद)
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              id="resend-otp-btn"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#B4431E] hover:text-[#963717] transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{t.resendOtp}</span>
            </button>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-4">
        <button
          type="button"
          onClick={handleManualVerify}
          id="verify-otp-btn"
          className="w-full min-h-[52px] h-13 rounded-xl bg-[#B4431E] hover:bg-[#963717] text-white font-extrabold text-base shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98]"
        >
          <span>{t.verify}</span>
          <span>✓</span>
        </button>
      </div>
    </div>
  );
};
