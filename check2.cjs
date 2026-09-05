const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('LOG:', msg.text()));
  page.on('pageerror', err => console.log('ERR:', err.message));
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  
  // Try to find the skills manager view by simulating a click
  // Actually, wait, to get to dashboard we need to login or mock the state.
  // But wait! Is there a crash when rendering the component directly?
  // I will just wait a bit.
  await page.waitForTimeout(2000);
  console.log("BODY:", await page.content());
  
  await browser.close();
})();
