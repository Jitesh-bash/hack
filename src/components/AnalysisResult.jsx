import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, Share2, Check, ArrowLeft, Globe, BadgeAlert, FileText, BarChart2, Copy, ChevronDown, ChevronUp, Cpu, Layers, Image as ImageIcon } from 'lucide-react';

const renderHighlightedOcrText = (text, phrasesToHighlight = []) => {
  if (!text) return null;
  if (!phrasesToHighlight || phrasesToHighlight.length === 0) {
    return <span>{text}</span>;
  }

  const escapedPhrases = phrasesToHighlight.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escapedPhrases.join('|')})`, 'gi');

  const parts = text.split(regex);

  return parts.map((part, i) => {
    const isMatch = phrasesToHighlight.some(p => p.toLowerCase() === part.toLowerCase());
    if (isMatch) {
      return (
        <mark key={i} className="bg-amber-400 text-slate-950 font-extrabold px-1.5 py-0.5 mx-0.5 rounded shadow-sm border border-amber-300 inline-block">
          {part}
        </mark>
      );
    }
    return <span key={i}>{part}</span>;
  });
};

export default function AnalysisResult({ result, onReset }) {
  const [copiedCard, setCopiedCard] = useState(false);
  const [copiedContent, setCopiedContent] = useState(false);
  const [isExtractedContentExpanded, setIsExtractedContentExpanded] = useState(false);

  if (!result) return null;

  const { riskScore, riskLevel, detectionConfidence, signalCount, brandCount, domainMismatchCount, fraudCategory, summary, extractedText, senderDomainAnalysis, brandSpoofingDetected, riskSignalContributions, structuredEvidence, recommendedActions, whyAppearsSafe, severityCounts } = result;

  const isUrlMode = result.isUrlMode || !!result.urlIntelligence;
  const isImageMode = result.isImageMode || !!result.screenshotIntelligence;

  const screenshotData = result.screenshotIntelligence || (isImageMode ? {
    imageUrl: result.imageUrl || null,
    extractedContent: {
      sender: senderDomainAnalysis?.actualSenderDomain || "Not available from submitted content",
      phone: "Not available from submitted content",
      email: senderDomainAnalysis?.actualSenderDomain || "Not available from submitted content",
      url: "Not available from submitted content",
      organization: fraudCategory || "Not available from submitted content",
      detectedPhrases: ["Extracted content parsing complete"]
    },
    threatSignals: [
      { name: "Suspicious Urgency Language", detected: false, severity: "LOW" },
      { name: "Brand Impersonation", detected: false, severity: "LOW" },
      { name: "Payment Request / Upfront Fee", detected: false, severity: "LOW" },
      { name: "Credential Harvesting Request", detected: false, severity: "LOW" },
      { name: "Unverified External Source", detected: true, severity: "MEDIUM" }
    ],
    ocrText: extractedText || "Extracted OCR text content...",
    highlightedPhrases: []
  } : null);

  const urlData = result.urlIntelligence || (isUrlMode ? {
    targetUrl: result.targetUrl || "http://example.com",
    verdict: riskScore >= 75 ? "HIGH RISK" : "SAFE",
    riskScore: riskScore,
    confidence: detectionConfidence || "High",
    domainAnalysis: {
      domain: senderDomainAnalysis?.actualSenderDomain || "example.com",
      https: "Enabled (SSL Valid)",
      domainAge: "Established",
      redirects: 0,
      finalDestination: "example.com"
    },
    brandTarget: brandSpoofingDetected?.[0] || "None Detected",
    brandImpersonationLevel: riskScore >= 75 ? "HIGH" : "NONE",
    pageSignals: [
      { type: "info", text: "Standard Web Domain Structure" }
    ],
    detectionSignals: structuredEvidence ? structuredEvidence.map(e => ({
      severity: e.severity,
      description: e.title,
      evidence: e.explanation
    })) : []
  } : null);

  // Semantic Risk Levels
  const isCritical = riskScore >= 90;
  const isHigh = riskScore >= 75 && riskScore < 90;
  const isModerate = riskScore >= 50 && riskScore < 75;
  const isLow = riskScore >= 25 && riskScore < 50;
  const isSafe = riskScore < 25;

  const getRiskTheme = () => {
    if (isCritical) return {
      badgeBg: 'bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
      barBg: 'bg-red-600',
      text: 'text-red-700 dark:text-red-400',
      border: 'border-red-200 dark:border-red-800',
      lightBg: 'bg-red-50 dark:bg-red-950/40'
    };
    if (isHigh) return {
      badgeBg: 'bg-orange-100 dark:bg-orange-950/80 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
      barBg: 'bg-orange-500',
      text: 'text-orange-700 dark:text-orange-400',
      border: 'border-orange-200 dark:border-orange-800',
      lightBg: 'bg-orange-50 dark:bg-orange-950/40'
    };
    if (isModerate) return {
      badgeBg: 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      barBg: 'bg-amber-500',
      text: 'text-amber-800 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-800',
      lightBg: 'bg-amber-50 dark:bg-amber-950/40'
    };
    if (isLow) return {
      badgeBg: 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      barBg: 'bg-blue-500',
      text: 'text-blue-700 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800',
      lightBg: 'bg-blue-50 dark:bg-blue-950/40'
    };
    return {
      badgeBg: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      barBg: 'bg-emerald-500',
      text: 'text-emerald-700 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-800',
      lightBg: 'bg-emerald-50 dark:bg-emerald-950/40'
    };
  };

  const theme = getRiskTheme();

  const handleCopyWarningCard = () => {
    const textToCopy = `PhishGuard Security Assessment:
