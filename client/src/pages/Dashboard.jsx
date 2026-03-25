import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import UploadCard from '../components/UploadCard';
import JobCard from '../components/JobCard';
import { Loader2, Database, CheckCircle, XCircle, X, RefreshCw, Globe, BarChart2 } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [toast, setToast] = useState(null);
  const [scrapeStats, setScrapeStats] = useState(null); // Hasil statistik scraping realtime

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = (type, message) => setToast({ type, message });



  // Scrape REALTIME dari Glints.com
  const handleScrapeRealtime = async () => {
    setScraping(true);
    setScrapeStats(null);
    try {
      showToast('success', '🔄 Membuka halaman detail tiap job dari Glints... (1-3 menit)');
      const res = await axios.post('http://localhost:5000/api/jobs/scrape-realtime', {
        maxJobs: 40  // Ditingkatkan agar meraup puluhan lowongan tambahan
      }, { timeout: 300000 }); // 5 menit timeout

      const { stats } = res.data;
      setScrapeStats(stats);
      showToast('success',
        `✅ Berhasil! ${stats.scrapedFromGlints} lowongan baru dari Glints + ${stats.seedJobs} seed = ${stats.totalJobs} total.`
      );
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      showToast('error', '❌ Scraping gagal: ' + msg);
    } finally {
      setScraping(false);
    }
  };

  const handleAnalysisComplete = (results) => {
    setJobs(results);
    setShowResults(true);
    setTimeout(() => window.scrollTo({ top: 500, behavior: 'smooth' }), 100);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg border max-w-md w-[calc(100%-2rem)]"
            style={{
              backgroundColor: toast.type === 'success' ? '#f0fdf4' : '#fef2f2',
              borderColor: toast.type === 'success' ? '#86efac' : '#fca5a5',
            }}
          >
            {toast.type === 'success'
              ? <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              : <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            }
            <p className={`text-sm font-medium flex-1 ${toast.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
              {toast.message}
            </p>
            <button onClick={() => setToast(null)} className="flex-shrink-0 text-gray-400 hover:text-gray-600">
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Pencari Kerja</h1>
            <p className="mt-2 text-gray-600">
              Upload CV Anda untuk melihat lowongan yang cocok menggunakan TF-IDF &amp; Cosine Similarity
            </p>

            {/* Tombol Admin */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">

              {/* Tombol Scrape Realtime (utama) */}
              <button
                onClick={handleScrapeRealtime}
                disabled={scraping || analyzing}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg shadow hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {scraping
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> Scraping dari Glints...</>
                  : <><Globe className="h-4 w-4" /> Scrape Realtime dari Glints</>
                }
              </button>


            </div>

            {/* Progress indicator saat scraping */}
            {scraping && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 mx-auto max-w-sm bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-3 text-sm text-indigo-700"
              >
                <div className="flex items-center gap-2 mb-1">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span className="font-semibold">Membuka browser headless...</span>
                </div>
                <p className="text-xs text-indigo-500">
                  Puppeteer membuka listing + halaman <strong>detail setiap job</strong> untuk mengambil deskripsi asli. Estimasi: 1-3 menit tergantung jumlah job.
                </p>
              </motion.div>
            )}

            {/* Statistik hasil scraping */}
            <AnimatePresence>
              {scrapeStats && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 mx-auto max-w-lg bg-white border border-green-200 rounded-xl p-4 shadow-sm text-left"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart2 className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold text-gray-800 text-sm">Hasil Scraping Realtime</h3>
                    <span className="ml-auto text-xs text-gray-400">
                      {new Date(scrapeStats.scrapedAt).toLocaleTimeString('id-ID')}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-indigo-50 rounded-lg p-2 text-center">
                      <div className="text-xl font-bold text-indigo-700">{scrapeStats.scrapedFromGlints}</div>
                      <div className="text-xs text-indigo-500">Dari Glints</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <div className="text-xl font-bold text-gray-700">{scrapeStats.seedJobs}</div>
                      <div className="text-xs text-gray-500">Seed Data</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-2 text-center">
                      <div className="text-xl font-bold text-green-700">{scrapeStats.totalJobs}</div>
                      <div className="text-xs text-green-500">Total Job</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(scrapeStats.categories).map(([cat, count]) => (
                      <span key={cat} className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
                        {cat}: {count}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {!showResults && (
            <div className="mb-12">
              <UploadCard onAnalyze={handleAnalysisComplete} />
            </div>
          )}

          {showResults && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Hasil Rekomendasi ({jobs.length})</h2>
                <button
                  onClick={() => setShowResults(false)}
                  className="text-indigo-600 font-medium hover:underline"
                >
                  Upload CV Baru
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.length > 0 ? (
                  jobs.map((job, index) => (
                    <motion.div
                      key={job.jobId || job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <JobCard job={{ ...job, id: job.jobId || job.id, matchScore: (job.similarityScore * 100).toFixed(1) }} />
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-10">
                    <p className="text-gray-500 text-lg">Tidak ada lowongan yang cocok ditemukan.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
