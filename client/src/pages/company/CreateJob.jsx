import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2, PlusCircle } from "lucide-react";
import CompanyLayout from "../../components/company/CompanyLayout";
import { companyAuthHeaders } from "../../utils/companyAuth";

const CATEGORIES = [
  "Engineering & IT",
  "Data & AI",
  "Design & Creative",
  "Marketing & Growth",
  "Finance & Accounting",
  "Operations & Supply Chain",
  "Sales & Business Development",
  "Healthcare & Medical",
  "Product & Project",
  "Human Resources",
  "Education",
  "Miscellaneous",
];

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Remote", "Hybrid"];

const initialForm = {
  title: "",
  company: "",
  location: "",
  type: "Full-time",
  category: "Engineering & IT",
  description: "",
  skills: "",
  qualifications: "",
  durationDays: 30,
};

const inputClass =
  "w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

const toList = (value) =>
  value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);

const CreateJob = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    try {
      const cachedProfile = JSON.parse(localStorage.getItem("companyProfile") || "null");
      const companyName = cachedProfile?.companyName || cachedProfile?.name;
      if (companyName) {
        setForm((current) => ({ ...current, company: companyName }));
      }
    } catch {
      localStorage.removeItem("companyProfile");
    }
  }, []);

  const handleChange = (e) => {
    const value = e.target.name === "durationDays" ? Number(e.target.value) : e.target.value;
    setForm((current) => ({ ...current, [e.target.name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotice(null);

    const payload = {
      ...form,
      skills: toList(form.skills),
      qualifications: toList(form.qualifications),
      durationDays: Number(form.durationDays) || 30,
      source: "Company",
      createdByType: "company",
      status: "active",
    };

    try {
      await axios.post("/api/companies/jobs", payload, { headers: companyAuthHeaders() });
      setNotice({ type: "success", message: "Lowongan berhasil dibuat." });
      setTimeout(() => navigate("/company/jobs"), 700);
    } catch (err) {
      setNotice({
        type: "error",
        message:
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Gagal membuat lowongan. Lengkapi data lalu coba lagi.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CompanyLayout>
      <div className="max-w-4xl mx-auto text-left">
        <Link
          to="/company/dashboard"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-indigo-600 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke dashboard
        </Link>

        <section className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-indigo-100/20 p-6 md:p-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <p className="text-sm font-bold text-indigo-600 mb-2">Company Jobs</p>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900">Tambah Lowongan</h1>
              <p className="text-sm text-gray-500 mt-2">
                Lowongan akan dibuat sebagai source Company dengan status active.
              </p>
            </div>
            <div className="hidden sm:flex bg-indigo-50 text-indigo-600 w-12 h-12 rounded-2xl items-center justify-center">
              <PlusCircle className="h-6 w-6" />
            </div>
          </div>

          {notice && (
            <div
              className={`mb-5 flex items-start gap-3 rounded-2xl border p-4 text-sm ${
                notice.type === "success"
                  ? "border-green-100 bg-green-50 text-green-700"
                  : "border-red-100 bg-red-50 text-red-700"
              }`}
            >
              {notice.type === "success" ? (
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
              )}
              <span>{notice.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Judul Lowongan">
                <input name="title" value={form.title} onChange={handleChange} required className={inputClass} placeholder="Frontend Developer" />
              </Field>
              <Field label="Perusahaan">
                <input name="company" value={form.company} onChange={handleChange} required className={inputClass} placeholder="Nama perusahaan" />
              </Field>
              <Field label="Lokasi">
                <input name="location" value={form.location} onChange={handleChange} required className={inputClass} placeholder="Jakarta / Remote" />
              </Field>
              <Field label="Tipe">
                <select name="type" value={form.type} onChange={handleChange} className={inputClass}>
                  {JOB_TYPES.map((type) => <option key={type}>{type}</option>)}
                </select>
              </Field>
              <Field label="Kategori">
                <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
                  {CATEGORIES.map((category) => <option key={category}>{category}</option>)}
                </select>
              </Field>
              <Field label="Durasi Lowongan">
                <select name="durationDays" value={form.durationDays} onChange={handleChange} className={inputClass}>
                  {[7, 14, 30, 60].map((days) => (
                    <option key={days} value={days}>{days} hari</option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Deskripsi">
              <textarea name="description" value={form.description} onChange={handleChange} required rows={5} className={inputClass} placeholder="Ceritakan tanggung jawab utama posisi ini." />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Skills">
                <textarea name="skills" value={form.skills} onChange={handleChange} required rows={4} className={inputClass} placeholder="React, JavaScript, Tailwind CSS" />
              </Field>
              <Field label="Qualifications">
                <textarea name="qualifications" value={form.qualifications} onChange={handleChange} required rows={4} className={inputClass} placeholder="Minimal 1 tahun pengalaman, komunikasi baik" />
              </Field>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full md:w-auto items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-7 py-4 text-sm font-black text-white shadow-xl shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all active:scale-[0.99]"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <PlusCircle className="h-5 w-5" />}
              Simpan Lowongan
            </button>
          </form>
        </section>
      </div>
    </CompanyLayout>
  );
};

const Field = ({ label, children }) => (
  <label className="block">
    <span className="block text-sm font-bold text-gray-700 mb-2">{label}</span>
    {children}
  </label>
);

export default CreateJob;
