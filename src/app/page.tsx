'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import TitleBar from '@/components/layout/TitleBar';
import ActivityBar from '@/components/layout/ActivityBar';
import StatusBar from '@/components/layout/StatusBar';
import TabBar, { tabConfig } from '@/components/layout/TabBar';
import Breadcrumb from '@/components/layout/Breadcrumb';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import AchievementsSection from '@/components/sections/AchievementsSection';
import GallerySection from '@/components/sections/GallerySection';
import GamesSection from '@/components/sections/GamesSection';
import ContactSection from '@/components/sections/ContactSection';
import Terminal from '@/components/ui/Terminal';
import CommandPalette from '@/components/ui/CommandPalette';
import { NotificationProvider, useNotification } from '@/components/ui/NotificationSystem';
import SettingsPanel, { SettingsState, defaultSettings as defaultSettingsState } from '@/components/ui/SettingsPanel';
import KeyboardShortcuts from '@/components/ui/KeyboardShortcuts';
import SearchOverlay from '@/components/ui/SearchOverlay';
import ProblemsPanel from '@/components/ui/ProblemsPanel';
import OutputPanel from '@/components/ui/OutputPanel';
import GitPanel from '@/components/ui/GitPanel';
import ExtensionsPanel from '@/components/ui/ExtensionsPanel';
import LiveCollaboration from '@/components/ui/LiveCollaboration';
import MatrixEffect from '@/components/ui/MatrixEffect';
import Chatbot from '@/components/ui/Chatbot';
import VoiceControl from '@/components/VoiceControl';
import SkillsNetworkSection from '@/components/SkillsNetwork/SkillsNetworkSection';

const sectionToBreadcrumb: { [key: string]: string[] } = {
  home: ['src', 'index.tsx'],
  about: ['src', 'about.md'],
  skills: ['src', 'skills.json'],
  'skills-network': ['src', 'skills-network.tsx'],
  projects: ['src', 'projects'],
  experience: ['src', 'experience.log'],
  achievements: ['src', 'achievements.yaml'],
  gallery: ['media', 'journey'],
  games: ['src', 'games'],
  contact: ['src', 'contact.tsx'],
};

