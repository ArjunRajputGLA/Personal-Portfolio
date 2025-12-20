'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitBranch,
  GitCommit,
  GitMerge,
  GitPullRequest,
  Clock,
  Plus,
  RotateCcw,
  ChevronDown,
  ChevronRight,
  Check,
  X,
} from 'lucide-react';

interface GitPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommitData {
  hash: string;
  message: string;
  author: string;
  date: string;
  branch: string;
}

const recentCommits: CommitData[] = [
  { hash: 'a1b2c3d', message: 'feat: Add AI project showcase ✨', author: 'Arjun Singh Rajput', date: '2 hours ago', branch: 'main' },
  { hash: 'e4f5g6h', message: 'style: Improve VS Code theme colors', author: 'Arjun Singh Rajput', date: '5 hours ago', branch: 'main' },
  { hash: 'i7j8k9l', message: 'feat: Add interactive terminal 🖥️', author: 'Arjun Singh Rajput', date: '1 day ago', branch: 'main' },
  { hash: 'm0n1o2p', message: 'docs: Update README with features', author: 'Arjun Singh Rajput', date: '2 days ago', branch: 'main' },
  { hash: 'q3r4s5t', message: 'fix: Resolve mobile responsiveness', author: 'Arjun Singh Rajput', date: '3 days ago', branch: 'main' },
  { hash: 'u6v7w8x', message: 'feat: Implement command palette', author: 'Arjun Singh Rajput', date: '4 days ago', branch: 'main' },
  { hash: 'y9z0a1b', message: 'Initial commit 🚀', author: 'Arjun Singh Rajput', date: '1 week ago', branch: 'main' },
];

const branches = ['main', 'feature/ai-projects', 'feature/animations', 'hotfix/mobile'];

const stagedChanges = [
  { file: 'src/components/NewProject.tsx', status: 'added' },
  { file: 'src/styles/theme.css', status: 'modified' },
];

const unstagedChanges = [
  { file: 'src/app/page.tsx', status: 'modified' },
  { file: 'README.md', status: 'modified' },
  { file: 'package.json', status: 'modified' },
];

