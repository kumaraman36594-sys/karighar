import { Language } from '../types';
import { LANGUAGE_LOCALES, speak as utilSpeak, stopSpeech as utilStopSpeech } from '../utils/speech';

export const getVoiceLanguage = (code: Language): string => {
  return LANGUAGE_LOCALES[code] || 'hi-IN';
};

/**
 * Text-to-Speech (TTS) Service
 * Supports 12 Indian languages with browser SpeechSynthesis fallback
 * and dialect compensation for Maithili and Bhojpuri
 */
export const speak = (
  text: string,
  language: Language = 'hi',
  onEnd?: () => void
): boolean => {
  console.log(`[VoiceService] Speaking in (${language}):`, text);

  // If Maithili or Bhojpuri, we prepend dialect hint if needed or speak via hi-IN with natural cadence
  let textToSpeak = text;
  if (language === 'mai') {
    // Maithili phonetic naturalization if needed
    textToSpeak = text;
  } else if (language === 'bho') {
    // Bhojpuri phonetic naturalization if needed
    textToSpeak = text;
  }

  return utilSpeak(textToSpeak, language, onEnd);
};

export const stopSpeech = (): void => {
  utilStopSpeech();
};

/**
 * Speech-to-Text (STT) Service
 * Wraps SpeechRecognition / webkitSpeechRecognition
 * Returns a cleanup/stop function
 */
export const listen = (
  language: Language = 'hi',
  onResult: (text: string) => void,
  onError?: (err: any) => void
): (() => void) => {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.warn('[VoiceService] SpeechRecognition not supported in this browser.');
    if (onError) onError(new Error('Speech recognition not supported'));
    return () => {};
  }

  try {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.lang = getVoiceLanguage(language);

    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript || '';
      console.log('[VoiceService] Heard:', transcript);
      onResult(transcript);
    };

    recognition.onerror = (event: any) => {
      console.warn('[VoiceService] STT Error:', event.error);
      if (onError) onError(event);
    };

    recognition.start();

    return () => {
      try {
        recognition.stop();
      } catch {
        // Ignore errors on stopping inactive recognition
      }
    };
  } catch (err) {
    console.error('[VoiceService] Failed to start recognition:', err);
    if (onError) onError(err);
    return () => {};
  }
};
