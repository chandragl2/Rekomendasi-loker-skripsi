import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { AlertCircle, CheckCircle2, Loader2, UserCheck, UserX, UsersRound } from "lucide-react";
import CompanyLayout from "../../components/company/CompanyLayout";
import { companyAuthHeaders } from "../../utils/companyAuth";

const getApplicationsFromResponse = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.applications)) return data.applications;
  if (Array.isArray(data?.data?.applications)) return data.data.applications;
  return [];
};

const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatScore = (score) => {
  if (score === null || score === undefined || score === "") return "-";
  const numericScore = Number(score);
  if (!Number.isFinite(numericScore)) return "-";
  const percentScore = numericScore <= 1 ? numericScore * 100 : numericScore;
  return `${percentScore.toFixed(1)}%`;
};

const statusClass = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-100",
  accepted: "bg-green-50 text-green-700 border-green-100",
  rejected: "bg-red-50 text-red-700 border-red-100",
};

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.get("/api/applications/company", { headers: companyAuthHeaders() });
      setApplications(getApplicationsFromResponse(res.data));
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat daftar pelamar.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleUpdateStatus = async (applicationId, status) => {
    setUpdatingId(applicationId);
    setError("");
    setNotice("");

    try {
      const res = await axios.patch(
        `/api/applications/${applicationId}/status`,
        { status },
        { headers: companyAuthHeaders() }
      );
      const updatedApplication = res.data?.application;

      setApplications((current) =>
        current.map((application) =>
          application._id === applicationId ? { ...application, ...updatedApplication } : application
        )
      );
      setNotice(res.data?.message || "Status lamaran berhasil diperbarui.");
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memperbarui status lamaran.");
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <CompanyLayout>
      <div className="space-y-6 text-left">
        <div>
          <p className="text-sm font-bold text-indigo-600 mb-2">Company Applications</p>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900">Pelamar</h1>
          <p className="text-sm text-gray-500 mt-2">Lihat dan proses lamaran untuk lowongan milik perusahaan Anda.</p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mr-3" />
            Memuat daftar pelamar...
          </div>
        )}

        {notice && !loading && (
          <div className="flex items-start gap-3 rounded-2xl border border-green-100 bg-green-50 p-5 text-sm text-green-700">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
            <span>{notice}</span>
          </div>
        )}

        {error && !loading && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-5 text-sm text-red-700">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && applications.length === 0 && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center">
            <UsersRound className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-black text-gray-900 mb-2">Belum ada pelamar</h2>
            <p className="text-sm text-gray-500">Lamaran kandidat akan muncul di halaman ini.</p>
          </div>
        )}

        {!loading && applications.length > 0 && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-sm">
                <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-400">
                  <tr>
                    <th className="px-5 py-4 font-black">Pelamar</th>
                    <th className="px-5 py-4 font-black">Phone</th>
                    <th className="px-5 py-4 font-black">Job Title</th>
                    <th className="px-5 py-4 font-black">Similarity</th>
                    <th className="px-5 py-4 font-black">Status</th>
                    <th className="px-5 py-4 font-black">Applied At</th>
                    <th className="px-5 py-4 font-black text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {applications.map((application) => {
                    const job = application.jobId || {};
                    const isUpdating = updatingId === application._id;

                    return (
                      <tr key={application._id} className="hover:bg-indigo-50/30 transition-colors">
                        <td className="px-5 py-4">
                          <div className="font-black text-gray-900">{application.candidateName}</div>
                          <div className="text-xs text-gray-400 mt-1">{application.candidateEmail}</div>
                        </td>
                        <td className="px-5 py-4 text-gray-600">{application.candidatePhone || "-"}</td>
                        <td className="px-5 py-4">
                          <div className="font-bold text-gray-800">{job.title || "-"}</div>
                          <div className="text-xs text-gray-400 mt-1">{job.location || "-"} / {job.category || "-"}</div>
                        </td>
                        <td className="px-5 py-4 text-gray-600">{formatScore(application.similarityScore)}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-black capitalize ${statusClass[application.status] || statusClass.pending}`}>
                            {application.status || "pending"}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-gray-600">{formatDateTime(application.appliedAt)}</td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(application._id, "accepted")}
                              disabled={isUpdating || application.status === "accepted"}
                              className="inline-flex items-center gap-2 rounded-xl bg-green-50 px-3 py-2 text-xs font-black text-green-700 hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                            >
                              {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserCheck className="h-4 w-4" />}
                              Accept
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(application._id, "rejected")}
                              disabled={isUpdating || application.status === "rejected"}
                              className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                            >
                              {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserX className="h-4 w-4" />}
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </CompanyLayout>
  );
};

export default Applications;
