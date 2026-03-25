const axios = require('axios');
const cheerio = require('cheerio');

const RESEARCH_URL = 'https://glints.com/id/lowongan-kerja';

const runResearch = async () => {
    console.log(`Testing connection to: ${RESEARCH_URL}`);
    try {
        const { data } = await axios.get(RESEARCH_URL, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        console.log('Status: 200 OK');
        const $ = cheerio.load(data);
        
        // Check for Job Cards (Common class names or tags)
        // Glints uses dynamic classes, but let's check for "job-card" or typical text
        const title = $('title').text();
        console.log('Page Title:', title);

        // Try to find job elements
        // This is exploratory. Glints is a React App, so content might be in a <script id="__NEXT_DATA__"> or similar
        const nextData = $('#__NEXT_DATA__').html();
        if (nextData) {
            console.log('✅ Found NEXT.js hydration data!');
            const json = JSON.parse(nextData);
            // navigate json to find jobs
            // Usually props.pageProps...
            console.log('Snippet of data keys:', Object.keys(json.props?.pageProps || {}));
            
            // Try to find job list in props
            // This structure varies, need to explore
        } else {
            console.log('❌ NEXT.js data not found in HTML. Might be CSR only or blocked.');
            // Check for other markers
            const jobs = $('div[class*="JobCard"]');
            console.log('Job Card elements found via Cheerio:', jobs.length);
        }

    } catch (err) {
        console.error('Request failed:', err.message);
        if (err.response) {
            console.error('Status:', err.response.status);
        }
    }
};

runResearch();
