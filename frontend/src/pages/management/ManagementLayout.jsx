import { Link, Outlet, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  LogOut, 
  ChevronRight,
  GraduationCap,
  ShieldCheck
} from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const SidebarLink = ({ to, icon: Icon, label, active }) => (
  <Link
    to={to}
    className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
      active 
        ? "bg-slate-900 text-white shadow-lg" 
        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
    }`}
  >
    <div className="flex items-center space-x-3">
      <Icon className={`w-5 h-5 ${active ? "text-white" : "group-hover:text-slate-900"}`} />
      <span className="font-semibold text-sm tracking-tight">{label}</span>
    </div>
    {active && <ChevronRight className="w-4 h-4 text-white/50" />}
  </Link>
);

export default function ManagementLayout() {
  const location = useLocation();
  const { logoutUser, user } = useContext(AuthContext);

  const menuItems = [
    { to: "/management/dashboard", icon: BarChart3, label: "Exective Board" },
  ];

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 z-50">
        <div className="p-8">
          <Link to="/" className="flex items-center space-x-3">
            <div className="p-2 bg-slate-900 rounded-lg shadow-sm">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-xl text-[#0f172a] tracking-tight leading-none">CSVTU</h1>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mt-1 block tracking-[0.2em]">Management</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2 py-4">
          <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Board Intelligence</p>
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
              <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold">
                {user?.name?.[0] || 'M'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#0f172a] truncate">{user?.name || 'Administrator'}</p>
                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-tight">Management Access</p>
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
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
