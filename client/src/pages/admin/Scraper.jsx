import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Activity,
  Briefcase,
  Clock,
  Database,
  ExternalLink,
  Loader2,
  RefreshCw,
  Server,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { motion as Motion } from "framer-motion";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://rekomendasi-loker-skripsi-production.up.railway.app";

const emptyStats = {
  totalActive: 0,
  totalExpired: 0,
  totalScraperJobs: 0,
  lastScraperUpdate: null,
};

const toNumber = (value) =>
  Number.isFinite(Number(value)) ? Number(value) : 0;

const normalizeStats = (data) => ({
  totalActive: toNumber(data?.totalActive),
  totalExpired: toNumber(data?.totalExpired),
  totalScraperJobs: toNumber(data?.totalScraperJobs),
  lastScraperUpdate: data?.lastScraperUpdate || null,
});

const formatDateTime = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const MonitorCard = ({ label, value, icon: Icon, tone }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/70">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
          {label}
        </p>
        <p className="text-3xl font-black text-slate-900 mt-2">
          {toNumber(value).toLocaleString()}
        </p>
      </div>
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center ${tone}`}
      >
        <Icon className="w-5 h-5" />
      </div>
    </div>
  </div>
);

const Scraper = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(emptyStats);

  const fetchStats = async () => {
    const API_URL =
      import.meta.env.VITE_API_URL ||
      "https://rekomendasi-loker-skripsi-production.up.railway.app";
    try {
      setLoading(true);

      const response = await axios.get(`${API_URL}/api/jobs/admin/stats`);
      setStats(normalizeStats(response?.data));
    } catch (err) {
      console.error("Failed to fetch scraper monitoring stats:", err);
      setStats(emptyStats);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const cards = [
    {
      label: "Total Scraper Jobs",
      value: stats?.totalScraperJobs,
      icon: Database,
      tone: "bg-blue-50 text-blue-600",
    },
    {
      label: "Active Jobs",
      value: stats?.totalActive,
      icon: CheckCircle2,
      tone: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Expired Jobs",
      value: stats?.totalExpired,
      icon: AlertTriangle,
      tone: "bg-rose-50 text-rose-600",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200/70 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/5 rounded-full -mr-36 -mt-36 blur-3xl"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <Activity className="w-5 h-5" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                Scraper Monitoring
              </h2>
            </div>
            <p className="text-slate-500 font-medium max-w-2xl">
              Memantau aktivitas scraper eksternal dan sinkronisasi data
              lowongan pekerjaan.
            </p>
          </div>

          <button
            onClick={fetchStats}
            disabled={loading}
            className="flex items-center justify-center gap-3 px-7 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <RefreshCw className="w-5 h-5" />
            )}
            Refresh Data
          </button>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5 relative z-10">
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">
              Status
            </p>
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-blue-500" />
              <p className="text-xl font-black text-slate-900">
                External Scraper
              </p>
            </div>
          </div>
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">
              Schedule
            </p>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-500" />
              <p className="text-xl font-black text-slate-900">
                Managed Externally
              </p>
            </div>
          </div>
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">
              Sumber Data
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-xs font-black">
                <ExternalLink className="w-3 h-3" />
                Glints.com
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-100 text-xs font-black">
                <Server className="w-3 h-3" />
                Scraper Python External
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {cards.map((card, index) => (
          <Motion.div
            key={card.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <MonitorCard {...card} />
          </Motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200/70">
          <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
            <Database className="w-6 h-6 text-blue-500" />
            Scraper Performance
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 p-4 bg-blue-50/60 rounded-2xl border border-blue-100">
              <span className="text-sm font-bold text-slate-600">
                Total Lowongan Aktif
              </span>
              <span className="text-sm font-black text-blue-700">
                {toNumber(stats?.totalActive).toLocaleString()} Lowongan
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-sm font-bold text-slate-600">
                Total Lowongan Scraper
              </span>
              <span className="text-sm font-black text-slate-800">
                {toNumber(stats?.totalScraperJobs).toLocaleString()} Lowongan
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100">
              <span className="text-sm font-bold text-slate-600">
                Last Scraper Update
              </span>
              <span className="text-sm font-black text-emerald-700">
                {formatDateTime(stats?.lastScraperUpdate)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-2xl shadow-2xl text-slate-300">
          <h3 className="text-white text-xl font-black mb-6 flex items-center gap-3">
            <Server className="w-6 h-6 text-blue-300" />
            Scraper Information
          </h3>
          <div className="space-y-4">
            {[
              "Scraper berjalan pada service Python eksternal",
              "Website hanya membaca data dari MongoDB",
              "Jadwal scraping dikontrol oleh service Python eksternal",
              "Status lowongan otomatis mengikuti expiredAt",
              "Data hasil scraping akan diperbarui ketika scraper menemukan data baru",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/10"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm font-semibold leading-6">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200/70">
        <h3 className="text-xl font-black text-slate-900 mb-6">
          Decoupled Architecture
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-4 md:items-center">
          <div className="p-5 bg-violet-50 border border-violet-100 rounded-2xl">
            <p className="text-[10px] font-black uppercase tracking-widest text-violet-400">
              Step 1
            </p>
            <p className="text-lg font-black text-violet-900 mt-1">
              Scraper Python
            </p>
          </div>
          <div className="hidden md:block text-slate-300 font-black">-&gt;</div>
          <div className="p-5 bg-blue-50 border border-blue-100 rounded-2xl">
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">
              Step 2
            </p>
            <p className="text-lg font-black text-blue-900 mt-1">MongoDB</p>
          </div>
          <div className="hidden md:block text-slate-300 font-black">-&gt;</div>
          <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
              Step 3
            </p>
            <p className="text-lg font-black text-emerald-900 mt-1">
              Website MERN
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scraper;
