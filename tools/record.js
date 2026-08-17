// Screen-recorder for the animations repo.
//
//   npm start                                    # in one shell, from the root
//   mkdir -p /tmp/rec && cd /tmp/rec && npm i puppeteer ffmpeg-static
//   MS=11500 HOLD=1.6 OUT=~/Downloads/<ad>.mp4 \
//     NODE_PATH=/tmp/rec/node_modules node <repo>/tools/record.js
//
// puppeteer and ffmpeg-static are installed OUTSIDE this repo on purpose:
// puppeteer pulls its own Chromium, and none of that belongs in the install
// every ad build has to do. NODE_PATH is what lets this file, sitting in the
// repo, require them from there — require() resolves from the SCRIPT's
// directory, not the shell's, so cd-ing to /tmp/rec is not enough on its own.
//
// MS is how long to sit on the page, so it has to cover the whole timeline in
// the component plus the tail; HOLD is the pause on the final frame.
//
// 1080x1920 true 9:16 — a 360x640 viewport at deviceScaleFactor 3 lands there
// exactly, with no scaling anywhere in the pipeline. Instagram Reels presents
// 9:16, so capturing at a phone's own 19.5:9 gets pillarboxed and the ad plays
// at ~76% of the size it could.
//
// Uses CDP Page.startScreencast rather than screenshot-in-a-loop: screenshots
// are too slow to be evenly spaced and the motion judders. Frames come back
// with their own timestamps, which become per-frame durations in the concat
// list, so real timing survives even when capture rate wobbles.
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");
const puppeteer = require("puppeteer");
const ffmpeg = require("ffmpeg-static");

const URL = process.env.URL || "http://localhost:3000";
const MS = Number(process.env.MS || 11500);
const OUT = process.env.OUT || path.join(os.tmpdir(), "ad.mp4");
// The page is plain white between navigation and React mounting; paint it the
// stage colour so the first frames are not a flash of something else.
const BG = process.env.BG || "#fbfbfc";
const FPS = Number(process.env.FPS || 30);
// Seconds to sit on the finished frame after the last repaint.
const HOLD = Number(process.env.HOLD || 1.6);

