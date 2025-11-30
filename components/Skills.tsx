'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Code2, Layout, Server, Brain, Briefcase } from 'lucide-react';

export default function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const skillCategories = [
    {
      title: 'Programming Languages',
      icon: Code2,
      skills: [
        { name: 'Python', level: 'Expert' },
        { name: 'JavaScript/TypeScript', level: 'Advanced' },
        { name: 'C++', level: 'Advanced' },
        { name: 'Java', level: 'Intermediate' },
        { name: 'SQL', level: 'Advanced' },
      ],
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Frontend Development',
      icon: Layout,
      skills: [
        { name: 'React.js', level: 'Advanced' },
        { name: 'Next.js', level: 'Advanced' },
        { name: 'Tailwind CSS', level: 'Expert' },
        { name: 'HTML/CSS', level: 'Expert' },
        { name: 'Framer Motion', level: 'Intermediate' },
      ],
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Backend & Tools',
      icon: Server,
      skills: [
        { name: 'Node.js/Express', level: 'Advanced' },
        { name: 'FastAPI', level: 'Advanced' },
        { name: 'MongoDB', level: 'Advanced' },
        { name: 'PostgreSQL', level: 'Intermediate' },
        { name: 'Git/GitHub', level: 'Expert' },
        { name: 'Docker', level: 'Intermediate' },
      ],
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'AI/ML & Data Science',
      icon: Brain,
      skills: [
        { name: 'TensorFlow/PyTorch', level: 'Advanced' },
        { name: 'LangChain', level: 'Advanced' },
        { name: 'OpenCV', level: 'Intermediate' },
        { name: 'Scikit-learn', level: 'Advanced' },
        { name: 'Pandas/NumPy', level: 'Expert' },
        { name: 'Hugging Face', level: 'Advanced' },
      ],
      color: 'from-orange-500 to-red-500',
    },
    {
      title: 'Professional Skills',
      icon: Briefcase,
      skills: [
        { name: 'Problem Solving', level: 'Expert' },
        { name: 'System Design', level: 'Advanced' },
        { name: 'Team Collaboration', level: 'Advanced' },
        { name: 'Technical Communication', level: 'Advanced' },
        { name: 'Project Management', level: 'Intermediate' },
      ],
      color: 'from-violet-500 to-purple-500',
    },
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Expert':
        return 'bg-green-500';
      case 'Advanced':
        return 'bg-blue-500';
      case 'Intermediate':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getLevelWidth = (level: string) => {
    switch (level) {
      case 'Expert':
        return 'w-full';
      case 'Advanced':
        return 'w-4/5';
      case 'Intermediate':
        return 'w-3/5';
      default:
        return 'w-2/5';
    }
  };

  return (
    <section id="skills" ref={ref} className="py-24 px-4 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Technical <span className="gradient-text">Skills</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto rounded-full" />
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg">
            Technologies I work with
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <category.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {category.title}
                </h3>
              </div>
              
              <div className="space-y-4">
                {category.skills.map((skill) => (
                  <div key={skill.name} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {skill.name}
                      </span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        skill.level === 'Expert' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        skill.level === 'Advanced' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {skill.level}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className={`h-full ${getLevelColor(skill.level)} ${getLevelWidth(skill.level)} rounded-full transition-all duration-1000`} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
