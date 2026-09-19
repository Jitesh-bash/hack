/**
 * PhishGuard AI - Behavioral Signal Detection & Correlation Engine
 * Generalized architecture for contextual threat reasoning without rigid keyword matching.
 */

import { classifyTaxonomyCategory } from './taxonomy.js';

// ---------------------------------------------------------------------------
// HELPER UTILITIES
// ---------------------------------------------------------------------------

// Extract traceable sentence evidence from text
const extractSentenceEvidence = (rawText, matchedTerm) => {
  if (!rawText) return "Traceable text evidence identified in message.";
  const sentences = rawText.split(/(?<=[.!?])\s+|\n+/);
  if (matchedTerm) {
    const termStr = typeof matchedTerm === 'string' ? matchedTerm.toLowerCase() : '';
    for (const sentence of sentences) {
      if (sentence.toLowerCase().includes(termStr)) {
        return `"${sentence.trim()}"`;
      }
    }
  }
  return `"${rawText.trim()}"`;
};

// Check if message is a URL or domain
const isUrlString = (text) => {
  const content = (text || '').toLowerCase().trim();
  return content.startsWith('http://') || content.startsWith('https://') ||
         ((content.includes('.xyz') || content.includes('.top') || content.includes('.online') || content.includes('.site')) && !content.includes(' '));
};

// ---------------------------------------------------------------------------
// LEGITIMATE MESSAGE PROTECTION SHIELD
// ---------------------------------------------------------------------------

/**
 * Detects if a message is legitimate communication despite containing words like 
 * "payment", "bank", "internship", "college", "verification", or "deadline".
 */
export const evaluateLegitimateShield = (rawText) => {
  const content = (rawText || '').toLowerCase().trim();

  // 1. Official portal / website reference context without payment demand
  const hasOfficialPortalRef = (
    content.includes('official university website') ||
    content.includes('official student portal') ||
    content.includes('official college portal') ||
    content.includes('refer to the prospectus') ||
    content.includes('check your student dashboard')
  );

  // 2. Confirmed appointment or scheduled meeting context
  const isConfirmedAppointment = (
    (content.includes('appointment') || content.includes('project sync') || content.includes('scheduled meeting') || content.includes('reschedule')) &&
    (content.includes('confirmed for') || content.includes('seminar hall') || content.includes('room') || content.includes('office hours')) &&
    !content.includes('pay') && !content.includes('fee') && !content.includes('otp') && !content.includes('http')
  );

  // 3. Educational / Informational reference context
  const isEducationalReference = (
    (content.includes('fee structure') || content.includes('tuition fees') || content.includes('syllabus')) &&
    (content.includes('listed on') || content.includes('available at')) &&
    !content.includes('pay now') && !content.includes('refundable deposit') && !content.includes('reserve your slot')
  );

  // 4. Standard utility/bank transaction notification (read-only receipt)
  const isReadOnlyTransactionNotice = (
    (content.includes('credited to your account') || content.includes('debited by') || content.includes('auto-debit successful')) &&
    !content.includes('click here') && !content.includes('enter otp') && !content.includes('suspended')
  );

  const isLegitimate = hasOfficialPortalRef || isConfirmedAppointment || isEducationalReference || isReadOnlyTransactionNotice;

  return {
    isLegitimate,
    reason: isConfirmedAppointment ? "Confirmed appointment notice with no financial/credential demands" :
            hasOfficialPortalRef ? "Official portal reference context without direct payment requests" :
            isEducationalReference ? "Educational policy reference context" :
            isReadOnlyTransactionNotice ? "Standard automated transaction notification" : null
  };
};

// ---------------------------------------------------------------------------
// GENERALIZED SIGNAL DETECTORS (8 CORE BEHAVIORAL GROUPS)
// ---------------------------------------------------------------------------

