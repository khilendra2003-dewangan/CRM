import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";
import { motion } from "framer-motion";
import { Lock, Mail, GraduationCap, ArrowRight } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await axiosInstance.post("/login", formData);
      const data = res.data;

      loginUser(data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] relative overflow-hidden pt-16">

      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.04, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute -top-[10%] -left-[10%] w-[600px] h-[600px] rounded-full bg-[#1e3a8a] blur-[100px]"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.05, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          className="absolute top-[20%] right-[10%] w-[500px] h-[500px] rounded-full bg-[#eab308] blur-[120px]"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10 px-6"
      >
        <div className="bg-white/80 backdrop-blur-xl border border-white p-8 sm:p-10 rounded-[2rem] shadow-[0_8px_40px_rgb(0,0,0,0.04)]">

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-[#1e3a8a] text-white rounded-2xl mb-6 shadow-lg">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-serif text-[#0f172a] mb-2 tracking-tight">Access Portal</h2>
            <p className="text-[#475569] text-sm font-light">Enter your credentials to manage records.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 mb-4 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100 flex items-center">
                <span className="font-semibold">{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#0f172a] mb-1.5 ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748b]">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="admin@csvtu.ac.in"
                  className="w-full pl-10 pr-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] transition-all text-sm outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5 ml-1">
                <label className="block text-sm font-medium text-[#0f172a]">Password</label>
                <a href="#" className="text-xs text-[#1e3a8a] hover:underline">Forgot?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748b]">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] transition-all text-sm outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-8 flex items-center justify-center space-x-2 bg-[#1e3a8a] hover:bg-[#172554] text-white py-3.5 rounded-xl text-sm font-medium transition-colors shadow-md disabled:opacity-70"
            >
              <span>{isLoading ? "Authenticating..." : "Sign In"}</span>
              {!isLoading && <ArrowRight className="w-4 h-4 ml-1" />}
            </button>
          </form>

        </div>
      </motion.div>
    </div>
  );
}
