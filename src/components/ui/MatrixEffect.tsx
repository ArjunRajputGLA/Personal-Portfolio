'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MatrixEffectProps {
  isActive: boolean;
  onClose: () => void;
}

export default function MatrixEffect({ isActive, onClose }: MatrixEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (!isActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Matrix characters
    const chars = 'ARJUNSINGHRAJPUTAIML0123456789@#$%^&*()アイウエオカキクケコサシスセソタチツテト';
    const charArray = chars.split('');

    const fontSize = 14;
    const columns = canvas.width / fontSize;

    // Drops - one per column
    const drops: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    let frameId: number;

    const draw = () => {
      // Semi-transparent black for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0f0';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = charArray[Math.floor(Math.random() * charArray.length)];

        // Draw the character
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        // Move drop down
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      frameId = requestAnimationFrame(draw);
    };

    draw();

    // Show message after 2 seconds
    const messageTimeout = setTimeout(() => {
      setShowMessage(true);
    }, 2000);

    // Auto close after 8 seconds
    const closeTimeout = setTimeout(() => {
      onClose();
    }, 8000);

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(messageTimeout);
      clearTimeout(closeTimeout);
      window.removeEventListener('resize', handleResize);
      setShowMessage(false);
    };
  }, [isActive, onClose]);

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] cursor-pointer"
        onClick={onClose}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
        />

        {/* Message Overlay */}
        <AnimatePresence>
          {showMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="text-center">
                <motion.h1
                  className="text-4xl md:text-6xl font-bold text-green-400 mb-4 font-mono"
                  animate={{
                    textShadow: [
                      '0 0 10px #0f0, 0 0 20px #0f0, 0 0 30px #0f0',
                      '0 0 20px #0f0, 0 0 40px #0f0, 0 0 60px #0f0',
                      '0 0 10px #0f0, 0 0 20px #0f0, 0 0 30px #0f0',
                    ],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  WELCOME TO THE MATRIX
                </motion.h1>
                <motion.p
                  className="text-xl text-green-300 font-mono"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  Arjun Singh Rajput
                </motion.p>
                <motion.p
                  className="text-sm text-green-500 font-mono mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Click anywhere to exit...
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scanlines */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 2px)',
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
