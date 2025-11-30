'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Trophy, Code2, Award, Briefcase, Target, GraduationCap } from 'lucide-react';

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
          return prev + 15;
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
      description: 'Won 1st place nationally for AGENTIX - AI Agent Evaluation Platform competing against top engineering colleges',
      color: 'from-yellow-500 to-orange-500',
      importance: 'featured',
    },
    {
      icon: Code2,
      title: '600+ LeetCode Problems',
      subtitle: 'Competitive Programming',
      description: 'Demonstrated strong algorithmic thinking and problem-solving skills through consistent practice',
      color: 'from-green-500 to-emerald-500',
      link: 'https://leetcode.com/u/CodeXI/',
      importance: 'high',
      animatedValue: leetcodeCount,
    },
    {
      icon: GraduationCap,
      title: 'Intel UNNATI Programme',
      subtitle: '2024 & 2025 Cohorts',
      description: 'Completed Intel UNNATI Programme with industry-recognized certifications in AI/ML and advanced technologies',
      color: 'from-blue-500 to-cyan-500',
      importance: 'high',
    },
    {
      icon: Briefcase,
      title: 'Technical Leadership',
      subtitle: 'Anchor & Speaker',
      description: 'Served as Anchor for Hons. Celebration Day at GLA University 2024, hosting technical and cultural events',
      color: 'from-purple-500 to-pink-500',
      importance: 'medium',
    },
    {
      icon: Target,
      title: 'Hackathon Participation',
      subtitle: 'AI & Web3 Events',
      description: 'Active participant in multiple hackathons including AI Hackathon with Meta LLAMA 2024 and other tech competitions',
      color: 'from-indigo-500 to-purple-500',
      importance: 'medium',
    },
    {
      icon: Award,
      title: 'Continuous Learning',
      subtitle: 'Workshops & Certifications',
      description: 'Attended 10+ technical workshops covering GenAI, NLP, Data Science, Django, and emerging technologies',
      color: 'from-pink-500 to-red-500',
      importance: 'medium',
    },
  ];

  return (
    <section id="achievements" ref={ref} className="py-24 px-4 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Achievements & <span className="gradient-text">Recognition</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto rounded-full" />
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg">
            Milestones that define my journey in technology
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            const isFeatured = achievement.importance === 'featured';
            
            return (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`relative ${isFeatured ? 'md:col-span-2 lg:col-span-1' : ''}`}
              >
                {isFeatured && (
                  <div className="absolute -top-3 -right-3 z-10">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1.5 rounded-full font-bold text-xs shadow-lg flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5" />
                      <span>Winner</span>
                    </div>
                  </div>
                )}
                
                <div className={`h-full bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 ${
                  isFeatured 
                    ? 'border-yellow-300 dark:border-yellow-700' 
                    : 'border-gray-200 dark:border-gray-700'
                } hover:border-purple-500 dark:hover:border-purple-500 transition-colors`}>
                  
                  {/* Icon */}
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${achievement.color} mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1.5">
                    {achievement.title}
                  </h3>

                  {/* Subtitle */}
                  <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-3">
                    {achievement.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm mb-4">
                    {achievement.description}
                  </p>

                  {/* Animated Counter for LeetCode */}
                  {achievement.animatedValue !== undefined && (
                    <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                        {achievement.animatedValue}+
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Problems Solved</div>
                    </div>
                  )}

                  {/* Link */}
                  {achievement.link && (
                    <motion.a
                      href={achievement.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ x: 5 }}
                      className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold hover:text-purple-700 dark:hover:text-purple-300 transition-colors text-sm"
                    >
                      <span>View Profile</span>
                      <span>→</span>
                    </motion.a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
