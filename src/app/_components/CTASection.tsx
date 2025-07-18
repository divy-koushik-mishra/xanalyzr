import React from 'react';
import { motion } from 'framer-motion';
import MovingBorder from '../../components/ui/MovingBorder';

interface CTASectionProps {
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
}

export default function CTASection({
  sectionVariant,
  staggerContainer,
  buttonVariant
}: CTASectionProps) {
  return (
    <motion.section
      className="relative z-10 px-6 py-20"
      variants={sectionVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <MovingBorder className="group">
          <div className="p-12">
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              Ready to Transform Your Data?
            </motion.h2>
            <motion.p
              className="text-xl text-gray-300 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              Join thousands of professionals who trust Xanalyzr to turn their spreadsheets into powerful insights.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.button
                className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 rounded-lg text-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 cursor-pointer"
                variants={buttonVariant}
                whileHover="hover"
              >
                Start Free Trial
              </motion.button>
              <motion.button
                className="border border-slate-600 px-8 py-4 rounded-lg text-lg font-medium hover:bg-slate-800/50 transition-all duration-300 cursor-pointer"
                variants={buttonVariant}
                whileHover="hover"
              >
                Schedule Demo
              </motion.button>
            </motion.div>
            <motion.p
              className="text-gray-400 mt-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              No credit card required • 14-day free trial • Cancel anytime
            </motion.p>
          </div>
        </MovingBorder>
      </div>
    </motion.section>
  );
} 