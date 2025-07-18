import React from 'react';

type WithChildren = {
  children: React.ReactNode;
  className?: string;
};

const GlowingCard = ({ children, className = "" }: WithChildren) => {
  return (
    <div className={`group relative ${className}`}>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
      <div className="relative bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl">
        {children}
      </div>
    </div>
  );
};

export default GlowingCard; 