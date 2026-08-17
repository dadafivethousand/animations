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
    args: ["--no-sandbox", "--hide-scrollbars", "--force-color-profile=srgb"],
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
    format: "jpeg",
    quality: 100,
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
  const dur = frames[frames.length - 1].t - frames[0].t;
  console.log(
    `captured ${frames.length} frames over ${dur.toFixed(2)}s ` +
      `(${(frames.length / dur).toFixed(1)} fps)`
  );

  const list = [];
  frames.forEach((f, i) => {
    const p = path.join(dir, String(i).padStart(5, "0") + ".jpg");
    fs.writeFileSync(p, Buffer.from(f.data, "base64"));
    const next = frames[i + 1];
    list.push(`file '${p}'`);
    // The cast only emits on repaint, so the film's final HELD frame produces
    // no frames at all and the video would cut the moment motion stops. The
    // hold is the point of that frame — pad it explicitly.
    list.push(`duration ${(next ? next.t - f.t : HOLD).toFixed(4)}`);
  });
  // concat needs the last file repeated or it drops the final frame
  list.push(`file '${path.join(dir, String(frames.length - 1).padStart(5, "0") + ".jpg")}'`);
  const listPath = path.join(dir, "list.txt");
  fs.writeFileSync(listPath, list.join("\n"));

  await new Promise((res, rej) => {
    const p = spawn(ffmpeg, [
      "-y", "-f", "concat", "-safe", "0", "-i", listPath,
      "-vf", "scale=1080:1920:flags=lanczos,format=yuv420p",
      "-r", String(FPS),
      "-c:v", "libx264", "-preset", "slow", "-crf", "18",
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
