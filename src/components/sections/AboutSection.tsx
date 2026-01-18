'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function AboutSection() {
  const markdownContent = [
    { type: 'h1', content: '# About Me' },
    { type: 'blank' },
    { type: 'h2', content: '## 👨‍💻 Overview' },
    { type: 'text', content: 'B.Tech student at GLA University, Mathura (graduating April 2027)' },
    { type: 'text', content: 'Passionate about AI/ML, Full-Stack Development, and building intelligent systems.' },
    { type: 'blank' },
    { type: 'h2', content: '## 🎯 Quick Stats' },
    { type: 'list', content: '- **Location:** Mathura, India' },
    { type: 'list', content: '- **Education:** B.Tech, GLA University' },
    { type: 'list', content: '- **LeetCode:** 700+ problems solved' },
    { type: 'list', content: '- **Focus:** AI/ML • NLP • Deep Learning • Full-Stack' },
    { type: 'blank' },
    { type: 'h2', content: '## 💡 What I Do' },
    { type: 'text', content: 'I specialize in creating intelligent systems that solve real-world problems.' },
    { type: 'text', content: 'From building AI agents to developing full-stack applications, I bring' },
    { type: 'text', content: 'ideas to life with precision and purpose.' },
    { type: 'blank' },
    { type: 'comment', content: '// Curious builder passionate about AI' },
    { type: 'blank' },
    { type: 'h2', content: '## 🏆 Notable Achievement' },
    { type: 'text', content: 'National Hackathon Winner - Pan IIT Alumni Imagine 2025 (AGENTIX Project)' },
    { type: 'blank' },
    { type: 'h2', content: '## 📫 Contact' },
    { type: 'list', content: '- Email: imstorm23203@gmail.com' },
    { type: 'list', content: '- Location: Mathura, India' },
  ];

  const renderLine = (line: { type: string; content?: string }, index: number) => {
    const lineNumber = index + 1;
    
    switch (line.type) {
      case 'h1':
        return (
          <span className="text-xl md:text-2xl font-bold text-[var(--vscode-keyword)]">
            {line.content}
          </span>
        );
      case 'h2':
        return (
          <span className="text-lg md:text-xl font-semibold text-[var(--vscode-keyword)]">
            {line.content}
          </span>
        );
      case 'list':
        const parts = line.content?.split('**') || [];
        return (
          <span>
            <span className="text-[var(--vscode-accent)]">- </span>
            {parts.map((part, i) => (
              i % 2 === 1 
                ? <span key={i} className="font-semibold text-[var(--vscode-text)]">{part}</span>
                : <span key={i} className="text-[var(--vscode-text)]">{part}</span>
            ))}
          </span>
        );
      case 'comment':
        return (
          <span className="syntax-comment italic">{line.content}</span>
        );
      case 'blank':
        return <span>&nbsp;</span>;
      default:
        return (
          <span className="text-[var(--vscode-text)]">{line.content}</span>
        );
    }
  };

  return (
    <section id="about" className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="bg-[var(--vscode-bg)] border border-[var(--vscode-border)] rounded-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {/* Editor Header */}
          <div className="flex items-center gap-2 px-4 py-2 bg-[var(--vscode-sidebar)] border-b border-[var(--vscode-sidebar-border)]">
            <span className="text-lg">📝</span>
            <span className="text-xs text-[var(--vscode-text-muted)]">about.md — ArjunRajput.ai</span>
          </div>

          {/* Two Column Layout */}
          <div className="flex flex-col lg:flex-row">
            {/* Profile Image Column */}
            <div className="lg:w-1/3 p-6 flex flex-col items-center justify-start border-r border-[var(--vscode-sidebar-border)]">
              <motion.div 
                className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-[var(--vscode-accent)] overflow-hidden bg-[var(--vscode-sidebar)] relative"
                whileHover={{ scale: 1.05, borderColor: '#00d9ff' }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Image
                  src="/arjun singh rajput.jpg"
                  alt="Arjun Singh Rajput"
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>
              
              <h2 className="mt-4 text-lg md:text-xl font-bold text-[var(--vscode-text)]">
                Arjun Singh Rajput
              </h2>
              
              <p className="text-[var(--vscode-success)] text-sm mt-1">
                🟢 Available for opportunities
              </p>

              {/* Quick Links */}
              <div className="mt-6 w-full space-y-2">
                <div className="p-3 bg-[var(--vscode-sidebar)] rounded border border-[var(--vscode-border)]">
                  <span className="text-xs text-[var(--vscode-text-muted)]">// Social Links</span>
                  <div className="mt-2 space-y-1 text-sm">
                    <a href="https://www.linkedin.com/in/imstorm23203attherategmail/" target="_blank" rel="noopener noreferrer" className="block text-[var(--vscode-accent)] hover:underline">
                      → LinkedIn
                    </a>
                    <a href="https://github.com/ArjunRajputGLA" target="_blank" rel="noopener noreferrer" className="block text-[var(--vscode-accent)] hover:underline">
                      → GitHub
                    </a>
                    <a href="https://leetcode.com/u/arjun2k4/" target="_blank" rel="noopener noreferrer" className="block text-[var(--vscode-accent)] hover:underline">
                      → LeetCode
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Markdown Content Column */}
            <div className="lg:w-2/3 p-4 md:p-6 font-mono text-sm overflow-x-auto">
              {markdownContent.map((line, index) => (
                <motion.div
                  key={index}
                  className="flex hover:bg-[var(--vscode-line-highlight)] -mx-4 md:-mx-6 px-4 md:px-6 py-0.5"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  viewport={{ once: true }}
                >
                  <span className="line-number w-8 text-right pr-4 select-none text-[var(--vscode-text-muted)]">
                    {index + 1}
                  </span>
                  <span className="flex-1">
                    {renderLine(line, index)}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
