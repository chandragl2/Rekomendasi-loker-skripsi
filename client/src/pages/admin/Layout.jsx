import React from "react";
import { 
  LayoutDashboard, 
  Briefcase, 
  Tag, 
  Zap, 
  FileText, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  RefreshCw
} from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { removeAdminSession } from "../../utils/adminAuth";

const AdminLayout = ({ children, sidebarOpen, setSidebarOpen, activeTab, setActiveTab, onRefresh, loading }) => {
  const navigate = useNavigate();
  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "jobs", icon: Briefcase, label: "Jobs" },
    { id: "categories", icon: Tag, label: "Categories" },
    { id: "scraper", icon: Zap, label: "Scraper Monitor" },
    { id: "logs", icon: FileText, label: "Activity Log" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];
  const activeMenu = menuItems.find((item) => item.id === activeTab);

  const handleLogout = () => {
    removeAdminSession();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 font-sans overflow-hidden">
      {/* SIDEBAR */}
      <Motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 88 }}
        className="bg-slate-900 text-white flex flex-col relative z-20 shadow-[4px_0_24px_rgba(0,0,0,0.1)]"
      >
        <div className="p-6 flex items-center gap-4 border-b border-slate-800/50">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && (
            <Motion.span 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400"
            >
              JobMatch
            </Motion.span>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-1 mt-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeTab === item.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${activeTab === item.id ? "text-white" : "group-hover:scale-110 transition-transform"}`} />
              {sidebarOpen && (
                <span className="text-sm font-semibold tracking-wide">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-slate-800/50">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-400 hover:bg-rose-500/10 hover:text-rose-500 transition-all group"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            {sidebarOpen && <span className="text-sm font-semibold">Logout</span>}
          </button>
        </div>
      </Motion.aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* HEADER */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2.5 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="h-6 w-px bg-slate-200"></div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">{activeMenu?.label || "Dashboard"}</h1>
              {activeTab !== "dashboard" && (
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mt-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab("dashboard")}
                    className="hover:text-blue-600 transition-colors"
                  >
                    Dashboard
                  </button>
                  <span>/</span>
                  <span className="text-slate-600">{activeMenu?.label}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {activeTab !== "dashboard" && (
              <button
                type="button"
                onClick={() => setActiveTab("dashboard")}
                className="hidden sm:inline-flex px-4 py-2 rounded-xl text-sm font-bold text-slate-600 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 transition-all"
              >
                Back to Dashboard
              </button>
            )}
            <button 
              onClick={onRefresh}
              className="p-2.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin text-blue-600" : ""}`} />
            </button>
            <div className="w-10 h-10 bg-slate-100 rounded-full border-2 border-white shadow-sm flex items-center justify-center font-bold text-slate-600">
              AD
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