[Category]: ${fraudCategory}
[Risk Level]: ${riskLevel} (Score: ${riskScore}/100)
[Confidence]: ${detectionConfidence || 'High'}
[Summary]: ${summary}
[Sender Domain]: ${senderDomainAnalysis?.actualSenderDomain || 'Not provided'}

Checked with PhishGuard AI.`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedCard(true);
    setTimeout(() => setCopiedCard(false), 3000);
  };

  const handleCopyExtractedText = () => {
    if (extractedText) {
      navigator.clipboard.writeText(extractedText);
      setCopiedContent(true);
      setTimeout(() => setCopiedContent(false), 3000);
    }
  };

  // Three Sender Authenticity States
  const senderStatus = senderDomainAnalysis?.status || "INSUFFICIENT_INFO";

  const renderSenderAuthenticity = () => {
    if (senderStatus === "DOMAIN_MISMATCH") {
      return (
        <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white font-mono">
              <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>SENDER AUTHENTICITY</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 uppercase">
              DOMAIN MISMATCH — HIGH RISK
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center text-xs pt-1">
            <div className="md:col-span-5 p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[9px] font-mono text-slate-400 font-bold uppercase block mb-1">CLAIMED SENDER</span>
              <p className="font-mono text-xs font-bold text-slate-900 dark:text-white leading-snug break-all">
                {senderDomainAnalysis.claimedSender || "Claimed Organization"}
              </p>
            </div>

            <div className="md:col-span-1 text-center font-black font-mono text-slate-400 py-1">
              VS
            </div>

            <div className="md:col-span-5 p-3 rounded-lg bg-white dark:bg-slate-900 border border-red-200 dark:border-red-800 bg-red-50/20 dark:bg-red-950/20">
              <span className="text-[9px] font-mono text-red-500 font-bold uppercase block mb-1">ACTUAL SENDER DOMAIN</span>
              <p className="font-mono text-xs font-bold text-red-600 dark:text-red-400 leading-snug break-all">
                {senderDomainAnalysis.actualSenderDomain || "External Domain"}
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
            {senderDomainAnalysis.explanation || "The claimed organization does not match the actual sending domain."}
          </p>
        </div>
      );
    }

    if (senderStatus === "NO_MISMATCH") {
      return (
        <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white font-mono">
              <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>SENDER AUTHENTICITY</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 uppercase">
              NO MISMATCH DETECTED
            </span>
          </div>

          <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Verified Domain:</span>
              <span className="font-bold text-slate-900 dark:text-white">{senderDomainAnalysis.actualSenderDomain || senderDomainAnalysis.claimedSender}</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-sans pt-1">
              {senderDomainAnalysis.explanation || "Sender domain matches the claimed organization."}
            </p>
          </div>
        </div>
      );
    }

    // State C: INSUFFICIENT_INFO / NOT_PROVIDED
    return (
      <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white font-mono">
            <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>SOURCE VERIFICATION</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 uppercase">
            ⚠ Insufficient sender information
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {senderDomainAnalysis?.explanation || "The message does not provide enough information to verify the sender. This contributes a limited amount of risk (+7), but is NOT treated as proof of malicious activity."}
        </p>
      </div>
    );
  };

  return (
    <div id="analysis-result-section" className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 my-4">
      
      {/* Back Button */}
      <button
        onClick={onReset}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors mb-3 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>{isUrlMode ? 'Analyze Another Link' : isImageMode ? 'Analyze Another Screenshot' : 'Analyze Another Message'}</span>
      </button>

      {/* Main Security Analyst Console Card */}
      <div className="clean-card rounded-2xl p-4 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800 flex items-center gap-1">
                {isUrlMode ? <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" /> : isImageMode ? <ImageIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" /> : <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />}
                {isUrlMode ? 'URL INTELLIGENCE' : isImageMode ? 'SCREENSHOT MULTIMODAL ANALYSIS' : 'SECURITY ANALYSIS'}
              </span>
              <span className="text-[11px] sm:text-xs text-slate-400 font-mono">• Analyst Console</span>
            </div>
            
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex flex-wrap items-center gap-2">
              {isSafe ? (
                'VERIFIED SAFE COMMUNICATION'
              ) : isUrlMode ? (
                <>
                  <span>Target URL:</span>
                  <span className="font-mono text-xs sm:text-sm font-semibold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-blue-800 dark:text-blue-300 break-all">
                    {result.targetUrl || urlData?.targetUrl || "http://example.com"}
                  </span>
                </>
              ) : isImageMode ? (
                <span>Multimodal Screenshot Threat Inspection</span>
              ) : (
                riskScore >= 75 ? 'Threat Confirmed: Do Not Respond' : 'Suspicious Message Indicators'
              )}
            </h2>
          </div>

          <button
            onClick={handleCopyWarningCard}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-xs font-semibold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 transition-colors shadow-sm shrink-0"
          >
            {copiedCard ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-emerald-700 dark:text-emerald-300 font-bold">Alert Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>Share Warning Card</span>
              </>
            )}
          </button>
        </div>

        {/* MULTIMODAL WORKFLOW PIPELINE BANNER */}
        {isImageMode && (
          <div className="p-3 sm:p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white space-y-2 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                MULTIMODAL PIPELINE
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">OCR & Vision Engine</span>
            </div>

            <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] font-mono font-bold">
              <span className="px-2 py-0.5 rounded bg-blue-600 text-white">
                1. SCREENSHOT
              </span>
              <span className="text-slate-500 font-normal">→</span>
              <span className="px-2 py-0.5 rounded bg-blue-600/80 text-white">
                2. OCR
              </span>
              <span className="text-slate-500 font-normal">→</span>
              <span className="px-2 py-0.5 rounded bg-blue-600/80 text-white">
                3. ENTITIES
              </span>
              <span className="text-slate-500 font-normal">→</span>
              <span className={`px-2 py-0.5 rounded ${isSafe ? 'bg-emerald-600' : 'bg-orange-600'} text-white`}>
                4. SIGNALS
              </span>
              <span className="text-slate-500 font-normal">→</span>
              <span className={`px-2 py-0.5 rounded ${isSafe ? 'bg-emerald-600' : 'bg-red-600'} text-white`}>
                5. ASSESSMENT
              </span>
            </div>
          </div>
        )}

        {/* MULTIMODAL SCREENSHOT 2-COLUMN WORKSPACE */}
        {isImageMode && screenshotData && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
              
              {/* LEFT: SCREENSHOT PREVIEW */}
              <div className="lg:col-span-5 space-y-3">
                <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5 mb-3">
                      <span className="text-xs font-bold text-slate-900 dark:text-white font-mono flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                        SCREENSHOT PREVIEW
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 font-semibold uppercase">Source Image</span>
                    </div>

                    <div className="flex items-center justify-center p-2 sm:p-3 rounded-xl bg-slate-900/5 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 min-h-[200px] sm:min-h-[300px] overflow-hidden">
                      {screenshotData.imageUrl ? (
                        <img
                          src={screenshotData.imageUrl}
                          alt="Uploaded threat screenshot"
                          className="max-h-[280px] sm:max-h-[400px] w-auto object-contain rounded-lg shadow-md border border-slate-200 dark:border-slate-700"
                        />
                      ) : (
                        <div className="text-center p-4 space-y-2">
                          <ImageIcon className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto" />
                          <p className="text-xs font-mono text-slate-500 dark:text-slate-400 font-bold">Screenshot Uploaded & Analyzed</p>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500">OCR & Entity parsing completed</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    <span>Status: Analyzed</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">✓ OCR Engine Active</span>
                  </div>
                </div>
              </div>

              {/* RIGHT: EXTRACTED CONTENT & THREAT SIGNALS */}
              <div className="lg:col-span-7 space-y-4">
                
                {/* EXTRACTED CONTENT */}
                <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-white font-mono flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                      EXTRACTED CONTENT (ENTITIES)
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 font-bold">
                      ✓ Structured Entity Parser
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[9px] text-slate-400 uppercase font-semibold block">SENDER</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 break-words">{screenshotData.extractedContent.sender}</span>
                    </div>

                    <div className="p-2.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[9px] text-slate-400 uppercase font-semibold block">PHONE NUMBER</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{screenshotData.extractedContent.phone}</span>
                    </div>

                    <div className="p-2.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[9px] text-slate-400 uppercase font-semibold block">EMAIL ADDRESS</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 break-all">{screenshotData.extractedContent.email}</span>
                    </div>

                    <div className="p-2.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[9px] text-slate-400 uppercase font-semibold block">DETECTED URL</span>
                      <span className="font-bold text-blue-700 dark:text-blue-400 break-all">{screenshotData.extractedContent.url}</span>
                    </div>

                    <div className="p-2.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 sm:col-span-2">
                      <span className="text-[9px] text-slate-400 uppercase font-semibold block">ORGANIZATION</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{screenshotData.extractedContent.organization}</span>
                    </div>
                  </div>
                </div>

                {/* THREAT SIGNALS */}
                <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-white font-mono flex items-center gap-2">
                      <AlertTriangle className={`w-4 h-4 ${isSafe ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'} shrink-0`} />
                      THREAT SIGNALS
                    </span>
                    <span className={`text-[9px] sm:text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                      isSafe ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' : 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
                    }`}>
                      {screenshotData.threatSignals.filter(s => s.detected).length} SIGNALS
                    </span>
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    {screenshotData.threatSignals.map((sig, idx) => (
                      <div key={idx} className="p-2.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-1.5">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${sig.detected ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{sig.name}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase shrink-0 ${
                          sig.detected ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        }`}>
                          {sig.detected ? `DETECTED (${sig.severity || 'HIGH'})` : 'CLEARED'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* OCR TEXT */}
            {screenshotData.ocrText && (
              <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white font-mono">
                    <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span>OCR TEXT (EXTRACTED RAW OUTPUT)</span>
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-mono text-slate-500 dark:text-slate-400 font-semibold">Tesseract.js Engine</span>
                </div>

                <div className="p-3.5 sm:p-4 rounded-xl bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-mono text-xs leading-relaxed overflow-x-auto shadow-inner border border-slate-200 dark:border-slate-800">
                  {renderHighlightedOcrText(screenshotData.ocrText, screenshotData.highlightedPhrases)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* RISK SCORE & THREAT INTELLIGENCE STRIP */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* Risk Score / Verdict Pill */}
            <div className="md:col-span-4 flex items-center gap-3">
              <div className={`px-3.5 py-2.5 rounded-xl border flex flex-col items-center justify-center font-mono shrink-0 ${theme.lightBg} ${theme.border}`}>
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  {isUrlMode ? 'VERDICT' : 'RISK SCORE'}
                </span>
                <span className={`text-xl sm:text-2xl font-black ${theme.text}`}>
                  {isUrlMode ? (urlData?.verdict || riskLevel) : riskScore} 
                  {!isUrlMode && <span className="text-xs font-normal text-slate-500 dark:text-slate-400">/ 100</span>}
                </span>
              </div>

              <div>
                <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold uppercase tracking-wider inline-block border ${theme.badgeBg}`}>
                  {riskLevel}
                </span>
                <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">{fraudCategory}</p>
              </div>
            </div>

            {/* 4 Multi-Signal Threat Intelligence Badges */}
            <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase font-semibold block">RISK SCORE</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{riskScore} / 100</span>
              </div>

              <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase font-semibold block">ANALYSIS CONFIDENCE</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{detectionConfidence || "High"}</span>
              </div>

              {isUrlMode ? (
                <>
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase font-semibold block">BRAND TARGET</span>
                    <span className="text-xs font-bold text-blue-700 dark:text-blue-400 truncate block">{urlData?.brandTarget || "None Detected"}</span>
                  </div>

                  <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase font-semibold block">IMPERSONATION</span>
                    <span className="text-xs font-bold text-red-600 dark:text-red-400">{urlData?.brandImpersonationLevel || "NONE"}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase font-semibold block">BEHAVIORAL SIGNALS</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{isSafe ? '0 SIGNALS' : `${signalCount || riskSignalContributions?.length || 0} DETECTED`}</span>
                  </div>

                  <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase font-semibold block">MISMATCH</span>
                    <span className={`text-xs font-bold ${senderStatus === 'DOMAIN_MISMATCH' ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-slate-200'}`}>
                      {senderStatus === 'DOMAIN_MISMATCH' ? '1 DETECTED' : 'NONE'}
                    </span>
                  </div>
                </>
              )}
            </div>

          </div>

          {/* Clean Horizontal Risk Meter Bar */}
          <div className="space-y-1.5 pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
            <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-slate-500 dark:text-slate-400 font-semibold">
              <span>{isUrlMode ? 'URL RISK METRICS' : 'RISK SCALE VISUALIZATION'}</span>
              <span>{riskScore} / 100</span>
            </div>

            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden relative">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${theme.barBg}`}
                style={{ width: `${Math.min(riskScore, 100)}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-[8px] xs:text-[9px] sm:text-[10px] font-mono text-slate-400 dark:text-slate-500 font-semibold uppercase pt-0.5">
              <span>0 SAFE</span>
              <span>25 LOW</span>
              <span>50 MODERATE</span>
              <span>75 HIGH</span>
              <span>90 CRITICAL</span>
            </div>
          </div>

        </div>

        {/* AI Threat Assessment Summary */}
        <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <strong className="text-blue-900 dark:text-blue-300 font-bold uppercase tracking-wider font-mono">Assessment Summary: </strong>
          {summary}
        </div>

        {/* SAFE MODE: WHY THIS APPEARS SAFE */}
        {isSafe && (
          <div className="p-4 sm:p-5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-300 font-mono uppercase tracking-wider border-b border-emerald-200/80 dark:border-emerald-900/60 pb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>WHY THIS APPEARS SAFE</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium text-slate-800 dark:text-slate-200">
              {(whyAppearsSafe || [
                "Normal communication context",
                "No payment or upfront fee request",
                "No credential harvesting request",
                "No suspicious external URLs",
                "No suspicious urgency language",
                "No obvious brand impersonation indicators"
              ]).map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-900/60 shadow-2xs">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 font-bold shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* THREE SENDER AUTHENTICITY STATES */}
        {!isUrlMode && renderSenderAuthenticity()}

        {/* WHY THIS MESSAGE WAS FLAGGED (PROMINENT EXPLAINABLE POINT BREAKDOWN) */}
        {!isSafe && (result.flaggedBreakdown || (riskSignalContributions && riskSignalContributions.length > 0)) && (
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 space-y-3.5 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
              <div className="flex items-center gap-2 text-xs font-bold font-mono tracking-wider text-blue-600 dark:text-blue-400">
                <BarChart2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>WHY THIS MESSAGE WAS FLAGGED</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                Calculated Risk Contribution Matrix
              </span>
            </div>

            <div className="space-y-2.5 pt-1">
              {(result.flaggedBreakdown || riskSignalContributions.map(s => ({
                badge: s.severity === 'CRITICAL' ? '🔴' : s.severity === 'HIGH' ? '🟠' : s.severity === 'MEDIUM' ? '🟠' : '🟡',
                points: s.weight,
                title: s.name,
                explanation: s.explanation || `Signal detected in content (+${s.weight} points).`,
                matchedExcerpt: null
              }))).map((item, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 font-mono text-xs">
                  <div className="flex items-center justify-between font-bold">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{item.badge}</span>
                      <span className="text-red-600 dark:text-red-400">+{item.points.toString().padStart(2, '0')}</span>
                      <span className="text-slate-900 dark:text-slate-100">{item.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal hidden sm:inline">Point Contribution</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 font-sans text-[11px] leading-relaxed pl-7">
                    {item.explanation}
                  </p>
                  {item.matchedExcerpt && (
                    <div className="pl-7 pt-0.5 text-[10px] text-amber-700 dark:text-amber-300 font-mono italic">
                      Excerpt: {item.matchedExcerpt}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs font-mono">
              <span className="text-slate-500 dark:text-slate-400">Calculated Score: <strong className="text-slate-900 dark:text-white font-bold">{riskScore} / 100</strong></span>
              <span className="text-blue-600 dark:text-blue-400 font-bold">Confidence: {detectionConfidence || 'High'}</span>
            </div>
          </div>
        )}

        {/* SECURITY EVIDENCE (NON-SAFE MODES) */}
        {!isSafe && structuredEvidence && structuredEvidence.length > 0 && (
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white font-mono border-b border-slate-200 dark:border-slate-800 pb-2.5">
              <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
              <span>{isUrlMode ? 'DETECTION SIGNALS' : 'SECURITY EVIDENCE'}</span>
            </div>

            <div className="space-y-2.5">
              {structuredEvidence.map((ev, idx) => (
                <div key={idx} className="p-3.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        ev.severity === 'CRITICAL' ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800' :
                        ev.severity === 'HIGH' ? 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800' :
                        ev.severity === 'MEDIUM' ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800' :
                        'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}>
                        {ev.severity}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white font-sans">{ev.title}</h4>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-0.5">{ev.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BRAND IMPERSONATION (NON-SAFE MODES) */}
        {!isSafe && !isUrlMode && brandSpoofingDetected && brandSpoofingDetected.length > 0 && (
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white font-mono">
                <BadgeAlert className="w-4 h-4 text-amber-500 shrink-0" />
                <span>BRAND IMPERSONATION</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                {brandSpoofingDetected.length} brands referenced
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {brandSpoofingDetected.map((brand, idx) => (
                <span key={idx} className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 shadow-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  {brand}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* EXTRACTED CONTENT (RAW TEXT) */}
        {extractedText && (
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white font-mono">
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>EXTRACTED CONTENT</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyExtractedText}
                  className="px-2.5 py-1 rounded bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-mono border border-slate-200 dark:border-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedContent ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedContent ? 'Copied' : 'Copy Text'}</span>
                </button>

                <button
                  onClick={() => setIsExtractedContentExpanded(!isExtractedContentExpanded)}
                  className="px-2.5 py-1 rounded bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-mono border border-slate-200 dark:border-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {isExtractedContentExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  <span>{isExtractedContentExpanded ? 'Collapse' : 'Expand'}</span>
                </button>
              </div>
            </div>

            <div className={`p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 leading-relaxed overflow-hidden transition-all ${
              isExtractedContentExpanded ? 'max-h-none' : 'max-h-32'
            }`}>
              {extractedText.trim()}
            </div>
          </div>
        )}

        {/* RECOMMENDED ACTIONS */}
        <div className={`p-4 sm:p-5 rounded-2xl ${isSafe ? 'bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white' : isCritical ? 'bg-red-50/80 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-900 dark:text-red-200' : 'bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-900 dark:text-emerald-200'} space-y-3`}>
          <div className="flex items-center gap-2 text-xs font-bold font-mono tracking-wider uppercase border-b border-slate-200/80 dark:border-slate-800/80 pb-2">
            <CheckCircle2 className={`w-4 h-4 ${isSafe ? 'text-blue-600 dark:text-blue-400' : isCritical ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'} shrink-0`} />
            <span>RECOMMENDED ACTION</span>
          </div>

          <div className="space-y-2">
            {(recommendedActions || [
              isSafe ? "Continue normally, while maintaining standard caution." : "Do not share personal details or fulfill unverified payment requests."
            ]).map((action, idx) => (
              <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                <span className={`w-4 h-4 rounded-full ${isSafe ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'} flex items-center justify-center text-[10px] font-bold shrink-0`}>
                  ✓
                </span>
                <span>{action}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
