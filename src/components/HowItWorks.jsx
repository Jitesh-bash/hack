import React from 'react';
import { Upload, Cpu, ShieldAlert, Share2, Search } from 'lucide-react';
import DetectionQualityDashboard from './DetectionQualityDashboard';
import DeveloperBenchmark from './DeveloperBenchmark';

export default function HowItWorks({ onGoToScanner }) {
  return (
    <div id="how-it-works-section" className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 transition-colors duration-200">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-semibold uppercase font-mono">
          <span>STEP-BY-STEP WORKFLOW GUIDE & DEVELOPER BENCHMARKS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          How PhishGuard Security Works
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          PhishGuard AI features a generalized behavioral threat detection engine, 300-message benchmark QA suite, and synthetic quality matrix.
        </p>
      </div>

      {/* 4 Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Step 1 */}
        <div className="clean-card rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-full border border-blue-100 dark:border-blue-800">
                STEP 01
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">1. Submit Suspicious Content</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Upload a screenshot of a WhatsApp chat or email (e.g. fake job offer), paste raw message text, or enter a website link to scan.
            </p>
          </div>
          <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            Accepts: PNG, JPG, WEBP screenshots, SMS text, or .xyz/.online links
          </div>
        </div>

        {/* Step 2 */}
        <div className="clean-card rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-100 dark:border-purple-800 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-1 rounded-full border border-purple-100 dark:border-purple-800">
                STEP 02
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">2. Generalized Behavioral Signal Inspection</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              In-browser OCR (Tesseract.js) extracts image text. The generalized signal engine evaluates payment traps, urgency pressure, and domain mismatches across 10 taxonomy categories.
            </p>
          </div>
          <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            Features: 10 Threat Taxonomies + Weighted Signal Correlation Engine
          </div>
        </div>

        {/* Step 3 */}
        <div className="clean-card rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60 px-2.5 py-1 rounded-full border border-red-100 dark:border-red-800">
                STEP 03
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">3. Explainable Threat Assessment</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Receive a clear 0-100% Risk Score, point breakdown card ("Why flagged?"), domain mismatch callouts, and actionable defense recommendations ("Do NOT pay deposit").
            </p>
          </div>
          <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            Output: Risk Meter Gauge + Why Flagged Card + Action Advice
          </div>
        </div>

        {/* Step 4 */}
        <div className="clean-card rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Share2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-800">
                STEP 04
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">4. Protect Your Community</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Share verified threat reports to alert classmates, family, and colleagues before others fall victim to impersonation scams.
            </p>
          </div>
          <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            Action: 1-Click Copy Threat Report Card & Share Warning
          </div>
        </div>

      </div>

      {/* Developer Quality Dashboards Embedded */}
      <div className="space-y-8 pt-4">
        <DetectionQualityDashboard />
        <DeveloperBenchmark />
      </div>

      {/* Bottom CTA */}
      <div className="text-center pt-4">
        <button
          onClick={onGoToScanner}
          className="blue-btn px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold shadow-md inline-flex items-center gap-2 cursor-pointer"
        >
          <Search className="w-4 h-4" />
          <span>Launch Threat Scanner Now</span>
        </button>
      </div>

    </div>
  );
}
