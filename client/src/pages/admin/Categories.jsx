import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Tag, 
  TrendingUp,
  Loader2
} from "lucide-react";
import { motion as Motion } from "framer-motion";

const Categories = ({ onBack }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/jobs/admin/stats");
      // Mapping from the chart data structure
      setCategories(response.data.categoryData || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
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

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200/60">
        <div>
          <p className="text-sm font-black text-blue-600 uppercase tracking-widest">Dashboard &gt; Categories</p>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Kategori Pekerjaan</h2>
          <p className="text-slate-500 font-medium mt-1">Distribusi kategori berdasarkan lowongan aktif unik yang ditampilkan ke user.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 bg-white rounded-3xl animate-pulse border border-slate-100"></div>
          ))
        ) : categories.length > 0 ? (
          categories.map((cat, idx) => (
            <Motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              key={idx}
              className="bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-2xl" style={{ backgroundColor: `${cat.color}15` }}>
                  <Tag className="w-6 h-6" style={{ color: cat.color }} />
                </div>
              </div>

              <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">{cat.name}</h3>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Lowongan Ditampilkan</p>
                  <p className="text-2xl font-black text-slate-900">{cat.value}</p>
                </div>
                <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold">
                  <TrendingUp className="w-4 h-4" />
                  {((cat.value / categories.reduce((a, b) => a + b.value, 0)) * 100).toFixed(1)}%
                </div>
              </div>

              <div className="mt-6 w-full bg-slate-50 h-2 rounded-full overflow-hidden">
                <Motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(cat.value / categories.reduce((a, b) => a + (b.value || 0), 0)) * 100}%` }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: cat.color }}
                ></Motion.div>
              </div>
            </Motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-slate-400 font-medium">
            Belum ada kategori terdeteksi.
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
