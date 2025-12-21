'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, FolderOpen, Folder, FileCode, ExternalLink, Github, Star, X } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  fileName: string;
  status?: string;
  category: string[];
  description: string;
  tech: string[];
  links: {
    live?: string;
    github?: string;
  };
  year: number;
  featured?: boolean;
}

const projects: Project[] = [
  {
    id: 'agentix',
    title: 'AGENTIX - AI Agent Evaluation Platform',
    fileName: 'agentix.tsx',
    status: '🏆 National Hackathon Winner',
    category: ['AI/ML', 'Full-Stack'],
    description: 'Real-time comparison platform to choose the right AI agent for your needs with live performance metrics. Won at Pan IIT Alumni Imagine 2025.',
    tech: ['AI Agents', 'React.js', 'Real-time Analytics', 'Full-Stack'],
    links: {
      live: 'https://agentix-ai.vercel.app/',
      github: 'https://github.com/ArjunRajputGLA'
    },
    year: 2025,
    featured: true
  },
  {
    id: 'no-code-backend',
    title: 'NO CODE BACKEND',
    fileName: 'no_code_backend.tsx',
    status: '🚀 Featured in SatHack Hackathon',
    category: ['AI/ML', 'Full-Stack'],
    description: 'AI-assisted visual platform that empowers users to design, validate, and export production-ready backend systems through intuitive drag-and-drop workflows.',
    tech: ['AI', 'Visual Programming', 'Backend Development'],
    links: {
      github: 'https://github.com/ArjunRajputGLA'
    },
    year: 2025,
    featured: true
  },
  {
    id: 'fluxor',
    title: 'FLUXOR - AI File Manager',
    fileName: 'fluxor_file_manager.js',
    status: '🌍 Featured in Global HR Summit',
    category: ['Desktop', 'AI'],
    description: 'Application to manage system files efficiently using AI-powered features.',
    tech: ['Electron.js', 'AI', 'File System APIs'],
    links: {
      github: 'https://github.com/ArjunRajputGLA'
    },
    year: 2024,
    featured: true
  },
  {
    id: 'smart-classroom',
    title: 'Smart AI Classroom',
    fileName: 'smart_classroom.tsx',
    status: '🎓 Intel UNNATI 2025',
    category: ['AI/ML', 'EdTech'],
    description: 'Intel UNNATI Programme 2025 project for AI-powered classroom management with computer vision.',
    tech: ['AI/ML', 'Computer Vision', 'Educational Technology'],
    links: {
      github: 'https://github.com/ArjunRajputGLA'
    },
    year: 2025
  },
  {
    id: 'canteen',
    title: 'GLA Campus Application',
    fileName: 'gla_canteen_app.tsx',
    category: ['Full-Stack'],
    description: 'Full-stack application to order, receive, and manage food items in the university canteen pantry.',
    tech: ['React.js', 'Node.js', 'MongoDB'],
    links: {
      github: 'https://github.com/ArjunRajputGLA'
    },
    year: 2024
  },
  {
    id: 'article',
    title: 'Article Analyser',
    fileName: 'article_analyser.py',
    status: '🎓 Intel UNNATI 2024',
    category: ['AI/ML'],
    description: 'Intel UNNATI Programme 2024 project for analyzing articles using NLP and Gemini API.',
    tech: ['Python', 'NLP', 'Gemini API', 'Streamlit'],
    links: {
      live: 'https://article-analyzer-via-gemini-weshallworkwithease.streamlit.app/',
      github: 'https://github.com/ArjunRajputGLA'
    },
    year: 2024
  },
  {
    id: 'jarvis',
    title: 'J.A.R.V.I.S Arena',
    fileName: 'jarvis_arena.jsx',
    category: ['Full-Stack', 'Gaming'],
    description: 'Robust gaming website and playground that provides amazing experience to users.',
    tech: ['JavaScript', 'React.js', 'Gaming'],
    links: {
      github: 'https://github.com/ArjunRajputGLA'
    },
    year: 2024
  }
];

const fileTree = {
  'ai_ml': ['agentix.tsx', 'no_code_backend.tsx', 'article_analyser.py', 'smart_classroom.tsx'],
  'full_stack': ['gla_canteen_app.tsx', 'jarvis_arena.jsx'],
  'desktop': ['fluxor_file_manager.js']
};

