import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { promisify } from 'node:util';
import { execFile } from 'node:child_process';
const run = promisify(execFile);
const out = process.argv[2];
if (!out?.startsWith('/workspace/scratch/')) throw new Error('Pass an absolute scratch output directory');
await mkdir(out, { recursive: true });
const { watches } = JSON.parse(await readFile('dist/watches.json', 'utf8'));
const missing = watches.filter(w => !w.displayImage);
const jobs = missing.map(w => ({ name: `watch-${w.id}`, route: 'watches.getImages', input: { json: { watchId: w.id } } }));
jobs.push({ name: 'sheikh-photos', route: 'sheikhPhotos.getAll' });
jobs.push({ name: 'watches-current', route: 'watches.getAll' });
const results = [];
for (let start = 0; start < jobs.length; start += 4) {
  await Promise.all(jobs.slice(start, start + 4).map(async job => {
    const url = `https://horologygal-es99fpfz.manus.space/api/trpc/${job.route}${job.input ? `?input=${encodeURIComponent(JSON.stringify(job.input))}` : ''}`;
    try {
      const { stdout } = await run('curl', ['--fail', '-sS', '-L', '--max-time', '45', url], { maxBuffer: 8000000 });
      const response = JSON.parse(stdout);
      const rows = response.result?.data?.json;
      if (!Array.isArray(rows)) throw new Error('Unexpected public API response');
      await writeFile(`${out}/${job.name}.json`, JSON.stringify(response, null, 2));
      results.push({ name: job.name, count: rows.length, url });
    } catch (error) {
      results.push({ name: job.name, error: String(error.message).slice(0, 180), url });
    }
  }));
}
await writeFile(`${out}/audit-summary.json`, JSON.stringify(results, null, 2));
console.log(JSON.stringify(results.map(({ name, count, error }) => ({ name, count, error })), null, 2));
