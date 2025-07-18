import React from 'react';
import MovingBorder from '../../components/ui/MovingBorder';
import { PointerHighlight } from '../../components/ui/pointer-highlight';

export default function DemoSection() {
  return (
    <section className="relative z-10 px-6 py-20">
      <div className="max-w-6xl mx-auto">
        <MovingBorder className="group">
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  See Xanalyzr in Action
                </h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Watch how easy it is to upload your spreadsheet and get instant insights with our AI-powered analysis engine.
                </p>
                <div className="space-y-4">
                  {[
                    { text: "Drag & drop Excel files", color: "bg-purple-500" },
                    { text: <PointerHighlight>AI-powered analysis</PointerHighlight>, color: "bg-blue-500" },
                    { text: "Interactive visualizations", color: "bg-cyan-500" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-2 h-2 ${item.color} rounded-full animate-pulse`}></div>
                      <span className="text-gray-300">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-6 border border-slate-800">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded w-1/2 animate-pulse delay-100"></div>
                    <div className="h-4 bg-gradient-to-r from-cyan-500 to-green-500 rounded w-5/6 animate-pulse delay-200"></div>
                    <div className="h-4 bg-gradient-to-r from-green-500 to-purple-500 rounded w-2/3 animate-pulse delay-300"></div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse opacity-20"></div>
              </div>
            </div>
          </div>
        </MovingBorder>
      </div>
    </section>
  );
} 