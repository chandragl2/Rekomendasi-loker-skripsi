const scrapeGlints = require('../utils/scraper');
const { cleanJob } = require('../utils/cleaner');

(async () => {
    try {
        console.log('Testing scraper...');
        const results = await scrapeGlints(40);
        console.log(`Final results: ${results.length}`);
    } catch (e) {
        console.error(e);
    }
})();
