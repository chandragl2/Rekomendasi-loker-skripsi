import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  Briefcase,
  Trash2,
  Search,
  MapPin,
  Building2,
  Eye,
  Loader2,
  Power,
  RotateCcw,
  X,
  Database,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_FILTERS = [
  { label: "Semua", value: "" },
  { label: "Active", value: "active" },
  { label: "Expired", value: "expired" },
  { label: "Inactive", value: "inactive" },
];

const SOURCE_FILTERS = [
  { label: "Semua", value: "" },
  { label: "Scraper", value: "scraper" },
];

const emptyStats = {
  totalJobs: 0,
  totalActive: 0,
  totalExpired: 0,
  totalDisplayedJobs: 0,
  totalScraperJobs: 0,
};

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

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

const labelize = (value) => {
  if (!value) return "-";
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const getStatusBadgeColor = (status) => {
  if (status === "active") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (status === "expired") return "bg-rose-50 text-rose-700 border-rose-200";
  return "bg-slate-100 text-slate-600 border-slate-200";
};

const getSourceBadgeColor = (source) => {
  if (source === "scraper") return "bg-blue-50 text-blue-700 border-blue-200";
  return "bg-slate-100 text-slate-600 border-slate-200";
};

const getSourceLabel = (source) => {
  if (source === "scraper") return "Scraper";
  return "Internal";
};

const StatsCard = ({ label, value, icon: Icon, tone }) => (
  <div className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-sm">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
        <p className="text-3xl font-black text-slate-900 mt-2">{value.toLocaleString()}</p>
      </div>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${tone}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  </div>
);

const DetailRow = ({ label, value }) => (
  <div className="border-b border-slate-100 pb-3">
    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
    <p className="text-sm font-semibold text-slate-800">{value || "-"}</p>
  </div>
);

const Jobs = ({ onBack }) => {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState(emptyStats);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [createdByType, setCreatedByType] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedJob, setSelectedJob] = useState(null);

  const fetchStats = useCallback(async () => {
    const response = await axios.get("/api/jobs/admin/jobs/stats");
    setStats(response.data);
  }, []);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (status) params.status = status;
      if (createdByType) params.createdByType = createdByType;

      const response = await axios.get("/api/jobs/admin/jobs", { params });
      setJobs(response.data.jobs);
      setTotal(response.data.total);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error("Error fetching admin jobs:", err);
    } finally {
      setLoading(false);
    }
  }, [createdByType, page, search, status]);

  const refreshData = useCallback(async () => {
    await Promise.all([fetchJobs(), fetchStats()]);
  }, [fetchJobs, fetchStats]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleStatusFilter = (nextStatus) => {
    setStatus(nextStatus);
    setPage(1);
  };

  const handleSourceFilter = (nextSource) => {
    setCreatedByType(nextSource);
    setPage(1);
  };

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus lowongan ini? Data akan dihapus permanen.")) return;

    try {
      setActionLoading(id);
      await axios.delete(`/api/jobs/${id}`);
      if (selectedJob?._id === id) setSelectedJob(null);
      await refreshData();
    } catch (err) {
      alert("Gagal menghapus lowongan.");
    } finally {
      setActionLoading("");
    }
  };

  const handleStatusChange = async (job, nextStatus) => {
    try {
      setActionLoading(job._id);
      const response = await axios.patch(`/api/jobs/admin/jobs/${job._id}/status`, {
        status: nextStatus,
      });
      if (selectedJob?._id === job._id) setSelectedJob(response.data);
      await refreshData();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal mengubah status lowongan.");
    } finally {
      setActionLoading("");
    }
  };

  const summaryCards = [
    {
      label: "Total Data Lowongan",
      value: stats.totalJobs,
      icon: Database,
      tone: "bg-slate-100 text-slate-700",
    },
    {
      label: "Active Jobs",
      value: stats.totalActive,
      icon: CheckCircle2,
      tone: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Lowongan Ditampilkan",
      value: stats.totalDisplayedJobs,
      icon: Briefcase,
      tone: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "Expired Jobs",
      value: stats.totalExpired,
      icon: AlertTriangle,
      tone: "bg-rose-50 text-rose-600",
    },
    {
      label: "Scraper Jobs",
      value: stats.totalScraperJobs,
      icon: Database,
      tone: "bg-blue-50 text-blue-600",
    },
  ];

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
      >
        &larr; Back to Dashboard
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {summaryCards.map((card) => (
          <StatsCard key={card.label} {...card} />
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/70 space-y-5">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-black text-blue-600 uppercase tracking-widest mb-1">Dashboard &gt; Jobs</p>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Manajemen Lowongan</h2>
            <p className="text-slate-500 text-sm font-medium">
              Menampilkan {jobs.length} dari {total.toLocaleString()} lowongan.
            </p>
          </div>

          <div className="relative group w-full xl:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Cari judul atau perusahaan..."
              className="pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all w-full"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</p>
            <div className="flex flex-wrap gap-2">
              {STATUS_FILTERS.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleStatusFilter(item.value)}
                  className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${
                    status === item.value
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sumber Data</p>
            <div className="flex flex-wrap gap-2">
              {SOURCE_FILTERS.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleSourceFilter(item.value)}
                  className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${
                    createdByType === item.value
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/70 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1180px] text-left">
            <thead>
              <tr className="bg-slate-50/80">
                <th className="py-4 px-6 font-black text-slate-400 text-[10px] uppercase tracking-widest">Judul</th>
                <th className="py-4 px-4 font-black text-slate-400 text-[10px] uppercase tracking-widest">Perusahaan</th>
                <th className="py-4 px-4 font-black text-slate-400 text-[10px] uppercase tracking-widest">Kategori</th>
                <th className="py-4 px-4 font-black text-slate-400 text-[10px] uppercase tracking-widest">Sumber</th>
                <th className="py-4 px-4 font-black text-slate-400 text-[10px] uppercase tracking-widest">Status</th>
                <th className="py-4 px-4 font-black text-slate-400 text-[10px] uppercase tracking-widest">Posted At</th>
                <th className="py-4 px-4 font-black text-slate-400 text-[10px] uppercase tracking-widest">Expired At</th>
                <th className="py-4 px-4 font-black text-slate-400 text-[10px] uppercase tracking-widest">Duration</th>
                <th className="py-4 px-6 font-black text-slate-400 text-[10px] uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="9" className="py-16 text-center text-slate-400">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-blue-500" />
                    Memuat data lowongan...
                  </td>
                </tr>
              ) : jobs.length > 0 ? (
                jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                          <Briefcase className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 text-sm truncate max-w-[260px]">{job.title}</p>
                          <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-1">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate max-w-[220px]">{job.location || "-"}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-4 text-sm font-semibold text-slate-700">{job.company}</td>
                    <td className="py-5 px-4">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border bg-slate-100 text-slate-600 border-slate-200">
                        {job.category || "-"}
                      </span>
                    </td>
                    <td className="py-5 px-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getSourceBadgeColor(job.createdByType)}`}>
                        {getSourceLabel(job.createdByType)}
                      </span>
                    </td>
                    <td className="py-5 px-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusBadgeColor(job.status)}`}>
                        {labelize(job.status)}
                      </span>
                    </td>
                    <td className="py-5 px-4 text-xs font-semibold text-slate-500">{formatDate(job.postedAt)}</td>
                    <td className="py-5 px-4 text-xs font-semibold text-slate-500">{formatDate(job.expiredAt)}</td>
                    <td className="py-5 px-4 text-xs font-bold text-slate-600">{job.durationDays || 30} hari</td>
                    <td className="py-5 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedJob(job)}
                          className="p-2 hover:bg-blue-50 rounded-xl text-blue-600 transition-all border border-transparent hover:border-blue-100"
                          title="Lihat detail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {job.status === "active" && (
                          <button
                            onClick={() => handleStatusChange(job, "inactive")}
                            disabled={actionLoading === job._id}
                            className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition-all border border-transparent hover:border-slate-200 disabled:opacity-50"
                            title="Nonaktifkan lowongan"
                          >
                            <Power className="w-4 h-4" />
                          </button>
                        )}
                        {job.status === "inactive" && (
                          <button
                            onClick={() => handleStatusChange(job, "active")}
                            disabled={actionLoading === job._id}
                            className="p-2 hover:bg-emerald-50 rounded-xl text-emerald-600 transition-all border border-transparent hover:border-emerald-100 disabled:opacity-50"
                            title="Aktifkan kembali"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(job._id)}
                          disabled={actionLoading === job._id}
                          className="p-2 hover:bg-rose-50 rounded-xl text-rose-600 transition-all border border-transparent hover:border-rose-100 disabled:opacity-50"
                          title="Hapus lowongan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="py-20 text-center text-slate-400">
                    Tidak ada lowongan ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-6 bg-slate-50/70 flex items-center justify-center gap-2">
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

      <AnimatePresence>
        {selectedJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-white"
            >
              <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-slate-100 p-6 flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusBadgeColor(selectedJob.status)}`}>
                      {labelize(selectedJob.status)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getSourceBadgeColor(selectedJob.createdByType)}`}>
                      {getSourceLabel(selectedJob.createdByType)}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">{selectedJob.title}</h3>
                  <p className="text-sm font-semibold text-slate-500 flex items-center gap-2 mt-1">
                    <Building2 className="w-4 h-4" />
                    {selectedJob.company}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200"
                  title="Tutup"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-5">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm font-semibold text-slate-700">
                    {selectedJob.createdByType === "scraper"
                      ? "Data berasal dari scraper"
                      : "Data internal"}
                  </div>

                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-3">Deskripsi</h4>
                    <p className="text-sm leading-7 text-slate-600 whitespace-pre-line">
                      {selectedJob.description || "Deskripsi tidak tersedia."}
                    </p>
                  </div>

                  {(selectedJob.qualifications || []).length > 0 && (
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-3">Kualifikasi</h4>
                      <ul className="space-y-2">
                        {selectedJob.qualifications.map((item, index) => (
                          <li key={index} className="text-sm text-slate-600 flex gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(selectedJob.skills || []).length > 0 && (
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-3">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedJob.skills.map((skill, index) => (
                          <span key={index} className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-xs font-bold">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4 h-fit">
                  <DetailRow label="createdByType" value={selectedJob.createdByType} />
                  <DetailRow label="status" value={selectedJob.status} />
                  <DetailRow label="durationDays" value={`${selectedJob.durationDays || 30} hari`} />
                  <DetailRow label="postedAt" value={formatDateTime(selectedJob.postedAt)} />
                  <DetailRow label="expiredAt" value={formatDateTime(selectedJob.expiredAt)} />
                  <DetailRow label="updatedAt" value={formatDateTime(selectedJob.updatedAt)} />
                  <DetailRow label="source" value={selectedJob.source || "-"} />
                  <DetailRow label="location" value={selectedJob.location || "-"} />
                  <DetailRow label="type" value={selectedJob.type || "-"} />

                  <div className="pt-2 flex gap-2">
                    {selectedJob.status === "active" && (
                      <button
                        onClick={() => handleStatusChange(selectedJob, "inactive")}
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-black hover:bg-slate-700"
                      >
                        Nonaktifkan
                      </button>
                    )}
                    {selectedJob.status === "inactive" && (
                      <button
                        onClick={() => handleStatusChange(selectedJob, "active")}
                        className="flex-1 px-3 py-2 rounded-xl bg-emerald-600 text-white text-xs font-black hover:bg-emerald-700"
                      >
                        Aktifkan
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(selectedJob._id)}
                      className="px-3 py-2 rounded-xl bg-rose-50 text-rose-600 text-xs font-black hover:bg-rose-100"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Jobs;
