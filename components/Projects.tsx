'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ExternalLink, Github, Award, Zap, ShoppingCart, Gamepad2, FileText, GraduationCap, FolderOpen, Shield } from 'lucide-react';

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const projects = [
    {
      title: 'AGENTIX',
      subtitle: 'AI Agent Evaluation Platform',
      description: 'Real-time comparison platform to choose the right AI agent for your needs with live performance metrics',
      category: 'AI/ML • Full-Stack',
      tech: ['AI Agents', 'Real-time Analytics', 'Full-Stack Development'],
      icon: Award,
      color: 'from-yellow-500 to-orange-500',
      featured: true,
      link: '#',
    },
    {
      title: 'GLA Canteen Application',
      subtitle: 'Food Ordering & Management System',
      description: 'Complete food ordering and pantry management system for GLA University canteen with real-time updates',
      category: 'Full-Stack Application',
      tech: ['React.js', 'Node.js', 'MongoDB', 'Real-time Updates'],
      icon: ShoppingCart,
      color: 'from-green-500 to-emerald-500',
      link: '#',
    },
    {
      title: 'J.A.R.V.I.S Arena',
      subtitle: 'Gaming Website',
      description: 'Robust gaming platform providing immersive user experiences with interactive UI/UX',
      category: 'Web Development • Gaming',
      tech: ['JavaScript', 'React.js', 'Interactive UI/UX'],
      icon: Gamepad2,
      color: 'from-purple-500 to-pink-500',
      link: '#',
    },
    {
      title: 'Article Analyser',
      subtitle: 'Intel UNNATI Programme 2024',
      description: 'Intelligent article analysis tool leveraging NLP techniques for content evaluation',
      category: 'NLP • AI/ML',
      tech: ['Python', 'NLP', 'Machine Learning'],
      icon: FileText,
      color: 'from-blue-500 to-cyan-500',
      link: '#',
    },
    {
      title: 'Smart AI Classroom',
      subtitle: 'Intel UNNATI Programme 2025',
      description: 'AI-powered classroom management and learning enhancement system for modern education',
      category: 'AI • EdTech',
      tech: ['AI/ML', 'Computer Vision', 'Educational Technology'],
      icon: GraduationCap,
      color: 'from-indigo-500 to-purple-500',
      link: '#',
    },
    {
      title: 'FLUXOR',
      subtitle: 'AI File Manager',
      description: 'Intelligent file management system for efficient organization using AI algorithms',
      category: 'Desktop Application • AI',
      tech: ['Electron.js', 'AI algorithms', 'File System APIs'],
      icon: FolderOpen,
      color: 'from-teal-500 to-green-500',
      link: '#',
    },
    {
      title: 'Malware Detection System',
      subtitle: 'IIIT Kottayam Research Project',
      description: 'Advanced malware detection model using NLP and Deep Learning for cybersecurity applications',
      category: 'Deep Learning • Cybersecurity',
      tech: ['PyTorch', 'NLP', 'Deep Learning', 'Cybersecurity'],
      icon: Shield,
      color: 'from-red-500 to-orange-500',
      link: '#',
    },
  ];

  return (
    <section id="projects" ref={ref} className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto rounded-full mb-6" />
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Building intelligent systems that make a difference
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => {
            const Icon = project.icon;
            
            return (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className={`relative group ${project.featured ? 'md:col-span-2 lg:col-span-1' : ''}`}
              >
                {project.featured && (
                  <div className="absolute -top-4 -right-4 z-10">
                    <motion.div
                      animate={{ rotate: [0, 10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg flex items-center space-x-2"
                    >
                      <Award className="w-4 h-4" />
                      <span>Winner</span>
                    </motion.div>
                  </div>
                )}
                
                <div className="h-full bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden hover:border-purple-500 dark:hover:border-purple-500 transition-all duration-300 shadow-lg hover:shadow-2xl">
                  {/* Header with Gradient */}
                  <div className={`h-2 bg-gradient-to-r ${project.color}`} />
                  
                  <div className="p-6">
                    {/* Icon and Category */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${project.color}`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                        {project.category}
                      </span>
                    </div>

                    {/* Title and Subtitle */}
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {project.title}
                    </h3>
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-3">
                      {project.subtitle}
                    </p>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs px-3 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Action Button */}
                    <motion.a
                      href={project.link}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center space-x-2 text-purple-600 dark:text-purple-400 font-semibold hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                    >
                      <span>View Details</span>
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
