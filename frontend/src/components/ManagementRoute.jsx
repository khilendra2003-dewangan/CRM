import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ManagementRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e3a8a]"></div>
      </div>
    );
  }

  return user && user.role === "Management" ? <Outlet /> : <Navigate to="/" />;
};

export default ManagementRoute;
