import React, { useState } from 'react';
import { Cpu, RefreshCw, CheckCircle2, AlertTriangle, BarChart2, ShieldCheck, Check } from 'lucide-react';
import { runFullBenchmark } from '../services/benchmark.js';

export default function DeveloperBenchmark() {
  const [isRunning, setIsRunning] = useState(false);
  const [benchmarkData, setBenchmarkData] = useState(null);

  const handleRunBenchmark = () => {
    setIsRunning(true);
    setTimeout(() => {
      const results = runFullBenchmark();
      setBenchmarkData(results);
      setIsRunning(false);
    }, 300);
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 my-8 transition-colors duration-200">
      <div className="clean-card rounded-2xl p-4 sm:p-6 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                DEVELOPER QA & BENCHMARK SUITE
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">• 300-Message Calibrated Dataset</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Real-Time Explainable Engine Evaluation Matrix
            </h2>
          </div>

          <button
            onClick={handleRunBenchmark}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white dark:text-slate-950 text-xs font-mono font-extrabold transition-all shadow-md shrink-0 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Analyzing Dataset...' : 'Run 300-Message Benchmark'}</span>
          </button>
        </div>

        {/* Results Metrics Dashboard */}
        {benchmarkData ? (
          <div className="space-y-6">
            
            {/* Metric KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 font-mono text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-[9px] text-slate-500 dark:text-slate-400 uppercase font-bold block mb-1">TOTAL DATASET</span>
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">{benchmarkData.totalTests}</span>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl border border-emerald-200 dark:border-emerald-800 text-center">
                <span className="text-[9px] text-emerald-700 dark:text-emerald-400 uppercase font-bold block mb-1">ACCURACY</span>
                <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{benchmarkData.accuracy}%</span>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-950/60 rounded-xl border border-blue-200 dark:border-blue-800 text-center">
                <span className="text-[9px] text-blue-700 dark:text-blue-400 uppercase font-bold block mb-1">PRECISION</span>
                <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400">{benchmarkData.precision}%</span>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-950/60 rounded-xl border border-purple-200 dark:border-purple-800 text-center">
                <span className="text-[9px] text-purple-700 dark:text-purple-400 uppercase font-bold block mb-1">RECALL</span>
                <span className="text-xl font-extrabold text-purple-600 dark:text-purple-400">{benchmarkData.recall}%</span>
              </div>
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl border border-indigo-200 dark:border-indigo-800 text-center">
                <span className="text-[9px] text-indigo-700 dark:text-indigo-400 uppercase font-bold block mb-1">F1 SCORE</span>
                <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">{benchmarkData.f1Score}%</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-[9px] text-amber-700 dark:text-amber-400 uppercase font-bold block mb-1">FALSE POSITIVES</span>
                <span className="text-xl font-extrabold text-amber-600 dark:text-amber-400">{benchmarkData.falsePositives}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-[9px] text-red-700 dark:text-red-400 uppercase font-bold block mb-1">FALSE NEGATIVES</span>
                <span className="text-xl font-extrabold text-red-600 dark:text-red-400">{benchmarkData.falseNegatives}</span>
              </div>
            </div>

            {/* Per-Category Accuracy & Precision Breakdown Table */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white font-mono flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  PER-CATEGORY ACCURACY & PRECISION BREAKDOWN
                </span>
                <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-bold">✓ 7 Categories Evaluated</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-[10px]">
                      <th className="py-2 px-3">CATEGORY</th>
                      <th className="py-2 px-3 text-center">SAMPLE COUNT</th>
                      <th className="py-2 px-3 text-center">ACCURACY</th>
                      <th className="py-2 px-3 text-center">PRECISION</th>
                      <th className="py-2 px-3 text-center">RECALL</th>
                      <th className="py-2 px-3 text-center">FP</th>
                      <th className="py-2 px-3 text-center">FN</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {benchmarkData.categoryResults.map((cat, idx) => (
                      <tr key={idx} className="hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{cat.category}</td>
                        <td className="py-2.5 px-3 text-center text-slate-600 dark:text-slate-300">{cat.total}</td>
                        <td className="py-2.5 px-3 text-center font-bold text-emerald-600 dark:text-emerald-400">{cat.accuracy}%</td>
                        <td className="py-2.5 px-3 text-center text-blue-600 dark:text-blue-400">{cat.precision}%</td>
                        <td className="py-2.5 px-3 text-center text-purple-600 dark:text-purple-400">{cat.recall}%</td>
                        <td className={`py-2.5 px-3 text-center font-bold ${cat.fp > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`}>{cat.fp}</td>
                        <td className={`py-2.5 px-3 text-center font-bold ${cat.fn > 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-400'}`}>{cat.fn}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        ) : (
          <div className="text-center py-8 space-y-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
            <Cpu className="w-10 h-10 text-slate-400 dark:text-slate-500 mx-auto" />
            <p className="text-xs font-mono text-slate-700 dark:text-slate-300 font-bold">Click "Run 300-Message Benchmark" to calculate real Precision, Recall, and Accuracy</p>
          </div>
        )}

      </div>
    </div>
  );
}
