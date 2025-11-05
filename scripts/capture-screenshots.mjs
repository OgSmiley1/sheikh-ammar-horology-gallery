import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const URL = 'https://3000-i3h9wm761y73lsy1dwov3-766bcedb.manus-asia.computer/';
const OUTPUT_DIR = join(__dirname, '../docs/screenshots');

const viewports = [
  { name: 'iphone-14-pro-390x844', width: 390, height: 844, deviceScaleFactor: 3 },
  { name: 'pixel-7-412x915', width: 412, height: 915, deviceScaleFactor: 2.625 },
  { name: 'ipad-portrait-768x1024', width: 768, height: 1024, deviceScaleFactor: 2 },
  { name: 'desktop-1440x900', width: 1440, height: 900, deviceScaleFactor: 1 },
];

async function captureScreenshots() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  for (const viewport of viewports) {
    console.log(`\nCapturing ${viewport.name}...`);
    const page = await browser.newPage();
    
    await page.setViewport({
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: viewport.deviceScaleFactor,
    });

    await page.goto(URL, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Wait for hero slideshow to load
    await page.waitForSelector('img[alt*="Sheikh Ammar"]', { timeout: 10000 });
    
    // Wait a bit for animations
    await new Promise(resolve => setTimeout(resolve, 2000));

    const outputPath = join(OUTPUT_DIR, `${viewport.name}.png`);
    await page.screenshot({
      path: outputPath,
      fullPage: false, // Capture viewport only
    });
    
    console.log(`✓ Saved: ${outputPath}`);
    await page.close();
  }

  await browser.close();
  console.log('\n✅ All screenshots captured successfully!');
}

captureScreenshots().catch(console.error);
