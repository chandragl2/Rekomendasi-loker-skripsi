const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Job = require('../models/Job');
const fs = require('fs');
const path = require('path');

dotenv.config();

(async () => {
    await connectDB();
    try {
        const csvPath = path.join(__dirname, 'data/all_jobs.csv');
        let csvContent = 'ID,Title,Company,Location,Type,Category,Skills,Description,Created At\n';
        
        const dbAll = await Job.find({}).lean();
        
        dbAll.forEach(j => {
            const escapeCsv = (str) => `"${(str || '').toString().replace(/"/g, '""')}"`;
            const row = [
                j._id,
                escapeCsv(j.title),
                escapeCsv(j.company),
                escapeCsv(j.location),
                escapeCsv(j.type),
                escapeCsv(j.category),
                escapeCsv((j.skills || []).join('; ')),
                escapeCsv(j.description),
                j.createdAt || new Date().toISOString()
            ].join(',');
            csvContent += row + '\n';
        });
        
        fs.writeFileSync(csvPath, csvContent, 'utf-8');
        console.log(`Berhasil mengekspor ${dbAll.length} job ke all_jobs.csv`);
    } catch (e) {
        console.error(e);
    }
    process.exit(0);
})();
