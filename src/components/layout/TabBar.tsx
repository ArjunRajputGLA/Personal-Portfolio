'use client';

import { X, Circle } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: string;
  isModified?: boolean;
}

interface TabBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onTabClose?: (tabId: string) => void;
}

const tabConfig: Tab[] = [
  { id: 'home', label: 'index.tsx', icon: '📄', isModified: true },
  { id: 'about', label: 'about.md', icon: '📝' },
  { id: 'skills', label: 'skills.json', icon: '📋' },
  { id: 'projects', label: 'projects/', icon: '📁' },
  { id: 'experience', label: 'experience.log', icon: '📜' },
  { id: 'achievements', label: 'achievements.yaml', icon: '🏆' },
  { id: 'gallery', label: 'media/', icon: '🖼️' },
  { id: 'games', label: 'games/', icon: '🎮' },
  { id: 'contact', label: 'contact.tsx', icon: '✉️' },
];

export default function TabBar({ tabs, activeTab, onTabChange, onTabClose }: TabBarProps) {
  const displayTabs = tabs.length > 0 ? tabs : tabConfig;

  return (
    <div className="bg-[var(--vscode-tab-inactive)] border-b border-[var(--vscode-sidebar-border)] flex items-center overflow-x-auto scrollbar-hide">
      {displayTabs.map((tab) => {
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              group flex items-center gap-2 px-3 py-2 text-xs border-r border-[var(--vscode-sidebar-border)]
              transition-colors relative min-w-fit
              ${isActive 
                ? 'bg-[var(--vscode-tab-active)] text-[var(--vscode-text)]' 
                : 'bg-[var(--vscode-tab-inactive)] text-[var(--vscode-text-muted)] hover:bg-[var(--vscode-line-highlight)]'
              }
            `}
          >
            {/* Active Tab Top Border */}
            {isActive && (
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-[var(--vscode-accent)]" />
            )}
            
            {/* File Icon */}
            <span className="text-sm">{tab.icon}</span>
            
            {/* File Name */}
            <span className={tab.isModified ? 'italic' : ''}>
              {tab.label}
            </span>
            
            {/* Modified Indicator or Close Button */}
            <span className="w-4 h-4 flex items-center justify-center ml-1">
              {tab.isModified ? (
                <Circle 
                  size={8} 
                  fill="currentColor" 
                  className="text-[var(--vscode-text-muted)] group-hover:hidden" 
                />
              ) : null}
              <X 
                size={14} 
                className={`
                  text-[var(--vscode-text-muted)] hover:text-[var(--vscode-text)]
                  ${tab.isModified ? 'hidden group-hover:block' : 'opacity-0 group-hover:opacity-100'}
                `}
                onClick={(e) => {
                  e.stopPropagation();
                  onTabClose?.(tab.id);
                }}
              />
            </span>
          </button>
        );
      })}
      
      {/* Empty space to fill remaining width */}
      <div className="flex-1 bg-[var(--vscode-tab-inactive)]" />
    </div>
  );
}

export { tabConfig };
export type { Tab };
