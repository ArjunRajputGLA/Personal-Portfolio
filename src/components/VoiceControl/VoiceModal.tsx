'use client';

import { useEffect, useRef, useState } from 'react';
import { X, HelpCircle, MicOff, Mic, AlertCircle, CheckCircle2 } from 'lucide-react';
import VoiceWaveform from './VoiceWaveform';
import { type SpeechRecognitionState } from './useSpeechRecognition';

interface VoiceModalProps {
  isOpen: boolean;
  speechState: SpeechRecognitionState;
  onClose: () => void;
  onStartListening: () => void;
  onStopListening: () => void;
  onShowHelp: () => void;
  recentCommands: { text: string; success: boolean }[];
  lastResponse: string | null;
}

const suggestions = [
  'Show me your projects',
  'What skills do you have?',
  'Go to about section',
  'Open terminal',
  'Download resume',
  'Toggle theme',
];

export default function VoiceModal({
  isOpen,
  speechState,
  onClose,
  onStartListening,
  onStopListening,
  onShowHelp,
  recentCommands,
  lastResponse,
}: VoiceModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [currentSuggestion, setCurrentSuggestion] = useState(0);

  // Rotate suggestions
  useEffect(() => {
    if (!isOpen) return;
    
    const interval = setInterval(() => {
      setCurrentSuggestion(prev => (prev + 1) % suggestions.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getStatusContent = () => {
    if (!speechState.isSupported) {
      return (
        <div className="flex items-center gap-2 text-yellow-400">
          <AlertCircle size={16} />
          <span>Voice control not supported</span>
        </div>
      );
    }

    switch (speechState.status) {
      case 'listening':
        return (
          <div className="flex items-center gap-2 text-red-400">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span>Listening... (Speak now)</span>
          </div>
        );
      case 'processing':
        return (
          <div className="flex items-center gap-2 text-[var(--vscode-accent)]">
            <div className="animate-spin h-4 w-4 border-2 border-[var(--vscode-accent)] border-t-transparent rounded-full"></div>
            <span>Processing your command...</span>
          </div>
        );
      case 'success':
        return (
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle2 size={16} />
            <span>Command executed!</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle size={16} />
            <span>{speechState.error || 'An error occurred'}</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 text-[var(--vscode-text-muted)]">
            <Mic size={16} />
            <span>Click the microphone to start</span>
          </div>
        );
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Voice Control"
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="w-full max-w-lg mx-4 bg-[#1e1e1e] border border-[var(--vscode-accent)] rounded-lg shadow-2xl animate-in zoom-in-95 duration-200"
        style={{ boxShadow: '0 0 40px rgba(0, 122, 204, 0.3)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--vscode-border)]">
          <div className="flex items-center gap-2">
            <Mic className="text-[var(--vscode-accent)]" size={20} />
            <h2 className="text-lg font-semibold text-[var(--vscode-text)]">Voice Control</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            aria-label="Close voice control"
          >
            <X size={18} className="text-[var(--vscode-text-muted)]" />
          </button>
        </div>

        {/* Waveform */}
        <div className="px-4 py-4">
          <VoiceWaveform isListening={speechState.isListening} audioLevel={speechState.audioLevel} />
        </div>

        {/* Status */}
        <div className="px-4 py-2 flex justify-center">
          {getStatusContent()}
        </div>

        {/* Transcript Display */}
        <div className="px-4 py-3">
          <div className="min-h-[60px] p-3 bg-[#252526] rounded-lg border border-[var(--vscode-border)]">
            {speechState.interimTranscript || speechState.transcript ? (
              <div className="text-[var(--vscode-text)]">
                <span className="text-[var(--vscode-text-muted)]">&quot;</span>
                {speechState.transcript && (
                  <span className="text-white">{speechState.transcript}</span>
                )}
                {speechState.interimTranscript && (
                  <span className="text-[var(--vscode-text-muted)] italic">
                    {speechState.transcript ? ' ' : ''}{speechState.interimTranscript}
                  </span>
                )}
                <span className="text-[var(--vscode-text-muted)]">&quot;</span>
              </div>
            ) : (
              <div className="text-[var(--vscode-text-muted)] text-sm text-center">
                {speechState.isListening ? 'Speak now...' : 'Your speech will appear here'}
              </div>
            )}
          </div>
        </div>

        {/* Last Response */}
        {lastResponse && (
          <div className="px-4 pb-2">
            <div className="p-2 bg-[var(--vscode-accent)]/10 rounded border border-[var(--vscode-accent)]/30">
              <p className="text-sm text-[var(--vscode-accent)]">
                🔊 {lastResponse}
              </p>
            </div>
          </div>
        )}

        {/* Confidence Meter */}
        {speechState.confidence > 0 && (
          <div className="px-4 pb-2">
            <div className="flex items-center gap-2 text-xs text-[var(--vscode-text-muted)]">
              <span>Confidence:</span>
              <div className="flex-1 h-1.5 bg-[#252526] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[var(--vscode-accent)] transition-all duration-300"
                  style={{ width: `${speechState.confidence * 100}%` }}
                />
              </div>
              <span>{Math.round(speechState.confidence * 100)}%</span>
            </div>
          </div>
        )}

        {/* Suggestion */}
        <div className="px-4 py-2 text-center">
          <p className="text-sm text-[var(--vscode-text-muted)]">
            Try saying: <span className="text-[var(--vscode-accent)] italic">&quot;{suggestions[currentSuggestion]}&quot;</span>
          </p>
        </div>

        {/* Recent Commands */}
        {recentCommands.length > 0 && (
          <div className="px-4 py-2">
            <p className="text-xs text-[var(--vscode-text-muted)] mb-2">Recent commands:</p>
            <div className="space-y-1">
              {recentCommands.slice(0, 3).map((cmd, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-2 text-sm"
                >
                  {cmd.success ? (
                    <CheckCircle2 size={12} className="text-green-400" />
                  ) : (
                    <AlertCircle size={12} className="text-red-400" />
                  )}
                  <span className="text-[var(--vscode-text-muted)]">&quot;{cmd.text}&quot;</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="px-4 py-4 border-t border-[var(--vscode-border)] flex items-center justify-between gap-2">
          <button
            onClick={onShowHelp}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[var(--vscode-text-muted)] hover:text-[var(--vscode-text)] hover:bg-white/5 rounded transition-colors"
          >
            <HelpCircle size={14} />
            <span>View All Commands</span>
          </button>
          
          <div className="flex items-center gap-2">
            {speechState.isListening ? (
              <button
                onClick={onStopListening}
                className="flex items-center gap-1.5 px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded transition-colors"
              >
                <MicOff size={16} />
                <span>Stop</span>
              </button>
            ) : (
              <button
                onClick={onStartListening}
                disabled={!speechState.isSupported}
                className="flex items-center gap-1.5 px-4 py-2 bg-[var(--vscode-accent)] text-white hover:bg-[var(--vscode-accent)]/80 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Mic size={16} />
                <span>Start Listening</span>
              </button>
            )}
            
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-[var(--vscode-text-muted)] hover:text-[var(--vscode-text)] hover:bg-white/5 rounded transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
