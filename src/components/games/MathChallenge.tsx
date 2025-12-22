'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Zap, Clock, Flame } from 'lucide-react';

interface MathChallengeProps {
  onBack: () => void;
  onScoreUpdate: (score: number) => void;
  onGameComplete: (won: boolean, score: number) => void;
  soundEnabled: boolean;
}

type Operation = '+' | '-' | '×' | '÷';

interface Problem {
  num1: number;
  num2: number;
  operation: Operation;
  answer: number;
  options: number[];
}

const MODES = {
  addition: ['+'] as Operation[],
  subtraction: ['-'] as Operation[],
  multiplication: ['×'] as Operation[],
  division: ['÷'] as Operation[],
  mixed: ['+', '-', '×', '÷'] as Operation[],
};

export default function MathChallenge({ onBack, onScoreUpdate, onGameComplete, soundEnabled }: MathChallengeProps) {
  const [mode, setMode] = useState<keyof typeof MODES>('mixed');
  const [problem, setProblem] = useState<Problem | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [round, setRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [highScore, setHighScore] = useState(0);
  const [totalRounds] = useState(20);

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem('math-highscore');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  // Generate problem
  const generateProblem = useCallback((): Problem => {
    const operations = MODES[mode];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let num1: number, num2: number, answer: number;
    
    switch (operation) {
      case '+':
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        answer = num1 + num2;
        break;
      case '-':
        num1 = Math.floor(Math.random() * 50) + 20;
        num2 = Math.floor(Math.random() * num1);
        answer = num1 - num2;
        break;
      case '×':
        num1 = Math.floor(Math.random() * 12) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
        answer = num1 * num2;
        break;
      case '÷':
        num2 = Math.floor(Math.random() * 10) + 1;
        answer = Math.floor(Math.random() * 10) + 1;
        num1 = num2 * answer;
        break;
      default:
        num1 = 1;
        num2 = 1;
        answer = 2;
    }

    // Generate wrong options
    const options = new Set<number>([answer]);
    while (options.size < 4) {
      const offset = Math.floor(Math.random() * 20) - 10;
      const wrong = answer + offset;
      if (wrong > 0 && wrong !== answer) {
        options.add(wrong);
      }
    }

    // Shuffle options
    const shuffledOptions = Array.from(options).sort(() => Math.random() - 0.5);

    return { num1, num2, operation, answer, options: shuffledOptions };
  }, [mode]);

  // Start game
  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setStreak(0);
    setRound(1);
    setTimeLeft(30);
    setProblem(generateProblem());
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  // Handle answer
  const handleAnswer = (answer: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answer);
    const correct = answer === problem?.answer;
    setIsCorrect(correct);

    if (correct) {
      // Time bonus: faster = more points
      const timeBonus = Math.floor(timeLeft * 2);
      const streakBonus = streak * 5;
      const roundScore = 10 + timeBonus + streakBonus;
      
      setScore(s => {
        const newScore = s + roundScore;
        onScoreUpdate(newScore);
        return newScore;
      });
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }

    // Next round after delay
    setTimeout(() => {
      if (round >= totalRounds) {
        // Game complete
        setIsPlaying(false);
        const finalScore = correct ? score + 10 + Math.floor(timeLeft * 2) + streak * 5 : score;
        
        if (finalScore > highScore) {
          setHighScore(finalScore);
          localStorage.setItem('math-highscore', finalScore.toString());
        }
        
        onGameComplete(true, finalScore);
      } else {
        setRound(r => r + 1);
        setTimeLeft(30);
        setProblem(generateProblem());
        setSelectedAnswer(null);
        setIsCorrect(null);
      }
    }, 1000);
  };

  // Timer
  useEffect(() => {
    if (!isPlaying || selectedAnswer !== null) return;

    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          // Time up - wrong answer
          setSelectedAnswer(-1);
          setIsCorrect(false);
          setStreak(0);
          
          setTimeout(() => {
            if (round >= totalRounds) {
              setIsPlaying(false);
              onGameComplete(true, score);
            } else {
              setRound(r => r + 1);
              setTimeLeft(30);
              setProblem(generateProblem());
              setSelectedAnswer(null);
              setIsCorrect(null);
            }
          }, 1000);
          
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, selectedAnswer, round, totalRounds, score, generateProblem, onGameComplete]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || selectedAnswer !== null || !problem) return;
      
      const key = parseInt(e.key);
      if (key >= 1 && key <= 4) {
        handleAnswer(problem.options[key - 1]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, selectedAnswer, problem]);

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
          🧮 Math Challenge
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
          <div className="text-6xl mb-4">🧮</div>
          <h3 className="text-xl font-bold mb-2">Quick Mental Math</h3>
          <p className="text-[var(--vscode-comment)] mb-6">
            Solve {totalRounds} problems as fast as you can!
          </p>

          {/* Mode Selection */}
          <div className="mb-6">
            <div className="text-sm text-[var(--vscode-comment)] mb-2">Select Mode:</div>
            <div className="flex flex-wrap gap-2 justify-center">
              {(Object.keys(MODES) as Array<keyof typeof MODES>).map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-medium transition-colors capitalize
                    ${mode === m 
                      ? 'bg-[var(--vscode-accent)] text-white' 
                      : 'bg-[var(--vscode-sidebar)] hover:bg-[var(--vscode-line-highlight)]'
                    }
                  `}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

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
            Start Challenge
          </button>
        </motion.div>
      ) : (
        // Game Screen
        <div>
          {/* Stats Bar */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            <div className="text-center p-2 rounded-lg bg-[var(--vscode-sidebar)]">
              <div className="text-xl font-bold text-[var(--vscode-accent)]">{score}</div>
              <div className="text-xs text-[var(--vscode-comment)]">Score</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-[var(--vscode-sidebar)]">
              <div className="flex items-center justify-center gap-1">
                <Flame size={16} className="text-orange-400" />
                <span className="text-xl font-bold text-orange-400">{streak}</span>
              </div>
              <div className="text-xs text-[var(--vscode-comment)]">Streak</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-[var(--vscode-sidebar)]">
              <div className={`text-xl font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-green-400'}`}>
                {timeLeft}s
              </div>
              <div className="text-xs text-[var(--vscode-comment)]">Time</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-[var(--vscode-sidebar)]">
              <div className="text-xl font-bold">{round}/{totalRounds}</div>
              <div className="text-xs text-[var(--vscode-comment)]">Round</div>
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

          {/* Problem */}
          {problem && (
            <motion.div
              key={round}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 rounded-xl bg-[var(--vscode-sidebar)] mb-6"
            >
              <div className="text-sm text-[var(--vscode-comment)] mb-2">Solve:</div>
              <div className="text-4xl font-bold text-center mb-4">
                {problem.num1} {problem.operation} {problem.num2} = ?
              </div>

              {/* Options */}
              <div className="grid grid-cols-2 gap-3">
                {problem.options.map((option, index) => (
                  <motion.button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    disabled={selectedAnswer !== null}
                    className={`
                      p-4 rounded-lg text-xl font-bold transition-all
                      ${selectedAnswer === null 
                        ? 'bg-[var(--vscode-line-highlight)] hover:bg-[var(--vscode-accent)] hover:text-white'
                        : option === problem.answer
                          ? 'bg-green-500 text-white'
                          : selectedAnswer === option
                            ? 'bg-red-500 text-white'
                            : 'bg-[var(--vscode-line-highlight)] opacity-50'
                      }
                    `}
                    whileHover={{ scale: selectedAnswer === null ? 1.05 : 1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {option}
                    <span className="text-xs opacity-60 ml-2">[{index + 1}]</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Result Feedback */}
          <AnimatePresence>
            {isCorrect !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`text-center p-3 rounded-lg ${isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
              >
                {isCorrect ? (
                  <span className="flex items-center justify-center gap-2">
                    <Zap size={20} /> Correct! +{10 + Math.floor((timeLeft + 1) * 2) + (streak - 1) * 5} points
                  </span>
                ) : (
                  <span>Wrong! The answer was {problem?.answer}</span>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Keyboard hint */}
          <div className="mt-4 text-center text-sm text-[var(--vscode-comment)]">
            ⌨️ Press 1-4 to answer quickly
          </div>
        </div>
      )}

      {/* Game Complete Modal */}
      <AnimatePresence>
        {!isPlaying && round > 0 && (
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
              <h3 className="text-2xl font-bold mb-2">Challenge Complete!</h3>
              <div className="text-[var(--vscode-comment)] mb-4">
                <p className="text-3xl font-bold text-[var(--vscode-accent)] mb-2">{score} points</p>
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
