'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, X, ChevronDown, ChevronRight } from 'lucide-react';

interface ProblemsProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: string) => void;
}

interface Problem {
  id: string;
  type: 'warning' | 'info' | 'error';
  message: string;
  file: string;
  line: number;
  section: string;
}

const problems: Problem[] = [
  {
    id: '1',
    type: 'warning',
    message: 'Warning: Developer is too talented for most job requirements',
    file: 'achievements.yaml',
    line: 1,
    section: 'achievements',
  },
  {
    id: '2',
    type: 'warning',
    message: 'Warning: Too many successful projects detected in workspace',
    file: 'projects/index.tsx',
    line: 42,
    section: 'projects',
  },
  {
    id: '3',
    type: 'info',
    message: 'Info: Consider hiring this developer immediately',
    file: 'contact.tsx',
    line: 1,
    section: 'contact',
  },
  {
    id: '4',
    type: 'warning',
    message: 'Warning: Skills array exceeds recommended length',
    file: 'skills.json',
    line: 15,
    section: 'skills',
  },
  {
    id: '5',
    type: 'info',
    message: 'Info: 700+ LeetCode problems solved. Is this even legal?',
    file: 'about.md',
    line: 23,
    section: 'about',
  },
  {
    id: '6',
    type: 'warning',
    message: 'Warning: AI expertise level may intimidate other developers',
    file: 'experience.log',
    line: 7,
    section: 'experience',
  },
];

export default function ProblemsPanel({ isOpen, onClose, onNavigate }: ProblemsProps) {
  const [expandedType, setExpandedType] = useState<string | null>('warning');

  const warnings = problems.filter(p => p.type === 'warning');
  const infos = problems.filter(p => p.type === 'info');
  const errors = problems.filter(p => p.type === 'error');

  const handleProblemClick = (problem: Problem) => {
    onNavigate(problem.section);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-3xl max-h-[70vh] bg-[var(--vscode-sidebar)] border border-[var(--vscode-border)] rounded-lg shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 h-[45px] bg-[var(--vscode-titlebar)] border-b border-[var(--vscode-border)]">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold">⚠️ PROBLEMS</span>
              <div className="flex items-center gap-3 text-xs">
                {errors.length > 0 && (
                  <span className="flex items-center gap-1 text-red-400">
                    <span className="w-5 h-5 rounded-full bg-red-400 flex items-center justify-center text-white text-[10px] font-bold">
                      {errors.length}
                    </span>
                    Errors
                  </span>
                )}
                <span className="flex items-center gap-1 text-yellow-400">
                  <span className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center text-black text-[10px] font-bold">
                    {warnings.length}
                  </span>
                  Warnings
                </span>
                <span className="flex items-center gap-1 text-blue-400">
                  <span className="w-5 h-5 rounded-full bg-blue-400 flex items-center justify-center text-white text-[10px] font-bold">
                    {infos.length}
                  </span>
                  Info
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-[var(--vscode-line-highlight)] rounded transition-colors"
              title="Close (Esc)"
            >
              <X size={16} />
            </button>
          </div>

          {/* Content */}
          <div className="max-h-[calc(70vh-45px)] overflow-auto">
            {/* Warnings */}
            {warnings.length > 0 && (
              <div>
                <button
                  onClick={() => setExpandedType(expandedType === 'warning' ? null : 'warning')}
                  className="flex items-center gap-2 w-full px-4 py-3 hover:bg-[var(--vscode-line-highlight)] text-left border-b border-[var(--vscode-border)]/50"
                >
                  {expandedType === 'warning' ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  <AlertTriangle size={14} className="text-yellow-400" />
                  <span className="text-sm font-medium">Warnings ({warnings.length})</span>
                </button>
                {expandedType === 'warning' && (
                  <div className="pl-6">
                    {warnings.map(problem => (
                      <button
                        key={problem.id}
                        onClick={() => handleProblemClick(problem)}
                        className="flex items-start gap-3 w-full px-4 py-3 hover:bg-[var(--vscode-line-highlight)] text-left group border-b border-[var(--vscode-border)]/30"
                      >
                      <AlertTriangle size={14} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[var(--vscode-text)] truncate">{problem.message}</p>
                        <p className="text-xs text-[var(--vscode-text-muted)]">
                          {problem.file}:{problem.line}
                        </p>
                      </div>
                      <span className="text-xs text-[var(--vscode-accent)] opacity-0 group-hover:opacity-100">
                        Go to →
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Info */}
          {infos.length > 0 && (
            <div>
              <button
                onClick={() => setExpandedType(expandedType === 'info' ? null : 'info')}
                className="flex items-center gap-2 w-full px-4 py-3 hover:bg-[var(--vscode-line-highlight)] text-left border-b border-[var(--vscode-border)]/50"
              >
                {expandedType === 'info' ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <Info size={14} className="text-blue-400" />
                <span className="text-sm font-medium">Information ({infos.length})</span>
              </button>
              {expandedType === 'info' && (
                <div className="pl-6">
                  {infos.map(problem => (
                    <button
                      key={problem.id}
                      onClick={() => handleProblemClick(problem)}
                      className="flex items-start gap-3 w-full px-4 py-3 hover:bg-[var(--vscode-line-highlight)] text-left group border-b border-[var(--vscode-border)]/30"
                    >
                      <Info size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[var(--vscode-text)] truncate">{problem.message}</p>
                        <p className="text-xs text-[var(--vscode-text-muted)]">
                          {problem.file}:{problem.line}
                        </p>
                      </div>
                      <span className="text-xs text-[var(--vscode-accent)] opacity-0 group-hover:opacity-100">
                        Go to →
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

          {/* Fun Footer */}
          <div className="px-4 py-3 bg-[var(--vscode-bg)] border-t border-[var(--vscode-sidebar-border)] text-xs text-[var(--vscode-text-muted)]">
            💡 These aren&apos;t bugs, they&apos;re features! Click any problem to learn more.
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
