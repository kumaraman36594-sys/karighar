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
  User
} from 'lucide-react';
import { Language, CraftType } from '../../types';
import { TRANSLATIONS } from '../../utils/translations';
import { speak, VoiceRecognizer, isSttSupported } from '../../utils/speech';
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
  const t = TRANSLATIONS[language];
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>(detectedCategory || 'Pottery');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState<boolean>(false);

  // Collected answers
  const [answers, setAnswers] = useState({
    category: detectedCategory || 'Pottery',
    material: 'Natural Clay & Ceramic Glaze',
    dimensions: '20cm × 15cm',
    makingTime: '3 days of wheel throwing & kiln firing',
    stock: 6,
  });

  const recognizerRef = useRef<VoiceRecognizer | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const questions = [
    {
      id: 1,
      text: `I see a ${selectedCategory}. Is that correct?`,
      hiText: `मुझे ${selectedCategory} दिख रहा है। सही है?`,
      type: 'confirm_category',
      defaultAnswer: 'Yes, this is correct',
      voicePresets: ['✅ हाँ', '❌ नहीं, बदलें'],
    },
    {
      id: 2,
      text: 'What material did you use to make this craft?',
      hiText: 'किस सामग्री से बनाया?',
      type: 'material',
      defaultAnswer: 'Natural Clay & Traditional Glaze',
      voicePresets: ['मिट्टी (Natural Clay)', 'कपड़ा / सिल्क (Silk)', 'लकड़ी (Wood)', 'पीतल (Brass)'],
    },
    {
      id: 3,
      text: 'What are the approximate dimensions or size?',
      hiText: 'इसका आकार क्या है?',
      type: 'dimensions',
      defaultAnswer: '20cm × 15cm',
      voicePresets: ['ऊंचाई 20cm, चौड़ाई 15cm', 'मध्यम आकार (Medium)', 'बड़ा आकार (Large)', 'छोटा (Small)'],
    },
    {
      id: 4,
      text: 'How long did it take you to make this piece?',
      hiText: 'बनाने में कितना समय लगा?',
      type: 'time',
      defaultAnswer: '3 days of wheel shaping & firing',
      voicePresets: ['3 दिन (3 Days)', '1 हफ्ता (1 Week)', '2 दिन (2 Days)', '1 दिन (1 Day)'],
    },
    {
      id: 5,
      text: 'How many finished pieces do you have available right now?',
      hiText: 'कितने उपलब्ध हैं?',
      type: 'stock',
      defaultAnswer: '5 pieces',
      voicePresets: ['5 पीस', '10 पीस', '2 पीस', '1 पीस'],
    },
  ];

  // Initialize first question
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

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isListening]);

  const speakCurrentQuestion = () => {
    if (currentQIndex < questions.length) {
      speak(questions[currentQIndex].hiText, language);
    }
  };

  const handleAnswer = (answerText: string) => {
    // Add user message
    const updatedMessages: ChatMessage[] = [
      ...messages,
      {
        sender: 'user',
        text: answerText,
        time: 'Just now',
      }
    ];

    // Update collected state
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
      }, 500);
    } else {
      // Completed all 5 questions!
      setTimeout(() => {
        setMessages([
          ...updatedMessages,
          {
            sender: 'ai',
            text: '✅ All done! Creating your fair-priced listing...',
            hiText: '✅ सब हो गया! लिस्टिंग बना रहे हैं...',
            time: 'Just now',
          }
        ]);
        if (!isAudioMuted) {
          speak('सब हो गया! आपकी लिस्टिंग तैयार कर रहे हैं।', language);
        }

        setTimeout(() => {
          onFinishQa(nextAnswers);
        }, 1200);
      }, 500);
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
            handleAnswer(recognizedText);
          }
        },
        language,
        (err) => {
          console.warn('Voice input error/fallback:', err);
          setIsListening(false);
        },
        () => {
          setIsListening(false);
        }
      );

      if (!started) {
        // Fallback simulate voice input directly
        setIsListening(false);
        const preset = questions[currentQIndex]?.defaultAnswer || 'Handmade pottery clay';
        setInputVal(preset);
      }
    }
  };

  const currentQ = questions[currentQIndex];

  return (
    <div className="min-h-screen bg-[#f8f9fe] flex flex-col justify-between max-w-2xl mx-auto p-3 sm:p-6 pb-20">
      {/* Header */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-indigo-100 shadow-sm mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xl shadow-md">
              🤖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-gray-900 text-lg sm:text-xl">
                  {t.qaTitle}
                </h1>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                  Question {Math.min(currentQIndex + 1, 5)} / 5
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {t.qaSubtitle} (Voice-First · बोलकर जवाब दें)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <AudioSpeakerButton
              text={currentQ?.hiText || 'प्रश्न सुनें'}
              language={language}
              isMuted={isAudioMuted}
              label="प्रश्न सुनें"
              className="bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100"
            />
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-1.5 mt-3 overflow-hidden">
          <div 
            className="bg-indigo-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentQIndex + 1) / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Chat messages stream */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 py-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-2.5 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs shrink-0 shadow-xs">
                🤖
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-md rounded-2xl p-4 shadow-xs ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-xs'
                  : 'bg-white border border-gray-200 text-gray-900 rounded-tl-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm sm:text-base font-semibold leading-relaxed">
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
                <p className="text-xs sm:text-sm text-indigo-900/80 font-medium mt-1 pt-1 border-t border-gray-100">
                  {msg.hiText}
                </p>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs shrink-0">
                👤
              </div>
            )}
          </div>
        ))}

        {isListening && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs animate-pulse">
            <Mic className="w-4 h-4 text-amber-600 animate-bounce" />
            <span>सुन रहे हैं... कृपया बोलें (Listening to your voice...)</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Answer Controls Area */}
      {currentQIndex < 5 && (
        <div className="bg-white rounded-3xl p-4 border border-indigo-100 shadow-lg space-y-3 mt-4">
          {/* Question 1 special buttons: Yes / No, Change */}
          {currentQ?.type === 'confirm_category' ? (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => handleAnswer(`Yes, it is ${selectedCategory}`)}
                  id="qa-confirm-yes-btn"
                  className="min-h-[56px] h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-transform"
                >
                  <Check className="w-5 h-5" />
                  <span>✅ हाँ, सही है</span>
                </button>

                <button
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  id="qa-confirm-no-btn"
                  className="min-h-[56px] h-14 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-base border border-gray-300 flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-transform"
                >
                  <span>❌ नहीं, बदलें</span>
                </button>
              </div>

              {isCategoryDropdownOpen && (
                <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-200">
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Select Correct Craft Category:
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full min-h-[48px] px-3 rounded-xl border border-gray-300 bg-white font-semibold text-sm cursor-pointer"
                  >
                    <option value="Pottery">🏺 Pottery (मिट्टी के बर्तन / पॉटरी)</option>
                    <option value="Textile">🧵 Textile (कपड़े / हथकरघा / सिल्क)</option>
                    <option value="Jewelry">💍 Jewelry (धातु / गहने)</option>
                    <option value="Woodwork">🪵 Woodwork (काष्ठ कला)</option>
                    <option value="Painting">🎨 Painting (लोक कला चित्रकारी)</option>
                    <option value="Food">🍲 Food (ग्रामीण उत्पाद)</option>
                  </select>
                  <button
                    onClick={() => {
                      setIsCategoryDropdownOpen(false);
                      handleAnswer(`Category changed to ${selectedCategory}`);
                    }}
                    className="mt-2 w-full min-h-[44px] py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Confirm Category
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Questions 2 to 5: Voice mic button + quick presets + text fallback */
            <div className="space-y-2.5">
              {/* Quick 1-Tap Voice Presets (Essential for zero-friction) */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                <span className="text-[11px] font-bold text-gray-400 shrink-0">
                  Quick Speak:
                </span>
                {currentQ.voicePresets.map((preset, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => handleAnswer(preset)}
                    className="min-h-[40px] px-3 py-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-xs font-semibold text-indigo-900 shrink-0 transition-colors cursor-pointer active:scale-95"
                  >
                    💬 {preset}
                  </button>
                ))}
              </div>

              {/* Voice Mic & Text Input Row */}
              <div className="flex items-center gap-2">
                {/* Big Voice Mic Button - 56px */}
                <button
                  onClick={toggleVoiceInput}
                  id="qa-voice-mic-btn"
                  className={`min-h-[56px] w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md transition-all shrink-0 cursor-pointer active:scale-95 ${
                    isListening
                      ? 'bg-red-600 animate-pulse-ring'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                  title="बोलकर जवाब दें (Speak your answer)"
                >
                  {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </button>

                {/* Input field - 56px */}
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
                      ? 'सुन रहे हैं... (Listening)'
                      : 'बोलें (Mic) या यहाँ टाइप करें...'
                  }
                  className="flex-1 min-h-[56px] h-14 px-4 rounded-2xl border border-gray-300 text-base font-medium focus:border-indigo-600 focus:outline-hidden"
                />

                {/* Send button - 56px */}
                <button
                  onClick={() => {
                    if (inputVal.trim()) {
                      handleAnswer(inputVal.trim());
                    } else {
                      handleAnswer(currentQ.defaultAnswer);
                    }
                  }}
                  id="qa-send-answer-btn"
                  className="min-h-[56px] w-14 h-14 rounded-2xl bg-gray-900 hover:bg-black text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer active:scale-95"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
