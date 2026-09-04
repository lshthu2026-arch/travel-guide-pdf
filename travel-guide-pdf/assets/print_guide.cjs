// 打印 HTML 为 A4 PDF 并输出逐页 overflow metrics；用法：GUIDE_DIR=<WORK> node print_guide.cjs

const pw = require('C:/Users/龙思衡/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path = require('path');
const dir = process.env.GUIDE_DIR ? path.resolve(process.env.GUIDE_DIR) : process.cwd();
const OUTPDF = path.join(dir, 'output', 'pdf', process.env.PDF_NAME || 'travel_guide.pdf');
const HTMLF = path.join(dir, 'tmp', 'guide2', 'html', 'guide.html');
(async () => {
  const b = await pw.chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 900, height: 1400 } });
  await p.goto('file:///' + HTMLF.replace(/\\/g, '/'), { waitUntil: 'networkidle' });
  await p.waitForTimeout(400);
  const m = await p.evaluate(() => {
    const out = [];
    document.querySelectorAll('.page').forEach((pg, idx) => {
      const c = pg.querySelector('.content');
      let maxB = -1, minT = 1e9;
      if (c) {
        const r = c.getBoundingClientRect();
        const els = c.querySelectorAll('*');
        els.forEach(e => { const b = e.getBoundingClientRect(); if (b.bottom > maxB) maxB = b.bottom; if (b.top < minT) minT = b.top; });
      }
      const pr = pg.getBoundingClientRect();
      out.push({ idx: idx + 1, pageH: pr.height, contBottom: c ? c.getBoundingClientRect().bottom : -1, maxBottom: maxB, minTop: minT, overflowPx: maxB > pr.bottom ? (maxB - pr.bottom) : 0 });
    });
    return out;
  });
  console.log(JSON.stringify(m));
  await p.pdf({ path: OUTPDF, width: '210mm', height: '297mm', printBackground: true, preferCSSPageSize: true });
  await b.close();
  console.log('PDF OK', require('fs').statSync(OUTPDF).size);
})();
