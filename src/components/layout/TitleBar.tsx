'use client';

import { useState } from 'react';
import { Menu, Sun, Moon, Minus, Square, X, Download, Mic } from 'lucide-react';

interface TitleBarProps {
  onMenuClick: () => void;
  onThemeToggle: () => void;
  isDarkTheme: boolean;
  onToggleSidebar?: () => void;
  onToggleTerminal?: () => void;
  onOpenSettings?: () => void;
  onOpenCommandPalette?: () => void;
  onVoiceControl?: () => void;
}               

export default function TitleBar({ 
  onMenuClick, 
  onThemeToggle, 
  isDarkTheme,
  onToggleSidebar,
  onToggleTerminal,
  onOpenSettings,
  onOpenCommandPalette,
  onVoiceControl
}: TitleBarProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const contactInfo = {
    email: "imstorm23203@gmail.com",
    linkedin: "https://www.linkedin.com/in/imstorm23203attherategmail/",
    github: "https://github.com/ArjunRajputGLA"
  };

  const menuItems = [
    { 
      label: 'File', 
      items: ['New Window', 'Download Resume', '---', 'Close'] 
    },
    { 
      label: 'Edit', 
      items: ['Copy Email', 'Copy LinkedIn', 'Copy GitHub', '---', 'Preferences'] 
    },
    { 
      label: 'View', 
      items: ['Command Palette', '---', 'Toggle Sidebar', 'Toggle Terminal', '---', 'Appearance'] 
    },
  ];

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleDownloadResume = () => {
    const link = document.createElement('a');
    link.href = '/Arjun Resume.pdf';
    link.download = 'Arjun_Singh_Rajput_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleMenuAction = (item: string) => {
    setActiveMenu(null);
    
    switch (item) {
      case 'New Window':
        window.open(window.location.href, '_blank');
        break;
      case 'Download Resume':
        handleDownloadResume();
        break;
      case 'Close':
        window.close();
        break;
      case 'Copy Email':
        copyToClipboard(contactInfo.email, 'email');
        break;
      case 'Copy LinkedIn':
        copyToClipboard(contactInfo.linkedin, 'linkedin');
        break;
      case 'Copy GitHub':
        copyToClipboard(contactInfo.github, 'github');
        break;
      case 'Preferences':
        onOpenSettings?.();
        break;
      case 'Toggle Sidebar':
        onToggleSidebar?.();
        break;
      case 'Toggle Terminal':
        onToggleTerminal?.();
        break;
      case 'Appearance':
        onOpenSettings?.();
        break;
      case 'Command Palette':
        onOpenCommandPalette?.();
        break;
    }
  };

  return (
    <header className="h-[30px] bg-[var(--vscode-titlebar)] flex items-center justify-between px-2 select-none border-b border-[var(--vscode-sidebar-border)] fixed top-0 left-0 right-0 z-50">
      {/* Left Section - Menu & Logo */}
      <div className="flex items-center gap-2">
        <button 
          onClick={onMenuClick}
          className="p-1 hover:bg-[var(--vscode-line-highlight)] rounded md:hidden"
          aria-label="Toggle menu"
        >
          <Menu size={16} />
        </button>
        
        <div className="flex items-center gap-1">
          <span className="text-[var(--vscode-accent)] font-semibold text-sm">⟨/⟩</span>
          <span className="text-sm font-medium hidden sm:inline">ArjunRajput.ai</span>
        </div>

        {/* Menu Items - Desktop */}
        <nav className="hidden md:flex items-center gap-1 ml-4">
          {menuItems.map((menu) => (
            <div key={menu.label} className="relative">
              <button
                onClick={() => setActiveMenu(activeMenu === menu.label ? null : menu.label)}
                className="px-2 py-1 text-xs hover:bg-[var(--vscode-line-highlight)] rounded flex items-center gap-1"
              >
                {menu.label}
              </button>
              
              {activeMenu === menu.label && (
                <div className="absolute top-full left-0 mt-1 bg-[var(--vscode-sidebar)] border border-[var(--vscode-border)] rounded shadow-lg py-1 min-w-[160px] z-50">
                  {menu.items.map((item, idx) => (
                    item === '---' ? (
                      <div key={idx} className="border-t border-[var(--vscode-border)] my-1" />
                    ) : (
                      <button
                        key={idx}
                        className="w-full text-left px-3 py-1 text-xs hover:bg-[var(--vscode-line-highlight)] flex items-center justify-between"
                        onClick={() => handleMenuAction(item)}
                      >
                        <span>{item}</span>
                        {copied && (
                          (item === 'Copy Email' && copied === 'email') ||
                          (item === 'Copy LinkedIn' && copied === 'linkedin') ||
                          (item === 'Copy GitHub' && copied === 'github')
                        ) && (
                          <span className="text-[var(--vscode-success)] text-[10px]">Copied!</span>
                        )}
                      </button>
                    )
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Center Section - Navigation Tabs */}
      <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 transform -translate-x-1/2">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="px-3 py-1 text-xs hover:bg-[var(--vscode-line-highlight)] rounded transition-colors"
          >
            {item.label}
          </a>
        ))}
      </nav>

      {/* Right Section - Actions & Window Controls */}
      <div className="flex items-center gap-2">
        {/* Voice Control Button */}
        <button
          onClick={onVoiceControl}
          className="p-1 hover:bg-[var(--vscode-line-highlight)] rounded relative group"
          aria-label="Voice Control"
          title="Voice Control (Alt+V)"
        >
          <Mic size={14} className="text-[var(--vscode-accent)]" />
          <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--vscode-accent)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--vscode-accent)]"></span>
          </span>
        </button>

        <button
          onClick={onThemeToggle}
          className="p-1 hover:bg-[var(--vscode-line-highlight)] rounded"
          aria-label="Toggle theme"
          title={isDarkTheme ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {isDarkTheme ? <Sun size={14} /> : <Moon size={14} />}
        </button>

        <button
          onClick={handleDownloadResume}
          className="hidden sm:flex items-center gap-1 px-2 py-1 bg-[var(--vscode-accent)] hover:bg-[var(--vscode-accent-hover)] rounded text-white text-xs transition-colors"
        >
          <Download size={12} />
          <span>Resume</span>
        </button>

        {/* Window Controls */}
        <div className="flex items-center gap-1 ml-2">
          <button className="p-1 hover:bg-[var(--vscode-line-highlight)] rounded" aria-label="Minimize">
            <Minus size={12} />
          </button>
          <button className="p-1 hover:bg-[var(--vscode-line-highlight)] rounded" aria-label="Maximize">
            <Square size={10} />
          </button>
          <button className="p-1 hover:bg-red-600 rounded" aria-label="Close">
            <X size={12} />
          </button>
        </div>
      </div>

      {/* Click outside to close menu */}
      {activeMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setActiveMenu(null)}
        />
      )}
    </header>
  );
}
