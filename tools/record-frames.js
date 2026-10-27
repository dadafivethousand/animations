// Frame-stepped recorder for ads that render as a pure function of time.
//
//   npm start                                    # in one shell, from the root
//   URL=http://localhost:3000/?render=1 OUT=~/Downloads/<ad>.mp4 \
//     NODE_PATH=/tmp/rec/node_modules node tools/record-frames.js
//
// tools/record.js screencasts the page in real time, which is right for CSS
// animation but drops frames when a WebGL scene is heavy. This one does not
// run the clock at all: the page (opened with ?render=1) must expose
//   window.__ready              true once textures and fonts are in
//   window.__renderAt(ms)       draw the frame at that time, synchronously
//   window.__dominoEnd (or END) the length of the piece, in ms
// and every frame is drawn on demand and screenshotted, so the export is
// perfectly smooth however long a frame takes.
//
// Same delivery rules as record.js: 360x640 at deviceScaleFactor 3 is
// exactly 1080x1920, nothing is resampled. Writes a silent mp4; mux audio
// separately.
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");
const puppeteer = require("puppeteer");
const ffmpeg = require("ffmpeg-static");

const URL = process.env.URL || "http://localhost:3000/?render=1";
const W = Number(process.env.W || 360);
const H = Number(process.env.H || 640);
const FPS = Number(process.env.FPS || 30);
const OUT = (process.env.OUT || path.join(os.tmpdir(), "ad.mp4")).replace(/^~/, os.homedir());
const ENDVAR = process.env.ENDVAR || "__dominoEnd";

(async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "frames-"));
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--hide-scrollbars", "--force-color-profile=srgb", "--force-device-scale-factor=3", `--window-size=${W},${H}`],
  });
  const page = await browser.newPage();
  page.on("pageerror", (e) => console.error("page error:", e.message));
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 3 });
  await page.goto(URL, { waitUntil: "networkidle0" });
  await page.waitForFunction("window.__ready === true", { timeout: 60000 });
  const end = await page.evaluate((v) => window[v] || window.END, ENDVAR);
  const frames = Math.ceil((end / 1000) * FPS);
  console.log(`rendering ${frames} frames (${(end / 1000).toFixed(2)}s)`);

  for (let f = 0; f < frames; f++) {
    const ms = (f * 1000) / FPS;
    await page.evaluate((t) => window.__renderAt(t), ms);
    await page.screenshot({ path: path.join(dir, `${String(f).padStart(5, "0")}.png`) });
    if (f % 60 === 0) console.log(`  frame ${f}/${frames}`);
  }
  await browser.close();

  const r = spawnSync(
    ffmpeg,
    ["-y", "-loglevel", "error", "-framerate", String(FPS), "-i", path.join(dir, "%05d.png"),
      "-c:v", "libx264", "-preset", "slow", "-crf", "16", "-pix_fmt", "yuv420p", OUT],
    { stdio: "inherit" }
  );
  if (r.status !== 0) process.exit(r.status || 1);
  fs.rmSync(dir, { recursive: true, force: true });
  console.log("wrote", OUT);
})();
