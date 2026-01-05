'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Brain, Info, X, Play, Sparkles, Network, Layers, BarChart3 } from 'lucide-react';
import { skillsData, categoryInfo, getNetworkStats } from './skillsData';

// Dynamically import the visualizer to avoid SSR issues
const SkillsNetworkVisualizer = dynamic(
  () => import('./SkillsNetworkVisualizer'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full bg-[var(--vscode-bg)]">
        <div className="flex flex-col items-center gap-4">
          <Brain className="w-12 h-12 text-[var(--vscode-accent)] animate-pulse" />
          <span className="text-[var(--vscode-text-muted)]">Loading Neural Network...</span>
        </div>
      </div>
    )
  }
);

export default function SkillsNetworkSection() {
  const [isNetworkOpen, setIsNetworkOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setIsMounted(true));
  }, []);

  // Track if modal has ever been opened to start loading the visualizer
  useEffect(() => {
    if (isNetworkOpen && !hasBeenOpened) {
      setHasBeenOpened(true);
    }
  }, [isNetworkOpen, hasBeenOpened]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isNetworkOpen) {
        setIsNetworkOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isNetworkOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isNetworkOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isNetworkOpen]);

  const stats = isMounted ? getNetworkStats() : { totalSkills: 0, totalConnections: 0, categoryBreakdown: {} };

  return (
    <section id="skills-network" className="min-h-[50vh] py-8 px-4 md:px-8">
      {/* Skills Network Section Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="text-[var(--vscode-accent)]" size={32} />
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--vscode-text)]">
              Skills Neural Network
            </h2>
            <span className="px-2 py-0.5 text-xs font-bold bg-purple-500 text-white rounded-full animate-pulse">
              INTERACTIVE
            </span>
          </div>
          <p className="text-[var(--vscode-comment)]">
            Explore my technical skills as an interconnected neural network visualization!
          </p>
        </div>

        {/* Preview Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[var(--vscode-sidebar)] to-[var(--vscode-editor)] border border-[var(--vscode-border)] p-8"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 text-6xl">🧠</div>
            <div className="absolute bottom-4 left-4 text-4xl">🔗</div>
            <div className="absolute top-1/2 right-1/4 text-3xl">⚡</div>
            <div className="absolute bottom-1/3 right-1/3 text-2xl">💻</div>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            {/* Left: Info */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl md:text-2xl font-bold text-[var(--vscode-text)] mb-3">
                Visualize My Skills
              </h3>
              <p className="text-[var(--vscode-comment)] mb-4">
                An interactive force-directed graph showing {skillsData.nodes.length} skills and their relationships. 
                Filter by category, search skills, and watch skill growth over time!
              </p>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <Network size={16} className="text-purple-400" />
                  <span className="text-[var(--vscode-text-muted)]">
                    {stats.totalSkills} Skills
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Layers size={16} className="text-blue-400" />
                  <span className="text-[var(--vscode-text-muted)]">
                    {stats.totalConnections} Connections
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <BarChart3 size={16} className="text-green-400" />
                  <span className="text-[var(--vscode-text-muted)]">
                    {Object.keys(stats.categoryBreakdown).length} Categories
                  </span>
                </div>
              </div>

              {/* Open Network Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsNetworkOpen(true)}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-shadow"
              >
                <Play size={24} fill="currentColor" />
                Explore Network
                <Sparkles size={20} />
              </motion.button>
            </div>

            {/* Right: Category Preview Grid */}
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(categoryInfo).map(([key, info], i) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="w-16 h-16 md:w-20 md:h-20 flex flex-col items-center justify-center rounded-lg bg-[var(--vscode-line-highlight)] border border-[var(--vscode-border)] gap-0.5 p-1"
                  style={{ borderColor: info.color + '40' }}
                >
                  <span className="text-2xl md:text-3xl">{info.icon}</span>
                  <span className="text-[8px] md:text-[10px] text-[var(--vscode-text-muted)] text-center leading-tight px-0.5">
                    {info.label.split(' ').map((word, idx) => (
                      <span key={idx} className="block">{word}</span>
                    ))}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Fullscreen Network Popup Modal - z-[10000] ensures it's above all other UI elements */}
      {/* Keep modal structure in DOM but toggle visibility to preserve graph state */}
      <div 
        className={`fixed inset-0 z-[10000] transition-all duration-300 ${
          isNetworkOpen 
            ? 'opacity-100 pointer-events-auto' 
            : 'opacity-0 pointer-events-none'
        }`}
        style={{ visibility: isNetworkOpen ? 'visible' : 'hidden' }}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/90 backdrop-blur-md"
          onClick={() => setIsNetworkOpen(false)}
        />
        
        {/* Modal Content */}
        <div 
          className={`fixed inset-4 md:inset-6 lg:inset-8 bg-[var(--vscode-editor)] border border-[var(--vscode-border)] rounded-xl shadow-2xl overflow-hidden flex flex-col z-[10001] transition-transform duration-300 ${
            isNetworkOpen ? 'scale-100' : 'scale-95'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Popup Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--vscode-border)] bg-[var(--vscode-sidebar)] flex-shrink-0">
            <div className="flex items-center gap-3">
              <Brain className="text-[var(--vscode-accent)]" size={24} />
              <h3 className="text-lg font-bold text-[var(--vscode-text)]">
                Skills Neural Network
              </h3>
              <span className="hidden md:inline-block px-2 py-0.5 text-xs bg-purple-500/20 text-purple-400 rounded">
                {skillsData.nodes.length} skills • {skillsData.links.length} connections
              </span>
            </div>
            <div className="flex items-center gap-2">
              {/* Instructions hint */}
              <div className="hidden lg:flex items-center gap-2 text-xs text-[var(--vscode-text-muted)] mr-4">
                <Info size={14} />
                <span>Drag nodes • Scroll to zoom • Click for details • Press ESC to close</span>
              </div>
              <button
                onClick={() => setIsNetworkOpen(false)}
                className="p-2 rounded-md hover:bg-[var(--vscode-line-highlight)] transition-colors"
                aria-label="Close network visualization"
                title="Close (ESC)"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Popup Content - Full Network Visualizer */}
          {/* Only render visualizer after first open, then keep it mounted */}
          <div className="flex-1 overflow-hidden relative">
            {hasBeenOpened && <SkillsNetworkVisualizer />}
          </div>
        </div>
      </div>
    </section>
  );
}
