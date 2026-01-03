'use client';

import { useState, useEffect, useCallback } from 'react';
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
  const isModalOpen = externalOpen !== undefined ? externalOpen : internalModalOpen;
  const setIsModalOpen = (open: boolean) => {
    if (onExternalOpenChange) {
      onExternalOpenChange(open);
    } else {
      setInternalModalOpen(open);
    }
  };
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [recentCommands, setRecentCommands] = useState<RecentCommand[]>([]);
  const [lastResponse, setLastResponse] = useState<string | null>(null);
  
  const speechState = useSpeechRecognition();

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
  }, [onNavigate, onOpenTerminal, onOpenChatbot, onOpenSettings, onOpenCommandPalette, onToggleTheme, onDownloadResume, speechState, voiceResponseEnabled]);

  // Process transcript when it changes
  useEffect(() => {
    if (speechState.status === 'processing' && speechState.transcript) {
      const transcript = speechState.transcript.toLowerCase().trim();
      
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
        // Add to recent commands
        setRecentCommands(prev => [
          { text: speechState.transcript, success: true },
          ...prev.slice(0, 4)
        ]);

        // Execute the command
        executeAction(matchedCommand.action, matchedCommand.response);
        
        // Reset and close modal after a short delay (for feedback)
        setTimeout(() => {
          speechState.resetTranscript();
          // Auto-close modal after successful command (except for help)
          if (matchedCommand?.action !== 'system:help') {
            setTimeout(() => setIsModalOpen(false), 1000);
          }
        }, 500);
      } else {
        // No match found
        setRecentCommands(prev => [
          { text: speechState.transcript, success: false },
          ...prev.slice(0, 4)
        ]);

        const errorResponse = "Sorry, I didn't understand that. Try saying 'help' to see available commands.";
        if (voiceResponseEnabled) {
          speak(errorResponse).catch(console.error);
        }
        setLastResponse(errorResponse);
        
        setTimeout(() => {
          speechState.resetTranscript();
        }, 2000);
      }
    }
  }, [speechState.status, speechState.transcript, executeAction, speechState, voiceResponseEnabled]);

  const handleButtonClick = useCallback(() => {
    if (speechState.isSupported) {
      setIsModalOpen(true);
    }
  }, [speechState.isSupported]);

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
  }, [speechState]);

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
  }, [executeAction]);

  if (!voiceEnabled) {
    return null;
  }

  return (
    <>
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
