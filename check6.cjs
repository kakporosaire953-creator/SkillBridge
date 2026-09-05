const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  
  await page.evaluate(() => {
    localStorage.setItem('sb_active_user_v2', JSON.stringify({
      id: "u1", name: "Alpha", email: "alpha@example.com", role: "talent", status: "verified"
    }));
  });
  
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  
  const content = await page.content();
  const fs = require('fs');
  fs.writeFileSync('dashboard.html', content);
  
  await browser.close();
})();
