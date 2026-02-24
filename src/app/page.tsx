'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Import sections
import { NavBar } from '@/components/NavBar';
import { HomeSection } from '@/components/sections/HomeSection';
import { AboutSection } from '@/components/sections/AboutSection';

// Dynamically import the 3D scene to avoid SSR issues
const ChessScene = dynamic(
  () => import('@/components/chess/ChessScene').then((mod) => mod.ChessScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-screen bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            {/* Chess piece loader animation */}
            <svg viewBox="0 0 100 100" className="animate-pulse">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#374151"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="8"
                strokeDasharray="251.2"
                strokeDashoffset="62.8"
                className="animate-spin"
                style={{ transformOrigin: 'center' }}
              />
            </svg>
          </div>
          <div className="text-gray-400 text-sm">Loading Chess Playground...</div>
        </div>
      </div>
    ),
  }
);

type ActiveSection = 'home' | 'about' | 'playground';

// Page transition variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function Home() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('home');

  // Scroll to top when section changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeSection]);

  const handleNavigate = (section: ActiveSection) => {
    setActiveSection(section);
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navigation Bar */}
      <NavBar activeSection={activeSection} onNavigate={handleNavigate} />

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {activeSection === 'home' && (
          <motion.div
            key="home"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <HomeSection onNavigate={handleNavigate} />
          </motion.div>
        )}

        {activeSection === 'about' && (
          <motion.div
            key="about"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <AboutSection onNavigate={handleNavigate} />
          </motion.div>
        )}

        {activeSection === 'playground' && (
          <motion.div
            key="playground"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="h-screen"
          >
            <ChessScene />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer (shown only on non-playground pages) */}
      {activeSection !== 'playground' && (
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-900 border-t border-gray-800 py-8"
        >
          <div className="max-w-6xl mx-auto px-4 text-center">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">© 2024 Chess Trainer.</span>
                <span className="text-gray-600">|</span>
                <span className="text-gray-400">
                  Developed by{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 font-semibold">
                    Shivansh Saxena
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <button
                  onClick={() => handleNavigate('home')}
                  className="hover:text-white transition-colors"
                >
                  Home
                </button>
                <button
                  onClick={() => handleNavigate('about')}
                  className="hover:text-white transition-colors"
                >
                  About
                </button>
                <button
                  onClick={() => handleNavigate('playground')}
                  className="hover:text-white transition-colors"
                >
                  Play Chess
                </button>
              </div>
            </div>
          </div>
        </motion.footer>
      )}
    </div>
  );
}
