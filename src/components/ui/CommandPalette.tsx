'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, FileCode, User, Trophy, Image, Mail, Home, 
  Puzzle, GitBranch, Download, Moon, Sun, Terminal, Settings,
  ExternalLink, Zap, Folder, Clock, Command, Gamepad2
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: string) => void;
  onThemeToggle?: () => void;
  onTerminalToggle?: () => void;
  onSettingsOpen?: () => void;
  onOpenSettings?: () => void;
  onOpenTerminal?: () => void;
  onToggleTheme?: () => void;
  isDarkTheme?: boolean;
}

interface CommandItem {
  id: string;
  label: string;
  category: 'navigation' | 'action' | 'settings' | 'project' | 'recent';
  icon: React.ElementType;
  shortcut?: string;
  description?: string;
  section?: string;
  file?: string;
}

const MAX_RECENT = 5;

export default function CommandPalette({ 
  isOpen, 
  onClose, 
  onNavigate, 
  onThemeToggle,
  onTerminalToggle,
  onSettingsOpen,
  onOpenSettings,
  onOpenTerminal,
  onToggleTheme,
  isDarkTheme = true
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mode, setMode] = useState<'commands' | 'files' | 'actions'>('commands');
  const [recentList, setRecentList] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const baseCommands: CommandItem[] = useMemo(() => [
    // Navigation commands
    { id: 'home', label: 'Go to Home', category: 'navigation', icon: Home, section: 'home', file: 'index.tsx' },
    { id: 'about', label: 'Go to About', category: 'navigation', icon: User, section: 'about', file: 'about.md' },
    { id: 'skills', label: 'Go to Skills', category: 'navigation', icon: Puzzle, section: 'skills', file: 'skills.json' },
    { id: 'projects', label: 'Go to Projects', category: 'navigation', icon: Folder, section: 'projects', file: 'projects/' },
    { id: 'experience', label: 'Go to Experience', category: 'navigation', icon: GitBranch, section: 'experience', file: 'experience.log' },
    { id: 'achievements', label: 'Go to Achievements', category: 'navigation', icon: Trophy, section: 'achievements', file: 'achievements.yaml' },
    { id: 'gallery', label: 'Go to Gallery', category: 'navigation', icon: Image, section: 'gallery', file: 'media/' },
    { id: 'games', label: '🎮 Open Games Playground', category: 'navigation', icon: Gamepad2, section: 'games', file: 'games/', description: '9 brain-training games to play!' },
    { id: 'contact', label: 'Go to Contact', category: 'navigation', icon: Mail, section: 'contact', file: 'contact.tsx' },
    
    // Action commands
    { id: 'download-resume', label: 'Download Resume', category: 'action', icon: Download, description: 'Download Arjun\'s resume as PDF' },
    { id: 'contact-arjun', label: 'Contact Arjun', category: 'action', icon: Mail, section: 'contact', description: 'Open contact form' },
    { id: 'view-github', label: 'View GitHub Profile', category: 'action', icon: ExternalLink, description: 'Open GitHub in new tab' },
    { id: 'view-linkedin', label: 'View LinkedIn Profile', category: 'action', icon: ExternalLink, description: 'Open LinkedIn in new tab' },
    { id: 'view-leetcode', label: 'View LeetCode Profile', category: 'action', icon: ExternalLink, description: 'Open LeetCode in new tab' },
    { id: 'copy-email', label: 'Copy Email Address', category: 'action', icon: Mail, description: 'Copy email to clipboard' },
    { id: 'new-window', label: 'Open in New Window', category: 'action', icon: ExternalLink, description: 'Open portfolio in new tab' },
    
    // Settings commands
    { id: 'toggle-theme', label: isDarkTheme ? 'Switch to Light Theme' : 'Switch to Dark Theme', category: 'settings', icon: isDarkTheme ? Sun : Moon, shortcut: 'Ctrl+T' },
    { id: 'toggle-terminal', label: 'Toggle Terminal', category: 'settings', icon: Terminal, shortcut: 'Ctrl+`' },
    { id: 'open-settings', label: 'Open Settings', category: 'settings', icon: Settings, shortcut: 'Ctrl+,' },
    
    // Project shortcuts
    { id: 'project-agentix', label: 'View AGENTIX Project', category: 'project', icon: Zap, description: 'AI Multi-Agent Platform', section: 'projects' },
    { id: 'project-malware', label: 'View Malware Detection', category: 'project', icon: FileCode, description: 'ML Security System', section: 'projects' },
  ], [isDarkTheme]);

  // File items for Files mode
  const fileItems: CommandItem[] = useMemo(() => [
    { id: 'file-index', label: 'index.tsx', category: 'navigation', icon: FileCode, section: 'home', file: 'src/index.tsx', description: 'Home page component' },
    { id: 'file-about', label: 'about.md', category: 'navigation', icon: FileCode, section: 'about', file: 'src/about.md', description: 'About section' },
    { id: 'file-skills', label: 'skills.json', category: 'navigation', icon: FileCode, section: 'skills', file: 'src/skills.json', description: 'Skills data' },
    { id: 'file-projects', label: 'projects/', category: 'navigation', icon: Folder, section: 'projects', file: 'src/projects/', description: 'Projects directory' },
    { id: 'file-experience', label: 'experience.log', category: 'navigation', icon: FileCode, section: 'experience', file: 'src/experience.log', description: 'Work experience' },
    { id: 'file-achievements', label: 'achievements.yaml', category: 'navigation', icon: FileCode, section: 'achievements', file: 'src/achievements.yaml', description: 'Achievements & awards' },
    { id: 'file-gallery', label: 'media/', category: 'navigation', icon: Folder, section: 'gallery', file: 'media/', description: 'Gallery & photos' },
    { id: 'file-games', label: 'games/', category: 'navigation', icon: Gamepad2, section: 'games', file: 'src/games/', description: '🎮 Games Playground' },
    { id: 'file-contact', label: 'contact.tsx', category: 'navigation', icon: FileCode, section: 'contact', file: 'src/contact.tsx', description: 'Contact form' },
    { id: 'file-resume', label: 'resume.pdf', category: 'action', icon: Download, file: 'public/resume.pdf', description: 'Download resume' },
    { id: 'file-globals', label: 'globals.css', category: 'navigation', icon: FileCode, file: 'src/globals.css', description: 'Global styles' },
    { id: 'file-layout', label: 'layout.tsx', category: 'navigation', icon: FileCode, file: 'src/layout.tsx', description: 'Root layout' },
    { id: 'file-package', label: 'package.json', category: 'navigation', icon: FileCode, file: 'package.json', description: 'Project dependencies' },
  ], []);

  // Action items for Actions mode
  const actionItems: CommandItem[] = useMemo(() => [
    { id: 'action-download-resume', label: 'Download Resume', category: 'action', icon: Download, description: 'Download Arjun\'s resume as PDF' },
    { id: 'action-contact', label: 'Send Message', category: 'action', icon: Mail, section: 'contact', description: 'Open contact form' },
    { id: 'action-github', label: 'Open GitHub', category: 'action', icon: ExternalLink, description: 'View GitHub profile' },
    { id: 'action-linkedin', label: 'Open LinkedIn', category: 'action', icon: ExternalLink, description: 'View LinkedIn profile' },
    { id: 'action-leetcode', label: 'Open LeetCode', category: 'action', icon: ExternalLink, description: 'View LeetCode profile' },
    { id: 'action-copy-email', label: 'Copy Email', category: 'action', icon: Mail, description: 'Copy email to clipboard' },
    { id: 'action-new-window', label: 'New Window', category: 'action', icon: ExternalLink, description: 'Open in new tab' },
    { id: 'action-toggle-theme', label: isDarkTheme ? 'Light Theme' : 'Dark Theme', category: 'settings', icon: isDarkTheme ? Sun : Moon, description: 'Toggle color theme' },
    { id: 'action-toggle-terminal', label: 'Toggle Terminal', category: 'settings', icon: Terminal, description: 'Show/hide terminal' },
    { id: 'action-open-settings', label: 'Open Settings', category: 'settings', icon: Settings, description: 'Open preferences' },
    { id: 'action-toggle-sidebar', label: 'Toggle Sidebar', category: 'settings', icon: Folder, description: 'Show/hide sidebar' },
  ], [isDarkTheme]);

  // Fuzzy search implementation
  const fuzzyMatch = (text: string, pattern: string): boolean => {
    const lowerText = text.toLowerCase();
    const lowerPattern = pattern.toLowerCase();
    if (lowerText.includes(lowerPattern)) return true;
    let patternIdx = 0;
    for (let i = 0; i < lowerText.length && patternIdx < lowerPattern.length; i++) {
      if (lowerText[i] === lowerPattern[patternIdx]) patternIdx++;
    }
    return patternIdx === lowerPattern.length;
  };

  const filteredCommands = useMemo(() => {
    // Select items based on current mode
    let itemsToFilter: CommandItem[];
    
    if (mode === 'files') {
      itemsToFilter = fileItems;
    } else if (mode === 'actions') {
      itemsToFilter = actionItems;
    } else {
      // Commands mode - include recent items
      const recentItems: CommandItem[] = recentList.slice(0, 3).map(id => {
        const cmd = baseCommands.find(c => c.id === id);
        if (cmd) {
          return { ...cmd, category: 'recent' as const, icon: Clock };
        }
        return null;
      }).filter(Boolean) as CommandItem[];
      itemsToFilter = [...recentItems, ...baseCommands];
    }

    if (!query) {
      if (mode === 'files' || mode === 'actions') {
        return itemsToFilter;
      }
      // Show all commands grouped by category
      const grouped = {
        recent: itemsToFilter.filter(c => c.category === 'recent'),
        navigation: itemsToFilter.filter(c => c.category === 'navigation'),
        action: itemsToFilter.filter(c => c.category === 'action'),
        settings: itemsToFilter.filter(c => c.category === 'settings'),
        project: itemsToFilter.filter(c => c.category === 'project'),
      };
      return [...grouped.recent, ...grouped.navigation, ...grouped.action, ...grouped.settings, ...grouped.project];
    }
    return itemsToFilter.filter(cmd => {
      const searchText = `${cmd.label} ${cmd.file || ''} ${cmd.description || ''}`;
      return fuzzyMatch(searchText, query);
    });
  }, [mode, query, baseCommands, fileItems, actionItems, recentList]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      const saved = localStorage.getItem('recentCommands');
      if (saved) setRecentList(JSON.parse(saved));
    }
    setQuery('');
    setSelectedIndex(0);
    setMode('commands');
  }, [isOpen]);

  useEffect(() => { setSelectedIndex(0); }, [query, mode]);

  useEffect(() => {
    if (listRef.current) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) selectedElement.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  const executeCommand = (cmd: CommandItem) => {
    const newRecent = [cmd.id, ...recentList.filter(id => id !== cmd.id)].slice(0, MAX_RECENT);
    setRecentList(newRecent);
    localStorage.setItem('recentCommands', JSON.stringify(newRecent));

    // Handle navigation to sections
    if (cmd.section) {
      onNavigate(cmd.section);
    } 
    // Handle theme toggle
    else if (cmd.id === 'toggle-theme' || cmd.id === 'action-toggle-theme') {
      if (onToggleTheme) onToggleTheme();
      else if (onThemeToggle) onThemeToggle();
    } 
    // Handle terminal toggle
    else if (cmd.id === 'toggle-terminal' || cmd.id === 'action-toggle-terminal') {
      if (onOpenTerminal) onOpenTerminal();
      else if (onTerminalToggle) onTerminalToggle();
    } 
    // Handle settings
    else if (cmd.id === 'open-settings' || cmd.id === 'action-open-settings') {
      if (onOpenSettings) onOpenSettings();
      else if (onSettingsOpen) onSettingsOpen();
    } 
    // Handle resume download
    else if (cmd.id === 'download-resume' || cmd.id === 'action-download-resume' || cmd.id === 'file-resume') {
      const link = document.createElement('a');
      link.href = '/Arjun Resume.pdf';
      link.download = 'Arjun_Singh_Rajput_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } 
    // Handle GitHub
    else if (cmd.id === 'view-github' || cmd.id === 'action-github') {
      window.open('https://github.com/ArjunRajputGLA', '_blank');
    } 
    // Handle LinkedIn
    else if (cmd.id === 'view-linkedin' || cmd.id === 'action-linkedin') {
      window.open('https://www.linkedin.com/in/imstorm23203attherategmail/', '_blank');
    }
    // Handle LeetCode
    else if (cmd.id === 'view-leetcode' || cmd.id === 'action-leetcode') {
      window.open('https://leetcode.com/u/CodeXI/', '_blank');
    }
    // Handle copy email
    else if (cmd.id === 'copy-email' || cmd.id === 'action-copy-email') {
      navigator.clipboard.writeText('imstorm23203@gmail.com');
    }
    // Handle new window
    else if (cmd.id === 'new-window' || cmd.id === 'action-new-window') {
      window.open(window.location.href, '_blank');
    }
    // Handle sidebar toggle (we don't have direct access, so open settings)
    else if (cmd.id === 'action-toggle-sidebar') {
      // This would need a prop to toggle sidebar - for now we can't do much
    }
    
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => prev < filteredCommands.length - 1 ? prev + 1 : 0);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : filteredCommands.length - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredCommands[selectedIndex]) executeCommand(filteredCommands[selectedIndex]);
        break;
      case 'Escape':
        onClose();
        break;
      case 'Tab':
        e.preventDefault();
        setMode(prev => prev === 'commands' ? 'files' : prev === 'files' ? 'actions' : 'commands');
        break;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'recent': return 'text-yellow-400';
      case 'navigation': return 'text-blue-400';
      case 'action': return 'text-green-400';
      case 'settings': return 'text-purple-400';
      case 'project': return 'text-orange-400';
      default: return 'text-[var(--vscode-text-muted)]';
    }
  };

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
            className="fixed top-[6px] left-1/3 -translate-x-1/2 w-full max-w-xl z-[60] px-4"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.08 }}
          >
            <div className="bg-[var(--vscode-sidebar)] border border-[var(--vscode-border)] rounded-lg shadow-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--vscode-sidebar-border)]">
                <Command size={18} className="text-[var(--vscode-accent)]" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a command or search..."
                  className="flex-1 bg-transparent outline-none text-[var(--vscode-text)] text-base placeholder:text-[var(--vscode-text-muted)]"
                  autoComplete="off"
                  spellCheck="false"
                />
                <kbd className="px-2 py-1 bg-[var(--vscode-bg)] rounded text-xs text-[var(--vscode-text-muted)] font-mono">ESC</kbd>
              </div>

              <div className="flex items-center gap-1 px-4 py-2 border-b border-[var(--vscode-sidebar-border)] bg-[var(--vscode-bg)]">
                {(['commands', 'files', 'actions'] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`px-3 py-1 text-xs rounded transition-colors ${
                      mode === m ? 'bg-[var(--vscode-accent)] text-white' : 'text-[var(--vscode-text-muted)] hover:text-[var(--vscode-text)]'
                    }`}
                  >
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </button>
                ))}
                <span className="text-xs text-[var(--vscode-text-muted)] ml-auto">Tab to switch</span>
              </div>

              <div ref={listRef} className="max-h-[400px] overflow-auto">
                {filteredCommands.length > 0 ? (
                  filteredCommands.map((cmd, index) => {
                    const Icon = cmd.icon;
                    const isSelected = index === selectedIndex;
                    return (
                      <button
                        key={`${cmd.id}-${index}`}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                          isSelected ? 'bg-[var(--vscode-selection)]' : 'hover:bg-[var(--vscode-line-highlight)]'
                        }`}
                        onClick={() => executeCommand(cmd)}
                        onMouseEnter={() => setSelectedIndex(index)}
                      >
                        <div className={`p-1.5 rounded ${isSelected ? 'bg-[var(--vscode-accent)]' : 'bg-[var(--vscode-bg)]'}`}>
                          <Icon size={16} className={isSelected ? 'text-white' : getCategoryColor(cmd.category)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="truncate">{cmd.label}</span>
                            {cmd.category === 'recent' && (
                              <span className="text-xs text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded">Recent</span>
                            )}
                          </div>
                          {cmd.description && (
                            <div className="text-xs text-[var(--vscode-text-muted)] truncate">{cmd.description}</div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {cmd.file && <span className="text-xs text-[var(--vscode-text-muted)] font-mono">{cmd.file}</span>}
                          {cmd.shortcut && (
                            <kbd className="px-2 py-0.5 bg-[var(--vscode-bg)] rounded text-xs text-[var(--vscode-text-muted)] font-mono">{cmd.shortcut}</kbd>
                          )}
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="px-4 py-12 text-center">
                    <Search size={32} className="mx-auto mb-3 text-[var(--vscode-text-muted)] opacity-50" />
                    <div className="text-[var(--vscode-text-muted)]">No matching commands found</div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between px-4 py-2 border-t border-[var(--vscode-sidebar-border)] text-xs text-[var(--vscode-text-muted)] bg-[var(--vscode-bg)]">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-[var(--vscode-sidebar)] rounded font-mono">↑</kbd>
                    <kbd className="px-1.5 py-0.5 bg-[var(--vscode-sidebar)] rounded font-mono">↓</kbd>
                    <span className="ml-1">navigate</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-[var(--vscode-sidebar)] rounded font-mono">↵</kbd>
                    <span className="ml-1">select</span>
                  </span>
                </div>
                <span>Ctrl+P to open</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
