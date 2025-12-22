'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Pause, Play } from 'lucide-react';

interface SnakeGameProps {
  onBack: () => void;
  onScoreUpdate: (score: number) => void;
  onGameComplete: (won: boolean, score: number) => void;
  soundEnabled: boolean;
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 5;
const MIN_SPEED = 50;

export default function SnakeGame({ onBack, onScoreUpdate, onGameComplete, soundEnabled }: SnakeGameProps) {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const directionRef = useRef(direction);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  // Generate random food position
  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some(seg => seg.x === newFood.x && seg.y === newFood.y));
    return newFood;
  }, []);

  // Initialize game
  const initGame = useCallback(() => {
    const initialSnake = [{ x: 10, y: 10 }];
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setIsStarted(false);
    setSpeed(INITIAL_SPEED);
  }, [generateFood]);

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem('snake-highscore');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  // Initialize on mount
  useEffect(() => {
    initGame();
  }, [initGame]);

  // Game loop
  useEffect(() => {
    if (!isStarted || isPaused || gameOver) {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }

    gameLoopRef.current = setInterval(() => {
      setSnake(prevSnake => {
        const head = { ...prevSnake[0] };
        
        switch (directionRef.current) {
          case 'UP': head.y -= 1; break;
          case 'DOWN': head.y += 1; break;
          case 'LEFT': head.x -= 1; break;
          case 'RIGHT': head.x += 1; break;
        }

        // Check wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some(seg => seg.x === head.x && seg.y === head.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Check food collision
        if (head.x === food.x && head.y === food.y) {
          setScore(s => {
            const newScore = s + 10;
            onScoreUpdate(newScore);
            
            // Update high score
            if (newScore > highScore) {
              setHighScore(newScore);
              localStorage.setItem('snake-highscore', newScore.toString());
            }
            return newScore;
          });
          setFood(generateFood(newSnake));
          
          // Increase speed
          setSpeed(s => Math.max(s - SPEED_INCREMENT, MIN_SPEED));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, speed);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [isStarted, isPaused, gameOver, food, speed, generateFood, onScoreUpdate, highScore]);

  // Handle game over
  useEffect(() => {
    if (gameOver) {
      onGameComplete(false, score);
    }
  }, [gameOver, score, onGameComplete]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;

      // Start game on any arrow key
      if (!isStarted && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key.toLowerCase())) {
        setIsStarted(true);
      }

      // Pause toggle
      if (e.key === ' ' || e.key === 'Escape') {
        e.preventDefault();
        setIsPaused(p => !p);
        return;
      }

      if (isPaused) return;

      const currentDir = directionRef.current;
      let newDir: Direction | null = null;

      switch (e.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
          if (currentDir !== 'DOWN') newDir = 'UP';
          break;
        case 'arrowdown':
        case 's':
          if (currentDir !== 'UP') newDir = 'DOWN';
          break;
        case 'arrowleft':
        case 'a':
          if (currentDir !== 'RIGHT') newDir = 'LEFT';
          break;
        case 'arrowright':
        case 'd':
          if (currentDir !== 'LEFT') newDir = 'RIGHT';
          break;
      }

      if (newDir) {
        e.preventDefault();
        directionRef.current = newDir;
        setDirection(newDir);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isStarted, isPaused, gameOver]);

  // Touch controls
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (gameOver || isPaused) return;
      if (!isStarted) setIsStarted(true);

      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      const minSwipe = 30;
      const currentDir = directionRef.current;
      let newDir: Direction | null = null;

      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (Math.abs(diffX) > minSwipe) {
          if (diffX > 0 && currentDir !== 'LEFT') newDir = 'RIGHT';
          else if (diffX < 0 && currentDir !== 'RIGHT') newDir = 'LEFT';
        }
      } else {
        if (Math.abs(diffY) > minSwipe) {
          if (diffY > 0 && currentDir !== 'UP') newDir = 'DOWN';
          else if (diffY < 0 && currentDir !== 'DOWN') newDir = 'UP';
        }
      }

      if (newDir) {
        directionRef.current = newDir;
        setDirection(newDir);
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isStarted, isPaused, gameOver]);

  // Calculate speed level (1-5)
  const speedLevel = Math.min(5, Math.floor((INITIAL_SPEED - speed) / (SPEED_INCREMENT * 4)) + 1);

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
          🐍 Snake
        </h2>
        <div className="w-20" />
      </div>

      {/* Score Board */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="text-center p-2 rounded-lg bg-[var(--vscode-sidebar)]">
          <div className="text-xl font-bold text-[var(--vscode-accent)]">{score}</div>
          <div className="text-xs text-[var(--vscode-comment)]">Score</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-[var(--vscode-sidebar)]">
          <div className="text-xl font-bold text-yellow-400">{highScore}</div>
          <div className="text-xs text-[var(--vscode-comment)]">Best</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-[var(--vscode-sidebar)]">
          <div className="text-xl font-bold text-green-400">{snake.length}</div>
          <div className="text-xs text-[var(--vscode-comment)]">Length</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-[var(--vscode-sidebar)]">
          <div className="flex justify-center gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
              <div
                key={i}
                className={`w-2 h-4 rounded-sm ${i <= speedLevel ? 'bg-[var(--vscode-accent)]' : 'bg-[var(--vscode-border)]'}`}
              />
            ))}
          </div>
          <div className="text-xs text-[var(--vscode-comment)]">Speed</div>
        </div>
      </div>

      {/* Game Grid */}
      <div 
        className="relative aspect-square rounded-xl bg-[#1a1a1a] border-2 border-[var(--vscode-border)] overflow-hidden"
        style={{ touchAction: 'none' }}
      >
        {/* Grid lines */}
        <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)` }}>
          {Array(GRID_SIZE * GRID_SIZE).fill(null).map((_, i) => (
            <div key={i} className="border-[0.5px] border-[#2a2a2a]" />
          ))}
        </div>

        {/* Snake */}
        {snake.map((segment, index) => (
          <motion.div
            key={index}
            className={`absolute rounded-sm ${index === 0 ? 'bg-green-400' : 'bg-green-500'}`}
            style={{
              width: `${100 / GRID_SIZE}%`,
              height: `${100 / GRID_SIZE}%`,
              left: `${(segment.x / GRID_SIZE) * 100}%`,
              top: `${(segment.y / GRID_SIZE) * 100}%`,
            }}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            {index === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-[8px]">
                {direction === 'RIGHT' && '👀'}
                {direction === 'LEFT' && '👀'}
                {direction === 'UP' && '👀'}
                {direction === 'DOWN' && '👀'}
              </div>
            )}
          </motion.div>
        ))}

        {/* Food */}
        <motion.div
          className="absolute flex items-center justify-center"
          style={{
            width: `${100 / GRID_SIZE}%`,
            height: `${100 / GRID_SIZE}%`,
            left: `${(food.x / GRID_SIZE) * 100}%`,
            top: `${(food.y / GRID_SIZE) * 100}%`,
          }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 0.5 }}
        >
          🍎
        </motion.div>

        {/* Start Overlay */}
        {!isStarted && !gameOver && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
            <div className="text-4xl mb-4">🐍</div>
            <div className="text-xl font-bold mb-2">Snake Game</div>
            <div className="text-sm text-[var(--vscode-comment)] mb-4">Press any arrow key or swipe to start</div>
            <div className="text-xs text-[var(--vscode-comment)]">Use Arrow Keys / WASD to control</div>
          </div>
        )}

        {/* Pause Overlay */}
        <AnimatePresence>
          {isPaused && !gameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center"
            >
              <div className="text-xl font-bold mb-4">⏸️ Paused</div>
              <button
                onClick={() => setIsPaused(false)}
                className="px-6 py-2 rounded-lg bg-[var(--vscode-accent)] hover:bg-[var(--vscode-accent)]/80 transition-colors"
              >
                Resume
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Over Overlay */}
        <AnimatePresence>
          {gameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center"
            >
              <div className="text-4xl mb-2">💀</div>
              <div className="text-2xl font-bold mb-2">Game Over!</div>
              <div className="text-lg mb-2">Score: {score}</div>
              <div className="text-sm text-[var(--vscode-comment)] mb-4">
                Length: {snake.length} | {score === highScore && score > 0 ? '🏆 New High Score!' : `Best: ${highScore}`}
              </div>
              <button
                onClick={initGame}
                className="px-6 py-2 rounded-lg bg-[var(--vscode-accent)] hover:bg-[var(--vscode-accent)]/80 transition-colors font-medium"
              >
                Play Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls Info */}
      <div className="mt-4 text-center text-sm text-[var(--vscode-comment)]">
        ⌨️ Arrow Keys / WASD to move | Space to pause
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-3 mt-4">
        <button
          onClick={initGame}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--vscode-sidebar)] hover:bg-[var(--vscode-line-highlight)] transition-colors"
        >
          <RotateCcw size={18} />
          New Game
        </button>
        {isStarted && !gameOver && (
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--vscode-sidebar)] hover:bg-[var(--vscode-line-highlight)] transition-colors"
          >
            {isPaused ? <Play size={18} /> : <Pause size={18} />}
            {isPaused ? 'Resume' : 'Pause'}
          </button>
        )}
      </div>
    </div>
  );
}
