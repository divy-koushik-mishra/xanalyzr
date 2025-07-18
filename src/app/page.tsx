"use client"
import React from 'react';

// Import all section components
import BackgroundElements from './_components/BackgroundElements';
import Navigation from './_components/Navigation';
import HeroSection from './_components/HeroSection';
import DemoSection from './_components/DemoSection';
import TestimonialsSection from './_components/TestimonialsSection';
import PricingSection from './_components/PricingSection';
import CTASection from './_components/CTASection';
import Footer from './_components/Footer';

export default function XanalyzrLanding() {
  // Animation variants - sped up animations
  const sectionVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };
  
  const staggerContainer = {
    visible: { transition: { staggerChildren: 0.08 } }
  };
  
  const cardVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    hover: { scale: 1.06, rotate: 2, transition: { type: 'spring' as const, stiffness: 300 } }
  };
  
  const statVariant = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
  };
  
  const buttonVariant = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    hover: { scale: 1.08 }
  };
  
  const menuVariant = {
    hidden: { y: -40, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.2 } },
    exit: { y: -40, opacity: 0, transition: { duration: 0.2 } }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background Effects */}
      <BackgroundElements />
      
      {/* Navigation */}
      <Navigation menuVariant={menuVariant} />
      
      {/* Hero Section */}
      <HeroSection
        sectionVariant={sectionVariant}
        staggerContainer={staggerContainer}
        buttonVariant={buttonVariant}
        statVariant={statVariant}
      />
      
      {/* Demo Section */}
      <DemoSection />

      {/* Testimonials Section */}
      <TestimonialsSection />
      
      {/* Pricing Section */}
      <PricingSection
        sectionVariant={sectionVariant}
        staggerContainer={staggerContainer}
        cardVariant={cardVariant}
      />
      
      {/* CTA Section */}
      <CTASection
        sectionVariant={sectionVariant}
        staggerContainer={staggerContainer}
        buttonVariant={buttonVariant}
      />
      
      {/* Footer */}
      <Footer />
    </div>
  );
}