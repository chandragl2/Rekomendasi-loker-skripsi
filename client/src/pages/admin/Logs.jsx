import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  AlertCircle,
  BriefcaseBusiness,
  ClipboardCheck,
  Clock,
  Loader2,
  TimerOff,
} from "lucide-react";
import { motion } from "framer-motion";

const activityMeta = {
  job_created: {
    icon: BriefcaseBusiness,
    tone: "bg-violet-50 text-violet-600 border-violet-100",
  },
  scraper_job_synced: {
    icon: BriefcaseBusiness,
    tone: "bg-blue-50 text-blue-600 border-blue-100",
  },
  job_expired: {
    icon: TimerOff,
    tone: "bg-amber-50 text-amber-600 border-amber-100",
  },
};

const visibleActivityTypes = new Set(["scraper_job_synced", "job_created", "job_expired"]);

const getActivitiesFromResponse = (data) => {
  const activities = Array.isArray(data)
    ? data
    : Array.isArray(data?.activities)
      ? data.activities
      : [];

  return activities.filter((activity) => visibleActivityTypes.has(activity.type));
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

const Logs = ({ onBack }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get("/api/admin/activity");
        setActivities(getActivitiesFromResponse(response.data));
      } catch (err) {
        setError(err.response?.data?.message || "Gagal memuat activity log.");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
      >
        &larr; Back to Dashboard
      </button>

      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200/60 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-xl">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-black text-blue-600 uppercase tracking-widest">System Activity</p>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Activity Log</h2>
            <p className="text-slate-500 font-medium">Aktivitas sistem dari sinkronisasi scraper dan status lowongan.</p>
          </div>
        </div>

        <div className="px-6 py-3 bg-slate-50 text-slate-600 rounded-xl font-bold border border-slate-100 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Database Activity
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mr-3" />
          Memuat activity log...
        </div>
      )}

      {error && !loading && (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-5 text-sm font-semibold text-rose-700">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && activities.length === 0 && (
        <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm p-12 text-center">
          <ClipboardCheck className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-black text-slate-900">Belum ada aktivitas</h3>
          <p className="text-sm text-slate-500 mt-2">Aktivitas akan muncul setelah ada perubahan data lowongan.</p>
        </div>
      )}

      {!loading && !error && activities.length > 0 && (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 p-8">
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-slate-200"></div>

            <div className="space-y-6">
              {activities.map((activity, index) => {
                const meta = activityMeta[activity.type] || activityMeta.job_created;
                const Icon = meta.icon;
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    key={activity.id || `${activity.type}-${activity.occurredAt}-${index}`}
                    className="relative flex gap-5"
                  >
                    <div className={`relative z-10 w-10 h-10 rounded-2xl border flex items-center justify-center ${meta.tone}`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 bg-slate-50 border border-slate-100 rounded-3xl p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                        <h3 className="text-base font-black text-slate-900">{activity.title}</h3>
                        <span className="text-xs font-black text-slate-400">{formatDateTime(activity.occurredAt)}</span>
                      </div>
                      <p className="text-sm font-medium text-slate-500 leading-6">{activity.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logs;
