import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "../lib/authStorage";

/**
 * Renders child routes only when an admin auth token exists in localStorage.
 */
const ProtectedRoute = () => {
  const token = getToken();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
