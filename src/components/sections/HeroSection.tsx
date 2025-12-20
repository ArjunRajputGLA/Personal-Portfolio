'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';

interface CodeLine {
  lineNumber: number;
  content: React.ReactNode;
  delay: number;
}

export default function HeroSection() {
  const [displayedLines, setDisplayedLines] = useState<number>(0);
  const [cursorVisible, setCursorVisible] = useState(true);

  const codeLines: CodeLine[] = [
    { lineNumber: 1, content: <span className="syntax-comment">{'// index.tsx'}</span>, delay: 0 },
    { lineNumber: 2, content: <span className="syntax-keyword">const</span>, delay: 100 },
    { 
      lineNumber: 2, 
      content: (
        <>
          <span className="syntax-keyword">const </span>
          <span className="syntax-variable">ArjunRajput</span>
          <span className="syntax-operator"> = </span>
          <span className="syntax-punctuation">{'{'}</span>
        </>
      ), 
      delay: 100 
    },
    { 
      lineNumber: 3, 
      content: (
        <>
          <span className="ml-4 syntax-property">name</span>
          <span className="syntax-operator">: </span>
          <span className="syntax-string">&quot;Arjun Singh Rajput&quot;</span>
          <span className="syntax-punctuation">,</span>
        </>
      ), 
      delay: 200 
    },
    { 
      lineNumber: 4, 
      content: (
        <>
          <span className="ml-4 syntax-property">role</span>
          <span className="syntax-operator">: </span>
          <span className="syntax-string">&quot;AI Innovator & Full-Stack Developer&quot;</span>
          <span className="syntax-punctuation">,</span>
        </>
      ), 
      delay: 300 
    },
    { 
      lineNumber: 5, 
      content: (
        <>
          <span className="ml-4 syntax-property">tagline</span>
          <span className="syntax-operator">: </span>
          <span className="syntax-string">&quot;Building intelligent, scalable systems&quot;</span>
          <span className="syntax-punctuation">,</span>
        </>
      ), 
      delay: 400 
    },
    { 
      lineNumber: 6, 
      content: (
        <>
          <span className="ml-4 syntax-property">status</span>
          <span className="syntax-operator">: </span>
          <span className="syntax-string">&quot;🟢 Available for opportunities&quot;</span>
          <span className="syntax-punctuation">,</span>
        </>
      ), 
      delay: 500 
    },
    { 
      lineNumber: 7, 
      content: (
        <>
          <span className="ml-4 syntax-property">achievements</span>
          <span className="syntax-operator">: </span>
          <span className="syntax-punctuation">[</span>
        </>
      ), 
      delay: 600 
    },
    { 
      lineNumber: 8, 
      content: (
        <>
          <span className="ml-8 syntax-string">&quot;🏆 National Hackathon Winner&quot;</span>
          <span className="syntax-punctuation">,</span>
        </>
      ), 
      delay: 700 
    },
    { 
      lineNumber: 9, 
      content: (
        <>
          <span className="ml-8 syntax-string">&quot;💻 700+ LeetCode Solved&quot;</span>
        </>
      ), 
      delay: 800 
    },
    { 
      lineNumber: 10, 
      content: (
        <>
          <span className="ml-4 syntax-punctuation">]</span>
          <span className="syntax-punctuation">,</span>
        </>
      ), 
      delay: 900 
    },
    { 
      lineNumber: 11, 
      content: <span className="syntax-punctuation">{'};'}</span>, 
      delay: 1000 
    },
    { lineNumber: 12, content: '', delay: 1100 },
    { 
      lineNumber: 13, 
      content: (
        <>
          <span className="syntax-keyword">export default </span>
          <span className="syntax-variable">ArjunRajput</span>
          <span className="syntax-punctuation">;</span>
        </>
      ), 
      delay: 1200 
    },
  ];

  useEffect(() => {
    const totalLines = codeLines.length;
    let currentLine = 0;

    const interval = setInterval(() => {
      if (currentLine < totalLines) {
        setDisplayedLines(currentLine + 1);
        currentLine++;
      } else {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

  const uniqueLines = codeLines.slice(0, displayedLines);

  return (
    <section id="home" className="min-h-[calc(100vh-52px)] flex flex-col justify-center p-4 md:p-8">
      <div className="max-w-4xl mx-auto w-full">
        {/* Code Editor Window */}
        <motion.div 
          className="bg-[var(--vscode-bg)] border border-[var(--vscode-border)] rounded-lg overflow-hidden shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Editor Header */}
          <div className="flex items-center gap-2 px-4 py-2 bg-[var(--vscode-sidebar)] border-b border-[var(--vscode-sidebar-border)]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
            </div>
            <span className="text-xs text-[var(--vscode-text-muted)] ml-2">index.tsx — ArjunRajput.ai</span>
          </div>

          {/* Code Content */}
          <div className="p-4 md:p-6 font-mono text-sm md:text-base leading-relaxed">
            {uniqueLines.map((line, index) => (
              <motion.div 
                key={index}
                className="flex hover:bg-[var(--vscode-line-highlight)] -mx-4 md:-mx-6 px-4 md:px-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: line.delay / 1000 }}
              >
                <span className="line-number w-8 md:w-12 text-right pr-4 select-none">
                  {line.lineNumber}
                </span>
                <span className="flex-1">
                  {line.content}
                  {index === uniqueLines.length - 1 && cursorVisible && (
                    <span className="inline-block w-2 h-5 bg-[var(--vscode-text)] ml-0.5 align-middle" />
                  )}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 mt-8 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <a 
            href="#projects"
            className="group flex items-center justify-center gap-2 px-6 py-3 bg-[var(--vscode-accent)] hover:bg-[var(--vscode-accent-hover)] text-white rounded font-mono text-sm transition-all"
          >
            <span className="text-[var(--vscode-success)]">$</span>
            <span>explore_projects</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>
          
          <a 
            href="/Arjun Resume.pdf"
            download="Arjun_Singh_Rajput_Resume.pdf"
            className="group flex items-center justify-center gap-2 px-6 py-3 border border-[var(--vscode-border)] hover:border-[var(--vscode-accent)] text-[var(--vscode-text)] rounded font-mono text-sm transition-all"
          >
            <span className="text-[var(--vscode-success)]">$</span>
            <span>download_resume</span>
            <Download size={16} />
          </a>
        </motion.div>

        {/* Quick Stats */}
        <motion.div 
          className="flex flex-wrap justify-center gap-6 mt-12 text-[var(--vscode-text-muted)] text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        >
          <div className="flex items-center gap-2">
            <span className="text-[var(--vscode-success)]">●</span>
            <span>Available for opportunities</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🏆</span>
            <span>National Hackathon Winner</span>
          </div>
          <div className="flex items-center gap-2">
            <span>💻</span>
            <span>700+ LeetCode Problems</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
