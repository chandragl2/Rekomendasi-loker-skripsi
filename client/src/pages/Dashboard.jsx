import React, { useState, useEffect } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import UploadCard from "../components/UploadCard";
import JobCard from "../components/JobCard";
import {
  Loader2,
  Database,
  CheckCircle,
  XCircle,
  X,
  RefreshCw,
  Globe,
  BarChart2,
} from "lucide-react";
import axios from "axios";
import API_URL from "../utils/api";

const RECOMMENDATIONS_KEY = "jobRecommendations";
const CV_FILE_NAME_KEY = "cvFileName";
const CV_TEXT_KEY = "cvText";

const getDuplicateJobKey = (job) =>
  `${job?.title || ""}-${job?.company || ""}-${job?.location || ""}`
    .toLowerCase()
    .trim();

const removeDuplicateJobs = (jobs) => {
  const seen = new Set();

  return jobs.filter((job) => {
    const key = getDuplicateJobKey(job);
    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
};

const isActiveRecommendation = (job) => {
  if (!job) return false;
  if (job.status && job.status !== "active") return false;

  if (job.expiredAt) {
    const expiredAt = new Date(job.expiredAt);
    if (!Number.isNaN(expiredAt.getTime())) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (expiredAt < today) return false;
    }
  }

  return true;
};

const getStoredRecommendationSession = () => {
  if (typeof window === "undefined") return { exists: false, jobs: [] };

  try {
    const stored = window.sessionStorage.getItem(RECOMMENDATIONS_KEY);
    if (stored === null) return { exists: false, jobs: [] };

    const parsed = stored ? JSON.parse(stored) : [];
    const jobs = Array.isArray(parsed)
      ? removeDuplicateJobs(parsed.filter(isActiveRecommendation))
      : [];
    return { exists: true, jobs };
  } catch (error) {
    console.error("Failed to read stored job recommendations:", error);
    return { exists: false, jobs: [] };
  }
};

const Dashboard = () => {
  const [storedRecommendationSession] = useState(() =>
    getStoredRecommendationSession(),
  );
  const [scraping, setScraping] = useState(false);
  const [jobs, setJobs] = useState(storedRecommendationSession.jobs);
  const [showResults, setShowResults] = useState(
    storedRecommendationSession.exists,
  );
  const [toast, setToast] = useState(null);
  const [scrapeStats, setScrapeStats] = useState(null); // Hasil statistik scraping realtime

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = (type, message) => setToast({ type, message });

  // Sync Data dari MongoDB (Karena scraping sudah ditangani oleh Python)
  const handleSyncData = async () => {
    setScraping(true);
    setScrapeStats(null);
    try {
      showToast("success", "Menarik data terbaru dari MongoDB Atlas...");

      const res = await axios.get(`${API_URL}/api/jobs/admin/stats`);
      const stats = res?.data || {};

      const categoryCounts = {};
      if (Array.isArray(stats?.categoryData)) {
        stats.categoryData.forEach((c) => {
          categoryCounts[c?.name] = Number(c?.value) || 0;
        });
      }

      setScrapeStats({
        scrapedFromGlints: Number(stats?.totalJobs) || 0,
        seedJobs: 0,
        totalJobs: Number(stats?.totalJobs) || 0,
        categories: categoryCounts,
        scrapedAt: stats?.lastScrape || new Date().toISOString(),
      });

      showToast(
        "success",
        `Sync berhasil! Menemukan ${Number(stats?.totalJobs) || 0} lowongan di database.`,
      );
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      showToast("error", "Sync gagal: " + msg);
    } finally {
      setScraping(false);
    }
  };

  const handleAnalysisComplete = (results, cvMeta = {}) => {
    const recommendedJobs = Array.isArray(results)
      ? removeDuplicateJobs(results.filter(isActiveRecommendation))
      : [];
    const enrichedJobs = recommendedJobs.map((job) => ({ ...job, ...cvMeta }));

    window.sessionStorage.setItem(
      RECOMMENDATIONS_KEY,
      JSON.stringify(enrichedJobs),
    );
    if (cvMeta.cvFileName) {
      window.sessionStorage.setItem(CV_FILE_NAME_KEY, cvMeta.cvFileName);
    } else {
      window.sessionStorage.removeItem(CV_FILE_NAME_KEY);
    }
    if (cvMeta.cvText) {
      window.sessionStorage.setItem(CV_TEXT_KEY, cvMeta.cvText);
    } else {
      window.sessionStorage.removeItem(CV_TEXT_KEY);
    }

    setJobs(enrichedJobs);
    setShowResults(true);
    setTimeout(() => window.scrollTo({ top: 500, behavior: "smooth" }), 100);
  };

  const handleResetRecommendations = () => {
    window.sessionStorage.removeItem(RECOMMENDATIONS_KEY);
    window.sessionStorage.removeItem(CV_FILE_NAME_KEY);
    window.sessionStorage.removeItem(CV_TEXT_KEY);
    setJobs([]);
    setShowResults(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <Motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg border max-w-md w-[calc(100%-2rem)]"
            style={{
              backgroundColor: toast.type === "success" ? "#f0fdf4" : "#fef2f2",
              borderColor: toast.type === "success" ? "#86efac" : "#fca5a5",
            }}
          >
            {toast.type === "success" ? (
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            )}
            <p
              className={`text-sm font-medium flex-1 ${toast.type === "success" ? "text-green-800" : "text-red-800"}`}
            >
              {toast.message}
            </p>
            <button
              onClick={() => setToast(null)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </Motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-black text-gray-900 mb-4"
            >
              Dashboard Pencari Kerja
            </Motion.h1>
            <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
              Upload CV Anda untuk melihat lowongan yang cocok menggunakan
              algoritma{" "}
              <span className="text-indigo-600 font-bold">
                TF-IDF &amp; Cosine Similarity
              </span>{" "}
              yang akurat.
            </p>

            {/* Tombol Admin */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={handleSyncData}
                disabled={scraping}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white text-sm md:text-base font-bold rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                {scraping ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Syncing Data...
                  </>
                ) : (
                  <>
                    <Database className="h-5 w-5" /> Sync Data
                  </>
                )}
              </button>
            </div>

            {/* Progress indicator saat syncing */}
            {scraping && (
              <Motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 mx-auto max-w-md bg-indigo-50 border border-indigo-100 rounded-2xl p-5 text-sm text-indigo-700 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-indigo-600 p-1.5 rounded-lg">
                    <RefreshCw className="h-4 w-4 text-white animate-spin" />
                  </div>
                  <span className="font-bold">Sync Data Sedang Berjalan</span>
                </div>
                <p className="text-xs text-indigo-500 leading-relaxed text-left">
                  Kami sedang mengambil data lowongan pekerjaan terbaru yang
                  telah disinkronisasikan oleh Python service dari MongoDB
                  Atlas.
                </p>
              </Motion.div>
            )}

            {/* Statistik hasil scraping */}
            <AnimatePresence>
              {scrapeStats && (
                <Motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="mt-8 mx-auto max-w-2xl bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-xl text-left relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -mr-16 -mt-16"></div>

                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-xl">
                        <BarChart2 className="h-5 w-5 text-green-600" />
                      </div>
                      <h3 className="font-black text-gray-800 text-lg">
                        Hasil Scraping Terbaru
                      </h3>
                    </div>
                    <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                      {new Date(scrapeStats.scrapedAt).toLocaleTimeString(
                        "id-ID",
                      )}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="bg-indigo-50/50 rounded-2xl p-4 text-center border border-indigo-50">
                      <div className="text-2xl md:text-3xl font-black text-indigo-700">
                        {scrapeStats.totalJobs}
                      </div>
                      <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mt-1">
                        Total Database
                      </div>
                    </div>
                    <div className="bg-green-50/50 rounded-2xl p-4 text-center border border-green-50">
                      <div className="text-2xl md:text-3xl font-black text-green-700">
                        {Object.keys(scrapeStats.categories || {}).length}
                      </div>
                      <div className="text-xs font-bold text-green-400 uppercase tracking-wider mt-1">
                        Kategori Tersedia
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {Object.entries(scrapeStats.categories || {}).map(
                      ([cat, count]) => (
                        <span
                          key={cat}
                          className="text-[10px] md:text-xs px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl text-gray-600 font-bold"
                        >
                          {cat}:{" "}
                          <span className="text-indigo-600">{count}</span>
                        </span>
                      ),
                    )}
                  </div>
                </Motion.div>
              )}
            </AnimatePresence>
          </div>

          {!showResults && (
            <div className="mb-12">
              <UploadCard onAnalyze={handleAnalysisComplete} />
            </div>
          )}

          {showResults && (
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Hasil Rekomendasi ({jobs.length})
                </h2>
                <button
                  onClick={handleResetRecommendations}
                  className="text-indigo-600 font-medium hover:underline"
                >
                  Upload CV Baru
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.length > 0 ? (
                  jobs.map((job, index) => (
                    <Motion.div
                      key={job.jobId || job.id || job._id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <JobCard
                        job={{
                          ...job,
                          id: job.jobId || job.id || job._id,
                          matchScore: Number.isFinite(Number(job.matchScore))
                            ? Number(job.matchScore).toFixed(1)
                            : (Number(job.similarityScore || 0) * 100).toFixed(1),
                        }}
                      />
                    </Motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-10">
                    <p className="text-gray-500 text-lg">
                      Tidak ada lowongan yang cocok ditemukan.
                    </p>
                  </div>
                )}
              </div>
            </Motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
