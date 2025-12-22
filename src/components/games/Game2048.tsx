'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Pause, Play, Trophy } from 'lucide-react';

interface Game2048Props {
  onBack: () => void;
  onScoreUpdate: (score: number) => void;
  onGameComplete: (won: boolean, score: number) => void;
  soundEnabled: boolean;
}

type Direction = 'up' | 'down' | 'left' | 'right';

const GRID_SIZE = 4;

const getTileColor = (value: number): string => {
  const colors: { [key: number]: string } = {
    0: 'bg-[#3a3a3c]',
    2: 'bg-[#eee4da] text-[#776e65]',
    4: 'bg-[#ede0c8] text-[#776e65]',
    8: 'bg-[#f2b179] text-white',
    16: 'bg-[#f59563] text-white',
    32: 'bg-[#f67c5f] text-white',
    64: 'bg-[#f65e3b] text-white',
    128: 'bg-[#edcf72] text-white',
    256: 'bg-[#edcc61] text-white',
    512: 'bg-[#edc850] text-white',
    1024: 'bg-[#edc53f] text-white',
    2048: 'bg-[#edc22e] text-white',
  };
  return colors[value] || 'bg-[#3c3a32] text-white';
};

const getFontSize = (value: number): string => {
  if (value < 100) return 'text-3xl md:text-4xl';
  if (value < 1000) return 'text-2xl md:text-3xl';
  return 'text-xl md:text-2xl';
};

