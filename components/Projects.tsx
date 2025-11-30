'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { ExternalLink, Award, ShoppingCart, Gamepad2, FileText, GraduationCap, FolderOpen, Shield, Filter } from 'lucide-react';

type ProjectCategory = 'All' | 'AI/ML' | 'Full-Stack' | 'Desktop';

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeFilter, setActiveFilter] = useState<ProjectCategory>('All');

  const projects = [
    {
      title: 'AGENTIX',
      subtitle: 'AI Agent Evaluation Platform',
      description: 'Real-time comparison platform to choose the right AI agent for your needs with live performance metrics',
      category: 'AI/ML',
      tech: ['AI Agents', 'Real-time Analytics', 'Next.js', 'MongoDB'],
      icon: Award,
      color: 'from-yellow-500 to-orange-500',
      featured: true,
      link: '#',
    },
    {
      title: 'Malware Detection System',
      subtitle: 'IIIT Kottayam Research Project',
      description: 'Advanced malware detection model using NLP and Deep Learning for cybersecurity applications',
      category: 'AI/ML',
      tech: ['TensorFlow', 'NLP', 'Deep Learning', 'Python'],
      icon: Shield,
      color: 'from-red-500 to-orange-500',
      link: '#',
    },
    {
      title: 'Article Analyser',
      subtitle: 'Intel UNNATI Programme 2024',
      description: 'Intelligent article analysis tool leveraging NLP techniques for content evaluation',
      category: 'AI/ML',
      tech: ['Python', 'NLP', 'Machine Learning', 'Flask'],
      icon: FileText,
      color: 'from-blue-500 to-cyan-500',
      link: '#',
    },
    {
      title: 'Smart AI Classroom',
      subtitle: 'Intel UNNATI Programme 2025',
      description: 'AI-powered classroom management and learning enhancement system for modern education',
      category: 'AI/ML',
      tech: ['Computer Vision', 'PyTorch', 'Full-Stack', 'EdTech'],
      icon: GraduationCap,
      color: 'from-indigo-500 to-purple-500',
      link: '#',
    },
    {
      title: 'GLA Campus Application',
      subtitle: 'Food Ordering & Management System',
      description: 'Complete food ordering and pantry management system for GLA University canteen with real-time updates',
      category: 'Full-Stack',
      tech: ['React.js', 'Node.js', 'Supabase', 'Real-time'],
      icon: ShoppingCart,
      color: 'from-green-500 to-emerald-500',
      link: '#',
    },
    {
      title: 'J.A.R.V.I.S Arena',
      subtitle: 'Gaming Website',
      description: 'Robust gaming platform providing immersive user experiences with interactive UI/UX',
      category: 'Full-Stack',
      tech: ['JavaScript', 'HTML/CSS', 'Node.js', 'WebSockets'],
      icon: Gamepad2,
      color: 'from-purple-500 to-pink-500',
      link: '#',
    },
    {
      title: 'FLUXOR',
      subtitle: 'AI File Manager',
      description: 'Intelligent file management system for efficient organization using AI algorithms',
      category: 'Desktop',
      tech: ['Electron.js', 'AI', 'Node.js', 'File System'],
      icon: FolderOpen,
      color: 'from-teal-500 to-green-500',
      link: '#',
    },
  ];

  const filters: ProjectCategory[] = ['All', 'AI/ML', 'Full-Stack', 'Desktop'];

  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  return (
    <section id="projects" ref={ref} className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto rounded-full" />
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg">
            Building intelligent systems that make a difference
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mr-2">
            <Filter className="w-5 h-5" />
            <span className="font-medium">Filter:</span>
          </div>
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2.5 rounded-full font-semibold transition-all ${
                activeFilter === filter
                  ? 'bg-purple-600 text-white shadow-lg scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500'
              }`}
            >
              {filter}
            </button>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => {
            const Icon = project.icon;
            
            return (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="relative group h-full"
              >
                {project.featured && (
                  <div className="absolute -top-3 -right-3 z-10">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1.5 rounded-full font-bold text-xs shadow-lg flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5" />
                      <span>Winner</span>
                    </div>
                  </div>
                )}
                
                <div className="h-full bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden hover:border-purple-500 dark:hover:border-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl flex flex-col">
                  {/* Gradient Header */}
                  <div className={`h-1.5 bg-gradient-to-r ${project.color}`} />
                  
                  <div className="p-6 flex flex-col flex-grow">
                    {/* Icon */}
                    <div className="mb-4">
                      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${project.color}`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                    </div>

                    {/* Title and Subtitle */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1.5">
                      {project.title}
                    </h3>
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-3">
                      {project.subtitle}
                    </p>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed text-sm flex-grow">
                      {project.description}
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Action Link */}
                    <motion.a
                      href={project.link}
                      whileHover={{ x: 5 }}
                      className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold hover:text-purple-700 dark:hover:text-purple-300 transition-colors text-sm"
                    >
                      <span>View Details</span>
                      <ExternalLink className="w-4 h-4" />
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-gray-500 dark:text-gray-400"
          >
            No projects found in this category.
          </motion.div>
        )}
      </div>
    </section>
  );
}
