'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Flame, Clock } from 'lucide-react';

interface ColorMatchProps {
  onBack: () => void;
  onScoreUpdate: (score: number) => void;
  onGameComplete: (won: boolean, score: number) => void;
  soundEnabled: boolean;
}

const COLORS = [
  { name: 'RED', color: 'text-red-500' },
  { name: 'BLUE', color: 'text-blue-500' },
  { name: 'GREEN', color: 'text-green-500' },
  { name: 'YELLOW', color: 'text-yellow-500' },
  { name: 'PURPLE', color: 'text-purple-500' },
  { name: 'ORANGE', color: 'text-orange-500' },
];

interface Round {
  word: string;
  displayColor: string;
  isMatch: boolean;
}

export default function ColorMatch({ onBack, onScoreUpdate, onGameComplete, soundEnabled }: ColorMatchProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [level, setLevel] = useState(1);
  const [currentRound, setCurrentRound] = useState<Round | null>(null);
  const [answered, setAnswered] = useState<boolean | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [highScore, setHighScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem('colormatch-highscore');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  // Generate round
  const generateRound = useCallback((): Round => {
    const wordColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    
    // Higher chance of mismatch at higher levels
    const matchChance = Math.max(0.3, 0.5 - (level * 0.05));
    const isMatch = Math.random() < matchChance;
    
    let displayColor: typeof COLORS[0];
    if (isMatch) {
      displayColor = wordColor;
    } else {
      do {
        displayColor = COLORS[Math.floor(Math.random() * COLORS.length)];
      } while (displayColor.name === wordColor.name);
    }
    
    return {
      word: wordColor.name,
      displayColor: displayColor.color,
      isMatch,
    };
  }, [level]);

  // Start game
  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setTimeLeft(30);
    setLevel(1);
    setTotalAnswered(0);
    setCorrectAnswers(0);
    setCurrentRound(generateRound());
    setAnswered(null);
    setIsCorrect(null);
  };

  // Handle answer
  const handleAnswer = (playerAnswer: boolean) => {
    if (answered !== null || !currentRound) return;
    
    setAnswered(playerAnswer);
    const correct = playerAnswer === currentRound.isMatch;
    setIsCorrect(correct);
    setTotalAnswered(t => t + 1);
    
    if (correct) {
      const comboBonus = combo * 5;
      const timeBonus = Math.floor(timeLeft / 3);
      const levelBonus = level * 2;
      const roundScore = 10 + comboBonus + timeBonus + levelBonus;
      
      setScore(s => {
        const newScore = s + roundScore;
        onScoreUpdate(newScore);
        return newScore;
      });
      setCombo(c => {
        const newCombo = c + 1;
        if (newCombo > maxCombo) setMaxCombo(newCombo);
        return newCombo;
      });
      setCorrectAnswers(c => c + 1);
      
      // Level up every 10 correct
      if ((correctAnswers + 1) % 10 === 0) {
        setLevel(l => l + 1);
      }
    } else {
      setCombo(0);
    }
    
    // Next round after short delay
    setTimeout(() => {
      setCurrentRound(generateRound());
      setAnswered(null);
      setIsCorrect(null);
    }, 500);
  };

  // Timer
  useEffect(() => {
    if (!isPlaying || answered !== null) return;
    
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setIsPlaying(false);
          
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('colormatch-highscore', score.toString());
          }
          
          onGameComplete(true, score);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isPlaying, answered, score, highScore, onGameComplete]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || answered !== null) return;
      
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        handleAnswer(true); // Yes - match
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        handleAnswer(false); // No - no match
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, answered]);

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
          🎨 Color Match
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
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="text-xl font-bold mb-2">Color Match</h3>
          <p className="text-[var(--vscode-comment)] mb-2">
            Does the word match the color it's displayed in?
          </p>
          <p className="text-sm text-[var(--vscode-comment)] mb-6">
            Answer as many as you can in 30 seconds!
          </p>

          {/* High Score */}
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
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="text-center p-2 rounded-lg bg-[var(--vscode-sidebar)]">
              <div className="text-xl font-bold text-[var(--vscode-accent)]">{score}</div>
              <div className="text-xs text-[var(--vscode-comment)]">Score</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-[var(--vscode-sidebar)]">
              <div className="flex items-center justify-center gap-1">
                <Flame size={16} className="text-orange-400" />
                <span className="text-xl font-bold text-orange-400">x{combo}</span>
              </div>
              <div className="text-xs text-[var(--vscode-comment)]">Combo</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-[var(--vscode-sidebar)]">
              <div className={`text-xl font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-green-400'}`}>
                {timeLeft}s
              </div>
              <div className="text-xs text-[var(--vscode-comment)]">Time</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-[var(--vscode-sidebar)]">
              <div className="text-xl font-bold">Lv.{level}</div>
              <div className="text-xs text-[var(--vscode-comment)]">Level</div>
            </div>
          </div>

          {/* Timer Bar */}
          <div className="h-2 bg-[var(--vscode-sidebar)] rounded-full mb-6 overflow-hidden">
            <motion.div
              className={`h-full ${timeLeft <= 10 ? 'bg-red-400' : 'bg-[var(--vscode-accent)]'}`}
              initial={{ width: '100%' }}
              animate={{ width: `${(timeLeft / 30) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Color Word Display */}
          {currentRound && (
            <motion.div
              key={totalAnswered}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 rounded-xl bg-[var(--vscode-sidebar)] mb-6 text-center"
            >
              <div className="text-sm text-[var(--vscode-comment)] mb-4">
                Does the word match its color?
              </div>
              <div className={`text-5xl font-bold ${currentRound.displayColor}`}>
                {currentRound.word}
              </div>
            </motion.div>
          )}

          {/* Answer Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <motion.button
              onClick={() => handleAnswer(true)}
              disabled={answered !== null}
              className={`
                p-4 rounded-lg text-xl font-bold transition-all
                ${answered === null 
                  ? 'bg-green-500/20 hover:bg-green-500 hover:text-white border-2 border-green-500'
                  : answered === true
                    ? isCorrect
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                    : 'bg-[var(--vscode-sidebar)] opacity-50'
                }
              `}
              whileHover={{ scale: answered === null ? 1.05 : 1 }}
              whileTap={{ scale: 0.95 }}
            >
              ✓ YES
              <span className="block text-xs opacity-60">[←] or [A]</span>
            </motion.button>
            <motion.button
              onClick={() => handleAnswer(false)}
              disabled={answered !== null}
              className={`
                p-4 rounded-lg text-xl font-bold transition-all
                ${answered === null 
                  ? 'bg-red-500/20 hover:bg-red-500 hover:text-white border-2 border-red-500'
                  : answered === false
                    ? isCorrect
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                    : 'bg-[var(--vscode-sidebar)] opacity-50'
                }
              `}
              whileHover={{ scale: answered === null ? 1.05 : 1 }}
              whileTap={{ scale: 0.95 }}
            >
              ✗ NO
              <span className="block text-xs opacity-60">[→] or [D]</span>
            </motion.button>
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {isCorrect !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`text-center p-2 rounded-lg ${isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
              >
                {isCorrect ? '✓ Correct!' : '✗ Wrong!'}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Instructions */}
          <div className="mt-4 text-center text-sm text-[var(--vscode-comment)]">
            ⚡ Answer quickly for bonus points!
          </div>
        </div>
      )}

      {/* Game Over Modal */}
      <AnimatePresence>
        {!isPlaying && totalAnswered > 0 && timeLeft === 0 && (
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
              <div className="text-6xl mb-4">⏰</div>
              <h3 className="text-2xl font-bold mb-2">Time's Up!</h3>
              <div className="text-[var(--vscode-comment)] mb-4 space-y-1">
                <p className="text-3xl font-bold text-[var(--vscode-accent)]">{score} points</p>
                <p>Accuracy: {totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0}%</p>
                <p>Max Combo: x{maxCombo}</p>
                {score >= highScore && score > 0 && (
                  <p className="text-yellow-400">🏆 New High Score!</p>
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
