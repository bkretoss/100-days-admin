import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import type { AuthUser } from "../../types";

const DashboardPage = lazy(() => import("../../pages/DashboardPage"));
const UsersPage = lazy(() => import("../../pages/UsersPage"));
const UserDetail = lazy(() => import("../../pages/UserDetailPage"));
const CouponsPage = lazy(() => import("../../pages/CouponsPage"));
const SubscriptionsPage = lazy(() => import("../../pages/SubscriptionsPage"));

interface AppLayoutProps {
  user: AuthUser;
  onLogout: () => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ user, onLogout }) => (
  <div className="flex h-screen overflow-hidden bg-dark-900 text-white">
    <Sidebar user={user} onLogout={onLogout} />
    <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
      <Header user={user} />
      <div className="flex-1 overflow-y-auto p-8">
        <Suspense fallback={<div className="text-gray-500 text-sm">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/users/:id" element={<UserDetail />} />
            <Route path="/coupons" element={<CouponsPage />} />
            <Route path="/subscriptions" element={<SubscriptionsPage />} />
          </Routes>
        </Suspense>
      </div>
    </main>
  </div>
);

export default AppLayout;
