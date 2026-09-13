import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Sparkles, Check, X } from 'lucide-react';
import { Language } from '../../types';
import { VoiceRecognizer, isSttSupported, speak } from '../../utils/speech';

interface VoiceInputButtonProps {
  language?: Language;
  onResult: (text: string) => void;
  currentValue?: string;
  placeholderTitle?: string;
  presets?: string[];
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  id?: string;
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  language = 'hi',
  onResult,
  currentValue = '',
  placeholderTitle = 'बोलकर लिखें',
  presets = [],
  size = 'md',
  className = '',
  id,
}) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [showPresetsMenu, setShowPresetsMenu] = useState<boolean>(false);
  const [interimText, setInterimText] = useState<string>('');
  const recognizerRef = useRef<VoiceRecognizer | null>(null);

  useEffect(() => {
    return () => {
      if (recognizerRef.current) {
        recognizerRef.current.stop();
      }
    };
  }, []);

  const handleStartListening = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isListening) {
      if (recognizerRef.current) {
        recognizerRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    if (!isSttSupported()) {
      setShowPresetsMenu(true);
      speak('बोलने की सुविधा उपलब्ध नहीं है, कृपया विकल्प चुनें।', language as Language);
      return;
    }

    try {
      const recognizer = new VoiceRecognizer();
      recognizerRef.current = recognizer;
      setIsListening(true);
      setInterimText('');

      recognizer.start(
        (transcript, isFinal) => {
          setInterimText(transcript);
          if (isFinal) {
            setIsListening(false);
            setInterimText('');
            if (transcript && transcript.trim()) {
              onResult(transcript.trim());
              speak(`दर्ज किया: ${transcript.trim()}`, language as Language);
            }
          }
        },
        language as Language,
        (error) => {
          console.warn('Speech recognition warning/error:', error);
          setIsListening(false);
          // If speech recognition fails or is denied, open fallback presets
          if (presets && presets.length > 0) {
            setShowPresetsMenu(true);
          }
        },
        () => {
          setIsListening(false);
        }
      );
    } catch (err) {
      console.warn('Failed to start recognizer:', err);
      setIsListening(false);
      setShowPresetsMenu(true);
    }
  };

  const sizeClasses = {
    sm: 'w-10 h-10 text-sm min-h-[40px] min-w-[40px]',
    md: 'w-12 h-12 text-base min-h-[48px] min-w-[48px]',
    lg: 'w-14 h-14 text-lg min-h-[56px] min-w-[56px]',
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        id={id}
        onClick={handleStartListening}
        title={isListening ? 'सुन रहे हैं... (Listening)' : placeholderTitle}
        className={`inline-flex items-center justify-center rounded-xl font-bold cursor-pointer transition-all select-none shadow-sm ${
          isListening
            ? 'bg-rose-500 text-white ring-4 ring-rose-300 shadow-lg scale-105 animate-pulse'
            : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-300 hover:scale-105 active:scale-95'
        } ${sizeClasses[size]} ${className}`}
      >
        {isListening ? (
          <Mic className="w-6 h-6 animate-bounce text-white" />
        ) : (
          <Mic className="w-5 h-5 text-amber-900" />
        )}
      </button>

      {/* Spoken interim feedback banner */}
      {isListening && (
        <div className="absolute right-0 top-full mt-2 z-50 bg-stone-900 text-white px-3 py-2 rounded-xl text-xs shadow-2xl flex items-center gap-2 whitespace-nowrap border border-amber-400/50">
          <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <span>{interimText || 'बोलिए, हम सुन रहे हैं...'}</span>
        </div>
      )}

      {/* Preset quick options popover if mic permission is blocked or requested */}
      {showPresetsMenu && presets && presets.length > 0 && (
        <div className="absolute right-0 top-full mt-2 z-50 w-64 bg-white rounded-xl shadow-2xl border border-stone-200 p-3 animate-fade-in">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100">
            <span className="text-xs font-bold text-stone-800 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>जल्दी चुनें (Quick Pick)</span>
            </span>
            <button
              onClick={() => setShowPresetsMenu(false)}
              className="text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onResult(preset);
                  setShowPresetsMenu(false);
                  speak(preset, language as Language);
                }}
                className="px-2.5 py-1.5 bg-stone-100 hover:bg-[#B4431E]/10 text-stone-800 hover:text-[#B4431E] rounded-lg text-xs font-medium border border-stone-200 text-left transition-colors cursor-pointer"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
