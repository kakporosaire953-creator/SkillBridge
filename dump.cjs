const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  
  await page.evaluate(() => {
    localStorage.setItem('sb_user', JSON.stringify({
      id: "u1", name: "Alpha", email: "alpha@example.com", role: "talent", status: "verified"
    }));
  });
  
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  
  console.log("BODY:", await page.content());
  await browser.close();
})();
