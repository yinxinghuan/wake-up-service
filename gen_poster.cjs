/**
 * Wake-Up Service poster — puppeteer screenshot of the lobby LCD device.
 *
 * Run (uses mugshot-booth's local puppeteer to avoid duplicating the
 * ~300 MB chromium download):
 *
 *   npm run preview &
 *   ( cd ../mugshot-booth && node ../wake-up-service/gen_poster.cjs )
 *   ~/miniconda3/bin/python3 gen_poster.py
 */
const puppeteer = require('puppeteer');
const path = require('path');

const URL = process.env.WUS_PREVIEW_URL || 'http://localhost:4180/wake-up-service/';
const OUT = path.resolve(__dirname, '../wake-up-service/_poster_raw.png');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 360,
    height: 640,
    deviceScaleFactor: 3,
  });
  console.log('navigating to', URL);
  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 15000 });

  // wait for fonts + LED filter to settle
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 1200));

  await page.screenshot({ path: OUT, omitBackground: false });
  console.log('saved', OUT);

  await browser.close();
})();
