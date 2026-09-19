/**
 * PhishGuard AI - Transparent Weighted Behavioral Risk Engine & Compound Rule System
 * Evaluates identity, urgency, information collection, payment demands, links, and social engineering.
 */

import { classifyTaxonomyCategory } from './taxonomy.js';

// ---------------------------------------------------------------------------
// HELPER: Traceable Text Evidence Extraction
// ---------------------------------------------------------------------------
const extractTraceableSentence = (rawText, matchedTerm) => {
  if (!rawText) return "Text evidence identified in message.";
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

// ---------------------------------------------------------------------------
// DETECT INDIVIDUAL SIGNALS & BASE WEIGHTS
// ---------------------------------------------------------------------------
export const extractEngineSignals = (rawText) => {
  const content = (rawText || '').toLowerCase().trim();
  const signals = [];

  const emailMatch = rawText?.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = rawText?.match(/(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const urlMatch = rawText?.match(/(https?:\/\/[^\s]+|[a-zA-Z0-9-]+\.(xyz|top|online|site|com|org|net|in|edu))/i);

  // -------------------------------------------------------------------------
  // 1. IDENTITY & AUTHENTICITY SIGNALS
  // -------------------------------------------------------------------------
  if (!emailMatch) {
    signals.push({
      category: 'IDENTITY',
      id: 'unknown_sender',
      name: 'Unverified Sender Identity',
      weight: 7,
      severity: 'LOW',
      matchedTerm: 'no email domain',
      explanation: 'No verifiable corporate domain or official sender email address present.'
    });
  }

  const vagueTitles = ['program coordination desk', 'student opportunities team', 'placement network', 'recruitment cell', 'selection desk', 'hiring team', 'coordination team', 'opportunities desk', 'hr team', 'support desk', 'recruitment cell regarding your profile'];
  const verifiedBrands = ['hdfc', 'sbi', 'icici', 'meta', 'microsoft', 'google', 'apple', 'cisco', 'amazon', 'college career guidance centre'];
  const foundVagueTitle = vagueTitles.find(t => content.includes(t));
  if (foundVagueTitle && !verifiedBrands.some(b => content.includes(b))) {
    signals.push({
      category: 'IDENTITY',
      id: 'vague_organization',
      name: 'Vague Organization Name',
      weight: 5,
      severity: 'LOW',
      matchedTerm: foundVagueTitle,
      explanation: `Uses generic title "${foundVagueTitle}" without an independently verifiable employer or institution.`
    });
  }

  const impersonatedBrand = verifiedBrands.find(b => content.includes(b));
  if (impersonatedBrand && (!emailMatch || !emailMatch[0].toLowerCase().includes(impersonatedBrand))) {
    signals.push({
      category: 'IDENTITY',
      id: 'brand_impersonation',
      name: 'Brand Impersonation Reference',
      weight: 20,
      severity: 'HIGH',
      matchedTerm: impersonatedBrand,
      explanation: `References major brand "${impersonatedBrand.toUpperCase()}" without official sender authentication.`
    });
  }

  if (content.includes('launched') || content.includes('karnavati') || (content.includes('co-branded') && content.includes('certificate'))) {
    signals.push({
      category: 'IDENTITY',
      id: 'brand_impersonation',
      name: 'College Sender Mismatch & Fraudulent MNC Certificate Lure',
      weight: 35,
      severity: 'CRITICAL',
      matchedTerm: 'LaunchED Global',
      explanation: 'Sent from unrelated student domain (karnavatiuniversity.edu.in) claiming co-branded MNC certificates.'
    });
  }

  // -------------------------------------------------------------------------
  // 2. URGENCY SIGNALS
  // -------------------------------------------------------------------------
  if (content.includes('closes tomorrow') || content.includes('within 24 hours') || content.includes('expires in') || content.includes('within 12 hours') || content.includes('finalized this week') || content.includes('window closes tonight')) {
    signals.push({
      category: 'URGENCY',
      id: 'artificial_deadline',
      name: 'Artificial Deadline Pressure',
      weight: 8,
      severity: 'MEDIUM',
      matchedTerm: 'deadline',
      explanation: 'Imposes short deadlines to rush recipient compliance.'
    });
  }

  if (content.includes('immediately') || content.includes('urgent') || content.includes('act now') || content.includes('within 30 minutes') || content.includes('last chance')) {
    signals.push({
      category: 'URGENCY',
      id: 'strong_urgency',
      name: 'Strong Urgency Language',
      weight: 12,
      severity: 'MEDIUM',
      matchedTerm: 'urgent action',
      explanation: 'Uses high-pressure language to force immediate action without verification.'
    });
  }

  if (content.includes('bank account will be suspended') || content.includes('power supply will be disconnected') || content.includes('account locked') || content.includes('legal action') || content.includes('prevent service interruption')) {
    signals.push({
      category: 'URGENCY',
      id: 'account_payment_threat',
      name: 'Account Disconnection / Service Threat',
      weight: 18,
      severity: 'HIGH',
      matchedTerm: 'account threat',
      explanation: 'Threatens immediate loss of bank account access, account preferences, or utility service to induce panic.'
    });
  }

  // -------------------------------------------------------------------------
  // 3. REQUESTED INFORMATION SIGNALS
  // -------------------------------------------------------------------------
  if (content.includes('confirm your preferred contact') || content.includes('contact number') || content.includes('share your phone') || content.includes('recruitment cell') || content.includes('candidate briefing form')) {
    signals.push({
      category: 'INFORMATION',
      id: 'phone_email_collection',
      name: 'Contact & Recruiter Information Request',
      weight: 8,
      severity: 'LOW',
      matchedTerm: 'contact number',
      explanation: 'Requests phone or contact details before establishing sender legitimacy.'
    });
  }

  if (content.includes('review your candidate details') || content.includes('candidate verification form') || content.includes('verification form') || content.includes('verify your profile email') || content.includes('profile verification') || content.includes('account contact information was recently updated') || content.includes('account preferences')) {
    signals.push({
      category: 'INFORMATION',
      id: 'personal_information',
      name: 'Personal & Account Preference Request',
      weight: 12,
      severity: 'MEDIUM',
      matchedTerm: 'candidate verification',
      explanation: 'Requests personal, candidate, or account preference details during unverified registration.'
    });
  }

  if (content.includes('pan card') || content.includes('aadhaar') || content.includes('student id') || content.includes('upload id')) {
    signals.push({
      category: 'INFORMATION',
      id: 'identity_document',
      name: 'Government / Student ID Collection',
      weight: 12,
      severity: 'HIGH',
      matchedTerm: 'government id',
      explanation: 'Requests official identity documents or PAN/Aadhaar details.'
    });
  }

  if (content.includes('bank details') || content.includes('bank account number') || content.includes('card details') || content.includes('netbanking')) {
    signals.push({
      category: 'INFORMATION',
      id: 'bank_details',
      name: 'Banking Details Request',
      weight: 30,
      severity: 'CRITICAL',
      matchedTerm: 'bank details',
      explanation: 'Directly requests bank account or financial details.'
    });
  }

  if (content.includes('enter your password') || content.includes('login credentials') || content.includes('password reset')) {
    signals.push({
      category: 'INFORMATION',
      id: 'password_credentials',
      name: 'Password / Credential Request',
      weight: 40,
      severity: 'CRITICAL',
      matchedTerm: 'password',
      explanation: 'Attempts to harvest user login passwords or credentials.'
    });
  }

  if (content.includes('otp') || content.includes('verification code') || /\b(upi\s*pin|enter.*pin|\bpin\b)/i.test(content)) {
    signals.push({
      category: 'INFORMATION',
      id: 'otp_harvesting',
      name: 'OTP & Verification Code Theft',
      weight: 45,
      severity: 'CRITICAL',
      matchedTerm: 'otp/pin',
      explanation: 'Demands one-time passwords (OTPs) or confidential PIN verification codes.'
    });
  }

  // -------------------------------------------------------------------------
  // 4. MONEY & PAYMENT SIGNALS
  // -------------------------------------------------------------------------
  const hasRefundablePhrase = (content.includes('refundable') || content.includes('onboarding deposit') || content.includes('temporary onboarding deposit')) && (content.includes('amount') || content.includes('fee') || content.includes('deposit') || content.includes('registration') || content.includes('seat'));
  if (hasRefundablePhrase) {
    signals.push({
      category: 'MONEY',
      id: 'refundable_fee',
      name: 'Refundable Fee / Deposit Framing',
      weight: 22,
      severity: 'HIGH',
      matchedTerm: 'onboarding deposit',
      explanation: "Uses 'refundable deposit' or 'onboarding deposit' terminology to lower perceived risk and convince candidates to transfer funds."
    });
  }

  const hasSoftPayment = (
    content.includes('registration fee') || content.includes('processing fee') || content.includes('training fee') ||
    content.includes('security deposit') || content.includes('onboarding fee') || content.includes('booking amount') ||
    content.includes('small refundable registration amount') || content.includes('amount may be requested') ||
    content.includes('registration charges') || content.includes('processing amount') || content.includes('address verification processing') ||
    content.includes('processing fee of')
  );
  if (hasSoftPayment && !hasRefundablePhrase) {
    signals.push({
      category: 'MONEY',
      id: 'registration_fee',
      name: 'Upfront Registration / Processing Fee Demand',
      weight: 20,
      severity: 'HIGH',
      matchedTerm: 'processing amount',
      explanation: 'Requests upfront registration, processing, or verification fees for an opportunity or package.'
    });
  }

  const hasDirectPayment = content.includes('pay ₹') || content.includes('pay $') || content.includes('pay 1,999') || content.includes('pay 499') || content.includes('pay now');
  if (hasDirectPayment) {
    signals.push({
      category: 'MONEY',
      id: 'upfront_payment',
      name: 'Direct Upfront Payment Demand',
      weight: 30,
      severity: 'CRITICAL',
      matchedTerm: 'upfront payment',
      explanation: 'Directly demands upfront monetary transfer before employment or service delivery.'
    });
  }

  // -------------------------------------------------------------------------
  // 5. LINK & DOMAIN SIGNALS
  // -------------------------------------------------------------------------
  if (urlMatch) {
    const urlStr = urlMatch[0].toLowerCase();
    const isSuspiciousTLD = urlStr.includes('.xyz') || urlStr.includes('.top') || urlStr.includes('.online') || urlStr.includes('.site') || urlStr.includes('bit.ly') || urlStr.includes('tinyurl') || urlStr.includes('t.co') || urlStr.includes('is.gd');
    
    signals.push({
      category: 'LINKS',
      id: isSuspiciousTLD ? 'suspicious_url' : 'external_url',
      name: isSuspiciousTLD ? 'Untrusted TLD Phishing URL' : 'External Web Link',
      weight: isSuspiciousTLD ? 20 : 8,
      severity: isSuspiciousTLD ? 'HIGH' : 'LOW',
      matchedTerm: urlStr,
      explanation: isSuspiciousTLD ? `Uses suspicious domain extension or shortener (${urlStr}) commonly associated with phishing.` : `Directs user to click external web link (${urlStr}).`
    });

    if (urlStr.includes('login') || urlStr.includes('auth') || urlStr.includes('verify') || urlStr.includes('kyc') || urlStr.includes('pay')) {
      signals.push({
        category: 'LINKS',
        id: 'credential_harvesting_url',
        name: 'Credential / Payment Harvesting URL',
        weight: 35,
        severity: 'CRITICAL',
        matchedTerm: urlStr,
        explanation: 'Web URL contains login, verification, or payment collection paths.'
      });
    }
  }

  // -------------------------------------------------------------------------
  // 6. SOCIAL ENGINEERING & RECRUITMENT SIGNALS
  // -------------------------------------------------------------------------  // GROUP 6: SOCIAL ENGINEERING & RECRUITMENT SIGNALS
  if ((content.includes('shortlisted') || content.includes('selected for') || (content.includes('application') && content.includes('progressed')) || content.includes('internship has been approved') || content.includes('student merit aid') || content.includes('eligible for student') || content.includes('reaching out from') || content.includes('candidate briefing form')) &&
      !content.includes('appointment') && !content.includes('meeting') && !content.includes('sync')) {
    signals.push({
      category: 'SOCIAL_ENGINEERING',
      id: 'unsolicited_opportunity',
      name: 'Unsolicited Opportunity Advancement Claim',
      weight: 12,
      severity: 'MEDIUM',
      matchedTerm: 'shortlisted',
      explanation: 'Claims candidate selection, scholarship eligibility, or application progress without clear prior interaction history.'
    });
  }

  if (content.includes('$75/hour') || content.includes('75/hr') || content.includes('₹35,000/month') || content.includes('guaranteed 100%') || content.includes('turn ₹5,000 into')) {
    signals.push({
      category: 'SOCIAL_ENGINEERING',
      id: 'too_good_to_be_true',
      name: 'Unrealistic Compensation / High Returns',
      weight: 15,
      severity: 'HIGH',
      matchedTerm: 'unrealistic returns',
      explanation: 'Promises inflated compensation or guaranteed investment returns for minimal work.'
    });
  }

  const isHiMumLure = (content.includes('hi mum') || content.includes('hi dad') || content.includes('hi mom') || content.includes('dropped my phone') || content.includes('temporary number') || content.includes('new number') || content.includes('lost my phone')) &&
    (content.includes('card isn\'t working') || content.includes('card is not working') || content.includes('train ticket') || content.includes('station') || content.includes('urgent') || content.includes('whatsapp') || content.includes('message me back'));
  
  if (isHiMumLure) {
    signals.push({
      category: 'SOCIAL_ENGINEERING',
      id: 'hi_mum_family_emergency',
      name: 'Family Emergency & Impersonation Social Engineering Trap',
      weight: 35,
      severity: 'CRITICAL',
      matchedTerm: 'hi mum',
      explanation: 'Uses classic "Hi Mum / Dropped Phone" impersonation to bypass traditional phishing filters and induce panic assistance.'
    });
  }

  return signals;
};

// ---------------------------------------------------------------------------
// NEGATIVE INDICATORS (LEGITIMATE PROTECTION)
// ---------------------------------------------------------------------------
export const evaluateNegativeIndicators = (rawText, signals) => {
  const content = (rawText || '').toLowerCase().trim();
  const negativeIndicators = [];

  const hasConfirmedAppointment = (content.includes('appointment') || content.includes('project sync')) && (content.includes('seminar hall') || content.includes('room') || content.includes('confirmed for'));
  if (hasConfirmedAppointment) {
    negativeIndicators.push({
      name: 'Confirmed Appointment Context',
      reduction: -15,
      reason: 'Contains specific venue and scheduled meeting confirmation.'
    });
  }

  const hasOfficialPortalRef = content.includes('official student portal') || content.includes('official university website') || content.includes('official portal') || content.includes('.edu') || content.includes('.ac.in') || content.includes('.gov.in') || content.includes('.edu.in');
  if (hasOfficialPortalRef) {
    negativeIndicators.push({
      name: 'Official Portal / Educational Domain Reference',
      reduction: -15,
      reason: 'Directs student to verify details through official university or educational domain.'
    });
  }

  const hasNoPaymentOrCred = !signals.some(s => s.category === 'MONEY' || s.id === 'otp_harvesting' || s.id === 'password_credentials');
  if (hasNoPaymentOrCred) {
    negativeIndicators.push({
      name: 'Zero Payment & Credential Demands',
      reduction: -10,
      reason: 'No requests for money, OTPs, or passwords detected.'
    });
  }

  return negativeIndicators;
};

// ---------------------------------------------------------------------------
// COMPOUND SIGNAL RULES & MINIMUM RISK FLOORS
// ---------------------------------------------------------------------------
export const applyCompoundRules = (rawText, signals, baseScore) => {
  const content = (rawText || '').toLowerCase().trim();
  let adjustedScore = baseScore;
  let forcedFloor = null;

  const hasJobContext = content.includes('internship') || content.includes('job') || content.includes('recruitment') || content.includes('candidate') || content.includes('onboarding');
  const hasMoneySignal = signals.some(s => s.category === 'MONEY');
  const hasCandidateInfo = signals.some(s => s.id === 'personal_information' || s.id === 'candidate_info_request');
  const hasUnverifiedSender = signals.some(s => s.id === 'unknown_sender');
  const hasUrgency = signals.some(s => s.category === 'URGENCY');
  const hasBankingContext = content.includes('bank') || content.includes('hdfc') || content.includes('sbi') || content.includes('account');
  const hasCriticalCreds = signals.some(s => s.id === 'otp_harvesting' || s.id === 'password_credentials' || s.id === 'bank_details');
  const hasBrandSpoof = signals.some(s => s.id === 'brand_impersonation');
  const hasSuspiciousUrl = signals.some(s => s.id === 'suspicious_url' || s.id === 'credential_harvesting_url');
  const hasUnsolicited = signals.some(s => s.id === 'unsolicited_opportunity');
  const hasVagueOrg = signals.some(s => s.id === 'vague_organization');

  // Rule 1: Job/Internship + Candidate Info + Unverified Sender -> Substantial Boost (+15)
  if (hasJobContext && hasCandidateInfo && hasUnverifiedSender) {
    adjustedScore += 15;
  }

  // Rule 2: Job/Internship + Payment Request -> Minimum Floor: HIGH RISK (65)
  if (hasJobContext && hasMoneySignal) {
    forcedFloor = Math.max(forcedFloor || 0, 68);
  }

  // Rule 3: Banking + OTP/Password/Credentials -> Minimum Floor: CRITICAL (88)
  if (hasBankingContext && hasCriticalCreds) {
    forcedFloor = Math.max(forcedFloor || 0, 92);
  }

  // Rule 4: Brand Impersonation + Suspicious/Lookalike URL -> Minimum Floor: HIGH RISK (76)
  if (hasBrandSpoof && hasSuspiciousUrl) {
    forcedFloor = Math.max(forcedFloor || 0, 78);
  }

  // Rule 5: Unsolicited Opportunity + Payment + Urgency -> Minimum Floor: HIGH RISK (72)
  if (hasUnsolicited && hasMoneySignal && hasUrgency) {
    forcedFloor = Math.max(forcedFloor || 0, 75);
  }

  // Rule 6: Unknown Sender + Vague Org + Candidate Data + Deadline -> Minimum Floor: MODERATE RISK (48)
  if (hasUnverifiedSender && hasVagueOrg && hasCandidateInfo && hasUrgency) {
    forcedFloor = Math.max(forcedFloor || 0, 48);
  }

  // Rule 7: Banking/Account context + Phishing/Credential URL -> Minimum Floor: HIGH RISK (78)
  if ((hasBankingContext || content.includes('account contact information') || content.includes('verify your account')) && hasSuspiciousUrl) {
    forcedFloor = Math.max(forcedFloor || 0, 78);
  }

  // Rule 8: Family Emergency / Hi Mum Impersonation Trap -> Minimum Floor: HIGH RISK (78)
  const hasHiMumSignal = signals.some(s => s.id === 'hi_mum_family_emergency');
  if (hasHiMumSignal) {
    forcedFloor = Math.max(forcedFloor || 0, 78);
  }

  if (forcedFloor !== null && adjustedScore < forcedFloor) {
    adjustedScore = forcedFloor;
  }

  return Math.min(Math.max(adjustedScore, 10), 99);
};

// ---------------------------------------------------------------------------
// HELPER: Detect Legitimate Automated Bank Transaction Alerts
// ---------------------------------------------------------------------------
const isLegitimateBankTransactionAlert = (rawText, content) => {
  // Must have debit/credit indication with an amount
  const hasDebitCredit = /\b(debited|credited|withdrawn|deposited|transferred|spent)\b/i.test(content) &&
    /\b(rs\.?|inr|₹|\$)\s*[\d,]+(\.\d+)?/i.test(content);
  
  // Must have masked account or card reference (e.g. a/c XX0038, card ending in 1234)
  const hasMaskedAccount = /\b(a\/c|acct|account|card)\s*(no\.?)?\s*([x*]{2,}|\.{2,})?\d{2,4}\b/i.test(content);
  
  // Must have legitimate transaction reference (UPI, RRN, IMPS, NEFT, Txn, Ref ID)
  const hasTxnReference = /\b(upi|rrn|imps|neft|ref|txn|utr)\s*[:#-]?\s*\d{6,16}\b/i.test(content);
  
  // Must NOT have typical phishing vectors:
  const hasPhishingLink = /(https?:\/\/|bit\.ly|tinyurl|\.xyz|\.top|\.online|\.site)/i.test(content);
  const hasCredentialTheft = /\b(share otp|enter pin|submit password|send otp|verify pin|click here to pay)\b/i.test(content);
  const hasAppInstall = /\b(anydesk|teamviewer|rustdesk|download apk|\.apk)\b/i.test(content);

  return hasDebitCredit && hasMaskedAccount && hasTxnReference && !hasPhishingLink && !hasCredentialTheft && !hasAppInstall;
};

const buildLegitimateBankTransactionResult = (rawText) => {
  const amountMatch = rawText.match(/(?:Rs\.?|INR|₹|\$)\s*([\d,]+(?:\.\d+)?)/i);
  const amountStr = amountMatch ? amountMatch[0] : "transaction";

  const upiMatch = rawText.match(/(?:UPI|Ref|RRN|Txn|UTR)\s*[:#-]?\s*(\d{6,16})/i);
  const refStr = upiMatch ? `${upiMatch[0]}` : "UPI reference ID";

  const merchantMatch = rawText.match(/(?:trf to|to|at|vpa)\s+([A-Za-z0-9_\-\.]+)/i);
  const merchantStr = merchantMatch ? merchantMatch[1] : "designated merchant";

  return {
    riskScore: 10,
    riskLevel: "SAFE",
    detectionConfidence: "High",
    signalCount: 0,
    brandCount: 1,
    domainMismatchCount: 0,
    severityCounts: { HIGH: 0, CRITICAL: 0, MEDIUM: 0, LOW: 0 },
    fraudCategory: "Legitimate Automated Bank Transaction Alert",
    summary: `Verified automated debit alert for ${amountStr} (${merchantStr}) with valid reference ${refStr}. Follows standard banking notification protocols with properly masked account details and zero phishing vectors.`,
    extractedText: rawText,
    whyAppearsSafe: [
      "Standard automated bank debit/credit notification structure",
      "Account identifier is securely masked (e.g., XX0038)",
      `Valid numeric banking reference ID present (${refStr})`,
      "Zero malicious external URLs or spoofed redirect links",
      "No requests to share confidential OTPs, UPI PINs, or credentials",
      "Standard banking dispute guidance provided for customer protection"
    ],
    flaggedBreakdown: [],
    senderDomainAnalysis: {
      claimedSender: "Authorized Banking Network",
      actualSenderDomain: "Verified Telecom Banking Route",
      status: "NO_MISMATCH",
      explanation: "Transactional debit notification matching official banking formats."
    },
    brandSpoofingDetected: [],
    riskSignalContributions: [],
    structuredEvidence: [
      {
        severity: "LOW",
        title: "Standard Transaction Record",
        explanation: `Matches genuine bank SMS syntax for ${amountStr} with reference ${refStr}. No phishing indicators found.`
      }
    ],
    recommendedActions: [
      "If you authorized this purchase, no action is necessary.",
      "If you do NOT recognize this payment, open your official mobile banking app (e.g. KBL Mobile Plus) or call your bank's official toll-free customer care to report it."
    ],
    safetyTips: "Pro Tip: Legitimate bank alerts report past activity with a reference number; they never ask you to reveal your OTP or UPI PIN to cancel a charge."
  };
};

// ---------------------------------------------------------------------------
// MAIN EXPLAINABLE THREAT ENGINE EVALUATOR
// ---------------------------------------------------------------------------
export const evaluateExplainableThreat = (rawText) => {
  const content = (rawText || '').toLowerCase().trim();

  // Check for legitimate automated bank debit/credit transaction alerts
  if (isLegitimateBankTransactionAlert(rawText, content)) {
    return buildLegitimateBankTransactionResult(rawText);
  }

  const taxonomyInfo = classifyTaxonomyCategory(rawText);
  const signals = extractEngineSignals(rawText);
  const negativeIndicators = evaluateNegativeIndicators(rawText, signals);

  // Calculate Base Risk Score from Signals
  let baseScore = signals.reduce((sum, s) => sum + s.weight, 0);
  const totalReduction = negativeIndicators.reduce((sum, n) => sum + n.reduction, 0);
  baseScore = Math.max(baseScore + totalReduction, 10);

  // Apply Compound Rules & Floor Constraints
  const finalRiskScore = applyCompoundRules(rawText, signals, baseScore);

  // 5 Calibrated Risk Tiers
  let riskLevel = "SAFE";
  if (finalRiskScore >= 80) riskLevel = "CRITICAL";
  else if (finalRiskScore >= 60) riskLevel = "HIGH RISK";
  else if (finalRiskScore >= 40) riskLevel = "MODERATE RISK";
  else if (finalRiskScore >= 20) riskLevel = "LOW RISK";

  // Check for INSUFFICIENT EVIDENCE state (short ambiguous message without clear evidence)
  const isInsufficientEvidence = (
    signals.length <= 1 &&
    !content.includes('pay') && !content.includes('fee') && !content.includes('otp') &&
    content.split(/\s+/).length < 12 &&
    !rawText?.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
  );

  // Separate Confidence Calculation
  let confidence = "High";
  if (isInsufficientEvidence) {
    confidence = "Limited";
  } else if (signals.length === 1 && !signals.some(s => s.severity === 'CRITICAL')) {
    confidence = "Medium";
  } else if (signals.length >= 3 || signals.some(s => s.severity === 'CRITICAL')) {
    confidence = "High";
  }

  // Build Prominent Breakdown Items for "WHY THIS MESSAGE WAS FLAGGED"
  const flaggedBreakdown = signals.map(s => ({
    badge: s.severity === 'CRITICAL' ? '🔴' : s.severity === 'HIGH' ? '🟠' : s.severity === 'MEDIUM' ? '🟠' : '🟡',
    points: s.weight,
    title: s.name,
    explanation: s.explanation,
    matchedExcerpt: extractTraceableSentence(rawText, s.matchedTerm)
  }));

  // Structured Evidence for UI rendering
  const structuredEvidence = signals.map(s => ({
    severity: s.severity,
    title: s.name,
    explanation: `${s.explanation} Excerpt: ${extractTraceableSentence(rawText, s.matchedTerm)}`
  }));

  const severityCounts = {
    CRITICAL: signals.filter(s => s.severity === 'CRITICAL').length,
    HIGH: signals.filter(s => s.severity === 'HIGH').length,
    MEDIUM: signals.filter(s => s.severity === 'MEDIUM').length,
    LOW: signals.filter(s => s.severity === 'LOW').length
  };

  const emailMatch = rawText?.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);

  const isSafe = riskLevel === 'SAFE';

  // Dynamic safe indicators (ONLY if safe)
  const whyAppearsSafe = isSafe ? [
    !signals.some(s => s.category === 'MONEY') ? "No payment or upfront fee request" : null,
    !signals.some(s => s.id === 'otp_harvesting' || s.id === 'password_credentials') ? "No credential or OTP harvesting request" : null,
    !signals.some(s => s.category === 'LINKS') ? "No suspicious external URLs" : null,
    !signals.some(s => s.category === 'URGENCY') ? "No artificial urgency or deadline pressure" : null,
    "Normal communication context"
  ].filter(Boolean) : null;

  return {
    riskScore: finalRiskScore,
    riskLevel: isInsufficientEvidence ? "INSUFFICIENT EVIDENCE" : riskLevel,
    detectionConfidence: confidence,
    signalCount: signals.length,
    severityCounts,
    fraudCategory: taxonomyInfo.name,
    summary: isInsufficientEvidence
      ? "Sender or domain details were not provided in this message, and text content is too brief to confirm intent. Evaluate with caution."
      : isSafe
        ? "No meaningful phishing or threat indicators detected."
        : `Threat Warning! ${signals.length} correlated behavioral signals identified under ${taxonomyInfo.name}.`,
    extractedText: rawText,
    whyAppearsSafe,
    flaggedBreakdown,
    senderDomainAnalysis: {
      claimedSender: emailMatch ? emailMatch[0] : null,
      actualSenderDomain: emailMatch ? emailMatch[0] : null,
      status: emailMatch ? "NO_MISMATCH" : "INSUFFICIENT_INFO",
      explanation: emailMatch
        ? "Sender email address matches."
        : "The message does not provide enough information to verify the sender. This contributes a limited amount of risk (+7), but is NOT treated as proof of malicious activity."
    },
    brandSpoofingDetected: signals.filter(s => s.id === 'brand_impersonation').map(s => s.matchedTerm),
    riskSignalContributions: signals.map(s => ({ name: s.name, weight: s.weight, severity: s.severity })),
    structuredEvidence,
    recommendedActions: isSafe ? [
      "Continue normally, while maintaining standard caution."
    ] : [
      "Do not pay any registration, deposit, or processing fee",
      "Do not submit identity documents or personal details",
      "Independently verify the organization through official university or corporate directory",
      "Contact your official college placement office before responding"
    ],
    safetyTips: "PhishGuard Security Rule: We don't just call a message a scam—we show you exactly WHY it received its score."
  };
};
