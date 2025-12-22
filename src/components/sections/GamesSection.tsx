'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gamepad2, 
  Brain, 
  Puzzle, 
  Target, 
  Zap,
  Trophy,
  Star,
  TrendingUp,
  Settings,
  X,
  Award,
  Flame,
  Volume2,
  VolumeX,
  Play,
  Sparkles
} from 'lucide-react';

// Import game components
import Game2048 from '../games/Game2048';
import MemoryMatch from '../games/MemoryMatch';
import SnakeGame from '../games/SnakeGame';
import Minesweeper from '../games/Minesweeper';
import MathChallenge from '../games/MathChallenge';
import SimonSays from '../games/SimonSays';
import ColorMatch from '../games/ColorMatch';
import NumberSequence from '../games/NumberSequence';
import SudokuGame from '../games/SudokuGame';

// Game Stats interface
interface GameStats {
  gamesPlayed: number;
  totalTime: number;
  favoriteGame: string;
  streak: number;
  lastPlayed: string;
  highScores: { [gameName: string]: number | string };
  achievements: string[];
  preferences: {
    soundEnabled: boolean;
    difficulty: 'easy' | 'medium' | 'hard';
  };
}

// Achievement interface
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
}

// Game interface
interface Game {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: 'logic' | 'memory' | 'puzzle' | 'arcade' | 'brain';
  difficulty: number;
  component: React.ComponentType<GameComponentProps>;
}

interface GameComponentProps {
  onBack: () => void;
  onScoreUpdate: (score: number) => void;
  onGameComplete: (won: boolean, score: number) => void;
  soundEnabled: boolean;
}

// Categories
const categories = [
  { id: 'all', label: 'All Games', icon: Gamepad2 },
  { id: 'logic', label: 'Logic', icon: Brain },
  { id: 'memory', label: 'Memory', icon: Target },
  { id: 'puzzle', label: 'Puzzle', icon: Puzzle },
  { id: 'arcade', label: 'Arcade', icon: Zap },
];

// Games list
const games: Game[] = [
  { id: '2048', name: '2048', icon: '🧠', description: 'Slide & Combine tiles to reach 2048', category: 'logic', difficulty: 5, component: Game2048 },
  { id: 'sudoku', name: 'Sudoku', icon: '🧩', description: 'Classic number logic puzzle', category: 'logic', difficulty: 4, component: SudokuGame },
  { id: 'memory', name: 'Memory Match', icon: '🎯', description: 'Find matching pairs of cards', category: 'memory', difficulty: 3, component: MemoryMatch },
  { id: 'snake', name: 'Snake', icon: '🐍', description: 'Classic arcade snake game', category: 'arcade', difficulty: 4, component: SnakeGame },
  { id: 'minesweeper', name: 'Minesweeper', icon: '💣', description: 'Find mines without exploding', category: 'logic', difficulty: 5, component: Minesweeper },
  { id: 'math', name: 'Math Challenge', icon: '🧮', description: 'Quick mental calculations', category: 'brain', difficulty: 4, component: MathChallenge },
  { id: 'sequence', name: 'Number Sequence', icon: '🔢', description: 'Find the pattern in numbers', category: 'logic', difficulty: 4, component: NumberSequence },
  { id: 'simon', name: 'Simon Says', icon: '🎵', description: 'Remember the color pattern', category: 'memory', difficulty: 3, component: SimonSays },
  { id: 'color', name: 'Color Match', icon: '🎨', description: 'Match word with color quickly', category: 'brain', difficulty: 3, component: ColorMatch },
];

