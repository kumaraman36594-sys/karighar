import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, CheckCircle2 } from 'lucide-react';
import { Language } from '../../types';
import { speak } from '../../utils/speech';

interface AiProcessingScreenProps {
  language: Language;
  photoUrl: string;
  onComplete: () => void;
  isAudioMuted: boolean;
}

const AI_STEPS = [
  { icon: '🔍', label: 'Analyzing product image...', hi: 'उत्पाद की फोटो की जाँच की जा रही है...' },
  { icon: '🧠', label: 'Understanding material and category...', hi: 'शिल्प और सामग्री की पहचान हो रही है...' },
  { icon: '✂️', label: 'Removing background...', hi: 'फोटो का बैकग्राउंड साफ़ किया जा रहा है...' },
  { icon: '✨', label: 'Enhancing details...', hi: 'उत्पाद के रंग और बारीकियाँ निखारी जा रही हैं...' },
  { icon: '🎨', label: 'Creating 3D view...', hi: '3D दृश्य तैयार किया जा रहा है...' },
  { icon: '💰', label: 'Looking up local market prices...', hi: 'स्थानीय बाज़ार की सही कीमतों का मिलान हो रहा है...' },
  { icon: '✍️', label: 'Generating title and description...', hi: 'आकर्षक शीर्षक और विवरण लिखा जा रहा है...' },
  { icon: '✅', label: 'Almost ready...', hi: 'बस तैयार है...' },
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
      }, 650); // 650ms per step as per spec (approx 600ms)
      return () => clearTimeout(timer);
    } else {
      const finishTimer = setTimeout(() => {
        onComplete();
      }, 800);
      return () => clearTimeout(finishTimer);
    }
  }, [currentStepIndex, onComplete]);

  const progressPercent = Math.round(((currentStepIndex + 1) / AI_STEPS.length) * 100);
  const currentStep = AI_STEPS[currentStepIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-950 to-purple-950 text-white flex flex-col items-center justify-center p-6 select-none relative overflow-hidden">
      {/* Glow circles */}
      <div className="absolute w-72 h-72 rounded-full bg-indigo-500/20 blur-3xl -top-10 -left-10 pointer-events-none" />
      <div className="absolute w-72 h-72 rounded-full bg-purple-500/20 blur-3xl -bottom-10 -right-10 pointer-events-none" />

      <div className="relative z-10 max-w-sm w-full flex flex-col items-center text-center">
        {/* Thumbnail with scanning effect */}
        <div className="relative w-44 h-44 rounded-3xl overflow-hidden border-2 border-indigo-400/40 shadow-2xl mb-8 group">
          <img
            src={photoUrl}
            alt="Processing"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* Scanning line animation */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/40 to-transparent animate-pulse" />
          <div className="absolute inset-0 border border-white/20 rounded-3xl" />
        </div>

        {/* Custom Animated Brand Spinner */}
        <div className="relative w-16 h-16 mb-6">
          <div className="w-16 h-16 rounded-full border-4 border-indigo-400/30 border-t-amber-400 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-xl">
            {currentStep.icon}
          </div>
        </div>

        {/* Status Text */}
        <div className="min-h-[70px] flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold text-white tracking-wide transition-all duration-300">
            {currentStep.label}
          </h2>
          <p className="text-sm text-indigo-200 mt-1 font-medium">
            {currentStep.hi}
          </p>
        </div>

        {/* Step dots */}
        <div className="flex items-center gap-1.5 my-6">
          {AI_STEPS.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx <= currentStepIndex 
                  ? 'w-6 bg-gradient-to-r from-amber-400 to-emerald-400' 
                  : 'w-1.5 bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Progress Bar (0-100%) */}
        <div className="w-full bg-white/10 rounded-full h-3 p-0.5 border border-white/15 overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 h-full rounded-full transition-all duration-500 shadow-xs"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between w-full text-xs text-indigo-300 font-semibold mt-2">
          <span>AI Vision & Price Engine</span>
          <span>{progressPercent}%</span>
        </div>
      </div>
    </div>
  );
};
