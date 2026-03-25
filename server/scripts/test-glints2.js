const puppeteer = require('puppeteer');

(async () => {
  console.log('Starting puppeteer test...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

  console.log('Navigating to Glints...');
  await page.goto('https://glints.com/id/lowongan-kerja', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 4000));

  // Ambil semua links
  const getJobLinks = async () => {
    return await page.evaluate(() => {
      const links = document.querySelectorAll('a[href*="/opportunities/jobs/"]');
      const uniq = new Set();
      links.forEach(l => {
          // split based on ? to remove query params
          const clean = l.href.split('?')[0];
          uniq.add(clean);
      });
      return Array.from(uniq).length;
    });
  };

  console.log('Unique job links initial:', await getJobLinks());

  // Log window.scrollY vs scrollHeight
  await page.evaluate(() => {
    window.scrollBy(0, 1000);
  });
  await new Promise(r => setTimeout(r, 1000));
  
  const scrollData = await page.evaluate(() => {
    return {
      scrollY: window.scrollY,
      scrollHeight: document.body.scrollHeight,
      innerHeight: window.innerHeight,
      htmlScrollHeight: document.documentElement.scrollHeight
    };
  });
  console.log('Scroll data after 1000px scroll:', scrollData);

  // Try clicking load more?
  const searchButtons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim());
  });
  console.log('Buttons found on page:', searchButtons.slice(0, 10)); // just sample

  await browser.close();
})();
