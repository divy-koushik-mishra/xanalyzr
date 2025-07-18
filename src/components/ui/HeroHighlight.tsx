import React from 'react';

type WithChildren = {
  children: React.ReactNode;
  className?: string;
};

const HeroHighlight = ({ children, className = "" }: WithChildren) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-cyan-600/20 blur-3xl"></div>
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default HeroHighlight; 