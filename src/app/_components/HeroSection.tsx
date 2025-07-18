import React from 'react';
import { Play, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import HeroHighlight from '../../components/ui/HeroHighlight';
import TypewriterEffect from '../../components/ui/TypewriterEffect';
import { PointerHighlight } from '../../components/ui/pointer-highlight';

interface HeroSectionProps {
  sectionVariant: {
    hidden: { opacity: number; y: number };
    visible: { opacity: number; y: number; transition: { duration: number } };
  };
  staggerContainer: {
    visible: { transition: { staggerChildren: number } };
  };
  buttonVariant: {
    hidden: { opacity: number; y: number };
    visible: { opacity: number; y: number; transition: { duration: number } };
    hover: { scale: number };
  };
  statVariant: {
    hidden: { opacity: number; scale: number };
    visible: { opacity: number; scale: number; transition: { duration: number } };
  };
}

export default function HeroSection({
  sectionVariant,
  staggerContainer,
  buttonVariant,
  statVariant
}: HeroSectionProps) {
  const stats = [
    { value: "10K+", label: "Files Processed" },
    { value: "5M+", label: "Data Points Analyzed" },
    { value: "99.9%", label: "Accuracy" },
    { value: "24/7", label: "Support" }
  ];

  return (
    <motion.section
      className="relative z-10 px-6 py-5"
      variants={sectionVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="max-w-7xl mx-auto text-center">
        {/* Subheading for context */}
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-full text-sm font-medium text-purple-300 mb-6">
            🚀 AI-Powered Excel Analytics
          </span>
        </motion.div>

        <HeroHighlight className="mb-8">
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            Turn 
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              <TypewriterEffect text=" Spreadsheets " />
            </span>
            Into 
            <div className="w-full flex justify-center mt-2">
              <PointerHighlight>Smart Insights</PointerHighlight>
            </div>
            <span className="text-2xl block mt-4 text-gray-300">
              —In Seconds
            </span>
          </motion.h1>
        </HeroHighlight>
        
        <motion.p
          className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          Upload, analyze, and visualize Excel data instantly with AI-powered insights. 
          Save hours of manual work and make data-driven decisions faster.
        </motion.p>
        
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Primary CTA - Enhanced */}
          <motion.button
            className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-lg text-lg font-semibold text-white hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 cursor-pointer shadow-lg hover:shadow-purple-500/25"
            variants={buttonVariant}
            whileHover="hover"
          >
            <span className="relative z-10 flex items-center gap-2">
              👉 Start Free Trial
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </motion.button>
          
          {/* Secondary CTA - Toned down */}
          <motion.button
            className="group flex items-center space-x-2 border border-slate-600 px-8 py-4 rounded-lg text-lg font-medium text-gray-300 hover:bg-slate-800/50 hover:border-slate-500 transition-all duration-300 cursor-pointer"
            variants={buttonVariant}
            whileHover="hover"
          >
            <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            <span>🎥 Watch Demo</span>
          </motion.button>
        </motion.div>

        {/* Microcopy under CTA */}
        <motion.p
          className="text-sm text-gray-400 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          No credit card required
        </motion.p>

        {/* Trust Stats - Moved up and enhanced */}
        <motion.div
          className="flex flex-wrap justify-center items-center gap-4 md:gap-8 max-w-4xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {stats.map((stat, index) => (
            <motion.div key={index} className="group" variants={statVariant}>
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
} 