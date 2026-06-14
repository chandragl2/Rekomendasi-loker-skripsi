import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AlertCircle, LockKeyhole, LogIn } from "lucide-react";
import axios from "axios";
import API_URL from "../../utils/api";
import { getAdminToken, saveAdminSession } from "../../utils/adminAuth";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (getAdminToken()) {
    return <Navigate to="/admin" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/admin/login`, form);
      const token = saveAdminSession(response.data);

      if (!token) {
        setError("Token admin tidak ditemukan dari server.");
        return;
      }

      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login admin gagal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
        <div className="bg-slate-900 px-8 py-8 text-white">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center mb-5 shadow-lg shadow-blue-900/30">
            <LockKeyhole className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">Admin Login</h1>
          <p className="text-sm text-slate-300 mt-2">Masuk ke dashboard monitoring JobMatch.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              placeholder="admin"
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              placeholder="admin123"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div className="flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-3 rounded-2xl bg-blue-600 px-5 py-4 text-sm font-black text-white shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-[0.98]"
          >
            <LogIn className="w-5 h-5" />
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