(async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "frames-"));
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--hide-scrollbars",
      "--force-color-profile=srgb",
      // THESE TWO ARE THE WHOLE BALLGAME. setViewport's deviceScaleFactor
      // applies to page.screenshot(), but NOT to the compositor surface the
      // screencast reads: without these the cast hands back 360x640 frames,
      // ffmpeg upscales them 3x to hit 1080x1920, and every logo and every
      // letter in the film is soft. It looks like bad artwork. It is not.
      "--force-device-scale-factor=3",
      "--window-size=360,640",
    ],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 360, height: 640, deviceScaleFactor: 3 });
  await page.evaluateOnNewDocument((bg) => {
    const s = document.createElement("style");
    s.textContent = `html,body{background:${bg};margin:0}`;
    document.documentElement.appendChild(s);
  }, BG);

  const client = await page.target().createCDPSession();
  const frames = [];
  let armed = false;

  client.on("Page.screencastFrame", async (f) => {
    try {
      await client.send("Page.screencastFrameAck", { sessionId: f.sessionId });
    } catch (e) {
      /* the cast is already stopped */
    }
    // Everything before DOMContentLoaded is the PREVIOUS page still on screen —
    // keep it and the tail of the last play ends up at the head of the video.
    if (!armed) return;
    frames.push({ t: f.metadata.timestamp, data: f.data });
  });

  await page.goto("about:blank");
  // Start the cast BEFORE the navigation, or the ad's opening frames are gone
  // by the time the first frame arrives.
  await client.send("Page.startScreencast", {
    // PNG, not JPEG: the stage is a near-white flat gradient, which is exactly
    // what JPEG bands, and the frames are the master — compression belongs in
    // the H.264 encode at the end, once, not in every frame going into it.
    format: "png",
    maxWidth: 1080,
    maxHeight: 1920,
    everyNthFrame: 1,
  });
  page.once("domcontentloaded", () => {
    armed = true;
  });
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, MS));
  await client.send("Page.stopScreencast").catch(() => {});
  await browser.close();

  if (frames.length < 2) throw new Error(`captured ${frames.length} frames`);

  // A 1x capture silently upscaled to 1080x1920 is the failure mode this
  // recorder had for its whole first life, and it is invisible until someone
  // looks at a logo up close and blames the logo. Refuse to encode it.
  const png = Buffer.from(frames[0].data, "base64");
  const w = png.readUInt32BE(16);
  const h = png.readUInt32BE(20);
  if (w !== 1080 || h !== 1920) {
    throw new Error(
      `frames are ${w}x${h}, not 1080x1920 — the compositor is not at ` +
        `deviceScaleFactor 3 (check --force-device-scale-factor / --window-size)`
    );
  }
  const dur = frames[frames.length - 1].t - frames[0].t;
  console.log(
    `captured ${frames.length} frames over ${dur.toFixed(2)}s ` +
      `(${(frames.length / dur).toFixed(1)} fps)`
  );

  const list = [];
  frames.forEach((f, i) => {
    const p = path.join(dir, String(i).padStart(5, "0") + ".png");
    fs.writeFileSync(p, Buffer.from(f.data, "base64"));
    const next = frames[i + 1];
    list.push(`file '${p}'`);
    // The cast only emits on repaint, so the film's final HELD frame produces
    // no frames at all and the video would cut the moment motion stops. The
    // hold is the point of that frame — pad it explicitly.
    list.push(`duration ${(next ? next.t - f.t : HOLD).toFixed(4)}`);
  });
  // concat needs the last file repeated or it drops the final frame
  list.push(`file '${path.join(dir, String(frames.length - 1).padStart(5, "0") + ".png")}'`);
  const listPath = path.join(dir, "list.txt");
  fs.writeFileSync(listPath, list.join("\n"));

  await new Promise((res, rej) => {
    const p = spawn(ffmpeg, [
      "-y",
      // THE RGB -> YUV CONVERSION IS WHERE THE LOGOS WERE DYING. H.264 4:2:0
      // stores colour at half resolution, and swscale's default is to DROP
      // every other chroma sample rather than filter it. On footage nobody
      // sees that. On a flat white frame carrying a red wordmark it is the
      // whole image: the Staples red is a chroma-dominant edge with only
      // moderate luma contrast, so the mark went soft while the black Code
      // Ninjas type beside it stayed sharp — which reads as bad artwork.
      // full_chroma_int interpolates those samples instead, lanczos filters
      // them. Measured against the browser's own 3x render, this plus the crf
      // below takes red-channel SSIM from .9869 to .9897 and overall .9894 to
      // .9922, and the remaining gap is 4:2:0 itself, not the encode.
      "-sws_flags", "lanczos+accurate_rnd+full_chroma_int",
      "-f", "concat", "-safe", "0", "-i", listPath,
      "-vf", "format=yuv420p",   // frames are already 1080x1920; asserted above
      "-r", String(FPS),
      // crf 18 is a footage number. This film is flat vector art, small type
      // and a held final frame that gets screenshotted, and there 18 spends
      // its bitrate ringing around the letterforms. 14 is still lossy and
      // still small — the whole ad is a few MB — and the frames going in are
      // PNG masters, so there is no reason for the last step to be the lossy
      // one. veryslow because a nine-second film encodes in seconds either
      // way, so the cheaper preset buys nothing.
      "-c:v", "libx264", "-preset", "veryslow", "-crf", "14",
      "-movflags", "+faststart",
      OUT,
    ], { stdio: ["ignore", "ignore", "pipe"] });
    let err = "";
    p.stderr.on("data", (d) => (err += d));
    p.on("close", (c) => (c === 0 ? res() : rej(new Error(err.slice(-1500)))));
  });
  fs.rmSync(dir, { recursive: true, force: true });
  console.log("wrote", OUT);
})();
