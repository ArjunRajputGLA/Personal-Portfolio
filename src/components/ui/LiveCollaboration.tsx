'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Circle, Eye, Globe } from 'lucide-react';

interface Collaborator {
  id: string;
  name: string;
  avatar: string;
  color: string;
  cursor: { x: number; y: number };
  section: string;
  activity: string;
}

const generateCollaborators = (): Collaborator[] => {
  const names = ['Recruiter', 'HR Manager', 'Tech Lead', 'CEO', 'Investor', 'Visitor'];
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
  const sections = ['hero', 'about', 'skills', 'projects', 'experience', 'contact'];
  const activities = [
    'Viewing your resume',
    'Reading your skills',
    'Impressed by projects',
    'Checking experience',
    'About to send offer',
    'Bookmarked profile',
  ];

  const count = Math.floor(Math.random() * 3) + 2;
  return Array.from({ length: count }, (_, i) => ({
    id: `${i}`,
    name: names[i % names.length],
    avatar: names[i % names.length].charAt(0),
    color: colors[i % colors.length],
    cursor: {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
    },
    section: sections[Math.floor(Math.random() * sections.length)],
    activity: activities[i % activities.length],
  }));
};

export default function LiveCollaboration() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCursors, setShowCursors] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);

  useEffect(() => {
    // Initialize collaborators
    setCollaborators(generateCollaborators());
    setViewerCount(Math.floor(Math.random() * 10) + 5);

    // Update collaborators periodically
    const interval = setInterval(() => {
      setCollaborators(prev => {
        return prev.map(c => ({
          ...c,
          cursor: {
            x: c.cursor.x + (Math.random() - 0.5) * 100,
            y: c.cursor.y + (Math.random() - 0.5) * 100,
          },
        }));
      });
    }, 2000);

    // Randomly add/remove collaborators
    const addRemoveInterval = setInterval(() => {
      if (Math.random() > 0.5) {
        setViewerCount(prev => Math.max(3, Math.min(20, prev + (Math.random() > 0.5 ? 1 : -1))));
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(addRemoveInterval);
    };
  }, []);

  return (
    <>
      {/* Live Indicator in Status Bar Area */}
      <div className="fixed bottom-[22px] right-[200px] z-50">
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-3 py-1 bg-[var(--vscode-sidebar)] border border-[var(--vscode-border)] rounded-t hover:bg-[var(--vscode-line-highlight)] transition-colors"
          whileHover={{ scale: 1.02 }}
        >
          <motion.div
            className="w-2 h-2 rounded-full bg-green-400"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <Users size={12} />
          <span className="text-xs">{viewerCount} viewing</span>
        </motion.button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: 10, height: 0 }}
              className="absolute bottom-full right-0 w-64 mb-1 bg-[var(--vscode-sidebar)] border border-[var(--vscode-border)] rounded shadow-xl overflow-hidden"
            >
              {/* Header */}
              <div className="px-3 py-2 bg-[var(--vscode-titlebar)] border-b border-[var(--vscode-border)]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">Live Collaboration</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowCursors(!showCursors);
                    }}
                    className={`p-1 rounded text-xs ${showCursors ? 'bg-[var(--vscode-accent)]' : 'hover:bg-[var(--vscode-line-highlight)]'}`}
                    title="Toggle cursors"
                  >
                    <Eye size={12} />
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="px-3 py-2 border-b border-[var(--vscode-border)] bg-green-400/5">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-green-400">
                    <Globe size={12} />
                    Live Session Active
                  </span>
                  <span className="text-[var(--vscode-text-muted)]">
                    {viewerCount} visitors
                  </span>
                </div>
              </div>

              {/* Collaborators */}
              <div className="max-h-48 overflow-auto">
                {collaborators.map((collab) => (
                  <div
                    key={collab.id}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-[var(--vscode-line-highlight)]"
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ backgroundColor: collab.color }}
                    >
                      {collab.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium">{collab.name}</div>
                      <div className="text-[10px] text-[var(--vscode-text-muted)] truncate">
                        {collab.activity}
                      </div>
                    </div>
                    <Circle
                      size={8}
                      className="fill-green-400 text-green-400"
                    />
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-3 py-2 bg-[var(--vscode-bg)] border-t border-[var(--vscode-border)]">
                <p className="text-[10px] text-[var(--vscode-text-muted)] text-center">
                  🌟 People are viewing your portfolio right now!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cursor Visualizations */}
      <AnimatePresence>
        {showCursors && collaborators.map((collab) => (
          <motion.div
            key={collab.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 0.8,
              scale: 1,
              x: collab.cursor.x,
              y: collab.cursor.y,
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ type: 'spring', stiffness: 100 }}
            className="fixed pointer-events-none z-[100]"
            style={{ left: 0, top: 0 }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20">
              <path
                d="M0 0L0 16L4.5 12L8 20L10 19L6.5 11L12 11L0 0Z"
                fill={collab.color}
              />
            </svg>
            <div
              className="absolute left-5 top-3 px-2 py-0.5 rounded text-[10px] text-white whitespace-nowrap"
              style={{ backgroundColor: collab.color }}
            >
              {collab.name}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </>
  );
}