// Achievements list
const allAchievements: Achievement[] = [
  { id: 'first-game', title: 'First Steps', description: 'Play your first game', icon: '🎮', rarity: 'common', unlocked: false },
  { id: 'five-games', title: 'Getting Started', description: 'Play 5 different games', icon: '🎯', rarity: 'common', unlocked: false },
  { id: '2048-master', title: '2048 Champion', description: 'Reach 2048 tile', icon: '🏆', rarity: 'epic', unlocked: false },
  { id: 'sudoku-speed', title: 'Sudoku Speed Runner', description: 'Complete Hard Sudoku in under 5 minutes', icon: '⚡', rarity: 'rare', unlocked: false },
  { id: 'memory-perfect', title: 'Perfect Memory', description: 'Complete Memory Match without mistakes', icon: '🧠', rarity: 'rare', unlocked: false },
  { id: 'snake-20', title: 'Snake Charmer', description: 'Reach length 20 in Snake', icon: '🐍', rarity: 'uncommon', unlocked: false },
  { id: 'minesweeper-expert', title: 'Bomb Squad', description: 'Complete Expert Minesweeper', icon: '💣', rarity: 'epic', unlocked: false },
  { id: 'math-streak', title: 'Math Genius', description: 'Get 15 correct answers in a row', icon: '🧮', rarity: 'rare', unlocked: false },
  { id: 'simon-10', title: 'Pattern Master', description: 'Reach round 10 in Simon Says', icon: '🎵', rarity: 'uncommon', unlocked: false },
  { id: 'night-owl', title: 'Night Owl', description: 'Play games between 12 AM - 5 AM', icon: '🦉', rarity: 'uncommon', unlocked: false },
  { id: 'speed-demon', title: 'Speed Demon', description: 'Complete any game in under 30 seconds', icon: '⚡', rarity: 'rare', unlocked: false },
  { id: 'persistent', title: 'Persistent Player', description: 'Play games for 5 days in a row', icon: '🔥', rarity: 'rare', unlocked: false },
  { id: 'completionist', title: 'Completionist', description: 'Play all 9 games at least once', icon: '✨', rarity: 'epic', unlocked: false },
  { id: 'high-roller', title: 'High Roller', description: 'Achieve 1000+ total score across all games', icon: '💯', rarity: 'epic', unlocked: false },
  { id: 'color-master', title: 'Color Master', description: 'Score 500+ in Color Match', icon: '🎨', rarity: 'uncommon', unlocked: false },
];

// Version for stats reset - increment this when deploying to clear old dev data
const STATS_VERSION = 'v1.0';

const defaultStats: GameStats = {
  gamesPlayed: 0,
  totalTime: 0,
  favoriteGame: '',
  streak: 0,
  lastPlayed: '',
  highScores: {},
  achievements: [],
  preferences: {
    soundEnabled: true,
    difficulty: 'medium',
  },
};

// Helper function to load stats from localStorage with version check
function loadStatsFromStorage(): GameStats {
  if (typeof window === 'undefined') {
    return defaultStats;
  }
  
  // Check version - reset if different
  const savedVersion = localStorage.getItem('arjun-portfolio-game-stats-version');
  if (savedVersion !== STATS_VERSION) {
    // Clear old stats and set new version
    localStorage.removeItem('arjun-portfolio-game-stats');
    localStorage.setItem('arjun-portfolio-game-stats-version', STATS_VERSION);
    return defaultStats;
  }
  
  const savedStats = localStorage.getItem('arjun-portfolio-game-stats');
  if (savedStats) {
    try {
      return JSON.parse(savedStats);
    } catch (e) {
      console.error('Failed to load game stats:', e);
    }
  }
  return defaultStats;
}

