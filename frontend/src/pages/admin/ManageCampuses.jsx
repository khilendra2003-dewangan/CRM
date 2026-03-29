import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Eye, Globe, Phone, Mail, MapPin, Building, Building2 } from "lucide-react";
import SlideOver from "../../components/SlideOver";
import axiosInstance from "../../api/axiosInstance";

export default function ManageCampuses() {
  const [campuses, setCampuses] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isSlideOpen, setIsSlideOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedCamp, setSelectedCamp] = useState(null);

  const initialFormState = {
    name: "", institutionId: "", code: "", address: "", city: "",
    state: "", zip: "", country: "", phone: "", email: "",
    website: "", logo: "", status: "Active"
  };
  const [formData, setFormData] = useState(initialFormState);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [campRes, instRes] = await Promise.all([
        axiosInstance.get("/getAllCampuses"),
        axiosInstance.get("/getAllInstitutes")
      ]);

      setCampuses(campRes.data);
      setInstitutes(instRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openForm = (campus = null) => {
    if (campus) {
      setEditingId(campus._id);
      setFormData({
        ...initialFormState,
        ...campus
      });
    } else {
      setEditingId(null);
      setFormData({ ...initialFormState, institutionId: institutes.length > 0 ? institutes[0]._id : "" });
    }
    setIsSlideOpen(true);
  };

  const openDetails = (campus) => {
    setSelectedCamp(campus);
    setIsDetailsOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axiosInstance.put(`/updateCampus/${editingId}`, formData);
      } else {
        await axiosInstance.post("/createCampus", formData);
      }
      setIsSlideOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this campus?")) return;
    try {
      await axiosInstance.delete(`/deleteCampus/${id}`);
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
          <h2 className="text-xl font-semibold text-[#0f172a] font-serif">Campuses</h2>
          <p className="text-sm text-slate-500 mt-1">Manage physical locations operating under Institutes.</p>
        </div>
        <button
          onClick={() => openForm()}
          className="bg-[#1e3a8a] hover:bg-[#172554] text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center space-x-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Campus</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-[#f1f5f9] text-[#0f172a] font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Code</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Parent Institute</th>
              <th className="px-6 py-4">City</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="5" className="text-center py-8 text-slate-400">Loading campuses...</td></tr>
            ) : campuses.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-8 text-slate-400">No campuses found.</td></tr>
            ) : (
              campuses.map((camp) => {
                const parentInst = institutes.find(i => i._id === camp.institutionId);
                return (
                  <tr key={camp._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 font-semibold text-[#1e3a8a]">{camp.code}</td>
                    <td className="px-6 py-4 font-medium text-[#0f172a]">{camp.name}</td>
                    <td className="px-6 py-4 flex items-center space-x-2 text-slate-500">
                      <Building className="w-4 h-4 text-slate-400" />
                      <span className="truncate max-w-[150px]">{parentInst ? parentInst.name : "Unknown"}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{camp.city}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openDetails(camp)}
                          title="View Details"
                          className="p-2 text-slate-400 hover:text-[#1e3a8a] hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openForm(camp)}
                          title="Edit"
                          className="p-2 text-slate-400 hover:text-[#eab308] hover:bg-amber-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(camp._id)}
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
        title="Campus Details"
      >
        {selectedCamp && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-start space-x-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-16 h-16 bg-[#1e3a8a]/10 rounded-xl flex items-center justify-center text-[#1e3a8a] border border-[#1e3a8a]/20">
                {selectedCamp.logo ? (
                  <img src={selectedCamp.logo} alt="Logo" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <MapPin className="w-8 h-8" />
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <h3 className="text-lg font-bold text-[#0f172a] leading-tight mb-1 truncate">{selectedCamp.name}</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#1e3a8a]/10 text-[#1e3a8a]">
                    Code: {selectedCamp.code}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedCamp.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                    {selectedCamp.status || 'Active'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Organization</h4>
              <div className="flex items-center space-x-3 p-3 bg-white border border-slate-100 rounded-xl">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-tight leading-none mb-0.5">Parent Institute</p>
                  <p className="text-sm font-medium text-[#0f172a]">
                    {institutes.find(i => i._id === selectedCamp.institutionId)?.name || "Unknown"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Contact Information</h4>
              <div className="grid grid-cols-1 gap-3">
                <DetailItem icon={Mail} label="Email Address" value={selectedCamp.email} />
                <DetailItem icon={Phone} label="Phone Number" value={selectedCamp.phone} />
                <DetailItem icon={Globe} label="Website" value={selectedCamp.website} isLink />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Location Details</h4>
              <div className="p-4 bg-white border border-slate-100 rounded-2xl space-y-3">
                <div className="flex items-start space-x-3 text-sm text-slate-600">
                  <MapPin className="w-4 h-4 mt-0.5 text-[#1e3a8a]" />
                  <div>
                    <p className="font-medium text-[#0f172a]">{selectedCamp.address}</p>
                    <p>{selectedCamp.city}, {selectedCamp.state} {selectedCamp.zip}</p>
                    <p className="text-xs text-slate-400 uppercase mt-1 font-bold tracking-tighter">{selectedCamp.country}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => {
                  setIsDetailsOpen(false);
                  openForm(selectedCamp);
                }}
                className="w-full bg-white border border-slate-200 text-[#0f172a] py-3 rounded-xl font-medium shadow-sm hover:bg-slate-50 transition-colors flex items-center justify-center space-x-2"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit Campus</span>
              </button>
            </div>
          </div>
        )}
      </SlideOver>

      <SlideOver
        isOpen={isSlideOpen}
        onClose={() => setIsSlideOpen(false)}
        title={editingId ? "Edit Campus" : "Create Campus"}
      >
        <form onSubmit={handleSave} className="space-y-5 pb-10">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">General Info</h4>
            <div className="grid grid-cols-2 gap-4">
              <InputItem label="Campus Code" name="code" value={formData.code} onChange={handleChange} required placeholder="e.g. CMP01" />
              <InputItem label="Status" name="status" type="select" options={["Active", "Inactive"]} value={formData.status} onChange={handleChange} />
            </div>
            <InputItem
              label="Parent Institute"
              name="institutionId"
              type="select"
              options={institutes.map(i => ({ label: i.name, value: i._id }))}
              value={formData.institutionId}
              onChange={handleChange}
              required
            />
            <InputItem label="Campus Name" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter campus name" />
            <InputItem label="Website (optional)" name="website" value={formData.website} onChange={handleChange} placeholder="https://..." />
            <InputItem label="Logo URL (optional)" name="logo" value={formData.logo} onChange={handleChange} placeholder="https://path-to-image.png" />
          </div>

          <div className="space-y-4 pt-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Contact Details</h4>
            <InputItem label="Email Address" name="email" value={formData.email} onChange={handleChange} type="email" required />
            <InputItem label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>

          <div className="space-y-4 pt-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Location</h4>
            <InputItem label="Address" name="address" value={formData.address} onChange={handleChange} required placeholder="Street address" />
            <div className="grid grid-cols-2 gap-4">
              <InputItem label="City" name="city" value={formData.city} onChange={handleChange} required />
              <InputItem label="State" name="state" value={formData.state} onChange={handleChange} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputItem label="ZIP Code" name="zip" value={formData.zip} onChange={handleChange} />
              <InputItem label="Country" name="country" value={formData.country} onChange={handleChange} required />
            </div>
          </div>

          <div className="sticky bottom-0 bg-white pt-4 pb-2">
            <button type="submit" className="w-full bg-[#1e3a8a] text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-900/10 hover:bg-[#172554] active:scale-[0.98] transition-all">
              {editingId ? "Update Campus" : "Create Campus"}
            </button>
          </div>
        </form>
      </SlideOver>
    </div>
  );
}


function DetailItem({ icon: Icon, label, value, isLink = false }) {
  if (!value) return null;
  return (
    <div className="flex items-center space-x-3 p-3 bg-white border border-slate-100 rounded-xl">
      <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
        <Icon className="w-4 h-4" />
      </div>
      <div className="overflow-hidden">
        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-tight leading-none mb-0.5">{label}</p>
        {isLink ? (
          <a href={value} target="_blank" rel="noreferrer" className="text-sm font-medium text-[#1e3a8a] truncate block hover:underline">
            {value.replace(/^https?:\/\//, '')}
          </a>
        ) : (
          <p className="text-sm font-medium text-[#0f172a] truncate">{value}</p>
        )}
      </div>
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
