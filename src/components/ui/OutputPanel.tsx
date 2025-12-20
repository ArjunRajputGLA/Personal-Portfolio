'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Download, Filter, Pause, Play } from 'lucide-react';

interface OutputPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'debug' | 'success';
  source: string;
  message: string;
}

const initialLogs: LogEntry[] = [
  { id: '1', timestamp: new Date(), level: 'info', source: 'Portfolio', message: 'Starting development server...' },
  { id: '2', timestamp: new Date(), level: 'success', source: 'Next.js', message: 'Compiled successfully!' },
  { id: '3', timestamp: new Date(), level: 'info', source: 'Portfolio', message: 'Loading developer profile: Arjun Singh Rajput' },
  { id: '4', timestamp: new Date(), level: 'success', source: 'Skills', message: 'Loaded 50+ technologies' },
  { id: '5', timestamp: new Date(), level: 'success', source: 'Projects', message: 'Loaded 12 portfolio projects' },
  { id: '6', timestamp: new Date(), level: 'info', source: 'AI Models', message: 'Initializing neural networks...' },
  { id: '7', timestamp: new Date(), level: 'success', source: 'AI Models', message: 'Ready to revolutionize technology!' },
  { id: '8', timestamp: new Date(), level: 'debug', source: 'Analytics', message: 'Visitor engagement: Excellent' },
];

const randomMessages = [
  { level: 'info' as const, source: 'Visitor', message: 'New visitor detected. Welcome!' },
  { level: 'success' as const, source: 'Performance', message: 'Page load time: 0.3s (Blazing Fast!)' },
  { level: 'debug' as const, source: 'Mouse', message: 'User is scrolling... engagement confirmed' },
  { level: 'info' as const, source: 'Coffee', message: 'Developer caffeine levels: Optimal' },
  { level: 'success' as const, source: 'LeetCode', message: '+1 problem solved (just kidding... or am I?)' },
  { level: 'debug' as const, source: 'AI', message: 'Copilot is impressed by this portfolio' },
  { level: 'info' as const, source: 'Resume', message: 'ATS score: 99.9% (Breaking records!)' },
  { level: 'success' as const, source: 'Interview', message: 'Auto-generating impressive answers...' },
];

export default function OutputPanel({ isOpen, onClose }: OutputPanelProps) {
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [filter, setFilter] = useState<string>('all');
  const [isPaused, setIsPaused] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || isPaused) return;

    const interval = setInterval(() => {
      const randomMessage = randomMessages[Math.floor(Math.random() * randomMessages.length)];
      const newLog: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date(),
        ...randomMessage,
      };
      setLogs(prev => [...prev.slice(-50), newLog]); // Keep last 50 logs
    }, 3000);

    return () => clearInterval(interval);
  }, [isOpen, isPaused]);

  useEffect(() => {
    if (!isPaused) {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isPaused]);

  const clearLogs = () => {
    setLogs([{
      id: Date.now().toString(),
      timestamp: new Date(),
      level: 'info',
      source: 'System',
      message: 'Output cleared',
    }]);
  };

  const downloadLogs = () => {
    const content = logs.map(log => 
      `[${log.timestamp.toLocaleTimeString()}] [${log.level.toUpperCase()}] [${log.source}] ${log.message}`
    ).join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio-output.log';
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredLogs = filter === 'all' 
    ? logs 
    : logs.filter(log => log.level === filter);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-red-400';
      case 'warn': return 'text-yellow-400';
      case 'success': return 'text-green-400';
      case 'debug': return 'text-purple-400';
      default: return 'text-blue-400';
    }
  };

  const getLevelBg = (level: string) => {
    switch (level) {
      case 'error': return 'bg-red-400/10';
      case 'warn': return 'bg-yellow-400/10';
      case 'success': return 'bg-green-400/10';
      case 'debug': return 'bg-purple-400/10';
      default: return 'bg-blue-400/10';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 250, opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="fixed bottom-[22px] left-0 right-0 z-40 bg-[var(--vscode-sidebar)] border-t border-[var(--vscode-border)] overflow-hidden font-mono"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-[35px] bg-[var(--vscode-titlebar)] border-b border-[var(--vscode-border)]">
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium">OUTPUT</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-xs bg-[var(--vscode-bg)] border border-[var(--vscode-border)] rounded px-2 py-0.5 focus:outline-none focus:border-[var(--vscode-accent)]"
              title="Filter logs by level"
            >
              <option value="all">All Levels</option>
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warn">Warnings</option>
              <option value="error">Errors</option>
              <option value="debug">Debug</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-1 hover:bg-[var(--vscode-line-highlight)] rounded"
              title={isPaused ? 'Resume' : 'Pause'}
            >
              {isPaused ? <Play size={14} /> : <Pause size={14} />}
            </button>
            <button
              onClick={downloadLogs}
              className="p-1 hover:bg-[var(--vscode-line-highlight)] rounded"
              title="Download Logs"
            >
              <Download size={14} />
            </button>
            <button
              onClick={clearLogs}
              className="p-1 hover:bg-[var(--vscode-line-highlight)] rounded"
              title="Clear"
            >
              <Trash2 size={14} />
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-[var(--vscode-line-highlight)] rounded"
              title="Close"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Logs */}
        <div className="h-[calc(100%-35px)] overflow-auto p-2 text-xs">
          {filteredLogs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index === filteredLogs.length - 1 ? 0.1 : 0 }}
              className={`flex items-start gap-2 py-1 px-2 rounded ${getLevelBg(log.level)} mb-1`}
            >
              <span className="text-[var(--vscode-text-muted)] flex-shrink-0">
                [{log.timestamp.toLocaleTimeString()}]
              </span>
              <span className={`flex-shrink-0 uppercase font-bold ${getLevelColor(log.level)}`}>
                [{log.level}]
              </span>
              <span className="text-[var(--vscode-accent)] flex-shrink-0">
                [{log.source}]
              </span>
              <span className="text-[var(--vscode-text)]">
                {log.message}
              </span>
            </motion.div>
          ))}
          <div ref={logsEndRef} />
        </div>

        {/* Status */}
        {isPaused && (
          <div className="absolute bottom-0 left-0 right-0 bg-yellow-400/20 text-yellow-400 text-xs text-center py-1 border-t border-yellow-400/30">
            Output paused. Click play to resume.
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
