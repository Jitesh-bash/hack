import React from 'react';
import { Scan, Check, ShieldCheck, Activity } from 'lucide-react';

export default function Hero({ onScanClick, onDemoClick }) {
  return (
    <section className="pt-3 sm:pt-4 pb-3 max-w-[1280px] mx-auto px-3 sm:px-6 lg:px-8">
      <div className="clean-card rounded-2xl p-4 sm:p-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center transition-colors duration-200">
        
        {/* Left 7 Columns: Headline & CTAs */}
        <div className="lg:col-span-7 space-y-3.5 sm:space-y-4">
          
          {/* Eyebrow */}
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-[10px] sm:text-xs font-semibold font-mono tracking-wide uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>AI-POWERED THREAT INSPECTION</span>
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl xs:text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.18]">
            Stop scams before they cost you.
          </h1>

          {/* Supporting Text */}
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
            Inspect suspicious WhatsApp messages, internship offers, emails, SMS messages and phishing links with one intelligent security workspace.
          </p>

          {/* CTAs */}
          <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2.5 sm:gap-3 pt-1">
            <button
              onClick={onScanClick}
              className="blue-btn px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-xs shadow-sm flex items-center justify-center gap-2 w-full xs:w-auto cursor-pointer"
            >
              <Scan className="w-4 h-4 shrink-0" />
              <span>Scan a suspicious message</span>
            </button>

            <button
              onClick={onDemoClick}
              className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs px-4 sm:px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors text-center w-full xs:w-auto cursor-pointer"
            >
              <span>View demo scenarios</span>
            </button>
          </div>

          {/* Feature List Under CTAs */}
          <div className="pt-2 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] sm:text-xs font-medium text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 font-bold shrink-0" />
              <span>Screenshot analysis</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 font-bold shrink-0" />
              <span>URL inspection</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 font-bold shrink-0" />
              <span>OCR extraction</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 font-bold shrink-0" />
              <span>Explainable reports</span>
            </div>
          </div>

        </div>

        {/* Right 5 Columns: Threat Engine Console Panel */}
        <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-950/80 rounded-xl p-3.5 sm:p-4 border border-slate-200 dark:border-slate-800 space-y-2.5 sm:space-y-3 font-mono text-xs">
          
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">THREAT ENGINE</span>
            </div>
            <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
              <span>SYSTEM OPERATIONAL</span>
            </div>
          </div>

          {/* Console Status Table */}
          <div className="space-y-1.5 sm:space-y-2 text-[11px] sm:text-xs">
            <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 gap-2">
              <span className="text-slate-700 dark:text-slate-300 font-medium font-sans truncate">Analysis Engine</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[10px] sm:text-[11px] shrink-0">● Operational</span>
            </div>

            <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 gap-2">
              <span className="text-slate-700 dark:text-slate-300 font-medium font-sans truncate">OCR Engine</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[10px] sm:text-[11px] shrink-0">● Operational</span>
            </div>

            <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 gap-2">
              <span className="text-slate-700 dark:text-slate-300 font-medium font-sans truncate">Domain Inspector</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[10px] sm:text-[11px] shrink-0">● Operational</span>
            </div>

            <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 gap-2">
              <span className="text-slate-700 dark:text-slate-300 font-medium font-sans truncate">Threat Database</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[10px] sm:text-[11px] shrink-0">● Ready</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
