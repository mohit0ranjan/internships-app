const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1400, height: 1000 });
  await page.goto('http://localhost:3000/certificate/sample', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'C:/Users/Mohit/.gemini/antigravity/brain/f903d4c8-0f8c-4a53-b7ed-1a0dbb5ba2e1/sample_certificate.png', fullPage: true });
  await browser.close();
})();
