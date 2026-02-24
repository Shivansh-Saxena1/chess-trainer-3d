'use client';

import { motion } from 'framer-motion';
import {
  Code2,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Calendar,
  ExternalLink,
  Layers,
  Cpu,
  Palette,
  Globe,
  Terminal,
  Heart,
} from 'lucide-react';

interface AboutSectionProps {
  onNavigate: (section: 'home' | 'about' | 'playground') => void;
}

const techStack = [
  { name: 'React', description: 'UI Framework', icon: '⚛️' },
  { name: 'Three.js', description: '3D Graphics', icon: '🎮' },
  { name: 'React Three Fiber', description: 'React + Three.js', icon: '🔷' },
  { name: 'Next.js', description: 'Full-Stack Framework', icon: '▲' },
  { name: 'TypeScript', description: 'Type Safety', icon: '📘' },
  { name: 'Tailwind CSS', description: 'Styling', icon: '🎨' },
  { name: 'Zustand', description: 'State Management', icon: '🐻' },
  { name: 'Stockfish.js', description: 'Chess Engine', icon: '♟️' },
];

const timeline = [
  {
    year: '2024',
    title: 'Chess Trainer Project',
    description: 'Built a comprehensive 3D chess training platform with AI analysis.',
  },
  {
    year: '2023',
    title: 'Web Development Journey',
    description: 'Mastered modern React ecosystem and 3D web technologies.',
  },
  {
    year: '2022',
    title: 'Started Coding',
    description: 'Began the journey into software development and computer science.',
  },
];

const skills = [
  { name: 'Frontend Development', level: 95 },
  { name: '3D Web Graphics', level: 85 },
  { name: 'React/Next.js', level: 90 },
  { name: 'TypeScript', level: 88 },
  { name: 'UI/UX Design', level: 80 },
];

export function AboutSection({ onNavigate }: AboutSectionProps) {
  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-amber-500/5 to-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="text-white">About</span>{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                The Project
              </span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              A modern 3D chess training platform built with cutting-edge web technologies.
            </p>
          </motion.div>

          {/* Developer Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700 overflow-hidden">
              {/* Decorative top gradient */}
              <div className="h-32 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20" />

              <div className="p-8 -mt-16">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  {/* Avatar */}
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-5xl font-bold text-white shadow-2xl shadow-amber-500/30">
                      SS
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center border-4 border-gray-900">
                      <Code2 className="w-4 h-4 text-white" />
                    </div>
                  </motion.div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <h2 className="text-3xl font-bold text-white">Shivansh Saxena</h2>
                      <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium">
                        Developer
                      </span>
                    </div>

                    <p className="text-gray-400 mb-6 max-w-xl">
                      A passionate full-stack developer with a love for creating immersive web experiences.
                      Specializing in React, 3D web graphics, and modern JavaScript technologies.
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-amber-500" />
                        <span>India</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-amber-500" />
                        <span>Available for projects</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-amber-500" />
                        <span>Full-Stack Developer</span>
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex gap-3">
                      <motion.a
                        href="#"
                        className="p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors group"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Github className="w-5 h-5 text-gray-400 group-hover:text-white" />
                      </motion.a>
                      <motion.a
                        href="#"
                        className="p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors group"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-white" />
                      </motion.a>
                      <motion.a
                        href="#"
                        className="p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors group"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Mail className="w-5 h-5 text-gray-400 group-hover:text-white" />
                      </motion.a>
                      <motion.a
                        href="#"
                        className="p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors group"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Globe className="w-5 h-5 text-gray-400 group-hover:text-white" />
                      </motion.a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">Skills</h3>
              </div>

              <div className="space-y-4">
                {skills.map((skill, index) => (
                  <div key={skill.name}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-300">{skill.name}</span>
                      <span className="text-gray-500">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">Journey</h3>
              </div>

              <div className="space-y-6">
                {timeline.map((item, index) => (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="relative pl-6 border-l-2 border-gray-700"
                  >
                    <div className="absolute left-0 top-0 w-3 h-3 -translate-x-[7px] rounded-full bg-amber-500" />
                    <span className="text-sm text-amber-400 font-medium">{item.year}</span>
                    <h4 className="text-white font-medium mt-1">{item.title}</h4>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Tech Stack */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white">Technology Stack</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {techStack.map((tech, index) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="p-4 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 hover:border-amber-500/30 transition-colors cursor-pointer group"
                >
                  <div className="text-2xl mb-2">{tech.icon}</div>
                  <h4 className="text-white font-medium">{tech.name}</h4>
                  <p className="text-xs text-gray-500">{tech.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Footer CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex flex-col items-center p-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl border border-gray-700">
              <Heart className="w-8 h-8 text-red-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Enjoy the Project?</h3>
              <p className="text-gray-400 mb-6">Try out the chess playground and improve your game!</p>
              <motion.button
                onClick={() => onNavigate('playground')}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg font-semibold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-shadow flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Play Chess</span>
                <ExternalLink className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
