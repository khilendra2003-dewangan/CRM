import { useState, useEffect } from "react";
import {
   Users,
   TrendingUp,
   DollarSign,
   BarChart,
   Target,
   ArrowUpRight,
   Activity,
   Briefcase
} from "lucide-react";
import { motion } from "framer-motion";
import axiosInstance from "../../api/axiosInstance";

const MetricCard = ({ title, value, subvalue, icon: Icon, trend, colorClass }) => (
   <motion.div
      whileHover={{ y: -5 }}
      className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:shadow-2xl hover:shadow-slate-200/50"
   >
      <div className="flex justify-between items-start mb-6">
         <div className={`p-4 rounded-2xl ${colorClass}`}>
            <Icon className="w-6 h-6 text-white" />
         </div>
         <div className="flex items-center space-x-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full text-[10px] font-bold">
            <TrendingUp className="w-3 h-3" />
            <span>+{trend}%</span>
         </div>
      </div>
      <div className="space-y-1">
         <h3 className="text-slate-400 text-xs font-bold uppercase tracking-[0.1em]">{title}</h3>
         <p className="text-4xl font-serif font-bold text-slate-900 tracking-tight">{value}</p>
         <p className="text-[10px] text-slate-500 font-medium">{subvalue}</p>
      </div>
   </motion.div>
);

export default function ManagementDashboard() {
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
            <div className="animate-pulse flex flex-col items-center space-y-4">
               <Activity className="w-12 h-12 text-slate-300 animate-spin" />
               <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Compiling Board Intel...</p>
            </div>
         </div>
      );
   }


   const utilizationRate = stats ? ((stats.totalFilled / stats.totalIntake) * 100).toFixed(1) : 0;

   return (
      <div className="space-y-10 animate-in fade-in duration-1000">
         <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
               <h2 className="text-4xl font-serif font-bold text-slate-900 tracking-tight">Institutional Overview</h2>
               <p className="text-slate-500 mt-2 font-medium">Executive analysis of recruitment efficiency and program capacity.</p>
            </div>
            <div className="flex items-center space-x-4">
               <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 text-right">Cycle Health</p>
                  <div className="flex items-center space-x-2">
                     <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => <div key={i} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white"></div>)}
                     </div>
                     <span className="text-xs font-bold text-slate-900">Active Pipeline</span>
                  </div>
               </div>
            </div>
         </header>


         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
               title="Total Seat Capacity"
               value={stats?.totalIntake || 0}
               subvalue="Approved by University Sync"
               icon={Users}
               trend={12}
               colorClass="bg-slate-900"
            />
            <MetricCard
               title="Conversion Rate"
               value={`${utilizationRate}%`}
               subvalue={`${stats?.totalFilled || 0} seats successfully filled`}
               icon={Target}
               trend={5}
               colorClass="bg-[#2563eb]"
            />
            <MetricCard
               title="Verification Status"
               value={stats?.pendingDocuments || 0}
               subvalue="Pending administrative review"
               icon={Activity}
               trend={8}
               colorClass="bg-amber-500"
            />
            <MetricCard
               title="Financial Variance"
               value={stats?.feePendingCount || 0}
               subvalue="Accounts awaiting settlement"
               icon={Briefcase}
               trend={2}
               colorClass="bg-rose-500"
            />
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-1000">
                  <BarChart className="w-64 h-64" />
               </div>

               <div className="flex justify-between items-center mb-10 relative z-10">
                  <div>
                     <h3 className="text-xl font-bold text-slate-900 font-serif">Program Performance Matrix</h3>
                     <p className="text-xs text-slate-400 font-medium mt-1">Detailed capacity analysis across all schools.</p>
                  </div>
                  <button className="text-[10px] font-bold text-slate-900 bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center">
                     Generate PDF Report <ArrowUpRight className="w-3 h-3 ml-2" />
                  </button>
               </div>

               <div className="overflow-x-auto relative z-10">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="text-[10px] text-slate-400 uppercase tracking-widest font-bold border-b border-slate-100 pb-5">
                           <th className="pb-5">Institution Area</th>
                           <th className="pb-5">Quota</th>
                           <th className="pb-5 text-right">Utilization</th>
                           <th className="pb-5 text-right">Available</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                        {stats?.quotaStats?.map((qs, i) => (
                           <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                              <td className="py-5">
                                 <p className="text-sm font-bold text-slate-900">{qs.program}</p>
                                 <p className="text-[10px] text-slate-400 font-medium uppercase mt-0.5 tracking-tight">{qs.total} Seats Capacity</p>
                              </td>
                              <td className="py-5">
                                 <span className="text-[10px] font-bold text-[#2563eb] bg-blue-50 px-2 py-1 rounded-lg uppercase">
                                    {qs.quota}
                                 </span>
                              </td>
                              <td className="py-5 text-right">
                                 <div className="flex flex-col items-end">
                                    <span className="text-xs font-bold text-slate-900">
                                       {((qs.filled / qs.total) * 100).toFixed(0)}%
                                    </span>
                                    <div className="w-20 h-1 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                                       <div
                                          className="h-full bg-[#2563eb] rounded-full"
                                          style={{ width: `${(qs.filled / qs.total) * 100}%` }}
                                       ></div>
                                    </div>
                                 </div>
                              </td>
                              <td className="py-5 text-right">
                                 <span className={`text-sm font-bold ${qs.remaining > 0 ? 'text-emerald-500' : 'text-slate-300'}`}>
                                    {qs.remaining}
                                 </span>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>


            <div className="bg-[#1e293b] rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl shadow-slate-900/10">
               <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

               <div className="relative z-10 h-full flex flex-col">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-md border border-white/5">
                     <DollarSign className="w-6 h-6" />
                  </div>

                  <h3 className="text-2xl font-serif font-bold mb-3 tracking-tight text-white">Projected Yield</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-auto">
                     Analysis of institutional financial contribution across confirmed and pending enrollments.
                     Real-time verification of accounts receivable.
                  </p>

                  <div className="mt-12 space-y-6">
                     <div className="p-6 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-sm">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Accounts Receivable</p>
                        <p className="text-3xl font-serif font-bold">{stats?.feePendingCount || 0}</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-1">Pending Payment Confirmations</p>
                     </div>

                     <button className="w-full bg-white text-slate-900 py-4 rounded-2xl font-bold shadow-xl hover:bg-slate-100 active:scale-[0.98] transition-all flex items-center justify-center space-x-2">
                        <span>Explore Financial Reports</span>
                        <ArrowUpRight className="w-4 h-4" />
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
