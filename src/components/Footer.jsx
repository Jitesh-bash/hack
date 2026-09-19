import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function Footer({ setActiveSection }) {
  const scrollToSection = (section, elementId) => {
    if (setActiveSection) setActiveSection(section);
    setTimeout(() => {
      const el = document.getElementById(elementId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <footer className="w-full bg-[#090d16] text-slate-400 py-8 border-t border-slate-800 text-xs font-sans">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Footer Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Brand (md:col-span-6) */}
          <div className="md:col-span-6 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm text-white tracking-tight">PhishGuard Security</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Explainable threat inspection for everyday users.
            </p>
          </div>

          {/* Column 2: PRODUCT (md:col-span-3) */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-200">PRODUCT</h4>
            <ul className="space-y-1.5 text-xs font-medium">
              <li>
                <button
                  onClick={() => scrollToSection('scanner', 'scanner-section')}
                  className="text-slate-400 hover:text-white transition-colors text-left cursor-pointer"
                >
                  Scanner
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('scanner', 'demo-section')}
                  className="text-slate-400 hover:text-white transition-colors text-left cursor-pointer"
                >
                  Demo
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: SECURITY (md:col-span-3) */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-200">SECURITY</h4>
            <ul className="space-y-1.5 text-xs font-medium">
              <li>
                <button
                  onClick={() => scrollToSection('scanner', 'scanner-section')}
                  className="text-slate-400 hover:text-white transition-colors text-left cursor-pointer"
                >
                  Threat Intelligence
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('scanner', 'safety-principles-section')}
                  className="text-slate-400 hover:text-white transition-colors text-left cursor-pointer"
                >
                  Safety Principles
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar & Security Disclaimer */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>System Operational</span>
            </div>

            <span className="text-slate-400 font-medium">
              © 2026 PhishGuard Security
            </span>
          </div>

          <p className="text-slate-500 text-[10px] leading-relaxed max-w-xl md:text-right">
            Disclaimer: PhishGuard AI provides explainable risk assessments for educational and decision-support purposes. Report financial loss to official helplines (1930 / cybercrime.gov.in).
          </p>

        </div>

      </div>
    </footer>
  );
}
