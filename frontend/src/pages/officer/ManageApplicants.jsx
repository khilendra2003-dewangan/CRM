import { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  Search,
  Filter,
  User,
  Mail,
  Phone,
  BarChart2,
  CheckCircle2,
  AlertCircle,
  FileCheck
} from "lucide-react";
import SlideOver from "../../components/SlideOver";
import axiosInstance from "../../api/axiosInstance";

export default function ManageApplicants() {
  const [applicants, setApplicants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [isSlideOpen, setIsSlideOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const initialFormState = {
    name: "",
    email: "",
    phone: "",
    category: "GM",
    entryType: "Regular",
    quotaType: "Management",
    marks: 0,
    documentsStatus: { status: "Pending" }
  };
  const [formData, setFormData] = useState(initialFormState);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get("/officer/getallapplicants");
      setApplicants(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openForm = (applicant = null) => {
    if (applicant) {
      setEditingId(applicant._id);
      setFormData({
        ...initialFormState,
        ...applicant
      });
    } else {
      setEditingId(null);
      setFormData(initialFormState);
    }
    setIsSlideOpen(true);
  };

  const openDetails = (applicant) => {
    setSelectedApplicant(applicant);
    setIsDetailsOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axiosInstance.put(`/officer/updateapplicant/${editingId}`, formData);
      } else {
        await axiosInstance.post("/officer/createapplicant", formData);
      }
      setIsSlideOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this applicant?")) return;
    try {
      await axiosInstance.delete(`/officer/deleteapplicant/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const updateDocStatus = async (id, status) => {
    try {
      const res = await axiosInstance.put(`/officer/updatedocumentstatus/${id}`, { status });
      fetchData();
      if (selectedApplicant?._id === id) {
        setSelectedApplicant(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const filteredApplicants = applicants.filter(app =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.phone.includes(searchTerm)
  );

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-8 border-b border-slate-100 bg-[#f8fafc]/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0f172a] font-serif tracking-tight">Manage Applicants</h2>
          <p className="text-sm text-slate-500 mt-1">Review, verify, and manage candidate communications.</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/10 focus:border-[#1e3a8a] w-64 transition-all"
            />
          </div>
          <button
            onClick={() => openForm()}
            className="bg-[#1e3a8a] hover:bg-[#172554] text-white px-5 py-2 rounded-xl text-sm font-bold flex items-center space-x-2 transition-all shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Candidate</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead>
            <tr className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 tracking-widest border-b border-slate-100">
              <th className="px-8 py-5">Full Name & Contact</th>
              <th className="px-8 py-5 text-center">Eligibility</th>
              <th className="px-8 py-5">Quota & Entry</th>
              <th className="px-8 py-5">Doc Status</th>
              <th className="px-8 py-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading ? (
              <tr><td colSpan="5" className="text-center py-12 text-slate-400">Fetching applicants...</td></tr>
            ) : filteredApplicants.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-12 text-slate-400 italic">No candidates found matching your criteria.</td></tr>
            ) : (
              filteredApplicants.map((app) => (
                <tr key={app._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-[#1e3a8a] font-bold">
                        {app.name[0]}
                      </div>
                      <div>
                        <p className="font-bold text-[#0f172a] group-hover:text-[#1e3a8a] transition-colors">{app.name}</p>
                        <div className="flex items-center space-x-3 mt-1 text-[10px] text-slate-400">
                          <span className="flex items-center"><Mail className="w-3 h-3 mr-1" /> {app.email}</span>
                          <span className="flex items-center"><Phone className="w-3 h-3 mr-1" /> {app.phone}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <div className="inline-flex flex-col items-center">
                      <span className="text-xs font-bold text-[#0f172a]">{app.marks}%</span>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-tight">Category: {app.category}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs font-semibold text-[#1e3a8a]">{app.quotaType}</span>
                      <span className="text-[10px] text-slate-400">{app.entryType} Entry</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${app.documentsStatus.status === 'Verified' ? 'bg-green-500' :
                          app.documentsStatus.status === 'Submitted' ? 'bg-blue-500' : 'bg-amber-500'
                        }`}></div>
                      <span className="text-[10px] font-bold text-[#475569] uppercase tracking-tight">
                        {app.documentsStatus.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openDetails(app)}
                        title="View Details"
                        className="p-2 text-slate-400 hover:text-[#1e3a8a] hover:bg-white rounded-xl shadow-none hover:shadow-sm border border-transparent hover:border-slate-100 transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openForm(app)}
                        title="Edit"
                        className="p-2 text-slate-400 hover:text-amber-600 hover:bg-white rounded-xl shadow-none hover:shadow-sm border border-transparent hover:border-slate-100 transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(app._id)}
                        title="Delete"
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-white rounded-xl shadow-none hover:shadow-sm border border-transparent hover:border-slate-100 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
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
        title="Candidate Profile"
      >
        {selectedApplicant && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center space-x-5 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
              <div className="w-20 h-20 bg-[#1e3a8a] rounded-[1.5rem] flex items-center justify-center text-white text-3xl font-serif font-bold shadow-lg shadow-blue-900/20">
                {selectedApplicant.name[0]}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-[#0f172a] tracking-tight">{selectedApplicant.name}</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-[#1e3a8a] uppercase tracking-widest shadow-sm">
                    ID: {selectedApplicant._id.slice(-6).toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm border ${selectedApplicant.documentsStatus.status === 'Verified' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                    {selectedApplicant.documentsStatus.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <DetailBox icon={Mail} label="Email Address" value={selectedApplicant.email} />
              <DetailBox icon={Phone} label="Phone Number" value={selectedApplicant.phone} />
              <DetailBox icon={BarChart2} label="Eligibility Marks" value={`${selectedApplicant.marks}%`} />
              <DetailBox icon={User} label="Category" value={selectedApplicant.category} />
            </div>

            <div className="p-6 bg-[#f8fafc] rounded-[2rem] border border-slate-100">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
                <FileCheck className="w-3.5 h-3.5 mr-2" />
                Document Verification Process
              </h4>
              <div className="space-y-4">
                <p className="text-sm text-slate-600 italic">
                  Verify that the candidate has submitted all original supporting documents for {selectedApplicant.quotaType} quota ({selectedApplicant.entryType}).
                </p>
                <div className="flex space-x-3 pt-2">
                  <button
                    onClick={() => updateDocStatus(selectedApplicant._id, "Verified")}
                    disabled={selectedApplicant.documentsStatus.status === "Verified"}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all shadow-sm ${selectedApplicant.documentsStatus.status === 'Verified'
                        ? 'bg-green-600 text-white cursor-default'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-green-50 hover:text-green-700 hover:border-green-200'
                      }`}
                  >
                    {selectedApplicant.documentsStatus.status === 'Verified' ? 'Verified ✓' : 'Approve Docs'}
                  </button>
                  <button
                    onClick={() => updateDocStatus(selectedApplicant._id, "Pending")}
                    className="flex-1 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 transition-all shadow-sm"
                  >
                    Mark Pending
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <button
                onClick={() => {
                  setIsDetailsOpen(false);
                  openForm(selectedApplicant);
                }}
                className="w-full bg-[#1e3a8a] text-white py-4 rounded-2xl font-bold shadow-xl shadow-blue-900/10 hover:bg-[#172554] active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
              >
                <Edit2 className="w-4 h-4" />
                <span>Update Profile</span>
              </button>
            </div>
          </div>
        )}
      </SlideOver>


      <SlideOver
        isOpen={isSlideOpen}
        onClose={() => setIsSlideOpen(false)}
        title={editingId ? "Edit Candidate" : "Onboard New Candidate"}
      >
        <form onSubmit={handleSave} className="space-y-6 pb-20">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Identity & Contact</h4>
            <InputItem label="Full Name" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" />
            <div className="grid grid-cols-2 gap-4">
              <InputItem label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" />
              <InputItem label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+91 9876543210" />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Eligibility Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <InputItem label="Category" name="category" type="select" options={["GM", "SC", "ST"]} value={formData.category} onChange={handleChange} />
              <InputItem label="Aggregate Marks (%)" name="marks" type="number" value={formData.marks} onChange={handleChange} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputItem label="Entry Type" name="entryType" type="select" options={["Regular", "Lateral"]} value={formData.entryType} onChange={handleChange} />
              <InputItem label="Quota Pool" name="quotaType" type="select" options={["Management", "KCET", "COMEDK"]} value={formData.quotaType} onChange={handleChange} />
            </div>
          </div>

          <div className="sticky bottom-0 bg-white pt-6 pb-2 border-t border-slate-100">
            <button type="submit" className="w-full bg-[#1e3a8a] text-white py-4 rounded-2xl font-bold shadow-xl shadow-blue-900/20 hover:shadow-2xl transition-all active:scale-[0.98]">
              {editingId ? "Save Changes" : "Create Candidate Entry"}
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
      <p className="text-sm font-bold text-[#0f172a] truncate">{value}</p>
    </div>
  );
}

function InputItem({ label, name, value, onChange, type = "text", options = [], required = false, placeholder = "" }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">{label}</label>
      {type === "select" ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/10 focus:border-[#1e3a8a] transition-all text-sm font-medium outline-none appearance-none cursor-pointer"
        >
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
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
