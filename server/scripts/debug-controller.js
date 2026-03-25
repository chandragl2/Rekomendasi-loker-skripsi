const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const { recommendJobs } = require('../controllers/jobController');
const fs = require('fs');

// Create a dummy PDF file for testing if it doesn't exist
const pdfPath = path.join(__dirname, 'test-cv.pdf');
if (!fs.existsSync(pdfPath)) {
    // Minimal valid PDF content
    const content = `%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R /Parent 2 0 R >>\nendobj\n4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n5 0 obj\n<< /Length 44 >>\nstream\nBT /F1 24 Tf 100 700 Td (Frontend React Developer) Tj ET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f\n0000000010 00000 n\n0000000060 00000 n\n0000000157 00000 n\n0000000293 00000 n\n0000000380 00000 n\ntrailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n474\n%%EOF`;
    fs.writeFileSync(pdfPath, content);
}

// Mock Express Request/Response
const req = {
    file: {
        buffer: fs.readFileSync(pdfPath),
        mimetype: 'application/pdf'
    }
};

const res = {
    json: (data) => console.log('Response JSON:', JSON.stringify(data, null, 2)),
    status: (code) => {
        console.log('Response Status:', code);
        return {
            json: (data) => console.log('Error JSON:', data)
        };
    }
};

dotenv.config({ path: path.join(__dirname, '../.env') });

const runDebug = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');
        
        // Run the controller
        await recommendJobs(req, res);

    } catch (err) {
        console.error('Unhandled Error:', err);
    } finally {
        await mongoose.disconnect();
    }
};

// Mock pdf-parse to bypass file issues
const mockPdfParse = async (buffer) => {
    console.log('Mock PDF Parse called');
    return { text: "Frontend Developer React JavaScript" }; // Dummy text
};

// We need to override the require in the controller, but that's hard without dependency injection.
// Instead, let's just modify the controller to export the logic or we just check the DB part separately.
// Actually, I can use `proxyquire` or just overwrite the require cache if I wanted, but let's just 
// use the existing controller and hope the PDF I generate is valid...
// OR better: Create a valid PDF using `pdf-lib` if available, or just use a simpler test.

// Let's try to fix the PDF binary writing.
// The previous writeFileSync was likely using utf8 encoding for binary data.
const content = `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>/Contents 4 0 R>>endobj
4 0 obj<</Length 9>>stream
(Hello)Tj
endstream
endobj
xref
0 5
0000000000 65535 f
0000000010 00000 n
0000000053 00000 n
0000000102 00000 n
0000000189 00000 n
trailer<</Size 5/Root 1 0 R>>
startxref
238
%%EOF`;

fs.writeFileSync(pdfPath, content); 
// Note: This is still risky without proper binary handling, but let's try.

runDebug();

runDebug();
