import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { AlertCircle, ArrowLeft, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import CompanyLayout from "../../components/company/CompanyLayout";
import { saveCompanySession } from "../../utils/companyAuth";
import API_URL from "../../utils/api";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
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
      const res = await axios.post(`${API_URL}/api/companies/login`, form);
      saveCompanySession(res?.data || {});
      navigate(location.state?.from || "/company/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login perusahaan gagal. Periksa email dan password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CompanyLayout requireAuth={false}>
      <div className="max-w-md mx-auto">
        <section className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-indigo-100/30 p-6 md:p-8 text-left">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-indigo-600 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Dashboard
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold mb-6">
            <ShieldCheck className="h-3.5 w-3.5" />
            Company Access
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Login Perusahaan</h1>
          <p className="text-sm text-gray-500 mb-6">
            Belum punya akun?{" "}
            <Link to="/company/register" className="font-bold text-indigo-600 hover:underline">
              Register perusahaan
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
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                placeholder="Masukkan password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-4 text-sm font-black text-white shadow-xl shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all active:scale-[0.99]"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
              Masuk Dashboard
            </button>
          </form>
        </section>
      </div>
    </CompanyLayout>
  );
};

export default Login;
