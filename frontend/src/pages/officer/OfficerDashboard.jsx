import { useState, useEffect } from "react";
import { 
  Users, 
  CheckCircle, 
  Clock, 
  CreditCard, 
  ArrowUpRight, 
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";
import axiosInstance from "../../api/axiosInstance";

const StatCard = ({ title, value, icon: Icon, color, description }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex items-center space-x-1 text-green-600 bg-green-50 px-2 py-1 rounded-full">
        <TrendingUp className="w-3 h-3" />
        <span className="text-[10px] font-bold">Live</span>
      </div>
    </div>
    <div>
      <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{title}</h3>
      <div className="flex items-baseline space-x-2">
        <span className="text-3xl font-bold text-[#0f172a] tracking-tight">{value}</span>
      </div>
      <p className="text-[10px] text-slate-400 font-medium mt-2 flex items-center">
        <AlertCircle className="w-3 h-3 mr-1" />
        {description}
      </p>
    </div>
  </motion.div>
);

export default function OfficerDashboard() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get("/management/dashboard");
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e3a8a]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-[#0f172a] font-serif tracking-tight">Officer Overview</h2>
          <p className="text-slate-500 mt-2 font-medium">Monitoring the 2024-2025 admission cycle and applicant pipeline.</p>
        </div>
        <div className="px-4 py-2 bg-white border border-slate-200 rounded-2xl shadow-sm text-xs font-bold text-slate-500 flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span>System Online</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard 
          title="Total Intake"
          value={stats?.totalIntake || 0}
          icon={Users}
          color="bg-blue-500"
          description="Total approved seats"
        />
        <StatCard 
          title="Occupied"
          value={stats?.totalFilled || 0}
          icon={CheckCircle}
          color="bg-emerald-500"
          description="Seats already allotted"
        />
        <StatCard 
          title="Available"
          value={stats?.remainingSeats || 0}
          icon={ArrowUpRight}
          color="bg-indigo-500"
          description="Seats open for allotment"
        />
        <StatCard 
          title="Pending Docs"
          value={stats?.pendingDocuments || 0}
          icon={Clock}
          color="bg-amber-500"
          description="Awaiting verification"
        />
        <StatCard 
          title="Fee Pending"
          value={stats?.feePendingCount || 0}
          icon={CreditCard}
          color="bg-rose-500"
          description="Waiting for payment"
        />
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
        <div className="flex justify-between items-center mb-8">
           <h3 className="text-lg font-bold text-[#0f172a] font-serif">Program-wise Seat Availability</h3>
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quota Breakdown</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-slate-400 uppercase tracking-widest font-bold border-b border-slate-100 pb-4">
                <th className="pb-4">Program Name</th>
                <th className="pb-4">Quota Type</th>
                <th className="pb-4 text-center">Total</th>
                <th className="pb-4 text-center">Filled</th>
                <th className="pb-4 text-center">Remaining</th>
                <th className="pb-4 text-right">Utilization</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {stats?.quotaStats?.map((qs, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 font-bold text-sm text-[#0f172a]">{qs.program}</td>
                  <td className="py-4">
                    <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 rounded-lg text-slate-600 uppercase tracking-tight">
                      {qs.quota}
                    </span>
                  </td>
                  <td className="py-4 text-center text-sm text-slate-600 font-medium">{qs.total}</td>
                  <td className="py-4 text-center text-sm text-[#1e3a8a] font-bold">{qs.filled}</td>
                  <td className="py-4 text-center">
                    <span className={`text-sm font-bold ${qs.remaining > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {qs.remaining}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <div className="w-24 ml-auto h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${qs.remaining === 0 ? 'bg-rose-500' : 'bg-[#1e3a8a]'}`}
                        style={{ width: `${(qs.filled / qs.total) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">

        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-bold text-[#0f172a] font-serif">Fee Pending Actions</h3>
              <button className="text-[10px] font-bold text-[#1e3a8a] uppercase tracking-widest hover:underline flex items-center">
                View All Records <ArrowUpRight className="w-3 h-3 ml-1" />
              </button>
           </div>
           
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] text-slate-400 uppercase tracking-widest font-bold border-b border-slate-100 pb-4">
                    <th className="pb-4">Applicant</th>
                    <th className="pb-4">Quota</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {stats?.feePendingList?.length > 0 ? (
                    stats.feePendingList.slice(0, 5).map((item) => (
                      <tr key={item._id} className="group hover:bg-slate-50 transition-colors">
                        <td className="py-4 pr-4">
                           <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full bg-[#1e3a8a]/5 flex items-center justify-center font-bold text-[#1e3a8a] text-xs">
                                {item.applicantId?.name?.[0]}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-[#0f172a]">{item.applicantId?.name}</p>
                                <p className="text-[10px] text-slate-400 italic">No: {item.allotmentNumber}</p>
                              </div>
                           </div>
                        </td>
                        <td className="py-4">
                           <span className="text-xs font-semibold text-[#1e3a8a] bg-[#1e3a8a]/5 px-2 py-1 rounded-lg">
                              {item.quotaType}
                           </span>
                        </td>
                        <td className="py-4">
                           <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full uppercase tracking-tighter">
                              {item.feeStatus}
                           </span>
                        </td>
                        <td className="py-4 text-right">
                           <button className="p-2 text-slate-400 hover:text-[#1e3a8a] hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-100 shadow-none hover:shadow-sm">
                              <ArrowUpRight className="w-4 h-4" />
                           </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-slate-400 text-sm italic">
                         No fee-pending records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
           </div>
        </div>

        <div className="bg-[#1e3a8a] rounded-[2rem] p-8 text-white flex flex-col justify-between shadow-2xl shadow-blue-900/20 relative overflow-hidden group">
           <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
           <div>
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
                 <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-2">Ready to Allot?</h3>
              <p className="text-blue-100/70 text-sm leading-relaxed mb-8">
                 Ensure all applicant documents are verified before proceeding with seat allotment. 
              </p>
           </div>
           
           <button className="w-full bg-white text-[#1e3a8a] py-4 rounded-2xl font-bold shadow-lg hover:bg-blue-50 active:scale-[0.98] transition-all flex items-center justify-center space-x-2">
              <span>Go to Admissions</span>
              <ArrowUpRight className="w-4 h-4" />
           </button>
        </div>
      </div>
    </div>
  );
}
