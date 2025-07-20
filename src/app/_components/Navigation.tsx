"use client";
import React, { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SignUpButton } from "@clerk/nextjs";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import Link from "next/link";

interface NavigationProps {
  menuVariant: {
    hidden: { y: number; opacity: number };
    visible: { y: number; opacity: number; transition: { duration: number } };
    exit: { y: number; opacity: number; transition: { duration: number } };
  };
}

export default function Navigation({ menuVariant }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 px-6 py-4 bg-black/80 backdrop-blur-sm border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-all duration-300">
              <span className="text-white font-bold text-xl">X</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:via-blue-300 group-hover:to-cyan-300 transition-all duration-300 drop-shadow-sm">
              Xanalyzr
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer font-medium"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer font-medium"
            >
              Pricing
            </a>
            <a
              href="#about"
              className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer font-medium"
            >
              About
            </a>
            <SignedOut>
              <SignUpButton>
                <button className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors duration-300 border border-slate-700 cursor-pointer font-medium">
                  Sign In
                </button>
              </SignUpButton>
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 cursor-pointer shadow-lg hover:shadow-purple-500/25">
                Get Started
              </button>
            </SignedOut>
            <SignedIn>
            <Link href="/dashboard" className="bg-gradient-to-r flex items-center gap-2 from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 cursor-pointer shadow-lg hover:shadow-purple-500/25">
                Dashboard <ArrowRight />
              </Link>
              <UserButton />
            </SignedIn>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden absolute top-20 left-0 right-0 bg-black/95 backdrop-blur-sm border-b border-slate-800 z-40"
            variants={menuVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="px-6 py-4 space-y-4">
              <a
                href="#features"
                className="block text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer font-medium"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="block text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer font-medium"
              >
                Pricing
              </a>
              <a
                href="#about"
                className="block text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer font-medium"
              >
                About
              </a>
              <button className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors duration-300 border border-slate-700 cursor-pointer font-medium">
                Sign In
              </button>
              <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 cursor-pointer shadow-lg">
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
