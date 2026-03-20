/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { COUPONS } from "./data/mockData";
import type { AuthUser } from "./types";
import LoginPage from "./pages/LoginPage";
import AppLayout from "./components/layout/AppLayout";

function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [coupons] = useState(COUPONS);
  const navigate = useNavigate();

  const handleLogin = (userData: AuthUser) => {
    setUser(userData);
    navigate("/dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    navigate("/login");
    toast.success("You have logged out successfully.");
  };

  return (
    <>
      <Toaster position="top-right" richColors theme="dark" />
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route
          path="/*"
          element={
            !user ? (
              <Navigate to="/login" replace />
            ) : (
              <AppLayout user={user} onLogout={handleLogout} couponsCount={coupons.length} />
            )
          }
        />
      </Routes>
    </>
  );
}

export default App;
