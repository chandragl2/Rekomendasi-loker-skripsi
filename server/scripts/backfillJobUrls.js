const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Job = require("../models/Job");

dotenv.config();

const createGlintsSearchUrl = (job) => {
  const keyword = job.title || job.category || "lowongan kerja";
  const encodedKeyword = encodeURIComponent(keyword.trim());

  return `https://glints.com/id/opportunities/jobs/explore?keyword=${encodedKeyword}`;
};

const backfillJobUrls = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error(
        "MONGO_URI atau MONGODB_URI tidak ditemukan di file .env",
      );
    }

    await mongoose.connect(mongoUri);

    const jobsWithoutUrl = await Job.find({
      $or: [{ url: { $exists: false } }, { url: null }, { url: "" }],
    });

    console.log("=================================");
    console.log("Jobs without URL found:", jobsWithoutUrl.length);
    console.log("=================================");

    let updatedCount = 0;

    for (const job of jobsWithoutUrl) {
      const fallbackUrl = createGlintsSearchUrl(job);

      job.url = fallbackUrl;
      job.source = job.source || "Glints";
      job.updatedAt = new Date();

      await job.save();
      updatedCount++;

      console.log(`Updated: ${job.title} -> ${fallbackUrl}`);
    }

    console.log("=================================");
    console.log("Backfill job URLs completed");
    console.log("Updated:", updatedCount);
    console.log("=================================");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Failed to backfill job URLs:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

backfillJobUrls();
