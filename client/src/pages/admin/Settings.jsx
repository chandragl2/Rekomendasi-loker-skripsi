import React, { useState } from "react";
import axios from "axios";
import {
  AlertCircle,
  Boxes,
  BrainCircuit,
  CheckCircle2,
  Database,
  KeyRound,
  MonitorSmartphone,
  Save,
  Server,
  Settings as SettingsIcon,
  TimerReset,
} from "lucide-react";
import API_URL from "../../utils/api";
import { adminAuthHeaders } from "../../utils/adminAuth";

const systemInfo = [
  { label: "Architecture", value: "Decoupled Architecture", icon: Boxes, tone: "bg-blue-50 text-blue-600" },
  { label: "Recommendation", value: "TF-IDF + Cosine Similarity", icon: BrainCircuit, tone: "bg-violet-50 text-violet-600" },
  { label: "Scraper", value: "External Python Service", icon: Server, tone: "bg-slate-100 text-slate-700" },
  { label: "Scraper Interval", value: "15 minutes", icon: TimerReset, tone: "bg-blue-50 text-blue-600" },
  { label: "Database", value: "MongoDB", icon: Database, tone: "bg-emerald-50 text-emerald-600" },
  { label: "Backend", value: "Node.js + Express", icon: Server, tone: "bg-cyan-50 text-cyan-600" },
  { label: "Frontend", value: "React + Vite", icon: MonitorSmartphone, tone: "bg-indigo-50 text-indigo-600" },
  { label: "Expired Jobs", value: "30 days", icon: TimerReset, tone: "bg-amber-50 text-amber-600" },
];

const Settings = ({ onBack }) => {
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((current) => ({ ...current, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await axios.put(
        `${API_URL}/api/admin/change-password`,
        passwordForm,
        { headers: adminAuthHeaders() }
      );

      setMessage(response.data?.message || "Password admin berhasil diperbarui");
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memperbarui password admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
      >
        &larr; Back to Dashboard
      </button>

      <div className="flex items-center gap-4">
        <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-200">
          <SettingsIcon className="w-6 h-6 text-slate-900" />
        </div>
        <div>
          <p className="text-sm font-black text-blue-600 uppercase tracking-widest">System Information</p>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Informasi Sistem</h2>
          <p className="text-slate-500 font-medium mt-1">Ringkasan arsitektur dan modul aktif untuk kebutuhan demo.</p>
        </div>
      </div>

      <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200/60">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {systemInfo.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${item.tone}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{item.label}</p>
                <p className="text-lg font-black text-slate-900">{item.value}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200/60">
        <div className="flex items-start gap-4 mb-7">
          <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-black text-blue-600 uppercase tracking-widest">Admin Security</p>
            <h3 className="text-2xl font-black text-slate-900">Ubah Password Admin</h3>
          </div>
        </div>

        <form onSubmit={handlePasswordSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
              Password Lama
            </label>
            <input
              type="password"
              name="oldPassword"
              value={passwordForm.oldPassword}
              onChange={handlePasswordChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              autoComplete="current-password"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
              Password Baru
            </label>
            <input
              type="password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              autoComplete="new-password"
              minLength={6}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
              Konfirmasi Password Baru
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              autoComplete="new-password"
              minLength={6}
              required
            />
          </div>

          <div className="md:col-span-3 space-y-4">
            {error && (
              <div className="flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {message && (
              <div className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>{message}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-3 rounded-2xl bg-blue-600 px-6 py-4 text-sm font-black text-white shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Save className="w-5 h-5" />
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </section>

      <section className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-emerald-500/15 rounded-2xl text-emerald-300">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black">Demo Ready</h3>
            <p className="text-sm text-slate-300 leading-6 mt-2 max-w-3xl">
              Dashboard ini menampilkan kondisi sistem saat ini: scraper berjalan sebagai service Python eksternal,
              backend website fokus pada API lowongan, rekomendasi, dan expired job system.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Settings;
