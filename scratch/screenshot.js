const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    const htmlPath = path.resolve(__dirname, '..', 'public', 'certificate-preview.html');
    const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');
    console.log("Loading:", fileUrl);
    
    await page.setViewportSize({ width: 1400, height: 1050 });
    await page.goto(fileUrl, { waitUntil: 'networkidle', timeout: 30000 });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(2500);
    
    const dest = path.resolve('C:\\Users\\Mohit\\.gemini\\antigravity\\brain\\f903d4c8-0f8c-4a53-b7ed-1a0dbb5ba2e1', 'certificate-v3.png');
    await page.screenshot({ path: dest, fullPage: true });
    console.log("Done:", dest);
  } catch (e) {
    console.error("Error:", e.message);
  } finally {
    await browser.close();
  }
})();
