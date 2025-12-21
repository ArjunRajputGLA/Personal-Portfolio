'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface Experience {
  id: string;
  hash: string;
  title: string;
  organization: string;
  location: string;
  date: string;
  duration: string;
  type: 'education' | 'work';
  icon: string;
  details: string[];
  email: string;
}

const experiences: Experience[] = [
  {
    id: 'current',
    hash: 'a7f3c9d',
    title: 'B.Tech Student',
    organization: 'GLA University, Mathura',
    location: 'Mathura, UP',
    date: 'Current',
    duration: 'August 2023 - April 2027',
    type: 'education',
    icon: '🎓',
    details: [
      'Specializing in Computer Science, AI/ML, Full-Stack Development',
      'Expected Graduation: April 2027',
      'Active participant in hackathons and tech events',
      'National Hackathon Winner - Pan IIT Alumni Imagine 2025'
    ],
    email: 'imstorm23203@gmail.com'
  },
  {
    id: 'iiit',
    hash: 'b2e8f1a',
    title: 'Project Intern',
    organization: 'IIIT Kottayam, Kerala',
    location: 'Remote',
    date: 'July 2025',
    duration: 'May 2025 - July 2025',
    type: 'work',
    icon: '💼',
    details: [
      'Developed malware detection model using NLP & Deep Learning',
      'Applied ML algorithms for cybersecurity applications',
      'Worked with PyTorch and advanced NLP techniques',
      'Contributed to research in AI-based security solutions'
    ],
    email: 'imstorm23203@gmail.com'
  },
  {
    id: 'acmegrade',
    hash: 'c3d9a2b',
    title: 'Project Trainee',
    organization: 'AcmeGrade, Bangalore',
    location: 'Remote',
    date: 'March 2024',
    duration: 'January 2024 - March 2024',
    type: 'work',
    icon: '💼',
    details: [
      'Completed Data Science training with real-time projects',
      'Worked on data analysis and visualization projects',
      'Received Certificate of Recommendation',
      'Gained practical experience in ML pipeline development'
    ],
    email: 'imstorm23203@gmail.com'
  },
  {
    id: 'highschool',
    hash: 'e5f2c4d',
    title: 'High School',
    organization: 'Sacred Heart Convent Hr. Sec. School, Mathura',
    location: 'Mathura, UP',
    date: 'April 2021',
    duration: '2008 - 2021',
    type: 'education',
    icon: '🎓',
    details: [
      'Completed high school education',
      'Strong foundation in mathematics and science',
      'Developed interest in programming and technology'
    ],
    email: ''
  }
];

export default function ExperienceSection() {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['current', 'iiit']));

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <section id="experience" className="min-h-screen p-4 md:p-8">
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
            <span className="text-lg">📜</span>
            <span className="text-xs text-[var(--vscode-text-muted)]">experience.log — ArjunRajput.ai</span>
          </div>

          {/* Git Log Content */}
          <div className="p-4 md:p-6 font-mono text-sm">
            <div className="mb-4 text-[var(--vscode-comment)]">
              # git log --oneline --all
            </div>

            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                className="relative pl-8 pb-8 last:pb-0"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {/* Timeline Line */}
                {index < experiences.length - 1 && (
                  <div className="absolute left-3 top-8 bottom-0 w-px bg-[var(--vscode-border)]" />
                )}

                {/* Timeline Dot */}
                <div className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                  exp.type === 'work' 
                    ? 'border-[var(--vscode-accent)] bg-[var(--vscode-accent)]/20' 
                    : 'border-[var(--vscode-success)] bg-[var(--vscode-success)]/20'
                }`}>
                  <span className="text-xs">{exp.icon}</span>
                </div>

                {/* Commit Header */}
                <div 
                  className="cursor-pointer hover:bg-[var(--vscode-line-highlight)] -mx-4 px-4 py-2 rounded"
                  onClick={() => toggleExpand(exp.id)}
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    {expandedItems.has(exp.id) ? (
                      <ChevronDown size={14} className="text-[var(--vscode-text-muted)]" />
                    ) : (
                      <ChevronRight size={14} className="text-[var(--vscode-text-muted)]" />
                    )}
                    <span className="git-commit-hash">commit {exp.hash}</span>
                    <span className="text-[var(--vscode-text-muted)]">-</span>
                    <span className="text-[var(--vscode-text)]">{exp.date}</span>
                  </div>

                  {exp.email && (
                    <div className="mt-1 text-xs">
                      <span className="text-[var(--vscode-text-muted)]">Author: </span>
                      <span className="git-author">Arjun Singh Rajput </span>
                      <span className="text-[var(--vscode-text-muted)]">&lt;{exp.email}&gt;</span>
                    </div>
                  )}

                  <div className="mt-1 text-xs text-[var(--vscode-text-muted)]">
                    Date: {exp.duration}
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedItems.has(exp.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 ml-4 pl-4 border-l-2 border-[var(--vscode-border)]">
                        <div className="mb-2">
                          <span className="text-[var(--vscode-warning)]">{exp.icon}</span>
                          <span className="ml-2 font-semibold text-[var(--vscode-text)]">{exp.title}</span>
                          <span className="text-[var(--vscode-text-muted)]"> - </span>
                          <span className="text-[var(--vscode-variable)]">{exp.organization}</span>
                        </div>

                        <div className="text-xs text-[var(--vscode-text-muted)] mb-3">
                          📍 {exp.location}
                        </div>

                        {exp.details.map((detail, i) => (
                          <div key={i} className="flex gap-2 text-sm mb-1">
                            <span className="text-[var(--vscode-text-muted)]">-</span>
                            <span className="text-[var(--vscode-text)]">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}

            {/* End of log */}
            <div className="mt-6 text-[var(--vscode-comment)]">
              # End of log — {experiences.length} commits shown
            </div>
          </div>
        </motion.div>

        {/* Summary Stats */}
        <motion.div
          className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
        >
          {[
            { label: 'Years of Learning', value: '4+' },
            { label: 'Projects Completed', value: '10+' },
            { label: 'Internships', value: '2' },
            { label: 'Hackathons Won', value: '1' }
          ].map((stat, index) => (
            <div 
              key={stat.label}
              className="bg-[var(--vscode-sidebar)] p-4 rounded-lg border border-[var(--vscode-border)] text-center"
            >
              <div className="text-2xl font-bold text-[var(--vscode-accent)]">{stat.value}</div>
              <div className="text-xs text-[var(--vscode-text-muted)] mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
