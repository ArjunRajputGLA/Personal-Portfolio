'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { MapPin, Coffee, Sparkles } from 'lucide-react';

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" ref={ref} className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="gradient-text">Me</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl transform rotate-6" />
              <div className="relative bg-white dark:bg-gray-800 p-2 rounded-3xl shadow-xl transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900">
                  <img
                    src="/arjun singh rajput.jpg"
                    alt="Arjun Singh Rajput"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              {/* Floating Badge */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-full p-4 shadow-xl"
              >
                <Sparkles className="w-8 h-8 text-purple-600" />
              </motion.div>
            </div>
          </motion.div>

          {/* Bio Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                I&apos;m a <strong className="text-purple-600 dark:text-purple-400">B.Tech student</strong> at{' '}
                <strong>GLA University, Mathura</strong> (graduating April 2027), specializing in{' '}
                <strong className="text-blue-600 dark:text-blue-400">AI/ML</strong> with a focus on{' '}
                NLP, Deep Learning, and full-stack development.
              </p>
              
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                I&apos;m a <strong className="gradient-text-alt">curious builder</strong> passionate about creating{' '}
                <strong>intelligent, scalable systems</strong> that solve real-world problems. As a{' '}
                <strong className="text-purple-600 dark:text-purple-400">National Hackathon Winner</strong>{' '}
                (Pan IIT Alumni Imagine 2025) and with <strong>600+ LeetCode problems</strong> solved, 
                I bring both competitive programming expertise and practical development skills to every project.
              </p>

              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                My focus areas include building <strong>AI agents</strong>, developing{' '}
                <strong>user-centric applications</strong>, and exploring the intersection of{' '}
                <strong>data science</strong> and <strong>modern web technologies</strong>.
              </p>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 gap-4 mt-8">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center space-x-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800"
              >
                <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Location</p>
                  <p className="text-gray-600 dark:text-gray-400">Mathura, Uttar Pradesh</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
              >
                <Coffee className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Fun Fact</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    When I&apos;m not coding, I&apos;m performing as an anchor or diving into the latest GenAI innovations
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
