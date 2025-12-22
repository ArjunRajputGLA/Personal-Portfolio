'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Flag, Lightbulb, Clock } from 'lucide-react';

interface MinesweeperProps {
  onBack: () => void;
  onScoreUpdate: (score: number) => void;
  onGameComplete: (won: boolean, score: number) => void;
  soundEnabled: boolean;
}

interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

const DIFFICULTIES = {
  beginner: { rows: 9, cols: 9, mines: 10 },
  intermediate: { rows: 12, cols: 12, mines: 30 },
  expert: { rows: 16, cols: 16, mines: 50 },
};

export default function Minesweeper({ onBack, onScoreUpdate, onGameComplete, soundEnabled }: MinesweeperProps) {
  const [difficulty, setDifficulty] = useState<keyof typeof DIFFICULTIES>('beginner');
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [flags, setFlags] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [firstClick, setFirstClick] = useState(true);

  const { rows, cols, mines } = DIFFICULTIES[difficulty];

  // Initialize grid
  const initGrid = useCallback(() => {
    const newGrid: Cell[][] = [];
    for (let i = 0; i < rows; i++) {
      newGrid[i] = [];
      for (let j = 0; j < cols; j++) {
        newGrid[i][j] = {
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0,
        };
      }
    }
    setGrid(newGrid);
    setGameOver(false);
    setWon(false);
    setFlags(0);
    setTimer(0);
    setIsStarted(false);
    setFirstClick(true);
  }, [rows, cols]);

  // Place mines (avoiding first click)
  const placeMines = useCallback((clickRow: number, clickCol: number) => {
    const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
    let placedMines = 0;

    while (placedMines < mines) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);
      
      // Don't place on first click cell or adjacent cells
      const isNearFirstClick = Math.abs(r - clickRow) <= 1 && Math.abs(c - clickCol) <= 1;
      
      if (!newGrid[r][c].isMine && !isNearFirstClick) {
        newGrid[r][c].isMine = true;
        placedMines++;
      }
    }

    // Calculate neighbor counts
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (!newGrid[i][j].isMine) {
          let count = 0;
          for (let di = -1; di <= 1; di++) {
            for (let dj = -1; dj <= 1; dj++) {
              const ni = i + di;
              const nj = j + dj;
              if (ni >= 0 && ni < rows && nj >= 0 && nj < cols && newGrid[ni][nj].isMine) {
                count++;
              }
            }
          }
          newGrid[i][j].neighborMines = count;
        }
      }
    }

    setGrid(newGrid);
    return newGrid;
  }, [grid, rows, cols, mines]);

  // Reveal cell
  const revealCell = useCallback((row: number, col: number, currentGrid?: Cell[][]) => {
    let gridToUse = currentGrid || grid;
    
    // First click - place mines
    if (firstClick) {
      gridToUse = placeMines(row, col);
      setFirstClick(false);
      setIsStarted(true);
    }

    if (gridToUse[row][col].isRevealed || gridToUse[row][col].isFlagged) return;

    const newGrid = gridToUse.map(r => r.map(c => ({ ...c })));
    
    // If mine, game over
    if (newGrid[row][col].isMine) {
      // Reveal all mines
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          if (newGrid[i][j].isMine) {
            newGrid[i][j].isRevealed = true;
          }
        }
      }
      setGrid(newGrid);
      setGameOver(true);
      onGameComplete(false, timer);
      return;
    }

    // Flood fill for empty cells
    const reveal = (r: number, c: number) => {
      if (r < 0 || r >= rows || c < 0 || c >= cols) return;
      if (newGrid[r][c].isRevealed || newGrid[r][c].isFlagged || newGrid[r][c].isMine) return;

      newGrid[r][c].isRevealed = true;

      if (newGrid[r][c].neighborMines === 0) {
        for (let di = -1; di <= 1; di++) {
          for (let dj = -1; dj <= 1; dj++) {
            reveal(r + di, c + dj);
          }
        }
      }
    };

    reveal(row, col);
    setGrid(newGrid);

    // Check win
    let unrevealedSafe = 0;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (!newGrid[i][j].isMine && !newGrid[i][j].isRevealed) {
          unrevealedSafe++;
        }
      }
    }

    if (unrevealedSafe === 0) {
      setWon(true);
      setGameOver(true);
      const score = Math.max(1000 - timer * 2, 100);
      onScoreUpdate(score);
      onGameComplete(true, score);
    }
  }, [grid, firstClick, placeMines, rows, cols, timer, onScoreUpdate, onGameComplete]);

  // Toggle flag
  const toggleFlag = (row: number, col: number) => {
    if (gameOver || grid[row][col].isRevealed) return;

    const newGrid = grid.map(r => r.map(c => ({ ...c })));
    newGrid[row][col].isFlagged = !newGrid[row][col].isFlagged;
    setGrid(newGrid);
    setFlags(f => newGrid[row][col].isFlagged ? f + 1 : f - 1);
  };

  // Initialize on mount and difficulty change
  useEffect(() => {
    initGrid();
  }, [initGrid]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStarted && !gameOver) {
      interval = setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStarted, gameOver]);

  // Get cell color
  const getNumberColor = (num: number) => {
    const colors = ['', 'text-blue-400', 'text-green-400', 'text-red-400', 'text-purple-400', 'text-yellow-400', 'text-cyan-400', 'text-pink-400', 'text-gray-400'];
    return colors[num] || '';
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
          💣 Minesweeper
        </h2>
        <div className="w-20" />
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-2 rounded-lg bg-[var(--vscode-sidebar)]">
          <div className="text-xl font-bold text-red-400">💣 {mines - flags}</div>
          <div className="text-xs text-[var(--vscode-comment)]">Mines Left</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-[var(--vscode-sidebar)]">
          <div className="text-xl font-bold text-[var(--vscode-accent)]">🚩 {flags}</div>
          <div className="text-xs text-[var(--vscode-comment)]">Flags</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-[var(--vscode-sidebar)]">
          <div className="text-xl font-bold text-yellow-400">{formatTime(timer)}</div>
          <div className="text-xs text-[var(--vscode-comment)]">Time</div>
        </div>
      </div>

      {/* Difficulty Selector */}
      <div className="flex gap-2 mb-4 justify-center">
        {(Object.keys(DIFFICULTIES) as Array<keyof typeof DIFFICULTIES>).map(d => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            disabled={isStarted && !gameOver}
            className={`
              px-3 py-1.5 rounded text-sm font-medium transition-colors capitalize
              ${difficulty === d 
                ? 'bg-[var(--vscode-accent)] text-white' 
                : 'bg-[var(--vscode-sidebar)] hover:bg-[var(--vscode-line-highlight)]'
              }
              disabled:opacity-50
            `}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Game Grid */}
      <div className="flex justify-center">
        <div 
          className="inline-grid gap-0.5 p-2 rounded-lg bg-[var(--vscode-sidebar)]"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {grid.map((row, i) =>
            row.map((cell, j) => (
              <button
                key={`${i}-${j}`}
                onClick={() => revealCell(i, j)}
                onContextMenu={(e) => { e.preventDefault(); toggleFlag(i, j); }}
                disabled={gameOver}
                className={`
                  w-6 h-6 md:w-7 md:h-7 flex items-center justify-center text-xs md:text-sm font-bold
                  rounded transition-all
                  ${cell.isRevealed 
                    ? cell.isMine 
                      ? 'bg-red-500' 
                      : 'bg-[var(--vscode-editor)]'
                    : 'bg-[var(--vscode-line-highlight)] hover:bg-[var(--vscode-accent)]/30 cursor-pointer'
                  }
                  ${getNumberColor(cell.neighborMines)}
                `}
              >
                {cell.isRevealed ? (
                  cell.isMine ? '💣' : (cell.neighborMines > 0 ? cell.neighborMines : '')
                ) : (
                  cell.isFlagged ? '🚩' : ''
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Game Over Modal */}
      <AnimatePresence>
        {gameOver && (
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
              <div className="text-6xl mb-4">{won ? '🎉' : '💥'}</div>
              <h3 className="text-2xl font-bold mb-2">{won ? 'You Win!' : 'Game Over!'}</h3>
              <div className="text-[var(--vscode-comment)] mb-4">
                <p>Time: {formatTime(timer)}</p>
                {won && <p>Score: {Math.max(1000 - timer * 2, 100)}</p>}
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={initGrid}
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

      {/* Controls Info */}
      <div className="mt-4 text-center text-sm text-[var(--vscode-comment)]">
        🖱️ Left Click: Reveal | Right Click: Flag
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-3 mt-4">
        <button
          onClick={initGrid}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--vscode-sidebar)] hover:bg-[var(--vscode-line-highlight)] transition-colors"
        >
          <RotateCcw size={18} />
          New Game
        </button>
      </div>
    </div>
  );
}
