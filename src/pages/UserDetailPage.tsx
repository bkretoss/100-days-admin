import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { ChevronLeft, CreditCard, Tag, Receipt, BarChart3, Trophy, Calendar } from "lucide-react";
import { cn, formatDate } from "../lib/utils";
import { USERS, SUBSCRIPTIONS } from "../data/mockData";

const UserDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = USERS.find((u) => u.id === parseInt(id || "0"));

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-gray-500 font-medium">User not found</p>
          <button onClick={() => navigate("/users")} className="mt-4 px-4 py-2 bg-electric-blue text-dark-900 rounded-xl font-bold hover:opacity-90 transition-all">
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  const userSubscriptions = SUBSCRIPTIONS.filter((sub) => sub.userId === user.id);
  const activeSubscription = userSubscriptions.find((sub) => sub.status === "Active") || userSubscriptions[0];

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      <button onClick={() => navigate("/users")} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to Users</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="glass-card p-8 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-electric-blue to-electric-purple" />
            <div className="size-24 rounded-full bg-dark-800 border-4 border-white/5 flex items-center justify-center text-3xl font-black text-white mb-4 shadow-2xl shadow-electric-blue/10 overflow-hidden">
              {user.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : user.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">{user.name}</h2>
            <p className="text-gray-500 text-sm mt-1">{user.email}</p>
            <div className="flex items-center gap-2 mt-4">
              <span className="px-3 py-1 bg-electric-purple/10 text-electric-purple text-[10px] font-black tracking-widest rounded-lg border border-electric-purple/20 uppercase">{user.plan}</span>
            </div>
          </div>

          {/* Subscription Details */}
          <div className="glass-card p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-electric-purple/10 flex items-center justify-center text-electric-purple"><CreditCard className="w-5 h-5" /></div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Current Subscription</h3>
                <p className="text-xs text-gray-500">Active Plan Details</p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { label: "Current Plan", value: <span className="text-sm font-bold text-white">{user.plan}</span> },
                {
                  label: "Coupon Used", value: user.couponUsed ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-electric-purple/10 text-electric-purple border border-electric-purple/20">
                      <Tag className="w-3 h-3" />{user.couponUsed}
                    </span>
                  ) : <span className="text-sm text-gray-500">Not Used</span>
                },
                { label: "Start Date", value: <span className="text-sm font-bold text-white">{formatDate(user.startDate)}</span> },
                { label: "End Date", value: <span className="text-sm font-bold text-white">{formatDate(user.endDate)}</span> },
              ].map(({ label, value }, i, arr) => (
                <div key={label} className={cn("flex justify-between items-center py-3", i < arr.length - 1 && "border-b border-white/5")}>
                  <span className="text-sm text-gray-400">{label}</span>
                  {value}
                </div>
              ))}
              {user.couponUsed && activeSubscription && (
                <div className="flex justify-between items-center py-3 border-t border-white/5">
                  <span className="text-sm text-gray-400">Device Type</span>
                  <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest border", activeSubscription.device_type === "ios" ? "bg-electric-blue/10 text-electric-blue border-electric-blue/20" : "bg-green-500/10 text-green-400 border-green-500/20")}>
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
                { icon: BarChart3, label: "Job Title", value: user.challenge || "Not specified" },
                { icon: Trophy, label: "Industry", value: "Technology" },
                { icon: Calendar, label: "Geographic Scope", value: "Country" },
                { icon: BarChart3, label: "Company Type", value: "Public Company" },
                { icon: Calendar, label: "Location", value: "New York" },
                { icon: Calendar, label: "Start Date", value: formatDate(user.startDate) },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
                    <Icon className="w-4 h-4" /><span>{label}</span>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm">{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Subscription History */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 rounded-xl bg-electric-blue/10 flex items-center justify-center text-electric-blue"><Receipt className="w-5 h-5" /></div>
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
                      {["Plan", "Status", "Start Date", "End Date", "Coupon", "Device Type"].map((h) => <th key={h} className="px-4 py-3">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {userSubscriptions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-3">
                          <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black tracking-widest border", sub.plan === "Yearly" ? "bg-electric-blue/10 text-electric-blue border-electric-blue/20" : "bg-green-500/10 text-green-400 border-green-500/20")}>{sub.plan}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border", sub.status === "Active" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20")}>{sub.status}</span>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-300 font-medium">{formatDate(sub.startDate)}</td>
                        <td className="px-4 py-3 text-xs text-gray-300 font-medium">{formatDate(sub.endDate)}</td>
                        <td className="px-4 py-3">
                          {sub.couponCode ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-electric-purple/10 text-electric-purple border border-electric-purple/20">
                              <Tag className="w-2.5 h-2.5" />{sub.couponCode}
                            </span>
                          ) : <span className="text-[10px] text-gray-500 font-medium">None</span>}
                        </td>
                        <td className="px-4 py-3">
                          {sub.couponCode ? (
                            <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold tracking-widest border", sub.device_type === "ios" ? "bg-electric-blue/10 text-electric-blue border-electric-blue/20" : "bg-green-500/10 text-green-400 border-green-500/20")}>
                              {sub.device_type === "ios" ? "iOS" : "Android"}
                            </span>
                          ) : <span className="text-[10px] text-gray-500 font-medium">-</span>}
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

export default UserDetailPage;
