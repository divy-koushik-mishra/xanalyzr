import React from 'react';
import { motion } from 'framer-motion';
import GlowingCard from '../../components/ui/GlowingCard';
import MovingBorder from '../../components/ui/MovingBorder';

interface PricingSectionProps {
  sectionVariant: {
    hidden: { opacity: number; y: number };
    visible: { opacity: number; y: number; transition: { duration: number } };
  };
  staggerContainer: {
    visible: { transition: { staggerChildren: number } };
  };
  cardVariant: {
    hidden: { opacity: number; y: number };
    visible: { opacity: number; y: number; transition: { duration: number } };
    hover: { scale: number; rotate: number; transition: { type: 'spring'; stiffness: number } };
  };
}

export default function PricingSection({
  sectionVariant,
  staggerContainer,
  cardVariant
}: PricingSectionProps) {
  return (
    <motion.section
      id="pricing"
      className="relative z-10 px-6 py-20"
      variants={sectionVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Simple, Transparent Pricing
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent block">
              For Every Team
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Choose the plan that fits your needs. No hidden fees, cancel anytime.
          </p>
        </div>
        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {/* Free Plan */}
          <motion.div variants={cardVariant} whileHover="hover" className="h-full">
            <GlowingCard className="h-full">
              <div className="p-8 h-full flex flex-col items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg mb-6 flex items-center justify-center">
                  <span className="text-2xl font-bold">Free</span>
                </div>
                <div className="text-4xl font-bold mb-2 text-white">$0</div>
                <div className="text-gray-400 mb-6">For individuals getting started</div>
                <ul className="text-gray-300 space-y-2 mb-8 text-left w-full max-w-xs mx-auto">
                  <li>✔️ 1 Project</li>
                  <li>✔️ 1000 rows/month</li>
                  <li>✔️ Basic charts</li>
                  <li>✔️ Community support</li>
                </ul>
                <button className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 rounded-lg text-lg font-medium text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-300 w-full cursor-pointer">Get Started</button>
              </div>
            </GlowingCard>
          </motion.div>
          
          {/* Pro Plan */}
          <motion.div variants={cardVariant} whileHover="hover" className="h-full">
            <MovingBorder className="h-full group">
              <div className="p-8 h-full flex flex-col items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg mb-6 flex items-center justify-center">
                  <span className="text-2xl font-bold">Pro</span>
                </div>
                <div className="text-4xl font-bold mb-2 text-white">$19<span className="text-lg font-normal text-gray-400">/mo</span></div>
                <div className="text-gray-400 mb-6">For professionals & small teams</div>
                <ul className="text-gray-300 space-y-2 mb-8 text-left w-full max-w-xs mx-auto">
                  <li>✔️ 10 Projects</li>
                  <li>✔️ 100,000 rows/month</li>
                  <li>✔️ Advanced analytics</li>
                  <li>✔️ Priority email support</li>
                </ul>
                <button className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3 rounded-lg text-lg font-medium text-white hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 w-full cursor-pointer">Start Pro Trial</button>
              </div>
            </MovingBorder>
          </motion.div>
          
          {/* Enterprise Plan */}
          <motion.div variants={cardVariant} whileHover="hover" className="h-full">
            <GlowingCard className="h-full">
              <div className="p-8 h-full flex flex-col items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mb-6 flex items-center justify-center">
                  <span className="text-2xl font-bold">Enterprise</span>
                </div>
                <div className="text-4xl font-bold mb-2 text-white">Custom</div>
                <div className="text-gray-400 mb-6">For large organizations & enterprises</div>
                <ul className="text-gray-300 space-y-2 mb-8 text-left w-full max-w-xs mx-auto">
                  <li>✔️ Unlimited projects</li>
                  <li>✔️ Unlimited rows</li>
                  <li>✔️ Dedicated account manager</li>
                  <li>✔️ SOC 2 & SSO</li>
                </ul>
                <button className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 rounded-lg text-lg font-medium text-white hover:from-purple-700 hover:to-pink-700 transition-all duration-300 w-full cursor-pointer">Contact Sales</button>
              </div>
            </GlowingCard>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
} 