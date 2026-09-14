import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  Cpu, 
  Crop, 
  Box, 
  IndianRupee, 
  FileText, 
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { Language } from '../../types';
import { speak } from '../../utils/speech';
import { getTranslation } from '../../utils/translations';

interface AiProcessingScreenProps {
  language: Language;
  photoUrl: string;
  onComplete: () => void;
  isAudioMuted: boolean;
}

export const AiProcessingScreen: React.FC<AiProcessingScreenProps> = ({
  language,
  photoUrl,
  onComplete,
  isAudioMuted,
}) => {
  const t = getTranslation(language);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = [
    { icon: Search, label: t.aiStep1 },
    { icon: Cpu, label: t.aiStep2 },
    { icon: Crop, label: t.aiStep3 },
    { icon: Sparkles, label: t.aiStep4 },
    { icon: Box, label: t.aiStep5 },
    { icon: IndianRupee, label: t.aiStep6 },
    { icon: FileText, label: t.aiStep7 },
    { icon: CheckCircle2, label: t.aiStep8 },
  ];

  useEffect(() => {
    if (!isAudioMuted && currentStepIndex === 0) {
      speak('एआई आपकी फोटो की जांच कर रहा है और बाज़ार के दाम देख रहा है।', language);
    }
  }, [currentStepIndex, isAudioMuted, language]);

  useEffect(() => {
    if (currentStepIndex < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, 650);
      return () => clearTimeout(timer);
    } else {
      const finishTimer = setTimeout(() => {
        onComplete();
      }, 800);
      return () => clearTimeout(finishTimer);
    }
  }, [currentStepIndex, onComplete, steps.length]);

  const progressPercent = Math.round(((currentStepIndex + 1) / steps.length) * 100);
  const currentStep = steps[currentStepIndex];
  const StepIcon = currentStep.icon;

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center p-4 select-none">
      <div className="max-w-sm w-full bg-white rounded-xl border border-stone-200 shadow-xs p-6 flex flex-col items-center text-center">
        {/* Photo preview */}
        <div className="relative w-36 h-36 rounded-lg overflow-hidden border border-stone-200 bg-stone-100 mb-5">
          <img
            src={photoUrl}
            alt="Processing craft"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Step Indicator */}
        <div className="w-10 h-10 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-800 mb-3">
          <StepIcon className="w-5 h-5 text-stone-900" />
        </div>

        {/* Status Text */}
        <div className="min-h-[58px] flex flex-col items-center justify-center">
          <h2 className="text-base font-bold text-stone-900">
            {currentStep.label}
          </h2>
        </div>

        {/* Linear Progress Bar */}
        <div className="w-full bg-stone-100 rounded-full h-2 p-0.5 border border-stone-200 overflow-hidden my-4">
          <div
            className="bg-stone-900 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Details Footer */}
        <div className="flex justify-between items-center w-full text-xs text-stone-500 font-medium">
          <span className="flex items-center gap-1.5">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-stone-700" />
            {t.processingStep} {currentStepIndex + 1} {t.ofStep} {steps.length}
          </span>
          <span className="font-bold text-stone-800">{progressPercent}%</span>
        </div>
      </div>
    </div>
  );
};

