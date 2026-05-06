import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Tag, 
  RefreshCcw, 
  Edit2, 
  Check, 
  X,
  TrendingUp,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [runningCategorization, setRunningCategorization] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

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

  const handleRunCategorization = async () => {
    setRunningCategorization(true);
    // Simulation
    setTimeout(() => {
      setRunningCategorization(false);
      alert("Re-categorization complete! Data has been updated.");
      fetchCategories();
    }, 2000);
  };

  const handleEdit = (cat) => {
    setEditingId(cat.name);
    setEditValue(cat.name);
  };

  const saveEdit = () => {
    // In real app, call API
    setEditingId(null);
    alert("Category name updated (locally)");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200/60">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Kategori Pekerjaan</h2>
          <p className="text-slate-500 font-medium mt-1">Kelola kategori dan distribusi pekerjaan di sistem.</p>
        </div>
        
        <button
          onClick={handleRunCategorization}
          disabled={runningCategorization}
          className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-2xl hover:-translate-y-1 transition-all disabled:opacity-50"
        >
          {runningCategorization ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <RefreshCcw className="w-5 h-5" />
          )}
          Re-run Categorization
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 bg-white rounded-3xl animate-pulse border border-slate-100"></div>
          ))
        ) : categories.length > 0 ? (
          categories.map((cat, idx) => (
            <motion.div
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
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleEdit(cat)}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {editingId === cat.name ? (
                <div className="flex items-center gap-2 mt-2">
                  <input 
                    type="text" 
                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm w-full font-bold focus:outline-none focus:border-blue-500"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    autoFocus
                  />
                  <button onClick={saveEdit} className="p-1.5 bg-emerald-500 text-white rounded-lg"><Check className="w-4 h-4" /></button>
                  <button onClick={() => setEditingId(null)} className="p-1.5 bg-slate-200 text-slate-600 rounded-lg"><X className="w-4 h-4" /></button>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">{cat.name}</h3>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Total Lowongan</p>
                      <p className="text-2xl font-black text-slate-900">{cat.value}</p>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold">
                      <TrendingUp className="w-4 h-4" />
                      {((cat.value / categories.reduce((a, b) => a + b.value, 0)) * 100).toFixed(1)}%
                    </div>
                  </div>
                </>
              )}

              <div className="mt-6 w-full bg-slate-50 h-2 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(cat.value / categories.reduce((a, b) => a + (b.value || 0), 0)) * 100}%` }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: cat.color }}
                ></motion.div>
              </div>
            </motion.div>
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
