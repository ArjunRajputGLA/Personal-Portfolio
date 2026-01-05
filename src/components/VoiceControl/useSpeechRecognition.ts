'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface SpeechRecognitionState {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  interimTranscript: string;
  confidence: number;
  error: string | null;
  status: 'idle' | 'listening' | 'processing' | 'success' | 'error';
  audioLevel: number; // 0-1 representing current mic input level
}

interface SpeechRecognitionHook extends SpeechRecognitionState {
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

// Type definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: ((ev: Event) => void) | null;
  onend: ((ev: Event) => void) | null;
  onerror: ((ev: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((ev: SpeechRecognitionEvent) => void) | null;
  onspeechend: ((ev: Event) => void) | null;
  onnomatch: ((ev: Event) => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

// Helper function to check browser support
const checkSpeechRecognitionSupport = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
};

export function useSpeechRecognition(): SpeechRecognitionHook {
  // Initialize with isSupported: false to match server render
  // We'll update it in useEffect on client
  const [state, setState] = useState<SpeechRecognitionState>(() => ({
    isListening: false,
    isSupported: false, // Always start as false to prevent hydration mismatch
    transcript: '',
    interimTranscript: '',
    confidence: 0,
    error: null,
    status: 'idle',
    audioLevel: 0,
  }));

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const isInitializedRef = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize speech recognition on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const isSupported = !!SpeechRecognition;
      
      // Update isSupported state on client
      setState(prev => ({ ...prev, isSupported }));
      
      if (isSupported && !isInitializedRef.current) {
        isInitializedRef.current = true;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setState(prev => ({
            ...prev,
            isListening: true,
            status: 'listening',
            error: null,
            transcript: '',
            interimTranscript: '',
            audioLevel: 0,
          }));
        };

        recognition.onend = () => {
          setState(prev => ({
            ...prev,
            isListening: false,
            status: prev.status === 'listening' ? 'idle' : prev.status,
            audioLevel: 0,
          }));
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          let errorMessage = 'An error occurred';
          
          switch (event.error) {
            case 'not-allowed':
              errorMessage = 'Microphone access denied. Please enable microphone permissions of your browser.';
              break;
            case 'no-speech':
              errorMessage = "I didn't hear anything. Please try again.";
              break;
            case 'network':
              errorMessage = 'Network error. Please check your internet connection.';
              break;
            case 'aborted':
              errorMessage = 'Speech recognition was aborted.';
              break;
            case 'audio-capture':
              errorMessage = 'No microphone found. Please connect a microphone.';
              break;
            case 'service-not-allowed':
              errorMessage = 'Speech recognition service is not allowed.';
              break;
            default:
              errorMessage = `Speech recognition error: ${event.error}`;
          }

          setState(prev => ({
            ...prev,
            isListening: false,
            status: 'error',
            error: errorMessage,
          }));
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let finalTranscript = '';
          let interimTranscript = '';
          let maxConfidence = 0;

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            const transcript = result[0].transcript;
            const confidence = result[0].confidence || 0.9; // Default confidence

            if (result.isFinal) {
              finalTranscript += transcript;
              maxConfidence = Math.max(maxConfidence, confidence);
            } else {
              interimTranscript += transcript;
            }
          }

          if (finalTranscript) {
            setState(prev => ({
              ...prev,
              transcript: finalTranscript,
              interimTranscript: '',
              confidence: maxConfidence,
              status: 'processing',
            }));
          } else {
            setState(prev => ({
              ...prev,
              interimTranscript,
              status: 'listening',
            }));
          }
        };

        // Don't auto-stop on speech end - let user control it
        recognition.onspeechend = () => {
          // Keep listening - user will manually stop or command will be processed
        };

        recognition.onnomatch = () => {
          setState(prev => ({
            ...prev,
            status: 'error',
            error: "Sorry, I couldn't understand that. Please try again.",
          }));
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Start audio level monitoring
  const startAudioMonitoring = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      audioContextRef.current = audioContext;
      
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;
      
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      const updateLevel = () => {
        if (!analyserRef.current) return;
        
        analyserRef.current.getByteFrequencyData(dataArray);
        
        // Calculate average level
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        const normalizedLevel = Math.min(average / 128, 1); // Normalize to 0-1
        
        setState(prev => ({ ...prev, audioLevel: normalizedLevel }));
        
        animationFrameRef.current = requestAnimationFrame(updateLevel);
      };
      
      updateLevel();
    } catch (error) {
      console.error('Audio monitoring error:', error);
    }
  }, []);

  // Stop audio monitoring
  const stopAudioMonitoring = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    analyserRef.current = null;
    setState(prev => ({ ...prev, audioLevel: 0 }));
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !state.isListening) {
      setState(prev => ({
        ...prev,
        error: null,
        transcript: '',
        interimTranscript: '',
        status: 'idle',
        audioLevel: 0,
      }));
      
      try {
        recognitionRef.current.start();
        startAudioMonitoring();
      } catch (error) {
        // Recognition might already be running
        console.error('Speech recognition start error:', error);
      }
    }
  }, [state.isListening, startAudioMonitoring]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && state.isListening) {
      recognitionRef.current.stop();
      stopAudioMonitoring();
    }
  }, [state.isListening, stopAudioMonitoring]);

  const resetTranscript = useCallback(() => {
    setState(prev => ({
      ...prev,
      transcript: '',
      interimTranscript: '',
      confidence: 0,
      error: null,
      status: 'idle',
      audioLevel: 0,
    }));
  }, []);

  return {
    ...state,
    startListening,
    stopListening,
    resetTranscript,
  };
}

// Text-to-Speech utility
export function speak(text: string, options?: {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice;
}): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = options?.rate ?? 1.0;
    utterance.pitch = options?.pitch ?? 1.0;
    utterance.volume = options?.volume ?? 0.8;

    if (options?.voice) {
      utterance.voice = options.voice;
    } else {
      // Try to select a natural-sounding voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => 
        v.name.includes('Google') || 
        v.name.includes('Natural') ||
        v.name.includes('Microsoft') ||
        (v.lang === 'en-US' && v.localService)
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
    }

    utterance.onend = () => resolve();
    utterance.onerror = (event) => reject(new Error(event.error));

    window.speechSynthesis.speak(utterance);
  });
}

// Get available voices
export function getVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return [];
  }
  return window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('en'));
}