export default function Game2048({ onBack, onScoreUpdate, onGameComplete, soundEnabled }: Game2048Props) {
  const [grid, setGrid] = useState<number[][]>([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Initialize grid
  const initGrid = useCallback(() => {
    const newGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
    addRandomTile(newGrid);
    addRandomTile(newGrid);
    return newGrid;
  }, []);

  // Add random tile (2 or 4)
  const addRandomTile = (currentGrid: number[][]) => {
    const emptyCells: [number, number][] = [];
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (currentGrid[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }
    if (emptyCells.length > 0) {
      const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      currentGrid[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  };

  // Check if game is over
  const checkGameOver = useCallback((currentGrid: number[][]) => {
    // Check for empty cells
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (currentGrid[i][j] === 0) return false;
      }
    }
    // Check for possible merges
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const current = currentGrid[i][j];
        if (i < GRID_SIZE - 1 && currentGrid[i + 1][j] === current) return false;
        if (j < GRID_SIZE - 1 && currentGrid[i][j + 1] === current) return false;
      }
    }
    return true;
  }, []);

  // Check for win
  const checkWin = (currentGrid: number[][]) => {
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (currentGrid[i][j] === 2048) return true;
      }
    }
    return false;
  };

  // Move tiles
  const move = useCallback((direction: Direction) => {
    if (gameOver || isPaused) return;

    let moved = false;
    let newScore = score;
    const newGrid = grid.map(row => [...row]);

    const slideLine = (line: number[]): number[] => {
      // Remove zeros
      let filtered = line.filter(x => x !== 0);
      // Merge adjacent equal tiles
      for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i] === filtered[i + 1]) {
          filtered[i] *= 2;
          newScore += filtered[i];
          filtered[i + 1] = 0;
          moved = true;
        }
      }
      // Remove zeros again after merge
      filtered = filtered.filter(x => x !== 0);
      // Pad with zeros
      while (filtered.length < GRID_SIZE) {
        filtered.push(0);
      }
      return filtered;
    };

    const rotateGrid = (g: number[][]): number[][] => {
      const rotated: number[][] = [];
      for (let j = 0; j < GRID_SIZE; j++) {
        rotated.push([]);
        for (let i = GRID_SIZE - 1; i >= 0; i--) {
          rotated[j].push(g[i][j]);
        }
      }
      return rotated;
    };

    const rotateGridBack = (g: number[][]): number[][] => {
      const rotated: number[][] = [];
      for (let i = 0; i < GRID_SIZE; i++) {
        rotated.push([]);
        for (let j = GRID_SIZE - 1; j >= 0; j--) {
          rotated[i].push(g[j][i]);
        }
      }
      return rotated;
    };

    let workingGrid = newGrid.map(row => [...row]);

    // Transform grid based on direction
    if (direction === 'up') {
      workingGrid = rotateGrid(rotateGrid(rotateGrid(workingGrid)));
    } else if (direction === 'down') {
      workingGrid = rotateGrid(workingGrid);
    } else if (direction === 'right') {
      workingGrid = workingGrid.map(row => [...row].reverse());
    }

    // Slide all rows left
    for (let i = 0; i < GRID_SIZE; i++) {
      const oldRow = [...workingGrid[i]];
      workingGrid[i] = slideLine(workingGrid[i]);
      if (oldRow.join(',') !== workingGrid[i].join(',')) {
        moved = true;
      }
    }

    // Transform back
    if (direction === 'up') {
      workingGrid = rotateGrid(workingGrid);
    } else if (direction === 'down') {
      workingGrid = rotateGrid(rotateGrid(rotateGrid(workingGrid)));
    } else if (direction === 'right') {
      workingGrid = workingGrid.map(row => [...row].reverse());
    }

    if (moved) {
      addRandomTile(workingGrid);
      setGrid(workingGrid);
      setScore(newScore);
      setMoves(m => m + 1);
      onScoreUpdate(newScore);

      // Check win/lose
      if (checkWin(workingGrid) && !won) {
        setWon(true);
        onGameComplete(true, newScore);
      }
      if (checkGameOver(workingGrid)) {
        setGameOver(true);
        onGameComplete(false, newScore);
      }

      // Update best score
      if (newScore > bestScore) {
        setBestScore(newScore);
        localStorage.setItem('2048-best', newScore.toString());
      }
    }
  }, [grid, score, bestScore, gameOver, won, isPaused, onScoreUpdate, onGameComplete, checkGameOver]);

  // Initialize game
  useEffect(() => {
    setGrid(initGrid());
    const savedBest = localStorage.getItem('2048-best');
    if (savedBest) setBestScore(parseInt(savedBest));
  }, [initGrid]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused || gameOver) return;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          move('up');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          move('down');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          move('left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          move('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move, isPaused, gameOver]);

  // Touch controls
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isPaused || gameOver) return;

      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      const minSwipe = 50;

      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (Math.abs(diffX) > minSwipe) {
          move(diffX > 0 ? 'right' : 'left');
        }
      } else {
        if (Math.abs(diffY) > minSwipe) {
          move(diffY > 0 ? 'down' : 'up');
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [move, isPaused, gameOver]);

  // Reset game
  const resetGame = () => {
    setGrid(initGrid());
    setScore(0);
    setMoves(0);
    setGameOver(false);
    setWon(false);
    setIsPaused(false);
  };

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
          🧠 2048
        </h2>
        <div className="w-20" />
      </div>

      {/* Score Board */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-3 rounded-lg bg-[var(--vscode-sidebar)]">
          <div className="text-2xl font-bold text-[var(--vscode-accent)]">{score}</div>
          <div className="text-xs text-[var(--vscode-comment)]">Score</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-[var(--vscode-sidebar)]">
          <div className="text-2xl font-bold text-yellow-400">{bestScore}</div>
          <div className="text-xs text-[var(--vscode-comment)]">Best</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-[var(--vscode-sidebar)]">
          <div className="text-2xl font-bold text-[var(--vscode-text)]">{moves}</div>
          <div className="text-xs text-[var(--vscode-comment)]">Moves</div>
        </div>
      </div>

      {/* Game Grid */}
      <div className="relative p-3 rounded-xl bg-[#bbada0]">
        <div className="grid grid-cols-4 gap-2">
          {grid.map((row, i) =>
            row.map((value, j) => (
              <motion.div
                key={`${i}-${j}`}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className={`
                  aspect-square rounded-lg flex items-center justify-center
                  font-bold ${getTileColor(value)} ${getFontSize(value)}
                  transition-colors duration-100
                `}
              >
                {value > 0 && (
                  <motion.span
                    key={value}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    {value}
                  </motion.span>
                )}
              </motion.div>
            ))
          )}
        </div>

        {/* Game Over Overlay */}
        <AnimatePresence>
          {(gameOver || won) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 rounded-xl flex flex-col items-center justify-center"
            >
              <div className="text-4xl mb-2">{won ? '🎉' : '😢'}</div>
              <div className="text-2xl font-bold mb-2">
                {won ? 'You Win!' : 'Game Over!'}
              </div>
              <div className="text-lg mb-4">Score: {score}</div>
              <button
                onClick={resetGame}
                className="px-6 py-2 rounded-lg bg-[var(--vscode-accent)] hover:bg-[var(--vscode-accent)]/80 transition-colors font-medium"
              >
                Play Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Paused Overlay */}
        <AnimatePresence>
          {isPaused && !gameOver && !won && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 rounded-xl flex flex-col items-center justify-center"
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
      </div>

      {/* Controls */}
      <div className="mt-4 text-center text-sm text-[var(--vscode-comment)]">
        ⌨️ Use Arrow Keys or WASD to move tiles
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-3 mt-4">
        <button
          onClick={resetGame}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--vscode-sidebar)] hover:bg-[var(--vscode-line-highlight)] transition-colors"
        >
          <RotateCcw size={18} />
          New Game
        </button>
        <button
          onClick={() => setIsPaused(!isPaused)}
          disabled={gameOver || won}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--vscode-sidebar)] hover:bg-[var(--vscode-line-highlight)] transition-colors disabled:opacity-50"
        >
          {isPaused ? <Play size={18} /> : <Pause size={18} />}
          {isPaused ? 'Resume' : 'Pause'}
        </button>
      </div>
    </div>
  );
}
