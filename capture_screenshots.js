import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const TARGET_DIR = 'c:/C_Programs/html_program/hack/scrrenshot';

if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

async function capture() {
  console.log('Launching headless browser...');
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1440, height: 900 }
  });

  const page = await browser.newPage();

  // 1. Capture Hero & Scanner View
  console.log('Capturing 01_hero_and_scanner.png...');
  await page.goto('http://localhost:3001/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(TARGET_DIR, '01_hero_and_scanner.png'), fullPage: false });

  // 2. Trigger Threat Analysis & Capture Result
  console.log('Capturing 02_threat_analysis_result.png...');
  // Click first demo scenario button
  const analyzeBtn = await page.$('#demo-section button');
  if (analyzeBtn) {
    await analyzeBtn.click();
    await new Promise(r => setTimeout(r, 1000));
  }
  await page.screenshot({ path: path.join(TARGET_DIR, '02_threat_analysis_result.png'), fullPage: false });

  // 3. Capture Demo Hub View
  console.log('Capturing 03_judge_demo_hub.png...');
  await page.evaluate(() => {
    const el = document.getElementById('demo-section');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(TARGET_DIR, '03_judge_demo_hub.png'), fullPage: false });

  // 4. Capture How It Works View
  console.log('Capturing 04_how_it_works_workflow.png...');
  const howItWorksNav = await page.$('nav button:nth-child(3)');
  if (howItWorksNav) {
    await howItWorksNav.click();
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(TARGET_DIR, '04_how_it_works_workflow.png'), fullPage: true });
  }

  // 5. Capture Safety Principles
  console.log('Capturing 05_student_safety_principles.png...');
  const scannerNav = await page.$('nav button:nth-child(1)');
  if (scannerNav) {
    await scannerNav.click();
    await new Promise(r => setTimeout(r, 500));
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: path.join(TARGET_DIR, '05_student_safety_principles.png'), fullPage: false });
  }

  // 6. Capture URL Intelligence Analysis View
  console.log('Capturing 06_url_intelligence_analysis.png...');
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 300));
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const urlTab = buttons.find(b => b.textContent.includes('URL Inspector'));
    if (urlTab) urlTab.click();
  });
  await new Promise(r => setTimeout(r, 400));
  await page.evaluate(() => {
    const input = document.querySelector('input[placeholder*="http"]');
    if (input) {
      input.value = 'http://hdfc-netbanking-verify.xyz/login';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const scanBtn = buttons.find(b => b.textContent.includes('Inspect Domain') || b.textContent.includes('Inspect Web Domain'));
    if (scanBtn) scanBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(TARGET_DIR, '06_url_intelligence_analysis.png'), fullPage: false });

  // 7. Capture Multimodal Screenshot Analysis View
  console.log('Capturing 07_multimodal_screenshot_analysis.png...');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.evaluate(() => {
    const backBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Analyze Another'));
    if (backBtn) backBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const imgTab = buttons.find(b => b.textContent.includes('Screenshot Upload'));
    if (imgTab) imgTab.click();
  });
  await new Promise(r => setTimeout(r, 400));
  await page.evaluate(() => {
    const demoBtn = document.querySelector('#demo-section button');
    if (demoBtn) demoBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(TARGET_DIR, '07_multimodal_screenshot_analysis.png'), fullPage: false });

  await browser.close();
  console.log('All screenshots successfully captured and saved to:', TARGET_DIR);
}

capture().catch(err => {
  console.error('Screenshot capture failed:', err);
});

