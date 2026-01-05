'use client';

import { useEffect, useRef } from 'react';
import { X, Keyboard, Lightbulb, Mic } from 'lucide-react';
import { getAllCommandCategories, categoryInfo } from './VoiceCommands';

interface VoiceHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTryCommand: (command: string) => void;
}

export default function VoiceHelpModal({ isOpen, onClose, onTryCommand }: VoiceHelpModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const commandCategories = getAllCommandCategories();

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

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[10110] flex items-center justify-center bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Voice Commands Help"
    >
      <div
        ref={modalRef}
        className="w-full max-w-2xl max-h-[80vh] mx-4 bg-[#1e1e1e] border border-[var(--vscode-border)] rounded-lg shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--vscode-border)]">
          <div className="flex items-center gap-2">
            <Mic className="text-[var(--vscode-accent)]" size={20} />
            <h2 className="text-lg font-semibold text-[var(--vscode-text)]">Available Voice Commands</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            aria-label="Close help"
          >
            <X size={18} className="text-[var(--vscode-text-muted)]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {commandCategories.map(({ category, commands }) => (
            <div key={category}>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--vscode-text)] mb-3">
                <span>{categoryInfo[category].icon}</span>
                <span>{categoryInfo[category].label.toUpperCase()}</span>
              </h3>
              
              <div className="space-y-2">
                {commands.map(command => (
                  <div 
                    key={command.id}
                    className="group p-3 bg-[#252526] rounded-lg hover:bg-[#2d2d2d] transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm text-[var(--vscode-text)] mb-1">
                          {command.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {command.examples.map((example, idx) => (
                            <button
                              key={idx}
                              onClick={() => onTryCommand(example)}
                              className="text-xs px-2 py-1 bg-[#1e1e1e] text-[var(--vscode-accent)] rounded hover:bg-[var(--vscode-accent)]/20 transition-colors"
                              title={`Try: "${example}"`}
                            >
                              &quot;{example}&quot;
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Tips Section */}
          <div className="p-4 bg-[var(--vscode-accent)]/10 rounded-lg border border-[var(--vscode-accent)]/30">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--vscode-accent)] mb-3">
              <Lightbulb size={16} />
              <span>TIPS</span>
            </h3>
            <ul className="space-y-2 text-sm text-[var(--vscode-text-muted)]">
              <li className="flex items-start gap-2">
                <span className="text-[var(--vscode-accent)]">•</span>
                <span>Speak clearly and at a natural pace</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--vscode-accent)]">•</span>
                <span>Commands work with natural variations (e.g., &quot;show projects&quot; or &quot;go to projects&quot;)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--vscode-accent)]">•</span>
                <span>Say &quot;help&quot; anytime to see this list</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--vscode-accent)]">•</span>
                <span>Say &quot;stop&quot; or &quot;cancel&quot; to close voice control</span>
              </li>
            </ul>
          </div>

          {/* Keyboard Shortcut */}
          <div className="p-4 bg-[#252526] rounded-lg">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--vscode-text)] mb-2">
              <Keyboard size={16} />
              <span>KEYBOARD SHORTCUT</span>
            </h3>
            <p className="text-sm text-[var(--vscode-text-muted)]">
              Press <kbd className="px-2 py-1 bg-[#1e1e1e] rounded text-[var(--vscode-accent)] font-mono">Alt + V</kbd> to activate voice control from anywhere
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-[var(--vscode-border)] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[var(--vscode-accent)] text-white hover:bg-[var(--vscode-accent)]/80 rounded transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
