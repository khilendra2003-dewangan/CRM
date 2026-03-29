import { GraduationCap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-[#94a3b8] py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-12 border-b border-slate-800 pb-12">
        <div className="md:col-span-1">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-[#1e3a8a] rounded-lg">
              <GraduationCap className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-xl text-white tracking-tight">CSVTU</h1>
            </div>
          </div>
          <p className="text-sm leading-relaxed mb-6 font-light">
            Chhattisgarh Swami Vivekanand Technical University is a premium state university committed to advancing technology and engineering education.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6">Portals</h4>
          <ul className="space-y-3 text-sm font-light">
            <li><a href="#" className="hover:text-white transition-colors">Student Dashboard</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Faculty Login</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Admin Console</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Alumni Network</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6">Resources</h4>
          <ul className="space-y-3 text-sm font-light">
            <li><a href="#" className="hover:text-white transition-colors">Admissions Guidelines</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Academic Calendar</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Research & Journals</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Support & IT Helpdesk</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6">Contact</h4>
          <ul className="space-y-3 text-sm font-light">
            <li>Newai, P.O.-Newai, District-Durg, <br />Chhattisgarh, PIN-491107</li>
            <li>Phone: +91 788-2200062</li>
            <li>Email: registrar@csvtu.ac.in</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm font-light">
        <p>&copy; {new Date().getFullYear()} Chhattisgarh Swami Vivekanand Technical University. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Accessibility</a>
        </div>
      </div>
    </footer>
  );
}
