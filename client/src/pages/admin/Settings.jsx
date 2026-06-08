import React from "react";
import {
  Boxes,
  BrainCircuit,
  CheckCircle2,
  Database,
  MonitorSmartphone,
  Server,
  Settings as SettingsIcon,
  TimerReset,
} from "lucide-react";

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
