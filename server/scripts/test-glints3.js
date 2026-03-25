const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
  
  await page.goto('https://glints.com/id/lowongan-kerja', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 4000));

  const result = await page.evaluate(() => {
    // Collect 5 job cards HTML
    const cards = document.querySelectorAll('div[data-testid="job-card"], [class*="JobCard"], a[href*="/opportunities/jobs/"]');
    const data = [];
    
    // Attempt standard logic used in scraper
    let jobElements = [];
    const containerSelectors = [
      '[class*="JobCardsc__JobCardWrapper"]', '[data-testid="job-card"]',
      'article[class*="job"]', '[class*="JobCard"]',
    ];
    let usedSel = '';
    for (const sel of containerSelectors) {
      const found = document.querySelectorAll(sel);
      if (found.length > 0) { 
        jobElements = Array.from(found); 
        usedSel = sel;
        break; 
      }
    }

    // Try extracting titles
    const extracted = [];
    for(const el of jobElements) {
        let titleText = 'NOT FOUND';
        for (const sel of ['h3', 'h2', '[class*="JobTitle"]', '[class*="title"]']) {
          const el2 = el.querySelector(sel);
          if (el2?.innerText?.trim()) { titleText = el2.innerText.trim(); break; }
        }
        
        let jobUrl = 'NOT FOUND';
        const linkEl = el.querySelector('a[href*="/opportunities/jobs/"]');
        if (linkEl) {
          jobUrl = linkEl.getAttribute('href');
        }

        extracted.push({ title: titleText, url: jobUrl });
    }

    return { usedSel, totalMatched: jobElements.length, extracted };
  });

  console.log(JSON.stringify(result, null, 2));
  await browser.close();
  process.exit(0);
})();
