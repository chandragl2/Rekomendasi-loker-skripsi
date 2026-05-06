import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Briefcase, 
  Trash2, 
  Edit2, 
  Search, 
  MapPin, 
  Building2, 
  Calendar,
  ExternalLink,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/jobs/all?search=${search}&page=${page}&limit=10`);
      setJobs(response.data.jobs);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [search, page]);

  const handleDelete = async (id) => {
    if (window.confirm("Hapus lowongan ini?")) {
      try {
        await axios.delete(`/api/jobs/${id}`);
        fetchJobs();
      } catch (err) {
        alert("Gagal menghapus.");
      }
    }
  };

  const getCategoryBadgeColor = (category) => {
    const colors = {
      "Engineering & IT": "bg-blue-500/10 text-blue-600 border-blue-500/20",
      Marketing: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      Design: "bg-purple-500/10 text-purple-600 border-purple-500/20",
      "Business Dev": "bg-amber-500/10 text-amber-600 border-amber-500/20",
      Product: "bg-rose-500/10 text-rose-600 border-rose-500/20",
    };
    return colors[category] || "bg-slate-500/10 text-slate-600 border-slate-500/20";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200/60">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Manajemen Lowongan</h2>
          <p className="text-slate-500 text-sm font-medium">Total {jobs.length} lowongan ditemukan di database.</p>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Cari judul, perusahaan..." 
            className="pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all w-full md:w-80"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="py-5 px-8 font-black text-slate-400 text-[10px] uppercase tracking-widest">No</th>
                <th className="py-5 px-4 font-black text-slate-400 text-[10px] uppercase tracking-widest">Lowongan</th>
                <th className="py-5 px-4 font-black text-slate-400 text-[10px] uppercase tracking-widest">Kategori</th>
                <th className="py-5 px-4 font-black text-slate-400 text-[10px] uppercase tracking-widest">Lokasi</th>
                <th className="py-5 px-4 font-black text-slate-400 text-[10px] uppercase tracking-widest">Sumber</th>
                <th className="py-5 px-8 font-black text-slate-400 text-[10px] uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}><td colSpan="6" className="p-8"><div className="h-4 bg-slate-100 rounded-full animate-pulse"></div></td></tr>
                ))
              ) : jobs.length > 0 ? (
                jobs.map((job, idx) => (
                  <tr key={job._id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-5 px-8 text-slate-400 font-bold text-sm">
                      {((page - 1) * 10 + idx + 1).toString().padStart(2, "0")}
                    </td>
                    <td className="py-5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{job.title}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{job.company}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${getCategoryBadgeColor(job.category)}`}>
                        {job.category}
                      </span>
                    </td>
                    <td className="py-5 px-4">
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                        <MapPin className="w-3 h-3" />
                        {job.location}
                      </div>
                    </td>
                    <td className="py-5 px-4">
                      <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded font-bold uppercase">{job.source || "Glints"}</span>
                    </td>
                    <td className="py-5 px-8 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-blue-50 rounded-xl text-blue-600 transition-all border border-transparent hover:border-blue-100">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(job._id)}
                          className="p-2 hover:bg-rose-50 rounded-xl text-rose-600 transition-all border border-transparent hover:border-rose-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-20 text-center text-slate-400">
                    Tidak ada lowongan ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-8 bg-slate-50/50 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                page === p 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                  : "bg-white text-slate-500 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
