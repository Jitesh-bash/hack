import React, { useState } from "react";
import { ShieldCheck, Menu, X, Sun, Moon } from "lucide-react";

export default function Navbar({
  activeSection,
  setActiveSection,
  onOpenScanner,
  theme = "light",
  toggleTheme,
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (section, elementId) => {
    setActiveSection(section);
    setIsMobileMenuOpen(false);

    setTimeout(() => {
      if (section === 'scanner' && elementId) {
        const el = document.getElementById(elementId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div
          onClick={() => handleNavClick('scanner', 'scanner-section')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="font-bold text-base text-slate-900 dark:text-white tracking-tight block leading-tight">
              PhishGuard
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-normal block leading-none">
              Security
            </span>
          </div>
        </div>

        {/* Center Nav Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 h-full">
          <button
            onClick={() => handleNavClick('scanner', 'scanner-section')}
            className={`h-full border-b-2 font-medium text-sm transition-colors flex items-center cursor-pointer ${
              activeSection === "scanner"
                ? "border-blue-600 text-blue-600 font-semibold dark:text-blue-400 dark:border-blue-400"
                : "border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Scanner
          </button>
          <button
            onClick={() => handleNavClick('scanner', 'demo-section')}
            className={`h-full border-b-2 font-medium text-sm transition-colors flex items-center cursor-pointer ${
              activeSection === "demo"
                ? "border-blue-600 text-blue-600 font-semibold dark:text-blue-400 dark:border-blue-400"
                : "border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Demo
          </button>
          <button
            onClick={() => handleNavClick('how-it-works', 'how-it-works-section')}
            className={`h-full border-b-2 font-medium text-sm transition-colors flex items-center cursor-pointer ${
              activeSection === "how-it-works"
                ? "border-blue-600 text-blue-600 font-semibold dark:text-blue-400 dark:border-blue-400"
                : "border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            How it Works
          </button>
        </nav>

        {/* Right Status & Action */}
        <div className="flex items-center gap-3">
          
          {/* Status Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>System Operational</span>
          </div>

          {/* Single Icon Theme Toggle Button (White Mode vs Dark Mode) */}
          <button
            type="button"
            onClick={toggleTheme}
            title={theme === 'light' ? "Current: White Mode. Click for Dark Mode." : "Current: Dark Mode. Click for White Mode."}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-2 text-xs font-semibold cursor-pointer shadow-sm"
          >
            {theme === 'light' ? (
              <>
                <Sun className="w-4 h-4 text-amber-500" />
                <span>White Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-blue-400" />
                <span>Dark Mode</span>
              </>
            )}
          </button>

          {/* Primary CTA */}
          <button
            onClick={() => handleNavClick('scanner', 'scanner-section')}
            className="blue-btn px-4 py-2 rounded-lg text-xs font-semibold shadow-sm hidden sm:flex items-center gap-1.5 cursor-pointer"
          >
            <span>Open Scanner</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-2 shadow-lg">
          <button
            onClick={() => handleNavClick('scanner', 'scanner-section')}
            className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600"
          >
            Scanner
          </button>
          <button
            onClick={() => handleNavClick('scanner', 'demo-section')}
            className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600"
          >
            Demo
          </button>
          <button
            onClick={() => handleNavClick('how-it-works', 'how-it-works-section')}
            className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600"
          >
            How it Works
          </button>

          {/* Mobile Theme Switcher Row */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Theme Mode</span>
            
            <button
              type="button"
              onClick={toggleTheme}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-semibold flex items-center gap-2"
            >
              {theme === 'light' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>White Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-blue-400" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>System Operational</span>
            </div>
            <button
              onClick={() => handleNavClick('scanner', 'scanner-section')}
              className="blue-btn px-4 py-2 rounded-lg text-xs font-semibold shadow-sm"
            >
              Open Scanner
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
