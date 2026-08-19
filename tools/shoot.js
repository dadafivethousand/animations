// Still-capture for the print pieces in this repo.
//
//   npm start                                    # in one shell, from the root
//   mkdir -p /tmp/rec && cd /tmp/rec && npm i puppeteer
//   SEL=.pz-page SCALE=3 OUT=~/Downloads/<name>.png \
//     NODE_PATH=/tmp/rec/node_modules node <repo>/tools/shoot.js
//
// tools/record.js is for the animations; this is its counterpart for anything
// that is one flat frame (posters, flyers, counter cards). It screenshots ONE
// ELEMENT rather than the viewport, so the on-screen surround around the sheet
// never lands in the file.
//
// SCALE is the device pixel ratio, and it is what sets print resolution: the
// poster's CSS box is 100px per inch, so SCALE=3 gives 300dpi and SCALE=6
// gives 600. Nothing is ever resampled — Chrome rasterises the vector logo and
// the type at the final size.
const os = require("os");
const path = require("path");
const puppeteer = require("puppeteer");

const URL = process.env.URL || "http://localhost:3000";
const SEL = process.env.SEL || ".pz-page";
const SCALE = Number(process.env.SCALE || 3);
const OUT = (process.env.OUT || path.join(os.tmpdir(), "poster.png")).replace(
  /^~/,
  os.homedir()
);

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--hide-scrollbars", "--force-color-profile=srgb"],
  });
  const page = await browser.newPage();
  // Tall enough that the whole sheet is inside the layout viewport; an element
  // screenshot of something scrolled out of view comes back clipped.
  await page.setViewport({ width: 1000, height: 1300, deviceScaleFactor: SCALE });
  await page.goto(URL, { waitUntil: "networkidle0", timeout: 120000 });
  const el = await page.waitForSelector(SEL, { timeout: 60000 });
  // The Google Fonts faces load after networkidle in dev; capturing before
  // they swap prints the whole poster in Helvetica.
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 600));
  await el.screenshot({ path: OUT, type: "png", captureBeyondViewport: false });
  const box = await el.boundingBox();
  console.log(
    `${OUT}  ${Math.round(box.width * SCALE)}x${Math.round(box.height * SCALE)}`
  );
  await browser.close();
})();
