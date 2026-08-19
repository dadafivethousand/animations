const path = require("path");
const puppeteer = require("puppeteer");
const SRC = path.join(__dirname, "flyer.html");
(async () => {
  const b = await puppeteer.launch({ args: ["--allow-file-access-from-files","--font-render-hinting=none"] });
  const p = await b.newPage();
  await p.goto("file://" + SRC, { waitUntil: "networkidle0" });
  await p.evaluate(() => document.fonts.ready);
  await p.pdf({ path: path.join(__dirname, "flyer.pdf"), printBackground: true,
                preferCSSPageSize: true, margin:{top:0,right:0,bottom:0,left:0} });
  await p.setViewport({ width: 528, height: 816, deviceScaleFactor: 3 });
  await (await p.$(".sheet")).screenshot({ path: path.join(__dirname, "proof.png") });
  await b.close(); console.log("ok");
})();
