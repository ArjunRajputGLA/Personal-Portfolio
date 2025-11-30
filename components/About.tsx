'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { GraduationCap, Trophy, Code2, Sparkles, Calendar, Target, Award } from 'lucide-react';

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const stats = [
    { label: 'Years Experience', value: '2+', icon: Calendar },
    { label: 'Projects Completed', value: '7+', icon: Target },
    { label: 'LeetCode Solved', value: '600+', icon: Code2 },
    { label: 'Hackathons Won', value: '1', icon: Trophy },
  ];

  const quickFacts = [
    { icon: GraduationCap, text: 'B.Tech Student at GLA University' },
    { icon: Trophy, text: 'National Hackathon Winner' },
    { icon: Code2, text: '600+ LeetCode Problems Solved' },
    { icon: Sparkles, text: 'Specialized in AI/ML & Full-Stack Development' },
  ];

  return (
    <section id="about" ref={ref} className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            About <span className="gradient-text">Me</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* Left Column: Photo + Stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Professional Photo */}
            <div className="relative w-full max-w-sm mx-auto">
              <div className="relative bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-1">
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-white dark:bg-gray-800">
                  <img
                    src="/arjun singh rajput.jpg"
                    alt="Arjun Singh Rajput"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Stats Box */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-center">Key Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                      transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                      className="text-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl"
                    >
                      <Icon className="w-6 h-6 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Bio + Quick Facts */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="lg:col-span-3 space-y-6"
          >
            {/* Bio */}
            <div className="space-y-4">
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                I&apos;m a <strong className="text-purple-600 dark:text-purple-400">B.Tech student</strong> at{' '}
                <strong className="text-gray-900 dark:text-white">GLA University, Mathura</strong>, graduating in April 2027. 
                I specialize in <strong className="text-blue-600 dark:text-blue-400">AI/ML</strong> with a focus on 
                Natural Language Processing, Deep Learning, and full-stack development.
              </p>
              
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                As a <strong className="text-purple-600 dark:text-purple-400">National Hackathon Winner</strong> (Pan IIT Alumni Imagine 2025) 
                and with <strong className="text-gray-900 dark:text-white">600+ LeetCode problems</strong> solved, 
                I bring both competitive programming expertise and practical development skills to every project.
              </p>

              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                I&apos;m passionate about building <strong className="text-gray-900 dark:text-white">intelligent, scalable systems</strong> that 
                solve real-world problems. My work spans AI agents, full-stack applications, and the intersection 
                of data science with modern web technologies.
              </p>
            </div>

            {/* Quick Facts */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl border-2 border-purple-200 dark:border-purple-800 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                At a Glance
              </h3>
              <div className="grid gap-3">
                {quickFacts.map((fact, index) => {
                  const Icon = fact.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                      transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                      className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl"
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 font-medium">{fact.text}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Currently Section */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-5">
              <p className="text-blue-900 dark:text-blue-200 flex items-start gap-3">
                <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="font-semibold">Currently:</strong> Seeking internship opportunities in AI/ML and Full-Stack Development
                </span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