export default function GamesSection() {
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [stats, setStats] = useState<GameStats>(loadStatsFromStorage);
  const [showStats, setShowStats] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Mark first-time visitor
  useEffect(() => {
    const hasVisited = localStorage.getItem('games-visited');
    if (!hasVisited) {
      localStorage.setItem('games-visited', 'true');
    }
  }, []);

  // Save stats to localStorage
  const saveStats = useCallback((newStats: GameStats) => {
    setStats(newStats);
    localStorage.setItem('arjun-portfolio-game-stats', JSON.stringify(newStats));
  }, []);

  // Check and unlock achievements
  const checkAchievements = useCallback((currentStats: GameStats) => {
    const unlockedAchievements = [...currentStats.achievements];
    let newUnlock: Achievement | null = null;

    // First game achievement
    if (currentStats.gamesPlayed >= 1 && !unlockedAchievements.includes('first-game')) {
      unlockedAchievements.push('first-game');
      newUnlock = allAchievements.find(a => a.id === 'first-game') || null;
    }

    // Night owl achievement
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 5 && !unlockedAchievements.includes('night-owl')) {
      unlockedAchievements.push('night-owl');
      newUnlock = allAchievements.find(a => a.id === 'night-owl') || null;
    }

    // High roller achievement
    const totalScore = Object.values(currentStats.highScores).reduce((acc: number, score) => {
      return acc + (typeof score === 'number' ? score : 0);
    }, 0 as number);
    if ((totalScore as number) >= 1000 && !unlockedAchievements.includes('high-roller')) {
      unlockedAchievements.push('high-roller');
      newUnlock = allAchievements.find(a => a.id === 'high-roller') || null;
    }

    if (newUnlock) {
      setNewAchievement(newUnlock);
      setTimeout(() => setNewAchievement(null), 4000);
    }

    return unlockedAchievements;
  }, []);

  // Handle game score update
  const handleScoreUpdate = useCallback((gameId: string, score: number) => {
    setStats(prev => {
      const currentHighScore = prev.highScores[gameId];
      const isNewHighScore = !currentHighScore || (typeof currentHighScore === 'number' && score > currentHighScore);
      
      if (isNewHighScore) {
        const newStats = {
          ...prev,
          highScores: { ...prev.highScores, [gameId]: score },
        };
        saveStats(newStats);
        return newStats;
      }
      return prev;
    });
  }, [saveStats]);

  // Handle game completion
  const handleGameComplete = useCallback((gameId: string, won: boolean, score: number) => {
    setStats(prev => {
      const playCount: { [key: string]: number } = {};
      const newGamesPlayed = prev.gamesPlayed + 1;
      
      // Update favorite game tracking
      Object.entries(prev.highScores).forEach(([game]) => {
        playCount[game] = (playCount[game] || 0) + 1;
      });
      playCount[gameId] = (playCount[gameId] || 0) + 1;
      
      const favoriteGame = Object.entries(playCount).sort((a, b) => b[1] - a[1])[0]?.[0] || gameId;
      
      const newStats: GameStats = {
        ...prev,
        gamesPlayed: newGamesPlayed,
        favoriteGame,
        lastPlayed: new Date().toISOString(),
        highScores: {
          ...prev.highScores,
          [gameId]: Math.max(
            typeof prev.highScores[gameId] === 'number' ? prev.highScores[gameId] as number : 0,
            score
          ),
        },
      };

      // Check achievements
      newStats.achievements = checkAchievements(newStats);
      
      saveStats(newStats);
      return newStats;
    });
  }, [saveStats, checkAchievements]);

  // Filter games by category
  const filteredGames = activeCategory === 'all' 
    ? games 
    : games.filter(game => game.category === activeCategory);

  // Render difficulty stars
  const renderStars = (difficulty: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <Star 
            key={star} 
            size={12} 
            className={star <= difficulty ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'} 
          />
        ))}
      </div>
    );
  };

  // Rarity colors
  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'uncommon': return 'text-green-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <section id="games" className="min-h-[50vh] py-8 px-4 md:px-8">
      {/* Games Section Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Gamepad2 className="text-[var(--vscode-accent)]" size={32} />
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--vscode-text)]">
              Games Playground
            </h2>
            <span className="px-2 py-0.5 text-xs font-bold bg-green-500 text-white rounded-full animate-pulse">
              NEW
            </span>
          </div>
          <p className="text-[var(--vscode-comment)]">
            Take a break and challenge your brain with logic and memory games!
          </p>
        </div>

        {/* Playground Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[var(--vscode-sidebar)] to-[var(--vscode-editor)] border border-[var(--vscode-border)] p-8"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 text-6xl">🎮</div>
            <div className="absolute bottom-4 left-4 text-4xl">🧩</div>
            <div className="absolute top-1/2 right-1/4 text-3xl">🎯</div>
            <div className="absolute bottom-1/3 right-1/3 text-2xl">🐍</div>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            {/* Left: Info */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl md:text-2xl font-bold text-[var(--vscode-text)] mb-3">
                Ready to Play?
              </h3>
              <p className="text-[var(--vscode-comment)] mb-4">
                {games.length} brain-teasing games including 2048, Sudoku, Snake, Memory Match, and more!
              </p>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <Award size={16} className="text-purple-400" />
                  <span className="text-[var(--vscode-text-muted)]">
                    {stats.achievements.length}/{allAchievements.length} achievements
                  </span>
                </div>
              </div>

              {/* Open Playground Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsPlaygroundOpen(true)}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-lg bg-[var(--vscode-accent)] text-white font-bold text-lg shadow-lg shadow-[var(--vscode-accent)]/30 hover:shadow-xl hover:shadow-[var(--vscode-accent)]/40 transition-shadow"
              >
                <Play size={24} fill="currentColor" />
                Open Playground
                <Sparkles size={20} />
              </motion.button>
            </div>

            {/* Right: Game Preview Grid */}
            <div className="grid grid-cols-3 gap-2">
              {games.slice(0, 6).map((game, i) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-lg bg-[var(--vscode-line-highlight)] border border-[var(--vscode-border)] text-2xl md:text-3xl"
                >
                  {game.icon}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Playground Popup Modal */}
      <AnimatePresence>
        {isPlaygroundOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            onClick={() => !selectedGame && setIsPlaygroundOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="fixed inset-4 md:inset-8 lg:inset-12 bg-[var(--vscode-editor)] border border-[var(--vscode-border)] rounded-xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Popup Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--vscode-border)] bg-[var(--vscode-sidebar)]">
                <div className="flex items-center gap-3">
                  <Gamepad2 className="text-[var(--vscode-accent)]" size={24} />
                  <h3 className="text-lg font-bold text-[var(--vscode-text)]">
                    Games Playground
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setSelectedGame(null);
                    setIsPlaygroundOpen(false);
                  }}
                  className="p-2 rounded-md hover:bg-[var(--vscode-line-highlight)] transition-colors"
                  aria-label="Close playground"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Popup Content */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6">
                <AnimatePresence mode="wait">
                  {selectedGame ? (
                    // Game Play View
                    <motion.div
                      key="game-view"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="max-w-4xl mx-auto"
                    >
                      <selectedGame.component
                        onBack={() => setSelectedGame(null)}
                        onScoreUpdate={(score) => handleScoreUpdate(selectedGame.id, score)}
                        onGameComplete={(won, score) => handleGameComplete(selectedGame.id, won, score)}
                        soundEnabled={soundEnabled}
                      />
                    </motion.div>
                  ) : (
                    // Games List View
                    <motion.div
                      key="games-list"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {/* Top Bar - Categories & Stats */}
                      <div className="flex flex-col md:flex-row gap-4 mb-6">
                        {/* Category Filters */}
                        <div className="flex flex-wrap gap-2 flex-1">
                          {categories.map(cat => {
                            const Icon = cat.icon;
                            return (
                              <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`
                                  flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium
                                  transition-all duration-200
                                  ${activeCategory === cat.id 
                                    ? 'bg-[var(--vscode-accent)] text-white' 
                                    : 'bg-[var(--vscode-sidebar)] text-[var(--vscode-text-muted)] hover:bg-[var(--vscode-line-highlight)] hover:text-[var(--vscode-text)]'
                                  }
                                `}
                              >
                                <Icon size={16} />
                                {cat.label}
                              </button>
                            );
                          })}
                        </div>

                        {/* Quick Stats & Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSoundEnabled(!soundEnabled)}
                            className="p-2 rounded-md bg-[var(--vscode-sidebar)] hover:bg-[var(--vscode-line-highlight)] transition-colors"
                            title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
                            aria-label={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
                          >
                            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                          </button>
                          <button
                            onClick={() => setShowStats(true)}
                            className="flex items-center gap-2 px-3 py-2 rounded-md bg-[var(--vscode-sidebar)] hover:bg-[var(--vscode-line-highlight)] transition-colors"
                            aria-label="View stats"
                          >
                            <Trophy size={16} className="text-yellow-400" />
                            <span className="text-sm hidden sm:inline">Stats</span>
                          </button>
                          <button
                            onClick={() => setShowAchievements(true)}
                            className="flex items-center gap-2 px-3 py-2 rounded-md bg-[var(--vscode-sidebar)] hover:bg-[var(--vscode-line-highlight)] transition-colors"
                            aria-label="View achievements"
                          >
                            <Award size={16} className="text-purple-400" />
                            <span className="text-sm hidden sm:inline">Achievements</span>
                          </button>
                          <button
                            onClick={() => setShowSettings(true)}
                            className="p-2 rounded-md bg-[var(--vscode-sidebar)] hover:bg-[var(--vscode-line-highlight)] transition-colors"
                            aria-label="Open settings"
                          >
                            <Settings size={18} />
                          </button>
                        </div>
                      </div>

                      {/* Games Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        {filteredGames.map((game, index) => (
                          <motion.div
                            key={game.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => setSelectedGame(game)}
                            className="
                              group cursor-pointer
                              bg-[var(--vscode-sidebar)] border border-[var(--vscode-border)]
                              rounded-lg p-5
                              hover:border-[var(--vscode-accent)] hover:shadow-lg
                              hover:shadow-[var(--vscode-accent)]/20
                              hover:-translate-y-2
                              transition-all duration-300
                            "
                          >
                            {/* Game Icon */}
                            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                              {game.icon}
                            </div>

                            {/* Game Info */}
                            <h3 className="text-lg font-bold text-[var(--vscode-text)] mb-1">
                              {game.name}
                            </h3>
                            <p className="text-sm text-[var(--vscode-comment)] mb-3">
                              {game.description}
                            </p>

                            {/* Difficulty & Category */}
                            <div className="flex items-center justify-between mb-4">
                              {renderStars(game.difficulty)}
                              <span className="text-xs px-2 py-1 rounded bg-[var(--vscode-line-highlight)] text-[var(--vscode-text-muted)] capitalize">
                                {game.category}
                              </span>
                            </div>

                            {/* High Score */}
                            {stats.highScores[game.id] && (
                              <div className="text-xs text-[var(--vscode-comment)] mb-3">
                                🏆 High Score: {stats.highScores[game.id]}
                              </div>
                            )}

                            {/* Play Button */}
                            <button className="
                              w-full py-2 rounded-md
                              bg-[var(--vscode-accent)]/20 text-[var(--vscode-accent)]
                              group-hover:bg-[var(--vscode-accent)] group-hover:text-white
                              transition-colors duration-200
                              font-medium text-sm
                            ">
                              Play →
                            </button>
                          </motion.div>
                        ))}
                      </div>

                      {/* Bottom Stats Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-lg bg-[var(--vscode-sidebar)] border border-[var(--vscode-border)]">
                        <div className="flex items-center gap-6">
                          {stats.favoriteGame && (
                            <div className="flex items-center gap-2">
                              <Star size={18} className="text-yellow-400" />
                              <span className="text-sm text-[var(--vscode-text-muted)]">
                                Favorite: <span className="text-[var(--vscode-text)] font-bold capitalize">{stats.favoriteGame}</span>
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Award size={18} className="text-purple-400" />
                            <span className="text-sm text-[var(--vscode-text-muted)]">
                              Achievements: <span className="text-[var(--vscode-text)] font-bold">{stats.achievements.length}/{allAchievements.length}</span>
                            </span>
                          </div>
                        </div>
                        {stats.streak > 0 && (
                          <div className="flex items-center gap-2">
                            <Flame size={18} className="text-orange-400" />
                            <span className="text-sm text-[var(--vscode-text)]">
                              {stats.streak} day streak!
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Modal */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
            onClick={() => setShowStats(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-[var(--vscode-editor)] border border-[var(--vscode-border)] rounded-lg shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-[var(--vscode-border)]">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Trophy className="text-yellow-400" /> Your Gaming Stats
                </h3>
                <button onClick={() => setShowStats(false)} className="p-1 hover:bg-[var(--vscode-line-highlight)] rounded" aria-label="Close stats">
                  <X size={20} />
                </button>
              </div>
              <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-3 rounded-lg bg-[var(--vscode-sidebar)]">
                    <div className="text-2xl font-bold text-yellow-400">{stats.achievements.length}</div>
                    <div className="text-sm text-[var(--vscode-comment)]">Achievements</div>
                  </div>
                </div>

                <div className="border-t border-[var(--vscode-border)] pt-4">
                  <h4 className="font-bold mb-3 flex items-center gap-2">
                    <TrendingUp size={18} /> High Scores
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(stats.highScores).length > 0 ? (
                      Object.entries(stats.highScores).map(([game, score]) => (
                        <div key={game} className="flex justify-between items-center p-2 rounded bg-[var(--vscode-sidebar)]">
                          <span className="capitalize">{game}</span>
                          <span className="font-mono font-bold text-[var(--vscode-accent)]">{score}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-[var(--vscode-comment)] text-sm">No high scores yet. Start playing!</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievements Modal */}
      <AnimatePresence>
        {showAchievements && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
            onClick={() => setShowAchievements(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-[var(--vscode-editor)] border border-[var(--vscode-border)] rounded-lg shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-[var(--vscode-border)]">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Award className="text-purple-400" /> Achievements ({stats.achievements.length}/{allAchievements.length})
                </h3>
                <button onClick={() => setShowAchievements(false)} className="p-1 hover:bg-[var(--vscode-line-highlight)] rounded" aria-label="Close achievements">
                  <X size={20} />
                </button>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
                {allAchievements.map(achievement => {
                  const isUnlocked = stats.achievements.includes(achievement.id);
                  return (
                    <div 
                      key={achievement.id}
                      className={`
                        p-3 rounded-lg border transition-all
                        ${isUnlocked 
                          ? 'bg-[var(--vscode-sidebar)] border-[var(--vscode-accent)]' 
                          : 'bg-[var(--vscode-sidebar)]/50 border-[var(--vscode-border)] opacity-60'
                        }
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`text-2xl ${!isUnlocked && 'grayscale opacity-50'}`}>
                          {achievement.icon}
                        </span>
                        <div className="flex-1">
                          <div className="font-bold text-sm">{achievement.title}</div>
                          <div className="text-xs text-[var(--vscode-comment)]">{achievement.description}</div>
                          <div className={`text-xs mt-1 capitalize ${getRarityColor(achievement.rarity)}`}>
                            {achievement.rarity}
                          </div>
                        </div>
                        {isUnlocked && (
                          <span className="text-green-400">✓</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[var(--vscode-editor)] border border-[var(--vscode-border)] rounded-lg shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-[var(--vscode-border)]">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Settings className="text-[var(--vscode-text-muted)]" /> Game Settings
                </h3>
                <button onClick={() => setShowSettings(false)} className="p-1 hover:bg-[var(--vscode-line-highlight)] rounded" aria-label="Close settings">
                  <X size={20} />
                </button>
              </div>
              <div className="p-4 space-y-4">
                {/* Sound Toggle */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--vscode-sidebar)]">
                  <div className="flex items-center gap-3">
                    {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                    <div>
                      <div className="font-medium">Sound Effects</div>
                      <div className="text-xs text-[var(--vscode-comment)]">Enable game sounds</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSoundEnabled(!soundEnabled);
                      setStats(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, soundEnabled: !soundEnabled }
                      }));
                    }}
                    className={`
                      w-12 h-6 rounded-full transition-colors
                      ${soundEnabled ? 'bg-[var(--vscode-accent)]' : 'bg-gray-600'}
                    `}
                    title={soundEnabled ? 'Disable sound effects' : 'Enable sound effects'}
                    aria-label={soundEnabled ? 'Disable sound effects' : 'Enable sound effects'}
                  >
                    <div className={`
                      w-5 h-5 rounded-full bg-white transition-transform
                      ${soundEnabled ? 'translate-x-6' : 'translate-x-0.5'}
                    `} />
                  </button>
                </div>

                {/* Reset Stats */}
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to reset all game stats?')) {
                      saveStats(defaultStats);
                      setShowSettings(false);
                    }
                  }}
                  className="w-full p-3 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                >
                  Reset All Stats
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement Unlock Notification */}
      <AnimatePresence>
        {newAchievement && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-[var(--vscode-editor)] border-2 border-yellow-400 rounded-lg p-4 shadow-2xl shadow-yellow-400/20 min-w-[280px]">
              <div className="text-center">
                <div className="text-yellow-400 font-bold text-sm mb-2">🎉 ACHIEVEMENT UNLOCKED! 🎉</div>
                <div className="text-4xl mb-2">{newAchievement.icon}</div>
                <div className="font-bold text-lg">{newAchievement.title}</div>
                <div className="text-sm text-[var(--vscode-comment)]">{newAchievement.description}</div>
                <div className={`text-xs mt-2 capitalize ${getRarityColor(newAchievement.rarity)}`}>
                  {newAchievement.rarity}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
