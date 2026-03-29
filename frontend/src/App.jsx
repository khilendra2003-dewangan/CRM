import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import Login from "./pages/Login";

// Admin Imports
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./pages/admin/AdminLayout";
import ManageInstitutes from "./pages/admin/ManageInstitutes";
import ManageCampuses from "./pages/admin/ManageCampuses";
import ManageDepartments from "./pages/admin/ManageDepartments";
import ManagePrograms from "./pages/admin/ManagePrograms";

// Officer Imports
import OfficerRoute from "./components/OfficerRoute";
import OfficerLayout from "./pages/officer/OfficerLayout";
import OfficerDashboard from "./pages/officer/OfficerDashboard";
import ManageApplicants from "./pages/officer/ManageApplicants";
import Admissions from "./pages/officer/Admissions";

// Management Imports
import ManagementRoute from "./components/ManagementRoute";
import ManagementLayout from "./pages/management/ManagementLayout";
import ManagementDashboard from "./pages/management/ManagementDashboard";

import "./App.css";
import "./index.css";

// A small component to represent the Landing Page
function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-50 font-sans text-slate-800 selection:bg-[#1e3a8a]/20 selection:text-[#1e3a8a]">
      <Navbar />
      <main>
        <Hero />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={
        <div className="min-h-screen bg-surface-50 font-sans text-slate-800 selection:bg-[#1e3a8a]/20 selection:text-[#1e3a8a]">
          <Navbar />
          <Login />
        </div>
      } />
      
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/institutes" replace />} />
          <Route path="institutes" element={<ManageInstitutes />} />
          <Route path="campuses" element={<ManageCampuses />} />
          <Route path="departments" element={<ManageDepartments />} />
          <Route path="programs" element={<ManagePrograms />} />
        </Route>
      </Route>

      {/* Protected Officer Routes */}
      <Route element={<OfficerRoute />}>
        <Route path="/officer" element={<OfficerLayout />}>
          <Route index element={<Navigate to="/officer/dashboard" replace />} />
          <Route path="dashboard" element={<OfficerDashboard />} />
          <Route path="applicants" element={<ManageApplicants />} />
          <Route path="admissions" element={<Admissions />} />
        </Route>
      </Route>

      {/* Protected Management Routes */}
      <Route element={<ManagementRoute />}>
        <Route path="/management" element={<ManagementLayout />}>
          <Route index element={<Navigate to="/management/dashboard" replace />} />
          <Route path="dashboard" element={<ManagementDashboard />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
