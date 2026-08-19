// Renders brochure.html to a print-ready Letter PDF, plus PNG page proofs.
//   NODE_PATH=/tmp/rec/node_modules node pdf.js
const path = require("path");
const puppeteer = require("puppeteer");

const SRC = path.join(__dirname, "brochure.html");
const PDF = process.env.PDF || path.join(__dirname, "brochure.pdf");

(async () => {
  const browser = await puppeteer.launch({
    args: ["--allow-file-access-from-files", "--font-render-hinting=none"],
  });
  const page = await browser.newPage();
  await page.goto("file://" + SRC, { waitUntil: "networkidle0" });
  await page.evaluate(() => document.fonts.ready);

  // preferCSSPageSize honours the @page rule, so the PDF is exactly 8.5x11
  // with no margin of its own to fight the layout's own padding.
  await page.pdf({
    path: PDF,
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  // Page proofs at 150dpi so the layout can be checked without a PDF viewer.
  await page.setViewport({ width: 816, height: 1056, deviceScaleFactor: 1.5 });
  for (const [i, el] of (await page.$$(".page")).entries()) {
    await el.screenshot({ path: path.join(__dirname, `proof-${i + 1}.png`) });
  }

  await browser.close();
  console.log("wrote", PDF);
})();
