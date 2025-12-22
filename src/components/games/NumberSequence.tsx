'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Lightbulb, SkipForward, Heart } from 'lucide-react';

interface NumberSequenceProps {
  onBack: () => void;
  onScoreUpdate: (score: number) => void;
  onGameComplete: (won: boolean, score: number) => void;
  soundEnabled: boolean;
}

interface Puzzle {
  sequence: number[];
  answer: number;
  hint: string;
  pattern: string;
}

// Generate different types of sequences
const generatePuzzle = (level: number): Puzzle => {
  const patterns = [
    // Arithmetic sequences (add constant)
    () => {
      const start = Math.floor(Math.random() * 10) + 1;
      const diff = Math.floor(Math.random() * 5) + 2;
      const seq = Array(5).fill(0).map((_, i) => start + diff * i);
      return {
        sequence: seq.slice(0, -1),
        answer: seq[4],
        hint: 'Add a constant to each number',
        pattern: `+${diff} each time`
      };
    },
    // Geometric sequences (multiply)
    () => {
      const start = Math.floor(Math.random() * 3) + 2;
      const mult = Math.floor(Math.random() * 2) + 2;
      const seq = Array(5).fill(0).map((_, i) => start * Math.pow(mult, i));
      return {
        sequence: seq.slice(0, -1),
        answer: seq[4],
        hint: 'Multiply by a constant',
        pattern: `×${mult} each time`
      };
    },
    // Square numbers
    () => {
      const start = Math.floor(Math.random() * 3) + 1;
      const seq = Array(5).fill(0).map((_, i) => Math.pow(start + i, 2));
      return {
        sequence: seq.slice(0, -1),
        answer: seq[4],
        hint: 'Think about square numbers',
        pattern: `n² sequence starting at ${start}`
      };
    },
    // Fibonacci-like
    () => {
      const a = Math.floor(Math.random() * 5) + 1;
      const b = Math.floor(Math.random() * 5) + 1;
      const seq = [a, b];
      for (let i = 2; i < 6; i++) {
        seq.push(seq[i-1] + seq[i-2]);
      }
      return {
        sequence: seq.slice(0, 5),
        answer: seq[5],
        hint: 'Each number is the sum of the two before it',
        pattern: 'Fibonacci-like sequence'
      };
    },
    // Triangular numbers
    () => {
      const seq = Array(6).fill(0).map((_, i) => ((i + 1) * (i + 2)) / 2);
      return {
        sequence: seq.slice(0, 5),
        answer: seq[5],
        hint: 'Look at the differences between numbers',
        pattern: 'Triangular numbers'
      };
    },
    // Primes (harder)
    () => {
      const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
      const start = Math.floor(Math.random() * 4);
      const seq = primes.slice(start, start + 5);
      return {
        sequence: seq.slice(0, 4),
        answer: seq[4],
        hint: 'These are special numbers...',
        pattern: 'Prime numbers'
      };
    },
    // Alternating add
    () => {
      const start = Math.floor(Math.random() * 10) + 5;
      const add1 = Math.floor(Math.random() * 3) + 2;
      const add2 = Math.floor(Math.random() * 5) + 3;
      const seq = [start];
      for (let i = 1; i < 6; i++) {
        seq.push(seq[i-1] + (i % 2 === 1 ? add1 : add2));
      }
      return {
        sequence: seq.slice(0, 5),
        answer: seq[5],
        hint: 'The pattern alternates',
        pattern: `Alternating +${add1}, +${add2}`
      };
    },
  ];

  // Use harder patterns at higher levels
  const availablePatterns = level < 3 ? patterns.slice(0, 3) : 
                            level < 6 ? patterns.slice(0, 5) : 
                            patterns;
  
  const patternFn = availablePatterns[Math.floor(Math.random() * availablePatterns.length)];
  return patternFn();
};

