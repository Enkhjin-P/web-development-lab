// Lighthouse хэмжилт: bootstrap болон tailwind хуудсыг тус бүр 5 удаа хэмжиж, медианыг хүснэгтээр хэвлэнэ.
// Ажиллуулах (lab08 хавтсанд): 1) node tools/server.js   2) өөр терминалд: node tools/lh.mjs
// Таны компьютер дээрх Chrome-ийг chrome-launcher өөрөө олно.
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 8099;
const RUNS = 5;
const median = a => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];

const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'] });
const out = {};
for (const name of ['bootstrap', 'tailwind']) {
  out[name] = [];
  for (let i = 0; i < RUNS; i++) {
    const r = await lighthouse(`http://localhost:${PORT}/${name}/index.html`, {
      port: chrome.port, output: 'json', logLevel: 'error',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    });
    const c = r.lhr.categories, a = r.lhr.audits;
    out[name].push({
      perf: Math.round(c.performance.score * 100),
      a11y: Math.round(c.accessibility.score * 100),
      bp: Math.round(c['best-practices'].score * 100),
      seo: Math.round(c.seo.score * 100),
      fcp: a['first-contentful-paint'].numericValue,
      lcp: a['largest-contentful-paint'].numericValue,
      tbt: a['total-blocking-time'].numericValue,
      cls: a['cumulative-layout-shift'].numericValue,
      kb: a['total-byte-weight'].numericValue / 1024,
    });
    console.log(`${name} ${i + 1}/${RUNS} perf=${out[name][i].perf}`);
  }
}
await chrome.kill();
fs.writeFileSync(path.join(here, 'lh.json'), JSON.stringify(out, null, 1));

const m = (n, k) => median(out[n].map(x => x[k]));
const rows = [
  ['Performance', 'perf', 0], ['Accessibility', 'a11y', 0], ['Best Practices', 'bp', 0], ['SEO', 'seo', 0],
  ['FCP (ms)', 'fcp', 0], ['LCP (ms)', 'lcp', 0], ['TBT (ms)', 'tbt', 0], ['CLS', 'cls', 3], ['Нийт хэмжээ (KB)', 'kb', 0],
];
console.log('\n| Үзүүлэлт | Bootstrap | Tailwind |\n|---|---|---|');
for (const [label, k, d] of rows) console.log(`| ${label} | ${m('bootstrap', k).toFixed(d)} | ${m('tailwind', k).toFixed(d)} |`);
console.log('\n(хэмжилт бүрийн медиан, lh.json файлд бүх 5 хэмжилт хадгалагдсан)');
