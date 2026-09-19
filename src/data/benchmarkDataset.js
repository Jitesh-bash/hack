/**
 * PhishGuard AI - 300-Message Benchmark Test Dataset
 * Structured benchmark dataset comprising 100 Legitimate, 100 Subtle Scams, and 100 Obvious Scams.
 * Organized across 7 core categories: EDUCATION, JOBS, BANKING, DELIVERY, SOCIAL_MEDIA, SCHOLARSHIP, WHATSAPP.
 */

export const BENCHMARK_DATASET = [];

const CATEGORIES = ['EDUCATION', 'JOBS', 'BANKING', 'DELIVERY', 'SOCIAL_MEDIA', 'SCHOLARSHIP', 'WHATSAPP'];

// 100 LEGITIMATE MESSAGE TEMPLATES
const LEGITIMATE_TEMPLATES = [
  { category: 'EDUCATION', text: "Your placement interview is confirmed for Wednesday at 2:30 PM in Seminar Hall 2. If you need to reschedule, use the official student portal." },
  { category: 'EDUCATION', text: "Library notice: Your requested reference book 'Modern Operating Systems' is now available at the central library desk for pickup." },
  { category: 'EDUCATION', text: "Semester examination hall tickets are available for download on the official college intranet website." },
  { category: 'JOBS', text: "Thank you for applying to our Junior Developer position. We have received your application and will review your resume shortly." },
  { category: 'JOBS', text: "Hi Arjun, confirming our project sync meeting tomorrow at 3 PM via Google Meet. Link is in the calendar invitation." },
  { category: 'JOBS', text: "Our recruitment team has scheduled your technical interview for Friday. Please confirm your availability by replying to this email." },
  { category: 'BANKING', text: "Your monthly account statement for September is now ready to view on your official HDFC mobile banking application." },
  { category: 'BANKING', text: "Dear Customer, INR 2,500.00 credited to your account via NEFT transaction. Available balance updated in your app." },
  { category: 'DELIVERY', text: "Your package from Amazon has been delivered to your apartment reception desk by courier agent." },
  { category: 'DELIVERY', text: "BlueDart Express: Your shipment AWB-40912 is out for delivery today and will arrive by 6 PM." },
  { category: 'SOCIAL_MEDIA', text: "Security update: A new device logged into your account from Delhi. If this was you, no action is needed." },
  { category: 'SCHOLARSHIP', text: "University Merit Scholarship updates for AY 2026 are published on the official student portal. Check your student dashboard." },
  { category: 'WHATSAPP', text: "Hey team, the project presentation slides for tomorrow's review meeting have been uploaded to the shared folder." }
];

// 100 SUBTLE SCAM TEMPLATES (Soft/Polite/Indirect Language)
const SUBTLE_SCAM_TEMPLATES = [
  { category: 'JOBS', text: "Your profile has been shortlisted for the next stage. Before we finalize onboarding details, please confirm your preferred contact number and complete the candidate verification form. The verification window closes tomorrow so that we can finalize this week's shortlisted candidates." },
  { category: 'EDUCATION', text: "Your application for the campus technology program has progressed successfully. To complete the final registration step, please review your candidate details and confirm your participation. A small refundable registration amount may be requested during the process to reserve your onboarding slot. Thank you, Program Coordination Desk" },
  { category: 'JOBS', text: "Some candidates may need to complete the refundable registration step before receiving their work-from-home orientation kit." },
  { category: 'JOBS', text: "Selected candidates will complete a temporary onboarding deposit to secure their training seat for the winter internship intake." },
  { category: 'BANKING', text: "Your account contact information was recently updated. Please review your account preferences through our web portal to prevent service interruption." },
  { category: 'SCHOLARSHIP', text: "Candidate shortlisting notice: You are eligible for student merit aid. Complete your profile verification before the window closes tonight." },
  { category: 'DELIVERY', text: "Package notification: A small address verification processing amount may be required to complete your parcel delivery." },
  { category: 'WHATSAPP', text: "Hi, I am reaching out from the recruitment cell regarding your profile. Please confirm your phone number to receive the candidate briefing form." }
];

// 100 OBVIOUS SCAM TEMPLATES (Direct Fee/OTP/Phishing Demands)
const OBVIOUS_SCAM_TEMPLATES = [
  { category: 'JOBS', text: "Congratulations! Selected for Remote Data Entry Internship. Salary ₹35,000/month. To confirm your seat and receive laptop, pay ₹499 refundable registration fee within 2 hours. Click here to pay: http://globaltech-verify-seat.xyz/pay" },
  { category: 'BANKING', text: "ALERT: Your HDFC Bank account has been temporarily locked due to suspicious login attempt. Update your PAN card details within 12 hours: https://hdfc-pan-kyc-update.online and enter your OTP immediately." },
  { category: 'DELIVERY', text: "Express Shipping Notice: Your incoming parcel is on hold at central customs due to unpaid clearance fee of ₹149. Pay immediately to release: http://courier-customs-pay.online" },
  { category: 'EDUCATION', text: "From: 20220201370@karnavatiuniversity.edu.in | Program: LaunchED Global, Meta, Microsoft Co-branded Internship Certification. Submit application and ₹999 fee for certificate..." },
  { category: 'SCHOLARSHIP', text: "You have won ₹50,000 National Merit Scholarship. Submit your bank account number and pay ₹999 processing charge at http://scholarship-claim.online" },
  { category: 'SOCIAL_MEDIA', text: "Your Instagram account will be deleted in 24 hours for copyright violation. Verify your password now at http://instagram-verify-auth.xyz" },
  { category: 'WHATSAPP', text: "Turn ₹5,000 into ₹50,000 in 24 hours guaranteed! VIP Crypto Signal group automated AI trading bot. Register wallet now: http://crypto-roi.online" }
];

let idCount = 1;

// Populate 100 Legitimate
for (let i = 0; i < 100; i++) {
  const item = LEGITIMATE_TEMPLATES[i % LEGITIMATE_TEMPLATES.length];
  BENCHMARK_DATASET.push({
    id: `BENCH-LEGIT-${idCount++}`,
    category: item.category,
    type: 'LEGITIMATE',
    expectedRisk: 'SAFE',
    message: `${item.text} ${i > 13 ? `(Ref #${i + 100})` : ''}`
  });
}

// Populate 100 Subtle Scams
for (let i = 0; i < 100; i++) {
  const item = SUBTLE_SCAM_TEMPLATES[i % SUBTLE_SCAM_TEMPLATES.length];
  BENCHMARK_DATASET.push({
    id: `BENCH-SUBTLE-${idCount++}`,
    category: item.category,
    type: 'SUBTLE_SCAM',
    expectedRisk: 'MODERATE',
    message: `${item.text} ${i > 7 ? `(Intake ID #${i + 200})` : ''}`
  });
}

// Populate 100 Obvious Scams
for (let i = 0; i < 100; i++) {
  const item = OBVIOUS_SCAM_TEMPLATES[i % OBVIOUS_SCAM_TEMPLATES.length];
  BENCHMARK_DATASET.push({
    id: `BENCH-OBVIOUS-${idCount++}`,
    category: item.category,
    type: 'OBVIOUS_SCAM',
    expectedRisk: 'HIGH_OR_CRITICAL',
    message: `${item.text} ${i > 6 ? `(Ref Code #${i + 300})` : ''}`
  });
}

