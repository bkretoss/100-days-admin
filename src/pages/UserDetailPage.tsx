import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { ChevronLeft, CreditCard, Receipt, BarChart3, Trophy, Calendar } from "lucide-react";
import { cn, formatDate } from "../lib/utils";
import { USERS, SUBSCRIPTIONS } from "../data/mockData";
import { fetchAdminUserById, type AdminUserDetail } from "../services/usersApi";

const UserDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [detail, setDetail] = useState<AdminUserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [imgFailed, setImgFailed] = useState(false);

  const numericId = id !== undefined ? Number(id) : NaN;
  const mockUser = id !== undefined && !Number.isNaN(numericId) ? USERS.find((u) => u.id === numericId) : undefined;

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setLoadError("Missing user id");
      setDetail(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    setImgFailed(false);
    fetchAdminUserById(id)
      .then((data) => {
        if (!cancelled) setDetail(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setDetail(null);
          setLoadError(err instanceof Error ? err.message : "Failed to load user");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    setImgFailed(false);
  }, [detail?.profileImageUrl]);

  const user = mockUser;
  const userSubscriptions = user ? SUBSCRIPTIONS.filter((sub) => sub.userId === user.id) : [];
  const activeSubscription = userSubscriptions.find((sub) => sub.status === "Active") || userSubscriptions[0];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[240px]">
        <p className="text-gray-500 font-medium">Loading user…</p>
      </div>
    );
  }

  if (loadError || !detail) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-gray-500 font-medium">{loadError ?? "User not found"}</p>
          <button
            onClick={() => navigate("/users")}
            className="mt-4 px-4 py-2 bg-electric-blue text-dark-900 rounded-xl font-bold hover:opacity-90 transition-all"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  const displayName = detail.displayName || "User";
  const initials = displayName.trim()
    ? displayName
        .split(/\s+/)
        .filter(Boolean)
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";
  const remoteUrl = detail.profileImageUrl?.trim();
  const showRemote = Boolean(remoteUrl) && !imgFailed;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <button
        onClick={() => navigate("/users")}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to Users</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="glass-card p-8 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-electric-blue to-electric-purple" />
            <div className="size-24 rounded-full bg-dark-800 border-4 border-white/5 flex items-center justify-center text-3xl font-black text-white mb-4 shadow-2xl shadow-electric-blue/10 overflow-hidden">
              {showRemote ? (
                <img
                  src={remoteUrl!}
                  alt={displayName}
                  className="w-full h-full object-cover"
                  onError={() => setImgFailed(true)}
                />
              ) : remoteUrl && imgFailed ? (
                <span className="text-2xl leading-none">{initials}</span>
              ) : (
                <span className="text-2xl leading-none">{displayName[0].toUpperCase()}</span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">{displayName}</h2>
            <p className="text-gray-500 text-sm mt-1">{detail.email}</p>
            {/* <div className="flex items-center gap-2 mt-4">
              <span className="px-3 py-1 bg-electric-purple/10 text-electric-purple text-[10px] font-black tracking-widest rounded-lg border border-electric-purple/20 uppercase">{user?.plan ?? "—"}</span>
            </div> */}
          </div>

          {/* Subscription Details */}
          <div className="glass-card p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-electric-purple/10 flex items-center justify-center text-electric-purple">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Current Subscription</h3>
                <p className="text-xs text-gray-500">Active Plan Details</p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                {
                  label: "Current Plan",
                  value: <span className="text-sm font-bold text-white">{user?.plan ?? "—"}</span>,
                },
                {
                  label: "Start Date",
                  value: (
                    <span className="text-sm font-bold text-white">{user ? formatDate(user.startDate) : "—"}</span>
                  ),
                },
                {
                  label: "End Date",
                  value: <span className="text-sm font-bold text-white">{user ? formatDate(user.endDate) : "—"}</span>,
                },
              ].map(({ label, value }, i, arr) => (
                <div
                  key={label}
                  className={cn(
                    "flex justify-between items-center py-3",
                    i < arr.length - 1 && "border-b border-white/5",
                  )}
                >
                  <span className="text-sm text-gray-400">{label}</span>
                  {value}
                </div>
              ))}
              {activeSubscription && (
                <div className="flex justify-between items-center py-3 border-t border-white/5">
                  <span className="text-sm text-gray-400">Device Type</span>
                  <span
                    className={cn(
                      "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest border",
                      activeSubscription.device_type === "ios"
                        ? "bg-electric-blue/10 text-electric-blue border-electric-blue/20"
                        : "bg-green-500/10 text-green-400 border-green-500/20",
                    )}
                  >
                    {activeSubscription.device_type === "ios" ? "iOS" : "Android"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* Profile Details */}
          <div className="glass-card p-8">
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white tracking-tight">Profile Details</h3>
              <p className="text-gray-500 text-xs mt-1">User information and settings</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: BarChart3, label: "Job Title", value: detail.jobTitle || "Not specified" },
                { icon: Trophy, label: "Industry", value: detail.industry || "Not specified" },
                { icon: Calendar, label: "Geographic Scope", value: detail.geoScope || "Not specified" },
                { icon: BarChart3, label: "Company Type", value: detail.companyType || "Not specified" },
                { icon: Calendar, label: "Location", value: detail.location || "Not specified" },
                { icon: Calendar, label: "Start Date", value: detail.startDate ? formatDate(detail.startDate) : "—" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subscription History */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 rounded-xl bg-electric-blue/10 flex items-center justify-center text-electric-blue">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Subscription History</h3>
                <p className="text-xs text-gray-500">All subscriptions for this user</p>
              </div>
            </div>
            {userSubscriptions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 text-gray-400 text-[10px] uppercase tracking-wider font-bold">
                      {["Plan", "Status", "Start Date", "End Date", "Device Type"].map((h) => (
                        <th key={h} className="px-4 py-3">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {userSubscriptions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black tracking-widest border",
                              sub.plan === "Yearly"
                                ? "bg-electric-blue/10 text-electric-blue border-electric-blue/20"
                                : "bg-green-500/10 text-green-400 border-green-500/20",
                            )}
                          >
                            {sub.plan}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                              sub.status === "Active"
                                ? "bg-green-500/10 text-green-400 border-green-500/20"
                                : "bg-red-500/10 text-red-400 border-red-500/20",
                            )}
                          >
                            {sub.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-300 font-medium">{formatDate(sub.startDate)}</td>
                        <td className="px-4 py-3 text-xs text-gray-300 font-medium">{formatDate(sub.endDate)}</td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold tracking-widest border",
                              sub.device_type === "ios"
                                ? "bg-electric-blue/10 text-electric-blue border-electric-blue/20"
                                : "bg-green-500/10 text-green-400 border-green-500/20",
                            )}
                          >
                            {sub.device_type === "ios" ? "iOS" : "Android"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <Receipt className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 text-sm font-medium">No subscription history found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserDetail;
