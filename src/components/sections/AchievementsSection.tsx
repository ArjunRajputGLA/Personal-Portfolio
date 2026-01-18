'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface Achievement {
  title: string;
  details: { [key: string]: string | string[] | number };
  icon: string;
  priority: 'high' | 'medium' | 'low';
}

const achievements: Achievement[] = [
  {
    title: 'National Hackathon Winner',
    details: {
      event: 'Pan IIT Alumni Imagine 2025',
      project: 'AGENTIX',
      description: 'AI Agent Evaluation Platform'
    },
    icon: '🏆',
    priority: 'high'
  },
  {
    title: 'Competitive Programming',
    details: {
      platform: 'LeetCode',
      problems_solved: 700,
      profile_url: 'https://leetcode.com/u/arjun2k4/'
    },
    icon: '💻',
    priority: 'high'
  },
  {
    title: 'Industry Certifications',
    details: {
      certifications: [
        'Intel UNNATI Programme 2024',
        'Intel UNNATI Programme 2025',
        'NEC Corporation Certification'
      ]
    },
    icon: '📜',
    priority: 'medium'
  },
  {
    title: 'Public Speaking & Leadership',
    details: {
      activities: [
        'Anchor - Hons. Celebration Day (GLA 2024)',
        'Multiple Hackathon Participations',
        'SatHack Hackathon 2025',
        'AI Hackathon with Meta LLAMA 2024'
      ]
    },
    icon: '🎤',
    priority: 'medium'
  },
  {
    title: 'Continuous Learning',
    details: {
      workshops: [
        'GenAI Workshops',
        'NLP Training',
        'Data Science with Python',
        'Full Stack Development'
      ]
    },
    icon: '📚',
    priority: 'low'
  }
];

export default function AchievementsSection() {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set([0, 1]));
  const [animatedNumbers, setAnimatedNumbers] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    // Animate the LeetCode count
    const targetValue = 700;
    const duration = 2000;
    const steps = 60;
    const increment = targetValue / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= targetValue) {
        current = targetValue;
        clearInterval(timer);
      }
      setAnimatedNumbers(prev => ({ ...prev, leetcode: Math.floor(current) }));
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

  const toggleExpand = (index: number) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-[var(--vscode-error)]';
      case 'medium': return 'text-[var(--vscode-warning)]';
      case 'low': return 'text-[var(--vscode-success)]';
      default: return 'text-[var(--vscode-text)]';
    }
  };

  return (
    <section id="achievements" className="min-h-screen p-4 md:p-8">
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
            <span className="text-lg">🏆</span>
            <span className="text-xs text-[var(--vscode-text-muted)]">achievements.yaml — ArjunRajput.ai</span>
          </div>

          {/* YAML Content */}
          <div className="p-4 md:p-6 font-mono text-sm">
            {/* Document header */}
            <div className="syntax-comment mb-4"># Achievements & Milestones</div>
            <div className="yaml-key mb-4">achievements:</div>

            {achievements.map((achievement, index) => {
              const isExpanded = expandedItems.has(index);
              const lineNumber = index * 10 + 2;

              return (
                <motion.div
                  key={index}
                  className="ml-2 mb-4"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {/* Achievement header */}
                  <div 
                    className="flex items-center cursor-pointer hover:bg-[var(--vscode-line-highlight)] -mx-4 px-4 py-1 rounded"
                    onClick={() => toggleExpand(index)}
                  >
                    <span className="text-[var(--vscode-accent)] mr-2">-</span>
                    {isExpanded ? (
                      <ChevronDown size={14} className="text-[var(--vscode-text-muted)] mr-1" />
                    ) : (
                      <ChevronRight size={14} className="text-[var(--vscode-text-muted)] mr-1" />
                    )}
                    <span className="yaml-key">title: </span>
                    <span className="yaml-string">&quot;{achievement.title}&quot;</span>
                    <span className="ml-2 text-lg">{achievement.icon}</span>
                  </div>

                  {/* Expanded content */}
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="ml-6 overflow-hidden"
                    >
                      {/* Priority */}
                      <div className="flex py-0.5">
                        <span className="yaml-key">priority: </span>
                        <span className={getPriorityColor(achievement.priority)}>
                          &quot;{achievement.priority}&quot;
                        </span>
                      </div>

                      {/* Details */}
                      {Object.entries(achievement.details).map(([key, value]) => (
                        <div key={key} className="py-0.5">
                          {Array.isArray(value) ? (
                            <>
                              <div className="yaml-key">{key}:</div>
                              {value.map((item, i) => (
                                <div key={i} className="ml-4 flex">
                                  <span className="text-[var(--vscode-accent)]">- </span>
                                  <span className="yaml-string">&quot;{item}&quot;</span>
                                </div>
                              ))}
                            </>
                          ) : typeof value === 'number' ? (
                            <div className="flex items-center">
                              <span className="yaml-key">{key}: </span>
                              <span className="text-[var(--vscode-number)]">
                                {key === 'problems_solved' 
                                  ? `${animatedNumbers.leetcode || value}+` 
                                  : value
                                }
                              </span>
                            </div>
                          ) : (
                            <div className="flex">
                              <span className="yaml-key">{key}: </span>
                              <span className="yaml-string">&quot;{value}&quot;</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}

            {/* Document footer */}
            <div className="syntax-comment mt-6"># Last updated: December 2025</div>
          </div>
        </motion.div>

        {/* Achievement Cards */}
        <motion.div
          className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
        >
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              className={`p-6 rounded-lg border ${
                achievement.priority === 'high'
                  ? 'bg-gradient-to-br from-[var(--vscode-accent)]/20 to-transparent border-[var(--vscode-accent)]'
                  : 'bg-[var(--vscode-sidebar)] border-[var(--vscode-border)]'
              }`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-4xl mb-4">{achievement.icon}</div>
              <h3 className="text-lg font-bold mb-2">{achievement.title}</h3>
              
              {/* Quick details */}
              <div className="text-sm text-[var(--vscode-text-muted)]">
                {Object.entries(achievement.details).slice(0, 2).map(([key, value]) => (
                  <div key={key} className="mb-1">
                    {typeof value === 'number' ? (
                      <span className="text-[var(--vscode-accent)] font-bold text-2xl">
                        {key === 'problems_solved' ? `${animatedNumbers.leetcode || value}+` : value}
                      </span>
                    ) : Array.isArray(value) ? (
                      <span>{value.length} items</span>
                    ) : (
                      <span>{String(value)}</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Priority badge */}
              <div className={`inline-block mt-4 px-2 py-1 rounded text-xs ${
                achievement.priority === 'high' 
                  ? 'bg-[var(--vscode-error)]/20 text-[var(--vscode-error)]'
                  : achievement.priority === 'medium'
                    ? 'bg-[var(--vscode-warning)]/20 text-[var(--vscode-warning)]'
                    : 'bg-[var(--vscode-success)]/20 text-[var(--vscode-success)]'
              }`}>
                {achievement.priority.toUpperCase()} PRIORITY
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Counter */}
        <motion.div
          className="mt-8 text-center p-8 bg-[var(--vscode-sidebar)] rounded-lg border border-[var(--vscode-border)]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="text-6xl font-bold text-[var(--vscode-accent)] mb-2">
            {animatedNumbers.leetcode || 500}+
          </div>
          <div className="text-[var(--vscode-text-muted)]">
            LeetCode Problems Solved
          </div>
          <div className="text-[var(--vscode-comment)] text-sm mt-2">
            {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
            {'// And counting...'}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
