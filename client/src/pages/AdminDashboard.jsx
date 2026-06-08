import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion"; // eslint-disable-line no-unused-vars
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useLocation } from "react-router-dom";

// Import modular components
import AdminLayout from "./admin/Layout";
import Dashboard from "./admin/Dashboard";
import Jobs from "./admin/Jobs";
import Categories from "./admin/Categories";
import Scraper from "./admin/Scraper";
import Logs from "./admin/Logs";
import Settings from "./admin/Settings";

const AdminDashboard = () => {
  const location = useLocation();
  const getInitialTab = () => {
    const segment = location.pathname.split("/")[2];
    return ["jobs", "categories", "scraper", "logs", "settings"].includes(segment)
      ? segment
      : "dashboard";
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [notification, setNotification] = useState(null);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalActive: 0,
    totalExpired: 0,
    totalScraperJobs: 0,
    totalCompanyJobs: 0,
    totalCompanies: 0,
    totalApplications: 0,
    categoryData: [],
    recentJobs: [],
    lastScrape: null,
    totalCategories: 0,
  });

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/jobs/admin/stats");
      setStats(response.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
      showNotification("error", "Gagal mengambil data statistik.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    setActiveTab(getInitialTab());
  }, [location.pathname]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleSyncData = async () => {
    try {
      setSyncing(true);
      showNotification("info", "Mensinkronkan data dengan database MongoDB Atlas...");
      
      // Instead of triggering backend scraping, we simply refresh the data
      await fetchStats();
      
      showNotification("success", "Sinkronisasi berhasil! Data terbaru telah dimuat.");
    } catch (err) {
      console.error("Sync failed:", err);
      showNotification("error", "Proses sinkronisasi gagal dijalankan.");
    } finally {
      setSyncing(false);
    }
  };

  // Render sub-pages based on activeTab
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard 
            stats={stats} 
            loading={loading} 
            syncing={syncing} 
            onSyncData={handleSyncData} 
          />
        );
      case "jobs":
        return <Jobs onBack={() => setActiveTab("dashboard")} />;
      case "categories":
        return <Categories onBack={() => setActiveTab("dashboard")} />;
      case "scraper":
        return <Scraper />;
      case "logs":
        return <Logs onBack={() => setActiveTab("dashboard")} />;
      case "settings":
        return <Settings onBack={() => setActiveTab("dashboard")} />;
      default:
        return <Dashboard stats={stats} loading={loading} syncing={syncing} onSyncData={handleSyncData} />;
    }
  };

  return (
    <AdminLayout
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onRefresh={fetchStats}
      loading={loading}
    >
      {/* NOTIFICATION TOAST */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-0 left-1/2 z-[100] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border ${
              notification.type === "success" 
                ? "bg-white border-emerald-100 text-emerald-800" 
                : notification.type === "error"
                ? "bg-white border-rose-100 text-rose-800"
                : "bg-white border-blue-100 text-blue-800"
            }`}
          >
            {notification.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
            {notification.type === "error" && <AlertCircle className="w-5 h-5 text-rose-500" />}
            {notification.type === "info" && <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />}
            <span className="font-medium">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Render sub-page content */}
      <div className="animate-in fade-in duration-500">
        {renderContent()}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
