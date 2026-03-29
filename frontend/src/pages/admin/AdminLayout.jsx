import { useContext } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { GraduationCap, Building, Building2, MapPin, BookOpen, Layers, LogOut } from "lucide-react";

export default function AdminLayout() {
  const { user, logoutUser } = useContext(AuthContext);
  const location = useLocation();

  const navItems = [
    { label: "Institutes", path: "/admin/institutes", icon: Building },
    { label: "Campuses", path: "/admin/campuses", icon: MapPin },
    { label: "Departments", path: "/admin/departments", icon: Layers },
    { label: "Programs", path: "/admin/programs", icon: BookOpen },
  ];

  return (
    <div className="min-h-screen flex bg-surface-50 font-sans text-slate-800">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f172a] text-white flex flex-col shrink-0 fixed inset-y-0 z-10 transition-transform">
        <Link to="/" className="p-6 flex items-center space-x-3 mb-6 border-b border-white/10 hover:bg-white/5 transition-colors block">
          <div className="p-2 bg-[#1e3a8a] rounded-lg shadow-inner">
             <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-lg tracking-tight text-white">CSVTU</h1>
            <p className="text-[9px] uppercase font-semibold text-slate-400 tracking-widest">Admin Control</p>
          </div>
        </Link>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Management</p>
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link 
                key={item.label}
                to={item.path} 
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive ? "bg-[#1e3a8a] text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-[#eab308]" : ""}`} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 mt-auto">
          <button 
             onClick={logoutUser}
             className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 hover:text-red-300 transition-colors font-medium"
          >
             <LogOut className="w-4 h-4" />
             <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10 px-8 flex flex-row items-center justify-between shadow-sm">
           <div className="text-sm font-medium text-slate-500">
             Admin Control / <span className="text-[#1e3a8a]">{location.pathname.split('/').pop().charAt(0).toUpperCase() + location.pathname.split('/').pop().slice(1)}</span>
           </div>
           
           <div className="flex items-center space-x-4">
              <div className="flex flex-col items-end">
                <span className="text-sm font-semibold text-slate-800">{user?.name || "Administrator"}</span>
                <span className="text-[10px] uppercase tracking-wider text-[#1e3a8a] font-bold">Admin Role</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#1e3a8a]/10 border border-[#1e3a8a]/20 flex items-center justify-center text-[#1e3a8a] font-bold">
                 {user?.name?.charAt(0) || "A"}
              </div>
           </div>
        </header>

        {/* Dynamic Nested Routes */}
        <div className="p-8 flex-1 overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
