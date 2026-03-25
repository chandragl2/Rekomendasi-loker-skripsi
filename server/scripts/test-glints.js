const puppeteer = require('puppeteer');

(async () => {
  console.log('Starting puppeteer test...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Referer': 'https://glints.com/',
  });

  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

  console.log('Navigating...');
  await page.goto('https://glints.com/id/lowongan-kerja', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 3000));

  const countCards = async () => {
    return await page.evaluate(() => {
      const els = document.querySelectorAll('[class*="JobCard"], [data-cy*="job"], [data-testid*="job-card"]');
      return els.length;
    });
  };

  console.log('Initial cards:', await countCards());

  const autoScroll = async (page) => {
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 300;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= scrollHeight - window.innerHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 300);
      });
    });
  };

  for(let i=0; i<3; i++) {
    console.log(`Scrolling ${i+1}...`);
    await autoScroll(page);
    await new Promise(r => setTimeout(r, 1500));
    console.log(`Cards after scroll ${i+1}:`, await countCards());
  }

  // Debug finding the "Show More" button or something?
  const buttons = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.map(b => b.innerText.trim()).filter(t => t.toLowerCase().includes('more') || t.toLowerCase().includes('lainnya'));
  });
  console.log('Buttons with more/lainnya:', buttons);
  
  // Look at how many job links
  const links = await page.evaluate(() => {
    const l = document.querySelectorAll('a[href*="/opportunities/jobs/"]');
    return l.length;
  });
  console.log('Job Links:', links);

  await browser.close();
})();
