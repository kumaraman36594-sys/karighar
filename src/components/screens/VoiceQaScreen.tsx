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
  HelpCircle,
  Edit2
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
  hiText?: string;
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
      voicePresets: ['हाँ, सही है', 'नहीं, बदलें'],
    },
    {
      id: 2,
      text: 'What material did you use to make this craft?',
      hiText: 'किस सामग्री से बनाया?',
      type: 'material',
      defaultAnswer: 'Natural Clay & Traditional Glaze',
      voicePresets: ['मिट्टी (Clay)', 'कपड़ा / सिल्क (Silk)', 'लकड़ी (Wood)', 'पीतल (Brass)'],
    },
    {
      id: 3,
      text: 'What are the approximate dimensions or size?',
      hiText: 'इसका आकार क्या है?',
      type: 'dimensions',
      defaultAnswer: '20cm × 15cm',
      voicePresets: ['20cm × 15cm', 'मध्यम आकार (Medium)', 'बड़ा (Large)', 'छोटा (Small)'],
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
      }, 400);
    } else {
      // Completed all 5 questions
      setTimeout(() => {
        setMessages([
          ...updatedMessages,
          {
            sender: 'ai',
            text: 'Details recorded! Generating your catalog entry...',
            hiText: 'विवरण दर्ज कर लिया गया है। लिस्टिंग बनाई जा रही है...',
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
        setIsListening(false);
        const preset = questions[currentQIndex]?.defaultAnswer || 'Handmade pottery clay';
        setInputVal(preset);
      }
    }
  };

  const currentQ = questions[currentQIndex];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-between max-w-2xl mx-auto p-3 sm:p-5 pb-20 select-none">
      {/* Header */}
      <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-stone-200 shadow-xs mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-stone-900 flex items-center justify-center text-white shrink-0">
              <Bot className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-stone-900 text-sm sm:text-base">
                  {t.qaTitle}
                </h1>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-stone-100 border border-stone-200 text-stone-700">
                  Question {Math.min(currentQIndex + 1, 5)} of 5
                </span>
              </div>
              <p className="text-xs text-stone-500">
                {t.qaSubtitle} (Voice-guided)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <AudioSpeakerButton
              text={currentQ?.hiText || 'प्रश्न सुनें'}
              language={language}
              isMuted={isAudioMuted}
              size="sm"
            />
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-stone-100 rounded-full h-1 mt-3 overflow-hidden">
          <div 
            className="bg-stone-900 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentQIndex + 1) / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Chat messages stream */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-1">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-2.5 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'ai' && (
              <div className="w-7 h-7 rounded-md bg-stone-800 text-white flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-md rounded-lg p-3 sm:p-3.5 text-xs sm:text-sm ${
                msg.sender === 'user'
                  ? 'bg-stone-900 text-white'
                  : 'bg-white border border-stone-200 text-stone-900 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium leading-relaxed">
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
                <p className="text-xs text-stone-500 font-medium mt-1 pt-1 border-t border-stone-100">
                  {msg.hiText}
                </p>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-md bg-stone-200 text-stone-700 flex items-center justify-center shrink-0">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {isListening && (
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-stone-800 text-xs">
            <Mic className="w-3.5 h-3.5 text-stone-700 animate-pulse" />
            <span>Listening to voice...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Answer Controls Area */}
      {currentQIndex < 5 && (
        <div className="bg-white rounded-xl p-3 sm:p-4 border border-stone-200 shadow-xs space-y-2.5 mt-3">
          {/* Question 1 special buttons: Yes / No, Change */}
          {currentQ?.type === 'confirm_category' ? (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleAnswer(`Yes, it is ${selectedCategory}`)}
                  id="qa-confirm-yes-btn"
                  className="h-11 rounded-lg bg-stone-900 hover:bg-black text-white font-semibold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>हाँ, सही है (Yes)</span>
                </button>

                <button
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  id="qa-confirm-no-btn"
                  className="h-11 rounded-lg bg-white hover:bg-stone-50 text-stone-800 font-semibold text-xs sm:text-sm border border-stone-300 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>बदलें (Change)</span>
                </button>
              </div>

              {isCategoryDropdownOpen && (
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Select Correct Craft Category:
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-stone-300 bg-white font-medium text-xs sm:text-sm cursor-pointer"
                  >
                    <option value="Pottery">Pottery (मिट्टी के बर्तन / पॉटरी)</option>
                    <option value="Textile">Textile (कपड़े / हथकरघा / सिल्क)</option>
                    <option value="Jewelry">Jewelry (धातु / गहने)</option>
                    <option value="Woodwork">Woodwork (काष्ठ कला)</option>
                    <option value="Painting">Painting (चित्रकारी)</option>
                    <option value="Food">Food (पारंपरिक खाद्य)</option>
                  </select>
                  <button
                    onClick={() => {
                      setIsCategoryDropdownOpen(false);
                      handleAnswer(`Category changed to ${selectedCategory}`);
                    }}
                    className="mt-2 w-full h-9 bg-stone-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Confirm Category
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Questions 2 to 5: Voice mic button + quick presets + text fallback */
            <div className="space-y-2">
              {/* Quick 1-Tap Voice Presets */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                <span className="text-[10px] font-semibold text-stone-400 shrink-0 uppercase tracking-wider">
                  Suggestions:
                </span>
                {currentQ.voicePresets.map((preset, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => handleAnswer(preset)}
                    className="h-8 px-2.5 rounded-md bg-stone-100 hover:bg-stone-200 border border-stone-200 text-xs font-medium text-stone-800 shrink-0 transition-colors cursor-pointer"
                  >
                    {preset}
                  </button>
                ))}
              </div>

              {/* Voice Mic & Text Input Row */}
              <div className="flex items-center gap-2">
                {/* Voice Mic Button */}
                <button
                  onClick={toggleVoiceInput}
                  id="qa-voice-mic-btn"
                  className={`h-11 w-11 rounded-lg flex items-center justify-center text-white transition-colors shrink-0 cursor-pointer ${
                    isListening
                      ? 'bg-rose-600'
                      : 'bg-stone-900 hover:bg-black'
                  }`}
                  title="बोलकर जवाब दें (Speak your answer)"
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                {/* Input field */}
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
                      ? 'Listening to voice...'
                      : 'Speak via mic or type here...'
                  }
                  className="flex-1 h-11 px-3 rounded-lg border border-stone-300 text-xs sm:text-sm font-medium focus:border-stone-900 focus:outline-hidden bg-stone-50"
                />

                {/* Send button */}
                <button
                  onClick={() => {
                    if (inputVal.trim()) {
                      handleAnswer(inputVal.trim());
                    } else {
                      handleAnswer(currentQ.defaultAnswer);
                    }
                  }}
                  id="qa-send-answer-btn"
                  className="h-11 w-11 rounded-lg bg-stone-900 hover:bg-black text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer"
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

