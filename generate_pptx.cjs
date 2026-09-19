const pptxgen = require('pptxgenjs');
const path = require('path');

async function createDeck() {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9'; // 13.333 x 7.5 inches

  // Colors
  const BG_PAGE = 'F8FAFC';       // Frosted canvas
  const BG_CARD = 'FFFFFF';       // Card white
  const BORDER_COLOR = 'CBD5E1';  // Crisp border
  const BORDER_SUBTLE = 'E2E8F0'; // Light border
  const TEXT_DARK = '0F172A';     // Deep navy heading
  const TEXT_BODY = '334155';     // Slate body
  const TEXT_MUTED = '64748B';    // Caption
  const BLUE = '2563EB';          // Primary Blue
  const BLUE_BG = 'EFF6FF';       // Soft blue tint
  const BLUE_BORDER = 'BFDBFE';
  const EMERALD = '059669';
  const EMERALD_BG = 'ECFDF5';
  const EMERALD_BORDER = 'A7F3D0';
  const RED = 'DC2626';
  const RED_BG = 'FEF2F2';
  const RED_BORDER = 'FECACA';
  const AMBER = 'D97706';
  const AMBER_BG = 'FFFBEB';
  const AMBER_BORDER = 'FDE68A';

  const FONT_HEAD = 'Segoe UI';
  const FONT_BODY = 'Segoe UI';
  const FONT_MONO = 'Consolas';

  // Usable area: x=0.8 to x=12.53 (Width = 11.73)
  const LEFT_M = 0.8;
  const USABLE_W = 11.73;

  function addHeader(slide, category, title, subtitle) {
    slide.background = { color: BG_PAGE };

    // Brand tag
    slide.addText('🛡️ PhishGuard AI', {
      x: LEFT_M, y: 0.45, w: 3.5, h: 0.35,
      fontSize: 13, fontFace: FONT_HEAD, bold: true, color: BLUE,
      margin: 0
    });

    // Category pill
    slide.addShape(pres.ShapeType.roundRect, {
      x: 9.8, y: 0.42, w: 2.73, h: 0.36, rectRadius: 0.08,
      fill: { color: BLUE_BG }, line: { color: BLUE_BORDER, width: 1 }
    });
    slide.addText(category, {
      x: 9.8, y: 0.42, w: 2.73, h: 0.36,
      fontSize: 9, fontFace: FONT_MONO, bold: true, color: BLUE, align: 'center', valign: 'middle',
      margin: 0
    });

    // Title
    slide.addText(title, {
      x: LEFT_M, y: 0.85, w: USABLE_W, h: 0.55,
      fontSize: 22, fontFace: FONT_HEAD, bold: true, color: TEXT_DARK,
      margin: 0
    });

    // Subtitle
    if (subtitle) {
      slide.addText(subtitle, {
        x: LEFT_M, y: 1.42, w: USABLE_W, h: 0.32,
        fontSize: 11, fontFace: FONT_BODY, color: TEXT_MUTED,
        margin: 0
      });
    }

    // Footer
    slide.addShape(pres.ShapeType.line, {
      x: LEFT_M, y: 6.95, w: USABLE_W, h: 0,
      line: { color: BORDER_SUBTLE, width: 1 }
    });
    slide.addText('Open Innovation Hackathon 2026  •  AI & Cybersecurity Track', {
      x: LEFT_M, y: 7.02, w: 6.0, h: 0.3,
      fontSize: 8.5, fontFace: FONT_MONO, color: TEXT_MUTED, margin: 0
    });
    slide.addText('Autonomous Multimodal Threat Workspace', {
      x: 6.8, y: 7.02, w: 5.73, h: 0.3,
      fontSize: 8.5, fontFace: FONT_MONO, color: TEXT_MUTED, align: 'right', margin: 0
    });
  }

  // ==========================================
  // SLIDE 1: COVER
  // ==========================================
  {
    const s = pres.addSlide();
    s.background = { color: BG_PAGE };

    // Brand Icon & Badge
    s.addShape(pres.ShapeType.roundRect, {
      x: LEFT_M, y: 1.1, w: 0.9, h: 0.9, rectRadius: 0.15,
      fill: { color: BLUE }
    });
    s.addText('🛡️', { x: LEFT_M, y: 1.1, w: 0.9, h: 0.9, fontSize: 26, align: 'center', valign: 'middle', margin: 0 });

    s.addText('PhishGuard AI', {
      x: 1.9, y: 1.25, w: 5.0, h: 0.55,
      fontSize: 26, fontFace: FONT_HEAD, bold: true, color: TEXT_DARK, margin: 0
    });

    s.addShape(pres.ShapeType.roundRect, {
      x: LEFT_M, y: 2.3, w: 3.8, h: 0.38, rectRadius: 0.08,
      fill: { color: BLUE_BG }, line: { color: BLUE_BORDER, width: 1 }
    });
    s.addText('HACKATHON PITCH  •  OPEN INNOVATION 2026', {
      x: LEFT_M, y: 2.3, w: 3.8, h: 0.38,
      fontSize: 9, fontFace: FONT_MONO, bold: true, color: BLUE, align: 'center', valign: 'middle', margin: 0
    });

    s.addText([
      { text: 'Detect scams before\nthey become ', options: { bold: true } },
      { text: 'losses.', options: { bold: true, color: BLUE } }
    ], {
      x: LEFT_M, y: 2.85, w: 11.0, h: 1.8,
      fontSize: 42, fontFace: FONT_HEAD, color: TEXT_DARK, lineSpacingMultiple: 1.15, margin: 0
    });

    s.addText('Multimodal, explainable threat inspection for students and everyday users.\nPowered by client-side OCR and Google Gemini 3.6 Flash reasoning.', {
      x: LEFT_M, y: 4.85, w: 10.5, h: 0.8,
      fontSize: 14, fontFace: FONT_BODY, color: TEXT_MUTED, lineSpacingMultiple: 1.3, margin: 0
    });

    // Feature Badges Grid (4 items)
    const badges = ['✓ SCREENSHOT OCR', '✓ MULTI-SIGNAL REASONING', '✓ ZERO KEYWORD RELIANCE', '✓ ACTIONABLE DEFENSE'];
    const badgeW = 2.75;
    const badgeGap = 0.24;
    badges.forEach((b, i) => {
      const bx = LEFT_M + (i * (badgeW + badgeGap));
      s.addShape(pres.ShapeType.roundRect, {
        x: bx, y: 5.85, w: badgeW, h: 0.45, rectRadius: 0.08,
        fill: { color: BG_CARD }, line: { color: BORDER_SUBTLE, width: 1 }
      });
      s.addText(b, {
        x: bx, y: 5.85, w: badgeW, h: 0.45,
        fontSize: 9, fontFace: FONT_MONO, bold: true, color: TEXT_DARK, align: 'center', valign: 'middle', margin: 0
      });
    });

    s.addShape(pres.ShapeType.line, { x: LEFT_M, y: 6.9, w: USABLE_W, h: 0, line: { color: BORDER_SUBTLE, width: 1 } });
    s.addText('Team PhishGuard  •  Experience live at http://localhost:3001', {
      x: LEFT_M, y: 6.98, w: USABLE_W, h: 0.35, fontSize: 9, fontFace: FONT_MONO, color: TEXT_MUTED, margin: 0
    });
  }

  // ==========================================
  // SLIDE 2: THE PROBLEM
  // ==========================================
  {
    const s = pres.addSlide();
    addHeader(s, '01 / THE PROBLEM', 'Why Traditional Scam Defenses Fail Everyday Users', 'Modern attackers no longer rely on obvious typos or crude spam—they use high-context deception.');

    const colW = 3.65;
    const colGap = 0.39;
    const cardY = 1.95;
    const cardH = 3.85;

    const problems = [
      {
        tag: '01 • CONTEXTUAL DECEPTION',
        title: 'Realistic Social Engineering',
        desc: 'Scams closely mimic official university exam circulars, campus placement shortlists, bank KYC deadlines, and family WhatsApp emergencies with authentic logos and professional wording.',
        color: RED, bg: RED_BG, border: RED_BORDER
      },
      {
        tag: '02 • MULTI-CHANNEL SPREAD',
        title: 'Bypassing Email Firewalls',
        desc: 'Threats completely bypass enterprise email spam gateways by arriving via direct WhatsApp forwards, SMS messages, cropped screenshots, and QR codes directly onto personal mobile devices.',
        color: AMBER, bg: AMBER_BG, border: AMBER_BORDER
      },
      {
        tag: '03 • ZERO TOOLS',
        title: 'Verification Vacuum',
        desc: 'Everyday users and students lack threat analysis tools. Pressured by artificial countdown timers and fear of missing out, decisions are made purely on guesswork and panic.',
        color: BLUE, bg: BLUE_BG, border: BLUE_BORDER
      }
    ];

    problems.forEach((p, i) => {
      const cx = LEFT_M + (i * (colW + colGap));

      // Main Card Background
      s.addShape(pres.ShapeType.roundRect, {
        x: cx, y: cardY, w: colW, h: cardH, rectRadius: 0.12,
        fill: { color: BG_CARD }, line: { color: BORDER_COLOR, width: 1 }
      });

      // Top Accent Header Strip inside Card
      s.addShape(pres.ShapeType.roundRect, {
        x: cx + 0.25, y: cardY + 0.25, w: colW - 0.5, h: 0.38, rectRadius: 0.06,
        fill: { color: p.bg }, line: { color: p.border, width: 1 }
      });
      s.addText(p.tag, {
        x: cx + 0.25, y: cardY + 0.25, w: colW - 0.5, h: 0.38,
        fontSize: 8.5, fontFace: FONT_MONO, bold: true, color: p.color, align: 'center', valign: 'middle', margin: 0
      });

      // Title
      s.addText(p.title, {
        x: cx + 0.25, y: cardY + 0.8, w: colW - 0.5, h: 0.55,
        fontSize: 14, fontFace: FONT_HEAD, bold: true, color: TEXT_DARK, margin: 0
      });

      // Description
      s.addText(p.desc, {
        x: cx + 0.25, y: cardY + 1.45, w: colW - 0.5, h: 2.1,
        fontSize: 10, fontFace: FONT_BODY, color: TEXT_BODY, lineSpacingMultiple: 1.35, margin: 0
      });
    });

    // Bottom banner
    s.addShape(pres.ShapeType.roundRect, {
      x: LEFT_M, y: 6.05, w: USABLE_W, h: 0.65, rectRadius: 0.08,
      fill: { color: 'F1F5F9' }, line: { color: BORDER_SUBTLE, width: 1 }
    });
    s.addText('💡 Core Challenge: The issue is not detecting suspicious keywords. It is understanding deceptive human context.', {
      x: LEFT_M, y: 6.05, w: USABLE_W, h: 0.65,
      fontSize: 11, fontFace: FONT_HEAD, bold: true, color: TEXT_DARK, align: 'center', valign: 'middle', margin: 0
    });
  }

  // ==========================================
  // SLIDE 3: THE SOLUTION
  // ==========================================
  {
    const s = pres.addSlide();
    addHeader(s, '02 / THE SOLUTION', 'PhishGuard AI: One Unified Defense Workspace', 'A multimodal cybersecurity workspace that inspects messages, screenshots, and links with full explainability.');

    const colW = 3.65;
    const colGap = 0.39;
    const cardY = 1.95;
    const cardH = 3.75;

    const pillars = [
      {
        icon: '🔍',
        title: 'Multimodal Intake',
        tag: 'ANY FORMAT • ZERO FRICTION',
        desc: 'Submit WhatsApp screenshots, raw text messages, or suspicious URLs in one interface. In-browser OCR extracts all text, phone numbers, sender domains, and URLs client-side with zero data leaks.'
      },
      {
        icon: '🧠',
        title: 'Multi-Signal Correlation',
        tag: '11+ BEHAVIORAL SIGNALS',
        desc: 'Correlates sender domain mismatches, artificial deadline coercion, refundable registration deposit demands, and visual brand spoofing simultaneously using weighted heuristic and AI models.'
      },
      {
        icon: '🛡️',
        title: 'Explainable Assessment',
        tag: 'TRANSPARENT REASONING',
        desc: 'Replaces confusing binary alerts with an objective 0–100 risk score, exact quoted evidence excerpts from the message, and a customized step-by-step defensive action checklist.'
      }
    ];

    pillars.forEach((p, i) => {
      const cx = LEFT_M + (i * (colW + colGap));

      s.addShape(pres.ShapeType.roundRect, {
        x: cx, y: cardY, w: colW, h: cardH, rectRadius: 0.12,
        fill: { color: BG_CARD }, line: { color: BORDER_COLOR, width: 1 }
      });

      s.addText(p.icon, { x: cx + 0.3, y: cardY + 0.25, w: 0.6, h: 0.6, fontSize: 24, margin: 0 });

      s.addText(p.title, {
        x: cx + 0.3, y: cardY + 0.95, w: colW - 0.6, h: 0.45,
        fontSize: 15, fontFace: FONT_HEAD, bold: true, color: TEXT_DARK, margin: 0
      });

      s.addText(p.tag, {
        x: cx + 0.3, y: cardY + 1.45, w: colW - 0.6, h: 0.25,
        fontSize: 8.5, fontFace: FONT_MONO, bold: true, color: BLUE, margin: 0
      });

      s.addText(p.desc, {
        x: cx + 0.3, y: cardY + 1.8, w: colW - 0.6, h: 1.75,
        fontSize: 10, fontFace: FONT_BODY, color: TEXT_BODY, lineSpacingMultiple: 1.35, margin: 0
      });
    });

    s.addShape(pres.ShapeType.roundRect, {
      x: LEFT_M, y: 5.95, w: USABLE_W, h: 0.75, rectRadius: 0.08,
      fill: { color: BLUE_BG }, line: { color: BLUE_BORDER, width: 1 }
    });
    s.addText('PIPELINE:  Screenshot / Text / URL  ➔  Browser OCR  ➔  Gemini 3.6 Flash + Heuristic Engine  ➔  0–100 Explainable Report', {
      x: LEFT_M, y: 5.95, w: USABLE_W, h: 0.75,
      fontSize: 10, fontFace: FONT_MONO, bold: true, color: BLUE, align: 'center', valign: 'middle', margin: 0
    });
  }

  // ==========================================
  // SLIDE 4: HOW IT WORKS
  // ==========================================
  {
    const s = pres.addSlide();
    addHeader(s, '03 / HOW IT WORKS', '4-Step Frictionless Detection Pipeline', 'From suspicious message submission to an explainable defense report in under 2 seconds.');

    const colW = 2.68;
    const colGap = 0.34;
    const cardY = 1.95;
    const cardH = 3.85;

    const steps = [
      {
        num: 'STEP 01',
        title: 'Submit Content',
        desc: 'User uploads a screenshot, drops SMS/WhatsApp message text, or enters an unverified link in the clean scanner workspace.',
        accent: BLUE
      },
      {
        num: 'STEP 02',
        title: 'Entity Extraction',
        desc: 'Tesseract.js OCR extracts text locally in the browser, identifying sender identity, contact numbers, and target URLs.',
        accent: BLUE
      },
      {
        num: 'STEP 03',
        title: 'Signal Synthesis',
        desc: 'Dual-engine analyzes domain discrepancies, urgency language, deposit fee traps, and brand impersonation in parallel.',
        accent: AMBER
      },
      {
        num: 'STEP 04',
        title: 'Explainable Report',
        desc: 'Returns transparent 0–100 risk score, point-by-point evidence breakdown, and an exact checklist of actions to take.',
        accent: EMERALD
      }
    ];

    steps.forEach((st, i) => {
      const cx = LEFT_M + (i * (colW + colGap));

      s.addShape(pres.ShapeType.roundRect, {
        x: cx, y: cardY, w: colW, h: cardH, rectRadius: 0.12,
        fill: { color: BG_CARD }, line: { color: BORDER_COLOR, width: 1 }
      });

      // Step Tag
      s.addShape(pres.ShapeType.roundRect, {
        x: cx + 0.25, y: cardY + 0.25, w: colW - 0.5, h: 0.35, rectRadius: 0.06,
        fill: { color: BG_PAGE }, line: { color: BORDER_SUBTLE, width: 1 }
      });
      s.addText(st.num, {
        x: cx + 0.25, y: cardY + 0.25, w: colW - 0.5, h: 0.35,
        fontSize: 9, fontFace: FONT_MONO, bold: true, color: st.accent, align: 'center', valign: 'middle', margin: 0
      });

      s.addText(st.title, {
        x: cx + 0.25, y: cardY + 0.75, w: colW - 0.5, h: 0.45,
        fontSize: 13.5, fontFace: FONT_HEAD, bold: true, color: TEXT_DARK, margin: 0
      });

      s.addText(st.desc, {
        x: cx + 0.25, y: cardY + 1.3, w: colW - 0.5, h: 2.3,
        fontSize: 9.5, fontFace: FONT_BODY, color: TEXT_BODY, lineSpacingMultiple: 1.35, margin: 0
      });
    });

    s.addShape(pres.ShapeType.roundRect, {
      x: LEFT_M, y: 6.05, w: USABLE_W, h: 0.65, rectRadius: 0.08,
      fill: { color: 'F1F5F9' }, line: { color: BORDER_SUBTLE, width: 1 }
    });
    s.addText('“PhishGuard doesn’t just label a scam. It explains the exact mechanics of why.”', {
      x: LEFT_M, y: 6.05, w: USABLE_W, h: 0.65,
      fontSize: 11, fontFace: FONT_HEAD, italic: true, bold: true, color: TEXT_DARK, align: 'center', valign: 'middle', margin: 0
    });
  }

  // ==========================================
  // SLIDE 5: THREAT COVERAGE
  // ==========================================
  {
    const s = pres.addSlide();
    addHeader(s, '04 / THREAT COVERAGE', 'Threat Taxonomy Tuned for High-Impact Scams', 'Comprehensive protection across sectors that actively target students, jobseekers, and families.');

    const colW = 2.10;
    const colGap = 0.30;
    const cardY = 1.95;
    const cardH = 3.95;

    const categories = [
      {
        icon: '🎓',
        title: 'Education & Campus',
        items: '• Fake internships\n• Exam fee notices\n• Forged certificates\n• Merit scholarship traps'
      },
      {
        icon: '💼',
        title: 'Job & Recruitment',
        items: '• Recruiter impersonation\n• Workstation deposit fees\n• Bogus Telegram tasks\n• Fake HR offer letters'
      },
      {
        icon: '🏦',
        title: 'Banking & Financial',
        items: '• Urgent KYC update alerts\n• Fake PAN card deadlines\n• Account lock threats\n• OTP harvesting forms'
      },
      {
        icon: '💬',
        title: 'WhatsApp & Social',
        items: '• "Hi Mum" broken phone\n• Fake relative emergencies\n• Urgent bill payments\n• Device switch pretexts'
      },
      {
        icon: '🔗',
        title: 'Domains & Links',
        items: '• Punycode typosquats\n• Spoofed college subdomains\n• Non-standard TLDs\n• Lookalike brand URLs'
      }
    ];

    categories.forEach((c, i) => {
      const cx = LEFT_M + (i * (colW + colGap));

      s.addShape(pres.ShapeType.roundRect, {
        x: cx, y: cardY, w: colW, h: cardH, rectRadius: 0.12,
        fill: { color: BG_CARD }, line: { color: BORDER_COLOR, width: 1 }
      });

      s.addText(c.icon, { x: cx, y: cardY + 0.25, w: colW, h: 0.5, fontSize: 24, align: 'center', margin: 0 });

      s.addText(c.title, {
        x: cx + 0.1, y: cardY + 0.85, w: colW - 0.2, h: 0.55,
        fontSize: 11, fontFace: FONT_HEAD, bold: true, color: TEXT_DARK, align: 'center', margin: 0
      });

      s.addText(c.items, {
        x: cx + 0.15, y: cardY + 1.45, w: colW - 0.3, h: 2.3,
        fontSize: 9, fontFace: FONT_BODY, color: TEXT_BODY, lineSpacingMultiple: 1.35, margin: 0
      });
    });

    s.addText('Supported by an empirical 30-scenario benchmark suite covering safe baselines, edge cases, and active fraud campaigns.', {
      x: LEFT_M, y: 6.2, w: USABLE_W, h: 0.35,
      fontSize: 9.5, fontFace: FONT_MONO, color: TEXT_MUTED, align: 'center', margin: 0
    });
  }

  // ==========================================
  // SLIDE 6: INTELLIGENCE ENGINE
  // ==========================================
  {
    const s = pres.addSlide();
    addHeader(s, '05 / INTELLIGENCE ENGINE', 'Multi-Signal Correlation & Compound Risk Scoring', 'How PhishGuard combines discrete indicators into an explainable 0–100 risk score.');

    const leftW = 6.2;
    const rightW = 5.13;
    const gap = 0.4;
    const cardY = 1.95;

    // Left Column: Signal Point Weights (5 rows)
    const signals = [
      { name: 'Domain Authenticity (Actual vs Claimed)', pts: '+35 PTS', color: RED, bg: RED_BG, border: RED_BORDER },
      { name: 'Upfront / Soft "Refundable" Registration Fee', pts: '+35 PTS', color: RED, bg: RED_BG, border: RED_BORDER },
      { name: 'Family Emergency / Broken Phone Lure', pts: '+35 PTS', color: RED, bg: RED_BG, border: RED_BORDER },
      { name: 'Artificial Countdown / Deadline Coercion', pts: '+20 PTS', color: AMBER, bg: AMBER_BG, border: AMBER_BORDER },
      { name: 'Verified Official Domain (.edu.in / .ac.in)', pts: '-15 PTS', color: EMERALD, bg: EMERALD_BG, border: EMERALD_BORDER }
    ];

    signals.forEach((sig, i) => {
      const sy = cardY + (i * 0.76);
      s.addShape(pres.ShapeType.roundRect, {
        x: LEFT_M, y: sy, w: leftW, h: 0.65, rectRadius: 0.08,
        fill: { color: BG_CARD }, line: { color: BORDER_COLOR, width: 1 }
      });

      s.addText(sig.name, {
        x: LEFT_M + 0.25, y: sy, w: leftW - 1.8, h: 0.65,
        fontSize: 10, fontFace: FONT_HEAD, bold: true, color: TEXT_DARK, valign: 'middle', margin: 0
      });

      s.addShape(pres.ShapeType.roundRect, {
        x: LEFT_M + leftW - 1.45, y: sy + 0.14, w: 1.25, h: 0.37, rectRadius: 0.06,
        fill: { color: sig.bg }, line: { color: sig.border, width: 1 }
      });
      s.addText(sig.pts, {
        x: LEFT_M + leftW - 1.45, y: sy + 0.14, w: 1.25, h: 0.37,
        fontSize: 9, fontFace: FONT_MONO, bold: true, color: sig.color, align: 'center', valign: 'middle', margin: 0
      });
    });

    // Right Column: Dark Blueprint Card (Hard Floors)
    const rx = LEFT_M + leftW + gap;
    s.addShape(pres.ShapeType.roundRect, {
      x: rx, y: cardY, w: rightW, h: 3.9, rectRadius: 0.12,
      fill: { color: '090D16' }, line: { color: '1E293B', width: 1 }
    });

    s.addText('COMPOUND RISK GUARDRAILS', {
      x: rx + 0.35, y: cardY + 0.3, w: rightW - 0.7, h: 0.3,
      fontSize: 9, fontFace: FONT_MONO, bold: true, color: '60A5FA', margin: 0
    });

    s.addText('Minimum Risk Floors Prevent False Passes', {
      x: rx + 0.35, y: cardY + 0.65, w: rightW - 0.7, h: 0.55,
      fontSize: 13.5, fontFace: FONT_HEAD, bold: true, color: 'FFFFFF', margin: 0
    });

    s.addText(
      'Scammers often pad messages with formal greetings and polite disclaimers to trick simple spam filters.\n\n' +
      'PhishGuard enforces hard compound risk floors:\n' +
      '• Family Emergency signal enforces minimum 78/100 score.\n' +
      '• Soft fee deposit demand enforces minimum 80/100 score.\n' +
      '• Legitimate educational domains (.edu.in) receive point reductions.\n\n' +
      'This guarantees that psychological traps can never slip through as safe.',
      {
        x: rx + 0.35, y: cardY + 1.25, w: rightW - 0.7, h: 2.4,
        fontSize: 9.5, fontFace: FONT_BODY, color: 'CBD5E1', lineSpacingMultiple: 1.3, margin: 0
      }
    );

    s.addText('Risk Tiers:  0–24 SAFE  •  25–49 LOW  •  50–74 MODERATE  •  75–89 HIGH RISK  •  90–100 CRITICAL', {
      x: LEFT_M, y: 6.2, w: USABLE_W, h: 0.35,
      fontSize: 9, fontFace: FONT_MONO, color: TEXT_MUTED, align: 'center', margin: 0
    });
  }

  // ==========================================
  // SLIDE 7: PRODUCT WALKTHROUGH
  // ==========================================
  {
    const s = pres.addSlide();
    addHeader(s, '06 / PRODUCT WALKTHROUGH', 'Security Assessment Dashboard: Clean & Transparent', 'Designed so students, parents, and everyday users can make confident, informed decisions.');

    const colW = 2.68;
    const colGap = 0.34;
    const cardY = 1.95;
    const cardH = 3.85;

    const callouts = [
      {
        num: '① RISK SCORE & TIER',
        title: 'Immediate Visual Metric',
        desc: 'Color-coded 0–100 score and semantic tier (SAFE / MODERATE / HIGH / CRITICAL) with analysis confidence rating for instant clarity.',
        accent: RED
      },
      {
        num: '② POINT BREAKDOWN',
        title: 'Contribution Matrix',
        desc: 'Itemizes exactly how each behavioral indicator contributed to the composite risk score (+35 Domain Mismatch, +20 Urgency).',
        accent: BLUE
      },
      {
        num: '③ SECURITY EVIDENCE',
        title: 'Highlighted Quotations',
        desc: 'Extracts and quotes deceptive phrases directly from the submitted screenshot or message text so users see the exact proof.',
        accent: AMBER
      },
      {
        num: '④ RECOMMENDED ACTIONS',
        title: 'Defensive Checklist',
        desc: 'Provides concrete, protective next steps: "Do not transfer funds", "Contact university placement cell directly via official directory".',
        accent: EMERALD
      }
    ];

    callouts.forEach((co, i) => {
      const cx = LEFT_M + (i * (colW + colGap));

      s.addShape(pres.ShapeType.roundRect, {
        x: cx, y: cardY, w: colW, h: cardH, rectRadius: 0.12,
        fill: { color: BG_CARD }, line: { color: BORDER_COLOR, width: 1 }
      });

      s.addText(co.num, {
        x: cx + 0.25, y: cardY + 0.25, w: colW - 0.5, h: 0.35,
        fontSize: 9, fontFace: FONT_MONO, bold: true, color: co.accent, margin: 0
      });

      s.addText(co.title, {
        x: cx + 0.25, y: cardY + 0.7, w: colW - 0.5, h: 0.5,
        fontSize: 13, fontFace: FONT_HEAD, bold: true, color: TEXT_DARK, margin: 0
      });

      s.addText(co.desc, {
        x: cx + 0.25, y: cardY + 1.3, w: colW - 0.5, h: 2.3,
        fontSize: 9.5, fontFace: FONT_BODY, color: TEXT_BODY, lineSpacingMultiple: 1.35, margin: 0
      });
    });

    s.addShape(pres.ShapeType.roundRect, {
      x: LEFT_M, y: 6.05, w: USABLE_W, h: 0.65, rectRadius: 0.08,
      fill: { color: 'F1F5F9' }, line: { color: BORDER_SUBTLE, width: 1 }
    });
    s.addText('Analyst Console Live at http://localhost:3001  •  OCR & Entity parsing processed client-side in browser memory', {
      x: LEFT_M, y: 6.05, w: USABLE_W, h: 0.65,
      fontSize: 10, fontFace: FONT_MONO, bold: true, color: TEXT_DARK, align: 'center', valign: 'middle', margin: 0
    });
  }

  // ==========================================
  // SLIDE 8: REALISTIC DEMO
  // ==========================================
  {
    const s = pres.addSlide();
    addHeader(s, '07 / LIVE CASE STUDY', 'Real-World Test: The "Refundable" Internship Scam', 'How PhishGuard exposes an adversarial campus scam that evades conventional keyword filters.');

    const colW = 5.66;
    const colGap = 0.41;
    const cardY = 1.95;
    const cardH = 4.0;

    // Left Card: The Deceptive Scam Email
    s.addShape(pres.ShapeType.roundRect, {
      x: LEFT_M, y: cardY, w: colW, h: cardH, rectRadius: 0.12,
      fill: { color: BG_CARD }, line: { color: BORDER_COLOR, width: 1 }
    });

    s.addText('SUBMITTED MESSAGE (CAMPUS EMAIL SCAM)', {
      x: LEFT_M + 0.3, y: cardY + 0.25, w: colW - 0.6, h: 0.3,
      fontSize: 8.5, fontFace: FONT_MONO, bold: true, color: TEXT_MUTED, margin: 0
    });

    s.addShape(pres.ShapeType.roundRect, {
      x: LEFT_M + 0.3, y: cardY + 0.65, w: colW - 0.6, h: 3.1, rectRadius: 0.08,
      fill: { color: BG_PAGE }, line: { color: BORDER_SUBTLE, width: 1 }
    });

    s.addText(
      'From: 20220201370@karnavatiuniversity.edu.in\n' +
      'Subject: LaunchED Global Internship Selection Notice\n\n' +
      '"Congratulations Arjun! Following your resume shortlisting, your seat is reserved for the Meta & Microsoft co-branded AI Research Internship.\n\n' +
      'To prevent no-shows and confirm your workstation kit allocation, an initial refundable security deposit of ₹999 is required before 11:59 PM today. This will be 100% reimbursed on Day 1 of onboarding."',
      {
        x: LEFT_M + 0.5, y: cardY + 0.8, w: colW - 1.0, h: 2.8,
        fontSize: 9.5, fontFace: FONT_MONO, color: TEXT_DARK, lineSpacingMultiple: 1.3, margin: 0
      }
    );

    // Right Card: PhishGuard Output Report
    const rx = LEFT_M + colW + colGap;
    s.addShape(pres.ShapeType.roundRect, {
      x: rx, y: cardY, w: colW, h: cardH, rectRadius: 0.12,
      fill: { color: BG_CARD }, line: { color: RED, width: 1.5 }
    });

    s.addText('PHISHGUARD SECURITY ASSESSMENT', {
      x: rx + 0.3, y: cardY + 0.25, w: 3.5, h: 0.3,
      fontSize: 8.5, fontFace: FONT_MONO, bold: true, color: RED, margin: 0
    });

    s.addShape(pres.ShapeType.roundRect, {
      x: rx + colW - 1.7, y: cardY + 0.2, w: 1.4, h: 0.35, rectRadius: 0.06,
      fill: { color: RED_BG }, line: { color: RED, width: 1 }
    });
    s.addText('84 / 100 HIGH', {
      x: rx + colW - 1.7, y: cardY + 0.2, w: 1.4, h: 0.35,
      fontSize: 8, fontFace: FONT_MONO, bold: true, color: RED, align: 'center', valign: 'middle', margin: 0
    });

    const findings = [
      { tag: '🔴 DOMAIN MISMATCH (+35 PTS)', text: 'Campus email address offering external Meta/Microsoft corporate program.' },
      { tag: '🔴 SOFT PAYMENT DEMAND (+35 PTS)', text: 'Requested "refundable security deposit" for workstation kit allocation.' },
      { tag: '🟠 ARTIFICIAL URGENCY (+20 PTS)', text: 'Coercive deadline pressure ("before 11:59 PM today") to bypass scrutiny.' }
    ];

    findings.forEach((f, idx) => {
      const fy = cardY + 0.7 + (idx * 0.75);
      s.addText(f.tag, {
        x: rx + 0.3, y: fy, w: colW - 0.6, h: 0.25,
        fontSize: 8.5, fontFace: FONT_MONO, bold: true, color: TEXT_DARK, margin: 0
      });
      s.addText(f.text, {
        x: rx + 0.3, y: fy + 0.25, w: colW - 0.6, h: 0.45,
        fontSize: 9, fontFace: FONT_BODY, color: TEXT_BODY, margin: 0
      });
    });

    s.addShape(pres.ShapeType.roundRect, {
      x: rx + 0.3, y: cardY + 2.95, w: colW - 0.6, h: 0.8, rectRadius: 0.08,
      fill: { color: RED_BG }, line: { color: RED_BORDER, width: 1 }
    });
    s.addText('VERDICT & ACTION:\nThreat Confirmed: Do not transfer registration funds. Legitimate corporate internships never charge upfront refundable workstation fees.', {
      x: rx + 0.45, y: cardY + 3.0, w: colW - 0.9, h: 0.7,
      fontSize: 8.5, fontFace: FONT_HEAD, bold: true, color: RED, lineSpacingMultiple: 1.25, margin: 0
    });

    s.addText('Result: Caught contextual fraud through multi-signal correlation before financial loss occurred.', {
      x: LEFT_M, y: 6.2, w: USABLE_W, h: 0.35,
      fontSize: 9, fontFace: FONT_MONO, color: TEXT_MUTED, align: 'center', margin: 0
    });
  }

  // ==========================================
  // SLIDE 9: DIFFERENTIATION
  // ==========================================
  {
    const s = pres.addSlide();
    addHeader(s, '08 / DIFFERENTIATION', 'Why PhishGuard Outperforms Traditional Tools', 'Bridging the gap between rigid enterprise software and defenseless everyday users.');

    const rows = [
      [
        { text: 'Evaluation Dimension', options: { bold: true, fill: { color: 'F1F5F9' }, color: TEXT_DARK } },
        { text: 'Traditional URL Blacklists', options: { bold: true, fill: { color: 'F1F5F9' }, color: TEXT_MUTED } },
        { text: 'PhishGuard AI Workspace', options: { bold: true, fill: { color: BLUE_BG }, color: BLUE } }
      ],
      [
        { text: 'Supported Modalities', options: { bold: true } },
        { text: 'URLs and domain strings only' },
        { text: 'Screenshots + Plain Text + URLs (Multimodal)', options: { bold: true, color: BLUE } }
      ],
      [
        { text: 'Reasoning Depth', options: { bold: true } },
        { text: 'Binary pass/block with no explanation' },
        { text: '0–100 explainable score + point contribution matrix', options: { bold: true, color: BLUE } }
      ],
      [
        { text: 'Zero-Day Text Scams', options: { bold: true } },
        { text: 'Completely misses newly created domains' },
        { text: 'Analyzes linguistic pressure, deposits & deception context', options: { bold: true, color: BLUE } }
      ],
      [
        { text: 'Target Audience', options: { bold: true } },
        { text: 'Enterprise IT & SecOps teams' },
        { text: 'Everyday students, jobseekers, and consumers', options: { bold: true, color: BLUE } }
      ],
      [
        { text: 'Privacy Architecture', options: { bold: true } },
        { text: 'Uploads telemetry and user files to central cloud' },
        { text: 'In-browser OCR + client-side session execution', options: { bold: true, color: BLUE } }
      ]
    ];

    s.addTable(rows, {
      x: LEFT_M,
      y: 2.0,
      w: USABLE_W,
      colW: [2.5, 4.4, 4.83],
      fontSize: 9.5,
      fontFace: FONT_BODY,
      color: TEXT_DARK,
      border: { pt: 1, color: BORDER_SUBTLE },
      fill: (rowIdx) => (rowIdx === 0 ? 'F1F5F9' : rowIdx % 2 === 0 ? 'FAFAFA' : 'FFFFFF')
    });

    s.addText('*Comparison based on features against consumer antivirus plugins and browser blacklist warnings.', {
      x: LEFT_M, y: 6.2, w: USABLE_W, h: 0.35,
      fontSize: 8.5, fontFace: FONT_MONO, color: TEXT_MUTED, margin: 0
    });
  }

  // ==========================================
  // SLIDE 10: VALIDATION
  // ==========================================
  {
    const s = pres.addSlide();
    addHeader(s, '09 / VALIDATION', 'Rigorously Benchmarked Across 30 Real Scenarios', 'Tested against genuine academic notices, sophisticated recruiter lures, and active banking alerts.');

    const colW = 3.65;
    const colGap = 0.39;
    const cardY = 1.95;
    const cardH = 3.85;

    const benchmarks = [
      {
        tag: '1st SCENARIO',
        title: 'Legitimate Internship Notice',
        quote: '"Confirming your upcoming technical interview tomorrow at 3 PM via Google Meet. The calendar invite has been sent..."',
        score: '17 / 100',
        verdict: '✓ VERIFIED SAFE',
        color: EMERALD, bg: EMERALD_BG, border: EMERALD_BORDER
      },
      {
        tag: '2nd SCENARIO',
        title: 'Fake Recruiter Shortlist',
        quote: '"Your profile has been shortlisted for the next stage. Please confirm your preferred contact number and complete the form..."',
        score: '44 / 100',
        verdict: '✓ MODERATE RISK',
        color: AMBER, bg: AMBER_BG, border: AMBER_BORDER
      },
      {
        tag: '3rd SCENARIO',
        title: 'Fake Bank Account KYC Update',
        quote: '"ALERT: Your HDFC Bank account access has been restricted due to mandatory KYC update. Update PAN details immediately..."',
        score: '80 / 100',
        verdict: '✓ CRITICAL THREAT',
        color: RED, bg: RED_BG, border: RED_BORDER
      }
    ];

    benchmarks.forEach((b, i) => {
      const cx = LEFT_M + (i * (colW + colGap));

      s.addShape(pres.ShapeType.roundRect, {
        x: cx, y: cardY, w: colW, h: cardH, rectRadius: 0.12,
        fill: { color: BG_CARD }, line: { color: BORDER_COLOR, width: 1 }
      });

      // Top Row: Tag + Score
      s.addText(b.tag, {
        x: cx + 0.25, y: cardY + 0.25, w: 1.8, h: 0.3,
        fontSize: 8.5, fontFace: FONT_MONO, bold: true, color: BLUE, margin: 0
      });
      s.addText(b.score, {
        x: cx + colW - 1.65, y: cardY + 0.25, w: 1.4, h: 0.3,
        fontSize: 9, fontFace: FONT_MONO, bold: true, color: b.color, align: 'right', margin: 0
      });

      s.addText(b.title, {
        x: cx + 0.25, y: cardY + 0.65, w: colW - 0.5, h: 0.5,
        fontSize: 13, fontFace: FONT_HEAD, bold: true, color: TEXT_DARK, margin: 0
      });

      s.addText(b.quote, {
        x: cx + 0.25, y: cardY + 1.25, w: colW - 0.5, h: 1.6,
        fontSize: 9.5, fontFace: FONT_BODY, italic: true, color: TEXT_MUTED, lineSpacingMultiple: 1.35, margin: 0
      });

      s.addShape(pres.ShapeType.roundRect, {
        x: cx + 0.25, y: cardY + 3.05, w: colW - 0.5, h: 0.55, rectRadius: 0.08,
        fill: { color: b.bg }, line: { color: b.border, width: 1 }
      });
      s.addText(b.verdict, {
        x: cx + 0.25, y: cardY + 3.05, w: colW - 0.5, h: 0.55,
        fontSize: 9.5, fontFace: FONT_MONO, bold: true, color: b.color, align: 'center', valign: 'middle', margin: 0
      });
    });

    s.addShape(pres.ShapeType.roundRect, {
      x: LEFT_M, y: 6.05, w: USABLE_W, h: 0.65, rectRadius: 0.08,
      fill: { color: BLUE_BG }, line: { color: BLUE_BORDER, width: 1 }
    });
    s.addText('Full benchmark library with 30 interactive scenarios accessible via the "Demo" tab in the live application.', {
      x: LEFT_M, y: 6.05, w: USABLE_W, h: 0.65,
      fontSize: 10, fontFace: FONT_MONO, bold: true, color: BLUE, align: 'center', valign: 'middle', margin: 0
    });
  }

  // ==========================================
  // SLIDE 11: FUTURE ROADMAP
  // ==========================================
  {
    const s = pres.addSlide();
    addHeader(s, '10 / FUTURE ROADMAP', 'Scalable Roadmap: Ambient Scam Defense', 'Transitioning PhishGuard from a web scanner into an ambient security layer.');

    const colW = 3.65;
    const colGap = 0.39;
    const cardY = 1.95;
    const cardH = 3.85;

    const phases = [
      {
        badge: 'PHASE 1 • NOW (LIVE MVP)',
        title: 'Multimodal Web App',
        items: '• Multimodal intake (Screenshots, Text, URLs)\n• In-browser Tesseract.js OCR engine\n• Gemini 3.6 Flash fallback intelligence\n• 30-scenario benchmark suite',
        accent: BLUE
      },
      {
        badge: 'PHASE 2 • NEXT',
        title: 'Browser & Chat Sidecars',
        items: '• Chrome Extension for auto-highlighting links\n• WhatsApp Web sidecar assistant\n• Gmail contextual security card overlay\n• Fully offline heuristic scoring mode',
        accent: '6366F1'
      },
      {
        badge: 'PHASE 3 • SCALE',
        title: 'Institutional Ecosystem',
        items: '• University campus portal security plugin\n• Placement cell recruiter verification API\n• Anonymized community warning network\n• Real-time scam pattern telemetry',
        accent: EMERALD
      }
    ];

    phases.forEach((ph, i) => {
      const cx = LEFT_M + (i * (colW + colGap));

      s.addShape(pres.ShapeType.roundRect, {
        x: cx, y: cardY, w: colW, h: cardH, rectRadius: 0.12,
        fill: { color: BG_CARD }, line: { color: BORDER_COLOR, width: 1 }
      });

      s.addText(ph.badge, {
        x: cx + 0.25, y: cardY + 0.25, w: colW - 0.5, h: 0.3,
        fontSize: 8.5, fontFace: FONT_MONO, bold: true, color: ph.accent, margin: 0
      });

      s.addText(ph.title, {
        x: cx + 0.25, y: cardY + 0.65, w: colW - 0.5, h: 0.45,
        fontSize: 14, fontFace: FONT_HEAD, bold: true, color: TEXT_DARK, margin: 0
      });

      s.addText(ph.items, {
        x: cx + 0.25, y: cardY + 1.25, w: colW - 0.5, h: 2.3,
        fontSize: 9.5, fontFace: FONT_BODY, color: TEXT_BODY, lineSpacingMultiple: 1.45, margin: 0
      });
    });

    s.addText('Vision: Building an ambient protective layer that warns users before they click, transfer money, or share credentials.', {
      x: LEFT_M, y: 6.2, w: USABLE_W, h: 0.35,
      fontSize: 9.5, fontFace: FONT_MONO, color: TEXT_MUTED, align: 'center', margin: 0
    });
  }

  // ==========================================
  // SLIDE 12: CLOSING
  // ==========================================
  {
    const s = pres.addSlide();
    s.background = { color: BG_PAGE };

    s.addShape(pres.ShapeType.roundRect, {
      x: LEFT_M, y: 1.2, w: 0.8, h: 0.8, rectRadius: 0.12,
      fill: { color: BLUE }
    });
    s.addText('🛡️', { x: LEFT_M, y: 1.2, w: 0.8, h: 0.8, fontSize: 24, align: 'center', valign: 'middle', margin: 0 });

    s.addText('PhishGuard AI', {
      x: 1.8, y: 1.35, w: 4.5, h: 0.5,
      fontSize: 22, fontFace: FONT_HEAD, bold: true, color: TEXT_DARK, margin: 0
    });

    s.addText([
      { text: 'Don’t trust the message.\n', options: { bold: true } },
      { text: 'Understand the signals.', options: { bold: true, color: BLUE } }
    ], {
      x: LEFT_M, y: 2.3, w: 11.0, h: 1.8,
      fontSize: 42, fontFace: FONT_HEAD, color: TEXT_DARK, lineSpacingMultiple: 1.15, margin: 0
    });

    s.addText('Empowering everyday students and users with autonomous, explainable threat inspection.', {
      x: LEFT_M, y: 4.3, w: 10.0, h: 0.5,
      fontSize: 14, fontFace: FONT_BODY, color: TEXT_MUTED, margin: 0
    });

    // 3 Final Pillars
    const finalPillars = ['✓ MULTIMODAL INTAKE', '✓ EXPLAINABLE TRANSPARENCY', '✓ ACTIONABLE DEFENSE'];
    const pW = 3.65;
    const pGap = 0.39;
    finalPillars.forEach((p, idx) => {
      const px = LEFT_M + (idx * (pW + pGap));
      s.addShape(pres.ShapeType.roundRect, {
        x: px, y: 5.0, w: pW, h: 0.55, rectRadius: 0.08,
        fill: { color: BG_CARD }, line: { color: BORDER_COLOR, width: 1 }
      });
      s.addText(p, {
        x: px, y: 5.0, w: pW, h: 0.55,
        fontSize: 9.5, fontFace: FONT_MONO, bold: true, color: TEXT_DARK, align: 'center', valign: 'middle', margin: 0
      });
    });

    s.addShape(pres.ShapeType.line, { x: LEFT_M, y: 6.2, w: USABLE_W, h: 0, line: { color: BORDER_SUBTLE, width: 1 } });

    s.addText('Experience Live Scanner:  http://localhost:3001\nOpen Innovation Hackathon 2026  •  Team PhishGuard', {
      x: LEFT_M, y: 6.4, w: 6.5, h: 0.6,
      fontSize: 9.5, fontFace: FONT_MONO, color: TEXT_MUTED, lineSpacingMultiple: 1.3, margin: 0
    });
    s.addText('Thank you, Judges & Mentors! 🙏', {
      x: 7.5, y: 6.4, w: 5.03, h: 0.6,
      fontSize: 13, fontFace: FONT_HEAD, bold: true, color: BLUE, align: 'right', margin: 0
    });
  }

  const outputPath = path.join(__dirname, 'ppt', 'PhishGuard_AI_Hackathon_Pitch.pptx');
  await pres.writeFile({ fileName: outputPath });
  console.log(`SUCCESS: Rebuilt PowerPoint presentation at: ${outputPath}`);
}

createDeck().catch((err) => {
  console.error('ERROR creating presentation:', err);
  process.exit(1);
});
