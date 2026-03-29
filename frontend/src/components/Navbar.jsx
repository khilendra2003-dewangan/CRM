import { motion } from "framer-motion";
import { GraduationCap, LogIn, LogOut } from "lucide-react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto rounded-2xl glass px-6 py-4 flex items-center justify-between shadow-sm">
        <Link to="/" className="flex items-center space-x-3 cursor-pointer">
          <div className="p-2 bg-[#1e3a8a] rounded-lg">
            <GraduationCap className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-xl text-[#0f172a] tracking-tight">CSVTU</h1>
            <p className="text-[10px] uppercase font-semibold text-[#475569] tracking-widest hidden sm:block">Chhatisgarh Swami Vivekanand Tech. Univ.</p>
          </div>
        </Link>

        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-[#475569]">

        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {(user.role === "Admin" || user.role === "Officer" || user.role === "Management") && (
                <Link
                  to={user.role === "Admin" ? "/admin" : user.role === "Officer" ? "/officer" : "/management"}
                  className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm font-semibold text-white transition-colors bg-slate-900 px-3 py-2 sm:px-4 sm:py-2 rounded-lg shadow-sm hover:bg-slate-800 whitespace-nowrap"
                >
                  <span>Dashboard</span>
                </Link>
              )}
              <span className="hidden sm:inline text-sm font-semibold text-[#1e3a8a]">
                Welcome, {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-sm font-semibold text-red-600 hover:text-red-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="flex items-center space-x-1 sm:space-x-2 bg-[#1e3a8a] hover:bg-[#172554] text-white px-3 py-2 sm:px-5 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all shadow-md hover:shadow-lg active:scale-95 whitespace-nowrap">
                <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Login to Portal</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
