import React, { useState } from "react";
import { 
  Settings as SettingsIcon, 
  Save, 
  Clock, 
  Bell, 
  Shield, 
  ToggleLeft as Toggle,
  Database
} from "lucide-react";
import { motion } from "framer-motion";

const Settings = () => {
  const [interval, setIntervalVal] = useState(10);
  const [isAuto, setIsAuto] = useState(true);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4 mb-2">
        <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-200">
          <SettingsIcon className="w-6 h-6 text-slate-900" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">System Settings</h2>
          <p className="text-slate-500 font-medium">Konfigurasi parameter sistem dan scraper.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Scraper Settings */}
        <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200/60 space-y-8">
          <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
            <Clock className="w-5 h-5 text-blue-500" />
            <h3 className="text-xl font-black text-slate-900">Scraper Configuration</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Scraping Interval (Minutes)</label>
              <div className="flex items-center gap-4">
                <input 
                  type="number" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                  value={interval}
                  onChange={(e) => setIntervalVal(e.target.value)}
                />
                <span className="text-sm font-bold text-slate-400">Min</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Automation Mode</label>
              <button 
                onClick={() => setIsAuto(!isAuto)}
                className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl border transition-all ${
                  isAuto ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200" : "bg-white border-slate-200 text-slate-600"
                }`}
              >
                <span className="font-bold">{isAuto ? "Auto-Scrape Enabled" : "Manual Only"}</span>
                <Toggle className={`w-6 h-6 ${isAuto ? "rotate-180" : ""}`} />
              </button>
            </div>
          </div>
        </section>

        {/* Database & Security */}
        <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200/60 space-y-8">
          <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
            <Shield className="w-5 h-5 text-purple-500" />
            <h3 className="text-xl font-black text-slate-900">Security & Database</h3>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm"><Database className="w-5 h-5 text-slate-400" /></div>
                <div>
                  <p className="text-sm font-black text-slate-900">Database Optimization</p>
                  <p className="text-[10px] text-slate-400 font-medium">Clean up old jobs and unused vectors.</p>
                </div>
              </div>
              <button className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all">Optimize Now</button>
            </div>

            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm"><Bell className="w-5 h-5 text-slate-400" /></div>
                <div>
                  <p className="text-sm font-black text-slate-900">System Notifications</p>
                  <p className="text-[10px] text-slate-400 font-medium">Get alerted when scraper fails or finds 0 jobs.</p>
                </div>
              </div>
              <button className="w-12 h-6 bg-emerald-500 rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></button>
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button className="flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black shadow-2xl hover:-translate-y-1 transition-all active:scale-95">
            <Save className="w-5 h-5" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
