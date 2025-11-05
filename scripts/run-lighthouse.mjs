import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const URL = 'https://3000-i3h9wm761y73lsy1dwov3-766bcedb.manus-asia.computer/';
const OUTPUT_DIR = join(__dirname, '../docs/lighthouse');

// Ensure output directory exists
mkdirSync(OUTPUT_DIR, { recursive: true });

const configs = [
  {
    name: 'mobile',
    formFactor: 'mobile',
    screenEmulation: {
      mobile: true,
      width: 390,
      height: 844,
      deviceScaleFactor: 3,
      disabled: false,
    },
  },
  {
    name: 'desktop',
    formFactor: 'desktop',
    screenEmulation: {
      mobile: false,
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      disabled: false,
    },
  },
];

async function runLighthouse(config) {
  console.log(`\n🔍 Running Lighthouse audit for ${config.name}...`);
  
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  
  const options = {
    logLevel: 'info',
    output: ['html', 'json'],
    port: chrome.port,
    formFactor: config.formFactor,
    screenEmulation: config.screenEmulation,
  };

  const runnerResult = await lighthouse(URL, options);

  // Extract scores
  const { lhr } = runnerResult;
  const scores = {
    performance: Math.round(lhr.categories.performance.score * 100),
    accessibility: Math.round(lhr.categories.accessibility.score * 100),
    bestPractices: Math.round(lhr.categories['best-practices'].score * 100),
    seo: Math.round(lhr.categories.seo.score * 100),
  };

  console.log(`\n📊 ${config.name.toUpperCase()} Scores:`);
  console.log(`   Performance:    ${scores.performance}/100 ${scores.performance >= 90 ? '✅' : '❌'}`);
  console.log(`   Accessibility:  ${scores.accessibility}/100 ${scores.accessibility >= 95 ? '✅' : '❌'}`);
  console.log(`   Best Practices: ${scores.bestPractices}/100 ${scores.bestPractices >= 95 ? '✅' : '❌'}`);
  console.log(`   SEO:            ${scores.seo}/100 ${scores.seo >= 95 ? '✅' : '❌'}`);

  // Save reports
  const htmlPath = join(OUTPUT_DIR, `${config.name}-report.html`);
  const jsonPath = join(OUTPUT_DIR, `${config.name}-report.json`);
  
  writeFileSync(htmlPath, runnerResult.report[0]);
  writeFileSync(jsonPath, runnerResult.report[1]);
  
  console.log(`\n💾 Reports saved:`);
  console.log(`   HTML: ${htmlPath}`);
  console.log(`   JSON: ${jsonPath}`);

  await chrome.kill();
  
  return scores;
}

async function main() {
  console.log('🚀 Starting Lighthouse audits...\n');
  
  const results = {};
  
  for (const config of configs) {
    results[config.name] = await runLighthouse(config);
  }

  console.log('\n\n📈 SUMMARY:');
  console.log('═══════════════════════════════════════');
  
  for (const [device, scores] of Object.entries(results)) {
    console.log(`\n${device.toUpperCase()}:`);
    console.log(`  Performance:    ${scores.performance}/100`);
    console.log(`  Accessibility:  ${scores.accessibility}/100`);
    console.log(`  Best Practices: ${scores.bestPractices}/100`);
    console.log(`  SEO:            ${scores.seo}/100`);
  }
  
  console.log('\n✅ Lighthouse audits complete!');
}

main().catch(console.error);
