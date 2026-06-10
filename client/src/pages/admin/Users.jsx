import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  AlertCircle,
  BriefcaseBusiness,
  Building2,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Search,
  UsersRound,
} from "lucide-react";
import API_URL from "../../utils/api";

const getCompaniesFromResponse = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.companies)) return data.companies;
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

const SummaryCard = ({ label, value, icon: Icon, tone }) => (
  <div className="bg-white rounded-2xl border border-slate-200/70 p-5 shadow-sm">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          {label}
        </p>
        <p className="text-3xl font-black text-slate-900 mt-2">
          {value.toLocaleString()}
        </p>
      </div>
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center ${tone}`}
      >
        <Icon className="w-5 h-5" />
      </div>
    </div>
  </div>
);

const Companies = ({ onBack }) => {
  const [companies, setCompanies] = useState([]);
  const [summary, setSummary] = useState({
    totalCompanies: 0,
    totalCompanyJobs: 0,
    totalApplications: 0,
  });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(`${API_URL}/api/admin/companies`);
        const data = response?.data || {};
        const companyData = getCompaniesFromResponse(data);
        setCompanies(companyData);
        setSummary(
          data?.summary || {
            totalCompanies: companyData.length,
            totalCompanyJobs: companyData.reduce(
              (total, company) => total + (company.totalJobs || 0),
              0,
            ),
            totalApplications: companyData.reduce(
              (total, company) => total + (company.totalApplications || 0),
              0,
            ),
          },
        );
      } catch (err) {
        setError(err.response?.data?.message || "Gagal memuat daftar company.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const filteredCompanies = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return companies;

    return companies.filter((company) => {
      const name = String(company.companyName || "").toLowerCase();
      const email = String(company.email || "").toLowerCase();
      return name.includes(keyword) || email.includes(keyword);
    });
  }, [companies, search]);

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
      >
        &larr; Back to Dashboard
      </button>

      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200/60 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <p className="text-sm font-black text-blue-600 uppercase tracking-widest">
            Dashboard &gt; Companies
          </p>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Company Management
          </h2>
          <p className="text-slate-500 font-medium">
            Daftar perusahaan, jumlah lowongan, dan jumlah pelamar.
          </p>
        </div>

        <div className="relative w-full xl:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama company atau email..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard
          label="Total Companies"
          value={summary.totalCompanies || 0}
          icon={Building2}
          tone="bg-blue-50 text-blue-600"
        />
        <SummaryCard
          label="Total Company Jobs"
          value={summary.totalCompanyJobs || 0}
          icon={BriefcaseBusiness}
          tone="bg-violet-50 text-violet-600"
        />
        <SummaryCard
          label="Total Applications"
          value={summary.totalApplications || 0}
          icon={FileText}
          tone="bg-emerald-50 text-emerald-600"
        />
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mr-3" />
          Memuat daftar company...
        </div>
      )}

      {error && !loading && (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-5 text-sm font-semibold text-rose-700">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && filteredCompanies.length === 0 && (
        <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm p-12 text-center">
          <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-black text-slate-900">
            Company tidak ditemukan
          </h3>
          <p className="text-sm text-slate-500 mt-2">
            Coba gunakan kata kunci lain.
          </p>
        </div>
      )}

      {!loading && !error && filteredCompanies.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/70 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1080px] text-left">
              <thead className="bg-slate-50/80">
                <tr>
                  <th className="py-4 px-6 font-black text-slate-400 text-[10px] uppercase tracking-widest">
                    Company
                  </th>
                  <th className="py-4 px-4 font-black text-slate-400 text-[10px] uppercase tracking-widest">
                    Telepon
                  </th>
                  <th className="py-4 px-4 font-black text-slate-400 text-[10px] uppercase tracking-widest">
                    Alamat
                  </th>
                  <th className="py-4 px-4 font-black text-slate-400 text-[10px] uppercase tracking-widest">
                    Lowongan
                  </th>
                  <th className="py-4 px-4 font-black text-slate-400 text-[10px] uppercase tracking-widest">
                    Pelamar
                  </th>
                  <th className="py-4 px-6 font-black text-slate-400 text-[10px] uppercase tracking-widest">
                    Tanggal Daftar
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCompanies.map((company) => (
                  <tr
                    key={company.id || company._id || company.email}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-black text-slate-900 text-sm truncate max-w-[260px]">
                            {company.companyName || "Company"}
                          </p>
                          <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-1">
                            <Mail className="w-3 h-3" />
                            <span className="truncate max-w-[240px]">
                              {company.email || "-"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                        <Phone className="w-4 h-4 text-slate-400" />
                        {company.phone || "-"}
                      </div>
                    </td>
                    <td className="py-5 px-4">
                      <div className="flex items-start gap-2 text-sm font-semibold text-slate-600 max-w-[300px]">
                        <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">
                          {company.address || "-"}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-4">
                      <span className="inline-flex items-center gap-2 rounded-xl bg-violet-50 px-3 py-2 text-xs font-black text-violet-700 border border-violet-100">
                        <BriefcaseBusiness className="w-4 h-4" />
                        {company.totalJobs || 0}
                      </span>
                    </td>
                    <td className="py-5 px-4">
                      <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700 border border-emerald-100">
                        <UsersRound className="w-4 h-4" />
                        {company.totalApplications || 0}
                      </span>
                    </td>
                    <td className="py-5 px-6 text-sm font-semibold text-slate-600">
                      {formatDate(company.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Companies;
