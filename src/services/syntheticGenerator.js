/**
 * PhishGuard AI - Synthetic Scenario Test Generator
 * Programmatically generates controlled test matrix variations across 10 taxonomy categories and 4 risk levels.
 */

import { THREAT_TAXONOMY } from './taxonomy.js';

const SENDER_TEMPLATES = [
  'Program Coordination Desk', 'Student Opportunities Team', 'Placement Cell',
  'HDFC Bank Support', 'State Electricity Board', 'Customs Parcel Clearance',
  'Global Career Portal', 'National IT Desk', 'University Examination Branch'
];

const CHANNELS = ['Email', 'SMS', 'WhatsApp', 'Screenshot OCR', 'Plain Text'];

/**
 * Generate a programmatic test matrix of N synthetic scenarios
 */
export const generateSyntheticTestMatrix = (targetCount = 400) => {
  const scenarios = [];

  const safeTemplates = [
    {
      category: 'COLLEGE_STUDENT_FRAUD',
      template: (org) => `Your appointment with the ${org} is confirmed for Wednesday at 2:30 PM in Seminar Hall 2. If you need to reschedule, use the appointment section of the official student portal.`,
      expectedRisk: 'SAFE'
    },
    {
      category: 'JOB_INTERNSHIP_FRAUD',
      template: (org) => `Please review the upcoming campus placement guidelines and internship fee structures on the official university portal.`,
      expectedRisk: 'SAFE'
    },
    {
      category: 'BANKING_PAYMENT_FRAUD',
      template: (org) => `Your monthly account statement for September is now available for download on your official mobile banking app.`,
      expectedRisk: 'SAFE'
    },
    {
      category: 'DELIVERY_SHOPPING_FRAUD',
      template: (org) => `Your parcel has been delivered to your front door reception by your local courier agent.`,
      expectedRisk: 'SAFE'
    }
  ];

  const subtleScamTemplates = [
    {
      category: 'JOB_INTERNSHIP_FRAUD',
      template: (org) => `Your profile has been shortlisted for the next stage. Please confirm your preferred contact number and complete the candidate verification form before tomorrow.`,
      expectedRisk: 'LOW'
    },
    {
      category: 'COLLEGE_STUDENT_FRAUD',
      template: (org) => `Important notice from ${org}: Candidate verification is underway. Complete your contact details update at your earliest convenience.`,
      expectedRisk: 'LOW'
    },
    {
      category: 'ACCOUNT_IDENTITY_FRAUD',
      template: (org) => `Security update notice from ${org}: Please verify your profile email address to maintain uninterrupted access.`,
      expectedRisk: 'LOW'
    }
  ];

  const highRiskTemplates = [
    {
      category: 'JOB_INTERNSHIP_FRAUD',
      template: (org) => `Your application for the campus technology program has progressed successfully. To complete the final registration step, please review your candidate details and confirm your participation. A small refundable registration amount may be requested during the process to reserve your onboarding slot. The current intake is being finalized this week, so please complete the confirmation at your earliest convenience. Thank you, ${org}`,
      expectedRisk: 'HIGH RISK'
    },
    {
      category: 'FINANCIAL_FRAUD',
      template: (org) => `Congratulations! Selected for Remote Data Entry. Salary ₹35,000/month. To confirm your seat and receive laptop, pay ₹499 refundable registration fee within 2 hours via http://globaltech-verify-seat.xyz/pay`,
      expectedRisk: 'HIGH RISK'
    },
    {
      category: 'DELIVERY_SHOPPING_FRAUD',
      template: (org) => `Delivery Alert: Package on hold due to unpaid customs clearance charge of ₹120. Pay now at http://express-parcel-customs.top to release shipment.`,
      expectedRisk: 'HIGH RISK'
    }
  ];

  const criticalRiskTemplates = [
    {
      category: 'BANKING_PAYMENT_FRAUD',
      template: (org) => `ALERT: Your HDFC Bank account has been temporarily locked due to suspicious login attempt. Update your PAN card details within 12 hours: https://hdfc-pan-kyc-update.online and enter your OTP immediately.`,
      expectedRisk: 'CRITICAL'
    },
    {
      category: 'GOVERNMENT_AUTHORITY_IMPERSONATION',
      template: (org) => `Dear Customer, Your electricity power supply will be disconnected tonight at 9:30 PM because your previous month bill was not updated. Immediately contact our officer or pay via http://ebill-update-portal.top`,
      expectedRisk: 'CRITICAL'
    },
    {
      category: 'ACCOUNT_IDENTITY_FRAUD',
      template: (org) => `URGENT: Security alert from ${org}. Your password will expire in 30 minutes. Verify your account and enter your OTP now at http://portal-auth-reset.online`,
      expectedRisk: 'CRITICAL'
    }
  ];

  const allTemplates = [
    ...safeTemplates,
    ...subtleScamTemplates,
    ...highRiskTemplates,
    ...criticalRiskTemplates
  ];

  let idCounter = 1;

  while (scenarios.length < targetCount) {
    const templateObj = allTemplates[scenarios.length % allTemplates.length];
    const sender = SENDER_TEMPLATES[scenarios.length % SENDER_TEMPLATES.length];
    const channel = CHANNELS[scenarios.length % CHANNELS.length];

    scenarios.push({
      id: `SYNTHETIC-${idCounter++}`,
      category: templateObj.category,
      categoryName: THREAT_TAXONOMY[templateObj.category]?.name || templateObj.category,
      channel,
      message: templateObj.template(sender),
      expectedRisk: templateObj.expectedRisk
    });
  }

  return scenarios;
};

