'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface SkillCategory {
  key: string;
  expanded: boolean;
  data: { [key: string]: string[] | { [key: string]: string[] } };
}

export default function SkillsSection() {
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set(['languages', 'ai_ml']));

  const skillsData = {
    languages: {
      proficient: ["Python", "Java", "JavaScript", "TypeScript"],
      familiar: ["HTML", "CSS", "SQL"]
    },
    frontend: {
      frameworks: ["React.js", "Next.js"],
      styling: ["Tailwind CSS", "CSS3"],
      tools: ["Electron.js"]
    },
    backend: {
      runtime: ["Node.js"],
      databases: ["MongoDB", "SQL"],
      tools: ["Git", "REST APIs"]
    },
    ai_ml: {
      frameworks: ["PyTorch", "Scikit-Learn", "Seaborn"],
      techniques: ["NLP", "Deep Learning", "Machine Learning"],
      specialization: ["AI Agents", "Data Science", "Computer Vision"]
    },
    professional_skills: [
      "Problem-Solving (700+ LeetCode)",
      "Team Collaboration",
      "Analytical Thinking",
      "Quick Learning",
      "Effective Communication",
      "Adaptability"
    ]
  };

  const toggleExpand = (key: string) => {
    setExpandedKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const renderValue = (value: unknown, indent: number = 0): React.ReactNode[] => {
    const lines: React.ReactNode[] = [];
    const spaces = '  '.repeat(indent);

    if (Array.isArray(value)) {
      lines.push(
        <span key="open" className="json-bracket">[</span>
      );
      value.forEach((item, idx) => {
        lines.push(
          <div key={idx} className="flex">
            <span>{spaces}  </span>
            <span className="json-string">&quot;{item}&quot;</span>
            {idx < value.length - 1 && <span className="json-bracket">,</span>}
          </div>
        );
      });
      lines.push(
        <span key="close">
          <span>{spaces}</span>
          <span className="json-bracket">]</span>
        </span>
      );
    } else if (typeof value === 'object' && value !== null) {
      lines.push(
        <span key="open" className="json-bracket">{'{'}</span>
      );
      const entries = Object.entries(value as Record<string, unknown>);
      entries.forEach(([k, v], idx) => {
        if (Array.isArray(v)) {
          lines.push(
            <div key={k} className="flex flex-wrap">
              <span>{spaces}  </span>
              <span className="json-key">&quot;{k}&quot;</span>
              <span>: </span>
              <span className="json-bracket">[</span>
              {(v as string[]).map((item, i) => (
                <span key={i}>
                  <span className="json-string">&quot;{item}&quot;</span>
                  {i < v.length - 1 && <span className="json-bracket">, </span>}
                </span>
              ))}
              <span className="json-bracket">]</span>
              {idx < entries.length - 1 && <span className="json-bracket">,</span>}
            </div>
          );
        }
      });
      lines.push(
        <span key="close">
          <span>{spaces}</span>
          <span className="json-bracket">{'}'}</span>
        </span>
      );
    }

    return lines;
  };

  return (
    <section id="skills" className="min-h-screen p-4 md:p-8">
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
            <span className="text-lg">📋</span>
            <span className="text-xs text-[var(--vscode-text-muted)]">skills.json — ArjunRajput.ai</span>
          </div>

          {/* JSON Content */}
          <div className="p-4 md:p-6 font-mono text-sm overflow-x-auto">
            {/* Opening brace */}
            <div className="flex hover:bg-[var(--vscode-line-highlight)] -mx-4 md:-mx-6 px-4 md:px-6 py-0.5">
              <span className="line-number w-8 text-right pr-4 select-none">1</span>
              <span className="json-bracket">{'{'}</span>
            </div>

            {/* Skills categories */}
            {Object.entries(skillsData).map(([key, value], categoryIndex) => {
              const isExpanded = expandedKeys.has(key);
              const lineNumber = categoryIndex + 2;

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: categoryIndex * 0.1 }}
                  viewport={{ once: true }}
                >
                  {/* Category header */}
                  <div 
                    className="flex hover:bg-[var(--vscode-line-highlight)] -mx-4 md:-mx-6 px-4 md:px-6 py-0.5 cursor-pointer group"
                    onClick={() => toggleExpand(key)}
                  >
                    <span className="line-number w-8 text-right pr-4 select-none">{lineNumber}</span>
                    <span className="flex items-center">
                      {isExpanded ? (
                        <ChevronDown size={14} className="text-[var(--vscode-text-muted)] mr-1" />
                      ) : (
                        <ChevronRight size={14} className="text-[var(--vscode-text-muted)] mr-1" />
                      )}
                      <span className="ml-2 json-key">&quot;{key}&quot;</span>
                      <span>: </span>
                      {!isExpanded && (
                        <span className="text-[var(--vscode-text-muted)]">
                          {Array.isArray(value) ? `[${value.length} items]` : `{...}`}
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Expanded content */}
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      {Array.isArray(value) ? (
                        // Professional skills (simple array)
                        <>
                          <div className="flex hover:bg-[var(--vscode-line-highlight)] -mx-4 md:-mx-6 px-4 md:px-6 py-0.5">
                            <span className="line-number w-8 text-right pr-4 select-none"></span>
                            <span className="ml-8 json-bracket">[</span>
                          </div>
                          {value.map((skill, idx) => (
                            <div key={idx} className="flex hover:bg-[var(--vscode-line-highlight)] -mx-4 md:-mx-6 px-4 md:px-6 py-0.5">
                              <span className="line-number w-8 text-right pr-4 select-none"></span>
                              <span className="ml-12">
                                <span className="json-string">&quot;{skill}&quot;</span>
                                {idx < value.length - 1 && <span className="json-bracket">,</span>}
                              </span>
                            </div>
                          ))}
                          <div className="flex hover:bg-[var(--vscode-line-highlight)] -mx-4 md:-mx-6 px-4 md:px-6 py-0.5">
                            <span className="line-number w-8 text-right pr-4 select-none"></span>
                            <span className="ml-8 json-bracket">]</span>
                            {categoryIndex < Object.entries(skillsData).length - 1 && (
                              <span className="json-bracket">,</span>
                            )}
                          </div>
                        </>
                      ) : (
                        // Nested object
                        <>
                          <div className="flex hover:bg-[var(--vscode-line-highlight)] -mx-4 md:-mx-6 px-4 md:px-6 py-0.5">
                            <span className="line-number w-8 text-right pr-4 select-none"></span>
                            <span className="ml-8 json-bracket">{'{'}</span>
                          </div>
                          {Object.entries(value).map(([subKey, subValue], subIdx) => (
                            <div key={subKey} className="flex hover:bg-[var(--vscode-line-highlight)] -mx-4 md:-mx-6 px-4 md:px-6 py-0.5 flex-wrap">
                              <span className="line-number w-8 text-right pr-4 select-none"></span>
                              <span className="ml-12">
                                <span className="json-key">&quot;{subKey}&quot;</span>
                                <span>: </span>
                                <span className="json-bracket">[</span>
                                {(subValue as string[]).map((item, i) => (
                                  <span key={i}>
                                    <span className="json-string">&quot;{item}&quot;</span>
                                    {i < (subValue as string[]).length - 1 && <span className="json-bracket">, </span>}
                                  </span>
                                ))}
                                <span className="json-bracket">]</span>
                                {subIdx < Object.entries(value).length - 1 && <span className="json-bracket">,</span>}
                              </span>
                            </div>
                          ))}
                          <div className="flex hover:bg-[var(--vscode-line-highlight)] -mx-4 md:-mx-6 px-4 md:px-6 py-0.5">
                            <span className="line-number w-8 text-right pr-4 select-none"></span>
                            <span className="ml-8 json-bracket">{'}'}</span>
                            {categoryIndex < Object.entries(skillsData).length - 1 && (
                              <span className="json-bracket">,</span>
                            )}
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}

            {/* Closing brace */}
            <div className="flex hover:bg-[var(--vscode-line-highlight)] -mx-4 md:-mx-6 px-4 md:px-6 py-0.5">
              <span className="line-number w-8 text-right pr-4 select-none">{Object.keys(skillsData).length + 2}</span>
              <span className="json-bracket">{'}'}</span>
            </div>
          </div>
        </motion.div>

        {/* Skill Bars */}
        <motion.div
          className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {[
            { name: 'Python', level: 90 },
            { name: 'JavaScript/TypeScript', level: 85 },
            { name: 'React/Next.js', level: 85 },
            { name: 'AI/ML', level: 80 },
            { name: 'Node.js', level: 75 },
            { name: 'Problem Solving', level: 90 },
          ].map((skill, index) => (
            <div key={skill.name} className="bg-[var(--vscode-sidebar)] p-4 rounded border border-[var(--vscode-border)]">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">{skill.name}</span>
                <span className="text-xs text-[var(--vscode-text-muted)]">{skill.level}%</span>
              </div>
              <div className="h-2 bg-[var(--vscode-bg)] rounded overflow-hidden">
                <motion.div
                  className="h-full bg-[var(--vscode-accent)]"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  viewport={{ once: true }}
                />
              </div>
              <div className="mt-1 text-xs text-[var(--vscode-comment)]">
                // {'█'.repeat(Math.floor(skill.level / 10))}{'░'.repeat(10 - Math.floor(skill.level / 10))} {skill.level}%
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
