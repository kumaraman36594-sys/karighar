import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, AlertCircle, RefreshCw, CheckCircle2, ShieldCheck } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/40 via-white to-purple-50/30 flex flex-col justify-between p-4 sm:p-6 max-w-md mx-auto">
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <button
            type="button"
            onClick={onBack}
            id="otp-back-btn"
            className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors shadow-xs cursor-pointer"
            title="Back / पीछे जाएं"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-700">
            कदम 2 / 2 (Step 2 of 2)
          </div>
        </div>

        {/* Title with Audio Speaker */}
        <div className="mb-6 flex items-start justify-between gap-3 bg-indigo-50/60 p-4 rounded-2xl border border-indigo-100">
          <div>
            <div className="text-3xl mb-1">🔐</div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
              {t.enterOtp}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              6-अंकों का कोड भेजा गया: <span className="font-bold text-indigo-900">{mobileNumber}</span>
            </p>
          </div>
          <AudioSpeakerButton
            text="6 अंकों का OTP कोड डालें जो आपके मोबाइल पर आया है।"
            language={language}
            size="lg"
            variant="primary"
            title="शीर्षक सुनें"
            id="otp-hear-title-btn"
          />
        </div>

        {/* 6 Large OTP Boxes (64x64px each) */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-indigo-200 shadow-md shadow-indigo-100/40 mb-5">
          <div className="flex justify-between gap-2 sm:gap-2.5 mb-4">
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
                className={`w-12 h-16 sm:w-14 sm:h-16 text-center text-2xl sm:text-3xl font-extrabold rounded-2xl border-2 transition-all cursor-pointer ${
                  success
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm shadow-emerald-100'
                    : error
                    ? 'border-red-500 bg-red-50 text-red-900 animate-shake'
                    : digit
                    ? 'border-indigo-600 bg-indigo-50/60 text-indigo-950 shadow-sm shadow-indigo-100'
                    : 'border-gray-200 bg-gray-50/50 focus:border-indigo-600 focus:bg-white focus:outline-hidden'
                }`}
              />
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-1.5 text-xs text-red-600 font-bold mb-3 p-2.5 rounded-xl bg-red-50 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold mb-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
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
            className="w-full min-h-[44px] p-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100/70 border border-indigo-100 flex items-center justify-between text-xs text-indigo-950 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>डेमो कोड: <strong className="font-extrabold tracking-wider text-indigo-900 text-sm">123456</strong></span>
            </div>
            <span className="font-bold underline text-indigo-600 text-xs">123456 भरें</span>
          </button>
        </div>

        {/* Resend Link with Countdown Timer */}
        <div className="text-center">
          {countdown > 0 ? (
            <p className="text-sm text-gray-500 font-medium">
              फिर से OTP भेजें ({countdown} सेकंड बाद)
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              id="resend-otp-btn"
              className="inline-flex items-center gap-1.5 text-base font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{t.resendOtp}</span>
            </button>
          )}
        </div>
      </div>

      {/* Action Button (56px height) */}
      <div className="pt-4">
        <button
          type="button"
          onClick={handleManualVerify}
          id="verify-otp-btn"
          className="w-full min-h-[56px] h-14 rounded-2xl bg-[#667eea] hover:bg-[#5a67d8] text-white font-extrabold text-lg shadow-xl shadow-indigo-200 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98]"
        >
          <span>{t.verify}</span>
          <span>✓</span>
        </button>
      </div>
    </div>
  );
};
