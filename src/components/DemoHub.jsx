import React, { useState, useMemo } from 'react';
import { SAMPLE_SCAMS } from '../data/sampleScams';
import {
  Mail,
  Briefcase,
  FileText,
  Link2,
  ShieldAlert,
  Search,
  X,
  LayoutGrid,
  List,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Filter,
  Sparkles
} from 'lucide-react';
import { evaluateExplainableThreat } from '../services/riskEngine';

export default function DemoHub({ onSelectSample, onOpenLibrary, featuredOnly = false }) {
  const [simulatingId, setSimulatingId] = useState(null);
  const [simStep, setSimStep] = useState(0);

  // Search & Filter state for full Benchmark Library
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRiskTier, setSelectedRiskTier] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Pick 3 high-impact, diverse featured scenarios for the main page section
  const FEATURED_IDS = ['legit-internship-confirmation', 'fake-recruiter', 'fake-bank-kyc'];
  const featuredScams = useMemo(() => {
    return SAMPLE_SCAMS.filter((s) => FEATURED_IDS.includes(s.id));
  }, []);

  // Category list extraction
  const categories = useMemo(() => {
    const set = new Set(SAMPLE_SCAMS.map((s) => s.category));
    return ['All', ...Array.from(set)];
  }, []);

  // Filter logic for full Benchmark Library
  const filteredScams = useMemo(() => {
    return SAMPLE_SCAMS.filter((sample) => {
      // 1. Text Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = sample.title.toLowerCase().includes(q);
        const matchesContent = sample.content.toLowerCase().includes(q);
        const matchesCategory = sample.category.toLowerCase().includes(q);
        const matchesKeySignals = sample.keySignals ? sample.keySignals.toLowerCase().includes(q) : false;
        if (!matchesTitle && !matchesContent && !matchesCategory && !matchesKeySignals) {
          return false;
        }
      }

      // 2. Category Filter
      if (selectedCategory !== 'All' && sample.category !== selectedCategory) {
        return false;
      }

      // 3. Status Filter (Safe vs Threat)
      if (selectedStatus === 'SAFE' && sample.expectedClassification !== 'SAFE') {
        return false;
      }
      if (selectedStatus === 'THREAT' && sample.expectedClassification === 'SAFE') {
        return false;
      }

      // 4. Risk Tier Filter
      if (selectedRiskTier !== 'All') {
        const evalResult = evaluateExplainableThreat(sample.content);
        if (selectedRiskTier === 'SAFE' && evalResult.riskScore >= 20) return false;
        if (selectedRiskTier === 'LOW' && (evalResult.riskScore < 20 || evalResult.riskScore >= 40)) return false;
        if (selectedRiskTier === 'MODERATE' && (evalResult.riskScore < 40 || evalResult.riskScore >= 60)) return false;
        if (selectedRiskTier === 'HIGH' && (evalResult.riskScore < 60 || evalResult.riskScore >= 80)) return false;
        if (selectedRiskTier === 'CRITICAL' && evalResult.riskScore < 80) return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedRiskTier, selectedStatus]);

  const getPillStyle = (category) => {
    if (category.includes("Education") || category.includes("Scholarship")) {
      return "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800";
    }
    if (category.includes("Jobs")) {
      return "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800";
    }
    if (category.includes("Government") || category.includes("Banking")) {
      return "bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800";
    }
    if (category.includes("WhatsApp") || category.includes("Social")) {
      return "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
    }
    return "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800";
  };

  const getCardIcon = (id) => {
    if (id.includes("college") || id.includes("legit") || id.includes("scholarship")) return <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
    if (id.includes("job") || id.includes("internship") || id.includes("recruiter")) return <Briefcase className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
    if (id.includes("bank") || id.includes("gov") || id.includes("kyc")) return <FileText className="w-4 h-4 text-orange-600 dark:text-orange-400" />;
    return <Link2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
  };

  const getRiskBadgeStyle = (score) => {
    if (score < 20) return "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 font-semibold";
    if (score < 40) return "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 font-semibold";
    if (score < 60) return "bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800 font-semibold";
    if (score < 80) return "bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800 font-semibold";
    return "bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 border-red-300 dark:border-red-800 font-bold";
  };

  const handleRunSimulation = (sample) => {
    setSimulatingId(sample.id);
    setSimStep(1);

    setTimeout(() => setSimStep(2), 80);
    setTimeout(() => setSimStep(3), 160);
    setTimeout(() => setSimStep(4), 240);
    setTimeout(() => setSimStep(5), 320);

    setTimeout(() => {
      const liveResult = evaluateExplainableThreat(sample.content);
      const sampleWithDemoTag = {
        ...sample,
        mockResult: {
          ...liveResult,
          isDemoScenario: true,
          expectedRiskRange: sample.expectedRiskRange,
          expectedClassification: sample.expectedClassification
        }
      };
      onSelectSample(sampleWithDemoTag);
      setSimulatingId(null);
      setSimStep(0);
    }, 450);
  };

  // =========================================================================
  // MODE 1: FEATURED BENCHMARKS (Used on Main Scanner Page: Exactly 3 Cards)
  // =========================================================================
  if (featuredOnly) {
    return (
      <section id="demo-section" className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 my-8 space-y-6 transition-colors duration-200">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Test PhishGuard
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
              Try realistic messages across internships, banking, education, delivery and WhatsApp.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenLibrary}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 hover:underline shrink-0 cursor-pointer"
          >
            <span>View all 30 benchmarks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Exactly 3 Featured Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featuredScams.map((sample, idx) => {
            const evalResult = evaluateExplainableThreat(sample.content);
            const isSimulating = simulatingId === sample.id;
            const ordinal = idx === 0 ? "1st" : idx === 1 ? "2nd" : "3rd";
            const cleanTitle = sample.title.replace(/^\d+\.\s*/, '');

            return (
              <div
                key={sample.id}
                className="clean-card rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all group"
              >
                <div className="space-y-3">
                  {/* Category, Ordinal & Icon */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 group-hover:bg-blue-50 dark:group-hover:bg-slate-700 transition-colors">
                        {getCardIcon(sample.id)}
                      </div>
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        {ordinal}
                      </span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getPillStyle(sample.category)}`}>
                      {sample.category}
                    </span>
                  </div>

                  {/* Title & Short Description */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {ordinal}. {cleanTitle}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 italic">
                      "{sample.content}"
                    </p>
                  </div>
                </div>

                {/* Expected Result & Risk Score */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-500 dark:text-slate-400">
                      Expected: <strong className="text-slate-700 dark:text-slate-200 font-bold">{sample.expectedClassification}</strong>
                    </span>
                    <span className={`px-2 py-0.5 rounded border text-[11px] ${getRiskBadgeStyle(evalResult.riskScore)}`}>
                      {evalResult.riskScore} / 100
                    </span>
                  </div>

                  {/* Simulation Button */}
                  {isSimulating ? (
                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white font-mono text-xs space-y-1.5 border border-slate-200 dark:border-slate-800 shadow-inner">
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-1 text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">
                        <span>ANALYZING THREAT</span>
                        <span className="animate-spin text-blue-600 dark:text-blue-400">⚡</span>
                      </div>
                      <div className="space-y-0.5 text-[10px]">
                        <div className={`flex items-center gap-1.5 ${simStep >= 1 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-600'}`}>
                          <span>{simStep >= 1 ? '✓' : '○'}</span>
                          <span>Extracting behavioral signals</span>
                        </div>
                        <div className={`flex items-center gap-1.5 ${simStep >= 3 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-600'}`}>
                          <span>{simStep >= 3 ? '✓' : '○'}</span>
                          <span>Evaluating compound risk floors</span>
                        </div>
                        <div className={`flex items-center gap-1.5 ${simStep >= 5 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-600'}`}>
                          <span>{simStep >= 5 ? '✓' : '○'}</span>
                          <span>Generating explainable report</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRunSimulation(sample)}
                      className="w-full blue-btn py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm hover:bg-blue-700 transition-all cursor-pointer"
                    >
                      <span>Run Analysis</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Benchmarks Link Button */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={onOpenLibrary}
            className="inline-flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <span>View all 30 benchmarks</span>
            <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </button>
        </div>

      </section>
    );
  }

  // =========================================================================
  // MODE 2: BENCHMARK LIBRARY CONSOLE (Full Professional Browser View)
  // =========================================================================
  return (
    <div id="demo-section" className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 my-6 space-y-6 transition-colors duration-200">
      
      {/* Console Header */}
      <div className="clean-card rounded-2xl p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Benchmark Library
              </h1>
              <span className="text-[10px] font-mono font-bold uppercase bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-2.5 py-0.5 rounded-full">
                30 Calibrated Attack Vectors
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-3xl">
              Explore and run threat analysis against 30 benchmark scenarios across Education, Jobs, Banking, Delivery & WhatsApp.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {onOpenLibrary && (
              <button
                type="button"
                onClick={onOpenLibrary}
                className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                ← Back to Scanner
              </button>
            )}
          </div>
        </div>

        {/* Toolbar Controls: Search + Filters + Grid/List Toggle */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
            
            {/* Search Input */}
            <div className="lg:col-span-4 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search title, content, or category..."
                className="w-full pl-9 pr-8 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-md"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="lg:col-span-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              >
                <option value="All">All Categories ({SAMPLE_SCAMS.length})</option>
                {categories.filter(c => c !== 'All').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat} ({SAMPLE_SCAMS.filter(s => s.category === cat).length})
                  </option>
                ))}
              </select>
            </div>

            {/* Risk Tier Filter */}
            <div className="lg:col-span-3">
              <select
                value={selectedRiskTier}
                onChange={(e) => setSelectedRiskTier(e.target.value)}
                className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              >
                <option value="All">All Risk Tiers</option>
                <option value="SAFE">SAFE (0–19)</option>
                <option value="LOW">LOW (20–39)</option>
                <option value="MODERATE">MODERATE (40–59)</option>
                <option value="HIGH">HIGH (60–79)</option>
                <option value="CRITICAL">CRITICAL (80–100)</option>
              </select>
            </div>

            {/* Grid / List Layout Switcher */}
            <div className="lg:col-span-2 flex items-center justify-end gap-1.5">
              <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1 w-full justify-center">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`flex-1 py-1 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-slate-800'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Grid</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`flex-1 py-1 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-slate-800'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span>Console</span>
                </button>
              </div>
            </div>

          </div>

          {/* Quick Filter Status Bar */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono pt-2 border-t border-slate-100 dark:border-slate-800 gap-2">
            <div>
              Showing <strong className="text-slate-900 dark:text-white">{filteredScams.length}</strong> of {SAMPLE_SCAMS.length} benchmark scenarios
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Safe: {filteredScams.filter(s => s.expectedClassification === 'SAFE').length}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                Threats: {filteredScams.filter(s => s.expectedClassification !== 'SAFE').length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Zero Results State */}
      {filteredScams.length === 0 && (
        <div className="clean-card rounded-2xl p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No benchmark scenarios match your search</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Try resetting your search query or selecting "All Categories" and "All Risk Tiers".
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedRiskTier('All');
              setSelectedStatus('All');
            }}
            className="blue-btn px-4 py-2 rounded-xl text-xs font-semibold shadow-sm inline-block cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Scenario List/Grid */}
      {viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredScams.map((sample) => {
            const evalResult = evaluateExplainableThreat(sample.content);
            const isSimulating = simulatingId === sample.id;

            return (
              <div
                key={sample.id}
                className="clean-card rounded-2xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-3 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 group-hover:bg-blue-50 dark:group-hover:bg-slate-700 transition-colors">
                      {getCardIcon(sample.id)}
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getPillStyle(sample.category)}`}>
                      {sample.category}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {sample.title}
                  </h3>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 italic">
                    "{sample.content}"
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-500 dark:text-slate-400">Expected: <strong className="text-slate-700 dark:text-slate-200">{sample.expectedClassification}</strong></span>
                    <span className={`px-2 py-0.5 rounded border ${getRiskBadgeStyle(evalResult.riskScore)}`}>
                      {evalResult.riskScore} / 100 ({evalResult.riskLevel})
                    </span>
                  </div>

                  {isSimulating ? (
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white font-mono text-[10px] space-y-1 border border-slate-200 dark:border-slate-800 shadow-inner">
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-1 text-[9px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">
                        <span>ANALYZING THREAT</span>
                        <span className="animate-spin text-blue-600 dark:text-blue-400">⚡</span>
                      </div>
                      <div className="space-y-0.5 text-[9px]">
                        <div className={`flex items-center gap-1 ${simStep >= 1 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-600'}`}>
                          <span>{simStep >= 1 ? '✓' : '○'}</span>
                          <span>Extracting behavioral signals</span>
                        </div>
                        <div className={`flex items-center gap-1 ${simStep >= 3 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-600'}`}>
                          <span>{simStep >= 3 ? '✓' : '○'}</span>
                          <span>Applying compound risk floors</span>
                        </div>
                        <div className={`flex items-center gap-1 ${simStep >= 5 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-600'}`}>
                          <span>{simStep >= 5 ? '✓' : '○'}</span>
                          <span>Generating explainable report</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRunSimulation(sample)}
                      className="w-full blue-btn py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm hover:bg-blue-700 transition-all cursor-pointer"
                    >
                      <span>Run Threat Analysis</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* CONSOLE LIST VIEW */
        <div className="clean-card rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Scenario Title</th>
                  <th className="py-3 px-4 font-semibold hidden md:table-cell">Message Excerpt</th>
                  <th className="py-3 px-4 font-semibold text-center">Expected</th>
                  <th className="py-3 px-4 font-semibold text-center">Live Score</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredScams.map((sample) => {
                  const evalResult = evaluateExplainableThreat(sample.content);
                  const isSimulating = simulatingId === sample.id;

                  return (
                    <tr key={sample.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getPillStyle(sample.category)}`}>
                          {sample.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white max-w-[220px] truncate">
                        {sample.title}
                      </td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400 max-w-[320px] truncate italic hidden md:table-cell">
                        "{sample.content}"
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {sample.expectedClassification}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded text-[11px] font-mono border ${getRiskBadgeStyle(evalResult.riskScore)}`}>
                          {evalResult.riskScore} / 100
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleRunSimulation(sample)}
                          disabled={isSimulating}
                          className="blue-btn py-1 px-3 rounded-lg text-xs font-semibold inline-flex items-center gap-1 shadow-sm cursor-pointer"
                        >
                          {isSimulating ? (
                            <span className="animate-spin text-white">⚡</span>
                          ) : (
                            <>
                              <span>Analyze</span>
                              <ArrowRight className="w-3 h-3" />
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
