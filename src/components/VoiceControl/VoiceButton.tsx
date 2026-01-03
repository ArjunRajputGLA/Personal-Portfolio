'use client';

import { Mic, MicOff, Loader2 } from 'lucide-react';

interface VoiceButtonProps {
  isListening: boolean;
  isSupported: boolean;
  status: 'idle' | 'listening' | 'processing' | 'success' | 'error';
  onClick: () => void;
}

export default function VoiceButton({ 
  isListening, 
  isSupported, 
  status, 
  onClick 
}: VoiceButtonProps) {
  const getButtonContent = () => {
    if (!isSupported) {
      return (
        <>
          <MicOff size={12} className="text-[var(--vscode-text-muted)]" />
          <span className="hidden lg:inline text-[var(--vscode-text-muted)]">Voice N/A</span>
        </>
      );
    }

    switch (status) {
      case 'listening':
        return (
          <>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="hidden lg:inline text-red-400">Listening...</span>
          </>
        );
      case 'processing':
        return (
          <>
            <Loader2 size={12} className="animate-spin text-[var(--vscode-accent)]" />
            <span className="hidden lg:inline">Processing...</span>
          </>
        );
      case 'success':
        return (
          <>
            <Mic size={12} className="text-green-400" />
            <span className="hidden lg:inline">Voice Control</span>
          </>
        );
      case 'error':
        return (
          <>
            <Mic size={12} className="text-yellow-400" />
            <span className="hidden lg:inline">Voice Control</span>
          </>
        );
      default:
        return (
          <>
            {/* Blipping animation to attract attention */}
            <span className="relative">
              <Mic size={12} className="text-[var(--vscode-accent)]" />
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--vscode-accent)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--vscode-accent)]"></span>
              </span>
            </span>
            <span className="hidden lg:inline animate-pulse">Voice Control</span>
          </>
        );
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={!isSupported}
      className={`
        flex items-center gap-1.5 px-2 py-0.5 rounded cursor-pointer transition-all duration-200
        ${isListening 
          ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
          : status === 'processing'
            ? 'bg-[var(--vscode-accent)]/20 text-[var(--vscode-accent)]'
            : 'hover:bg-white/10 text-[var(--vscode-text)] bg-[var(--vscode-accent)]/10 border border-[var(--vscode-accent)]/30'
        }
        ${!isSupported ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      title={isSupported ? 'Voice Control (Alt+V)' : 'Voice control not supported in this browser'}
      aria-label={isSupported ? 'Activate voice control' : 'Voice control not available'}
    >
      {getButtonContent()}
    </button>
  );
}
