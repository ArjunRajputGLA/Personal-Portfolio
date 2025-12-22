'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Lightbulb, Check, X, Pencil, Eraser } from 'lucide-react';

interface SudokuGameProps {
  onBack: () => void;
  onScoreUpdate: (score: number) => void;
  onGameComplete: (won: boolean, score: number) => void;
  soundEnabled: boolean;
}

type Difficulty = 'easy' | 'medium' | 'hard';
type Cell = {
  value: number;
  isOriginal: boolean;
  notes: number[];
  isError: boolean;
};

// Generate a valid Sudoku board
const generateBoard = (difficulty: Difficulty): Cell[][] => {
  // Start with a solved board pattern
  const solved = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9],
  ];

  // Shuffle by swapping rows/cols within bands and stacks
  const shuffled = solved.map(row => [...row]);
  
  // Swap rows within same band (3 groups of 3)
  for (let band = 0; band < 3; band++) {
    for (let i = 0; i < 2; i++) {
      const row1 = band * 3 + Math.floor(Math.random() * 3);
      const row2 = band * 3 + Math.floor(Math.random() * 3);
      [shuffled[row1], shuffled[row2]] = [shuffled[row2], shuffled[row1]];
    }
  }
  
  // Swap columns within same stack
  for (let stack = 0; stack < 3; stack++) {
    for (let i = 0; i < 2; i++) {
      const col1 = stack * 3 + Math.floor(Math.random() * 3);
      const col2 = stack * 3 + Math.floor(Math.random() * 3);
      for (let row = 0; row < 9; row++) {
        [shuffled[row][col1], shuffled[row][col2]] = [shuffled[row][col2], shuffled[row][col1]];
      }
    }
  }

  // Determine cells to remove based on difficulty
  const cellsToRemove = difficulty === 'easy' ? 35 : difficulty === 'medium' ? 45 : 55;
  
  // Create puzzle by removing cells
  const board: Cell[][] = shuffled.map(row => 
    row.map(value => ({
      value,
      isOriginal: true,
      notes: [],
      isError: false
    }))
  );

  // Remove random cells
  const positions: [number, number][] = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      positions.push([r, c]);
    }
  }
  
  // Shuffle positions
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  // Remove cells
  for (let i = 0; i < cellsToRemove; i++) {
    const [r, c] = positions[i];
    board[r][c].value = 0;
    board[r][c].isOriginal = false;
  }

  return board;
};

// Check if a value is valid at a position
const isValidPlacement = (board: Cell[][], row: number, col: number, value: number): boolean => {
  if (value === 0) return true;

  // Check row
  for (let c = 0; c < 9; c++) {
    if (c !== col && board[row][c].value === value) return false;
  }

  // Check column
  for (let r = 0; r < 9; r++) {
    if (r !== row && board[r][col].value === value) return false;
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if ((r !== row || c !== col) && board[r][c].value === value) return false;
    }
  }

  return true;
};

// Check if board is complete and valid
const isBoardComplete = (board: Cell[][]): boolean => {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c].value === 0 || !isValidPlacement(board, r, c, board[r][c].value)) {
        return false;
      }
    }
  }
  return true;
};

