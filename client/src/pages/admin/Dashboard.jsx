import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Briefcase, 
  Zap, 
  Tag, 
  CheckCircle2, 
  TrendingUp, 
  RefreshCw, 
  Loader2 
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip 
} from "recharts";
import { motion } from "framer-motion";

const Dashboard = ({ onSyncData, stats, loading, syncing }) => {
  const dashboardStats = [
    {
      label: "Total Lowongan",
      value: stats.totalJobs.toLocaleString(),
      icon: Briefcase,
      change: "Aktif di database",
      color: "from-blue-600 to-cyan-500",
    },
    {
      label: "Scraping Terakhir",
      value: stats.lastScrape ? new Date(stats.lastScrape).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' }) : "-",
      icon: Zap,
      change: stats.lastScrape ? new Date(stats.lastScrape).toLocaleDateString() : "Belum pernah",
      color: "from-emerald-600 to-teal-500",
    },
    {
      label: "Total Kategori",
      value: stats.totalCategories,
      icon: Tag,
      change: "Kategori terdeteksi",
      color: "from-purple-600 to-pink-500",
    },
    {
      label: "Sistem Status",
      value: "Online",
      icon: CheckCircle2,
      change: "API & DB Terkoneksi",
      color: "from-orange-600 to-amber-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* HERO SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Selamat Datang, Admin</h2>
          <p className="text-slate-500 mt-1 font-medium">Monitoring data lowongan pekerjaan secara realtime.</p>
        </div>
        <button
          onClick={onSyncData}
          disabled={syncing}
          className={`relative overflow-hidden group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-2xl transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          {syncing ? (
            <Loader2 className="w-5 h-5 animate-spin relative z-10" />
          ) : (
            <RefreshCw className="w-5 h-5 relative z-10" />
          )}
          <span className="relative z-10">{syncing ? "Sinkronisasi Data..." : "Sync Data"}</span>
        </button>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200/60 hover:shadow-xl hover:shadow-slate-200/50 transition-all group overflow-hidden relative"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-[0.03] rounded-bl-[4rem] group-hover:scale-150 transition-transform duration-500`}></div>
            
            <div className="flex items-start justify-between relative z-10">
              <div className="space-y-1">
                <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-3xl font-black text-slate-900">{loading ? "..." : stat.value}</h3>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/10`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="mt-6 flex items-center gap-2 relative z-10">
              <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-bold uppercase tracking-tighter">Status</span>
              <span className="text-xs text-slate-400 font-medium">{stat.change}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CHARTS & ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* PIE CHART */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200/60 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Distribusi Kategori</h3>
              <p className="text-slate-400 text-sm font-medium">Berdasarkan data tersimpan</p>
            </div>
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-slate-400" />
            </div>
          </div>
          
          <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="w-full h-[300px] relative">
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-10 h-10 animate-spin text-slate-200" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={8}
                      dataKey="value"
                      stroke="none"
                    >
                      {stats.categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                      itemStyle={{ fontWeight: 'bold' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            
            <div className="w-full md:w-64 space-y-3">
              {stats.categoryData.slice(0, 5).map((cat, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></div>
                    <span className="text-xs font-bold text-slate-700 truncate max-w-[120px]">{cat.name}</span>
                  </div>
                  <span className="text-xs font-black text-slate-900">{cat.value}</span>
                </div>
              ))}
              {stats.categoryData.length > 5 && (
                <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest pt-2">+{stats.categoryData.length - 5} Kategori Lainnya</p>
              )}
            </div>
          </div>
        </div>

        {/* TOP CATEGORY HIGHLIGHT */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-200 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl w-fit mb-6">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            
            <h3 className="text-2xl font-black mb-2">Top Category</h3>
            <p className="text-indigo-100 text-sm font-medium mb-8">Kategori dengan jumlah lowongan terbanyak saat ini.</p>
            
            <div className="mt-auto space-y-6">
              <div className="p-5 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20">
                <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-widest mb-1">Dominant Field</p>
                <h4 className="text-xl font-black">{stats.categoryData[0]?.name || "N/A"}</h4>
                <p className="text-sm font-medium text-white/80 mt-1">{stats.categoryData[0]?.value || 0} Lowongan Aktif</p>
              </div>
              
              <div className="flex items-center justify-between px-2">
                <div>
                  <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-widest">Akurasi AI</p>
                  <p className="text-xl font-black text-white">94.2%</p>
                </div>
                <div className="text-right">
                  <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-widest">Scraper Status</p>
                  <p className="text-xl font-black text-white">Aktif</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SCRAPER STATUS BOX */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200/60">
        <h3 className="text-xl font-black text-slate-900 mb-6">Scraper Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-emerald-500">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Status</p>
              <p className="text-lg font-black text-slate-900">Aktif / Idle</p>
            </div>
          </div>
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-500">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Interval</p>
              <p className="text-lg font-black text-slate-900">Setiap 30 Menit</p>
            </div>
          </div>
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-purple-500">
              <Tag className="w-5 h-5 fill-current" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Sources</p>
              <p className="text-lg font-black text-slate-900">Glints.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
