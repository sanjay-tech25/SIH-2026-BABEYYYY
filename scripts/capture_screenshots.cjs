/**
 * Automated Screenshot Capture Utility for QUBOT / QuanTech Platform
 * Requires frontend server running at http://localhost:6500
 */
const path = require('path');
const fs = require('fs');

let puppeteer;
try {
  puppeteer = require(path.join(__dirname, '..', 'frontend', 'node_modules', 'puppeteer-core'));
} catch (e) {
  puppeteer = require('puppeteer-core');
}

async function capture() {
  const screenshotsDir = path.join(__dirname, '..', 'docs', 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--window-size=1440,900'
    ],
    defaultViewport: {
      width: 1440,
      height: 900,
      deviceScaleFactor: 2
    }
  });

  const page = await browser.newPage();
  
  console.log('Loading http://localhost:6500...');
  await page.goto('http://localhost:6500', { waitUntil: 'networkidle2' });
  await page.evaluate(() => new Promise((r) => setTimeout(r, 2500)));

  async function navigateTo(label) {
    await page.evaluate((navLabel) => {
      const buttons = Array.from(document.querySelectorAll('button, a'));
      for (const btn of buttons) {
        if (btn.innerText && btn.innerText.includes(navLabel)) {
          btn.click();
          return true;
        }
      }
      return false;
    }, label);
    await page.evaluate(() => new Promise((r) => setTimeout(r, 2500)));
  }

  console.log('1. Capturing Dashboard...');
  await page.screenshot({ path: path.join(screenshotsDir, '01_dashboard.png') });

  console.log('2. Capturing Circuit builder...');
  await navigateTo('Circuit builder');
  await page.screenshot({ path: path.join(screenshotsDir, '02_circuit_builder.png') });

  console.log('3. Capturing Learning path...');
  await navigateTo('Learning path');
  await page.screenshot({ path: path.join(screenshotsDir, '03_learning_path_dag.png') });

  console.log('4. Capturing Courses...');
  await navigateTo('Courses');
  await page.screenshot({ path: path.join(screenshotsDir, '04_courses_curriculum.png') });

  console.log('5. Capturing Assessments...');
  await navigateTo('Assessments');
  await page.screenshot({ path: path.join(screenshotsDir, '05_assessment_diagnostic.png') });

  console.log('6. Capturing Open Lab...');
  await navigateTo('Open Lab');
  await page.screenshot({ path: path.join(screenshotsDir, '06_open_lab.png') });

  console.log('7. Capturing Progress...');
  await navigateTo('Progress');
  await page.screenshot({ path: path.join(screenshotsDir, '07_progress_analytics.png') });

  console.log('8. Capturing Landing Page...');
  await navigateTo('Exit to Overview');
  await page.evaluate(() => new Promise((r) => setTimeout(r, 2500)));
  await page.screenshot({ path: path.join(screenshotsDir, '00_landing_page.png') });

  await browser.close();
  console.log('All screenshots captured successfully!');
}

capture().catch((err) => {
  console.error('Error during capture:', err);
  process.exit(1);
});
