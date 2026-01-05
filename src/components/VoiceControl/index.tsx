'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Sparkles } from 'lucide-react';
import VoiceButton from './VoiceButton';
import VoiceModal from './VoiceModal';
import VoiceHelpModal from './VoiceHelpModal';
import { useSpeechRecognition, speak } from './useSpeechRecognition';
import { voiceCommands, findClosestCommand, type VoiceCommand } from './VoiceCommands';

interface VoiceControlProps {
  onNavigate: (section: string) => void;
  onOpenTerminal: () => void;
  onOpenChatbot: () => void;
  onOpenSettings: () => void;
  onOpenCommandPalette: () => void;
  onToggleTheme: () => void;
  onDownloadResume: () => void;
  voiceEnabled?: boolean;
  voiceResponseEnabled?: boolean;
  externalOpen?: boolean;
  onExternalOpenChange?: (open: boolean) => void;
}

interface RecentCommand {
  text: string;
  success: boolean;
}

export default function VoiceControl({
  onNavigate,
  onOpenTerminal,
  onOpenChatbot,
  onOpenSettings,
  onOpenCommandPalette,
  onToggleTheme,
  onDownloadResume,
  voiceEnabled = true,
  voiceResponseEnabled = true,
  externalOpen,
  onExternalOpenChange,
}: VoiceControlProps) {
  const [internalModalOpen, setInternalModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const isModalOpen = externalOpen !== undefined ? externalOpen : internalModalOpen;
  const setIsModalOpen = useCallback((open: boolean) => {
    if (onExternalOpenChange) {
      onExternalOpenChange(open);
    } else {
      setInternalModalOpen(open);
    }
  }, [onExternalOpenChange]);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [recentCommands, setRecentCommands] = useState<RecentCommand[]>([]);
  const [lastResponse, setLastResponse] = useState<string | null>(null);
  const lastProcessedTranscript = useRef<string | null>(null);
  
  const speechState = useSpeechRecognition();

  // Mark as mounted on client to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Execute command action
  const executeAction = useCallback((action: string, response: string) => {
    const [type, target] = action.split(':');

    switch (type) {
      case 'navigate':
        onNavigate(target);
        break;
      case 'info':
        // For info commands, navigate to relevant section
        if (target === 'skills') onNavigate('skills');
        else if (target === 'agentix' || target === 'projects') onNavigate('projects');
        else if (target === 'achievements') onNavigate('achievements');
        else if (target === 'experience') onNavigate('experience');
        else if (target === 'who') onNavigate('about');
        break;
      case 'open':
        if (target === 'terminal') onOpenTerminal();
        else if (target === 'chatbot') onOpenChatbot();
        else if (target === 'games') onNavigate('games');
        else if (target === 'contact') onNavigate('contact');
        break;
      case 'download':
        if (target === 'resume') onDownloadResume();
        break;
      case 'system':
        if (target === 'toggle-theme') onToggleTheme();
        else if (target === 'settings') onOpenSettings();
        else if (target === 'help') setIsHelpOpen(true);
        else if (target === 'stop') {
          speechState.stopListening();
          setIsModalOpen(false);
        }
        else if (target === 'command-palette') onOpenCommandPalette();
        break;
    }

    // Speak response if enabled
    if (voiceResponseEnabled && response) {
      speak(response).catch(console.error);
      setLastResponse(response);
    }
  }, [onNavigate, onOpenTerminal, onOpenChatbot, onOpenSettings, onOpenCommandPalette, onToggleTheme, onDownloadResume, speechState, voiceResponseEnabled, setIsModalOpen]);

  // Process transcript when it changes
  useEffect(() => {
    if (speechState.status === 'processing' && speechState.transcript) {
      const transcript = speechState.transcript.toLowerCase().trim();
      
      // Prevent processing the same transcript multiple times
      if (lastProcessedTranscript.current === transcript) {
        return;
      }
      lastProcessedTranscript.current = transcript;
      
      // Try to find a matching command
      let matchedCommand: VoiceCommand | null = null;
      
      for (const command of voiceCommands) {
        for (const pattern of command.patterns) {
          if (pattern.test(transcript)) {
            matchedCommand = command;
            break;
          }
        }
        if (matchedCommand) break;
      }

      // If no exact match, try fuzzy matching
      if (!matchedCommand) {
        matchedCommand = findClosestCommand(transcript);
      }

      if (matchedCommand) {
        // Add to recent commands - use queueMicrotask to avoid synchronous setState in effect
        queueMicrotask(() => {
          setRecentCommands(prev => [
            { text: speechState.transcript, success: true },
            ...prev.slice(0, 4)
          ]);
        });

        // Execute the command - use queueMicrotask to avoid synchronous setState in effect
        queueMicrotask(() => {
          executeAction(matchedCommand.action, matchedCommand.response);
        });
        
        // Reset and close modal after a short delay (for feedback)
        setTimeout(() => {
          speechState.resetTranscript();
          lastProcessedTranscript.current = null;
          // Auto-close modal after successful command (except for help)
          if (matchedCommand?.action !== 'system:help') {
            setTimeout(() => setIsModalOpen(false), 1000);
          }
        }, 500);
      } else {
        // No match found - use queueMicrotask to avoid synchronous setState in effect
        queueMicrotask(() => {
          setRecentCommands(prev => [
            { text: speechState.transcript, success: false },
            ...prev.slice(0, 4)
          ]);
        });

        const errorResponse = "Sorry, I didn't understand that. Try saying 'help' to see available commands.";
        if (voiceResponseEnabled) {
          speak(errorResponse).catch(console.error);
        }
        queueMicrotask(() => {
          setLastResponse(errorResponse);
        });
        
        setTimeout(() => {
          speechState.resetTranscript();
          lastProcessedTranscript.current = null;
        }, 2000);
      }
    }
  }, [speechState.status, speechState.transcript, executeAction, speechState, voiceResponseEnabled, setIsModalOpen]);

  const handleButtonClick = useCallback(() => {
    if (speechState.isSupported) {
      setIsModalOpen(true);
    }
  }, [speechState.isSupported, setIsModalOpen]);

  const handleStartListening = useCallback(() => {
    setLastResponse(null);
    speechState.startListening();
  }, [speechState]);

  const handleStopListening = useCallback(() => {
    speechState.stopListening();
  }, [speechState]);

  const handleCloseModal = useCallback(() => {
    speechState.stopListening();
    speechState.resetTranscript();
    setIsModalOpen(false);
    setLastResponse(null);
  }, [speechState, setIsModalOpen]);

  const handleShowHelp = useCallback(() => {
    setIsHelpOpen(true);
  }, []);

  const handleCloseHelp = useCallback(() => {
    setIsHelpOpen(false);
  }, []);

  const handleTryCommand = useCallback((command: string) => {
    setIsHelpOpen(false);
    // Simulate the command being spoken
    setTimeout(() => {
      // Find the matching command and execute it
      for (const cmd of voiceCommands) {
        for (const pattern of cmd.patterns) {
          if (pattern.test(command.toLowerCase())) {
            setRecentCommands(prev => [
              { text: command, success: true },
              ...prev.slice(0, 4)
            ]);
            executeAction(cmd.action, cmd.response);
            setTimeout(() => setIsModalOpen(false), 1500);
            return;
          }
        }
      }
    }, 300);
  }, [executeAction, setIsModalOpen]);

  // Don't render until mounted to prevent hydration mismatch
  if (!voiceEnabled || !isMounted) {
    return null;
  }

  return (
    <>
      {/* Floating Voice Control Button - positioned above chatbot */}
      <AnimatePresence>
        {!isModalOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleButtonClick}
            disabled={!speechState.isSupported}
            className={`fixed bottom-[170px] right-4 z-[9998] flex items-center gap-2 px-2 py-3 rounded-full shadow-lg hover:shadow-xl transition-all group ${
              speechState.isSupported
                ? 'bg-gradient-to-r from-purple-600 to-[var(--vscode-accent)] text-white cursor-pointer'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
            }`}
            aria-label={speechState.isSupported ? 'Voice Control' : 'Voice control not supported'}
            title={speechState.isSupported ? 'Voice Control (Alt+V)' : 'Voice control not supported in this browser'}
          >
            {speechState.isListening ? (
              <>
                <span className="relative flex h-5 w-5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 items-center justify-center">
                    <Mic size={14} className="text-white" />
                  </span>
                </span>
                <span className="font-medium">Listening...</span>
              </>
            ) : (
              <>
                <Mic size={20} className={speechState.isSupported ? 'group-hover:scale-110 transition-transform' : ''} />
                <span className="font-medium">Voice Control</span>
                {speechState.isSupported && (
                  <Sparkles size={16} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                )}
              </>
            )}
            {/* Pulse indicator for supported browsers */}
            {speechState.isSupported && !isModalOpen && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Voice Button for Status Bar */}
      <VoiceButton
        isListening={speechState.isListening}
        isSupported={speechState.isSupported}
        status={speechState.status}
        onClick={handleButtonClick}
      />

      {/* Voice Modal */}
      <VoiceModal
        isOpen={isModalOpen}
        speechState={speechState}
        onClose={handleCloseModal}
        onStartListening={handleStartListening}
        onStopListening={handleStopListening}
        onShowHelp={handleShowHelp}
        recentCommands={recentCommands}
        lastResponse={lastResponse}
      />

      {/* Help Modal */}
      <VoiceHelpModal
        isOpen={isHelpOpen}
        onClose={handleCloseHelp}
        onTryCommand={handleTryCommand}
      />
    </>
  );
}

// Export all voice control components
export { default as VoiceButton } from './VoiceButton';
export { default as VoiceModal } from './VoiceModal';
export { default as VoiceHelpModal } from './VoiceHelpModal';
export { default as VoiceWaveform } from './VoiceWaveform';
export { useSpeechRecognition, speak, getVoices } from './useSpeechRecognition';
export { voiceCommands, findClosestCommand, getCommandsByCategory, getAllCommandCategories, categoryInfo } from './VoiceCommands';
export type { VoiceCommand } from './VoiceCommands';
