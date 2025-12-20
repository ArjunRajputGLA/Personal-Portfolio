'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings as SettingsIcon, Moon, Sun, Monitor, Type, Eye, EyeOff, Zap, Volume2, VolumeX, Accessibility } from 'lucide-react';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SettingsState;
  onSettingsChange: (settings: SettingsState) => void;
}

export interface SettingsState {
  appearance: {
    theme: 'dark' | 'light' | 'high-contrast';
    fontSize: number;
    fontFamily: string;
    showLineNumbers: boolean;
    showMinimap: boolean;
  };
  terminal: {
    cursorStyle: 'block' | 'line' | 'underline';
    cursorBlink: boolean;
    fontSize: number;
  };
  features: {
    enableAnimations: boolean;
    enableSoundEffects: boolean;
    enableEasterEggs: boolean;
  };
  accessibility: {
    highContrast: boolean;
    reducedMotion: boolean;
  };
}

export const defaultSettings: SettingsState = {
  appearance: {
    theme: 'dark',
    fontSize: 14,
    fontFamily: 'Fira Code',
    showLineNumbers: true,
    showMinimap: true,
  },
  terminal: {
    cursorStyle: 'block',
    cursorBlink: true,
    fontSize: 12,
  },
  features: {
    enableAnimations: true,
    enableSoundEffects: false,
    enableEasterEggs: true,
  },
  accessibility: {
    highContrast: false,
    reducedMotion: false,
  },
};

