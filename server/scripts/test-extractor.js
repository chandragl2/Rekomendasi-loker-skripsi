const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.goto('https://glints.com/id/lowongan-kerja', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 4000));
    
    const count = await page.evaluate(() => {
        const s1 = document.querySelectorAll('[data-testid="job-card"]').length;
        const s2 = document.querySelectorAll('[class*="JobCardsc__JobCardWrapper"]').length;
        const s3 = document.querySelectorAll('[class*="JobCardContainer"]').length;
        const s4 = document.querySelectorAll('article[class*="job"]').length;
        const links = document.querySelectorAll('a[href*="/opportunities/jobs/"]').length;
        
        // Find unique links
        const uniqLinks = new Set();
        document.querySelectorAll('a[href*="/opportunities/jobs/"]').forEach(l => {
            uniqLinks.add(l.href.split('?')[0]);
        });
        
        return { s1, s2, s3, s4, links, uniqLinks: uniqLinks.size };
    });
    console.log(count);
    await browser.close();
})();
