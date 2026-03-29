import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Eye, Layers, Clock, CreditCard, Users, BookOpen, CheckCircle, X, ShieldCheck } from "lucide-react";
import SlideOver from "../../components/SlideOver";
import axiosInstance from "../../api/axiosInstance";

export default function ManagePrograms() {
  const [programs, setPrograms] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isSlideOpen, setIsSlideOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedProg, setSelectedProg] = useState(null);

  const initialFormState = {
    name: "", code: "", description: "", head: "", status: "Active",
    departmentId: "", academicYear: "2024-2025", duration: "4 Years",
    fee: "", courseType: "UG", entryType: "Regular",
    admissionMode: "Government", intake: 60, quotas: [{ type: "Management", totalSeats: 10, filledSeats: 0 }]
  };
  const [formData, setFormData] = useState(initialFormState);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [progRes, depRes] = await Promise.all([
        axiosInstance.get("/getAllPrograms"),
        axiosInstance.get("/getAllDepartments")
      ]);

      setPrograms(progRes.data);
      setDepartments(depRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openForm = (program = null) => {
    if (program) {
      setEditingId(program._id);
      setFormData({
        ...initialFormState,
        ...program
      });
    } else {
      setEditingId(null);
      setFormData({ ...initialFormState, departmentId: departments.length > 0 ? departments[0]._id : "" });
    }
    setIsSlideOpen(true);
  };

  const openDetails = (program) => {
    setSelectedProg(program);
    setIsDetailsOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      intake: Number(formData.intake),
      quotas: formData.quotas.map(q => ({ ...q, totalSeats: Number(q.totalSeats) }))
    };

    const totalQuotaSeats = formData.quotas.reduce((sum, q) => sum + Number(q.totalSeats), 0);
    if (totalQuotaSeats > formData.intake) {
      alert(`Total quota seats (${totalQuotaSeats}) cannot exceed program intake (${formData.intake})`);
      return;
    }

    try {
      if (editingId) {
        await axiosInstance.put(`/updateProgram/${editingId}`, payload);
      } else {
        await axiosInstance.post("/createProgram", payload);
      }
      setIsSlideOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this program?")) return;
    try {
      await axiosInstance.delete(`/deleteProgram/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleQuotaChange = (index, field, value) => {
    const newQuotas = [...formData.quotas];
    newQuotas[index][field] = value;
    setFormData({ ...formData, quotas: newQuotas });
  };

  const addQuota = () => {
    setFormData({ ...formData, quotas: [...formData.quotas, { type: "", totalSeats: 0, filledSeats: 0 }] });
  };

  const removeQuota = (index) => {
    const newQuotas = formData.quotas.filter((_, i) => i !== index);
    setFormData({ ...formData, quotas: newQuotas });
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-[#f8fafc]">
        <div>
          <h2 className="text-xl font-semibold text-[#0f172a] font-serif">Academic Programs</h2>
          <p className="text-sm text-slate-500 mt-1">Manage courses, durations, intakes, and quotas.</p>
        </div>
        <button
          onClick={() => openForm()}
          className="bg-[#1e3a8a] hover:bg-[#172554] text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center space-x-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Program</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-[#f1f5f9] text-[#0f172a] font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Code</th>
              <th className="px-6 py-4">Program Name</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="5" className="text-center py-8 text-slate-400">Loading programs...</td></tr>
            ) : programs.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-8 text-slate-400">No programs found.</td></tr>
            ) : (
              programs.map((prog) => {
                const parentDep = departments.find(d => d._id === prog.departmentId);
                return (
                  <tr key={prog._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 font-semibold text-[#1e3a8a]">{prog.code}</td>
                    <td className="px-6 py-4 font-medium text-[#0f172a]">{prog.name}</td>
                    <td className="px-6 py-4 flex items-center space-x-2 text-slate-500">
                      <Layers className="w-4 h-4 text-slate-400" />
                      <span className="truncate max-w-[150px]">{parentDep ? parentDep.name : "Unknown"}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{prog.courseType} ({prog.duration})</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openDetails(prog)}
                          title="View Details"
                          className="p-2 text-slate-400 hover:text-[#1e3a8a] hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openForm(prog)}
                          title="Edit"
                          className="p-2 text-slate-400 hover:text-[#eab308] hover:bg-amber-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(prog._id)}
                          title="Delete"
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>


      <SlideOver
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title="Program Details"
      >
        {selectedProg && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-start space-x-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-16 h-16 bg-[#1e3a8a]/10 rounded-xl flex items-center justify-center text-[#1e3a8a] border border-[#1e3a8a]/20">
                <BookOpen className="w-8 h-8" />
              </div>
              <div className="flex-1 overflow-hidden">
                <h3 className="text-lg font-bold text-[#0f172a] leading-tight mb-1 truncate">{selectedProg.name}</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#1e3a8a]/10 text-[#1e3a8a]">
                    Code: {selectedProg.code}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedProg.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                    {selectedProg.status || 'Active'}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <DetailBox icon={Layers} label="Department" value={departments.find(d => d._id === selectedProg.departmentId)?.name || "Unknown"} />
              <DetailBox icon={CheckCircle} label="Course Type" value={selectedProg.courseType} />
              <DetailBox icon={Clock} label="Duration" value={selectedProg.duration} />
              <DetailBox icon={ShieldCheck} label="Academic Year" value={selectedProg.academicYear} />
              <DetailBox icon={Users} label="Total Intake" value={selectedProg.intake} />
              <DetailBox icon={CreditCard} label="Annual Fee" value={selectedProg.fee} />
              <DetailBox icon={Layers} label="Entry Type" value={selectedProg.entryType} />
              <DetailBox icon={Layers} label="Admission Mode" value={selectedProg.admissionMode} />
            </div>

            {selectedProg.description && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Description</h4>
                <div className="p-4 bg-white border border-slate-100 rounded-2xl text-sm text-slate-600 leading-relaxed italic">
                  "{selectedProg.description}"
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Seat Distribution (Quotas)</h4>
              <div className="space-y-2">
                {selectedProg.quotas.map((q, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl">
                    <span className="text-sm font-semibold text-[#0f172a]">{q.type}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-xs text-slate-400 italic">Seats: {q.totalSeats}</span>
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#1e3a8a]"
                          style={{ width: `${(q.filledSeats / q.totalSeats) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => {
                  setIsDetailsOpen(false);
                  openForm(selectedProg);
                }}
                className="w-full bg-white border border-slate-200 text-[#0f172a] py-3 rounded-xl font-medium shadow-sm hover:bg-slate-50 transition-colors flex items-center justify-center space-x-2"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit Program</span>
              </button>
            </div>
          </div>
        )}
      </SlideOver>

      <SlideOver
        isOpen={isSlideOpen}
        onClose={() => setIsSlideOpen(false)}
        title={editingId ? "Edit Program" : "Create Program"}
      >
        <form onSubmit={handleSave} className="space-y-5 pb-10">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">General Info</h4>
            <div className="grid grid-cols-2 gap-4">
              <InputItem label="Program Code" name="code" value={formData.code} onChange={handleChange} required placeholder="e.g. CS-01" />
              <InputItem label="Status" name="status" type="select" options={["Active", "Inactive"]} value={formData.status} onChange={handleChange} />
            </div>
            <InputItem
              label="Department"
              name="departmentId"
              type="select"
              options={departments.map(d => ({ label: d.name, value: d._id }))}
              value={formData.departmentId}
              onChange={handleChange}
              required
            />
            <InputItem label="Program Name" name="name" value={formData.name} onChange={handleChange} required placeholder="B.Tech Computer Science..." />
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Description (optional)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] transition-all text-sm outline-none resize-none h-24"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Academics & Fees</h4>
            <div className="grid grid-cols-2 gap-4">
              <InputItem label="Course Type" name="courseType" type="select" options={["UG", "PG"]} value={formData.courseType} onChange={handleChange} />
              <InputItem label="Duration" name="duration" value={formData.duration} onChange={handleChange} placeholder="4 Years" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputItem label="Entry Type" name="entryType" type="select" options={["Regular", "Lateral"]} value={formData.entryType} onChange={handleChange} />
              <InputItem label="Admission Mode" name="admissionMode" type="select" options={["Government", "Management"]} value={formData.admissionMode} onChange={handleChange} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputItem label="Intake" name="intake" value={formData.intake} onChange={handleChange} type="number" />
              <InputItem label="Annual Fee" name="fee" value={formData.fee} onChange={handleChange} placeholder="₹ 1,00,000" />
            </div>
            <InputItem label="Academic Year" name="academicYear" value={formData.academicYear} onChange={handleChange} placeholder="2024-2025" />
          </div>

          <div className="pt-4 space-y-4 text-left">
            <div className="flex justify-between items-center px-1">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Seat Quotas</h4>
              <button type="button" onClick={addQuota} className="text-[10px] font-bold text-[#1e3a8a] hover:underline uppercase tracking-tighter">
                + Add Quota
              </button>
            </div>

            {formData.quotas.map((quota, idx) => (
              <div key={idx} className="flex items-center space-x-2 animate-in slide-in-from-left-2 duration-300">
                <div className="flex-1">
                  <select
                    value={quota.type}
                    onChange={(e) => handleQuotaChange(idx, "type", e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 appearance-none cursor-pointer"
                    required
                  >
                    <option value="" disabled>Select Quota Type</option>
                    <option value="Management">Management</option>
                    <option value="KCET">KCET</option>
                    <option value="COMEDK">COMEDK</option>
                  </select>
                </div>
                <div className="w-24">
                  <input
                    type="number"
                    value={quota.totalSeats}
                    onChange={(e) => handleQuotaChange(idx, "totalSeats", e.target.value)}
                    placeholder="Seats"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#1e3a8a]/20"
                    required
                  />
                </div>
                <button type="button" onClick={() => removeQuota(idx)} className="p-2.5 text-slate-400 hover:text-red-600 bg-red-50/50 rounded-xl transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="sticky bottom-0 bg-white pt-4 pb-2">
            <button type="submit" className="w-full bg-[#1e3a8a] text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-900/10 hover:bg-[#172554] active:scale-[0.98] transition-all">
              {editingId ? "Update Program" : "Create Program"}
            </button>
          </div>
        </form>
      </SlideOver>
    </div>
  );
}


function DetailBox({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="p-3 bg-white border border-slate-100 rounded-xl">
      <div className="flex items-center space-x-2 text-slate-400 mb-1">
        <Icon className="w-3.5 h-3.5" />
        <span className="text-[10px] font-bold uppercase tracking-tight">{label}</span>
      </div>
      <p className="text-sm font-semibold text-[#0f172a]">{value}</p>
    </div>
  );
}

function InputItem({ label, name, value, onChange, type = "text", options = [], required = false, placeholder = "" }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">{label}</label>
      {type === "select" ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] transition-all text-sm outline-none cursor-pointer appearance-none"
        >
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
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] transition-all text-sm outline-none placeholder:text-slate-400"
        />
      )}
    </div>
  );
}