export default function NumberSequence({ onBack, onScoreUpdate, onGameComplete, soundEnabled }: NumberSequenceProps) {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [showPattern, setShowPattern] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem('sequence-highscore');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  // Generate new puzzle
  const newPuzzle = useCallback(() => {
    setPuzzle(generatePuzzle(level));
    setUserAnswer('');
    setShowHint(false);
    setResult(null);
    setShowPattern(false);
  }, [level]);

  // Start game
  const startGame = () => {
    setIsPlaying(true);
    setLevel(1);
    setScore(0);
    setLives(3);
    setHintsUsed(0);
    newPuzzle();
  };

  // Submit answer
  const submitAnswer = () => {
    if (!puzzle || userAnswer === '') return;

    const isCorrect = parseInt(userAnswer) === puzzle.answer;
    setResult(isCorrect ? 'correct' : 'wrong');
    setShowPattern(true);

    if (isCorrect) {
      const levelBonus = level * 10;
      const hintPenalty = showHint ? 25 : 0;
      const roundScore = 50 + levelBonus - hintPenalty;
      
      setScore(s => {
        const newScore = s + roundScore;
        onScoreUpdate(newScore);
        return newScore;
      });

      // Next level after delay
      setTimeout(() => {
        setLevel(l => l + 1);
        newPuzzle();
      }, 2000);
    } else {
      setLives(l => {
        const newLives = l - 1;
        if (newLives <= 0) {
          // Game over
          setTimeout(() => {
            setIsPlaying(false);
            if (score > highScore) {
              setHighScore(score);
              localStorage.setItem('sequence-highscore', score.toString());
            }
            onGameComplete(false, score);
          }, 2000);
        } else {
          // Continue with new puzzle
          setTimeout(() => {
            newPuzzle();
          }, 2000);
        }
        return newLives;
      });
    }
  };

  // Skip puzzle (costs points)
  const skipPuzzle = () => {
    setScore(s => Math.max(0, s - 50));
    setShowPattern(true);
    setResult('wrong');
    
    setTimeout(() => {
      newPuzzle();
    }, 2000);
  };

  // Use hint
  const useHint = () => {
    if (!showHint) {
      setShowHint(true);
      setHintsUsed(h => h + 1);
    }
  };

  // Handle keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && userAnswer && !result) {
        submitAnswer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [userAnswer, result]);

  return (
    <div className="max-w-md mx-auto">
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
          🔢 Number Sequence
        </h2>
        <div className="w-20" />
      </div>

      {!isPlaying ? (
        // Start Screen
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">🔢</div>
          <h3 className="text-xl font-bold mb-2">Number Sequence</h3>
          <p className="text-[var(--vscode-comment)] mb-6">
            Find the pattern and guess the next number!
          </p>

          {highScore > 0 && (
            <div className="mb-6 p-3 rounded-lg bg-[var(--vscode-sidebar)]">
              <div className="text-yellow-400 font-bold">🏆 High Score: {highScore}</div>
            </div>
          )}

          <button
            onClick={startGame}
            className="px-8 py-3 rounded-lg bg-[var(--vscode-accent)] hover:bg-[var(--vscode-accent)]/80 transition-colors text-lg font-bold"
          >
            Start Game
          </button>
        </motion.div>
      ) : (
        // Game Screen
        <div>
          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="text-center p-2 rounded-lg bg-[var(--vscode-sidebar)]">
              <div className="text-xl font-bold">Level {level}</div>
              <div className="text-xs text-[var(--vscode-comment)]">Difficulty</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-[var(--vscode-sidebar)]">
              <div className="text-xl font-bold text-[var(--vscode-accent)]">{score}</div>
              <div className="text-xs text-[var(--vscode-comment)]">Score</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-[var(--vscode-sidebar)]">
              <div className="flex justify-center gap-1">
                {[1, 2, 3].map(i => (
                  <Heart
                    key={i}
                    size={20}
                    className={i <= lives ? 'fill-red-500 text-red-500' : 'text-gray-600'}
                  />
                ))}
              </div>
              <div className="text-xs text-[var(--vscode-comment)]">Lives</div>
            </div>
          </div>

          {/* Puzzle Display */}
          {puzzle && (
            <motion.div
              key={level}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 rounded-xl bg-[var(--vscode-sidebar)] mb-6"
            >
              <div className="text-sm text-[var(--vscode-comment)] mb-4 text-center">
                What number comes next?
              </div>

              {/* Sequence */}
              <div className="flex justify-center items-center gap-3 mb-6 flex-wrap">
                {puzzle.sequence.map((num, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="text-3xl font-bold text-[var(--vscode-text)]"
                  >
                    {num}
                  </motion.span>
                ))}
                <span className="text-3xl font-bold text-[var(--vscode-accent)]">?</span>
              </div>

              {/* Answer Input */}
              <div className="flex gap-3 justify-center mb-4">
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  disabled={!!result}
                  placeholder="Your answer"
                  className="w-32 px-4 py-2 rounded-lg bg-[var(--vscode-editor)] border border-[var(--vscode-border)] text-center text-xl font-bold focus:border-[var(--vscode-accent)] focus:outline-none"
                />
                <button
                  onClick={submitAnswer}
                  disabled={!userAnswer || !!result}
                  className="px-6 py-2 rounded-lg bg-[var(--vscode-accent)] hover:bg-[var(--vscode-accent)]/80 transition-colors font-bold disabled:opacity-50"
                >
                  Submit
                </button>
              </div>

              {/* Hint */}
              <AnimatePresence>
                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3 rounded-lg bg-yellow-500/20 border border-yellow-500/30 text-center text-sm"
                  >
                    💡 {puzzle.hint}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Result & Pattern */}
              <AnimatePresence>
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-4 p-3 rounded-lg text-center ${
                      result === 'correct' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {result === 'correct' ? (
                      <span>✓ Correct! The answer is {puzzle.answer}</span>
                    ) : (
                      <span>✗ Wrong! The answer was {puzzle.answer}</span>
                    )}
                    {showPattern && (
                      <div className="text-xs mt-1 text-[var(--vscode-comment)]">
                        Pattern: {puzzle.pattern}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-3">
            <button
              onClick={useHint}
              disabled={showHint || !!result}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--vscode-sidebar)] hover:bg-[var(--vscode-line-highlight)] transition-colors disabled:opacity-50"
            >
              <Lightbulb size={18} />
              Hint (-25 pts)
            </button>
            <button
              onClick={skipPuzzle}
              disabled={!!result}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--vscode-sidebar)] hover:bg-[var(--vscode-line-highlight)] transition-colors disabled:opacity-50"
            >
              <SkipForward size={18} />
              Skip (-50 pts)
            </button>
          </div>
        </div>
      )}

      {/* Game Over Modal */}
      <AnimatePresence>
        {!isPlaying && lives <= 0 && (
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
              <div className="text-6xl mb-4">😢</div>
              <h3 className="text-2xl font-bold mb-2">Game Over!</h3>
              <div className="text-[var(--vscode-comment)] mb-4">
                <p className="text-3xl font-bold text-[var(--vscode-accent)] mb-2">{score} points</p>
                <p>Reached Level {level}</p>
                {score >= highScore && score > 0 && (
                  <p className="text-yellow-400 mt-2">🏆 New High Score!</p>
                )}
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={startGame}
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
    </div>
  );
}
