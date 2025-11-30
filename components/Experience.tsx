'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Briefcase, GraduationCap, MapPin, Calendar } from 'lucide-react';

export default function Experience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const experiences = [
    {
      type: 'work',
      title: 'Project Intern',
      organization: 'IIIT Kottayam, Kerala',
      location: 'Remote',
      period: 'May 2025 – July 2025',
      description: [
        'Developed malware detection model using NLP techniques and Deep Learning methods',
        'Applied cutting-edge ML algorithms for cybersecurity applications',
        'Collaborated with research team on innovative security solutions',
      ],
      icon: Briefcase,
      color: 'purple',
    },
    {
      type: 'work',
      title: 'Project Trainee',
      organization: 'AcmeGrade, Bangalore',
      location: 'Remote',
      period: 'January 2024 – March 2024',
      description: [
        'Completed comprehensive Data Science training through online lectures',
        'Applied learning to real-time projects and practical scenarios',
        'Received Certificate of Recommendation for outstanding performance',
      ],
      icon: Briefcase,
      color: 'blue',
    },
    {
      type: 'education',
      title: 'Bachelor of Technology (B.Tech)',
      organization: 'GLA University, Mathura',
      location: 'Mathura, UP',
      period: 'Expected April 2027',
      description: [
        'Specializing in Computer Science with focus on AI/ML',
        'Mastering Full-Stack Development and modern web technologies',
        'Active participation in hackathons and technical events',
      ],
      icon: GraduationCap,
      color: 'green',
    },
    {
      type: 'education',
      title: 'Intermediate Education',
      organization: 'Sanskar Public School, Mathura',
      location: 'Mathura, UP',
      period: 'Completed April 2023',
      description: [
        'Completed higher secondary education with distinction',
        'Built strong foundation in Mathematics and Computer Science',
      ],
      icon: GraduationCap,
      color: 'cyan',
    },
    {
      type: 'education',
      title: 'High School',
      organization: 'Sacred Heart Convent Hr. Sec. School, Mathura',
      location: 'Mathura, UP',
      period: 'Completed April 2021',
      description: [
        'Developed fundamental academic skills and interests',
        'Participated in various academic and extracurricular activities',
      ],
      icon: GraduationCap,
      color: 'pink',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
      purple: {
        bg: 'bg-purple-50 dark:bg-purple-900/20',
        border: 'border-purple-500',
        text: 'text-purple-600 dark:text-purple-400',
        iconBg: 'bg-purple-600',
      },
      blue: {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-500',
        text: 'text-blue-600 dark:text-blue-400',
        iconBg: 'bg-blue-600',
      },
      green: {
        bg: 'bg-green-50 dark:bg-green-900/20',
        border: 'border-green-500',
        text: 'text-green-600 dark:text-green-400',
        iconBg: 'bg-green-600',
      },
      cyan: {
        bg: 'bg-cyan-50 dark:bg-cyan-900/20',
        border: 'border-cyan-500',
        text: 'text-cyan-600 dark:text-cyan-400',
        iconBg: 'bg-cyan-600',
      },
      pink: {
        bg: 'bg-pink-50 dark:bg-pink-900/20',
        border: 'border-pink-500',
        text: 'text-pink-600 dark:text-pink-400',
        iconBg: 'bg-pink-600',
      },
    };
    return colors[color];
  };

  return (
    <section id="experience" ref={ref} className="py-24 px-4 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Experience & <span className="gradient-text">Education</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto rounded-full" />
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg">
            My professional journey and academic background
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-blue-500 to-green-500 md:-translate-x-px" />

          {experiences.map((exp, index) => {
            const Icon = exp.icon;
            const colorClasses = getColorClasses(exp.color);
            const isLeft = index % 2 === 0;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isLeft ? -30 : 30 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`relative mb-10 ${
                  isLeft ? 'md:pr-[calc(50%+30px)] md:text-right' : 'md:pl-[calc(50%+30px)]'
                }`}
              >
                {/* Timeline Icon */}
                <div className={`absolute left-6 md:left-1/2 top-6 ${colorClasses.iconBg} w-12 h-12 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-900 shadow-lg z-10 md:-translate-x-1/2`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Content Card */}
                <div
                  className={`ml-24 md:ml-0 p-6 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 transition-all duration-300 shadow-lg`}
                >
                  <div className={`flex items-center gap-2 mb-3 ${isLeft ? 'md:justify-end' : ''}`}>
                    <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      {exp.period}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {exp.title}
                  </h3>
                  
                  <p className={`font-semibold ${colorClasses.text} mb-2`}>
                    {exp.organization}
                  </p>

                  <div className={`flex items-center gap-2 mb-4 ${isLeft ? 'md:justify-end' : ''}`}>
                    <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {exp.location}
                    </span>
                  </div>

                  <ul className={`space-y-2 text-sm ${isLeft ? 'md:text-right' : ''}`}>
                    {exp.description.map((item, i) => (
                      <li
                        key={i}
                        className={`text-gray-700 dark:text-gray-300 flex items-start gap-2 ${isLeft ? 'md:flex-row-reverse md:text-right' : ''}`}
                      >
                        <span className={`${colorClasses.text} font-bold flex-shrink-0`}>•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
