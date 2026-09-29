/**
 * Comprehensive Screenshot Capture Utility for QUBOT / QuanTech Platform
 * Captures full-page views, inner sections, and outer sections for:
 * 1. Courses Page (Outer 11-Chapter Catalog & Filtered Syllabus)
 * 2. Learning Path Page (Outer Constellation Highway, Expanded Chapter Nodes, & Inner Lesson View)
 * 3. Open Lab Page (Outer Interactive Chapter Lab & Inner Colab Notebook Templates with Sandbox)
 * 4. Assessments Page (Outer Multi-Modal Catalog & Inner Active Practice/Testing Exam UI)
 */

const path = require('path');
const fs = require('fs');
const puppeteer = require(path.resolve(__dirname, '../frontend/node_modules/puppeteer-core'));

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
  const targetDirs = [
    path.resolve(__dirname, '../docs/screenshots'),
    path.resolve(__dirname, '../SIH-DOCS/docs/screenshots')
  ];

  targetDirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  console.log('Launching Chrome in headless mode with high DPI...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--window-size=1600,1000'
    ],
    defaultViewport: {
      width: 1600,
      height: 1000,
      deviceScaleFactor: 2
    }
  });

  const page = await browser.newPage();

  // Helper to save screenshot to both directories
  async function saveShot(filename, options = {}) {
    for (const dir of targetDirs) {
      const filePath = path.join(dir, filename);
      await page.screenshot({ path: filePath, ...options });
    }
    console.log(`Saved: ${filename} (fullPage: ${!!options.fullPage})`);
  }

  // Helper to click by text
  async function clickByText(selector, textMatch) {
    return await page.evaluate((sel, match) => {
      const elements = Array.from(document.querySelectorAll(sel));
      for (const el of elements) {
        if (el.innerText && el.innerText.trim().includes(match)) {
          el.click();
          return true;
        }
      }
      return false;
    }, selector, textMatch);
  }

  console.log('Loading client application on http://localhost:6500...');
  await page.goto('http://localhost:6500', { waitUntil: 'networkidle2', timeout: 20000 });
  await sleep(2500);

  // If on landing page, click Explore / Dashboard to enter main application
  const entered = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button, a'));
    for (const b of buttons) {
      if (b.innerText && (b.innerText.includes('Explore Platform') || b.innerText.includes('Launch') || b.innerText.includes('Get Started') || b.innerText.includes('Today') || b.innerText.includes('Dashboard'))) {
        b.click();
        return true;
      }
    }
    return false;
  });
  if (entered) {
    await sleep(2000);
  }

  // ==========================================
  // 1. COURSES PAGE (OUTER & INNER SECTIONS)
  // ==========================================
  console.log('\n--- 1. Capturing Courses Page ---');
  await clickByText('button, a', 'Courses');
  await sleep(2000);

  // 1A. Full-page capture of complete 11-Chapter Academic Curriculum Catalog
  await saveShot('courses_full_page.png', { fullPage: true });

  // 1B. Filter by Domain (click 'Chapter 1' or another filter pill)
  const clickedFilter = await page.evaluate(() => {
    const pills = Array.from(document.querySelectorAll('button'));
    for (const p of pills) {
      if (p.innerText && (p.innerText.includes('Chapter 1') || p.innerText.includes('Foundations'))) {
        p.click();
        return true;
      }
    }
    return false;
  });
  if (clickedFilter) {
    await sleep(1500);
    await saveShot('courses_domain_filtered.png', { fullPage: true });
    // Reset to All Domains
    await clickByText('button', 'All Domains');
    await sleep(1000);
  }

  // 1C. Close-up viewport capture of Chapter 1 syllabus card & formula breakdown
  await page.evaluate(() => window.scrollTo(0, 320));
  await sleep(1000);
  await saveShot('courses_chapter_topics_detail.png');

  // ==========================================
  // 2. LEARNING PATH PAGE (OUTER & INNER SECTIONS)
  // ==========================================
  console.log('\n--- 2. Capturing Learning Path Page ---');
  await clickByText('button, a', 'Learning path');
  await sleep(2000);

  // 2A. Full-page capture of Constellation Highway & Prerequisite Gating
  await saveShot('learning_path_full_page.png', { fullPage: true });

  // 2B. Outer section: Highway header & route map nodes
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(800);
  await saveShot('learning_path_outer_highway.png');

  // 2C. Expanded Chapter Module (click on Chapter 1 or Chapter 2 card)
  await page.evaluate(() => {
    const chCards = Array.from(document.querySelectorAll('button, div[role="button"]'));
    for (const c of chCards) {
      if (c.innerText && (c.innerText.includes('Chapter 1') || c.innerText.includes('Foundations'))) {
        c.click();
        break;
      }
    }
  });
  await sleep(1500);
  await page.evaluate(() => window.scrollTo(0, 600));
  await sleep(800);
  await saveShot('learning_path_chapter_expanded.png');

  // 2D. Inner Lesson Experience: Navigate into a lesson topic
  console.log('Navigating into Inner Lesson view...');
  const lessonOpened = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    for (const b of btns) {
      if (b.innerText && (b.innerText.includes('Theory') || b.innerText.includes('Start Lesson') || b.innerText.includes('Open Lesson') || b.innerText.includes('Explore Topic'))) {
        b.click();
        return true;
      }
    }
    return false;
  });
  if (lessonOpened) {
    await sleep(2500);
    await saveShot('learning_path_inner_lesson_full.png', { fullPage: true });
    await saveShot('learning_path_inner_lesson_viewport.png');

    // Return back to learning path
    const returned = await clickByText('button, a', 'Back to Learning Journey') || await clickByText('button, a', 'Learning path');
    await sleep(2000);
  }

  // ==========================================
  // 3. OPEN LAB PAGE (OUTER & INNER SECTIONS)
  // ==========================================
  console.log('\n--- 3. Capturing Open Lab Page ---');
  await clickByText('button, a', 'Open Lab');
  await sleep(2500);

  // 3A. Outer Section: Interactive Chapter Lab with Circuit Grid & 3D Bloch Sphere
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(1000);
  await saveShot('open_lab_outer_interactive_lab_full.png', { fullPage: true });
  await saveShot('open_lab_outer_interactive_lab_viewport.png');

  // 3B. Inner Section: Switch to "Colab Notebook Templates" Tab
  console.log('Switching to Colab Notebooks tab...');
  const switchedToNotebooks = await clickByText('button', 'Colab Notebook Templates');
  if (switchedToNotebooks) {
    await sleep(2000);
    // Full-page capture of notebook templates & code previews
    await saveShot('open_lab_inner_notebooks_full.png', { fullPage: true });
    await saveShot('open_lab_inner_notebooks_viewport.png');

    // Click on a different lab in the list (e.g., Bell Entanglement or Teleportation)
    await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('button, div[role="button"]'));
      for (const item of items) {
        if (item.innerText && item.innerText.includes('Bell')) {
          item.click();
          break;
        }
      }
    });
    await sleep(1500);
    await saveShot('open_lab_inner_code_preview_detail.png');

    // Test in sandbox if button present
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      for (const b of btns) {
        if (b.innerText && (b.innerText.includes('Test in Sandbox') || b.innerText.includes('Run in Sandbox') || b.innerText.includes('Run Python'))) {
          b.click();
          break;
        }
      }
    });
    await sleep(2000);
    await saveShot('open_lab_inner_sandbox_output.png');
  }

  // ==========================================
  // 4. ASSESSMENTS PAGE (OUTER & INNER SECTIONS)
  // ==========================================
  console.log('\n--- 4. Capturing Assessments Page ---');
  await clickByText('button, a', 'Assessments');
  await sleep(2500);

  // 4A. Outer Section: Full-page capture of Multi-Modal Assessment Catalog
  await saveShot('assessments_outer_catalog_full.png', { fullPage: true });
  await saveShot('assessments_outer_catalog_viewport.png');

  // 4B. Filter complexity (click 'Core' or 'Intermediate' if available)
  const filteredComplexity = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    for (const b of btns) {
      if (b.innerText && (b.innerText.includes('Foundation') || b.innerText.includes('Intermediate') || b.innerText.includes('Core'))) {
        b.click();
        return true;
      }
    }
    return false;
  });
  if (filteredComplexity) {
    await sleep(1200);
    await saveShot('assessments_outer_filtered.png');
  }

  // 4C. Inner Section: Start Active Practice Exam
  console.log('Launching Inner Practice Exam...');
  const examStarted = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    for (const b of btns) {
      if (b.innerText && (b.innerText.includes('Start Diagnostic Exam') || b.innerText.includes('Start Practice') || b.innerText.includes('Begin Exam') || b.innerText.includes('Retake Placement'))) {
        b.click();
        return true;
      }
    }
    return false;
  });

  if (examStarted) {
    await sleep(3000);
    // Inner active testing interface
    await saveShot('assessments_inner_practice_exam_full.png', { fullPage: true });
    await saveShot('assessments_inner_practice_exam_viewport.png');

    // Click an option to show active interaction state
    await page.evaluate(() => {
      const options = Array.from(document.querySelectorAll('input[type="radio"], button, label'));
      for (const opt of options) {
        if (opt.innerText && (opt.innerText.includes('|') || opt.innerText.includes('A') || opt.innerText.includes('Superposition'))) {
          opt.click();
          break;
        }
      }
    });
    await sleep(1500);
    await saveShot('assessments_inner_question_answered.png');
  }

  await browser.close();
  console.log('\n=============================================');
  console.log('ALL REQUESTED INNER & OUTER SCREENSHOTS CAPTURED!');
  console.log('Saved to:');
  console.log('1. d:/sih2026/docs/screenshots');
  console.log('2. d:/sih2026/SIH-DOCS/docs/screenshots');
  console.log('=============================================\n');
}

run().catch((err) => {
  console.error('Fatal error during capture:', err);
  process.exit(1);
});
