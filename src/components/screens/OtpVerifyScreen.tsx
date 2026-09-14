import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, AlertCircle, RefreshCw, CheckCircle2, ShieldCheck, KeyRound, Check } from 'lucide-react';
import { Language } from '../../types';
import { getTranslation } from '../../utils/translations';
import { speak, stopSpeech } from '../../services/voiceService';
import { AudioSpeakerButton } from '../common/AudioSpeakerButton';

interface OtpVerifyScreenProps {
  mobileNumber: string;
  language: Language;
  onBack: () => void;
  onVerified: () => void;
  isAudioMuted?: boolean;
}

export const OtpVerifyScreen: React.FC<OtpVerifyScreenProps> = ({
  mobileNumber,
  language,
  onBack,
  onVerified,
  isAudioMuted = false,
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
        speak('6 अंकों का OTP कोड डालें। Enter 6-digit OTP.', language);
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
    console.log('Verifying OTP code:', codeToTest);
    if (codeToTest === '123456') {
      setSuccess(true);
      setError('');
      if (!isAudioMuted) {
        speak('सत्यापित हो गया! OTP verified successfully.', language);
      }
      setTimeout(() => {
        onVerified();
      }, 600);
    } else {
      setError('गलत OTP, कृपया 123456 इस्तेमाल करें (Use 123456)');
      if (!isAudioMuted) {
        speak('गलत OTP, कृपया 123456 इस्तेमाल करें', language);
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

    if (newOtp.every((d) => d !== '') && newOtp.length === 6) {
      verifyCode(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleManualVerify = () => {
    console.log('Button clicked:', 'verify-otp-btn');
    verifyCode(otp.join(''));
  };

  const handleResend = () => {
    console.log('Button clicked:', 'resend-otp-btn');
    setOtp(['1', '2', '3', '4', '5', '6']);
    setError('');
    setCountdown(30);
    if (!isAudioMuted) {
      speak('OTP दोबारा भेजा गया। डेमो कोड 123456 है।', language);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between p-4 sm:p-6 max-w-md mx-auto font-sans">
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <button
            type="button"
            onClick={() => {
              console.log('Button clicked:', 'otp-back');
              onBack();
            }}
            id="otp-back-btn"
            className="min-h-[44px] min-w-[44px] rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center text-[#111827] hover:bg-stone-100 transition-colors shadow-xs cursor-pointer"
            title="Back / पीछे जाएं"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="px-3 py-1 rounded-full bg-[#F3F4F6] text-xs font-semibold text-[#4B5563]">
            कदम 2 / 2 (Step 2 of 2)
          </div>
        </div>

        {/* Title with Audio Speaker */}
        <div className="mb-4 flex items-start justify-between gap-3 bg-[#F9FAFB] p-4 rounded-lg border border-[#E5E7EB]">
          <div>
            <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-[#FF6B35] mb-2">
              <KeyRound className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#111827] leading-tight">
              {t.enterOtp || 'OTP दर्ज करें'}
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
              6-अंकों का कोड भेजा गया: <span className="font-bold text-[#111827]">{mobileNumber}</span>
            </p>
          </div>
          <AudioSpeakerButton
            text="6 अंकों का OTP कोड डालें जो आपके मोबाइल पर आया है।"
            language={language}
            size="md"
            variant="primary"
            title="शीर्षक सुनें"
            id="otp-hear-title-btn"
            className="min-h-[44px] min-w-[44px] bg-[#FF6B35] text-white hover:bg-[#E05A2B] rounded-lg cursor-pointer shrink-0"
          />
        </div>

        {/* 6 OTP Boxes */}
        <div className="bg-white rounded-lg p-4 sm:p-5 border border-[#E5E7EB] shadow-xs mb-4">
          <div className="flex justify-between gap-2 mb-3.5">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value.replace(/\D/g, ''))}
                onKeyDown={(e) => handleKeyDown(index, e)}
                id={`otp-box-${index}`}
                className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold rounded-lg border transition-colors cursor-pointer ${
                  success
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                    : error
                    ? 'border-red-500 bg-red-50 text-red-900 animate-shake'
                    : digit
                    ? 'border-[#FF6B35] bg-orange-50/20 text-[#111827]'
                    : 'border-[#D1D5DB] bg-[#F9FAFB] focus:border-[#FF6B35] focus:outline-hidden'
                }`}
              />
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium mb-3 p-2.5 rounded-lg bg-red-50 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium mb-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>सत्यापित हो गया! (OTP Verified successfully)</span>
            </div>
          )}

          {/* Quick 1-click Demo Fill Hint */}
          <button
            type="button"
            onClick={() => {
              console.log('Button clicked:', 'autofill-demo-otp');
              setOtp(['1', '2', '3', '4', '5', '6']);
              setError('');
            }}
            id="btn-autofill-otp"
            className="w-full min-h-[44px] p-2.5 rounded-lg bg-[#F9FAFB] hover:bg-orange-50/50 border border-[#E5E7EB] hover:border-[#FF6B35] flex items-center justify-between text-xs text-[#374151] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#FF6B35] shrink-0" />
              <span>डेमो कोड: <strong className="font-bold tracking-wider text-[#111827]">123456</strong></span>
            </div>
            <span className="font-semibold text-[#FF6B35] text-xs">123456 भरें</span>
          </button>
        </div>

        {/* Resend Link with Countdown Timer */}
        <div className="text-center">
          {countdown > 0 ? (
            <p className="text-xs text-[#6B7280] font-medium">
              फिर से OTP भेजें ({countdown} सेकंड बाद)
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              id="resend-otp-btn"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF6B35] hover:text-[#E05A2B] transition-colors cursor-pointer py-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t.resendOtp || 'OTP फिर से भेजें'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-3 pb-2">
        <button
          type="button"
          onClick={handleManualVerify}
          id="verify-otp-btn"
          className="w-full min-h-[50px] rounded-lg bg-[#FF6B35] hover:bg-[#E05A2B] text-white font-bold text-sm sm:text-base shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <span>{t.verify || 'सत्यापित करें'}</span>
          <Check className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