export default function SettingsPanel({ isOpen, onClose, settings, onSettingsChange }: SettingsProps) {
  const [activeTab, setActiveTab] = useState<'appearance' | 'terminal' | 'features' | 'accessibility'>('appearance');
  const [localSettings, setLocalSettings] = useState<SettingsState>(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleChange = <T extends keyof SettingsState>(
    category: T,
    key: keyof SettingsState[T],
    value: SettingsState[T][keyof SettingsState[T]]
  ) => {
    const newSettings = {
      ...localSettings,
      [category]: {
        ...localSettings[category],
        [key]: value,
      },
    };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const tabs = [
    { id: 'appearance' as const, label: 'Appearance', icon: Sun },
    { id: 'terminal' as const, label: 'Terminal', icon: Monitor },
    { id: 'features' as const, label: 'Features', icon: Zap },
    { id: 'accessibility' as const, label: 'Accessibility', icon: Accessibility },
  ];

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
            className="fixed top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[80vh] z-50"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="bg-[var(--vscode-sidebar)] border border-[var(--vscode-border)] rounded-lg shadow-2xl overflow-hidden mx-4">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--vscode-sidebar-border)]">
                <div className="flex items-center gap-2">
                  <SettingsIcon size={18} className="text-[var(--vscode-accent)]" />
                  <span className="font-medium">Settings</span>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-[var(--vscode-line-highlight)] rounded"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex h-[500px]">
                {/* Sidebar */}
                <div className="w-48 border-r border-[var(--vscode-sidebar-border)] p-2">
                  {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm text-left transition-colors ${
                          activeTab === tab.id
                            ? 'bg-[var(--vscode-selection)] text-[var(--vscode-text)]'
                            : 'text-[var(--vscode-text-muted)] hover:bg-[var(--vscode-line-highlight)]'
                        }`}
                      >
                        <Icon size={16} />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Content */}
                <div className="flex-1 p-6 overflow-auto">
                  {activeTab === 'appearance' && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium mb-4">Appearance</h3>
                      
                      {/* Theme */}
                      <div>
                        <label className="block text-sm text-[var(--vscode-text-muted)] mb-2">Theme</label>
                        <div className="flex gap-2">
                          {(['dark', 'light', 'high-contrast'] as const).map(theme => (
                            <button
                              key={theme}
                              onClick={() => handleChange('appearance', 'theme', theme)}
                              className={`flex items-center gap-2 px-4 py-2 rounded border transition-colors ${
                                localSettings.appearance.theme === theme
                                  ? 'border-[var(--vscode-accent)] bg-[var(--vscode-accent)]/10'
                                  : 'border-[var(--vscode-border)] hover:border-[var(--vscode-accent)]'
                              }`}
                            >
                              {theme === 'dark' && <Moon size={16} />}
                              {theme === 'light' && <Sun size={16} />}
                              {theme === 'high-contrast' && <Monitor size={16} />}
                              <span className="capitalize">{theme.replace('-', ' ')}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Font Size */}
                      <div>
                        <label className="block text-sm text-[var(--vscode-text-muted)] mb-2">
                          Font Size: {localSettings.appearance.fontSize}px
                        </label>
                        <input
                          type="range"
                          min="10"
                          max="24"
                          value={localSettings.appearance.fontSize}
                          onChange={(e) => handleChange('appearance', 'fontSize', parseInt(e.target.value))}
                          className="w-full accent-[var(--vscode-accent)]"
                        />
                      </div>

                      {/* Font Family */}
                      <div>
                        <label className="block text-sm text-[var(--vscode-text-muted)] mb-2">Font Family</label>
                        <select
                          value={localSettings.appearance.fontFamily}
                          onChange={(e) => handleChange('appearance', 'fontFamily', e.target.value)}
                          className="w-full px-3 py-2 bg-[var(--vscode-bg)] border border-[var(--vscode-border)] rounded text-[var(--vscode-text)]"
                        >
                          <option value="Fira Code">Fira Code</option>
                          <option value="JetBrains Mono">JetBrains Mono</option>
                          <option value="Consolas">Consolas</option>
                          <option value="Monaco">Monaco</option>
                        </select>
                      </div>

                      {/* Toggles */}
                      <div className="space-y-3">
                        <label className="flex items-center justify-between">
                          <span className="text-sm">Show Line Numbers</span>
                          <button
                            onClick={() => handleChange('appearance', 'showLineNumbers', !localSettings.appearance.showLineNumbers)}
                            className={`w-12 h-6 rounded-full transition-colors ${
                              localSettings.appearance.showLineNumbers ? 'bg-[var(--vscode-accent)]' : 'bg-[var(--vscode-border)]'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                              localSettings.appearance.showLineNumbers ? 'translate-x-6' : 'translate-x-0.5'
                            }`} />
                          </button>
                        </label>
                      </div>
                    </div>
                  )}

                  {activeTab === 'terminal' && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium mb-4">Terminal</h3>
                      
                      {/* Cursor Style */}
                      <div>
                        <label className="block text-sm text-[var(--vscode-text-muted)] mb-2">Cursor Style</label>
                        <div className="flex gap-2">
                          {(['block', 'line', 'underline'] as const).map(style => (
                            <button
                              key={style}
                              onClick={() => handleChange('terminal', 'cursorStyle', style)}
                              className={`px-4 py-2 rounded border transition-colors capitalize ${
                                localSettings.terminal.cursorStyle === style
                                  ? 'border-[var(--vscode-accent)] bg-[var(--vscode-accent)]/10'
                                  : 'border-[var(--vscode-border)] hover:border-[var(--vscode-accent)]'
                              }`}
                            >
                              {style}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Terminal Font Size */}
                      <div>
                        <label className="block text-sm text-[var(--vscode-text-muted)] mb-2">
                          Font Size: {localSettings.terminal.fontSize}px
                        </label>
                        <input
                          type="range"
                          min="10"
                          max="20"
                          value={localSettings.terminal.fontSize}
                          onChange={(e) => handleChange('terminal', 'fontSize', parseInt(e.target.value))}
                          className="w-full accent-[var(--vscode-accent)]"
                        />
                      </div>

                      {/* Cursor Blink */}
                      <label className="flex items-center justify-between">
                        <span className="text-sm">Cursor Blink</span>
                        <button
                          onClick={() => handleChange('terminal', 'cursorBlink', !localSettings.terminal.cursorBlink)}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            localSettings.terminal.cursorBlink ? 'bg-[var(--vscode-accent)]' : 'bg-[var(--vscode-border)]'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                            localSettings.terminal.cursorBlink ? 'translate-x-6' : 'translate-x-0.5'
                          }`} />
                        </button>
                      </label>
                    </div>
                  )}

                  {activeTab === 'features' && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium mb-4">Features</h3>
                      
                      <label className="flex items-center justify-between">
                        <div>
                          <span className="text-sm block">Enable Animations</span>
                          <span className="text-xs text-[var(--vscode-text-muted)]">Smooth transitions and effects</span>
                        </div>
                        <button
                          onClick={() => handleChange('features', 'enableAnimations', !localSettings.features.enableAnimations)}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            localSettings.features.enableAnimations ? 'bg-[var(--vscode-accent)]' : 'bg-[var(--vscode-border)]'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                            localSettings.features.enableAnimations ? 'translate-x-6' : 'translate-x-0.5'
                          }`} />
                        </button>
                      </label>

                      <label className="flex items-center justify-between">
                        <div>
                          <span className="text-sm block">Enable Sound Effects</span>
                          <span className="text-xs text-[var(--vscode-text-muted)]">Subtle audio feedback</span>
                        </div>
                        <button
                          onClick={() => handleChange('features', 'enableSoundEffects', !localSettings.features.enableSoundEffects)}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            localSettings.features.enableSoundEffects ? 'bg-[var(--vscode-accent)]' : 'bg-[var(--vscode-border)]'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                            localSettings.features.enableSoundEffects ? 'translate-x-6' : 'translate-x-0.5'
                          }`} />
                        </button>
                      </label>

                      <label className="flex items-center justify-between">
                        <div>
                          <span className="text-sm block">Enable Easter Eggs</span>
                          <span className="text-xs text-[var(--vscode-text-muted)]">Hidden features and surprises</span>
                        </div>
                        <button
                          onClick={() => handleChange('features', 'enableEasterEggs', !localSettings.features.enableEasterEggs)}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            localSettings.features.enableEasterEggs ? 'bg-[var(--vscode-accent)]' : 'bg-[var(--vscode-border)]'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                            localSettings.features.enableEasterEggs ? 'translate-x-6' : 'translate-x-0.5'
                          }`} />
                        </button>
                      </label>
                    </div>
                  )}

                  {activeTab === 'accessibility' && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium mb-4">Accessibility</h3>
                      
                      <label className="flex items-center justify-between">
                        <div>
                          <span className="text-sm block">High Contrast</span>
                          <span className="text-xs text-[var(--vscode-text-muted)]">Increases color contrast</span>
                        </div>
                        <button
                          onClick={() => handleChange('accessibility', 'highContrast', !localSettings.accessibility.highContrast)}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            localSettings.accessibility.highContrast ? 'bg-[var(--vscode-accent)]' : 'bg-[var(--vscode-border)]'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                            localSettings.accessibility.highContrast ? 'translate-x-6' : 'translate-x-0.5'
                          }`} />
                        </button>
                      </label>

                      <label className="flex items-center justify-between">
                        <div>
                          <span className="text-sm block">Reduced Motion</span>
                          <span className="text-xs text-[var(--vscode-text-muted)]">Minimizes animations</span>
                        </div>
                        <button
                          onClick={() => handleChange('accessibility', 'reducedMotion', !localSettings.accessibility.reducedMotion)}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            localSettings.accessibility.reducedMotion ? 'bg-[var(--vscode-accent)]' : 'bg-[var(--vscode-border)]'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                            localSettings.accessibility.reducedMotion ? 'translate-x-6' : 'translate-x-0.5'
                          }`} />
                        </button>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--vscode-sidebar-border)] bg-[var(--vscode-bg)]">
                <span className="text-xs text-[var(--vscode-text-muted)]">
                  Settings are automatically saved
                </span>
                <button
                  onClick={onClose}
                  className="px-4 py-1.5 bg-[var(--vscode-accent)] text-white rounded text-sm hover:bg-[var(--vscode-accent-hover)] transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
