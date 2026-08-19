// Renders coupon.html to a perfect square PNG.
//   NODE_PATH=/tmp/rec/node_modules node shot.js
const path = require("path");
const puppeteer = require("puppeteer");

const SRC = process.env.SRC || path.join(__dirname, "coupon.html");
const OUT = process.env.OUT || path.join(__dirname, "out.png");
const SIZE = Number(process.env.SIZE || 1080);
const SCALE = Number(process.env.SCALE || 2);

(async () => {
  const browser = await puppeteer.launch({
    args: ["--allow-file-access-from-files", "--font-render-hinting=none"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: SIZE, height: SIZE, deviceScaleFactor: SCALE });
  await page.goto("file://" + SRC, { waitUntil: "networkidle0" });
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({
    path: OUT,
    clip: { x: 0, y: 0, width: SIZE, height: SIZE },
  });
  await browser.close();
  console.log("wrote", OUT);
})();
