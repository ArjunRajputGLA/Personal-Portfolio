'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Trophy, Clock } from 'lucide-react';

interface MemoryMatchProps {
  onBack: () => void;
  onScoreUpdate: (score: number) => void;
  onGameComplete: (won: boolean, score: number) => void;
  soundEnabled: boolean;
}

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const EMOJI_SETS = {
  animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮'],
  tech: ['💻', '🖥️', '📱', '⌨️', '🖱️', '💾', '📀', '🎮', '🕹️', '📷', '🎧', '⌚'],
  food: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍒', '🍑', '🥝'],
  space: ['🚀', '🛸', '🌍', '🌙', '⭐', '☄️', '🪐', '🌌', '👨‍🚀', '🛰️', '🔭', '🌠'],
};

const DIFFICULTIES = {
  easy: { pairs: 6, grid: 'grid-cols-3 grid-rows-4' },
  medium: { pairs: 8, grid: 'grid-cols-4 grid-rows-4' },
  hard: { pairs: 12, grid: 'grid-cols-4 grid-rows-6' },
};

export default function MemoryMatch({ onBack, onScoreUpdate, onGameComplete, soundEnabled }: MemoryMatchProps) {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [theme, setTheme] = useState<keyof typeof EMOJI_SETS>('animals');
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [timer, setTimer] = useState(0);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  // Initialize game
  const initGame = useCallback(() => {
    const pairs = DIFFICULTIES[difficulty].pairs;
    const emojis = [...EMOJI_SETS[theme]].slice(0, pairs);
    const cardPairs = [...emojis, ...emojis];
    
    // Shuffle
    for (let i = cardPairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardPairs[i], cardPairs[j]] = [cardPairs[j], cardPairs[i]];
    }

    setCards(cardPairs.map((emoji, index) => ({
      id: index,
      emoji,
      isFlipped: false,
      isMatched: false,
    })));
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setGameStarted(false);
    setGameWon(false);
    setTimer(0);
  }, [difficulty, theme]);

  // Load best time
  useEffect(() => {
    const saved = localStorage.getItem(`memory-best-${difficulty}`);
    if (saved) setBestTime(parseInt(saved));
  }, [difficulty]);

  // Initialize on mount and difficulty/theme change
  useEffect(() => {
    initGame();
  }, [initGame]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && !gameWon) {
      interval = setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameWon]);

  // Handle card click
  const handleCardClick = (id: number) => {
    if (isLocked) return;
    if (flippedCards.includes(id)) return;
    if (cards[id].isMatched) return;
    if (flippedCards.length === 2) return;

    if (!gameStarted) setGameStarted(true);

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    // Update card state
    setCards(prev => prev.map((card, i) => 
      i === id ? { ...card, isFlipped: true } : card
    ));

    // Check for match
    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setIsLocked(true);

      const [first, second] = newFlipped;
      if (cards[first].emoji === cards[second].emoji) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map((card, i) => 
            i === first || i === second ? { ...card, isMatched: true } : card
          ));
          setMatches(m => {
            const newMatches = m + 1;
            const totalPairs = DIFFICULTIES[difficulty].pairs;
            
            // Check win
            if (newMatches === totalPairs) {
              setGameWon(true);
              const score = Math.max(1000 - (moves * 10) - (timer * 2), 100);
              onScoreUpdate(score);
              onGameComplete(true, score);
              
              // Save best time
              if (!bestTime || timer < bestTime) {
                setBestTime(timer);
                localStorage.setItem(`memory-best-${difficulty}`, timer.toString());
              }
            }
            return newMatches;
          });
          setFlippedCards([]);
          setIsLocked(false);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map((card, i) => 
            i === first || i === second ? { ...card, isFlipped: false } : card
          ));
          setFlippedCards([]);
          setIsLocked(false);
        }, 1000);
      }
    }
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get star rating
  const getStars = () => {
    const pairs = DIFFICULTIES[difficulty].pairs;
    const perfectMoves = pairs;
    const ratio = perfectMoves / moves;
    
    if (ratio >= 0.8) return 3;
    if (ratio >= 0.5) return 2;
    return 1;
  };

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--vscode-sidebar)] hover:bg-[var(--vscode-line-highlight)] transition-colors"
        >
          <ArrowLeft size={18} />
          Back
        </button>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          🎯 Memory Match
        </h2>
        <div className="w-20" />
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="text-center p-2 rounded-lg bg-[var(--vscode-sidebar)]">
          <div className="text-lg font-bold">{moves}</div>
          <div className="text-xs text-[var(--vscode-comment)]">Moves</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-[var(--vscode-sidebar)]">
          <div className="text-lg font-bold text-green-400">{matches}/{DIFFICULTIES[difficulty].pairs}</div>
          <div className="text-xs text-[var(--vscode-comment)]">Matches</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-[var(--vscode-sidebar)]">
          <div className="text-lg font-bold text-[var(--vscode-accent)]">{formatTime(timer)}</div>
          <div className="text-xs text-[var(--vscode-comment)]">Time</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-[var(--vscode-sidebar)]">
          <div className="text-lg font-bold text-yellow-400">{bestTime ? formatTime(bestTime) : '--:--'}</div>
          <div className="text-xs text-[var(--vscode-comment)]">Best</div>
        </div>
      </div>

      {/* Difficulty & Theme Selectors */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex gap-1">
          {(['easy', 'medium', 'hard'] as const).map(d => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              disabled={gameStarted && !gameWon}
              className={`
                px-3 py-1 rounded text-sm font-medium transition-colors
                ${difficulty === d 
                  ? 'bg-[var(--vscode-accent)] text-white' 
                  : 'bg-[var(--vscode-sidebar)] hover:bg-[var(--vscode-line-highlight)]'
                }
                disabled:opacity-50
              `}
            >
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {(Object.keys(EMOJI_SETS) as Array<keyof typeof EMOJI_SETS>).map(t => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              disabled={gameStarted && !gameWon}
              className={`
                px-3 py-1 rounded text-sm font-medium transition-colors capitalize
                ${theme === t 
                  ? 'bg-[var(--vscode-accent)] text-white' 
                  : 'bg-[var(--vscode-sidebar)] hover:bg-[var(--vscode-line-highlight)]'
                }
                disabled:opacity-50
              `}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Game Grid */}
      <div className={`grid ${DIFFICULTIES[difficulty].grid} gap-2 p-3 rounded-xl bg-[var(--vscode-sidebar)]`}>
        {cards.map((card) => (
          <motion.button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            disabled={card.isFlipped || card.isMatched || isLocked}
            className={`
              aspect-square rounded-lg text-3xl flex items-center justify-center
              transition-all duration-200
              ${card.isFlipped || card.isMatched
                ? 'bg-[var(--vscode-accent)]/20 border-2 border-[var(--vscode-accent)]'
                : 'bg-[var(--vscode-line-highlight)] border-2 border-[var(--vscode-border)] hover:border-[var(--vscode-accent)] hover:scale-105'
              }
              ${card.isMatched ? 'opacity-60' : ''}
            `}
            whileHover={{ scale: card.isFlipped || card.isMatched || isLocked ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              {card.isFlipped || card.isMatched ? (
                <motion.span
                  key="front"
                  initial={{ rotateY: 90 }}
                  animate={{ rotateY: 0 }}
                  exit={{ rotateY: 90 }}
                  transition={{ duration: 0.15 }}
                >
                  {card.emoji}
                </motion.span>
              ) : (
                <motion.span
                  key="back"
                  initial={{ rotateY: 90 }}
                  animate={{ rotateY: 0 }}
                  exit={{ rotateY: 90 }}
                  transition={{ duration: 0.15 }}
                  className="text-[var(--vscode-text-muted)]"
                >
                  ?
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      {/* Win Modal */}
      <AnimatePresence>
        {gameWon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-[var(--vscode-editor)] border border-[var(--vscode-border)] rounded-xl p-6 text-center max-w-sm w-full"
            >
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold mb-2">You Win!</h3>
              <div className="flex justify-center gap-1 mb-4">
                {[1, 2, 3].map(star => (
                  <span key={star} className={`text-3xl ${star <= getStars() ? '' : 'grayscale opacity-30'}`}>
                    ⭐
                  </span>
                ))}
              </div>
              <div className="text-[var(--vscode-comment)] mb-4">
                <p>Moves: {moves}</p>
                <p>Time: {formatTime(timer)}</p>
                <p>Score: {Math.max(1000 - (moves * 10) - (timer * 2), 100)}</p>
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={initGame}
                  className="px-4 py-2 rounded-lg bg-[var(--vscode-accent)] hover:bg-[var(--vscode-accent)]/80 transition-colors"
                >
                  Play Again
                </button>
                <button
                  onClick={onBack}
                  className="px-4 py-2 rounded-lg bg-[var(--vscode-sidebar)] hover:bg-[var(--vscode-line-highlight)] transition-colors"
                >
                  Back to Games
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="flex justify-center gap-3 mt-4">
        <button
          onClick={initGame}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--vscode-sidebar)] hover:bg-[var(--vscode-line-highlight)] transition-colors"
        >
          <RotateCcw size={18} />
          New Game
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-4 text-center text-sm text-[var(--vscode-comment)]">
        💡 Click cards to reveal. Find all matching pairs!
      </div>
    </div>
  );
}