export default function GitPanel({ isOpen, onClose }: GitPanelProps) {
  const [currentBranch, setCurrentBranch] = useState('main');
  const [showBranches, setShowBranches] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    staged: true,
    unstaged: true,
    commits: true,
  });
  const [commitMessage, setCommitMessage] = useState('');

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'added': return 'text-green-400';
      case 'modified': return 'text-yellow-400';
      case 'deleted': return 'text-red-400';
      default: return 'text-[var(--vscode-text)]';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'added': return 'A';
      case 'modified': return 'M';
      case 'deleted': return 'D';
      default: return '?';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: 300, opacity: 1 }}
        exit={{ width: 0, opacity: 0 }}
        className="fixed top-[30px] left-[48px] bottom-[22px] z-40 bg-[var(--vscode-sidebar)] border-r border-[var(--vscode-border)] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-[35px] bg-[var(--vscode-titlebar)] border-b border-[var(--vscode-border)]">
          <span className="text-xs font-medium uppercase tracking-wide">Source Control</span>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[var(--vscode-line-highlight)] rounded"
          >
            <X size={14} />
          </button>
        </div>

        {/* Branch Selector */}
        <div className="px-4 py-2 border-b border-[var(--vscode-border)]">
          <div className="relative">
            <button
              onClick={() => setShowBranches(!showBranches)}
              className="flex items-center gap-2 w-full px-3 py-2 bg-[var(--vscode-bg)] rounded hover:bg-[var(--vscode-line-highlight)] text-sm"
            >
              <GitBranch size={14} className="text-[var(--vscode-accent)]" />
              <span className="flex-1 text-left truncate">{currentBranch}</span>
              <ChevronDown size={14} className={`transition-transform ${showBranches ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {showBranches && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-[var(--vscode-bg)] border border-[var(--vscode-border)] rounded shadow-lg z-10"
                >
                  {branches.map(branch => (
                    <button
                      key={branch}
                      onClick={() => {
                        setCurrentBranch(branch);
                        setShowBranches(false);
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 hover:bg-[var(--vscode-line-highlight)] text-sm"
                    >
                      <GitBranch size={12} />
                      <span className="flex-1 text-left">{branch}</span>
                      {branch === currentBranch && <Check size={12} className="text-green-400" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Commit Input */}
        <div className="px-4 py-2 border-b border-[var(--vscode-border)]">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Message (press Enter to commit)"
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && commitMessage) {
                  setCommitMessage('');
                }
              }}
              className="flex-1 px-3 py-2 bg-[var(--vscode-bg)] border border-[var(--vscode-border)] rounded text-sm focus:outline-none focus:border-[var(--vscode-accent)]"
            />
            <button
              disabled={!commitMessage}
              className="px-3 py-2 bg-[var(--vscode-accent)] rounded text-sm disabled:opacity-50 hover:opacity-90"
            >
              <Check size={14} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {/* Staged Changes */}
          <div className="border-b border-[var(--vscode-border)]">
            <button
              onClick={() => toggleSection('staged')}
              className="flex items-center gap-2 w-full px-4 py-2 hover:bg-[var(--vscode-line-highlight)] text-left"
            >
              {expandedSections.staged ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              <span className="text-xs font-medium uppercase">Staged Changes</span>
              <span className="text-xs text-[var(--vscode-text-muted)]">({stagedChanges.length})</span>
            </button>
            {expandedSections.staged && (
              <div className="pl-6">
                {stagedChanges.map((change, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-4 py-1 hover:bg-[var(--vscode-line-highlight)] text-sm group"
                  >
                    <span className={`text-xs font-mono ${getStatusColor(change.status)}`}>
                      {getStatusIcon(change.status)}
                    </span>
                    <span className="flex-1 truncate text-xs">{change.file}</span>
                    <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[var(--vscode-bg)] rounded">
                      <RotateCcw size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Unstaged Changes */}
          <div className="border-b border-[var(--vscode-border)]">
            <button
              onClick={() => toggleSection('unstaged')}
              className="flex items-center gap-2 w-full px-4 py-2 hover:bg-[var(--vscode-line-highlight)] text-left"
            >
              {expandedSections.unstaged ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              <span className="text-xs font-medium uppercase">Changes</span>
              <span className="text-xs text-[var(--vscode-text-muted)]">({unstagedChanges.length})</span>
            </button>
            {expandedSections.unstaged && (
              <div className="pl-6">
                {unstagedChanges.map((change, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-4 py-1 hover:bg-[var(--vscode-line-highlight)] text-sm group"
                  >
                    <span className={`text-xs font-mono ${getStatusColor(change.status)}`}>
                      {getStatusIcon(change.status)}
                    </span>
                    <span className="flex-1 truncate text-xs">{change.file}</span>
                    <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[var(--vscode-bg)] rounded">
                      <Plus size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Commits */}
          <div>
            <button
              onClick={() => toggleSection('commits')}
              className="flex items-center gap-2 w-full px-4 py-2 hover:bg-[var(--vscode-line-highlight)] text-left"
            >
              {expandedSections.commits ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              <span className="text-xs font-medium uppercase">Recent Commits</span>
            </button>
            {expandedSections.commits && (
              <div>
                {recentCommits.map((commit, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 px-4 py-2 hover:bg-[var(--vscode-line-highlight)] cursor-pointer"
                  >
                    <GitCommit size={14} className="text-[var(--vscode-accent)] mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs truncate">{commit.message}</p>
                      <div className="flex items-center gap-2 text-[10px] text-[var(--vscode-text-muted)]">
                        <span className="font-mono">{commit.hash}</span>
                        <span>•</span>
                        <span>{commit.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Stats */}
        <div className="px-4 py-2 border-t border-[var(--vscode-border)] bg-[var(--vscode-bg)]">
          <div className="flex items-center justify-between text-[10px] text-[var(--vscode-text-muted)]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <GitPullRequest size={12} />
                2 PRs
              </span>
              <span className="flex items-center gap-1">
                <GitMerge size={12} />
                15 merged
              </span>
            </div>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              Last sync: now
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
