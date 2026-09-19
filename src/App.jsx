import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Scanner from './components/Scanner';
import DemoHub from './components/DemoHub';
import HowItWorks from './components/HowItWorks';
import AnalysisResult from './components/AnalysisResult';
import SafetyGuide from './components/SafetyGuide';
import Footer from './components/Footer';
import { analyzeThreatWithGemini } from './services/gemini';

export default function App() {
  const [activeSection, setActiveSection] = useState('scanner'); // 'scanner' | 'demo' | 'how-it-works'
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [apiKey, setApiKey] = useState('');
  
  // Theme state: ALWAYS defaults to 'light' (white) mode on load
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleAnalyze = async (input, inputType) => {
    setIsLoading(true);
    setAnalysisResult(null);

    try {
      const result = await analyzeThreatWithGemini(input, inputType, apiKey);
      setAnalysisResult(result);
    } catch (err) {
      console.error("Threat Analysis Error:", err);
      alert("Failed to analyze content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSample = (sample) => {
    setAnalysisResult(sample.mockResult);
    setActiveSection('scanner');
    setTimeout(() => {
      const resultElem = document.getElementById('analysis-result-section') || document.getElementById('scanner-section');
      if (resultElem) {
        resultElem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const handleReset = () => {
    setAnalysisResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScanClick = () => {
    setActiveSection('scanner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDemoClick = () => {
    setActiveSection('demo');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#090d16] text-slate-100' : 'bg-[#f8fafc] text-slate-900'} flex flex-col font-sans selection:bg-blue-500 selection:text-white transition-colors duration-200 relative overflow-x-hidden`}>
      
      {/* Subtle Light Mode Color Essence Ambient Glows (Soft cool blue/indigo cyber aura) */}
      {theme !== 'dark' && (
        <>
          <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-blue-100/40 via-indigo-50/25 to-transparent pointer-events-none -z-10" />
          <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[1000px] h-[360px] bg-gradient-to-r from-blue-400/8 via-cyan-400/5 to-indigo-400/8 blur-3xl pointer-events-none -z-10 rounded-full" />
        </>
      )}

      {/* HEADER */}
      <Navbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onOpenScanner={handleScanClick}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1">
        
        {/* VIEW 1: SCANNER & HOME (Exact Hierarchy Order: HERO -> SCANNER -> ANALYSIS RESULT -> DEMO HUB -> SAFETY PRINCIPLES) */}
        {activeSection === 'scanner' && (
          <>
            {/* COMPACT HERO */}
            <Hero
              onScanClick={handleScanClick}
              onDemoClick={handleDemoClick}
            />

            {/* THREAT SCANNER */}
            <Scanner
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
              apiKey={apiKey}
              setApiKey={setApiKey}
            />

            {/* ANALYSIS RESULT */}
            {analysisResult && (
              <AnalysisResult result={analysisResult} onReset={handleReset} />
            )}

            {/* DEMO HUB - FEATURED (3 CARDS) */}
            <DemoHub
              onSelectSample={handleSelectSample}
              onOpenLibrary={handleDemoClick}
              featuredOnly={true}
            />

            {/* SAFETY PRINCIPLES */}
            <SafetyGuide />
          </>
        )}

        {/* VIEW 2: DEDICATED BENCHMARK LIBRARY PAGE */}
        {activeSection === 'demo' && (
          <div className="py-4">
            <DemoHub
              onSelectSample={handleSelectSample}
              onOpenLibrary={handleScanClick}
              featuredOnly={false}
            />
          </div>
        )}

        {/* VIEW 3: DEDICATED HOW IT WORKS PAGE */}
        {activeSection === 'how-it-works' && (
          <HowItWorks onGoToScanner={handleScanClick} />
        )}

      </main>

      {/* FOOTER */}
      <Footer setActiveSection={setActiveSection} />

    </div>
  );
}
