import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AlertCircle, BriefcaseBusiness, CalendarClock, CheckCircle2, Loader2, PlusCircle, TimerOff } from "lucide-react";
import CompanyLayout from "../../components/company/CompanyLayout";
import { companyAuthHeaders } from "../../utils/companyAuth";
import API_URL from "../../utils/api";

const getCompanyName = (company) =>
  company?.companyName || company?.name || company?.email || "Perusahaan";

const getJobsFromResponse = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.jobs)) return data.jobs;
  if (Array.isArray(data?.data?.jobs)) return data.data.jobs;
  return [];
};

const Dashboard = () => {
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [meRes, jobsRes] = await Promise.all([
        axios.get(`${API_URL}/api/companies/me`, { headers: companyAuthHeaders() }),
        axios.get(`${API_URL}/api/companies/jobs`, { headers: companyAuthHeaders() }),
      ]);

      const data = meRes?.data || {};
      const profile = data?.company || data?.data?.company || data;
      setCompany(profile);
      setJobs(getJobsFromResponse(jobsRes?.data));
      localStorage.setItem("companyProfile", JSON.stringify(profile));
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat dashboard perusahaan.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const totalJobs = jobs.length;
  const activeJobs = jobs.filter((job) => job.status === "active").length;
  const expiredJobs = jobs.filter((job) => job.status === "expired").length;

  return (
    <CompanyLayout>
      <div className="space-y-8 text-left">
        <section className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-500 rounded-[2rem] p-6 md:p-10 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -mr-32 -mt-32" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-indigo-100 text-sm font-bold mb-3">Dashboard Perusahaan</p>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3">
                Halo, {getCompanyName(company)}
              </h1>
              <p className="text-indigo-100 max-w-2xl leading-relaxed">
                Pantau lowongan perusahaan dan tambahkan posisi baru untuk menjangkau kandidat yang lebih sesuai.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/company/jobs/create"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-indigo-700 shadow-xl hover:bg-indigo-50 transition-all"
              >
                <PlusCircle className="h-5 w-5" />
                Tambah Lowongan
              </Link>
              <Link
                to="/company/jobs"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-900/25 px-5 py-3 text-sm font-black text-white ring-1 ring-white/20 hover:bg-indigo-900/40 transition-all"
              >
                <BriefcaseBusiness className="h-5 w-5" />
                Lihat Lowongan Saya
              </Link>
            </div>
          </div>
        </section>

        {loading && (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mr-3" />
            Memuat data perusahaan...
          </div>
        )}

        {error && !loading && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-5 text-sm text-red-700">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <div className="bg-indigo-50 text-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-5">
                <BriefcaseBusiness className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold text-gray-400 mb-1">Total Lowongan Saya</p>
              <p className="text-4xl font-black text-gray-900">{totalJobs}</p>
            </div>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <div className="bg-green-50 text-green-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-5">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold text-gray-400 mb-1">Lowongan Active</p>
              <p className="text-4xl font-black text-gray-900">{activeJobs}</p>
            </div>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <div className="bg-orange-50 text-orange-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-5">
                <TimerOff className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold text-gray-400 mb-1">Lowongan Expired</p>
              <p className="text-4xl font-black text-gray-900">{expiredJobs}</p>
            </div>
          </section>
        )}

        {!loading && !error && (
          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-50 text-blue-600 w-10 h-10 rounded-2xl flex items-center justify-center">
                <CalendarClock className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900">Ringkasan cepat</h2>
                <p className="text-sm text-gray-500">Lowongan terbaru akan muncul di halaman Lowongan Saya.</p>
              </div>
            </div>
            <Link
              to="/company/jobs"
              className="inline-flex items-center justify-center rounded-xl bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-600 hover:bg-indigo-100 transition-all"
            >
              Buka daftar lowongan
            </Link>
          </section>
        )}
      </div>
    </CompanyLayout>
  );
};

export default Dashboard;
