import React from "react";
import { Link, NavLink, Navigate, useLocation, useNavigate } from "react-router-dom";
import { BriefcaseBusiness, LayoutDashboard, LogOut, PlusCircle, ListChecks, UsersRound } from "lucide-react";
import { getCompanyToken, removeCompanySession } from "../../utils/companyAuth";

const companyLinks = [
  { name: "Dashboard", path: "/company/dashboard", icon: LayoutDashboard },
  { name: "Tambah Lowongan", path: "/company/jobs/create", icon: PlusCircle },
  { name: "Lowongan Saya", path: "/company/jobs", icon: ListChecks },
  { name: "Pelamar", path: "/company/applications", icon: UsersRound },
];

const CompanyLayout = ({ children, requireAuth = true }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = getCompanyToken();

  if (requireAuth && !token) {
    return <Navigate to="/company/login" replace state={{ from: location.pathname }} />;
  }

  const handleLogout = () => {
    removeCompanySession();
    navigate("/company/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 md:h-20 flex items-center justify-between gap-4">
            <Link to="/company/dashboard" className="flex items-center gap-2 group">
              <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:rotate-6 transition-transform duration-300">
                <BriefcaseBusiness className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <span className="block text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent tracking-tight">
                  JobMatch
                </span>
                <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                  Company
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {companyLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                        isActive
                          ? "text-indigo-600 bg-indigo-50"
                          : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                      }`
                    }
                  >
                    <Icon className="h-4 w-4" />
                    {link.name}
                  </NavLink>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              {!requireAuth && (
                <>
                  <Link
                    to="/company/login"
                    className="hidden sm:inline-flex px-4 py-2 rounded-xl text-sm font-bold text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                  >
                    Login
                  </Link>
                  <Link
                    to="/company/register"
                    className="px-4 py-2 rounded-xl text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all"
                  >
                    Register
                  </Link>
                </>
              )}

              {requireAuth && (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              )}
            </div>
          </div>

          {requireAuth && (
            <div className="md:hidden flex gap-2 overflow-x-auto pb-3">
              {companyLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `inline-flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                        isActive
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-gray-600 border-gray-100"
                      }`
                    }
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {link.name}
                  </NavLink>
                );
              })}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {children}
      </main>
    </div>
  );
};

export default CompanyLayout;
