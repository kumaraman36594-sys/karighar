import { Language } from '../types';

export const LANGUAGE_LOCALES: Record<Language, string> = {
  hi: 'hi-IN',
  en: 'en-US',
  ta: 'ta-IN',
  te: 'te-IN',
  bn: 'bn-IN',
  mr: 'mr-IN',
  gu: 'gu-IN',
  kn: 'kn-IN',
};

export const LANGUAGE_NAMES: Record<Language, string> = {
  hi: 'हिन्दी (Hindi)',
  en: 'English',
  ta: 'தமிழ் (Tamil)',
  te: 'తెలుగు (Telugu)',
  bn: 'বাংলা (Bengali)',
  mr: 'मराठी (Marathi)',
  gu: 'ગુજરાતી (Gujarati)',
  kn: 'ಕನ್ನಡ (Kannada)',
};

// Check if Speech Synthesis is available
export const isTtsSupported = (): boolean => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
};

// Check if Speech Recognition is available
export const isSttSupported = (): boolean => {
  return typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
};

// Text-to-Speech function following Section 7 specification
export const speak = (
  text: string, 
  language: Language = 'hi', 
  onEnd?: () => void
): boolean => {
  if (!isTtsSupported()) {
    console.warn('Speech synthesis not supported in this browser.');
    if (onEnd) onEnd();
    return false;
  }

  try {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const targetLocale = LANGUAGE_LOCALES[language] || 'hi-IN';
    utterance.lang = targetLocale;
    utterance.rate = 0.9;
    utterance.pitch = 1.0;

    // Try finding matching voice safely
    const rawVoices = typeof window.speechSynthesis?.getVoices === 'function' 
      ? window.speechSynthesis.getVoices() 
      : [];
    const voices = Array.isArray(rawVoices) ? rawVoices : [];
    const matchingVoice = voices.find(v => v?.lang && v.lang.replace('_', '-').startsWith(targetLocale.slice(0, 2)));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    if (onEnd) {
      utterance.onend = () => onEnd();
      utterance.onerror = () => onEnd();
    }

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (error) {
    console.error('TTS Speak error:', error);
    if (onEnd) onEnd();
    return false;
  }
};

export const stopSpeech = (): void => {
  if (isTtsSupported()) {
    window.speechSynthesis.cancel();
  }
};

// Speech Recognition instance wrapper
export class VoiceRecognizer {
  private recognition: any = null;
  private isListening = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = 
        (window as any).SpeechRecognition || 
        (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
      }
    }
  }

  public start(
    onResult: (text: string, isFinal: boolean) => void,
    language: Language = 'hi',
    onError?: (err: any) => void,
    onEnd?: () => void
  ): boolean {
    if (!this.recognition) {
      if (onError) onError(new Error('Voice recognition is not supported in this environment.'));
      return false;
    }

    try {
      if (this.isListening) {
        this.recognition.abort();
      }

      this.recognition.lang = LANGUAGE_LOCALES[language] || 'hi-IN';

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const text = finalTranscript || interimTranscript;
        const isFinal = Boolean(finalTranscript);
        onResult(text, isFinal);
      };

      this.recognition.onerror = (event: any) => {
        console.warn('Speech recognition warning/error:', event.error);
        if (onError) onError(event);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (onEnd) onEnd();
      };

      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (err) {
      console.error('Error starting recognition:', err);
      if (onError) onError(err);
      return false;
    }
  }

  public stop(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  public active(): boolean {
    return this.isListening;
  }
}
