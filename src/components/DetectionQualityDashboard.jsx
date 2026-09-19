import React, { useState } from 'react';
import { Cpu, ShieldCheck, AlertTriangle, CheckCircle2, RefreshCw, BarChart2, Check, FileText } from 'lucide-react';
import { generateSyntheticTestMatrix } from '../services/syntheticGenerator.js';
import { processSignalCorrelation } from '../services/signalEngine.js';

export default function DetectionQualityDashboard() {
  const [matrixSize, setMatrixSize] = useState(400);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState(null);

  const runEvaluation = () => {
    setIsRunning(true);
    setTimeout(() => {
      const matrix = generateSyntheticTestMatrix(matrixSize);

      let totalTests = matrix.length;
      let truePositives = 0;
      let trueNegatives = 0;
      let falsePositives = 0;
      let falseNegatives = 0;

      const falseNegativeCases = [];
      const falsePositiveCases = [];

      for (const item of matrix) {
        const result = processSignalCorrelation(item.message);
        const isExpectedSafe = item.expectedRisk === 'SAFE';
        const isActualSafe = result.riskScore < 25;

        if (isExpectedSafe && isActualSafe) {
          trueNegatives++;
        } else if (!isExpectedSafe && !isActualSafe) {
          truePositives++;
        } else if (isExpectedSafe && !isActualSafe) {
          falsePositives++;
          falsePositiveCases.push({
            id: item.id,
            category: item.categoryName,
            message: item.message,
            expectedRisk: item.expectedRisk,
            actualScore: result.riskScore,
            actualLevel: result.riskLevel
          });
        } else if (!isExpectedSafe && isActualSafe) {
          falseNegatives++;
          falseNegativeCases.push({
            id: item.id,
            category: item.categoryName,
            message: item.message,
            expectedRisk: item.expectedRisk,
            actualScore: result.riskScore,
            actualLevel: result.riskLevel
          });
        }
      }

      const precision = truePositives + falsePositives > 0 ? (truePositives / (truePositives + falsePositives)) * 100 : 100;
      const recall = truePositives + falseNegatives > 0 ? (truePositives / (truePositives + falseNegatives)) * 100 : 100;
      const f1Score = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 100;

      setTestResults({
        totalTests,
        truePositives,
        trueNegatives,
        falsePositives,
        falseNegatives,
        precision,
        recall,
        f1Score,
        falseNegativeCases,
        falsePositiveCases
      });
      setIsRunning(false);
    }, 400);
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 my-8">
      <div className="clean-card rounded-2xl p-4 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800 flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                DETECTION QUALITY DASHBOARD
              </span>
              <span className="text-xs text-slate-400 font-mono">• Continuous Quality Assurance</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Generalized Detection Matrix & Quality Metrics
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={matrixSize}
              onChange={(e) => setMatrixSize(Number(e.target.value))}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold"
            >
              <option value={100}>100 Test Matrix</option>
              <option value={400}>400 Test Matrix</option>
              <option value={1000}>1,000 Test Matrix</option>
            </select>

            <button
              onClick={runEvaluation}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-md shrink-0 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? 'Running Matrix...' : 'Run Test Suite'}</span>
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        {testResults ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 font-mono text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-[9px] text-slate-400 uppercase font-bold block">TOTAL TESTS</span>
                <span className="text-lg font-extrabold text-slate-900 dark:text-white">{testResults.totalTests}</span>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl border border-emerald-200 dark:border-emerald-800 text-center">
                <span className="text-[9px] text-emerald-700 dark:text-emerald-300 uppercase font-bold block">TRUE POSITIVES</span>
                <span className="text-lg font-extrabold text-emerald-700 dark:text-emerald-300">{testResults.truePositives}</span>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-950/60 rounded-xl border border-blue-200 dark:border-blue-800 text-center">
                <span className="text-[9px] text-blue-700 dark:text-blue-300 uppercase font-bold block">TRUE NEGATIVES</span>
                <span className="text-lg font-extrabold text-blue-700 dark:text-blue-300">{testResults.trueNegatives}</span>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-950/60 rounded-xl border border-amber-200 dark:border-amber-800 text-center">
                <span className="text-[9px] text-amber-800 dark:text-amber-300 uppercase font-bold block">FALSE POSITIVES</span>
                <span className="text-lg font-extrabold text-amber-800 dark:text-amber-300">{testResults.falsePositives}</span>
              </div>
              <div className="p-3 bg-red-50 dark:bg-red-950/60 rounded-xl border border-red-200 dark:border-red-800 text-center">
                <span className="text-[9px] text-red-700 dark:text-red-300 uppercase font-bold block">FALSE NEGATIVES</span>
                <span className="text-lg font-extrabold text-red-700 dark:text-red-300">{testResults.falseNegatives}</span>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-950/60 rounded-xl border border-purple-200 dark:border-purple-800 text-center">
                <span className="text-[9px] text-purple-700 dark:text-purple-300 uppercase font-bold block">PRECISION</span>
                <span className="text-lg font-extrabold text-purple-800 dark:text-purple-300">{testResults.precision.toFixed(1)}%</span>
              </div>
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl border border-indigo-200 dark:border-indigo-800 text-center">
                <span className="text-[9px] text-indigo-700 dark:text-indigo-300 uppercase font-bold block">F1 SCORE</span>
                <span className="text-lg font-extrabold text-indigo-800 dark:text-indigo-300">{testResults.f1Score.toFixed(1)}%</span>
              </div>
            </div>

            {/* False Negatives Diagnostic List */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
                <span className="text-xs font-bold text-slate-900 dark:text-white font-mono flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  FALSE NEGATIVE DIAGNOSTIC LOG (MISSED THREATS)
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">
                  {testResults.falseNegatives} CASES REQUIRING ATTENTION
                </span>
              </div>

              {testResults.falseNegatives === 0 ? (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>PERFECT DETECTOR ACCURACY: Zero false negatives across all {testResults.totalTests} synthetic matrix scenarios!</span>
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {testResults.falseNegativeCases.map((fn, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-red-200 dark:border-red-800 space-y-1 text-xs">
                      <div className="flex justify-between font-mono">
                        <span className="font-bold text-slate-900 dark:text-white">[{fn.id}] {fn.category}</span>
                        <span className="text-red-600 dark:text-red-400 font-bold">Expected: {fn.expectedRisk} | Actual: {fn.actualScore}/100 ({fn.actualLevel})</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 font-mono text-[11px]">"{fn.message}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 space-y-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
            <BarChart2 className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-xs font-mono text-slate-600 dark:text-slate-400 font-bold">Click "Run Test Suite" to evaluate the 400-scenario generalized matrix</p>
          </div>
        )}

      </div>
    </div>
  );
}

