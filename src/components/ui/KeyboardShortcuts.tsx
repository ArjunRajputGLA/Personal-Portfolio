'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Command, Terminal, Keyboard } from 'lucide-react';

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
}

const shortcuts = {
  navigation: [
    { keys: ['Ctrl/Cmd', 'P'], description: 'Open Command Palette' },
    { keys: ['Ctrl/Cmd', 'B'], description: 'Toggle Sidebar' },
    { keys: ['Ctrl/Cmd', 'J'], description: 'Toggle Terminal' },
    { keys: ['Ctrl/Cmd', '`'], description: 'Focus Terminal' },
    { keys: ['Ctrl/Cmd', 'F'], description: 'Find in Page' },
    { keys: ['Ctrl/Cmd', ','], description: 'Open Settings' },
  ],
  terminal: [
    { keys: ['↑', '↓'], description: 'Command History' },
    { keys: ['Tab'], description: 'Autocomplete' },
    { keys: ['Ctrl', 'C'], description: 'Clear Input / Cancel' },
    { keys: ['Ctrl', 'L'], description: 'Clear Terminal' },
  ],
  general: [
    { keys: ['Esc'], description: 'Close Modals / Cancel' },
    { keys: ['F1'], description: 'Show This Help' },
    { keys: ['?'], description: 'Quick Help' },
    { keys: ['Home'], description: 'Scroll to Top' },
    { keys: ['End'], description: 'Scroll to Bottom' },
  ],
  easterEggs: [
    { keys: ['konami'], description: 'Try typing "konami" in terminal...' },
    { keys: ['matrix'], description: 'Enter the Matrix...' },
    { keys: ['sudo'], description: 'Do you have permissions?' },
    { keys: ['cowsay'], description: 'Moo!' },
    { keys: ['neofetch'], description: 'System info' },
  ],
};

export default function KeyboardShortcuts({ isOpen, onClose }: KeyboardShortcutsProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-50 px-4"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
          >
            <div className="bg-[var(--vscode-sidebar)] border border-[var(--vscode-border)] rounded-lg shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--vscode-sidebar-border)]">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[var(--vscode-accent)] rounded-lg">
                    <Keyboard size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Keyboard Shortcuts</h2>
                    <p className="text-xs text-[var(--vscode-text-muted)]">Navigate like a pro</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-[var(--vscode-line-highlight)] rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[60vh] overflow-auto">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Navigation */}
                  <div>
                    <h3 className="flex items-center gap-2 text-sm font-medium text-[var(--vscode-accent)] mb-3">
                      <Command size={14} />
                      Navigation
                    </h3>
                    <div className="space-y-2">
                      {shortcuts.navigation.map((shortcut, index) => (
                        <div key={index} className="flex items-center justify-between py-1.5">
                          <span className="text-sm text-[var(--vscode-text-muted)]">{shortcut.description}</span>
                          <div className="flex items-center gap-1">
                            {shortcut.keys.map((key, keyIndex) => (
                              <span key={keyIndex}>
                                <kbd className="px-2 py-1 bg-[var(--vscode-bg)] border border-[var(--vscode-border)] rounded text-xs font-mono">
                                  {key}
                                </kbd>
                                {keyIndex < shortcut.keys.length - 1 && (
                                  <span className="mx-1 text-[var(--vscode-text-muted)]">+</span>
                                )}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Terminal */}
                  <div>
                    <h3 className="flex items-center gap-2 text-sm font-medium text-green-400 mb-3">
                      <Terminal size={14} />
                      Terminal
                    </h3>
                    <div className="space-y-2">
                      {shortcuts.terminal.map((shortcut, index) => (
                        <div key={index} className="flex items-center justify-between py-1.5">
                          <span className="text-sm text-[var(--vscode-text-muted)]">{shortcut.description}</span>
                          <div className="flex items-center gap-1">
                            {shortcut.keys.map((key, keyIndex) => (
                              <span key={keyIndex}>
                                <kbd className="px-2 py-1 bg-[var(--vscode-bg)] border border-[var(--vscode-border)] rounded text-xs font-mono">
                                  {key}
                                </kbd>
                                {keyIndex < shortcut.keys.length - 1 && (
                                  <span className="mx-1 text-[var(--vscode-text-muted)]">+</span>
                                )}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* General */}
                  <div>
                    <h3 className="flex items-center gap-2 text-sm font-medium text-purple-400 mb-3">
                      <Keyboard size={14} />
                      General
                    </h3>
                    <div className="space-y-2">
                      {shortcuts.general.map((shortcut, index) => (
                        <div key={index} className="flex items-center justify-between py-1.5">
                          <span className="text-sm text-[var(--vscode-text-muted)]">{shortcut.description}</span>
                          <div className="flex items-center gap-1">
                            {shortcut.keys.map((key, keyIndex) => (
                              <span key={keyIndex}>
                                <kbd className="px-2 py-1 bg-[var(--vscode-bg)] border border-[var(--vscode-border)] rounded text-xs font-mono">
                                  {key}
                                </kbd>
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Easter Eggs */}
                  <div>
                    <h3 className="flex items-center gap-2 text-sm font-medium text-yellow-400 mb-3">
                      🎮 Easter Eggs
                    </h3>
                    <div className="space-y-2">
                      {shortcuts.easterEggs.map((shortcut, index) => (
                        <div key={index} className="flex items-center justify-between py-1.5">
                          <span className="text-sm text-[var(--vscode-text-muted)]">{shortcut.description}</span>
                          <kbd className="px-2 py-1 bg-yellow-400/10 border border-yellow-400/30 rounded text-xs font-mono text-yellow-400">
                            {shortcut.keys[0]}
                          </kbd>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-[var(--vscode-sidebar-border)] bg-[var(--vscode-bg)]">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--vscode-text-muted)]">
                    Pro tip: Open terminal and type <kbd className="px-1.5 py-0.5 bg-[var(--vscode-sidebar)] rounded text-[var(--vscode-accent)]">help</kbd> for more commands
                  </span>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-[var(--vscode-sidebar)] border border-[var(--vscode-border)] rounded text-xs">F1</kbd>
                    <span className="text-xs text-[var(--vscode-text-muted)]">or</span>
                    <kbd className="px-2 py-1 bg-[var(--vscode-sidebar)] border border-[var(--vscode-border)] rounded text-xs">?</kbd>
                    <span className="text-xs text-[var(--vscode-text-muted)]">to show this</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