// Inner component that uses notifications
function PortfolioContent() {
  const { addNotification } = useNotification();
  const [activeSection, setActiveSection] = useState('home');
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [problemsOpen, setProblemsOpen] = useState(false);
  const [outputOpen, setOutputOpen] = useState(false);
  const [gitOpen, setGitOpen] = useState(false);
  const [extensionsOpen, setExtensionsOpen] = useState(false);
  const [matrixActive, setMatrixActive] = useState(false);
  const [settings, setSettings] = useState<SettingsState>(defaultSettingsState);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [voiceControlOpen, setVoiceControlOpen] = useState(false);
  const welcomeShownRef = useRef(false);
  
  // Panel widths state
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const [gitPanelWidth, setGitPanelWidth] = useState(320);
  const [extensionsPanelWidth, setExtensionsPanelWidth] = useState(320);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check for mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Konami code state
  const [konamiSequence, setKonamiSequence] = useState<string[]>([]);
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('portfolio-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
        
        // Apply theme
        if (parsed.appearance?.theme === 'light') {
          document.documentElement.classList.add('light-theme');
        } else if (parsed.appearance?.theme === 'high-contrast') {
          document.documentElement.classList.add('high-contrast');
        }
        
        // Apply accessibility settings
        if (parsed.accessibility?.highContrast) {
          document.documentElement.classList.add('high-contrast');
        }
        if (parsed.accessibility?.reducedMotion) {
          document.documentElement.classList.add('reduced-motion');
        }
        
        // Apply animations setting
        if (parsed.features?.enableAnimations === false) {
          document.documentElement.classList.add('no-animations');
        }
        
        // Apply font family
        if (parsed.appearance?.fontFamily) {
          document.documentElement.style.setProperty('--font-family', parsed.appearance.fontFamily);
        }
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    }
    
    // Welcome notification
    if (!welcomeShownRef.current) {
      welcomeShownRef.current = true;
      setTimeout(() => {
        addNotification({
          type: 'info',
          message: 'Welcome! Press Ctrl+P for Command Palette or F1 for shortcuts.',
          duration: 5000,
        });
      }, 2000);
    }
  }, [addNotification]);

  // Handle scroll and update active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;
      setScrollPercentage(scrollPercent);

      // Update active section based on scroll position
      const sections = ['home', 'about', 'skills', 'projects', 'experience', 'achievements', 'gallery', 'games', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Konami code detection
      setKonamiSequence(prev => {
        const newSeq = [...prev, e.key].slice(-10);
        if (newSeq.join(',') === konamiCode.join(',')) {
          setMatrixActive(true);
          addNotification({ type: 'success', message: '🎮 Konami Code Activated! Welcome to the Matrix!' });
          return [];
        }
        return newSeq;
      });

      // Ctrl/Cmd + P for command palette
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
      // Ctrl/Cmd + B for sidebar toggle
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        setSidebarCollapsed(prev => !prev);
      }
      // Ctrl/Cmd + ` for terminal toggle
      if ((e.ctrlKey || e.metaKey) && e.key === '`') {
        e.preventDefault();
        setTerminalOpen(prev => !prev);
      }
      // Ctrl/Cmd + , for settings
      if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        setSettingsOpen(prev => !prev);
      }
      // Ctrl/Cmd + F for search
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
      // F1 for keyboard shortcuts
      if (e.key === 'F1') {
        e.preventDefault();
        setShortcutsOpen(prev => !prev);
      }
      // Ctrl/Cmd + Shift + G for Git
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'G') {
        e.preventDefault();
        setGitOpen(prev => !prev);
      }
      // Ctrl/Cmd + Shift + X for Extensions
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'X') {
        e.preventDefault();
        setExtensionsOpen(prev => !prev);
      }
      // Ctrl/Cmd + Shift + M for Problems
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'M') {
        e.preventDefault();
        setProblemsOpen(prev => !prev);
      }
      // Alt + V for Voice Control
      if (e.altKey && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        if (!settings.features.voiceControl) {
          addNotification({
            type: 'warning',
            message: 'Voice Control is disabled. Enable it in Settings → Features to use voice commands.',
            action: {
              label: 'Open Settings',
              onClick: () => setSettingsOpen(true),
            },
          });
          return;
        }
        setVoiceControlOpen(prev => !prev);
      }
      // Escape to close modals
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
        setSettingsOpen(false);
        setShortcutsOpen(false);
        setSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [addNotification]);

  const handleSectionChange = useCallback((section: string) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleTabChange = (tabId: string) => {
    handleSectionChange(tabId);
  };

  const handleDownloadResume = useCallback(() => {
    const link = document.createElement('a');
    link.href = '/resume.pdf';
    link.download = 'Arjun_Singh_Rajput_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addNotification({ type: 'success', message: 'Resume download started!' });
  }, [addNotification]);

  const toggleTheme = () => {
    const newTheme = settings.appearance.theme === 'dark' ? 'light' : 'dark';
    const newSettings = {
      ...settings,
      appearance: { ...settings.appearance, theme: newTheme as 'dark' | 'light' }
    };
    setSettings(newSettings);
    document.documentElement.classList.toggle('light-theme');
    localStorage.setItem('portfolio-settings', JSON.stringify(newSettings));
    addNotification({ type: 'info', message: `Switched to ${newTheme} theme` });
  };

  const handleSettingsChange = (newSettings: SettingsState) => {
    const oldSettings = settings;
    setSettings(newSettings);
    localStorage.setItem('portfolio-settings', JSON.stringify(newSettings));
    
    // Apply theme
    if (newSettings.appearance.theme === 'light') {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('high-contrast');
    } else if (newSettings.appearance.theme === 'high-contrast') {
      document.documentElement.classList.remove('light-theme');
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('light-theme', 'high-contrast');
    }
    
    // Apply accessibility settings
    if (newSettings.accessibility.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else if (newSettings.appearance.theme !== 'high-contrast') {
      document.documentElement.classList.remove('high-contrast');
    }
    
    if (newSettings.accessibility.reducedMotion) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
    
    // Apply animations setting
    if (!newSettings.features.enableAnimations) {
      document.documentElement.classList.add('no-animations');
    } else {
      document.documentElement.classList.remove('no-animations');
    }
    
    // Apply font family
    document.documentElement.style.setProperty('--font-family', newSettings.appearance.fontFamily);
    
    // Show notifications for specific setting changes
    if (oldSettings.appearance.theme !== newSettings.appearance.theme) {
      addNotification({ type: 'info', message: `Theme changed to ${newSettings.appearance.theme}` });
    }
    if (oldSettings.appearance.fontSize !== newSettings.appearance.fontSize) {
      addNotification({ type: 'info', message: `Font size: ${newSettings.appearance.fontSize}px` });
    }
    if (oldSettings.appearance.fontFamily !== newSettings.appearance.fontFamily) {
      addNotification({ type: 'info', message: `Font: ${newSettings.appearance.fontFamily}` });
    }
    if (oldSettings.features.enableAnimations !== newSettings.features.enableAnimations) {
      addNotification({ type: 'info', message: `Animations ${newSettings.features.enableAnimations ? 'enabled' : 'disabled'}` });
    }
    if (oldSettings.accessibility.reducedMotion !== newSettings.accessibility.reducedMotion) {
      addNotification({ type: 'info', message: `Reduced motion ${newSettings.accessibility.reducedMotion ? 'enabled' : 'disabled'}` });
    }
    if (oldSettings.accessibility.highContrast !== newSettings.accessibility.highContrast) {
      addNotification({ type: 'info', message: `High contrast ${newSettings.accessibility.highContrast ? 'enabled' : 'disabled'}` });
    }
  };

  // Close side panels when another opens
  const openGitPanel = () => {
    setExtensionsOpen(false);
    setGitOpen(true);
  };

  const openExtensionsPanel = () => {
    setGitOpen(false);
    setExtensionsOpen(true);
  };

  return (
    <div 
      className={`min-h-screen ${settings.appearance.theme === 'light' ? 'light-theme' : ''} ${settings.appearance.theme === 'high-contrast' ? 'high-contrast' : ''} ${settings.accessibility.reducedMotion ? 'reduced-motion' : ''} ${settings.accessibility.highContrast ? 'high-contrast' : ''}`} 
      style={{ 
        fontSize: `${settings.appearance.fontSize}px`,
        fontFamily: `'${settings.appearance.fontFamily}', monospace`
      }}
    >
      {/* Matrix Easter Egg */}
      <MatrixEffect isActive={matrixActive} onClose={() => setMatrixActive(false)} />

      {/* Title Bar */}
      <TitleBar 
        onMenuClick={() => setSidebarCollapsed(prev => !prev)}
        onThemeToggle={toggleTheme}
        isDarkTheme={settings.appearance.theme === 'dark'}
        onToggleSidebar={() => setSidebarCollapsed(prev => !prev)}
        onToggleTerminal={() => setTerminalOpen(prev => !prev)}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        onVoiceControl={() => {
          if (!settings.features.voiceControl) {
            addNotification({
              type: 'warning',
              message: 'Voice Control is disabled. Enable it in Settings → Features to use voice commands.',
              action: {
                label: 'Open Settings',
                onClick: () => setSettingsOpen(true),
              },
            });
            return;
          }
          setVoiceControlOpen(true);
        }}
      />

      {/* Activity Bar (Sidebar) */}
      <ActivityBar 
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(prev => !prev)}
        onGitClick={openGitPanel}
        onExtensionsClick={openExtensionsPanel}
        onSettingsClick={() => setSettingsOpen(true)}
        sidebarWidth={sidebarWidth}
        onSidebarWidthChange={setSidebarWidth}
      />

      {/* Side Panels */}
      <GitPanel 
        isOpen={gitOpen} 
        onClose={() => setGitOpen(false)} 
        width={gitPanelWidth}
        onWidthChange={setGitPanelWidth}
      />
      <ExtensionsPanel 
        isOpen={extensionsOpen} 
        onClose={() => setExtensionsOpen(false)} 
        width={extensionsPanelWidth}
        onWidthChange={setExtensionsPanelWidth}
      />

      {/* Main Content Area */}
      <main 
        className={`
          pt-[30px] transition-all duration-150
          ${(terminalOpen || outputOpen) ? 'pb-[272px]' : 'pb-[22px]'}
        `}
        style={{
          marginLeft: isMobile ? 0 : (
            (sidebarCollapsed && !gitOpen && !extensionsOpen) 
              ? 48 
              : gitOpen 
                ? 48 + gitPanelWidth
                : extensionsOpen 
                  ? 48 + extensionsPanelWidth
                  : 48 + sidebarWidth
          )
        }}
      >
        {/* Tab Bar */}
        <TabBar 
          tabs={tabConfig}
          activeTab={activeSection}
          onTabChange={handleTabChange}
        />

        {/* Breadcrumb */}
        <Breadcrumb path={sectionToBreadcrumb[activeSection] || ['src']} />

        {/* Sections */}
        <div className={`overflow-x-hidden ${!settings.features.enableAnimations ? 'no-animations' : ''} ${settings.accessibility.reducedMotion ? 'reduced-motion' : ''}`}>
          <HeroSection />
          <AboutSection />
          <SkillsSection />
          <SkillsNetworkSection />
          <ProjectsSection />
          <ExperienceSection />
          <AchievementsSection />
          <GallerySection />
          <GamesSection />
          <ContactSection />
        </div>

        {/* Footer */}
        <footer className="py-8 px-4 text-center border-t border-[var(--vscode-sidebar-border)]">
          <div className="text-[var(--vscode-comment)] text-sm mb-2">
            {/* This isn't just a portfolio — it's my personal IDE where I build the future. */}
          </div>
          <div className="text-[var(--vscode-text-muted)] text-xs">
            Built with 💙 by Arjun Singh Rajput | © 2025
          </div>
          <div className="text-[var(--vscode-text-muted)] text-xs mt-1">
            Next.js • TypeScript • Tailwind CSS • Framer Motion
          </div>
        </footer>
      </main>

      {/* Status Bar */}
      <StatusBar 
        currentSection={activeSection}
        scrollPercentage={scrollPercentage}
        onProblemsClick={() => setProblemsOpen(prev => !prev)}
        onOutputClick={() => setOutputOpen(prev => !prev)}
        problemsCount={6}
      />

      {/* Voice Control - Hidden, controlled by header button */}
      <VoiceControl
        onNavigate={handleSectionChange}
        onOpenTerminal={() => setTerminalOpen(true)}
        onOpenChatbot={() => setChatbotOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        onToggleTheme={toggleTheme}
        onDownloadResume={handleDownloadResume}
        voiceEnabled={settings.features.voiceControl}
        voiceResponseEnabled={settings.features.voiceResponse}
        externalOpen={voiceControlOpen}
        onExternalOpenChange={setVoiceControlOpen}
      />

      {/* Bottom Panels */}
      <Terminal 
        isOpen={terminalOpen}
        onToggle={() => setTerminalOpen(prev => !prev)}
        onNavigate={handleSectionChange}
        onMatrixActivate={() => setMatrixActive(true)}
      />

      {/* Problems and Output Panels - Overlay on top of everything */}
      <ProblemsPanel 
        isOpen={problemsOpen && !terminalOpen}
        onClose={() => setProblemsOpen(false)}
        onNavigate={handleSectionChange}
      />
      <OutputPanel 
        isOpen={outputOpen && !terminalOpen}
        onClose={() => setOutputOpen(false)}
      />

      {/* Command Palette */}
      <CommandPalette 
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigate={handleSectionChange}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenTerminal={() => setTerminalOpen(true)}
        onToggleTheme={toggleTheme}
      />

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onSettingsChange={handleSettingsChange}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
      />

      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts
        isOpen={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
      />

      {/* Search Overlay */}
      <SearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      {/* Live Collaboration */}
      <LiveCollaboration />

      {/* AI Chatbot */}
      <Chatbot 
        externalOpen={chatbotOpen} 
        onExternalOpenChange={setChatbotOpen} 
      />

      {/* Terminal Toggle Button (floating) */}
      <button
        onClick={() => setTerminalOpen(prev => !prev)}
        className="fixed bottom-[30px] right-4 z-30 px-3 py-1.5 bg-[var(--vscode-sidebar)] border border-[var(--vscode-border)] rounded text-xs text-[var(--vscode-text-muted)] hover:text-[var(--vscode-text)] hover:border-[var(--vscode-accent)] transition-colors"
        title="Toggle Terminal (Ctrl+`)"
      >
        {terminalOpen ? '✕ Close Terminal' : '⌨ Open Terminal'}
      </button>
    </div>
  );
}

// Main export with NotificationProvider wrapper
export default function Home() {
  return (
    <NotificationProvider>
      <PortfolioContent />
    </NotificationProvider>
  );
}
