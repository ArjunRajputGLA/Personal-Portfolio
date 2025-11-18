'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  Code2, Database, Brain, Zap, Users, TrendingUp, 
  MessageSquare, GitBranch, Cpu, Palette 
} from 'lucide-react';

export default function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const skillCategories = [
    {
      title: 'Programming Languages',
      icon: Code2,
      skills: ['Python', 'Java', 'JavaScript', 'TypeScript', 'HTML/CSS', 'SQL'],
      color: 'purple',
    },
    {
      title: 'Frameworks & Libraries',
      icon: Palette,
      skills: ['React.js', 'Next.js', 'Electron.js', 'Scikit-Learn', 'PyTorch', 'Seaborn'],
      color: 'blue',
    },
    {
      title: 'Databases & Tools',
      icon: Database,
      skills: ['MongoDB', 'SQL', 'Git', 'Machine Learning', 'Data Visualization'],
      color: 'green',
    },
    {
      title: 'AI & Automation',
      icon: Brain,
      skills: ['NLP', 'Deep Learning', 'AI Agents', 'Model Development', 'TensorFlow'],
      color: 'pink',
    },
    {
      title: 'Development',
      icon: Cpu,
      skills: ['Full-Stack Development', 'RESTful APIs', 'Responsive Design', 'Version Control'],
      color: 'indigo',
    },
    {
      title: 'Problem-Solving',
      icon: Zap,
      skills: ['600+ LeetCode', 'Algorithms', 'Data Structures', 'Competitive Programming'],
      color: 'yellow',
    },
    {
      title: 'Soft Skills',
      icon: Users,
      skills: ['Communication', 'Team Collaboration', 'Leadership', 'Quick Learning'],
      color: 'orange',
    },
    {
      title: 'Analysis & Thinking',
      icon: TrendingUp,
      skills: ['Analytical Thinking', 'Critical Thinking', 'Problem Decomposition', 'Debugging'],
      color: 'cyan',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; border: string; text: string; hover: string }> = {
      purple: {
        bg: 'bg-purple-50 dark:bg-purple-900/20',
        border: 'border-purple-200 dark:border-purple-800',
        text: 'text-purple-600 dark:text-purple-400',
        hover: 'hover:bg-purple-100 dark:hover:bg-purple-900/40',
      },
      blue: {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-200 dark:border-blue-800',
        text: 'text-blue-600 dark:text-blue-400',
        hover: 'hover:bg-blue-100 dark:hover:bg-blue-900/40',
      },
      green: {
        bg: 'bg-green-50 dark:bg-green-900/20',
        border: 'border-green-200 dark:border-green-800',
        text: 'text-green-600 dark:text-green-400',
        hover: 'hover:bg-green-100 dark:hover:bg-green-900/40',
      },
      pink: {
        bg: 'bg-pink-50 dark:bg-pink-900/20',
        border: 'border-pink-200 dark:border-pink-800',
        text: 'text-pink-600 dark:text-pink-400',
        hover: 'hover:bg-pink-100 dark:hover:bg-pink-900/40',
      },
      indigo: {
        bg: 'bg-indigo-50 dark:bg-indigo-900/20',
        border: 'border-indigo-200 dark:border-indigo-800',
        text: 'text-indigo-600 dark:text-indigo-400',
        hover: 'hover:bg-indigo-100 dark:hover:bg-indigo-900/40',
      },
      yellow: {
        bg: 'bg-yellow-50 dark:bg-yellow-900/20',
        border: 'border-yellow-200 dark:border-yellow-800',
        text: 'text-yellow-600 dark:text-yellow-400',
        hover: 'hover:bg-yellow-100 dark:hover:bg-yellow-900/40',
      },
      orange: {
        bg: 'bg-orange-50 dark:bg-orange-900/20',
        border: 'border-orange-200 dark:border-orange-800',
        text: 'text-orange-600 dark:text-orange-400',
        hover: 'hover:bg-orange-100 dark:hover:bg-orange-900/40',
      },
      cyan: {
        bg: 'bg-cyan-50 dark:bg-cyan-900/20',
        border: 'border-cyan-200 dark:border-cyan-800',
        text: 'text-cyan-600 dark:text-cyan-400',
        hover: 'hover:bg-cyan-100 dark:hover:bg-cyan-900/40',
      },
    };
    return colors[color];
  };

  return (
    <section id="skills" ref={ref} className="py-20 px-4 bg-white/50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Skills & <span className="gradient-text">Capabilities</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto rounded-full mb-6" />
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A comprehensive toolkit spanning AI/ML, full-stack development, and problem-solving
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((category, categoryIndex) => {
            const Icon = category.icon;
            const colorClasses = getColorClasses(category.color);
            
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                whileHover={{ y: -10 }}
                className={`p-6 rounded-2xl border-2 ${colorClasses.bg} ${colorClasses.border} ${colorClasses.hover} transition-all duration-300`}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`p-3 rounded-xl ${colorClasses.bg}`}>
                    <Icon className={`w-6 h-6 ${colorClasses.text}`} />
                  </div>
                  <h3 className={`font-bold text-lg ${colorClasses.text}`}>
                    {category.title}
                  </h3>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <motion.span
                      key={skill}
                      whileHover={{ scale: 1.05 }}
                      className="px-3 py-1 text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full border border-gray-200 dark:border-gray-700 font-medium"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
