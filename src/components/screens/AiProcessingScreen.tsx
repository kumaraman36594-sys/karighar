import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Cpu, 
  Scissors, 
  Wand2, 
  Layers, 
  Tag, 
  FileText, 
  CheckCircle2, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { Language } from '../../types';
import { speak } from '../../utils/speech';

interface AiProcessingScreenProps {
  language: Language;
  photoUrl: string;
  onComplete: () => void;
  isAudioMuted: boolean;
}

const AI_STEPS = [
  { icon: Search, label: 'Inspecting craft photograph...', hi: 'उत्पाद की फोटो की जाँच की जा रही है...' },
  { icon: Cpu, label: 'Identifying material, technique & heritage category...', hi: 'शिल्प और सामग्री की पहचान हो रही है...' },
  { icon: Scissors, label: 'Cleaning background & studio lighting...', hi: 'फोटो का बैकग्राउंड साफ़ किया जा रहा है...' },
  { icon: Wand2, label: 'Enhancing artisanal texture & color depth...', hi: 'उत्पाद के रंग और बारीकियाँ निखारी जा रही हैं...' },
  { icon: Layers, label: 'Calibrating multi-angle 3D view...', hi: '3D दृश्य तैयार किया जा रहा है...' },
  { icon: Tag, label: 'Benchmarking regional market prices...', hi: 'स्थानीय बाज़ार की सही कीमतों का मिलान हो रहा है...' },
  { icon: FileText, label: 'Generating authentic craft description...', hi: 'आकर्षक शीर्षक और विवरण लिखा जा रहा है...' },
  { icon: CheckCircle2, label: 'Finalizing draft for your review...', hi: 'बस तैयार है...' },
];

export const AiProcessingScreen: React.FC<AiProcessingScreenProps> = ({
  language,
  photoUrl,
  onComplete,
  isAudioMuted,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (!isAudioMuted && currentStepIndex === 0) {
      speak('एआई आपकी फोटो की जांच कर रहा है और बाज़ार के दाम देख रहा है।', language);
    }
  }, [currentStepIndex, isAudioMuted, language]);

  useEffect(() => {
    if (currentStepIndex < AI_STEPS.length - 1) {
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
  }, [currentStepIndex, onComplete]);

  const currentStep = AI_STEPS[currentStepIndex];
  const StepIcon = currentStep.icon;
  const progressPercent = Math.round(((currentStepIndex + 1) / AI_STEPS.length) * 100);

  return (
    <div className="min-h-screen bg-stone-900 text-white flex flex-col items-center justify-center p-4 sm:p-6 select-none relative overflow-hidden">
      <div className="relative z-10 max-w-md w-full flex flex-col items-center text-center space-y-6">
        {/* Photo with Scanning Grid Animation */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-xl overflow-hidden border-2 border-amber-500/40 shadow-2xl bg-stone-950 group">
          <img
            src={photoUrl}
            alt="Craft Scanning"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* Subtle scanning laser bar */}
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-pulse top-1/2" />
          <div className="absolute top-2 right-2 bg-stone-900/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-amber-300 flex items-center gap-1 border border-stone-700">
            <ShieldCheck className="w-3 h-3" />
            <span>AI SCAN {progressPercent}%</span>
          </div>
        </div>

        {/* Step Icon & Spinner */}
        <div className="relative w-14 h-14 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-3 border-stone-700 border-t-amber-500 animate-spin" />
          <StepIcon className="w-6 h-6 text-amber-400" />
        </div>

        {/* Status Text */}
        <div className="min-h-[64px] flex flex-col items-center justify-center space-y-1">
          <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
            {currentStep.label}
          </h2>
          <p className="text-xs text-stone-400 font-medium">
            {currentStep.hi}
          </p>
        </div>

        {/* Step Progress Indicators */}
        <div className="w-full max-w-xs bg-stone-800 rounded-full h-2 overflow-hidden border border-stone-700">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Local artisan market comparison in progress</span>
        </div>
      </div>
    </div>
  );
};
