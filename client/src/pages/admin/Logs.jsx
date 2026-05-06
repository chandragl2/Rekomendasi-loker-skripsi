import React from "react";
import { 
  FileText, 
  Terminal, 
  Info, 
  AlertCircle, 
  CheckCircle2,
  Clock,
  Download
} from "lucide-react";
import { motion } from "framer-motion";

const Logs = () => {
  const logs = [
    { time: "10:05", type: "success", msg: "Finished: Total 35 jobs saved to DB." },
    { time: "10:03", type: "info", msg: "Filtering duplicates and cleaning text data..." },
    { time: "10:01", type: "info", msg: "Scraper found 40 relevant jobs on Glints.com." },
    { time: "10:00", type: "info", msg: "Scraping process started automatically (Interval)." },
    { time: "09:50", type: "success", msg: "System health check: All services online." },
    { time: "09:40", type: "error", msg: "Failed to connect to Glints API (Retry 1/3)..." },
    { time: "09:30", type: "info", msg: "TF-IDF Vocabulary rebuilt successfully." },
    { time: "09:20", type: "info", msg: "Database connection established." },
  ];

  const getLogIcon = (type) => {
    switch (type) {
      case "success": return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case "error": return <AlertCircle className="w-4 h-4 text-rose-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200/60 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-xl">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">System Logs</h2>
            <p className="text-slate-500 font-medium">Monitoring semua aktivitas sistem secara mendalam.</p>
          </div>
        </div>

        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-all">
          <Download className="w-4 h-4" />
          Export Logs (.txt)
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 overflow-hidden">
        <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
          <div className="divide-y divide-slate-50">
            {logs.map((log, idx) => (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={idx}
                className="flex items-start gap-6 p-6 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2 w-24 flex-shrink-0">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-black text-slate-400 font-mono">{log.time}</span>
                </div>
                
                <div className="flex items-center gap-3 flex-1">
                  <div className="mt-0.5">{getLogIcon(log.type)}</div>
                  <p className={`text-sm font-semibold tracking-wide ${
                    log.type === "error" ? "text-rose-600" : 
                    log.type === "success" ? "text-emerald-700" : 
                    "text-slate-700"
                  }`}>
                    {log.msg}
                  </p>
                </div>

                <div className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                  {log.type}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="p-6 bg-slate-50/50 border-t border-slate-50 text-center">
          <button className="text-blue-600 font-black text-xs uppercase tracking-widest hover:underline">
            Load More History
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logs;
