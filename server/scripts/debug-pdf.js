const pdfParseRequire = require('pdf-parse');

console.log('Type of require:', typeof pdfParseRequire);
console.log('Is function?', typeof pdfParseRequire === 'function');
console.log('Keys:', Object.keys(pdfParseRequire));
if (pdfParseRequire.default) {
    console.log('Type of default:', typeof pdfParseRequire.default);
}

let pdfParse = pdfParseRequire;
if (typeof pdfParse !== 'function' && pdfParse.default) {
    pdfParse = pdfParse.default;
}

console.log('Final pdfParse type:', typeof pdfParse);

try {
    // fast check
    if (typeof pdfParse === 'function') {
        console.log('It is a function!');
    } else {
        console.log('It is NOT a function!');
    }
} catch (e) {
    console.error(e);
}
