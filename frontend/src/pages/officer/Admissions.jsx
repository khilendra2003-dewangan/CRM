import { useState, useEffect } from "react";
import {
  Plus,
  CheckCircle,
  Clock,
  CreditCard,
  Eye,
  Layers,
  User,
  ArrowRight,
  ShieldCheck,
  AlertTriangle
} from "lucide-react";
import SlideOver from "../../components/SlideOver";
import axiosInstance from "../../api/axiosInstance";

export default function Admissions() {
  const [admissions, setAdmissions] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isSlideOpen, setIsSlideOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState(null);

  const [formData, setFormData] = useState({
    applicantId: "",
    programId: "",
    quotaType: "Management",
    allotmentNumber: `ALLOT/${Date.now()}`
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [admRes, appRes, progRes] = await Promise.all([
        axiosInstance.get("/officer/getalladmissions"),
        axiosInstance.get("/officer/getallapplicants"),
        axiosInstance.get("/getAllPrograms")
      ]);

      setAdmissions(admRes.data);
      setApplicants(appRes.data);
      setPrograms(progRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateAllotment = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/officer/createallotment", formData);
      setIsSlideOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to allot");
    }
  };

  const updateFee = async (id, feeStatus) => {
    try {
      await axiosInstance.put(`/officer/updatefeestatus/${id}`, { feeStatus });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const confirmAdmission = async (id) => {
    try {
      await axiosInstance.put(`/officer/confirmadmission/${id}`);
      fetchData();
      setIsDetailsOpen(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Cannot confirm admission");
    }
  };


  const eligibleApplicants = applicants.filter(app =>
    app.documentsStatus.status === "Verified" &&
    !admissions.some(adm => adm.applicantId?._id === app._id)
  );

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-8 border-b border-slate-100 bg-[#f8fafc]/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0f172a] font-serif tracking-tight">Seat Allotment & Admissions</h2>
          <p className="text-sm text-slate-500 mt-1">Manage the lifecycle from seat selection to final enrollment.</p>
        </div>
        <button
          onClick={() => setIsSlideOpen(true)}
          className="bg-[#1e3a8a] hover:bg-[#172554] text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center space-x-2 transition-all shadow-lg shadow-blue-900/10 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Allotment</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead>
            <tr className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 tracking-widest border-b border-slate-100">
              <th className="px-8 py-5">Allotment No.</th>
              <th className="px-8 py-5">Applicant</th>
              <th className="px-8 py-5">Program</th>
              <th className="px-8 py-5">Fee / Status</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading ? (
              <tr><td colSpan="5" className="text-center py-12 text-slate-400">Loading records...</td></tr>
            ) : admissions.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-12 text-slate-400 italic">No admission records found.</td></tr>
            ) : (
              admissions.map((adm) => (
                <tr key={adm._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <span className="text-[10px] font-bold text-[#1e3a8a] bg-[#1e3a8a]/5 px-2 py-1 rounded-lg">
                      {adm.allotmentNumber || 'N/A'}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-[#0f172a]">{adm.applicantId?.name || "Unknown"}</span>
                      <span className="text-[10px] text-slate-400">{adm.quotaType} Quota</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-700">{adm.programId?.name || "N/A"}</span>
                      <span className="text-[10px] text-slate-400">{adm.programId?.courseType}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${adm.feeStatus === 'paid' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                        }`}>
                        FEE: {adm.feeStatus.toUpperCase()}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${adm.status === 'Confirmed' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}>
                        {adm.status.toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => {
                          setSelectedAdmission(adm);
                          setIsDetailsOpen(true);
                        }}
                        className="p-2 text-slate-400 hover:text-[#1e3a8a] hover:bg-white rounded-xl shadow-none hover:shadow-sm border border-transparent hover:border-slate-100 transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <SlideOver
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title="Admission Lifecycle"
      >
        {selectedAdmission && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <ShieldCheck className={`w-12 h-12 opacity-10 ${selectedAdmission.status === 'Confirmed' ? 'text-blue-600' : 'text-slate-400'}`} />
              </div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Status Overview</h3>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-serif font-bold text-[#0f172a] tracking-tight">
                    {selectedAdmission.status}
                  </p>
                  {selectedAdmission.admissionNumber && (
                    <p className="text-[10px] font-bold text-[#1e3a8a] mt-1 italic">GEN-ID: {selectedAdmission.admissionNumber}</p>
                  )}
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${selectedAdmission.feeStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                  Fee {selectedAdmission.feeStatus}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <DetailBox icon={User} label="Student" value={selectedAdmission.applicantId?.name} />
              <DetailBox icon={Layers} label="Program" value={selectedAdmission.programId?.name} />
              <DetailBox icon={Layers} label="Quota" value={selectedAdmission.quotaType} />
              <DetailBox icon={CreditCard} label="Annual Fee" value={selectedAdmission.programId?.fee} />
            </div>

            <div className="space-y-4 pt-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Officer Actions</h4>

              <div className="space-y-3">

                <button
                  onClick={() => updateFee(selectedAdmission._id, selectedAdmission.feeStatus === 'paid' ? 'Pending' : 'paid')}
                  className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${selectedAdmission.feeStatus === 'paid' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div className="text-left font-bold text-sm text-[#0f172a]">
                      Mark as {selectedAdmission.feeStatus === 'paid' ? 'Pending' : 'Paid'}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#1e3a8a] group-hover:translate-x-1 transition-all" />
                </button>


                {selectedAdmission.status !== "Confirmed" && (
                  <button
                    onClick={() => confirmAdmission(selectedAdmission._id)}
                    disabled={selectedAdmission.feeStatus !== 'paid'}
                    className={`w-full flex items-center justify-between p-4 border rounded-2xl transition-all group ${selectedAdmission.feeStatus === 'paid'
                        ? 'bg-[#1e3a8a] border-[#1e3a8a] text-white hover:bg-[#172554] shadow-lg shadow-blue-900/10'
                        : 'bg-white border-slate-100 text-slate-400 opacity-50 cursor-not-allowed'
                      }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white/10 rounded-lg">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      <div className="text-left font-bold text-sm">
                        Confirm Final Admission
                      </div>
                    </div>
                    {selectedAdmission.feeStatus !== 'paid' && <AlertTriangle className="w-4 h-4" />}
                  </button>
                )}
              </div>
              {selectedAdmission.feeStatus !== 'paid' && (
                <p className="text-[10px] text-amber-600 font-bold italic px-2 flex items-center">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Fees must be marked 'Paid' before final confirmation.
                </p>
              )}
            </div>
          </div>
        )}
      </SlideOver>


      <SlideOver
        isOpen={isSlideOpen}
        onClose={() => setIsSlideOpen(false)}
        title="New Seat Allotment"
      >
        <form onSubmit={handleCreateAllotment} className="space-y-6 pb-20">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Target Selection</h4>

            <InputItem
              label="Verified Applicant"
              name="applicantId"
              type="select"
              options={eligibleApplicants.map(app => ({ label: `${app.name} (${app.marks}%)`, value: app._id }))}
              value={formData.applicantId}
              onChange={(e) => setFormData({ ...formData, applicantId: e.target.value })}
              required
            />

            <InputItem
              label="Academic Program"
              name="programId"
              type="select"
              options={programs.map(p => ({ label: `${p.name} - ${p.courseType}`, value: p._id }))}
              value={formData.programId}
              onChange={(e) => setFormData({ ...formData, programId: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <InputItem
                label="Quota"
                name="quotaType"
                type="select"
                options={["Management", "KCET", "COMEDK"]}
                value={formData.quotaType}
                onChange={(e) => setFormData({ ...formData, quotaType: e.target.value })}
                required
              />
              <InputItem
                label="Allotment ID"
                name="allotmentNumber"
                value={formData.allotmentNumber}
                onChange={(e) => setFormData({ ...formData, allotmentNumber: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="p-6 bg-blue-50 border border-blue-100 rounded-[2rem] flex items-start space-x-3">
            <ShieldCheck className="w-5 h-5 text-[#1e3a8a] mt-0.5" />
            <div>
              <p className="text-xs font-bold text-[#1e3a8a] uppercase tracking-tight mb-1">Pre-Check</p>
              <p className="text-[10px] text-blue-800 leading-relaxed font-medium">
                This action will reduce the remaining seats in the selected program for the chosen quota pool. This process is irreversible without administrative override.
              </p>
            </div>
          </div>

          <div className="sticky bottom-0 bg-white pt-6 pb-2 border-t border-slate-100">
            <button type="submit" className="w-full bg-[#1e3a8a] text-white py-4 rounded-2xl font-bold shadow-xl shadow-blue-900/20 hover:shadow-2xl transition-all active:scale-[0.98]">
              Generate Allotment Order
            </button>
          </div>
        </form>
      </SlideOver>
    </div>
  );
}


function DetailBox({ icon: Icon, label, value }) {
  return (
    <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
      <div className="flex items-center space-x-2 text-slate-400 mb-1.5">
        <Icon className="w-3.5 h-3.5" />
        <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-sm font-bold text-[#0f172a] truncate">{value || 'N/A'}</p>
    </div>
  );
}

function InputItem({ label, name, value, onChange, type = "text", options = [], required = false, placeholder = "" }) {
  return (
    <div className="space-y-1.5 text-left">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">{label}</label>
      {type === "select" ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/10 focus:border-[#1e3a8a] transition-all text-sm font-medium outline-none appearance-none cursor-pointer"
        >
          <option value="" disabled>Choose an option</option>
          {options.map(opt => typeof opt === 'string' ? (
            <option key={opt} value={opt}>{opt}</option>
          ) : (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/10 focus:border-[#1e3a8a] transition-all text-sm font-medium outline-none placeholder:text-slate-400"
        />
      )}
    </div>
  );
}
