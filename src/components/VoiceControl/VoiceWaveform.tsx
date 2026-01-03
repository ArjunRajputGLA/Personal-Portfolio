'use client';

import { useEffect, useRef, useCallback } from 'react';

interface VoiceWaveformProps {
  isListening: boolean;
  audioLevel: number; // 0-1 representing current mic input level
  className?: string;
}

export default function VoiceWaveform({ isListening, audioLevel, className = '' }: VoiceWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const smoothedLevelRef = useRef(0);
  const barHeightsRef = useRef<number[]>([]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const barCount = 50;
    const barWidth = (width / barCount) - 2;

    // Initialize bar heights if needed
    if (barHeightsRef.current.length !== barCount) {
      barHeightsRef.current = new Array(barCount).fill(0);
    }

    // Smooth the audio level for better visual effect
    const targetLevel = isListening ? audioLevel : 0;
    smoothedLevelRef.current += (targetLevel - smoothedLevelRef.current) * 0.3;
    const currentLevel = smoothedLevelRef.current;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    if (isListening && currentLevel > 0.01) {
      // Active speaking - waveform responds to audio level
      const gradient = ctx.createLinearGradient(0, height, 0, 0);
      gradient.addColorStop(0, '#007acc');
      gradient.addColorStop(0.5, '#00a8ff');
      gradient.addColorStop(1, '#00d4ff');

      ctx.shadowColor = '#007acc';
      ctx.shadowBlur = 15 * currentLevel;

      const time = Date.now() / 100;
      
      for (let i = 0; i < barCount; i++) {
        // Create organic wave patterns that scale with audio level
        const wave1 = Math.sin(time + i * 0.2) * 0.3;
        const wave2 = Math.sin(time * 1.5 + i * 0.15) * 0.25;
        const wave3 = Math.sin(time * 0.7 + i * 0.3) * 0.2;
        const wave4 = Math.sin(time * 2.2 + i * 0.1) * 0.15;
        const combined = (wave1 + wave2 + wave3 + wave4);
        
        // Scale wave height based on audio level - more audio = bigger waves
        const levelMultiplier = 0.2 + (currentLevel * 3); // Range from 0.2 to 3.2
        const baseHeight = height * 0.1;
        const maxVariation = height * 0.7;
        
        // Target height based on audio level and wave pattern
        const targetHeight = baseHeight + (combined + 0.9) * maxVariation * levelMultiplier / 2;
        
        // Smooth individual bar heights for fluid animation
        barHeightsRef.current[i] += (targetHeight - barHeightsRef.current[i]) * 0.4;
        const barHeight = Math.max(6, Math.min(barHeightsRef.current[i], height * 0.9));
        
        const x = i * (barWidth + 2);
        const y = (height - barHeight) / 2;

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);
      }
    } else if (isListening) {
      // Listening but no audio detected - subtle waiting animation
      const time = Date.now() / 1000;
      const pulse = Math.sin(time * 2) * 0.3 + 0.7;

      const gradient = ctx.createLinearGradient(0, height, 0, 0);
      gradient.addColorStop(0, 'rgba(0, 122, 204, 0.5)');
      gradient.addColorStop(1, 'rgba(0, 212, 255, 0.5)');

      ctx.shadowColor = '#007acc';
      ctx.shadowBlur = 5;

      for (let i = 0; i < barCount; i++) {
        const wave = Math.sin(time * 3 + i * 0.15) * 3;
        const barHeight = (8 + wave) * pulse;
        
        // Decay stored heights
        barHeightsRef.current[i] *= 0.9;
        
        const x = i * (barWidth + 2);
        const y = (height - barHeight) / 2;

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);
      }
    } else {
      // Idle state - flat line with very subtle pulse
      const time = Date.now() / 1000;
      const pulse = Math.sin(time * 1.5) * 0.2 + 0.8;

      ctx.fillStyle = 'rgba(0, 122, 204, 0.25)';

      for (let i = 0; i < barCount; i++) {
        const barHeight = 4 * pulse;
        barHeightsRef.current[i] = barHeight;
        
        const x = i * (barWidth + 2);
        const y = (height - barHeight) / 2;

        ctx.fillRect(x, y, barWidth, barHeight);
      }
    }

    animationRef.current = requestAnimationFrame(draw);
  }, [isListening, audioLevel]);

  // Animation loop - runs continuously
  useEffect(() => {
    const startAnimation = () => {
      animationRef.current = requestAnimationFrame(draw);
    };

    startAnimation();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [draw]);

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className={`w-full h-[150px] ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full rounded-lg bg-[#1e1e1e]/50"
        style={{ imageRendering: 'crisp-edges' }}
      />
    </div>
  );
}