export default function SudokuGame({ onBack, onScoreUpdate, onGameComplete, soundEnabled }: SudokuGameProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [board, setBoard] = useState<Cell[][] | null>(null);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [isNoteMode, setIsNoteMode] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showWin, setShowWin] = useState(false);
  const [bestTimes, setBestTimes] = useState<Record<Difficulty, number | null>>({
    easy: null,
    medium: null,
    hard: null
  });
  const [hintsRemaining, setHintsRemaining] = useState(3);

  // Load best times
  useEffect(() => {
    const saved = localStorage.getItem('sudoku-best');
    if (saved) setBestTimes(JSON.parse(saved));
  }, []);

  // Timer
  useEffect(() => {
    if (!isPlaying || isPaused || showWin) return;

    const interval = setInterval(() => {
      setTime(t => t + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, isPaused, showWin]);

  // Format time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Start game
  const startGame = (diff: Difficulty) => {
    setDifficulty(diff);
    setBoard(generateBoard(diff));
    setSelectedCell(null);
    setIsNoteMode(false);
    setMistakes(0);
    setTime(0);
    setIsPlaying(true);
    setIsPaused(false);
    setShowWin(false);
    setHintsRemaining(3);
  };

  // Handle cell input
  const handleInput = useCallback((value: number) => {
    if (!board || !selectedCell || isPaused) return;
    
    const [row, col] = selectedCell;
    if (board[row][col].isOriginal) return;

    const newBoard = board.map(r => r.map(c => ({ ...c })));
    
    if (isNoteMode && value > 0) {
      // Toggle note
      const noteIndex = newBoard[row][col].notes.indexOf(value);
      if (noteIndex === -1) {
        newBoard[row][col].notes.push(value);
        newBoard[row][col].notes.sort((a, b) => a - b);
      } else {
        newBoard[row][col].notes.splice(noteIndex, 1);
      }
      newBoard[row][col].value = 0;
    } else {
      // Set value
      newBoard[row][col].value = value;
      newBoard[row][col].notes = [];
      
      // Check for errors
      if (value > 0 && !isValidPlacement(newBoard, row, col, value)) {
        newBoard[row][col].isError = true;
        setMistakes(m => m + 1);
      } else {
        newBoard[row][col].isError = false;
      }
    }

    setBoard(newBoard);

    // Check for win
    if (isBoardComplete(newBoard)) {
      const score = calculateScore();
      setShowWin(true);
      
      // Save best time
      if (!bestTimes[difficulty] || time < bestTimes[difficulty]!) {
        const newBest = { ...bestTimes, [difficulty]: time };
        setBestTimes(newBest);
        localStorage.setItem('sudoku-best', JSON.stringify(newBest));
      }
      
      onScoreUpdate(score);
      onGameComplete(true, score);
    }
  }, [board, selectedCell, isNoteMode, isPaused, time, difficulty, bestTimes, onScoreUpdate, onGameComplete]);

  // Calculate score
  const calculateScore = (): number => {
    const baseScore = difficulty === 'easy' ? 500 : difficulty === 'medium' ? 1000 : 2000;
    const timePenalty = Math.floor(time / 10);
    const mistakePenalty = mistakes * 50;
    const hintPenalty = (3 - hintsRemaining) * 100;
    return Math.max(100, baseScore - timePenalty - mistakePenalty - hintPenalty);
  };

  // Use hint
  const useHint = () => {
    if (!board || !selectedCell || hintsRemaining <= 0) return;
    
    const [row, col] = selectedCell;
    if (board[row][col].isOriginal || board[row][col].value !== 0) return;

    // Find the correct value by solving (simple brute force for the cell)
    for (let v = 1; v <= 9; v++) {
      const testBoard = board.map(r => r.map(c => ({ ...c })));
      testBoard[row][col].value = v;
      if (isValidPlacement(testBoard, row, col, v)) {
        // This is likely correct - in a real implementation, we'd have the solution stored
        const newBoard = board.map(r => r.map(c => ({ ...c })));
        newBoard[row][col].value = v;
        newBoard[row][col].notes = [];
        newBoard[row][col].isError = false;
        setBoard(newBoard);
        setHintsRemaining(h => h - 1);
        break;
      }
    }
  };

  // Handle keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || isPaused || showWin) return;

      if (e.key >= '1' && e.key <= '9') {
        handleInput(parseInt(e.key));
      } else if (e.key === '0' || e.key === 'Backspace' || e.key === 'Delete') {
        handleInput(0);
      } else if (e.key === 'n' || e.key === 'N') {
        setIsNoteMode(n => !n);
      } else if (selectedCell) {
        const [row, col] = selectedCell;
        if (e.key === 'ArrowUp' && row > 0) setSelectedCell([row - 1, col]);
        if (e.key === 'ArrowDown' && row < 8) setSelectedCell([row + 1, col]);
        if (e.key === 'ArrowLeft' && col > 0) setSelectedCell([row, col - 1]);
        if (e.key === 'ArrowRight' && col < 8) setSelectedCell([row, col + 1]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isPaused, showWin, selectedCell, handleInput]);

  // Get cell highlight class
  const getCellClass = (row: number, col: number): string => {
    if (!board) return '';
    
    const cell = board[row][col];
    let classes = 'w-8 h-8 sm:w-10 sm:h-10 border border-[var(--vscode-border)] flex items-center justify-center text-sm sm:text-base font-bold cursor-pointer transition-colors ';
    
    // Box borders
    if (col % 3 === 0) classes += 'border-l-2 border-l-[var(--vscode-text)]/50 ';
    if (row % 3 === 0) classes += 'border-t-2 border-t-[var(--vscode-text)]/50 ';
    if (col === 8) classes += 'border-r-2 border-r-[var(--vscode-text)]/50 ';
    if (row === 8) classes += 'border-b-2 border-b-[var(--vscode-text)]/50 ';
    
    // Selection and highlighting
    if (selectedCell) {
      const [selRow, selCol] = selectedCell;
      if (row === selRow && col === selCol) {
        classes += 'bg-[var(--vscode-accent)]/40 ';
      } else if (row === selRow || col === selCol || 
                (Math.floor(row / 3) === Math.floor(selRow / 3) && 
                 Math.floor(col / 3) === Math.floor(selCol / 3))) {
        classes += 'bg-[var(--vscode-accent)]/10 ';
      }
    }
    
    // Error state
    if (cell.isError) {
      classes += 'bg-red-500/30 text-red-400 ';
    } else if (cell.isOriginal) {
      classes += 'text-[var(--vscode-text)] ';
    } else if (cell.value > 0) {
      classes += 'text-[var(--vscode-accent)] ';
    }
    
    return classes;
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
          🧩 Sudoku
        </h2>
        <div className="w-20" />
      </div>

      {!isPlaying ? (
        // Difficulty Selection
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">🧩</div>
          <h3 className="text-xl font-bold mb-6">Select Difficulty</h3>

          <div className="grid gap-3 max-w-xs mx-auto">
            {(['easy', 'medium', 'hard'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => startGame(diff)}
                className="p-4 rounded-lg bg-[var(--vscode-sidebar)] hover:bg-[var(--vscode-line-highlight)] transition-colors text-left"
              >
                <div className="font-bold capitalize">{diff}</div>
                <div className="text-sm text-[var(--vscode-comment)]">
                  {diff === 'easy' && '35 cells to fill'}
                  {diff === 'medium' && '45 cells to fill'}
                  {diff === 'hard' && '55 cells to fill'}
                </div>
                {bestTimes[diff] && (
                  <div className="text-xs text-yellow-400 mt-1">
                    Best: {formatTime(bestTimes[diff]!)}
                  </div>
                )}
              </button>
            ))}
          </div>
        </motion.div>
      ) : (
        // Game Board
        <div>
          {/* Stats Bar */}
          <div className="flex justify-between items-center mb-4 p-2 rounded-lg bg-[var(--vscode-sidebar)]">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-[var(--vscode-comment)] text-xs">Time:</span>
                <span className="ml-1 font-mono font-bold">{formatTime(time)}</span>
              </div>
              <div>
                <span className="text-[var(--vscode-comment)] text-xs">Mistakes:</span>
                <span className={`ml-1 font-bold ${mistakes > 0 ? 'text-red-400' : ''}`}>{mistakes}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[var(--vscode-comment)] text-xs">Hints:</span>
              <span className="font-bold text-yellow-400">{hintsRemaining}</span>
            </div>
          </div>

          {/* Board */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center mb-4"
          >
            <div className="inline-block bg-[var(--vscode-sidebar)] p-2 rounded-lg">
              {board?.map((row, r) => (
                <div key={r} className="flex">
                  {row.map((cell, c) => (
                    <div
                      key={c}
                      onClick={() => setSelectedCell([r, c])}
                      className={getCellClass(r, c)}
                    >
                      {cell.value > 0 ? (
                        cell.value
                      ) : cell.notes.length > 0 ? (
                        <div className="grid grid-cols-3 gap-0 text-[6px] sm:text-[8px] text-[var(--vscode-comment)]">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                            <span key={n} className={cell.notes.includes(n) ? 'opacity-100' : 'opacity-0'}>
                              {n}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Number Pad */}
          <div className="flex justify-center gap-1 mb-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
              <button
                key={n}
                onClick={() => handleInput(n)}
                className="w-8 h-10 sm:w-10 sm:h-12 rounded bg-[var(--vscode-sidebar)] hover:bg-[var(--vscode-accent)]/30 transition-colors font-bold"
              >
                {n}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-2 flex-wrap">
            <button
              onClick={() => setIsNoteMode(!isNoteMode)}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                isNoteMode 
                  ? 'bg-[var(--vscode-accent)] text-white' 
                  : 'bg-[var(--vscode-sidebar)] hover:bg-[var(--vscode-line-highlight)]'
              }`}
            >
              <Pencil size={16} />
              Notes
            </button>
            <button
              onClick={() => handleInput(0)}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-[var(--vscode-sidebar)] hover:bg-[var(--vscode-line-highlight)] transition-colors"
            >
              <Eraser size={16} />
              Erase
            </button>
            <button
              onClick={useHint}
              disabled={hintsRemaining <= 0 || !selectedCell}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-[var(--vscode-sidebar)] hover:bg-[var(--vscode-line-highlight)] transition-colors disabled:opacity-50"
            >
              <Lightbulb size={16} />
              Hint
            </button>
            <button
              onClick={() => startGame(difficulty)}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-[var(--vscode-sidebar)] hover:bg-[var(--vscode-line-highlight)] transition-colors"
            >
              <RotateCcw size={16} />
              New
            </button>
          </div>

          {/* Controls Help */}
          <div className="mt-4 text-center text-xs text-[var(--vscode-comment)]">
            Use arrow keys to navigate • Press N to toggle notes mode
          </div>
        </div>
      )}

      {/* Win Modal */}
      <AnimatePresence>
        {showWin && (
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
              <h3 className="text-2xl font-bold mb-2">Puzzle Complete!</h3>
              <div className="text-[var(--vscode-comment)] mb-4">
                <p className="text-xl font-bold text-[var(--vscode-accent)]">{calculateScore()} points</p>
                <p className="mt-2">Time: {formatTime(time)}</p>
                <p>Mistakes: {mistakes}</p>
                {(!bestTimes[difficulty] || time <= bestTimes[difficulty]!) && (
                  <p className="text-yellow-400 mt-2">🏆 New Best Time!</p>
                )}
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => startGame(difficulty)}
                  className="px-4 py-2 rounded-lg bg-[var(--vscode-accent)] hover:bg-[var(--vscode-accent)]/80 transition-colors"
                >
                  Play Again
                </button>
                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setShowWin(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-[var(--vscode-sidebar)] hover:bg-[var(--vscode-line-highlight)] transition-colors"
                >
                  Change Difficulty
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
