import React from 'react';

type WithChildren = {
  children: React.ReactNode;
  className?: string;
};

const MovingBorder = ({ children, className = "" }: WithChildren) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-slate-900/50 backdrop-blur-sm border border-slate-800 ${className}`}>
      <div className="absolute inset-0 rounded-2xl">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default MovingBorder; 