export default function ProjectsSection() {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['ai_ml']));
  const [selectedProject, setSelectedProject] = useState<Project | null>(projects[0]);
  const [filter, setFilter] = useState<string>('All');
  const [showModal, setShowModal] = useState(false);

  const toggleFolder = (folder: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folder)) {
        newSet.delete(folder);
      } else {
        newSet.add(folder);
      }
      return newSet;
    });
  };

  const getProjectByFileName = (fileName: string) => {
    return projects.find(p => p.fileName === fileName);
  };

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.category.includes(filter));

  return (
    <section id="projects" className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="bg-[var(--vscode-bg)] border border-[var(--vscode-border)] rounded-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {/* Editor Header */}
          <div className="flex items-center gap-2 px-4 py-2 bg-[var(--vscode-sidebar)] border-b border-[var(--vscode-sidebar-border)]">
            <span className="text-lg">📁</span>
            <span className="text-xs text-[var(--vscode-text-muted)]">projects/ — ArjunRajput.ai</span>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1 p-2 bg-[var(--vscode-tab-inactive)] border-b border-[var(--vscode-sidebar-border)]">
            {['All', 'AI/ML', 'Full-Stack', 'Desktop'].map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  filter === tab 
                    ? 'bg-[var(--vscode-accent)] text-white' 
                    : 'hover:bg-[var(--vscode-line-highlight)] text-[var(--vscode-text-muted)]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-col md:flex-row">
            {/* File Tree Sidebar */}
            <div className="md:w-64 border-r border-[var(--vscode-sidebar-border)] bg-[var(--vscode-sidebar)] p-2">
              <div className="text-xs text-[var(--vscode-text-muted)] uppercase mb-2 px-2">Explorer</div>
              
              {Object.entries(fileTree).map(([folder, files]) => (
                <div key={folder}>
                  <button
                    onClick={() => toggleFolder(folder)}
                    className="flex items-center gap-1 w-full px-2 py-1 hover:bg-[var(--vscode-line-highlight)] rounded text-sm"
                  >
                    {expandedFolders.has(folder) ? (
                      <>
                        <ChevronDown size={14} />
                        <FolderOpen size={14} className="text-[var(--vscode-warning)]" />
                      </>
                    ) : (
                      <>
                        <ChevronRight size={14} />
                        <Folder size={14} className="text-[var(--vscode-warning)]" />
                      </>
                    )}
                    <span>{folder}/</span>
                  </button>

                  <AnimatePresence>
                    {expandedFolders.has(folder) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        {files.map(file => {
                          const project = getProjectByFileName(file);
                          const isSelected = selectedProject?.fileName === file;
                          
                          return (
                            <button
                              key={file}
                              onClick={() => setSelectedProject(project || null)}
                              className={`flex items-center gap-1 w-full pl-8 pr-2 py-1 text-sm ${
                                isSelected 
                                  ? 'bg-[var(--vscode-selection)]' 
                                  : 'hover:bg-[var(--vscode-line-highlight)]'
                              }`}
                            >
                              <FileCode size={14} className="text-[var(--vscode-accent)]" />
                              <span className="truncate">{file}</span>
                              {project?.featured && (
                                <Star size={12} className="text-[var(--vscode-warning)] fill-current ml-auto" />
                              )}
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Project Preview */}
            <div className="flex-1 p-4 md:p-6">
              {selectedProject ? (
                <motion.div
                  key={selectedProject.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-mono text-sm"
                >
                  {/* File Header Comment */}
                  <div className="syntax-comment mb-4">{`// ${selectedProject.fileName}`}</div>

                  {/* Project as Code */}
                  <div className="space-y-1">
                    <div>
                      <span className="syntax-keyword">export const </span>
                      <span className="syntax-variable">{selectedProject.id.toUpperCase()}</span>
                      <span> = {'{'}</span>
                    </div>

                    <div className="ml-4">
                      <span className="syntax-property">title</span>
                      <span>: </span>
                      <span className="syntax-string">&quot;{selectedProject.title}&quot;</span>
                      <span>,</span>
                    </div>

                    {selectedProject.status && (
                      <div className="ml-4">
                        <span className="syntax-property">status</span>
                        <span>: </span>
                        <span className="syntax-string">&quot;{selectedProject.status}&quot;</span>
                        <span>,</span>
                      </div>
                    )}

                    <div className="ml-4">
                      <span className="syntax-property">category</span>
                      <span>: [</span>
                      {selectedProject.category.map((cat, i) => (
                        <span key={cat}>
                          <span className="syntax-string">&quot;{cat}&quot;</span>
                          {i < selectedProject.category.length - 1 && <span>, </span>}
                        </span>
                      ))}
                      <span>],</span>
                    </div>

                    <div className="ml-4">
                      <span className="syntax-property">description</span>
                      <span>: </span>
                      <span className="syntax-string">`{selectedProject.description}`</span>
                      <span>,</span>
                    </div>

                    <div className="ml-4">
                      <span className="syntax-property">tech</span>
                      <span>: [</span>
                      {selectedProject.tech.map((t, i) => (
                        <span key={t}>
                          <span className="syntax-string">&quot;{t}&quot;</span>
                          {i < selectedProject.tech.length - 1 && <span>, </span>}
                        </span>
                      ))}
                      <span>],</span>
                    </div>

                    <div className="ml-4">
                      <span className="syntax-property">links</span>
                      <span>: {'{'}</span>
                    </div>
                    {selectedProject.links.live && (
                      <div className="ml-8">
                        <span className="syntax-property">live</span>
                        <span>: </span>
                        <span className="syntax-string">&quot;{selectedProject.links.live}&quot;</span>
                        <span>,</span>
                      </div>
                    )}
                    {selectedProject.links.github && (
                      <div className="ml-8">
                        <span className="syntax-property">github</span>
                        <span>: </span>
                        <span className="syntax-string">&quot;{selectedProject.links.github}&quot;</span>
                      </div>
                    )}
                    <div className="ml-4">
                      <span>{'}'}</span>
                      <span>,</span>
                    </div>

                    <div className="ml-4">
                      <span className="syntax-property">year</span>
                      <span>: </span>
                      <span className="syntax-number">{selectedProject.year}</span>
                    </div>

                    <div><span>{'};'}</span></div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 mt-8">
                    {selectedProject.links.live && (
                      <a
                        href={selectedProject.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-[var(--vscode-accent)] hover:bg-[var(--vscode-accent-hover)] text-white rounded text-sm transition-colors"
                      >
                        <ExternalLink size={14} />
                        <span>View Live</span>
                      </a>
                    )}
                    {selectedProject.links.github && (
                      <a
                        href={selectedProject.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 border border-[var(--vscode-border)] hover:border-[var(--vscode-accent)] rounded text-sm transition-colors"
                      >
                        <Github size={14} />
                        <span>View Code</span>
                      </a>
                    )}
                  </div>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-2 mt-6">
                    {selectedProject.tech.map(tech => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-[var(--vscode-sidebar)] border border-[var(--vscode-border)] rounded text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <div className="text-center text-[var(--vscode-text-muted)] py-12">
                  Select a project from the file tree
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Project Cards Grid (Alternative View) */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              className="bg-[var(--vscode-sidebar)] border border-[var(--vscode-border)] rounded-lg p-4 hover:border-[var(--vscode-accent)] transition-colors cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              onClick={() => {
                setSelectedProject(project);
                setShowModal(true);
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileCode size={16} className="text-[var(--vscode-accent)]" />
                  <span className="text-sm font-medium">{project.fileName}</span>
                </div>
                {project.featured && (
                  <Star size={14} className="text-[var(--vscode-warning)] fill-current" />
                )}
              </div>
              
              <h3 className="text-base font-semibold mb-2">{project.title}</h3>
              
              {project.status && (
                <p className="text-[var(--vscode-success)] text-xs mb-2">{project.status}</p>
              )}
              
              <p className="text-[var(--vscode-text-muted)] text-xs mb-4 line-clamp-2">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-1">
                {project.tech.slice(0, 3).map(tech => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 bg-[var(--vscode-bg)] rounded text-xs"
                  >
                    {tech}
                  </span>
                ))}
                {project.tech.length > 3 && (
                  <span className="px-2 py-0.5 text-[var(--vscode-text-muted)] text-xs">
                    +{project.tech.length - 3}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {showModal && selectedProject && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="bg-[var(--vscode-bg)] border border-[var(--vscode-border)] rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-[var(--vscode-sidebar-border)]">
                <div className="flex items-center gap-2">
                  <FileCode size={16} className="text-[var(--vscode-accent)]" />
                  <span className="font-medium">{selectedProject.fileName}</span>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 hover:bg-[var(--vscode-line-highlight)] rounded"
                  aria-label="Close modal"
                >
                  <X size={16} />
                </button>
              </div>
              
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2">{selectedProject.title}</h2>
                {selectedProject.status && (
                  <p className="text-[var(--vscode-success)] mb-4">{selectedProject.status}</p>
                )}
                <p className="text-[var(--vscode-text-muted)] mb-6">{selectedProject.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedProject.tech.map(tech => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-[var(--vscode-sidebar)] border border-[var(--vscode-border)] rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-4">
                  {selectedProject.links.live && (
                    <a
                      href={selectedProject.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-[var(--vscode-accent)] text-white rounded"
                    >
                      <ExternalLink size={14} />
                      View Live
                    </a>
                  )}
                  {selectedProject.links.github && (
                    <a
                      href={selectedProject.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 border border-[var(--vscode-border)] rounded"
                    >
                      <Github size={14} />
                      View Code
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
