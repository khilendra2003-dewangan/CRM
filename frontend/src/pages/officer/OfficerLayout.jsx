import { Link, Outlet, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  FileCheck, 
  LogOut, 
  ChevronRight,
  GraduationCap
} from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const SidebarLink = ({ to, icon: Icon, label, active }) => (
  <Link
    to={to}
    className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
      active 
        ? "bg-[#1e3a8a] text-white shadow-lg shadow-blue-900/20" 
        : "text-slate-500 hover:bg-slate-50 hover:text-[#1e3a8a]"
    }`}
  >
    <div className="flex items-center space-x-3">
      <Icon className={`w-5 h-5 ${active ? "text-white" : "group-hover:text-[#1e3a8a]"}`} />
      <span className="font-semibold text-sm tracking-tight">{label}</span>
    </div>
    {active && <ChevronRight className="w-4 h-4 text-white/50" />}
  </Link>
);

export default function OfficerLayout() {
  const location = useLocation();
  const { logoutUser, user } = useContext(AuthContext);

  const menuItems = [
    { to: "/officer/dashboard", icon: LayoutDashboard, label: "Overview" },
    { to: "/officer/applicants", icon: Users, label: "Applicants" },
    { to: "/officer/admissions", icon: FileCheck, label: "Admissions" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 z-50">
        <div className="p-8">
          <Link to="/" className="flex items-center space-x-3">
            <div className="p-2 bg-[#1e3a8a] rounded-lg shadow-sm">
              <GraduationCap className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-xl text-[#0f172a] tracking-tight leading-none">CSVTU</h1>
              <span className="text-[10px] uppercase font-bold text-[#1e3a8a] tracking-widest mt-1 block">Officer Portal</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2 py-4">
          <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Management</p>
          {menuItems.map((item) => (
            <SidebarLink
              key={item.to}
              {...item}
              active={location.pathname === item.to}
            />
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-slate-100">
          <div className="bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#1e3a8a]/10 flex items-center justify-center text-[#1e3a8a] font-bold border border-[#1e3a8a]/20">
                {user?.name?.[0] || 'O'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#0f172a] truncate">{user?.name || 'Officer'}</p>
                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-tight">Active Session</p>
              </div>
            </div>
          </div>
          <button 
            onClick={logoutUser}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-semibold text-sm"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-10">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
