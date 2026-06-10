import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { AlertCircle, BriefcaseBusiness, Eye, Loader2, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import CompanyLayout from "../../components/company/CompanyLayout";
import { companyAuthHeaders } from "../../utils/companyAuth";
import API_URL from "../../utils/api";

const getJobsFromResponse = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.jobs)) return data.jobs;
  if (Array.isArray(data?.data?.jobs)) return data.data.jobs;
  return [];
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const statusClass = {
  active: "bg-green-50 text-green-700 border-green-100",
  expired: "bg-orange-50 text-orange-700 border-orange-100",
  inactive: "bg-gray-100 text-gray-600 border-gray-200",
};

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.get(`${API_URL}/api/companies/jobs`, { headers: companyAuthHeaders() });
      setJobs(getJobsFromResponse(res?.data));
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat lowongan perusahaan.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return (
    <CompanyLayout>
      <div className="space-y-6 text-left">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-indigo-600 mb-2">Company Jobs</p>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900">Lowongan Saya</h1>
            <p className="text-sm text-gray-500 mt-2">Kelola daftar lowongan yang dibuat oleh perusahaan Anda.</p>
          </div>
          <Link
            to="/company/jobs/create"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
          >
            <PlusCircle className="h-5 w-5" />
            Tambah Lowongan
          </Link>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mr-3" />
            Memuat lowongan...
          </div>
        )}

        {error && !loading && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-5 text-sm text-red-700">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && jobs.length === 0 && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center">
            <BriefcaseBusiness className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-black text-gray-900 mb-2">Belum ada lowongan</h2>
            <p className="text-sm text-gray-500 mb-5">Tambahkan lowongan pertama untuk perusahaan Anda.</p>
            <Link
              to="/company/jobs/create"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black text-white hover:bg-indigo-700 transition-all"
            >
              <PlusCircle className="h-5 w-5" />
              Tambah Lowongan
            </Link>
          </div>
        )}

        {!loading && !error && jobs.length > 0 && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-400">
                  <tr>
                    <th className="px-5 py-4 font-black">Title</th>
                    <th className="px-5 py-4 font-black">Category</th>
                    <th className="px-5 py-4 font-black">Status</th>
                    <th className="px-5 py-4 font-black">Posted At</th>
                    <th className="px-5 py-4 font-black">Expired At</th>
                    <th className="px-5 py-4 font-black text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {jobs.map((job) => (
                    <tr key={job._id || job.id} className="hover:bg-indigo-50/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-black text-gray-900">{job.title}</div>
                        <div className="text-xs text-gray-400 mt-1">{job.location || "-"}</div>
                      </td>
                      <td className="px-5 py-4 text-gray-600">{job.category || "-"}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-black capitalize ${statusClass[job.status] || statusClass.inactive}`}>
                          {job.status || "inactive"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-600">{formatDate(job.postedAt || job.createdAt)}</td>
                      <td className="px-5 py-4 text-gray-600">{formatDate(job.expiredAt)}</td>
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          disabled
                          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-xs font-bold text-gray-400 cursor-not-allowed"
                        >
                          <Eye className="h-4 w-4" />
                          Detail/Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </CompanyLayout>
  );
};

export default MyJobs;
