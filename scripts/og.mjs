// Renders public/og.png, the 1200 × 630 link preview shared by every page.
// The image's text and colours live in this file, not in site.yaml or global.css.
// After a change of name, title or colours: edit this file, then run npm run og.
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';

const font = (weight) =>
  readFileSync(`node_modules/@fontsource/schibsted-grotesk/files/schibsted-grotesk-latin-${weight}-normal.woff2`).toString('base64');

const html = `<!doctype html>
<html><head><style>
  @font-face { font-family: 'Schibsted Grotesk'; font-weight: 500; src: url(data:font/woff2;base64,${font(500)}) format('woff2'); }
  @font-face { font-family: 'Schibsted Grotesk'; font-weight: 600; src: url(data:font/woff2;base64,${font(600)}) format('woff2'); }
  body { margin: 0; width: 1200px; height: 630px; box-sizing: border-box; padding: 80px 88px;
         background: #19202A; color: #ECE7DD; font-family: 'Schibsted Grotesk'; display: flex; flex-direction: column; }
  .name { font-size: 34px; font-weight: 500; color: #A3ADBA; }
  h1 { font-size: 76px; line-height: 1.05; font-weight: 600; letter-spacing: -0.025em; margin: 36px 0 0; max-width: 15ch; }
  .url { margin-top: auto; font-size: 28px; font-weight: 500; color: #E9B872; }
</style></head>
<body>
  <div class="name">Victor Cyprien, freelance à Toulouse</div>
  <h1>Back-end et DevOps pour PME et startups.</h1>
  <div class="url">victorcyprien.dev</div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: 'public/og.png' });
await browser.close();
console.log('public/og.png written');
