const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
  
  await page.goto('https://glints.com/id/lowongan-kerja?keyword=programmer', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 4000));
  
  await page.evaluate(async () => {
      await new Promise((resolve) => {
          let totalHeight = 0;
          const distance = 800;
          const timer = setInterval(() => {
              const scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;
              if (totalHeight >= scrollHeight - window.innerHeight || totalHeight > 10000) {
                  clearInterval(timer);
                  resolve();
              }
          }, 300);
      });
  });

  const rawJobs = await page.evaluate(() => {
    const links = document.querySelectorAll('a[href*="/opportunities/jobs/"], a[href*="/jobs/"]');
    const uniqueJobMap = new Map();
    
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      const cleanHref = href.split('?')[0];
      if (!uniqueJobMap.has(cleanHref)) {
        let el = link;
        while (el && el.parentElement && el.innerText.length < 50 && el.tagName !== 'BODY') {
           el = el.parentElement;
        }
        uniqueJobMap.set(cleanHref, { 
            href: cleanHref, 
            text: el.innerText 
        });
      }
    });

    return Array.from(uniqueJobMap.values());
  });

  console.log('Total Links Evaluated:', rawJobs.length);
  // Log the first 3 links fully to see their innerText
  console.log('Samples:', JSON.stringify(rawJobs.slice(0, 5), null, 2));

  await browser.close();
})();