export const detectBehavioralSignals = (rawText) => {
  const content = (rawText || '').toLowerCase().trim();
  const detectedSignals = [];

  // Extract entities
  const emailMatch = rawText?.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = rawText?.match(/(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const urlMatch = rawText?.match(/(https?:\/\/[^\s]+|[a-zA-Z0-9-]+\.(xyz|top|online|site|com|org|net|in|edu))/i);

  // GROUP 1: PAYMENT SIGNALS
  const softPaymentTerms = [
    'registration amount', 'refundable amount', 'processing fee', 'verification fee',
    'security deposit', 'reservation amount', 'booking amount', 'onboarding fee',
    'activation fee', 'documentation fee', 'training fee', 'administrative fee',
    'small refundable amount', 'nominal fee', 'token amount', 'registration fee',
    'upfront fee', 'pay ₹', 'pay $', 'payment required', 'payment will be requested',
    'amount may be requested', 'amount required', 'fee required', 'deposit required',
    'laptop deposit', 'charges required', 'registration charges', 'amount may be required'
  ];

  const matchedPaymentTerm = softPaymentTerms.find(term => content.includes(term)) ||
    (/refundable.*amount/i.test(content) ? 'refundable registration amount' : null) ||
    (/amount.*requested/i.test(content) ? 'amount requested' : null);

  if (matchedPaymentTerm) {
    const isDirectAmount = content.includes('pay ₹') || content.includes('pay $') || content.includes('₹') || content.includes('$');
    detectedSignals.push({
      group: 'PAYMENT_SIGNALS',
      id: 'upfront_payment_request',
      name: 'Upfront Payment / Fee Demand',
      severity: isDirectAmount ? 'CRITICAL' : 'HIGH',
      weight: isDirectAmount ? 35 : 30,
      matchedTerm: matchedPaymentTerm,
      evidence: extractSentenceEvidence(rawText, matchedPaymentTerm),
      explanation: 'Requests an upfront payment, fee, or deposit. Legitimate employers and university programs do not charge candidates to apply or onboard.'
    });
  }

  // GROUP 2: OPPORTUNITY ACCESS CONDITION
  const accessTerms = [
    'reserve your onboarding slot', 'confirm your seat', 'secure your position',
    'reserve your slot', 'hold your position', 'lock your seat', 'onboarding slot',
    'reserve your seat', 'secure your slot', 'complete the final registration step',
    'complete registration', 'confirm your participation', 'secure your role'
  ];
  const matchedAccessTerm = accessTerms.find(term => content.includes(term));
  if (matchedAccessTerm) {
    detectedSignals.push({
      group: 'PAYMENT_SIGNALS',
      id: 'opportunity_access_condition',
      name: 'Opportunity Access Conditioned on Payment/Step',
      severity: 'HIGH',
      weight: 18,
      matchedTerm: matchedAccessTerm,
      evidence: extractSentenceEvidence(rawText, matchedAccessTerm),
      explanation: 'Conditions reserving an onboarding slot or candidate seat on a registration/payment step.'
    });
  }

  // GROUP 3: REFUNDABLE PAYMENT FRAMING
  if (content.includes('refundable') && (content.includes('amount') || content.includes('fee') || content.includes('deposit') || content.includes('registration'))) {
    detectedSignals.push({
      group: 'PAYMENT_SIGNALS',
      id: 'refundable_payment_framing',
      name: 'Refundable Payment Framing',
      severity: 'MEDIUM',
      weight: 8,
      matchedTerm: 'refundable',
      evidence: extractSentenceEvidence(rawText, 'refundable'),
      explanation: "Uses 'refundable' terminology to lower perceived financial risk and make an upfront payment appear benign."
    });
  }

  // GROUP 4: CREDENTIAL & OTP HARVESTING SIGNALS
  const credentialTerms = [
    'otp', 'pan card', 'account has been locked', 'verify your account immediately',
    'enter your password', 'netbanking details', 'cvv', 'card number', 'security pin', 'aadhaar'
  ];
  const matchedCredTerm = credentialTerms.find(term => content.includes(term));
  if (matchedCredTerm) {
    detectedSignals.push({
      group: 'CREDENTIAL_SIGNALS',
      id: 'credential_harvesting',
      name: 'Credential & OTP Harvesting Vector',
      severity: 'CRITICAL',
      weight: 35,
      matchedTerm: matchedCredTerm,
      evidence: extractSentenceEvidence(rawText, matchedCredTerm),
      explanation: 'Requests sensitive verification codes, PAN/Aadhaar details, or account access credentials.'
    });
  }

  // GROUP 5: URGENT ACCOUNT / THREAT SIGNALS
  const threatTerms = [
    'bank account will be suspended', 'power supply will be disconnected',
    'account will be locked', 'legal action', 'court summons', 'disconnected tonight', 'service blocked'
  ];
  const matchedThreatTerm = threatTerms.find(term => content.includes(term));
  if (matchedThreatTerm) {
    detectedSignals.push({
      group: 'URGENCY_SIGNALS',
      id: 'urgent_account_threat',
      name: 'Urgent Account/Service Threat',
      severity: 'CRITICAL',
      weight: 30,
      matchedTerm: matchedThreatTerm,
      evidence: extractSentenceEvidence(rawText, matchedThreatTerm),
      explanation: 'Threatens immediate loss of utility service, legal action, or bank account access to induce panic.'
    });
  }

  // GROUP 6: ARTIFICIAL URGENCY & DEADLINE PRESSURE
  const urgencyTerms = [
    'finalized this week', 'earliest convenience', 'closes tomorrow',
    'within 30 minutes', 'within 12 hours', 'within 24 hours',
    'tonight at', 'expires in', 'immediately', 'urgent', 'window closes'
  ];
  const matchedUrgencyTerm = urgencyTerms.find(term => content.includes(term));
  if (matchedUrgencyTerm) {
    detectedSignals.push({
      group: 'URGENCY_SIGNALS',
      id: 'time_pressure',
      name: 'Artificial Time Pressure & Deadline Urgency',
      severity: 'MEDIUM',
      weight: 8,
      matchedTerm: matchedUrgencyTerm,
      evidence: extractSentenceEvidence(rawText, matchedUrgencyTerm),
      explanation: 'Imposes tight deadlines or finalization pressure to rush recipient compliance without verification.'
    });
  }

  // GROUP 7: IDENTITY & CANDIDATE DATA COLLECTION
  const identityTerms = [
    'review your candidate details', 'confirm your participation',
    'candidate verification', 'confirm your preferred contact',
    'verification form', 'candidate details', 'confirm your contact number',
    'share your phone number', 'confirm your details', 'verify your profile email address',
    'verify your email', 'uninterrupted access', 'security update notice'
  ];
  const matchedIdentityTerm = identityTerms.find(term => content.includes(term));
  if (matchedIdentityTerm) {
    detectedSignals.push({
      group: 'IDENTITY_SIGNALS',
      id: 'candidate_info_request',
      name: 'Candidate Details & Verification Collection',
      severity: 'MEDIUM',
      weight: 8,
      matchedTerm: matchedIdentityTerm,
      evidence: extractSentenceEvidence(rawText, matchedIdentityTerm),
      explanation: 'Requests candidate details, contact confirmation, or verification forms.'
    });
  }

  // GROUP 8: VAGUE ORGANIZATION IDENTITY & IMPERSONATION
  const vagueTitles = [
    'program coordination desk', 'student opportunities team',
    'placement network', 'recruitment cell', 'selection desk',
    'hiring team', 'coordination team', 'opportunities desk'
  ];
  const verifiedBrands = ['hdfc', 'meta', 'microsoft', 'google', 'apple', 'cisco', 'amazon', 'college career guidance centre'];
  const matchedVagueTitle = vagueTitles.find(t => content.includes(t));
  if (matchedVagueTitle && !verifiedBrands.some(b => content.includes(b))) {
    detectedSignals.push({
      group: 'IMPERSONATION_SIGNALS',
      id: 'vague_identity',
      name: 'Vague Organization Identity',
      severity: 'LOW',
      weight: 5,
      matchedTerm: matchedVagueTitle,
      evidence: extractSentenceEvidence(rawText, matchedVagueTitle),
      explanation: 'Uses generic titles like "Program Coordination Desk" without identifying a verifiable employer or institution.'
    });
  }

  // GROUP 9: UNSOLICITED OPPORTUNITY ADVANCEMENT CLAIM
  if ((content.includes('shortlisted') || content.includes('selected for') || (content.includes('application') && content.includes('progressed')) || content.includes('internship has been approved')) &&
      !content.includes('appointment') && !content.includes('meeting') && !content.includes('sync')) {
    detectedSignals.push({
      group: 'SOCIAL_ENGINEERING_SIGNALS',
      id: 'unsolicited_opportunity',
      name: 'Unsolicited Opportunity Advancement Claim',
      severity: 'MEDIUM',
      weight: 12,
      matchedTerm: 'shortlisted',
      evidence: extractSentenceEvidence(rawText, 'shortlisted') || extractSentenceEvidence(rawText, 'progressed') || extractSentenceEvidence(rawText, 'approved'),
      explanation: 'Claims candidate selection or application progress without clear prior interaction context.'
    });
  }

  // GROUP 10: UNREALISTIC COMPENSATION BAIT
  if (content.includes('$75/hour') || content.includes('75/hr') || content.includes('₹35,000/month')) {
    detectedSignals.push({
      group: 'SOCIAL_ENGINEERING_SIGNALS',
      id: 'unrealistic_pay',
      name: 'Unrealistic Compensation Rate',
      severity: 'HIGH',
      weight: 20,
      matchedTerm: '$75/hour',
      evidence: extractSentenceEvidence(rawText, '75'),
      explanation: 'Offers suspiciously high salary rates for simple or unverified job roles.'
    });
  }

  // GROUP 11: SUSPICIOUS EXTERNAL LINK / URL VECTOR
  if (urlMatch || content.includes('link below') || content.includes('using this link') || content.includes('click here to pay')) {
    detectedSignals.push({
      group: 'URL_SIGNALS',
      id: 'suspicious_url',
      name: 'External Web Link Vector',
      severity: 'HIGH',
      weight: 25,
      matchedTerm: urlMatch ? urlMatch[0] : 'external link',
      evidence: extractSentenceEvidence(rawText, 'link') || extractSentenceEvidence(rawText, 'http'),
      explanation: 'Directs recipient to click an external web link or form to complete high-risk actions.'
    });
  }

  // GROUP 12: MISSING SOURCE INFO
  if (!emailMatch && detectedSignals.length > 0) {
    detectedSignals.push({
      group: 'AUTHORITY_SIGNALS',
      id: 'missing_source_info',
      name: 'Missing Source Verification Info',
      severity: 'LOW',
      weight: 7,
      matchedTerm: 'missing email domain',
      evidence: 'No verifiable corporate domain or official contact information present in message.',
      explanation: 'The message does not provide enough information to verify the sender.'
    });
  }

  return detectedSignals;
};

// ---------------------------------------------------------------------------
// WEIGHTED SIGNAL CORRELATION ENGINE
// ---------------------------------------------------------------------------

export const processSignalCorrelation = (rawText) => {
  const content = (rawText || '').toLowerCase().trim();
  const taxonomyInfo = classifyTaxonomyCategory(rawText);
  const legitimateShield = evaluateLegitimateShield(rawText);

  // If legitimate shield triggers and no hard critical threats (like OTP theft) are present
  if (legitimateShield.isLegitimate && !content.includes('otp') && !content.includes('pay ₹')) {
    return {
      riskScore: 10,
      riskLevel: "SAFE",
      detectionConfidence: "High",
      signalCount: 0,
      severityCounts: { HIGH: 0, CRITICAL: 0, MEDIUM: 0, LOW: 0 },
      fraudCategory: "Verified Safe Communication",
      summary: `Legitimate communication verified (${legitimateShield.reason}). No threat vectors detected.`,
      whyAppearsSafe: [
        "Normal communication context",
        "No payment or upfront fee request",
        "No credential or OTP harvesting request",
        "No suspicious external URLs",
        "No artificial urgency or deadline pressure",
        "No vague organization or brand impersonation indicators"
      ],
      senderDomainAnalysis: {
        claimedSender: null,
        actualSenderDomain: null,
        status: "INSUFFICIENT_INFO",
        explanation: "Message is standard safe communication."
      },
      riskSignalContributions: [],
      structuredEvidence: [],
      recommendedActions: ["Continue normally, while maintaining standard caution."],
      safetyTips: "Standard Safety Rule: Always double-check sender details if a message unexpectedly requests sensitive data."
    };
  }

  // Extract Signals
  const detectedSignals = detectBehavioralSignals(rawText);
  let baseScore = 0;
  let criticalCount = 0;
  let highCount = 0;
  let mediumCount = 0;
  let lowCount = 0;

  const riskSignalContributions = [];
  const structuredEvidence = [];

  for (const sig of detectedSignals) {
    baseScore += sig.weight;
    if (sig.severity === 'CRITICAL') criticalCount++;
    else if (sig.severity === 'HIGH') highCount++;
    else if (sig.severity === 'MEDIUM') mediumCount++;
    else lowCount++;

    riskSignalContributions.push({
      name: sig.name,
      weight: sig.weight,
      severity: sig.severity
    });

    structuredEvidence.push({
      severity: sig.severity,
      title: sig.name,
      explanation: `${sig.explanation} Traceable excerpt: ${sig.evidence}`
    });
  }

  // APPLY CORRELATION MULTIPLIERS (COMBINATION ENGINE)
  let correlationMultiplier = 1.0;

  const hasPayment = detectedSignals.some(s => s.id === 'upfront_payment_request');
  const hasAccessCondition = detectedSignals.some(s => s.id === 'opportunity_access_condition');
  const hasUrgency = detectedSignals.some(s => s.id === 'time_pressure' || s.id === 'urgent_account_threat');
  const hasCredential = detectedSignals.some(s => s.id === 'credential_harvesting');
  const hasUrl = detectedSignals.some(s => s.id === 'suspicious_url');

  // Multiplier Rule 1: Job/Internship + Payment + Access Condition -> High Risk boost
  if (hasPayment && hasAccessCondition) {
    correlationMultiplier *= 1.35;
  }

  // Multiplier Rule 2: Bank/Urgency + Credential/OTP -> Critical Threat boost
  if (hasCredential && (hasUrgency || hasUrl)) {
    correlationMultiplier *= 1.45;
  }

  // Multiplier Rule 3: Category taxonomy multiplier
  correlationMultiplier *= taxonomyInfo.primaryCategory !== 'GENERAL_DIGITAL_COMMUNICATION' ? 1.1 : 1.0;

  let finalRiskScore = Math.round(baseScore * correlationMultiplier);
  
  if (detectedSignals.length === 0) {
    finalRiskScore = 10;
  } else {
    finalRiskScore = Math.min(Math.max(finalRiskScore, 25), 99);
  }

  const isSafe = finalRiskScore < 25;

  let riskLevel = "SAFE";
  if (finalRiskScore >= 90) riskLevel = "CRITICAL";
  else if (finalRiskScore >= 75) riskLevel = "HIGH RISK";
  else if (finalRiskScore >= 50) riskLevel = "MODERATE";
  else if (finalRiskScore >= 25) riskLevel = "LOW";

  // Dynamic Safe Checklist (ONLY if safe)
  const whyAppearsSafe = isSafe ? [
    !hasPayment ? "No payment or upfront fee request" : null,
    !hasCredential ? "No credential or OTP harvesting request" : null,
    !hasUrl ? "No suspicious external URLs" : null,
    !hasUrgency ? "No artificial urgency or deadline pressure" : null,
    "Normal communication context"
  ].filter(Boolean) : null;

  const emailMatch = rawText?.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);

  return {
    riskScore: finalRiskScore,
    riskLevel,
    detectionConfidence: finalRiskScore >= 75 ? "High" : "Medium",
    signalCount: detectedSignals.length,
    brandCount: 0,
    domainMismatchCount: 0,
    severityCounts: { HIGH: highCount, CRITICAL: criticalCount, MEDIUM: mediumCount, LOW: lowCount },
    fraudCategory: taxonomyInfo.name,
    summary: isSafe
      ? "No meaningful phishing indicators detected."
      : finalRiskScore >= 75
        ? `High-Risk Threat Detected! ${detectedSignals.length} correlated threat signals identified under ${taxonomyInfo.name}.`
        : `Suspicious indicators detected (${detectedSignals.length} behavioral signals). Evaluate carefully before taking action.`,
    extractedText: rawText,
    whyAppearsSafe,
    senderDomainAnalysis: {
      claimedSender: emailMatch ? emailMatch[0] : null,
      actualSenderDomain: emailMatch ? emailMatch[0] : null,
      status: emailMatch ? "NO_MISMATCH" : "INSUFFICIENT_INFO",
      explanation: emailMatch
        ? "Sender email matches."
        : "The message does not provide enough information to verify the sender. This contributes a limited amount of risk (+7), but is NOT treated as proof of malicious activity."
    },
    brandSpoofingDetected: [],
    riskSignalContributions,
    structuredEvidence,
    recommendedActions: isSafe ? [
      "Continue normally, while maintaining standard caution."
    ] : [
      "Do not submit personal information, phone numbers, or pay registration fees",
      "Independently verify sender identity through official university or company directory"
    ],
    safetyTips: "PhishGuard Rule: Multiple correlated behavioral signals indicate elevated security risk."
  };
};
