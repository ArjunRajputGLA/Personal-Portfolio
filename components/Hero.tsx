'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Trophy } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-16 px-4 overflow-hidden">
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-white to-blue-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800" />
      <div className="absolute top-20 left-10 w-96 h-96 bg-purple-200/30 dark:bg-purple-900/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/30 dark:bg-blue-900/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Winner Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-full border border-yellow-300 dark:border-yellow-700"
        >
          <Trophy className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
          <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">
            National Hackathon Winner 2025
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-gray-900 dark:text-white"
        >
          Arjun Singh Rajput
        </motion.h1>

        {/* Professional Headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-2xl md:text-4xl font-semibold mb-4 text-gray-700 dark:text-gray-300"
        >
          <span className="gradient-text">AI/ML Engineer</span> & Full-Stack Developer
        </motion.p>

        {/* Key Highlights */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          Building intelligent systems with AI/ML • 600+ LeetCode problems solved • 
          Specialized in NLP, Deep Learning, and scalable web applications
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.a
            href="#projects"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold text-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
          >
            <span>View Projects</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.a>

          <motion.a
            href="#contact"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-full font-semibold text-lg border-2 border-gray-300 dark:border-gray-700 hover:border-purple-600 dark:hover:border-purple-600 transition-colors"
          >
            Get In Touch
          </motion.a>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 flex flex-wrap justify-center gap-8 text-center"
        >
          <div>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">2+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Years Experience</div>
          </div>
          <div className="hidden sm:block w-px h-12 bg-gray-300 dark:bg-gray-700" />
          <div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">7+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Projects</div>
          </div>
          <div className="hidden sm:block w-px h-12 bg-gray-300 dark:bg-gray-700" />
          <div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">600+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">LeetCode Solved</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
