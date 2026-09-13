import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  Mic, 
  MicOff, 
  Send, 
  Check, 
  Sparkles, 
  RotateCcw,
  ArrowRight,
  Bot,
  User,
  CheckCircle2,
  XCircle,
  MessageSquare
} from 'lucide-react';
import { Language } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { speak, VoiceRecognizer } from '../../utils/speech';
import { AudioSpeakerButton } from '../common/AudioSpeakerButton';

interface VoiceQaScreenProps {
  language: Language;
  detectedCategory: string;
  onFinishQa: (answers: {
    category: string;
    material: string;
    dimensions: string;
    makingTime: string;
    stock: number;
  }) => void;
  isAudioMuted: boolean;
}

interface ChatMessage {
  sender: 'ai' | 'user';
  text: string;
  hindiText?: string;
  time: string;
}

export const VoiceQaScreen: React.FC<VoiceQaScreenProps> = ({
  language,
  detectedCategory,
  onFinishQa,
  isAudioMuted,
}) => {
  const { t } = useLanguage();
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>(detectedCategory || 'Pottery');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState<boolean>(false);

  const [answers, setAnswers] = useState({
    category: detectedCategory || 'Pottery',
    material: 'Natural Clay & Traditional Glaze',
    dimensions: '20cm × 15cm',
    makingTime: '3 days of wheel shaping & firing',
    stock: 6,
  });

  const recognizerRef = useRef<VoiceRecognizer | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const questions = [
    {
      id: 1,
      text: `We identified this as ${selectedCategory}. Is that correct?`,
      hiText: `यह ${selectedCategory} शिल्प है, क्या यह सही है?`,
      type: 'confirm_category',
      defaultAnswer: 'Yes, this is correct',
      voicePresets: ['हाँ, सही है', 'नहीं, बदलें'],
    },
    {
      id: 2,
      text: 'What raw materials did you use to handcraft this?',
      hiText: 'इसे बनाने में किस सामग्री का उपयोग हुआ?',
      type: 'material',
      defaultAnswer: 'Natural Clay & Traditional Glaze',
      voicePresets: ['मिट्टी (Clay)', 'सिल्क (Silk)', 'लकड़ी (Wood)', 'पीतल (Brass)'],
    },
    {
      id: 3,
      text: 'What are the approximate dimensions or size?',
      hiText: 'इस उत्पाद का आकार या माप क्या है?',
      type: 'dimensions',
      defaultAnswer: '20cm × 15cm',
      voicePresets: ['ऊंचाई 20cm, चौड़ाई 15cm', 'मध्यम (Medium)', 'बड़ा (Large)', 'छोटा (Small)'],
    },
    {
      id: 4,
      text: 'How many days did it take to make by hand?',
      hiText: 'हाथ से तैयार करने में कितने दिन लगे?',
      type: 'time',
      defaultAnswer: '3 days of craftsmanship',
      voicePresets: ['3 दिन (3 Days)', '1 हफ्ता (1 Week)', '2 दिन (2 Days)', '5 दिन (5 Days)'],
    },
    {
      id: 5,
      text: 'How many finished pieces do you have in stock right now?',
      hiText: 'वर्तमान में आपके पास कितने पीस तैयार हैं?',
      type: 'stock',
      defaultAnswer: '6 pieces',
      voicePresets: ['5 पीस', '10 पीस', '2 पीस', '1 पीस'],
    },
  ];

  const currentQ = questions[currentQIndex];

  useEffect(() => {
    recognizerRef.current = new VoiceRecognizer();
    const firstQ = questions[0];
    setMessages([
      {
        sender: 'ai',
        text: firstQ.text,
        hiText: firstQ.hiText,
        time: 'Just now',
      }
    ]);

    if (!isAudioMuted) {
      speak(firstQ.hiText, language);
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isListening]);

  const handleAnswer = (answerText: string) => {
    if (!answerText.trim()) return;

    const updatedMessages: ChatMessage[] = [
      ...messages,
      {
        sender: 'user',
        text: answerText,
        time: 'Just now',
      }
    ];
    setMessages(updatedMessages);

    const nextAnswers = { ...answers };
    if (currentQIndex === 0) {
      nextAnswers.category = selectedCategory;
    } else if (currentQIndex === 1) {
      nextAnswers.material = answerText;
    } else if (currentQIndex === 2) {
      nextAnswers.dimensions = answerText;
    } else if (currentQIndex === 3) {
      nextAnswers.makingTime = answerText;
    } else if (currentQIndex === 4) {
      const parsedNum = parseInt(answerText.replace(/\D/g, ''), 10);
      nextAnswers.stock = !isNaN(parsedNum) && parsedNum > 0 ? parsedNum : 5;
    }
    setAnswers(nextAnswers);
    setInputVal('');

    const nextQIndex = currentQIndex + 1;

    if (nextQIndex < questions.length) {
      setCurrentQIndex(nextQIndex);
      const nextQ = questions[nextQIndex];

      setTimeout(() => {
        setMessages([
          ...updatedMessages,
          {
            sender: 'ai',
            text: nextQ.text,
            hiText: nextQ.hiText,
            time: 'Just now',
          }
        ]);
        if (!isAudioMuted) {
          speak(nextQ.hiText, language);
        }
      }, 400);
    } else {
      setTimeout(() => {
        setMessages([
          ...updatedMessages,
          {
            sender: 'ai',
            text: 'All responses recorded! Generating your verified listing...',
            hiText: 'सब हो गया! आपकी लिस्टिंग तैयार कर रहे हैं...',
            time: 'Just now',
          }
        ]);
        if (!isAudioMuted) {
          speak('सब हो गया! आपकी लिस्टिंग तैयार कर रहे हैं।', language);
        }

        setTimeout(() => {
          onFinishQa(nextAnswers);
        }, 1000);
      }, 400);
    }
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      recognizerRef.current?.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      const started = recognizerRef.current?.start(
        (recognizedText: string, isFinal: boolean) => {
          setInputVal(recognizedText);
          if (isFinal && recognizedText.trim()) {
            setIsListening(false);
            handleAnswer(recognizedText.trim());
          }
        },
        language,
        () => setIsListening(false),
        () => setIsListening(false)
      );
      if (!started) {
        setIsListening(false);
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col h-[calc(100vh-100px)] min-h-[480px] select-none p-2 sm:p-4">
      {/* Top Header Card */}
      <div className="bg-white rounded-xl p-3 sm:p-4 border border-stone-200 shadow-xs mb-2 sm:mb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#B4431E]/10 text-[#B4431E] flex items-center justify-center shrink-0">
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-extrabold text-xs sm:text-base text-stone-900 truncate">
                  {t('voiceQaTitle')}
                </span>
                <span className="text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-sm bg-stone-100 text-stone-700 shrink-0">
                  Step {Math.min(currentQIndex + 1, 5)} / 5
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-stone-500 truncate">
                {t('voiceQaDesc')}
              </p>
            </div>
          </div>

          <AudioSpeakerButton
            text={currentQ?.hiText || 'प्रश्न सुनें'}
            language={language}
            isMuted={isAudioMuted}
            label="सुनें"
            className="bg-stone-50 border-stone-200 text-stone-700 shrink-0"
          />
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-stone-100 rounded-full h-1.5 mt-2.5 sm:mt-3 overflow-hidden">
          <div 
            className="bg-[#B4431E] h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentQIndex + 1) / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-1">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-2.5 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-lg bg-[#B4431E] text-white flex items-center justify-center text-xs shrink-0 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-md rounded-xl p-3.5 shadow-xs ${
                msg.sender === 'user'
                  ? 'bg-[#B4431E] text-white rounded-tr-xs'
                  : 'bg-white border border-stone-200 text-stone-900 rounded-tl-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs sm:text-sm font-semibold leading-relaxed">
                  {msg.text}
                </p>
                {msg.sender === 'ai' && (
                  <AudioSpeakerButton
                    text={msg.hiText || msg.text}
                    language={language}
                    isMuted={isAudioMuted}
                    size="sm"
                    className="shrink-0 -mt-1 -mr-1"
                  />
                )}
              </div>
              {msg.hiText && (
                <p className={`text-xs mt-1 pt-1 border-t ${
                  msg.sender === 'user' ? 'border-white/20 text-amber-100' : 'border-stone-100 text-stone-600'
                }`}>
                  {msg.hiText}
                </p>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-stone-200 text-stone-700 flex items-center justify-center text-xs shrink-0">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isListening && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs animate-pulse">
            <Mic className="w-4 h-4 text-amber-600 animate-bounce" />
            <span>सुन रहे हैं... बोलें (Listening to your answer...)</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Answer Controls Area */}
      {currentQIndex < 5 && (
        <div className="bg-white rounded-xl p-3.5 border border-stone-200 shadow-xs space-y-3 mt-2 shrink-0">
          {/* Question 1: Confirm / Change */}
          {currentQ?.type === 'confirm_category' ? (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleAnswer(`Yes, it is ${selectedCategory}`)}
                  id="qa-confirm-yes-btn"
                  className="min-h-[48px] rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-transform"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>हाँ, सही है (Yes)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  id="qa-confirm-no-btn"
                  className="min-h-[48px] rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-sm border border-stone-300 flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-transform"
                >
                  <XCircle className="w-4 h-4 text-stone-500" />
                  <span>नहीं, बदलें (Change)</span>
                </button>
              </div>

              {isCategoryDropdownOpen && (
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Select Correct Craft Category:
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full min-h-[44px] px-3 rounded-md border border-stone-300 bg-white font-semibold text-xs cursor-pointer focus:outline-none focus:border-[#B4431E]"
                  >
                    <option value="Pottery">Pottery (मिट्टी के बर्तन / पॉटरी)</option>
                    <option value="Textile">Textile (कपड़े / हथकरघा / सिल्क)</option>
                    <option value="Jewelry">Jewelry (धातु / गहने)</option>
                    <option value="Woodwork">Woodwork (काष्ठ कला)</option>
                    <option value="Painting">Painting (लोक कला चित्रकारी)</option>
                    <option value="Other">Other Craft (अन्य हस्तशिल्प)</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCategoryDropdownOpen(false);
                      handleAnswer(`Category: ${selectedCategory}`);
                    }}
                    className="mt-2 w-full min-h-[44px] py-2 bg-[#B4431E] text-white rounded-md text-xs font-bold cursor-pointer"
                  >
                    Confirm Craft Type
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2.5">
              {/* Quick Presets */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-[10px] font-bold text-stone-400 uppercase shrink-0">
                  Quick Speak:
                </span>
                {currentQ.voicePresets.map((preset, pIdx) => (
                  <button
                    key={pIdx}
                    type="button"
                    onClick={() => handleAnswer(preset)}
                    className="min-h-[38px] px-2.5 sm:px-3 py-1 rounded-full bg-stone-100 hover:bg-stone-200 border border-stone-200 text-xs font-medium text-stone-800 shrink-0 transition-colors cursor-pointer active:scale-95"
                  >
                    {preset}
                  </button>
                ))}
              </div>

              {/* Mic & Input */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  id="qa-voice-mic-btn"
                  className={`min-h-[44px] min-w-[44px] sm:min-h-[48px] sm:min-w-[48px] rounded-lg flex items-center justify-center text-white shadow-xs transition-all shrink-0 cursor-pointer active:scale-95 ${
                    isListening
                      ? 'bg-red-600 animate-pulse'
                      : 'bg-[#B4431E] hover:bg-[#9E3514]'
                  }`}
                  title="Speak answer"
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                <input
                  type={currentQ.type === 'stock' ? 'number' : 'text'}
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && inputVal.trim()) {
                      handleAnswer(inputVal.trim());
                    }
                  }}
                  placeholder={
                    isListening
                      ? 'सुन रहे हैं... बोलिए...'
                      : 'उत्तर बोलें या टाइप करें...'
                  }
                  className="flex-1 min-h-[44px] sm:min-h-[48px] px-2.5 sm:px-3 rounded-lg border border-stone-300 focus:border-[#B4431E] focus:outline-none text-xs sm:text-sm font-medium bg-white min-w-0"
                />

                <button
                  type="button"
                  onClick={() => {
                    if (inputVal.trim()) handleAnswer(inputVal.trim());
                  }}
                  disabled={!inputVal.trim()}
                  className={`min-h-[44px] sm:min-h-[48px] px-3 sm:px-4 rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors shrink-0 ${
                    inputVal.trim()
                      ? 'bg-[#B4431E] hover:bg-[#9E3514] text-white shadow-xs'
                      : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
