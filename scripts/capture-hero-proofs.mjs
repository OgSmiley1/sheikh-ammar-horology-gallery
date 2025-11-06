import puppeteer from 'puppeteer';

const baseUrl = process.env.HERO_PROOF_URL ?? 'http://127.0.0.1:4173/';

const viewports = [
  { name: 'iphone14pro', width: 390, height: 844 },
  { name: 'pixel7', width: 412, height: 915 },
  { name: 'ipad-768x1024', width: 768, height: 1024 },
  { name: 'desktop-1440x900', width: 1440, height: 900 },
];

const outputDir = new URL('../client/public/proofs/hero-phase5/', import.meta.url);

const launchArgs = ['--no-sandbox', '--disable-setuid-sandbox'];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const run = async () => {
  const browser = await puppeteer.launch({ args: launchArgs });
  try {
    for (const viewport of viewports) {
      const page = await browser.newPage();
      await page.setViewport({ width: viewport.width, height: viewport.height, deviceScaleFactor: 1 });
      await page.goto(baseUrl, { waitUntil: 'networkidle0' });
      await delay(1500);
      await page.screenshot({
        path: new URL(`${viewport.name}.png`, outputDir).pathname,
        fullPage: true,
      });
      await page.close();
    }
  } finally {
    await browser.close();
  }
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
