'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface SimonSaysProps {
  onBack: () => void;
  onScoreUpdate: (score: number) => void;
  onGameComplete: (won: boolean, score: number) => void;
  soundEnabled: boolean;
}

const COLORS = [
  { id: 'green', color: 'bg-green-500', activeColor: 'bg-green-300', label: '🟢' },
  { id: 'red', color: 'bg-red-500', activeColor: 'bg-red-300', label: '🔴' },
  { id: 'yellow', color: 'bg-yellow-500', activeColor: 'bg-yellow-300', label: '🟡' },
  { id: 'blue', color: 'bg-blue-500', activeColor: 'bg-blue-300', label: '🔵' },
];

export default function SimonSays({ onBack, onScoreUpdate, onGameComplete, soundEnabled }: SimonSaysProps) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const [round, setRound] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('simon-highscore');
      return saved ? parseInt(saved) : 0;
    }
    return 0;
  });
  const [gameOver, setGameOver] = useState(false);
  const [status, setStatus] = useState<'idle' | 'watch' | 'play' | 'correct' | 'wrong'>('idle');
  const [localSoundEnabled, setLocalSoundEnabled] = useState(soundEnabled);

  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize audio context
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  // Play tone
  const playTone = useCallback((index: number) => {
    if (!localSoundEnabled || !audioContextRef.current) return;
    
    const frequencies = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.value = frequencies[index];
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.3);
  }, [localSoundEnabled]);

  // Flash button
  const flashButton = useCallback((index: number, duration: number = 300) => {
    setActiveButton(index);
    playTone(index);
    setTimeout(() => setActiveButton(null), duration);
  }, [playTone]);

  // Show sequence
  const showSequence = useCallback(async (seq: number[]) => {
    setIsShowingSequence(true);
    setStatus('watch');
    
    // Wait before starting
    await new Promise(r => setTimeout(r, 500));
    
    for (let i = 0; i < seq.length; i++) {
      await new Promise(r => setTimeout(r, 400));
      flashButton(seq[i], 300);
      await new Promise(r => setTimeout(r, 300));
    }
    
    await new Promise(r => setTimeout(r, 300));
    setIsShowingSequence(false);
    setStatus('play');
  }, [flashButton]);

  // Start new game
  const startGame = useCallback(() => {
    const firstColor = Math.floor(Math.random() * 4);
    setSequence([firstColor]);
    setPlayerSequence([]);
    setRound(1);
    setGameOver(false);
    setIsPlaying(true);
    setStatus('watch');
    
    setTimeout(() => {
      showSequence([firstColor]);
    }, 500);
  }, [showSequence]);

  // Add to sequence
  const addToSequence = useCallback(() => {
    const newColor = Math.floor(Math.random() * 4);
    const newSequence = [...sequence, newColor];
    setSequence(newSequence);
    setPlayerSequence([]);
    setRound(r => r + 1);
    
    setTimeout(() => {
      showSequence(newSequence);
    }, 1000);
  }, [sequence, showSequence]);

  // Handle player input
  const handleButtonClick = (index: number) => {
    if (isShowingSequence || !isPlaying || gameOver) return;
    
    flashButton(index, 200);
    
    const newPlayerSequence = [...playerSequence, index];
    setPlayerSequence(newPlayerSequence);
    
    const currentIndex = newPlayerSequence.length - 1;
    
    // Check if correct
    if (newPlayerSequence[currentIndex] !== sequence[currentIndex]) {
      // Wrong!
      setStatus('wrong');
      setGameOver(true);
      setIsPlaying(false);
      
      // Update high score
      if (round > highScore) {
        setHighScore(round);
        localStorage.setItem('simon-highscore', round.toString());
      }
      
      onScoreUpdate(round * 10);
      onGameComplete(false, round * 10);
      return;
    }
    
    // Check if completed sequence
    if (newPlayerSequence.length === sequence.length) {
      setStatus('correct');
      onScoreUpdate(round * 10);
      
      // Add next color after delay
      setTimeout(addToSequence, 1000);
    }
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
          🎵 Simon Says
        </h2>
        <button
          onClick={() => setLocalSoundEnabled(!localSoundEnabled)}
          className="p-2 rounded-lg bg-[var(--vscode-sidebar)] hover:bg-[var(--vscode-line-highlight)] transition-colors"
        >
          {localSoundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="text-center p-3 rounded-lg bg-[var(--vscode-sidebar)]">
          <div className="text-2xl font-bold text-[var(--vscode-accent)]">{round}</div>
          <div className="text-xs text-[var(--vscode-comment)]">Round</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-[var(--vscode-sidebar)]">
          <div className="text-2xl font-bold text-yellow-400">{highScore}</div>
          <div className="text-xs text-[var(--vscode-comment)]">Best</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-[var(--vscode-sidebar)]">
          <div className={`text-lg font-bold capitalize ${
            status === 'watch' ? 'text-yellow-400' :
            status === 'play' ? 'text-green-400' :
            status === 'correct' ? 'text-green-400' :
            status === 'wrong' ? 'text-red-400' :
            'text-[var(--vscode-text-muted)]'
          }`}>
            {status === 'idle' ? 'Ready' :
             status === 'watch' ? 'Watch!' :
             status === 'play' ? 'Your Turn!' :
             status === 'correct' ? 'Correct!' :
             'Game Over!'}
          </div>
          <div className="text-xs text-[var(--vscode-comment)]">Status</div>
        </div>
      </div>

      {/* Game Board */}
      <div className="relative aspect-square max-w-[300px] mx-auto mb-6">
        <div className="grid grid-cols-2 gap-3 p-4 rounded-full bg-[var(--vscode-sidebar)]">
          {COLORS.map((color, index) => (
            <motion.button
              key={color.id}
              onClick={() => handleButtonClick(index)}
              disabled={isShowingSequence || !isPlaying || gameOver}
              className={`
                aspect-square rounded-tl-full rounded-tr-full rounded-bl-full rounded-br-full
                ${index === 0 ? 'rounded-tl-[100px]' : ''}
                ${index === 1 ? 'rounded-tr-[100px]' : ''}
                ${index === 2 ? 'rounded-bl-[100px]' : ''}
                ${index === 3 ? 'rounded-br-[100px]' : ''}
                transition-all duration-100
                ${activeButton === index ? color.activeColor : color.color}
                ${activeButton === index ? 'scale-95 shadow-lg' : 'hover:brightness-110'}
                disabled:cursor-not-allowed
              `}
              whileTap={{ scale: 0.95 }}
            />
          ))}
        </div>

        {/* Center circle */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-20 h-20 rounded-full bg-[var(--vscode-editor)] border-4 border-[var(--vscode-border)] flex items-center justify-center">
            <span className="text-2xl">{gameOver ? '😢' : '🎵'}</span>
          </div>
        </div>
      </div>

      {/* Start/Restart Button */}
      {(!isPlaying || gameOver) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          {gameOver && (
            <div className="mb-4">
              <div className="text-2xl mb-2">Game Over!</div>
              <div className="text-[var(--vscode-comment)]">
                You reached round {round}
                {round > highScore - 1 && round > 1 && ' - New High Score! 🏆'}
              </div>
            </div>
          )}
          <button
            onClick={startGame}
            className="px-8 py-3 rounded-lg bg-[var(--vscode-accent)] hover:bg-[var(--vscode-accent)]/80 transition-colors text-lg font-bold"
          >
            {gameOver ? 'Play Again' : 'Start Game'}
          </button>
        </motion.div>
      )}

      {/* Instructions */}
      <div className="mt-6 text-center text-sm text-[var(--vscode-comment)]">
        💡 Watch the pattern and repeat it!
      </div>

      {/* Action Buttons */}
      {isPlaying && !gameOver && (
        <div className="flex justify-center gap-3 mt-4">
          <button
            onClick={startGame}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--vscode-sidebar)] hover:bg-[var(--vscode-line-highlight)] transition-colors"
          >
            <RotateCcw size={18} />
            Restart
          </button>
        </div>
      )}
    </div>
  );
}
