import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AlertCircle, ArrowLeft, ArrowRight, Building2, Loader2 } from "lucide-react";
import CompanyLayout from "../../components/company/CompanyLayout";
import { saveCompanySession } from "../../utils/companyAuth";

const initialForm = {
  companyName: "",
  email: "",
  password: "",
  phone: "",
  address: "",
};

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((current) => ({ ...current, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("/api/companies/register", form);
      saveCompanySession(res.data);
      navigate("/company/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Register perusahaan gagal. Cek data lalu coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CompanyLayout requireAuth={false}>
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8 items-start">
        <section className="text-left pt-4 lg:pt-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold mb-6">
            <Building2 className="h-3.5 w-3.5" />
            Employer Module
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 leading-tight mb-4">
            Daftarkan perusahaan di JobMatch.
          </h1>
          <p className="text-gray-500 leading-relaxed max-w-xl">
            Buat akun perusahaan untuk memasang lowongan, memantau status lowongan, dan mengelola kebutuhan rekrutmen dari satu dashboard.
          </p>
        </section>

        <section className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-indigo-100/30 p-6 md:p-8 text-left">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-indigo-600 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Dashboard
          </Link>

          <h2 className="text-2xl font-black text-gray-900 mb-1">Register Perusahaan</h2>
          <p className="text-sm text-gray-500 mb-6">
            Sudah punya akun?{" "}
            <Link to="/company/login" className="font-bold text-indigo-600 hover:underline">
              Login di sini
            </Link>
          </p>

          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nama Perusahaan</label>
              <input
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                placeholder="PT JobMatch Indonesia"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  placeholder="hr@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  placeholder="Minimal 6 karakter"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Telepon</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                placeholder="081234567890"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Alamat</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                rows={3}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                placeholder="Alamat kantor perusahaan"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-4 text-sm font-black text-white shadow-xl shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all active:scale-[0.99]"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
              Daftar Perusahaan
            </button>
          </form>
        </section>
      </div>
    </CompanyLayout>
  );
};

export default Register;
