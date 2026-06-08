const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Job = require("../models/Job");

dotenv.config();

const reactivateExpiredJobs = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error(
        "MONGO_URI atau MONGODB_URI tidak ditemukan di file .env",
      );
    }

    await mongoose.connect(mongoUri);

    const now = new Date();
    const newExpiredAt = new Date(now);
    newExpiredAt.setDate(newExpiredAt.getDate() + 30);

    const result = await Job.updateMany(
      {
        $or: [{ status: "expired" }, { expiredAt: { $lt: now } }],
      },
      {
        $set: {
          status: "active",
          postedAt: now,
          expiredAt: newExpiredAt,
          durationDays: 30,
          updatedAt: now,
        },
      },
    );

    console.log("=================================");
    console.log("Expired jobs reactivated");
    console.log("Matched:", result.matchedCount);
    console.log("Modified:", result.modifiedCount);
    console.log("New expiredAt:", newExpiredAt);
    console.log("=================================");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Failed to reactivate expired jobs:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

reactivateExpiredJobs();
