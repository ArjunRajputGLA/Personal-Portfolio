'use client';

import { useMemo } from 'react';
import { GitBranch, Circle, Check, AlertTriangle, X as XIcon, Terminal, Bell } from 'lucide-react';

interface StatusBarProps {
  currentSection: string;
  scrollPercentage: number;
  onProblemsClick?: () => void;
  onOutputClick?: () => void;
  problemsCount?: number;
}

export default function StatusBar({ currentSection, scrollPercentage, onProblemsClick, onOutputClick, problemsCount = 0 }: StatusBarProps) {
  // Derive line/column directly from scrollPercentage
  const lineCol = useMemo(() => {
    const line = Math.max(1, Math.floor(scrollPercentage * 500));
    const col = (Math.floor(scrollPercentage * 1000) % 40) + 1;
    return { line, col };
  }, [scrollPercentage]);

  const sectionToFile: { [key: string]: string } = {
    home: 'index.tsx',
    about: 'about.md',
    skills: 'skills.json',
    projects: 'projects/',
    experience: 'experience.log',
    achievements: 'achievements.yaml',
    gallery: 'media/journey/',
    contact: 'contact.tsx',
  };

  return (
    <footer className="h-[22px] bg-[var(--vscode-statusbar)] flex items-center justify-between px-2 text-white text-xs fixed bottom-0 left-0 right-0 z-50 select-none">
      {/* Left Section */}
      <div className="flex items-center gap-2">
        {/* Branch Info */}
        <div className="flex items-center gap-1 hover:bg-white/10 px-1.5 py-0.5 rounded cursor-pointer">
          <GitBranch size={12} />
          <span>main</span>
        </div>

        {/* Sync Status */}
        <div className="flex items-center gap-1 hover:bg-white/10 px-1.5 py-0.5 rounded cursor-pointer">
          <Circle size={8} fill="currentColor" className="text-green-400" />
          <span className="hidden sm:inline">{sectionToFile[currentSection] || 'index.tsx'}</span>
        </div>

        {/* Problems/Warnings */}
        <button
          onClick={onProblemsClick}
          className="flex items-center gap-2 hover:bg-white/10 px-1.5 py-0.5 rounded cursor-pointer"
          title="View Problems"
        >
          <span className="flex items-center gap-1">
            <AlertTriangle size={12} className="text-yellow-400" />
            <span className="text-yellow-400">{problemsCount}</span>
          </span>
          <span className="flex items-center gap-1">
            <XIcon size={12} className="text-red-400" />
            <span className="text-red-400">0</span>
          </span>
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Output */}
        <button
          onClick={onOutputClick}
          className="flex items-center gap-1 hover:bg-white/10 px-1.5 py-0.5 rounded cursor-pointer"
          title="Output"
        >
          <Terminal size={12} />
          <span className="hidden lg:inline">Output</span>
        </button>

        {/* Notifications */}
        <div className="flex items-center gap-1 hover:bg-white/10 px-1.5 py-0.5 rounded cursor-pointer relative">
          <Bell size={12} />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--vscode-accent)] rounded-full flex items-center justify-center text-[8px]">
            2
          </span>
        </div>

        {/* Line/Column */}
        <div className="hover:bg-white/10 px-1.5 py-0.5 rounded cursor-pointer hidden sm:block">
          Ln {lineCol.line}, Col {lineCol.col}
        </div>

        {/* Encoding */}
        <div className="hover:bg-white/10 px-1.5 py-0.5 rounded cursor-pointer hidden md:block">
          UTF-8
        </div>

        {/* Tech Stack */}
        <div className="hover:bg-white/10 px-1.5 py-0.5 rounded cursor-pointer hidden lg:block">
          React + TypeScript
        </div>

        {/* LeetCode Achievement */}
        <div className="flex items-center gap-1 hover:bg-white/10 px-1.5 py-0.5 rounded cursor-pointer">
          <Check size={12} className="text-[var(--vscode-success)]" />
          <span className="hidden sm:inline">700+ LeetCode</span>
        </div>

        {/* Scroll Percentage */}
        <div className="hover:bg-white/10 px-1.5 py-0.5 rounded cursor-pointer">
          {Math.round(scrollPercentage * 100)}%
        </div>

        {/* Prettier/Formatter */}
        <div className="hover:bg-white/10 px-1.5 py-0.5 rounded cursor-pointer hidden md:flex items-center gap-1">
          <span>Prettier</span>
          <Check size={10} />
        </div>
      </div>
    </footer>
  );
}
