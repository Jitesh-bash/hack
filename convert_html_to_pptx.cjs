const puppeteer = require('puppeteer');
const pptxgen = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

async function convertDeck() {
  console.log('1. Launching Puppeteer to capture ultra-high-res slides...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });

  const htmlUrl = 'file:///' + path.join(__dirname, 'ppt', 'index.html').replace(/\\/g, '/');
  console.log('Loading:', htmlUrl);
  await page.goto(htmlUrl, { waitUntil: 'networkidle0' });

  // Hide the floating navigation toolbar
  await page.evaluate(() => {
    const nav = document.querySelector('.no-print');
    if (nav) nav.style.display = 'none';
  });

  const totalSlides = 12;
  const slideImages = [];
  const tempDir = path.join(__dirname, 'ppt', 'slides_cache');
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  console.log('2. Rendering each slide at 4K crisp resolution...');
  for (let i = 1; i <= totalSlides; i++) {
    await page.evaluate((num) => {
      showSlide(num);
    }, i);

    // Give CSS animations a moment to settle
    await new Promise((r) => setTimeout(r, 200));

    const imgPath = path.join(tempDir, `slide_${i}.png`);
    await page.screenshot({ path: imgPath, type: 'png' });
    slideImages.push(imgPath);
    console.log(`   Captured Slide ${i} / ${totalSlides}`);
  }

  await browser.close();

  console.log('3. Assembling native 16:9 PowerPoint presentation...');
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9';

  for (let i = 0; i < slideImages.length; i++) {
    const slide = pres.addSlide();
    slide.addImage({
      path: slideImages[i],
      x: 0,
      y: 0,
      w: '100%',
      h: '100%'
    });
  }

  const outputPath = path.join(__dirname, 'ppt', 'PhishGuard_AI_Hackathon_Pitch.pptx');
  await pres.writeFile({ fileName: outputPath });
  console.log(`SUCCESS! Wrote pristine PowerPoint to: ${outputPath}`);
}

convertDeck().catch((err) => {
  console.error('Conversion error:', err);
  process.exit(1);
});

