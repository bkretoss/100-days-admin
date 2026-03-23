/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import type { AuthUser } from "./types";
import { clearAuth, getStoredUser } from "./lib/authStorage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());
  const navigate = useNavigate();

  const handleLogin = (userData: AuthUser) => {
    setUser(userData);
  };

  const handleLogout = () => {
    clearAuth();
    setUser(null);
    navigate("/login");
    toast.success("You have logged out successfully.");
  };

  return (
    <>
      <Toaster position="top-right" richColors theme="dark" />
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route element={<ProtectedRoute />}>
          <Route
            path="/*"
            element={
              user ? (
                <AppLayout user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
