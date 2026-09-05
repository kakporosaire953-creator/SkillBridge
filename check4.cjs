const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('LOG:', msg.text()));
  page.on('pageerror', err => console.log('ERR:', err.message));
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  
  // Set the user in localStorage to simulate login
  await page.evaluate(() => {
    localStorage.setItem('sb_active_user_v2', JSON.stringify({
      id: "u1", name: "Alpha", email: "alpha@example.com", role: "talent", status: "verified"
    }));
  });
  
  // Reload to pick up state
  await page.reload({ waitUntil: 'networkidle' });
  
  await page.waitForTimeout(1000);
  
  console.log('Clicking button...');
  try {
    await page.click('button:has-text("Gérer mes compétences")');
    await page.waitForTimeout(2000);
    console.log("Successfully clicked!");
  } catch(e) {
    console.log("Could not find button:", e.message);
  }
  
  console.log("BODY:", await page.content());
  
  await browser.close();
})();
