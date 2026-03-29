import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Users, ShieldCheck } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-12 overflow-hidden bg-gradient-to-br from-[#ffffff] via-[#f8fafc] to-[#f1f5f9]">

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.05, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute -top-[10%] left-[10%] w-[600px] h-[600px] rounded-full bg-[#1e3a8a] blur-[150px]"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.03, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
          className="absolute -bottom-[20%] right-[10%] w-[500px] h-[500px] rounded-full bg-[#eab308] blur-[120px]"
        />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMzAsIDU4LCAxMzgsIDAuMDUpIi8+PC9zdmc+')] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)]"></div>
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-block py-1.5 px-4 rounded-full bg-[#1e3a8a]/5 border border-[#1e3a8a]/10 text-xs font-bold uppercase tracking-[0.3em] text-[#1e3a8a] mb-8">
            State University established by Gov. of CG
          </span>

          <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif text-[#0f172a] leading-[1.2] mb-6 tracking-tight font-bold">
            Chhattisgarh Swami Vivekanand <br className="hidden md:block" />
            <span className="text-[#1e3a8a]">Technical University</span>
          </h1>

          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="h-px w-10 bg-slate-300"></div>
            <p className="text-xl font-serif text-slate-500 italic">CSVTU Bhilai</p>
            <div className="h-px w-10 bg-slate-300"></div>
          </div>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-[#64748b] mb-12 leading-relaxed font-light">
            Empowering the future through technical excellence and innovative management. Experience the unified digital gateway for academic administration.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group flex items-center justify-center space-x-3 bg-[#1e3a8a] text-white px-10 py-5 rounded-2xl font-bold shadow-[0_20px_50px_rgba(30,58,138,0.2)] hover:shadow-[0_20px_50px_rgba(30,58,138,0.3)] transition-all"
            >
              <span className="text-lg">Access Student Portal</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-20 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 grayscale opacity-60"
        >

          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-sm font-semibold uppercase tracking-widest">ISO 9001:2015</span>
          </div>
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5" />
            <span className="text-sm font-semibold uppercase tracking-widest">AICTE Approved</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span className="text-sm font-semibold uppercase tracking-widest">Digital India Initiative</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
