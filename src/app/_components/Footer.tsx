import React from 'react';

export default function Footer() {
  const footerSections = [
    {
      title: "Product",
      links: ["Features", "Pricing", "Security", "API"]
    },
    {
      title: "Company", 
      links: ["About", "Blog", "Careers", "Contact"]
    },
    {
      title: "Support",
      links: ["Help Center", "Documentation", "Community", "Status"]
    }
  ];

  return (
    <footer className="relative z-10 px-6 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">X</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Xanalyzr
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Transform your spreadsheets into actionable insights with AI-powered analysis.
            </p>
          </div>
          
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold mb-4 text-white">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Xanalyzr. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 