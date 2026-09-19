/**
 * PhishGuard AI - Comprehensive Threat Taxonomy
 * Covers 10 major threat categories across digital communication channels.
 */

export const THREAT_TAXONOMY = {
  JOB_INTERNSHIP_FRAUD: {
    id: 'JOB_INTERNSHIP_FRAUD',
    name: 'Job & Internship Recruitment Fraud',
    description: 'Deceptive employment, fake internship offers, remote data-entry scams, or shortlisting schemes demanding fees or personal data.',
    subcategories: [
      'fake internship', 'fake job offer', 'fake recruitment', 'fake interview',
      'fake shortlist', 'fake placement', 'fake campus opportunity', 'fake work-from-home job',
      'fake remote job', 'fake data-entry job', 'fake part-time job', 'fake training program',
      'fake certification', 'fake recruitment agency', 'fake HR recruiter', 'fake employee referral',
      'fake onboarding', 'fake background verification'
    ],
    indicatorPatterns: [
      /internship/i, /job offer/i, /recruitment/i, /interview/i, /shortlisted/i, /placement/i,
      /campus opportunity/i, /work from home/i, /remote job/i, /data entry/i, /part-time/i,
      /training program/i, /onboarding/i, /candidate verification/i, /hiring team/i
    ],
    riskWeightMultiplier: 1.2
  },

  FINANCIAL_FRAUD: {
    id: 'FINANCIAL_FRAUD',
    name: 'Advance Fee & Financial Fraud',
    description: 'Demands for upfront registration, security deposits, processing charges, fake rewards, or unearned loan/scholarship approvals.',
    subcategories: [
      'advance fee', 'registration fee', 'refundable fee', 'processing fee',
      'security deposit', 'booking fee', 'activation fee', 'verification fee',
      'training fee', 'account upgrade fee', 'refund scam', 'fake cashback',
      'fake prize', 'fake investment', 'fake loan', 'fake scholarship'
    ],
    indicatorPatterns: [
      /advance fee/i, /registration fee/i, /refundable/i, /processing fee/i, /security deposit/i,
      /booking fee/i, /activation fee/i, /verification fee/i, /training fee/i, /account upgrade/i,
      /cashback/i, /claim prize/i, /loan approved/i, /scholarship granted/i
    ],
    riskWeightMultiplier: 1.3
  },

  BANKING_PAYMENT_FRAUD: {
    id: 'BANKING_PAYMENT_FRAUD',
    name: 'Banking, OTP & Payment Phishing',
    description: 'Spoofed banking alerts, OTP harvesting, UPI request fraud, QR code traps, or account lock threats.',
    subcategories: [
      'OTP theft', 'UPI fraud', 'card verification', 'account suspension',
      'KYC fraud', 'fake banking support', 'fake payment reversal', 'fake transaction alert',
      'fake refund', 'fake QR payment', 'fake payment request', 'fake merchant support'
    ],
    indicatorPatterns: [
      /otp/i, /upi/i, /card verification/i, /account suspended/i, /kyc/i, /banking support/i,
      /transaction alert/i, /payment reversal/i, /scan qr/i, /enter pin/i, /pan card/i, /hdfc/i, /sbi/i, /icici/i
    ],
    riskWeightMultiplier: 1.5
  },

  COLLEGE_STUDENT_FRAUD: {
    id: 'COLLEGE_STUDENT_FRAUD',
    name: 'Campus & Academic Student Fraud',
    description: 'Impersonated college portals, fake placement notices, exam alerts, student verification, or co-branded MNC certificate claims.',
    subcategories: [
      'fake college notice', 'fake placement notice', 'fake scholarship', 'fake exam notification',
      'fake admission', 'fake certificate', 'fake internship', 'fake campus event',
      'fake student verification', 'fake student portal', 'fake faculty communication'
    ],
    indicatorPatterns: [
      /college notice/i, /placement notice/i, /scholarship/i, /exam notification/i, /admission/i,
      /co-branded/i, /student portal/i, /faculty communication/i, /university circular/i, /campus event/i
    ],
    riskWeightMultiplier: 1.1
  },

  GOVERNMENT_AUTHORITY_IMPERSONATION: {
    id: 'GOVERNMENT_AUTHORITY_IMPERSONATION',
    name: 'Government & Authority Impersonation',
    description: 'Fake tax notices, police threats, electricity disconnection alerts, legal summons, or official utility department scams.',
    subcategories: [
      'tax notice', 'police impersonation', 'court notice', 'government benefit scam',
      'identity verification', 'document verification', 'electricity department', 'telecom department',
      'government recruitment'
    ],
    indicatorPatterns: [
      /tax notice/i, /police/i, /court notice/i, /government benefit/i, /document verification/i,
      /electricity department/i, /power supply/i, /telecom/i, /cyber crime/i, /official summons/i
    ],
    riskWeightMultiplier: 1.4
  },

  DELIVERY_SHOPPING_FRAUD: {
    id: 'DELIVERY_SHOPPING_FRAUD',
    name: 'E-Commerce & Courier Delivery Fraud',
    description: 'Fake delivery attempt notifications, customs clearance charges, order refund lures, or spoofed e-commerce sites.',
    subcategories: [
      'fake courier', 'failed delivery', 'customs fee', 'parcel verification',
      'fake Amazon/Flipkart-style message', 'fake refund', 'fake order cancellation', 'fake COD issue'
    ],
    indicatorPatterns: [
      /courier/i, /failed delivery/i, /customs fee/i, /parcel verification/i, /amazon/i, /flipkart/i,
      /order cancellation/i, /cod issue/i, /delivery update/i, /package on hold/i
    ],
    riskWeightMultiplier: 1.2
  },

  ACCOUNT_IDENTITY_FRAUD: {
    id: 'ACCOUNT_IDENTITY_FRAUD',
    name: 'Account Takeover & Identity Harvesting',
    description: 'Credential harvesting forms, password reset traps, social media account compromise, or document collection scams.',
    subcategories: [
      'password reset', 'account suspension', 'identity verification', 'KYC',
      'credential harvesting', 'social media takeover', 'email takeover', 'student portal takeover'
    ],
    indicatorPatterns: [
      /password reset/i, /account locked/i, /identity verification/i, /login credentials/i,
      /social media takeover/i, /email account/i, /verify account/i, /security check/i
    ],
    riskWeightMultiplier: 1.3
  },

  INVESTMENT_CRYPTO_FRAUD: {
    id: 'INVESTMENT_CRYPTO_FRAUD',
    name: 'Investment & Cryptocurrency Schemes',
    description: 'Guaranteed high return promises, fake crypto platforms, trading signal channels, or rapid wealth multipliers.',
    subcategories: [
      'guaranteed returns', 'investment opportunity', 'trading signal', 'crypto doubling',
      'fake investment platform', 'fake financial advisor'
    ],
    indicatorPatterns: [
      /guaranteed returns/i, /investment opportunity/i, /trading signal/i, /crypto doubling/i,
      /daily ROI/i, /passive income/i, /binary options/i, /forex signal/i
    ],
    riskWeightMultiplier: 1.3
  },

  ROMANCE_SOCIAL_ENGINEERING: {
    id: 'ROMANCE_SOCIAL_ENGINEERING',
    name: 'Social Engineering & Emergency Scams',
    description: 'Impersonated friends/relatives in urgent distress, emergency money transfer lures, or trust exploitation.',
    subcategories: [
      'emergency money request', 'fake relationship', 'impersonated friend', 'fake family emergency',
      'emotional manipulation'
    ],
    indicatorPatterns: [
      /emergency money/i, /send money immediately/i, /hospital emergency/i, /stranded/i,
      /family emergency/i, /friend in need/i, /need cash urgent/i, /hi mum/i, /hi dad/i, /hi mom/i,
      /dropped my phone/i, /temporary number/i, /card isn't working/i, /message me back/i, /train ticket/i
    ],
    riskWeightMultiplier: 1.2
  },

  TECH_SUPPORT_FRAUD: {
    id: 'TECH_SUPPORT_FRAUD',
    name: 'Tech Support & Remote Access Fraud',
    description: 'Fake virus warnings, unauthorized Microsoft/Google support alerts, or requests to install remote access tools.',
    subcategories: [
      'fake antivirus', 'fake account support', 'fake Microsoft/Google/Apple support',
      'remote-access request', 'fake security alert'
    ],
    indicatorPatterns: [
      /antivirus/i, /virus detected/i, /microsoft support/i, /apple support/i, /google security/i,
      /anydesk/i, /teamviewer/i, /remote access/i, /call tech support/i
    ],
    riskWeightMultiplier: 1.3
  }
};

/**
 * Classify raw text into matching taxonomy categories
 */
export const classifyTaxonomyCategory = (rawText) => {
  const content = (rawText || '').toLowerCase();
  const matchedCategories = [];

  for (const [key, category] of Object.entries(THREAT_TAXONOMY)) {
    const hasMatch = category.indicatorPatterns.some(pattern => pattern.test(content));
    if (hasMatch) {
      matchedCategories.push(category);
    }
  }

  if (matchedCategories.length === 0) {
    return {
      primaryCategory: 'GENERAL_DIGITAL_COMMUNICATION',
      name: 'General Communication',
      matchedCategories: []
    };
  }

  // Sort by highest risk multiplier
  matchedCategories.sort((a, b) => b.riskWeightMultiplier - a.riskWeightMultiplier);

  return {
    primaryCategory: matchedCategories[0].id,
    name: matchedCategories[0].name,
    description: matchedCategories[0].description,
    matchedCategories
  };
};

