'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  Star,
  Check,
  X,
  Search,
  Verified,
  TrendingUp,
  Puzzle,
} from 'lucide-react';

interface ExtensionsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Extension {
  id: string;
  name: string;
  publisher: string;
  description: string;
  rating: number;
  downloads: string;
  installed: boolean;
  verified: boolean;
  icon: string;
  category: string;
}

const extensions: Extension[] = [
  {
    id: '1',
    name: 'React Skills',
    publisher: 'Arjun Rajput',
    description: 'Advanced React.js, Next.js, and TypeScript capabilities',
    rating: 5.0,
    downloads: '100K+',
    installed: true,
    verified: true,
    icon: '⚛️',
    category: 'Frontend',
  },
  {
    id: '2',
    name: 'AI/ML Toolkit',
    publisher: 'Arjun Rajput',
    description: 'TensorFlow, PyTorch, and OpenAI integration',
    rating: 4.9,
    downloads: '50K+',
    installed: true,
    verified: true,
    icon: '🤖',
    category: 'AI',
  },
  {
    id: '3',
    name: 'Java Expert',
    publisher: 'Arjun Rajput',
    description: 'Core Java, OOPS, Data Structures expertise',
    rating: 4.9,
    downloads: '85K+',
    installed: true,
    verified: true,
    icon: '☕',
    category: 'Backend',
  },
  {
    id: '4',
    name: 'Python Pro',
    publisher: 'Arjun Rajput',
    description: 'Django, Flask, FastAPI with async support',
    rating: 4.9,
    downloads: '80K+',
    installed: true,
    verified: true,
    icon: '🐍',
    category: 'Backend',
  },
  {
    id: '5',
    name: 'Problem Solver',
    publisher: 'LeetCode',
    description: '700+ DSA problems solved with optimal solutions',
    rating: 5.0,
    downloads: '∞',
    installed: true,
    verified: true,
    icon: '🧠',
    category: 'Algorithms',
  },
  {
    id: '6',
    name: 'Database Master',
    publisher: 'Arjun Rajput',
    description: 'PostgreSQL, MySQL, MongoDB, Supabase',
    rating: 4.7,
    downloads: '60K+',
    installed: true,
    verified: true,
    icon: '🗄️',
    category: 'Database',
  },
  {
    id: '7',
    name: 'Hire Me Extension',
    publisher: 'Recruiters Favorite',
    description: 'Click to send a job offer instantly!',
    rating: 5.0,
    downloads: '∞',
    installed: false,
    verified: true,
    icon: '💼',
    category: 'Career',
  },
];

const categories = ['All', 'Frontend', 'Backend', 'AI', 'Database', 'Algorithms', 'Career'];

export default function ExtensionsPanel({ isOpen, onClose }: ExtensionsPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [installedExtensions, setInstalledExtensions] = useState(
    extensions.reduce((acc, ext) => ({ ...acc, [ext.id]: ext.installed }), {} as Record<string, boolean>)
  );

  const filteredExtensions = extensions.filter(ext => {
    const matchesSearch = ext.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ext.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || ext.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleInstall = (id: string) => {
    setInstalledExtensions(prev => ({ ...prev, [id]: !prev[id] }));
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
          <span className="text-xs font-medium uppercase tracking-wide flex items-center gap-2">
            <Puzzle size={14} />
            Extensions
          </span>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[var(--vscode-line-highlight)] rounded"
          >
            <X size={14} />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-[var(--vscode-border)]">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--vscode-text-muted)]" />
            <input
              type="text"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[var(--vscode-bg)] border border-[var(--vscode-border)] rounded text-sm focus:outline-none focus:border-[var(--vscode-accent)]"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="px-3 py-2 flex gap-1 flex-wrap border-b border-[var(--vscode-border)]">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2 py-1 text-[10px] rounded-full transition-colors ${
                selectedCategory === cat
                  ? 'bg-[var(--vscode-accent)] text-white'
                  : 'bg-[var(--vscode-bg)] hover:bg-[var(--vscode-line-highlight)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Extensions List */}
        <div className="flex-1 overflow-auto">
          <div className="p-2 text-[10px] text-[var(--vscode-text-muted)] uppercase tracking-wide px-4">
            Installed Skills • {Object.values(installedExtensions).filter(Boolean).length}
          </div>
          {filteredExtensions.map((ext) => (
            <motion.div
              key={ext.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 mx-2 mb-2 rounded bg-[var(--vscode-bg)] hover:bg-[var(--vscode-line-highlight)] transition-colors group"
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">{ext.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm truncate">{ext.name}</span>
                    {ext.verified && (
                      <Verified size={12} className="text-blue-400 flex-shrink-0" />
                    )}
                  </div>
                  <div className="text-[10px] text-[var(--vscode-text-muted)]">
                    {ext.publisher}
                  </div>
                  <p className="text-xs text-[var(--vscode-text-muted)] mt-1 line-clamp-2">
                    {ext.description}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1">
                      <Star size={10} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-[10px]">{ext.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-[var(--vscode-text-muted)]">
                      <Download size={10} />
                      {ext.downloads}
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--vscode-sidebar)] text-[var(--vscode-text-muted)]">
                      {ext.category}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => toggleInstall(ext.id)}
                  className={`flex-shrink-0 p-2 rounded transition-colors ${
                    installedExtensions[ext.id]
                      ? 'bg-green-400/20 text-green-400'
                      : 'bg-[var(--vscode-accent)] hover:opacity-90'
                  }`}
                >
                  {installedExtensions[ext.id] ? (
                    <Check size={14} />
                  ) : (
                    <Download size={14} />
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trending Section */}
        <div className="p-3 border-t border-[var(--vscode-border)] bg-[var(--vscode-bg)]">
          <div className="flex items-center gap-2 text-[10px] text-[var(--vscode-text-muted)] mb-2">
            <TrendingUp size={12} />
            <span className="uppercase tracking-wide">Trending</span>
          </div>
          <p className="text-xs text-[var(--vscode-text)]">
            🔥 All skills actively maintained and production-ready!
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
