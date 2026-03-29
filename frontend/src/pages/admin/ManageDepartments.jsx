import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Eye, MapPin, User, CheckCircle, Building } from "lucide-react";
import SlideOver from "../../components/SlideOver";
import axiosInstance from "../../api/axiosInstance";

export default function ManageDepartments() {
  const [departments, setDepartments] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isSlideOpen, setIsSlideOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedDep, setSelectedDep] = useState(null);

  const initialFormState = { name: "", code: "", campusId: "", head: "", status: "Active" };
  const [formData, setFormData] = useState(initialFormState);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [depRes, campRes] = await Promise.all([
        axiosInstance.get("/getAllDepartments"),
        axiosInstance.get("/getAllCampuses")
      ]);

      setDepartments(depRes.data);
      setCampuses(campRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openForm = (department = null) => {
    if (department) {
      setEditingId(department._id);
      setFormData({
        ...initialFormState,
        ...department
      });
    } else {
      setEditingId(null);
      setFormData({ ...initialFormState, campusId: campuses.length > 0 ? campuses[0]._id : "" });
    }
    setIsSlideOpen(true);
  };

  const openDetails = (department) => {
    setSelectedDep(department);
    setIsDetailsOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axiosInstance.put(`/updateDepartment/${editingId}`, formData);
      } else {
        await axiosInstance.post("/createDepartment", formData);
      }
      setIsSlideOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?")) return;
    try {
      await axiosInstance.delete(`/deleteDepartment/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-[#f8fafc]">
        <div>
          <h2 className="text-xl font-semibold text-[#0f172a] font-serif">Departments</h2>
          <p className="text-sm text-slate-500 mt-1">Manage academic departments within campuses.</p>
        </div>
        <button
          onClick={() => openForm()}
          className="bg-[#1e3a8a] hover:bg-[#172554] text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center space-x-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Department</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-[#f1f5f9] text-[#0f172a] font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Code</th>
              <th className="px-6 py-4">Department Name</th>
              <th className="px-6 py-4">Parent Campus</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="4" className="text-center py-8 text-slate-400">Loading departments...</td></tr>
            ) : departments.length === 0 ? (
              <tr><td colSpan="4" className="text-center py-8 text-slate-400">No departments found.</td></tr>
            ) : (
              departments.map((dep) => {
                const parentCamp = campuses.find(c => c._id === dep.campusId);
                return (
                  <tr key={dep._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 font-semibold text-[#1e3a8a]">{dep.code}</td>
                    <td className="px-6 py-4 font-medium text-[#0f172a]">{dep.name}</td>
                    <td className="px-6 py-4 flex items-center space-x-2 text-slate-500">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="truncate max-w-[150px]">{parentCamp ? parentCamp.name : "Unknown"}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openDetails(dep)}
                          title="View Details"
                          className="p-2 text-slate-400 hover:text-[#1e3a8a] hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openForm(dep)}
                          title="Edit"
                          className="p-2 text-slate-400 hover:text-[#eab308] hover:bg-amber-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(dep._id)}
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
        title="Department Details"
      >
        {selectedDep && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-start space-x-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-16 h-16 bg-[#1e3a8a]/10 rounded-xl flex items-center justify-center text-[#1e3a8a] border border-[#1e3a8a]/20">
                <Building className="w-8 h-8" />
              </div>
              <div className="flex-1 overflow-hidden">
                <h3 className="text-lg font-bold text-[#0f172a] leading-tight mb-1 truncate">{selectedDep.name}</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#1e3a8a]/10 text-[#1e3a8a]">
                    Code: {selectedDep.code}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedDep.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                    {selectedDep.status || 'Active'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Institutional Context</h4>
              <div className="flex items-center space-x-3 p-3 bg-white border border-slate-100 rounded-xl">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-tight leading-none mb-0.5">Parent Campus</p>
                  <p className="text-sm font-medium text-[#0f172a]">
                    {campuses.find(c => c._id === selectedDep.campusId)?.name || "Unknown"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Leadership</h4>
              <div className="flex items-center space-x-3 p-3 bg-white border border-slate-100 rounded-xl">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-tight leading-none mb-0.5">Head of Department (HOD)</p>
                  <p className="text-sm font-medium text-[#0f172a] italic">
                    {selectedDep.head || "Not assigned"}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => {
                  setIsDetailsOpen(false);
                  openForm(selectedDep);
                }}
                className="w-full bg-white border border-slate-200 text-[#0f172a] py-3 rounded-xl font-medium shadow-sm hover:bg-slate-50 transition-colors flex items-center justify-center space-x-2"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit Department</span>
              </button>
            </div>
          </div>
        )}
      </SlideOver>


      <SlideOver
        isOpen={isSlideOpen}
        onClose={() => setIsSlideOpen(false)}
        title={editingId ? "Edit Department" : "Create Department"}
      >
        <form onSubmit={handleSave} className="space-y-5 pb-10">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">General Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <InputItem label="Dept. Code" name="code" value={formData.code} onChange={handleChange} required placeholder="e.g. CS" />
              <InputItem label="Status" name="status" type="select" options={["Active", "Inactive"]} value={formData.status} onChange={handleChange} />
            </div>
            <InputItem
              label="Parent Campus"
              name="campusId"
              type="select"
              options={campuses.map(c => ({ label: c.name, value: c._id }))}
              value={formData.campusId}
              onChange={handleChange}
              required
            />
            <InputItem label="Department Name" name="name" value={formData.name} onChange={handleChange} required placeholder="Computer Science..." />
          </div>

          <div className="space-y-4 pt-4 text-left">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Leadership</h4>
            <InputItem label="Head of Department" name="head" value={formData.head} onChange={handleChange} placeholder="Dr. John Doe" />
          </div>

          <div className="sticky bottom-0 bg-white pt-4 pb-2">
            <button type="submit" className="w-full bg-[#1e3a8a] text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-900/10 hover:bg-[#172554] active:scale-[0.98] transition-all">
              {editingId ? "Update Department" : "Create Department"}
            </button>
          </div>
        </form>
      </SlideOver>
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
