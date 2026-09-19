import React from 'react';
import { ShieldCheck, CheckCircle2, Globe, PhoneCall } from 'lucide-react';

export default function SafetyGuide() {
  return (
    <div id="safety-principles-section" className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 my-4 mb-8 transition-colors duration-200">
      <div className="clean-card rounded-2xl p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        
        {/* Title Header */}
        <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
              Student Safety Principles
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Essential guidance for evaluating digital communications and verifying suspicious requests.
            </p>
          </div>
        </div>

        {/* 3 Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Principle 1 */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-400 font-mono">
              <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>1. VERIFY BEFORE PAYING</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Unexpected upfront payment requests are a major warning sign. Fees, deposits or registration payments should be independently verified through an official employer channel before paying or sharing information.
            </p>
          </div>

          {/* Principle 2 */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-400 font-mono">
              <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>2. CHECK THE DOMAIN</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Inspect the actual web domain in your browser address bar instead of trusting the logo, display name or message branding.
            </p>
          </div>

          {/* Principle 3 */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-400 font-mono">
              <PhoneCall className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>3. REPORT QUICKLY</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              If money or sensitive information has been lost, contact the appropriate financial institution or cybercrime reporting channel promptly (National Helpline: <strong className="font-mono text-slate-900 dark:text-white font-bold">1930</strong> / <strong className="text-blue-700 dark:text-blue-400">cybercrime.gov.in</strong>).
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
