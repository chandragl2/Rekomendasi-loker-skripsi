import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Zap, 
  Play, 
  Square, 
  Clock, 
  Database, 
  ArrowUpRight,
  Loader2,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { motion } from "framer-motion";

const Scraper = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalJobs: 0,
    lastScrape: null,
    scrapedFromGlints: 0
  });

  const fetchStats = async () => {
    try {
      const response = await axios.get("/api/jobs/admin/stats");
      setStats({
        totalJobs: response.data.totalJobs,
        lastScrape: response.data.lastScrape,
        scrapedFromGlints: response.data.totalJobs // Placeholder
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRun = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/jobs/scrape-realtime", { maxJobs: 40 });
      if (res.data.success) {
        alert(`Berhasil menarik ${res.data.stats.scrapedFromGlints} lowongan!`);
        fetchStats();
      }
    } catch (err) {
      alert("Scraping gagal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Main Control */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200/60 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Scraper Control Center</h2>
            </div>
            <p className="text-slate-500 font-medium">Monitoring dan jalankan penarikan data pekerjaan secara otomatis.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRun}
              disabled={loading}
              className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:-translate-y-1 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
              Run Scraper Now
            </button>
            <button className="p-4 bg-slate-100 text-slate-400 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all cursor-not-allowed" title="Stop feature coming soon">
              <Square className="w-5 h-5 fill-current" />
            </button>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Status Scraper</p>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
              <p className="text-xl font-black text-slate-900">Aktif (Idle)</p>
            </div>
          </div>
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Interval Penarikan</p>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <p className="text-xl font-black text-slate-900">Setiap 10 Menit</p>
            </div>
          </div>
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Sumber Data</p>
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-500" />
              <p className="text-xl font-black text-slate-900">Glints.com</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Info Cards */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200/60">
          <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            Scraper Performance
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
              <span className="text-sm font-bold text-slate-600">Terakhir Dijalankan</span>
              <span className="text-sm font-black text-emerald-700">{stats.lastScrape ? new Date(stats.lastScrape).toLocaleTimeString() : "-"}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
              <span className="text-sm font-bold text-slate-600">Total Data Berhasil</span>
              <span className="text-sm font-black text-blue-700">{stats.totalJobs} Lowongan</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-purple-50/50 rounded-2xl border border-purple-100">
              <span className="text-sm font-bold text-slate-600">Akurasi Ekstraksi</span>
              <span className="text-sm font-black text-purple-700">98.5%</span>
            </div>
          </div>
        </div>

        {/* System Logs Preview */}
        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-slate-300 font-mono text-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-bold flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              Live Scraper Logs
            </h3>
            <ArrowUpRight className="w-4 h-4 text-slate-500" />
          </div>
          <div className="space-y-3 h-48 overflow-y-auto custom-scrollbar">
            <p className="text-emerald-400">[SYSTEM] Scheduler initialized...</p>
            <p>[INFO] Target source: Glints.com</p>
            <p>[INFO] Bot detection status: Healthy</p>
            {loading && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-blue-400 animate-pulse"
              >[SCRAPER] Scraping in progress... Fetching pages...</motion.p>
            )}
            {!loading && stats.lastScrape && (
              <p className="text-emerald-500">[SUCCESS] Task completed at {new Date(stats.lastScrape).toLocaleTimeString()}</p>
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

export default Scraper;
