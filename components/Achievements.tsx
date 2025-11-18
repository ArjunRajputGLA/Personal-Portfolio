'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Trophy, Code2, Award, Rocket, Target, Zap } from 'lucide-react';

export default function Achievements() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [leetcodeCount, setLeetcodeCount] = useState(0);

  useEffect(() => {
    if (isInView && leetcodeCount < 600) {
      const interval = setInterval(() => {
        setLeetcodeCount((prev) => {
          if (prev >= 600) {
            clearInterval(interval);
            return 600;
          }
          return prev + 10;
        });
      }, 20);
      return () => clearInterval(interval);
    }
  }, [isInView, leetcodeCount]);

  const achievements = [
    {
      icon: Trophy,
      title: 'National Hackathon Winner',
      subtitle: 'Pan IIT Alumni Imagine 2025',
      description: 'Won national recognition for AGENTIX - AI Agent Evaluation Platform',
      color: 'from-yellow-500 to-orange-500',
      stats: '🏆 1st Place',
    },
    {
      icon: Code2,
      title: '600+ LeetCode Problems',
      subtitle: 'Competitive Programming Excellence',
      description: 'Strong problem-solving skills demonstrated through consistent practice',
      color: 'from-green-500 to-emerald-500',
      stats: `${leetcodeCount}+ Solved`,
      link: 'https://leetcode.com/u/CodeXI/',
    },
    {
      icon: Award,
      title: 'Intel & NEC Certifications',
      subtitle: 'Intel UNNATI Programme',
      description: 'Completed Intel UNNATI Programme 2024 & 2025 with industry-recognized certifications',
      color: 'from-blue-500 to-cyan-500',
      stats: '2 Programs',
    },
    {
      icon: Rocket,
      title: 'Technical Leadership',
      subtitle: 'Anchor & Speaker',
      description: 'Performed as Anchor in Hons. Celebration Day (GLA - 2024)',
      color: 'from-purple-500 to-pink-500',
      stats: 'Multiple Events',
    },
    {
      icon: Target,
      title: 'Hackathon Participation',
      subtitle: 'AI & Web3 Events',
      description: 'Participated in multiple hackathons including AI Hackathon with Meta LLAMA 2024',
      color: 'from-indigo-500 to-purple-500',
      stats: '5+ Events',
    },
    {
      icon: Zap,
      title: 'Technical Workshops',
      subtitle: 'Continuous Learning',
      description: 'Attended workshops on GenAI, NLP, Data Science, and Django',
      color: 'from-pink-500 to-red-500',
      stats: '10+ Workshops',
    },
  ];

  return (
    <section id="achievements" ref={ref} className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Achievements & <span className="gradient-text">Highlights</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto rounded-full mb-6" />
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Milestones that define my journey in technology and innovation
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            
            return (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative group"
              >
                <div className="h-full bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden hover:border-purple-500 dark:hover:border-purple-500 transition-all duration-300 shadow-lg hover:shadow-2xl">
                  {/* Gradient Header */}
                  <div className={`h-32 bg-gradient-to-br ${achievement.color} relative overflow-hidden`}>
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360]
                      }}
                      transition={{ duration: 20, repeat: Infinity }}
                      className="absolute inset-0 opacity-30"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full transform translate-x-16 -translate-y-16" />
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full transform -translate-x-16 translate-y-16" />
                    </motion.div>
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl"
                      >
                        <Icon className="w-8 h-8 text-gray-900" />
                      </motion.div>
                    </div>

                    {/* Stats Badge */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-sm font-bold text-gray-900">
                        {achievement.stats}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {achievement.title}
                    </h3>
                    
                    <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-3">
                      {achievement.subtitle}
                    </p>

                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {achievement.description}
                    </p>

                    {achievement.link && (
                      <motion.a
                        href={achievement.link}
                        whileHover={{ x: 5 }}
                        className="inline-flex items-center space-x-2 mt-4 text-purple-600 dark:text-purple-400 font-semibold hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                      >
                        <span>View Profile</span>
                        <span>→</span>
                      </motion.a>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Floating Badge */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold shadow-xl"
          >
            <Trophy className="w-6 h-6" />
            <span>National Hackathon Winner 2025</span>
            <Trophy className="w-6 h-6" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
